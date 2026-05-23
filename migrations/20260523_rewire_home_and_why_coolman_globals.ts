import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

// Both home-page and why-coolman-page globals had field structures that did not
// match the actual frontend pages they were supposed to control. This migration
// replaces those wrong schemas with the correct ones derived from copy.ts so
// that CMS edits actually appear on the website.
//
// why_coolman_page: drop old advantages/stats/testimonials tables + flat columns,
//   add folio01/02/03 group columns + paragraph array tables + closingCta columns.
//
// home_page: drop old stats/features/applicationList tables + hero/ctaSection
//   columns, add opening/fearGrid/threeMythsIntro/brotherhoodIntro/alansLetter/
//   quietDoor/conversation columns + three new array tables.
//
// Everything is idempotent (IF NOT EXISTS / IF EXISTS).

export async function up({ db }: MigrateUpArgs): Promise<void> {

  // ── WHY-COOLMAN-PAGE ───────────────────────────────────────────────────────

  // 1. Drop old array tables
  await db.execute(sql`
    DROP TABLE IF EXISTS "why_coolman_page_advantages" CASCADE;
    DROP TABLE IF EXISTS "why_coolman_page_stats" CASCADE;
    DROP TABLE IF EXISTS "why_coolman_page_testimonials" CASCADE;
  `)

  // 2. Drop old flat columns that no longer map to any field
  await db.execute(sql`
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "stats_section_title";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "stats_section_title_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "stats_section_subtitle";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "stats_section_subtitle_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "testimonials_section_eyebrow";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "testimonials_section_eyebrow_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "testimonials_section_title";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "testimonials_section_title_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "cta_title";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "cta_title_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "cta_body";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "cta_body_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "cta_primary_label";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "cta_primary_label_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "cta_primary_href";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "cta_secondary_label";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "cta_secondary_label_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "cta_secondary_href";
  `)

  // 3. Add new hero columns (hero_eyebrow/b_m/title/title_b_m/lede/lede_b_m already exist)
  await db.execute(sql`
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "hero_title_emphasis"     varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "hero_title_emphasis_b_m" varchar;

    -- folio01
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio01_folio_label"         varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio01_folio_label_b_m"      varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio01_category"             varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio01_category_b_m"         varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio01_title"               varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio01_title_b_m"            varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio01_title_emphasis"       varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio01_title_emphasis_b_m"   varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio01_summary"              varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio01_summary_b_m"          varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio01_meta_author"          varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio01_meta_subject"         varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio01_meta_subject_b_m"     varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio01_meta_read"            varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio01_meta_read_b_m"        varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio01_pullquote"            varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio01_pullquote_b_m"        varchar;

    -- folio02
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio02_folio_label"         varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio02_folio_label_b_m"      varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio02_category"             varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio02_category_b_m"         varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio02_title"               varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio02_title_b_m"            varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio02_title_emphasis"       varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio02_title_emphasis_b_m"   varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio02_summary"              varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio02_summary_b_m"          varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio02_meta_author"          varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio02_meta_subject"         varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio02_meta_subject_b_m"     varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio02_meta_read"            varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio02_meta_read_b_m"        varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio02_pullquote"            varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio02_pullquote_b_m"        varchar;

    -- folio03
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio03_folio_label"         varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio03_folio_label_b_m"      varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio03_category"             varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio03_category_b_m"         varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio03_title"               varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio03_title_b_m"            varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio03_title_emphasis"       varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio03_title_emphasis_b_m"   varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio03_summary"              varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio03_summary_b_m"          varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio03_meta_author"          varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio03_meta_subject"         varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio03_meta_subject_b_m"     varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio03_meta_read"            varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio03_meta_read_b_m"        varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio03_pullquote"            varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "folio03_pullquote_b_m"        varchar;

    -- closingCta
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "closing_cta_eyebrow"                    varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "closing_cta_eyebrow_b_m"                 varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "closing_cta_title"                       varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "closing_cta_title_b_m"                   varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "closing_cta_title_emphasis"              varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "closing_cta_title_emphasis_b_m"          varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "closing_cta_body"                        varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "closing_cta_body_b_m"                    varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "closing_cta_whatsapp_cta_label"          varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "closing_cta_whatsapp_cta_label_b_m"      varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "closing_cta_field_notes_cta_label"       varchar;
    ALTER TABLE "why_coolman_page" ADD COLUMN IF NOT EXISTS "closing_cta_field_notes_cta_label_b_m"   varchar;
  `)

  // 4. Create folio paragraph array tables
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "why_coolman_page_folio01_paragraphs" (
      "_order"       integer NOT NULL,
      "_parent_id"   integer NOT NULL,
      "id"           varchar PRIMARY KEY NOT NULL,
      "paragraph"    varchar NOT NULL,
      "paragraph_b_m" varchar
    );

    CREATE TABLE IF NOT EXISTS "why_coolman_page_folio02_paragraphs" (
      "_order"       integer NOT NULL,
      "_parent_id"   integer NOT NULL,
      "id"           varchar PRIMARY KEY NOT NULL,
      "paragraph"    varchar NOT NULL,
      "paragraph_b_m" varchar
    );

    CREATE TABLE IF NOT EXISTS "why_coolman_page_folio03_paragraphs" (
      "_order"       integer NOT NULL,
      "_parent_id"   integer NOT NULL,
      "id"           varchar PRIMARY KEY NOT NULL,
      "paragraph"    varchar NOT NULL,
      "paragraph_b_m" varchar
    );
  `)

  // 5. FK constraints for folio paragraph tables
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "why_coolman_page_folio01_paragraphs"
        ADD CONSTRAINT "why_coolman_page_folio01_paragraphs_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."why_coolman_page"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "why_coolman_page_folio02_paragraphs"
        ADD CONSTRAINT "why_coolman_page_folio02_paragraphs_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."why_coolman_page"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "why_coolman_page_folio03_paragraphs"
        ADD CONSTRAINT "why_coolman_page_folio03_paragraphs_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."why_coolman_page"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)

  // 6. Indexes for folio paragraph tables
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "why_coolman_page_folio01_paragraphs_order_idx"
      ON "why_coolman_page_folio01_paragraphs" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "why_coolman_page_folio01_paragraphs_parent_id_idx"
      ON "why_coolman_page_folio01_paragraphs" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "why_coolman_page_folio02_paragraphs_order_idx"
      ON "why_coolman_page_folio02_paragraphs" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "why_coolman_page_folio02_paragraphs_parent_id_idx"
      ON "why_coolman_page_folio02_paragraphs" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "why_coolman_page_folio03_paragraphs_order_idx"
      ON "why_coolman_page_folio03_paragraphs" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "why_coolman_page_folio03_paragraphs_parent_id_idx"
      ON "why_coolman_page_folio03_paragraphs" USING btree ("_parent_id");
  `)

  // ── HOME-PAGE ──────────────────────────────────────────────────────────────

  // 7. Drop old array tables
  await db.execute(sql`
    DROP TABLE IF EXISTS "home_page_stats" CASCADE;
    DROP TABLE IF EXISTS "home_page_features" CASCADE;
    DROP TABLE IF EXISTS "home_page_application_list" CASCADE;
  `)

  // 8. Drop old flat columns
  await db.execute(sql`
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "hero_badge";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "hero_badge_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "hero_headline_line1";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "hero_headline_line1_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "hero_headline_line2";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "hero_headline_line2_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "hero_headline_line3";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "hero_headline_line3_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "hero_subheadline";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "hero_subheadline_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "hero_primary_cta_label";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "hero_primary_cta_label_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "hero_secondary_cta_label";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "hero_secondary_cta_label_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "hero_hero_image_id";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "cta_section_headline";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "cta_section_headline_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "cta_section_subheadline";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "cta_section_subheadline_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "cta_section_primary_cta_label";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "cta_section_primary_cta_label_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "cta_section_secondary_cta_label";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "cta_section_secondary_cta_label_b_m";
  `)

  // 9. Add new flat columns matching the homeNarrative structure
  await db.execute(sql`
    -- opening
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "opening_eyebrow"             varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "opening_eyebrow_b_m"          varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "opening_headline_prefix"      varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "opening_headline_prefix_b_m"  varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "opening_headline_emphasis"    varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "opening_headline_emphasis_b_m" varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "opening_lede"                varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "opening_lede_b_m"             varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "opening_cta_primary"          varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "opening_cta_primary_b_m"      varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "opening_cta_secondary"        varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "opening_cta_secondary_b_m"    varchar;

    -- fearGrid
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "fear_grid_eyebrow"            varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "fear_grid_eyebrow_b_m"         varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "fear_grid_headline"            varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "fear_grid_headline_b_m"        varchar;

    -- threeMythsIntro
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "three_myths_intro_eyebrow"         varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "three_myths_intro_eyebrow_b_m"      varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "three_myths_intro_headline"         varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "three_myths_intro_headline_b_m"     varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "three_myths_intro_lede"             varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "three_myths_intro_lede_b_m"         varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "three_myths_intro_cta_label"        varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "three_myths_intro_cta_label_b_m"    varchar;

    -- brotherhoodIntro
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "brotherhood_intro_eyebrow"         varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "brotherhood_intro_eyebrow_b_m"      varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "brotherhood_intro_headline"         varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "brotherhood_intro_headline_b_m"     varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "brotherhood_intro_lede"             varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "brotherhood_intro_lede_b_m"         varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "brotherhood_intro_cta_label"        varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "brotherhood_intro_cta_label_b_m"    varchar;

    -- alansLetter
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "alans_letter_eyebrow"              varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "alans_letter_eyebrow_b_m"           varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "alans_letter_signature"             varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "alans_letter_signature_line2"       varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "alans_letter_signature_line2_b_m"   varchar;

    -- quietDoor
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "quiet_door_eyebrow"               varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "quiet_door_eyebrow_b_m"            varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "quiet_door_headline"               varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "quiet_door_headline_b_m"           varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "quiet_door_lede"                   varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "quiet_door_lede_b_m"               varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "quiet_door_cta_primary"            varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "quiet_door_cta_primary_b_m"        varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "quiet_door_cta_secondary"          varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "quiet_door_cta_secondary_b_m"      varchar;

    -- conversation
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "conversation_eyebrow"              varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "conversation_eyebrow_b_m"           varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "conversation_headline"              varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "conversation_headline_b_m"          varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "conversation_lede"                  varchar;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "conversation_lede_b_m"              varchar;
  `)

  // 10. Create new array tables
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "home_page_fear_grid_cards" (
      "_order"    integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"        varchar PRIMARY KEY NOT NULL,
      "key"       varchar NOT NULL,
      "title"     varchar NOT NULL,
      "title_b_m" varchar,
      "body"      varchar NOT NULL,
      "body_b_m"  varchar
    );

    CREATE TABLE IF NOT EXISTS "home_page_alans_letter_paragraphs" (
      "_order"       integer NOT NULL,
      "_parent_id"   integer NOT NULL,
      "id"           varchar PRIMARY KEY NOT NULL,
      "paragraph"    varchar NOT NULL,
      "paragraph_b_m" varchar
    );

    CREATE TABLE IF NOT EXISTS "home_page_conversation_channels" (
      "_order"        integer NOT NULL,
      "_parent_id"    integer NOT NULL,
      "id"            varchar PRIMARY KEY NOT NULL,
      "tag"           varchar NOT NULL,
      "tag_b_m"       varchar,
      "title"         varchar NOT NULL,
      "title_b_m"     varchar,
      "body"          varchar NOT NULL,
      "body_b_m"      varchar,
      "cta_label"     varchar NOT NULL,
      "cta_label_b_m" varchar
    );
  `)

  // 11. FK constraints for new home_page array tables
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "home_page_fear_grid_cards"
        ADD CONSTRAINT "home_page_fear_grid_cards_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "home_page_alans_letter_paragraphs"
        ADD CONSTRAINT "home_page_alans_letter_paragraphs_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "home_page_conversation_channels"
        ADD CONSTRAINT "home_page_conversation_channels_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)

  // 12. Indexes for new home_page array tables
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "home_page_fear_grid_cards_order_idx"
      ON "home_page_fear_grid_cards" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "home_page_fear_grid_cards_parent_id_idx"
      ON "home_page_fear_grid_cards" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "home_page_alans_letter_paragraphs_order_idx"
      ON "home_page_alans_letter_paragraphs" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "home_page_alans_letter_paragraphs_parent_id_idx"
      ON "home_page_alans_letter_paragraphs" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "home_page_conversation_channels_order_idx"
      ON "home_page_conversation_channels" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "home_page_conversation_channels_parent_id_idx"
      ON "home_page_conversation_channels" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // why_coolman_page: restore old array tables, drop new columns
  await db.execute(sql`
    DROP TABLE IF EXISTS "why_coolman_page_folio01_paragraphs" CASCADE;
    DROP TABLE IF EXISTS "why_coolman_page_folio02_paragraphs" CASCADE;
    DROP TABLE IF EXISTS "why_coolman_page_folio03_paragraphs" CASCADE;
  `)

  await db.execute(sql`
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "hero_title_emphasis";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "hero_title_emphasis_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio01_folio_label";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio01_folio_label_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio01_category";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio01_category_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio01_title";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio01_title_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio01_title_emphasis";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio01_title_emphasis_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio01_summary";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio01_summary_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio01_meta_author";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio01_meta_subject";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio01_meta_subject_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio01_meta_read";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio01_meta_read_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio01_pullquote";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio01_pullquote_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio02_folio_label";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio02_folio_label_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio02_category";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio02_category_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio02_title";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio02_title_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio02_title_emphasis";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio02_title_emphasis_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio02_summary";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio02_summary_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio02_meta_author";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio02_meta_subject";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio02_meta_subject_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio02_meta_read";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio02_meta_read_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio02_pullquote";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio02_pullquote_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio03_folio_label";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio03_folio_label_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio03_category";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio03_category_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio03_title";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio03_title_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio03_title_emphasis";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio03_title_emphasis_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio03_summary";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio03_summary_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio03_meta_author";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio03_meta_subject";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio03_meta_subject_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio03_meta_read";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio03_meta_read_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio03_pullquote";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "folio03_pullquote_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "closing_cta_eyebrow";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "closing_cta_eyebrow_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "closing_cta_title";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "closing_cta_title_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "closing_cta_title_emphasis";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "closing_cta_title_emphasis_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "closing_cta_body";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "closing_cta_body_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "closing_cta_whatsapp_cta_label";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "closing_cta_whatsapp_cta_label_b_m";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "closing_cta_field_notes_cta_label";
    ALTER TABLE "why_coolman_page" DROP COLUMN IF EXISTS "closing_cta_field_notes_cta_label_b_m";
  `)

  // home_page: restore old array tables, drop new columns
  await db.execute(sql`
    DROP TABLE IF EXISTS "home_page_fear_grid_cards" CASCADE;
    DROP TABLE IF EXISTS "home_page_alans_letter_paragraphs" CASCADE;
    DROP TABLE IF EXISTS "home_page_conversation_channels" CASCADE;
  `)

  await db.execute(sql`
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "opening_eyebrow";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "opening_eyebrow_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "opening_headline_prefix";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "opening_headline_prefix_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "opening_headline_emphasis";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "opening_headline_emphasis_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "opening_lede";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "opening_lede_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "opening_cta_primary";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "opening_cta_primary_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "opening_cta_secondary";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "opening_cta_secondary_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "fear_grid_eyebrow";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "fear_grid_eyebrow_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "fear_grid_headline";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "fear_grid_headline_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "three_myths_intro_eyebrow";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "three_myths_intro_eyebrow_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "three_myths_intro_headline";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "three_myths_intro_headline_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "three_myths_intro_lede";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "three_myths_intro_lede_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "three_myths_intro_cta_label";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "three_myths_intro_cta_label_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "brotherhood_intro_eyebrow";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "brotherhood_intro_eyebrow_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "brotherhood_intro_headline";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "brotherhood_intro_headline_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "brotherhood_intro_lede";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "brotherhood_intro_lede_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "brotherhood_intro_cta_label";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "brotherhood_intro_cta_label_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "alans_letter_eyebrow";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "alans_letter_eyebrow_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "alans_letter_signature";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "alans_letter_signature_line2";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "alans_letter_signature_line2_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "quiet_door_eyebrow";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "quiet_door_eyebrow_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "quiet_door_headline";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "quiet_door_headline_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "quiet_door_lede";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "quiet_door_lede_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "quiet_door_cta_primary";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "quiet_door_cta_primary_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "quiet_door_cta_secondary";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "quiet_door_cta_secondary_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "conversation_eyebrow";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "conversation_eyebrow_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "conversation_headline";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "conversation_headline_b_m";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "conversation_lede";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "conversation_lede_b_m";
  `)
}
