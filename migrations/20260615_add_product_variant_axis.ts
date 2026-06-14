import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

// Adds an optional SECOND switcher axis to products: `variant_value` (numeric,
// for sort/identity) + `variant_label` (display pill text). Lets a family vary
// by something other than diameter — tooth count, grit, or segment width — so
// the product page can render a second pill row (e.g. Size + Tooth). Two nullable
// columns + one index; fully additive. Which axis a family uses is configured in
// code (lib/products/family.ts FAMILY_AXES), not in the DB. Clearing the columns
// reverts a product to a plain size/standalone entry.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "variant_value" numeric,
      ADD COLUMN IF NOT EXISTS "variant_label" varchar;

    CREATE INDEX IF NOT EXISTS "products_variant_value_idx" ON "products" ("variant_value");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "products_variant_value_idx";
    ALTER TABLE "products"
      DROP COLUMN IF EXISTS "variant_value",
      DROP COLUMN IF EXISTS "variant_label";
  `)
}
