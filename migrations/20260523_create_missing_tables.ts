import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

// shibuya_machines, shibuya_machines_features, and dealers were added while
// running Payload in dev mode (push:true). The schema was auto-synced locally
// but no migration file was written, so clean databases have no these tables.
// This migration creates them so shibuya_v2_redesign and add_locked_docs_rels
// can run cleanly on any database.
//
// shibuya_machines is created with ALL current columns (base + v2 redesign
// spec fields) so shibuya_v2_redesign's ALTER TABLE … ADD COLUMN IF NOT EXISTS
// statements become no-ops on databases that run this migration first.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "shibuya_machines" (
      "id"            serial PRIMARY KEY NOT NULL,
      "model_id"      varchar NOT NULL,
      "model_name"    varchar NOT NULL,
      "tagline"       varchar NOT NULL,
      "tagline_b_m"   varchar,
      "bond_match"    varchar,
      "bond_match_b_m" varchar,
      "description"   varchar NOT NULL,
      "description_b_m" varchar,
      "motor_power"   varchar,
      "max_diameter"  varchar,
      "weight"        varchar,
      "anchor"        varchar,
      "anchor_b_m"    varchar,
      "rpm_range"     varchar,
      "voltage"       varchar,
      "max_depth"     varchar,
      "feed_system"   varchar,
      "hole_runout"   varchar,
      "bit_pairing"   varchar,
      "stock_note"    varchar,
      "price"         varchar,
      "hero_image_id" integer,
      "display_order" numeric DEFAULT 100,
      "is_active"     boolean DEFAULT true,
      "updated_at"    timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at"    timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "shibuya_machines_features" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "feature"    varchar NOT NULL,
      "feature_b_m" varchar
    );

    CREATE TABLE IF NOT EXISTS "dealers" (
      "id"                 serial PRIMARY KEY NOT NULL,
      "name"               varchar NOT NULL,
      "area"               varchar NOT NULL,
      "address"            varchar NOT NULL,
      "whatsapp_number"    varchar NOT NULL,
      "google_maps_query"  varchar NOT NULL,
      "operating_hours"    varchar,
      "languages"          varchar,
      "specialisations"    varchar,
      "display_order"      numeric DEFAULT 100,
      "is_active"          boolean DEFAULT true,
      "updated_at"         timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at"         timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS "shibuya_machines_model_id_idx"
      ON "shibuya_machines" USING btree ("model_id");
    CREATE INDEX IF NOT EXISTS "shibuya_machines_updated_at_idx"
      ON "shibuya_machines" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "shibuya_machines_created_at_idx"
      ON "shibuya_machines" USING btree ("created_at");

    CREATE INDEX IF NOT EXISTS "shibuya_machines_features_order_idx"
      ON "shibuya_machines_features" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "shibuya_machines_features_parent_id_idx"
      ON "shibuya_machines_features" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "dealers_area_idx"
      ON "dealers" USING btree ("area");
    CREATE INDEX IF NOT EXISTS "dealers_updated_at_idx"
      ON "dealers" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "dealers_created_at_idx"
      ON "dealers" USING btree ("created_at");
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "shibuya_machines" ADD CONSTRAINT "shibuya_machines_hero_image_id_media_id_fk"
        FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "shibuya_machines_features" ADD CONSTRAINT "shibuya_machines_features_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."shibuya_machines"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)

  // The add_locked_docs_rels migration conditionally skipped these FK constraints
  // because shibuya_machines and dealers didn't exist yet. Add them now.
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_shibuya_machines_fk"
        FOREIGN KEY ("shibuya_machines_id") REFERENCES "public"."shibuya_machines"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_dealers_fk"
        FOREIGN KEY ("dealers_id") REFERENCES "public"."dealers"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_shibuya_machines_fk";
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_dealers_fk";
  `)

  await db.execute(sql`
    DROP TABLE IF EXISTS "shibuya_machines_features" CASCADE;
    DROP TABLE IF EXISTS "shibuya_machines" CASCADE;
    DROP TABLE IF EXISTS "dealers" CASCADE;
  `)
}
