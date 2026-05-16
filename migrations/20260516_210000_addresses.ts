import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Addresses table.
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "addresses" (
      "id" serial PRIMARY KEY NOT NULL,
      "contractor_id" integer NOT NULL,
      "label" varchar(40) NOT NULL,
      "address_text" varchar(500) NOT NULL,
      "is_default" boolean DEFAULT false,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "addresses"
        ADD CONSTRAINT "addresses_contractor_id_fk"
        FOREIGN KEY ("contractor_id") REFERENCES "public"."contractors"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "addresses_contractor_id_idx" ON "addresses" ("contractor_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "addresses_is_default_idx" ON "addresses" ("is_default");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "addresses_updated_at_idx" ON "addresses" ("updated_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "addresses_created_at_idx" ON "addresses" ("created_at");`)

  // 2. payload_locked_documents_rels — required for any payload.update/find on this collection.
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "addresses_id" integer;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_addresses_fk"
        FOREIGN KEY ("addresses_id") REFERENCES "public"."addresses"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_addresses_id_idx"
      ON "payload_locked_documents_rels" USING btree ("addresses_id");
  `)

  // 3. Backfill: every contractor with a non-empty delivery_address becomes one default Address row.
  // Skip contractors who already have any address row (idempotent re-runs).
  await db.execute(sql`
    INSERT INTO "addresses" ("contractor_id", "label", "address_text", "is_default")
    SELECT c."id", 'Default', c."delivery_address", true
    FROM "contractors" c
    WHERE c."delivery_address" IS NOT NULL
      AND length(trim(c."delivery_address")) > 0
      AND NOT EXISTS (SELECT 1 FROM "addresses" a WHERE a."contractor_id" = c."id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP INDEX IF EXISTS "payload_locked_documents_rels_addresses_id_idx";`)
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_addresses_fk";
  `)
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "addresses_id";
  `)
  await db.execute(sql`DROP TABLE IF EXISTS "addresses" CASCADE;`)
}
