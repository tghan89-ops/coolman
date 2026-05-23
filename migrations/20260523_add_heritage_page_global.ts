import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

// Creates the heritage-page global tables from scratch.
// The slug is heritage-page → table name heritage_page.
// Each narrative section has a paragraph array table.
// The timeline section has an events array table.
// All idempotent (IF NOT EXISTS / IF EXISTS).

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Main global table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "heritage_page" (
      "id"                           serial PRIMARY KEY,
      "hero_eyebrow"                 varchar,
      "hero_eyebrow_b_m"             varchar,
      "hero_headline"                varchar,
      "hero_headline_b_m"            varchar,
      "hero_lede"                    varchar,
      "hero_lede_b_m"                varchar,
      "pj2007_eyebrow"               varchar,
      "pj2007_eyebrow_b_m"           varchar,
      "pj2007_headline"              varchar,
      "pj2007_headline_b_m"          varchar,
      "founding_eyebrow"             varchar,
      "founding_eyebrow_b_m"         varchar,
      "founding_headline"            varchar,
      "founding_headline_b_m"        varchar,
      "workshop_day_eyebrow"         varchar,
      "workshop_day_eyebrow_b_m"     varchar,
      "workshop_day_headline"        varchar,
      "workshop_day_headline_b_m"    varchar,
      "workshop_day_note"            varchar,
      "workshop_day_note_b_m"        varchar,
      "shibuya_years_eyebrow"        varchar,
      "shibuya_years_eyebrow_b_m"    varchar,
      "shibuya_years_headline"       varchar,
      "shibuya_years_headline_b_m"   varchar,
      "hardest_year_eyebrow"         varchar,
      "hardest_year_eyebrow_b_m"     varchar,
      "hardest_year_headline"        varchar,
      "hardest_year_headline_b_m"    varchar,
      "twenty_years_eyebrow"         varchar,
      "twenty_years_eyebrow_b_m"     varchar,
      "twenty_years_headline"        varchar,
      "twenty_years_headline_b_m"    varchar,
      "timeline_eyebrow"             varchar,
      "timeline_eyebrow_b_m"         varchar,
      "timeline_headline"            varchar,
      "timeline_headline_b_m"        varchar,
      "updated_at"                   timestamptz DEFAULT now() NOT NULL,
      "created_at"                   timestamptz DEFAULT now() NOT NULL
    );
  `)

  // Array tables — id must be varchar (Payload generates string IDs for array rows)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "heritage_page_pj2007_paragraphs" (
      "_order"        integer NOT NULL,
      "_parent_id"    integer NOT NULL,
      "id"            varchar PRIMARY KEY NOT NULL,
      "paragraph"     varchar NOT NULL,
      "paragraph_b_m" varchar
    );
    CREATE TABLE IF NOT EXISTS "heritage_page_founding_paragraphs" (
      "_order"        integer NOT NULL,
      "_parent_id"    integer NOT NULL,
      "id"            varchar PRIMARY KEY NOT NULL,
      "paragraph"     varchar NOT NULL,
      "paragraph_b_m" varchar
    );
    CREATE TABLE IF NOT EXISTS "heritage_page_workshop_day_paragraphs" (
      "_order"        integer NOT NULL,
      "_parent_id"    integer NOT NULL,
      "id"            varchar PRIMARY KEY NOT NULL,
      "paragraph"     varchar NOT NULL,
      "paragraph_b_m" varchar
    );
    CREATE TABLE IF NOT EXISTS "heritage_page_shibuya_years_paragraphs" (
      "_order"        integer NOT NULL,
      "_parent_id"    integer NOT NULL,
      "id"            varchar PRIMARY KEY NOT NULL,
      "paragraph"     varchar NOT NULL,
      "paragraph_b_m" varchar
    );
    CREATE TABLE IF NOT EXISTS "heritage_page_hardest_year_paragraphs" (
      "_order"        integer NOT NULL,
      "_parent_id"    integer NOT NULL,
      "id"            varchar PRIMARY KEY NOT NULL,
      "paragraph"     varchar NOT NULL,
      "paragraph_b_m" varchar
    );
    CREATE TABLE IF NOT EXISTS "heritage_page_twenty_years_paragraphs" (
      "_order"        integer NOT NULL,
      "_parent_id"    integer NOT NULL,
      "id"            varchar PRIMARY KEY NOT NULL,
      "paragraph"     varchar NOT NULL,
      "paragraph_b_m" varchar
    );
    CREATE TABLE IF NOT EXISTS "heritage_page_timeline_events" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "year"       varchar NOT NULL,
      "title"      varchar NOT NULL,
      "title_b_m"  varchar,
      "body"       varchar NOT NULL,
      "body_b_m"   varchar,
      "note"       varchar,
      "note_b_m"   varchar
    );
  `)

  // FK constraints
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "heritage_page_pj2007_paragraphs"
        ADD CONSTRAINT "heritage_page_pj2007_paragraphs_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."heritage_page"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "heritage_page_founding_paragraphs"
        ADD CONSTRAINT "heritage_page_founding_paragraphs_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."heritage_page"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "heritage_page_workshop_day_paragraphs"
        ADD CONSTRAINT "heritage_page_workshop_day_paragraphs_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."heritage_page"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "heritage_page_shibuya_years_paragraphs"
        ADD CONSTRAINT "heritage_page_shibuya_years_paragraphs_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."heritage_page"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "heritage_page_hardest_year_paragraphs"
        ADD CONSTRAINT "heritage_page_hardest_year_paragraphs_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."heritage_page"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "heritage_page_twenty_years_paragraphs"
        ADD CONSTRAINT "heritage_page_twenty_years_paragraphs_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."heritage_page"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "heritage_page_timeline_events"
        ADD CONSTRAINT "heritage_page_timeline_events_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."heritage_page"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)

  // Indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "heritage_page_pj2007_paragraphs_order_idx"
      ON "heritage_page_pj2007_paragraphs" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "heritage_page_pj2007_paragraphs_parent_id_idx"
      ON "heritage_page_pj2007_paragraphs" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "heritage_page_founding_paragraphs_order_idx"
      ON "heritage_page_founding_paragraphs" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "heritage_page_founding_paragraphs_parent_id_idx"
      ON "heritage_page_founding_paragraphs" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "heritage_page_workshop_day_paragraphs_order_idx"
      ON "heritage_page_workshop_day_paragraphs" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "heritage_page_workshop_day_paragraphs_parent_id_idx"
      ON "heritage_page_workshop_day_paragraphs" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "heritage_page_shibuya_years_paragraphs_order_idx"
      ON "heritage_page_shibuya_years_paragraphs" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "heritage_page_shibuya_years_paragraphs_parent_id_idx"
      ON "heritage_page_shibuya_years_paragraphs" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "heritage_page_hardest_year_paragraphs_order_idx"
      ON "heritage_page_hardest_year_paragraphs" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "heritage_page_hardest_year_paragraphs_parent_id_idx"
      ON "heritage_page_hardest_year_paragraphs" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "heritage_page_twenty_years_paragraphs_order_idx"
      ON "heritage_page_twenty_years_paragraphs" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "heritage_page_twenty_years_paragraphs_parent_id_idx"
      ON "heritage_page_twenty_years_paragraphs" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "heritage_page_timeline_events_order_idx"
      ON "heritage_page_timeline_events" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "heritage_page_timeline_events_parent_id_idx"
      ON "heritage_page_timeline_events" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "heritage_page_timeline_events"          CASCADE;
    DROP TABLE IF EXISTS "heritage_page_twenty_years_paragraphs"  CASCADE;
    DROP TABLE IF EXISTS "heritage_page_hardest_year_paragraphs"  CASCADE;
    DROP TABLE IF EXISTS "heritage_page_shibuya_years_paragraphs" CASCADE;
    DROP TABLE IF EXISTS "heritage_page_workshop_day_paragraphs"  CASCADE;
    DROP TABLE IF EXISTS "heritage_page_founding_paragraphs"      CASCADE;
    DROP TABLE IF EXISTS "heritage_page_pj2007_paragraphs"        CASCADE;
    DROP TABLE IF EXISTS "heritage_page"                          CASCADE;
  `)
}
