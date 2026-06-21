/**
 * One-off: apply the additive variant-axis columns to the (prod) DB and record
 * the migration tracking row, WITHOUT running `payload migrate` (which prompts
 * about pre-existing dev-push drift on this DB). Idempotent — safe to re-run.
 *   npx tsx --env-file=.env.local scripts/_apply-variant-migration.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { sql } from '@payloadcms/db-vercel-postgres'

const NAME = '20260615_add_product_variant_axis'

const run = async () => {
  const payload = await getPayload({ config })
  const db: any = (payload.db as any).drizzle

  await db.execute(
    sql.raw(`
      ALTER TABLE "products"
        ADD COLUMN IF NOT EXISTS "variant_value" numeric,
        ADD COLUMN IF NOT EXISTS "variant_label" varchar;
      CREATE INDEX IF NOT EXISTS "products_variant_value_idx" ON "products" ("variant_value");
    `),
  )
  console.log('Columns + index applied (idempotent).')

  // Record tracking row so a future `payload migrate` treats it as done.
  const existing: any = await db.execute(
    sql.raw(`SELECT id FROM "payload_migrations" WHERE name = '${NAME}' LIMIT 1;`),
  )
  const rows = existing?.rows ?? existing ?? []
  if (rows.length > 0) {
    console.log('Tracking row already present — nothing to insert.')
  } else {
    const nextBatch: any = await db.execute(
      sql.raw(`SELECT COALESCE(MAX(batch), 0) + 1 AS b FROM "payload_migrations";`),
    )
    const batch = (nextBatch?.rows ?? nextBatch)[0]?.b ?? 1
    await db.execute(
      sql.raw(
        `INSERT INTO "payload_migrations" (name, batch, updated_at, created_at)
         VALUES ('${NAME}', ${batch}, NOW(), NOW());`,
      ),
    )
    console.log(`Recorded migration '${NAME}' as batch ${batch}.`)
  }

  // Confirm columns exist.
  const cols: any = await db.execute(
    sql.raw(
      `SELECT column_name FROM information_schema.columns
       WHERE table_name = 'products' AND column_name IN ('variant_value','variant_label')
       ORDER BY column_name;`,
    ),
  )
  console.log('Verified columns:', (cols?.rows ?? cols).map((r: any) => r.column_name).join(', '))
  process.exit(0)
}
run().catch((e) => {
  console.error('FAILED:', e)
  process.exit(1)
})
