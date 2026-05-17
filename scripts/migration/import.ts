// Stage 3 — import classified proposals into Payload.
// Run with:  pnpm tsx --env-file=.env.local scripts/migration/import.ts
//
// What it does:
//   1. Seeds taxonomies (categories, materials, applications, machineTiers) from taxonomy.json.
//      Upserts by name — safe to re-run.
//   2. Reads PROPOSALS.json (Stage 2 output).
//   3. For each product: uploads images to Media collection, then creates the product
//      with listPrice=0. Idempotent — skips if SKU already exists.
//   4. Writes IMPORT-REPORT.md.
//
// Safety:
//   - listPrice: 0 (placeholder). GH must fill before unpausing the kill switch.
//   - relatedProducts: filled in a second pass at the end (products sharing
//     ≥2 materials + same category).

import { getPayload } from 'payload'
import config from '@payload-config'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const SOURCE_MEDIA = path.join(HERE, 'source', 'media')

type Proposal = {
  wpId: number
  slug: string
  sku: string
  name: string
  nameBM: string
  category: string | null
  materials: string[]
  applications: string[]
  machineTier: string
  diameter: string | null
  arborSize: string | null
  teeth: number | null
  description: string
  descriptionBM: string
  descSource: 'cleaned' | 'synthesized'
  youtubeUrl: string | null
  images: { filename: string; role: 'featured' | 'gallery'; sourceUrl: string }[]
  sourceUrl: string
  wpCategories: string[]
  confidence: number
  needsReview: boolean
  reviewReasons: string[]
}

type Taxonomy = {
  categories: { key: string; name: string; nameBM: string }[]
  materials:  { key: string; name: string; nameBM: string }[]
  applications: { key: string; name: string; nameBM: string }[]
  machineTiers: { key: string; name: string; nameBM: string; powerRange: string }[]
}

const log = (...a: any[]) => console.log('[import]', ...a)

async function upsertByName<T extends { id: any; name: string }>(
  payload: any,
  collection: string,
  items: { name: string; nameBM: string; powerRange?: string }[],
): Promise<Map<string, any>> {
  const map = new Map<string, any>()
  const existing = await payload.find({ collection, limit: 1000, depth: 0 })
  for (const e of existing.docs as T[]) map.set(e.name, e.id)

  for (const item of items) {
    if (map.has(item.name)) continue
    const data: any = { name: item.name, nameBM: item.nameBM }
    if (item.powerRange) data.powerRange = item.powerRange
    const created = await payload.create({ collection, data })
    map.set(item.name, created.id)
    log(`  + ${collection}: ${item.name}`)
  }
  return map
}

async function uploadImage(
  payload: any,
  filename: string,
  alt: string,
  cache: Map<string, any>,
): Promise<any | null> {
  if (cache.has(filename)) return cache.get(filename)

  // Check if already in Media collection (by filename)
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  })
  if (existing.docs.length > 0) {
    cache.set(filename, existing.docs[0].id)
    return existing.docs[0].id
  }

  const fp = path.join(SOURCE_MEDIA, filename)
  try {
    await stat(fp)
  } catch {
    log(`  ! missing image file: ${filename}`)
    return null
  }
  const buf = await readFile(fp)
  const ext = path.extname(filename).toLowerCase()
  const mime =
    ext === '.png' ? 'image/png' :
    ext === '.webp' ? 'image/webp' :
    ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
    null
  if (!mime) {
    log(`  ! skipping non-image file: ${filename}`)
    return null
  }
  const created = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data: buf, name: filename, mimetype: mime, size: buf.length },
  })
  cache.set(filename, created.id)
  return created.id
}

