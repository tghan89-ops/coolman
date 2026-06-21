import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

// Posts (Field Notes) editorial fields that were added to the collection config
// but never migrated onto prod, so field-notes detail pages 500'd
// (column posts.note_number does not exist) and 404'd to visitors. Fully additive,
// all nullable. Idempotent. Applied to prod 2026-06-21 and recorded as batch 19.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "note_number" varchar;
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "read_time_min" numeric;
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "editorial_notes" varchar;
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "application" varchar;
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "application_b_m" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "application_b_m";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "application";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "editorial_notes";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "read_time_min";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "note_number";
  `)
}
