// Wipes test products + taxonomies + media. Leaves users, settings, pages alone.
// Run with:  node --env-file=.env.local scripts/migration/wipe-db.mjs
import pg from '../../node_modules/.pnpm/pg@8.20.0/node_modules/pg/lib/index.js'

const c = new pg.Client({ connectionString: process.env.DATABASE_URI, ssl: { rejectUnauthorized: false } })
await c.connect()

const before = await c.query(`
  select 'products' t, count(*) n from products
  union all select 'categories', count(*) from categories
  union all select 'materials',  count(*) from materials
  union all select 'applications', count(*) from applications
  union all select 'machine_tiers', count(*) from machine_tiers
  union all select 'media', count(*) from media
`)
console.log('before wipe:')
for (const r of before.rows) console.log(`  ${r.t}: ${r.n}`)

// TRUNCATE CASCADE handles products_photos, products_rels, search_logs_viewed_product_ids,
// payload_locked_documents_rels, carts_items, etc.
await c.query(`
  TRUNCATE TABLE
    products,
    categories,
    materials,
    applications,
    machine_tiers,
    media
  RESTART IDENTITY CASCADE
`)

const after = await c.query(`
  select 'products' t, count(*) n from products
  union all select 'categories', count(*) from categories
  union all select 'materials',  count(*) from materials
  union all select 'applications', count(*) from applications
  union all select 'machine_tiers', count(*) from machine_tiers
  union all select 'media', count(*) from media
`)
console.log('after wipe:')
for (const r of after.rows) console.log(`  ${r.t}: ${r.n}`)

await c.end()