async function run() {
  const payload = await getPayload({ config })

  const proposals: Proposal[] = JSON.parse(
    await readFile(path.join(HERE, 'PROPOSALS.json'), 'utf8'),
  )
  const taxonomy: Taxonomy = JSON.parse(
    await readFile(path.join(HERE, 'taxonomy.json'), 'utf8'),
  )

  log('seeding taxonomies...')
  const catMap  = await upsertByName(payload, 'categories',   taxonomy.categories)
  const matMap  = await upsertByName(payload, 'materials',    taxonomy.materials)
  const appMap  = await upsertByName(payload, 'applications', taxonomy.applications)
  const tierMap = await upsertByName(payload, 'machineTiers', taxonomy.machineTiers)

  // taxonomy.key → name lookup so we can resolve key → id
  const keyToName = {
    cat:  Object.fromEntries(taxonomy.categories.map(c => [c.key, c.name])),
    mat:  Object.fromEntries(taxonomy.materials.map(m => [m.key, m.name])),
    app:  Object.fromEntries(taxonomy.applications.map(a => [a.key, a.name])),
    tier: Object.fromEntries(taxonomy.machineTiers.map(t => [t.key, t.name])),
  }

  const mediaCache = new Map<string, any>()
  const report: { sku: string; status: 'created' | 'skipped' | 'failed'; reason?: string; bmAuto: boolean; descSource: string }[] = []
  const createdProductsBySku = new Map<string, { id: any; category: any; materials: any[] }>()

  log(`importing ${proposals.length} products...`)
  let i = 0
  for (const p of proposals) {
    i++
    if (i % 25 === 0) log(`  ${i}/${proposals.length}`)

    if (!p.category) {
      report.push({ sku: p.sku, status: 'failed', reason: 'no category', bmAuto: true, descSource: p.descSource })
      continue
    }

    // skip if already imported (by SKU)
    const existing = await payload.find({
      collection: 'products',
      where: { sku: { equals: p.sku } },
      limit: 1,
      depth: 0,
    })
    if (existing.docs.length > 0) {
      const ex: any = existing.docs[0]
      createdProductsBySku.set(p.sku, {
        id: ex.id,
        category: ex.category,
        materials: ex.materials || [],
      })
      report.push({ sku: p.sku, status: 'skipped', reason: 'sku exists', bmAuto: true, descSource: p.descSource })
      continue
    }

    try {
      // Upload images
      const featured = p.images.find(im => im.role === 'featured')
      const gallery  = p.images.filter(im => im.role !== 'featured')
      const heroId = featured ? await uploadImage(payload, featured.filename, p.name, mediaCache) : null
      const galleryIds: any[] = []
      for (const g of gallery) {
        const id = await uploadImage(payload, g.filename, p.name, mediaCache)
        if (id) galleryIds.push(id)
      }

      // Resolve taxonomy ids
      const categoryId = catMap.get(keyToName.cat[p.category])
      const materialIds  = p.materials.map(k => matMap.get(keyToName.mat[k])).filter(Boolean)
      const applicationIds = p.applications.map(k => appMap.get(keyToName.app[k])).filter(Boolean)
      const tierId = tierMap.get(keyToName.tier[p.machineTier])

      if (!categoryId || !tierId) {
        report.push({ sku: p.sku, status: 'failed', reason: 'taxonomy id missing', bmAuto: true, descSource: p.descSource })
        continue
      }

      const data: any = {
        sku: p.sku,
        name: p.name,
        nameBM: p.nameBM,
        description: p.description,
        descriptionBM: p.descriptionBM,
        category: categoryId,
        materials: materialIds,
        applications: applicationIds,
        machineTier: tierId,
        listPrice: 0,
      }
      if (p.diameter) data.diameter = p.diameter
      if (p.arborSize) data.arborSize = p.arborSize
      if (p.youtubeUrl) data.youtubeUrl = p.youtubeUrl
      if (heroId) data.image = heroId
      if (galleryIds.length) data.photos = galleryIds.map(id => ({ photo: id }))

      const created = await payload.create({ collection: 'products', data })
      createdProductsBySku.set(p.sku, {
        id: (created as any).id,
        category: categoryId,
        materials: materialIds,
      })
      report.push({ sku: p.sku, status: 'created', bmAuto: true, descSource: p.descSource })
    } catch (err: any) {
      report.push({ sku: p.sku, status: 'failed', reason: err?.message?.slice(0, 200) || String(err), bmAuto: true, descSource: p.descSource })
      log(`  ✗ ${p.sku}: ${err?.message || err}`)
    }
  }

  // Second pass: relatedProducts (same category + ≥2 shared materials)
  log('linking related products...')
  let relatedLinks = 0
  for (const p of proposals) {
    const me = createdProductsBySku.get(p.sku)
    if (!me) continue
    const related = proposals
      .filter(other => other.sku !== p.sku)
      .filter(other => other.category === p.category)
      .filter(other => {
        const shared = other.materials.filter(m => p.materials.includes(m)).length
        return shared >= 2
      })
      .slice(0, 6)
      .map(other => createdProductsBySku.get(other.sku)?.id)
      .filter(Boolean)
    if (related.length) {
      try {
        await payload.update({ collection: 'products', id: me.id, data: { relatedProducts: related } })
        relatedLinks += related.length
      } catch { /* ignore */ }
    }
  }

  // Report
  const created = report.filter(r => r.status === 'created').length
  const skipped = report.filter(r => r.status === 'skipped').length
  const failed  = report.filter(r => r.status === 'failed').length

  const rows = report.map(r =>
    `| ${r.sku} | ${r.status} | ${r.descSource} | ${r.reason || ''} |`
  ).join('\n')

  const md = `# Import Report — ${new Date().toISOString().slice(0, 10)}

## Summary
- **Created:** ${created}
- **Skipped (already existed):** ${skipped}
- **Failed:** ${failed}
- **Related-product links written:** ${relatedLinks}

## Notes
- All products imported with **listPrice = 0** (placeholder).
  Before unpausing \`orders_paused\`, GH must fill real prices via admin.
- All BM copy is auto-generated — flagged \`bm_auto: true\`. Human review recommended before launch.
- ${report.filter(r => r.descSource === 'synthesized').length} descriptions were synthesised from titles (source site had no copy).

## Per-product
| SKU | Status | Desc source | Reason |
|---|---|---|---|
${rows}
`
  const { writeFile } = await import('node:fs/promises')
  await writeFile(path.join(HERE, 'IMPORT-REPORT.md'), md)
  log(`done. created=${created} skipped=${skipped} failed=${failed} related=${relatedLinks}`)
  log(`wrote IMPORT-REPORT.md`)
  process.exit(0)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
