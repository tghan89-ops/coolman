import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_why_coolman_page_advantages_icon_key" AS ENUM('zap', 'shield', 'clock', 'users', 'award', 'truck', 'headphones', 'barChart3');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE TABLE IF NOT EXISTS "why_coolman_page_advantages" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "icon_key" "enum_why_coolman_page_advantages_icon_key" DEFAULT 'zap' NOT NULL,
      "title" varchar NOT NULL,
      "body" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "why_coolman_page_stats" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "value" varchar NOT NULL,
      "label" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "why_coolman_page_testimonials" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "quote" varchar NOT NULL,
      "author" varchar NOT NULL,
      "role" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "why_coolman_page" (
      "id" serial PRIMARY KEY NOT NULL,
      "hero_eyebrow" varchar DEFAULT 'Why Coolman',
      "hero_title" varchar DEFAULT 'The Coolman Advantage',
      "hero_lede" varchar DEFAULT 'More than just tools - we provide complete cutting solutions and ongoing partnership for contractors who demand excellence.',
      "stats_section_title" varchar DEFAULT 'Trusted by Professionals',
      "stats_section_subtitle" varchar DEFAULT 'Our track record speaks for itself. Join hundreds of contractors who rely on Coolman.',
      "testimonials_section_eyebrow" varchar DEFAULT 'Testimonials',
      "testimonials_section_title" varchar DEFAULT 'What Our Partners Say',
      "cta_title" varchar DEFAULT 'Ready to Experience the Difference?',
      "cta_body" varchar DEFAULT 'Join 500+ professional contractors who trust Coolman for their diamond cutting needs.',
      "cta_primary_label" varchar DEFAULT 'Become a Partner',
      "cta_primary_href" varchar DEFAULT '/auth/register',
      "cta_secondary_label" varchar DEFAULT 'Contact Sales',
      "cta_secondary_href" varchar DEFAULT '/contact',
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    ALTER TABLE "home_page" ALTER COLUMN "hero_secondary_cta_label" SET DEFAULT 'See applications';
    ALTER TABLE "shibuya_page" ALTER COLUMN "cta_primary_cta_label" SET DEFAULT 'Request a demo';

    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_url" varchar;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_width" numeric;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_height" numeric;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_mime_type" varchar;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_filesize" numeric;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_filename" varchar;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_url" varchar;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_width" numeric;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_height" numeric;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_mime_type" varchar;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_filesize" numeric;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_filename" varchar;

    DO $$ BEGIN
      ALTER TABLE "why_coolman_page_advantages" ADD CONSTRAINT "why_coolman_page_advantages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."why_coolman_page"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      ALTER TABLE "why_coolman_page_stats" ADD CONSTRAINT "why_coolman_page_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."why_coolman_page"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      ALTER TABLE "why_coolman_page_testimonials" ADD CONSTRAINT "why_coolman_page_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."why_coolman_page"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "why_coolman_page_advantages_order_idx" ON "why_coolman_page_advantages" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "why_coolman_page_advantages_parent_id_idx" ON "why_coolman_page_advantages" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "why_coolman_page_stats_order_idx" ON "why_coolman_page_stats" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "why_coolman_page_stats_parent_id_idx" ON "why_coolman_page_stats" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "why_coolman_page_testimonials_order_idx" ON "why_coolman_page_testimonials" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "why_coolman_page_testimonials_parent_id_idx" ON "why_coolman_page_testimonials" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
    CREATE INDEX IF NOT EXISTS "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "why_coolman_page_advantages" CASCADE;
    DROP TABLE IF EXISTS "why_coolman_page_stats" CASCADE;
    DROP TABLE IF EXISTS "why_coolman_page_testimonials" CASCADE;
    DROP TABLE IF EXISTS "why_coolman_page" CASCADE;
    DROP INDEX IF EXISTS "media_sizes_thumbnail_sizes_thumbnail_filename_idx";
    DROP INDEX IF EXISTS "media_sizes_card_sizes_card_filename_idx";
    ALTER TABLE "home_page" ALTER COLUMN "hero_secondary_cta_label" SET DEFAULT 'Watch Demo';
    ALTER TABLE "shibuya_page" ALTER COLUMN "cta_primary_cta_label" SET DEFAULT 'Schedule Demo';
    ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_thumbnail_url";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_thumbnail_width";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_thumbnail_height";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_thumbnail_mime_type";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_thumbnail_filesize";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_thumbnail_filename";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_card_url";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_card_width";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_card_height";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_card_mime_type";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_card_filesize";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_card_filename";
    DROP TYPE IF EXISTS "public"."enum_why_coolman_page_advantages_icon_key";
  `)
}
