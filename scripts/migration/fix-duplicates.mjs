// Re-import the 5 products skipped due to SKU collision, with slug-suffixed SKUs.
// Title-collision case: two source-site products with identical titles map to the
// same SKU. Append a slug-derived suffix to disambiguate.

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFile, writeFile } from 'node:fs/promises'

const HERE = path.dirname(fileURLToPath(import.meta.url))

// Lazy-import Payload (needs tsx — this runs via tsx)
const { getPayload } = await import('payload')
const { default: config } = await import('@payload-config')
const payload = await getPayload({ config })

const proposals = JSON.parse(await readFile(path.join(HERE, 'PROPOSALS.json'), 'utf8'))
const taxonomy  = JSON.parse(await readFile(path.join(HERE, 'taxonomy.json'), 'utf8'))

const SOURCE_MEDIA = path.join(HERE, 'source', 'media')
const { stat } = await import('node:fs/promises')

// Find duplicate SKUs
const skuCounts = new Map()
for (const p of proposals) skuCounts.set(p.sku, (skuCounts.get(p.sku) || 0) + 1)

// Build the disambiguated set: keep the first occurrence with its original SKU,
// disambiguate the rest by appending the last token of the slug.
const seen = new Set()
const toFix = []
for (const p of proposals) {
  if (skuCounts.get(p.sku) > 1) {
    if (seen.has(p.sku)) {
      const suffix = p.slug.split('-').filter(Boolean).slice(-2).join('-').toUpperCase()
      toFix.push({ ...p, sku: `${p.sku}-${suffix}`.slice(0, 32) })
    } else {
      seen.add(p.sku)
    }
  }
}

console.log(`re-importing ${toFix.length} disambiguated products...`)

// Resolve taxonomy ids
const findId = async (collection, name) => {
  const r = await payload.find({ collection, where: { name: { equals: name } }, limit: 1, depth: 0 })
  return r.docs[0]?.id
}

const keyToName = {
  cat:  Object.fromEntries(taxonomy.categories.map(c => [c.key, c.name])),
  mat:  Object.fromEntries(taxonomy.materials.map(m => [m.key, m.name])),
  app:  Object.fromEntries(taxonomy.applications.map(a => [a.key, a.name])),
  tier: Object.fromEntries(taxonomy.machineTiers.map(t => [t.key, t.name])),
}

for (const p of toFix) {
  const existing = await payload.find({
    collection: 'products',
    where: { sku: { equals: p.sku } },
    limit: 1,
    depth: 0,
  })
  if (existing.docs.length) {
    console.log(`  skip ${p.sku} — already exists`)
    continue
  }

  const categoryId = await findId('categories', keyToName.cat[p.category])
  const tierId     = await findId('machineTiers', keyToName.tier[p.machineTier])
  const materialIds = []
  for (const k of p.materials) {
    const id = await findId('materials', keyToName.mat[k])
    if (id) materialIds.push(id)
  }
  const applicationIds = []
  for (const k of p.applications) {
    const id = await findId('applications', keyToName.app[k])
    if (id) applicationIds.push(id)
  }

  // Upload images (idempotent — Media by filename)
  let heroId = null
  const galleryIds = []
  for (const im of p.images) {
    const fp = path.join(SOURCE_MEDIA, im.filename)
    try { await stat(fp) } catch { continue }
    const ex = await payload.find({ collection: 'media', where: { filename: { equals: im.filename } }, limit: 1, depth: 0 })
    let id
    if (ex.docs.length) {
      id = ex.docs[0].id
    } else {
      const buf = await readFile(fp)
      const ext = path.extname(im.filename).toLowerCase()
      const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
      const created = await payload.create({
        collection: 'media',
        data: { alt: p.name },
        file: { data: buf, name: im.filename, mimetype: mime, size: buf.length },
      })
      id = created.id
    }
    if (im.role === 'featured' && !heroId) heroId = id
    else galleryIds.push(id)
  }

  const data = {
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

  await payload.create({ collection: 'products', data })
  console.log(`  + ${p.sku} (${p.name})`)
}

// Update the IMPORT-REPORT.md tail with the fix
const finalCount = await payload.find({ collection: 'products', limit: 1, depth: 0 })
console.log(`final product count: ${finalCount.totalDocs}`)
process.exit(0)
