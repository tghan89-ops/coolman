import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

// Puck visual editor data layer: the `Pages` collection (drafts/versions on) and
// the `Navigation` global (versioned). Fully additive — 8 enums, 7 tables
// (pages, _pages_v, navigation, navigation_items, _navigation_v,
// _navigation_v_version_items, posts_rels) plus the locked-documents wiring
// column pages_id. No existing table is altered except payload_locked_documents_rels,
// which gets one nullable column + FK + index. Idempotent guards throughout so a
// fresh-DB `payload migrate` reproduces it cleanly. Generated from the canonical
// Payload schema (dev-mode push into an empty DB), trimmed to the additive delta,
// and tested on a production clone before the prod schema was patched in place.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_status" AS ENUM ('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_template" AS ENUM ('landing', 'simple', 'campaign', 'blank');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM ('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_version_template" AS ENUM ('landing', 'simple', 'campaign', 'blank');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_navigation_items_type" AS ENUM ('link', 'mega-products');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_navigation_items_link_type" AS ENUM ('page', 'internal', 'external');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum__navigation_v_version_items_type" AS ENUM ('link', 'mega-products');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum__navigation_v_version_items_link_type" AS ENUM ('page', 'internal', 'external');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE TABLE IF NOT EXISTS "pages" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "status" "enum_pages_status" DEFAULT 'draft' NOT NULL,
      "template" "enum_pages_template" DEFAULT 'simple',
      "puck_data" jsonb,
      "seo_meta_title" varchar,
      "seo_meta_description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "_pages_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_title" varchar NOT NULL,
      "version_slug" varchar NOT NULL,
      "version_status" "enum__pages_v_version_status" DEFAULT 'draft' NOT NULL,
      "version_template" "enum__pages_v_version_template" DEFAULT 'simple',
      "version_puck_data" jsonb,
      "version_seo_meta_title" varchar,
      "version_seo_meta_description" varchar,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "navigation" (
      "id" serial PRIMARY KEY NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
    CREATE TABLE IF NOT EXISTS "navigation_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "type" "enum_navigation_items_type" DEFAULT 'link' NOT NULL,
      "label" varchar NOT NULL,
      "label_b_m" varchar,
      "link_type" "enum_navigation_items_link_type" DEFAULT 'page',
      "page_id" integer,
      "url" varchar,
      "new_tab" boolean DEFAULT false
    );
    CREATE TABLE IF NOT EXISTS "_navigation_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "_navigation_v_version_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "type" "enum__navigation_v_version_items_type" DEFAULT 'link' NOT NULL,
      "label" varchar NOT NULL,
      "label_b_m" varchar,
      "link_type" "enum__navigation_v_version_items_link_type" DEFAULT 'page',
      "page_id" integer,
      "url" varchar,
      "new_tab" boolean DEFAULT false,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "posts_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "products_id" integer
    );

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "pages_id" integer;

    DO $$ BEGIN
      ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      ALTER TABLE "_navigation_v_version_items" ADD CONSTRAINT "_navigation_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      ALTER TABLE "_navigation_v_version_items" ADD CONSTRAINT "_navigation_v_version_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "pages_created_at_idx" ON "pages" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
    CREATE INDEX IF NOT EXISTS "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "navigation_items_order_idx" ON "navigation_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "navigation_items_parent_id_idx" ON "navigation_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "navigation_items_page_idx" ON "navigation_items" USING btree ("page_id");
    CREATE INDEX IF NOT EXISTS "_navigation_v_created_at_idx" ON "_navigation_v" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "_navigation_v_updated_at_idx" ON "_navigation_v" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "_navigation_v_version_items_order_idx" ON "_navigation_v_version_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_navigation_v_version_items_parent_id_idx" ON "_navigation_v_version_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_navigation_v_version_items_page_idx" ON "_navigation_v_version_items" USING btree ("page_id");
    CREATE INDEX IF NOT EXISTS "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "posts_rels_products_id_idx" ON "posts_rels" USING btree ("products_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_pages_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_pages_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "pages_id";

    DROP TABLE IF EXISTS "_navigation_v_version_items" CASCADE;
    DROP TABLE IF EXISTS "_navigation_v" CASCADE;
    DROP TABLE IF EXISTS "navigation_items" CASCADE;
    DROP TABLE IF EXISTS "navigation" CASCADE;
    DROP TABLE IF EXISTS "_pages_v" CASCADE;
    DROP TABLE IF EXISTS "posts_rels" CASCADE;
    DROP TABLE IF EXISTS "pages" CASCADE;

    DROP TYPE IF EXISTS "public"."enum__navigation_v_version_items_link_type";
    DROP TYPE IF EXISTS "public"."enum__navigation_v_version_items_type";
    DROP TYPE IF EXISTS "public"."enum_navigation_items_link_type";
    DROP TYPE IF EXISTS "public"."enum_navigation_items_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_version_template";
    DROP TYPE IF EXISTS "public"."enum__pages_v_version_status";
    DROP TYPE IF EXISTS "public"."enum_pages_template";
    DROP TYPE IF EXISTS "public"."enum_pages_status";
  `)
}
