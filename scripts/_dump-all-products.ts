/**
 * READ-ONLY: dump every product to JSON for family-grouping review.
 *   npx tsx --env-file=.env.local scripts/_dump-all-products.ts
 * Output: ../family-review/products-all.json  (+ a category summary to stdout)
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'

const OUT_DIR = path.resolve(process.cwd(), '..', 'family-review')

const rel = (v: any): string | null =>
  v && typeof v === 'object' ? (v.name ?? null) : (typeof v === 'string' ? v : null)

const run = async () => {
  const payload = await getPayload({ config })
  const res = await payload.find({ collection: 'products', limit: 1000, depth: 1, sort: 'category' })
  const rows = (res.docs as any[]).map((p) => ({
    id: p.id,
    sku: p.sku ?? '',
    name: p.name ?? '',
    nameBM: p.nameBM ?? '',
    category: rel(p.category) ?? '',
    diameter: p.diameter ?? '',
    diameterMm: p.diameterMm ?? null,
    listPrice: p.listPrice ?? null,
    hasImage: !!p.image,
    materials: (p.materials || []).map(rel).filter(Boolean),
    applications: (p.applications || []).map(rel).filter(Boolean),
    machineTier: rel(p.machineTier) ?? '',
    bondType: p.bondType ?? '',
    segmentHeight: p.segmentHeight ?? '',
    arborSize: p.arborSize ?? '',
    maxRPM: p.maxRPM ?? '',
    family: p.family ?? null,
  }))

  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(path.join(OUT_DIR, 'products-all.json'), JSON.stringify(rows, null, 2))

  const byCat = new Map<string, number>()
  for (const r of rows) byCat.set(r.category, (byCat.get(r.category) ?? 0) + 1)
  console.log(`TOTAL: ${rows.length} products -> ${path.join(OUT_DIR, 'products-all.json')}\n`)
  console.log('BY CATEGORY:')
  for (const [c, n] of [...byCat.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`   ${String(n).padStart(4)}  ${c}`)
  }
  process.exit(0)
}
run().catch((e) => { console.error(e); process.exit(1) })
