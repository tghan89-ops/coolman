import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

// The first heritage-page migration created array tables with id serial (integer).
// Payload generates string IDs for array rows, so inserts fail with
// "invalid input syntax for type integer". This migration drops the wrong tables
// and recreates them with id varchar PRIMARY KEY NOT NULL.
// The main heritage_page table (serial id) is correct and is left untouched.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Drop the wrongly-typed tables (all empty, no data loss)
  await db.execute(sql`
    DROP TABLE IF EXISTS "heritage_page_timeline_events"          CASCADE;
    DROP TABLE IF EXISTS "heritage_page_twenty_years_paragraphs"  CASCADE;
    DROP TABLE IF EXISTS "heritage_page_hardest_year_paragraphs"  CASCADE;
    DROP TABLE IF EXISTS "heritage_page_shibuya_years_paragraphs" CASCADE;
    DROP TABLE IF EXISTS "heritage_page_workshop_day_paragraphs"  CASCADE;
    DROP TABLE IF EXISTS "heritage_page_founding_paragraphs"      CASCADE;
    DROP TABLE IF EXISTS "heritage_page_pj2007_paragraphs"        CASCADE;
  `)

  // Recreate with id varchar
  await db.execute(sql`
    CREATE TABLE "heritage_page_pj2007_paragraphs" (
      "_order"        integer NOT NULL,
      "_parent_id"    integer NOT NULL,
      "id"            varchar PRIMARY KEY NOT NULL,
      "paragraph"     varchar NOT NULL,
      "paragraph_b_m" varchar
    );
    CREATE TABLE "heritage_page_founding_paragraphs" (
      "_order"        integer NOT NULL,
      "_parent_id"    integer NOT NULL,
      "id"            varchar PRIMARY KEY NOT NULL,
      "paragraph"     varchar NOT NULL,
      "paragraph_b_m" varchar
    );
    CREATE TABLE "heritage_page_workshop_day_paragraphs" (
      "_order"        integer NOT NULL,
      "_parent_id"    integer NOT NULL,
      "id"            varchar PRIMARY KEY NOT NULL,
      "paragraph"     varchar NOT NULL,
      "paragraph_b_m" varchar
    );
    CREATE TABLE "heritage_page_shibuya_years_paragraphs" (
      "_order"        integer NOT NULL,
      "_parent_id"    integer NOT NULL,
      "id"            varchar PRIMARY KEY NOT NULL,
      "paragraph"     varchar NOT NULL,
      "paragraph_b_m" varchar
    );
    CREATE TABLE "heritage_page_hardest_year_paragraphs" (
      "_order"        integer NOT NULL,
      "_parent_id"    integer NOT NULL,
      "id"            varchar PRIMARY KEY NOT NULL,
      "paragraph"     varchar NOT NULL,
      "paragraph_b_m" varchar
    );
    CREATE TABLE "heritage_page_twenty_years_paragraphs" (
      "_order"        integer NOT NULL,
      "_parent_id"    integer NOT NULL,
      "id"            varchar PRIMARY KEY NOT NULL,
      "paragraph"     varchar NOT NULL,
      "paragraph_b_m" varchar
    );
    CREATE TABLE "heritage_page_timeline_events" (
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
  // Nothing meaningful to reverse — this is a schema repair migration.
}
