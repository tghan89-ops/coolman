import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

// Adds the optional `family` grouping code to products. Sizes that share a
// family code collapse into one catalogue card + size switcher on the product
// page. Single nullable column + index — additive and safe; clearing the column
// reverts every product to a standalone entry. See
// docs/superpowers/specs/2026-06-14-product-families-design.md.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "family" varchar;

    CREATE INDEX IF NOT EXISTS "products_family_idx" ON "products" ("family");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "products_family_idx";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "family";
  `)
}
