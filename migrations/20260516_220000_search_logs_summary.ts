import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

// Adds a denormalized `viewed_products_summary` text column on `search_logs`
// holding the human-readable list of product names clicked after the search
// (e.g. "Diamond Blade 14in, Granite Cup Wheel"). The /api/search-log route
// populates it whenever it writes or appends to `viewed_product_ids`. Lets
// the admin Search Logs list view show what was viewed at a glance, instead
// of forcing GH to open every row to decode opaque product IDs.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "search_logs"
      ADD COLUMN IF NOT EXISTS "viewed_products_summary" varchar(500);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "search_logs"
      DROP COLUMN IF EXISTS "viewed_products_summary";
  `)
}
