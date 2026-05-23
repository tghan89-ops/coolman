import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

// Shibuya page V2 redesign schema additions.
//
// shibuya_machines  — 6 new spec columns (voltage, max_depth, feed_system,
//                    hole_runout, bit_pairing, stock_note).
// shibuya_page      — new flat columns for hero badge-since, headline emphasis,
//                    machineStory group, serviceSection flat fields, cta body +
//                    eyebrow. New array tables for trustBar.stats,
//                    serviceSection.stats/photos/servicePoints.
// settings          — demo_request_email for admin-editable demo form recipient.
// _settings_v       — matching version column.
//
// Everything uses IF NOT EXISTS so this is safe on dev databases that already
// had push:true applied.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`

    -- ── shibuya_machines collection: 6 new spec fields ─────────────────────────
    ALTER TABLE "shibuya_machines" ADD COLUMN IF NOT EXISTS "voltage"      varchar;
    ALTER TABLE "shibuya_machines" ADD COLUMN IF NOT EXISTS "max_depth"    varchar;
    ALTER TABLE "shibuya_machines" ADD COLUMN IF NOT EXISTS "feed_system"  varchar;
    ALTER TABLE "shibuya_machines" ADD COLUMN IF NOT EXISTS "hole_runout"  varchar;
    ALTER TABLE "shibuya_machines" ADD COLUMN IF NOT EXISTS "bit_pairing"  varchar;
    ALTER TABLE "shibuya_machines" ADD COLUMN IF NOT EXISTS "stock_note"   varchar;

    -- ── shibuya_page: hero group new fields ─────────────────────────────────────
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "hero_badge_since"            varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "hero_headline_emphasis"      varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "hero_headline_emphasis_b_m"  varchar;

    -- ── shibuya_page: machineStory group (all new) ───────────────────────────────
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_eyebrow"       varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_eyebrow_b_m"   varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_headline"      varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_headline_b_m"  varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_intro"         varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_intro_b_m"     varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_col1_tag"      varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_col1_tag_b_m"  varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_col1_title"    varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_col1_title_b_m" varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_col1_body"     varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_col1_body_b_m" varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_col1_country"  varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_col2_tag"      varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_col2_tag_b_m"  varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_col2_title"    varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_col2_title_b_m" varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_col2_body"     varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_col2_body_b_m" varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_col2_country"  varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_site_photo_id" integer;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "machine_story_site_photo_alt" varchar;

    -- ── shibuya_page: serviceSection flat fields (all new) ──────────────────────
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "service_section_eyebrow"      varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "service_section_eyebrow_b_m"  varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "service_section_headline"     varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "service_section_headline_b_m" varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "service_section_body"         varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "service_section_body_b_m"     varchar;

    -- ── shibuya_page: cta group new fields ──────────────────────────────────────
    -- cta_headline + cta_headline_b_m already exist from 20260516_143030.
    -- cta_body replaces the old cta_subheadline semantically; both can coexist.
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "cta_eyebrow"     varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "cta_eyebrow_b_m" varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "cta_body"        varchar;
    ALTER TABLE "shibuya_page" ADD COLUMN IF NOT EXISTS "cta_body_b_m"    varchar;

    -- ── trustBar.stats array table ───────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS "shibuya_page_trust_bar_stats" (
      "_order"    integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"        varchar PRIMARY KEY NOT NULL,
      "number"    varchar NOT NULL,
      "label"     varchar NOT NULL,
      "label_b_m" varchar
    );

    -- ── serviceSection.stats array table ────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS "shibuya_page_service_section_stats" (
      "_order"    integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"        varchar PRIMARY KEY NOT NULL,
      "number"    varchar NOT NULL,
      "label"     varchar NOT NULL,
      "label_b_m" varchar
    );

    -- ── serviceSection.photos array table ────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS "shibuya_page_service_section_photos" (
      "_order"      integer NOT NULL,
      "_parent_id"  integer NOT NULL,
      "id"          varchar PRIMARY KEY NOT NULL,
      "photo_id"    integer,
      "caption"     varchar,
      "caption_b_m" varchar
    );

    -- ── serviceSection.servicePoints array table ─────────────────────────────────
    CREATE TABLE IF NOT EXISTS "shibuya_page_service_section_service_points" (
      "_order"    integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"        varchar PRIMARY KEY NOT NULL,
      "number"    varchar NOT NULL,
      "label"     varchar NOT NULL,
      "label_b_m" varchar,
      "title"     varchar NOT NULL,
      "title_b_m" varchar,
      "body"      varchar NOT NULL,
      "body_b_m"  varchar
    );

    -- ── FK constraints (EXCEPTION handler makes them idempotent) ─────────────────
    DO $$ BEGIN
      ALTER TABLE "shibuya_page" ADD CONSTRAINT "shibuya_page_machine_story_site_photo_id_media_id_fk"
        FOREIGN KEY ("machine_story_site_photo_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "shibuya_page_trust_bar_stats" ADD CONSTRAINT "shibuya_page_trust_bar_stats_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."shibuya_page"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "shibuya_page_service_section_stats" ADD CONSTRAINT "shibuya_page_service_section_stats_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."shibuya_page"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "shibuya_page_service_section_photos" ADD CONSTRAINT "shibuya_page_service_section_photos_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."shibuya_page"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "shibuya_page_service_section_photos" ADD CONSTRAINT "shibuya_page_service_section_photos_photo_id_media_id_fk"
        FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "shibuya_page_service_section_service_points" ADD CONSTRAINT "shibuya_page_service_section_service_points_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."shibuya_page"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- ── Indexes ───────────────────────────────────────────────────────────────────
    CREATE INDEX IF NOT EXISTS "shibuya_page_trust_bar_stats_order_idx"
      ON "shibuya_page_trust_bar_stats" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "shibuya_page_trust_bar_stats_parent_id_idx"
      ON "shibuya_page_trust_bar_stats" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "shibuya_page_service_section_stats_order_idx"
      ON "shibuya_page_service_section_stats" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "shibuya_page_service_section_stats_parent_id_idx"
      ON "shibuya_page_service_section_stats" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "shibuya_page_service_section_photos_order_idx"
      ON "shibuya_page_service_section_photos" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "shibuya_page_service_section_photos_parent_id_idx"
      ON "shibuya_page_service_section_photos" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "shibuya_page_service_section_service_points_order_idx"
      ON "shibuya_page_service_section_service_points" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "shibuya_page_service_section_service_points_parent_id_idx"
      ON "shibuya_page_service_section_service_points" USING btree ("_parent_id");

    -- ── settings: admin-editable demo request email ──────────────────────────────
    ALTER TABLE "settings"   ADD COLUMN IF NOT EXISTS "demo_request_email" varchar;
    ALTER TABLE "_settings_v" ADD COLUMN IF NOT EXISTS "version_demo_request_email" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "shibuya_machines" DROP COLUMN IF EXISTS "voltage";
    ALTER TABLE "shibuya_machines" DROP COLUMN IF EXISTS "max_depth";
    ALTER TABLE "shibuya_machines" DROP COLUMN IF EXISTS "feed_system";
    ALTER TABLE "shibuya_machines" DROP COLUMN IF EXISTS "hole_runout";
    ALTER TABLE "shibuya_machines" DROP COLUMN IF EXISTS "bit_pairing";
    ALTER TABLE "shibuya_machines" DROP COLUMN IF EXISTS "stock_note";

    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "hero_badge_since";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "hero_headline_emphasis";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "hero_headline_emphasis_b_m";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_eyebrow";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_eyebrow_b_m";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_headline";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_headline_b_m";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_intro";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_intro_b_m";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_col1_tag";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_col1_tag_b_m";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_col1_title";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_col1_title_b_m";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_col1_body";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_col1_body_b_m";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_col1_country";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_col2_tag";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_col2_tag_b_m";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_col2_title";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_col2_title_b_m";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_col2_body";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_col2_body_b_m";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_col2_country";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_site_photo_id";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "machine_story_site_photo_alt";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "service_section_eyebrow";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "service_section_eyebrow_b_m";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "service_section_headline";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "service_section_headline_b_m";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "service_section_body";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "service_section_body_b_m";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "cta_eyebrow";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "cta_eyebrow_b_m";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "cta_body";
    ALTER TABLE "shibuya_page" DROP COLUMN IF EXISTS "cta_body_b_m";

    DROP TABLE IF EXISTS "shibuya_page_trust_bar_stats" CASCADE;
    DROP TABLE IF EXISTS "shibuya_page_service_section_stats" CASCADE;
    DROP TABLE IF EXISTS "shibuya_page_service_section_photos" CASCADE;
    DROP TABLE IF EXISTS "shibuya_page_service_section_service_points" CASCADE;

    ALTER TABLE "settings"    DROP COLUMN IF EXISTS "demo_request_email";
    ALTER TABLE "_settings_v" DROP COLUMN IF EXISTS "version_demo_request_email";
  `)
}
