// Apply normalised product names to the DB.
// Run with:  pnpm tsx --env-file=.env.local scripts/migration/apply-rename.mjs
//
// Uses the same normalisation rules as propose-rename.mjs, but disambiguates
// duplicates using a model-code token pulled from the source-site slug
// (e.g. "n250p", "pda350hss") instead of the ugly SKU tail.

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFile, writeFile } from 'node:fs/promises'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const { getPayload } = await import('payload')
const { default: config } = await import('@payload-config')
const payload = await getPayload({ config })

const proposals = JSON.parse(await readFile(path.join(HERE, 'PROPOSALS.json'), 'utf8'))

// Build a (originalSku → [slug, ...]) map. Duplicates have multiple slugs.
const skuToSlugs = new Map()
for (const p of proposals) {
  if (!skuToSlugs.has(p.sku)) skuToSlugs.set(p.sku, [])
  skuToSlugs.get(p.sku).push(p.slug)
}

function normaliseName(name, categoryName) {
  let s = name
  s = s.replace(/\(\s*NEW!?\s*\)/gi, '')
  s = s.replace(/\bInner Diameter\b/gi, '')
  s = s.replace(/(\d+(?:\.\d+)?)\s*(?:inch|in\b|")/gi, '$1″')
  s = s.replace(/(\d+(?:\.\d+)?\s*″)\s*\/\s*(Ø?\s*\d+(?:\.\d+)?\s*mm)/g, (_, a, b) =>
    a.replace(/\s+/g, '') + '/' + b.replace(/\s+/g, ''))
  s = s.replace(/(\d+(?:\.\d+)?\s*″)\s*[-–]\s*(\d+(?:\.\d+)?\s*mm)\b(?!\s*Segment)/g,
    (_, a, b) => `${a.replace(/\s+/g, '')}-${b.replace(/\s+/g, '')} Segment`)
  s = s.replace(/(\d+(?:\.\d+)?\s*″)\s*[-–]\s*PCD\b/g, '$1 PCD')
  s = s.replace(/(\d+)\s*Teeth\s+(Wood|Aluminium|Aluminum)/gi,
    (_, n, m) => `${n}-Tooth ${m === 'Aluminum' ? 'Aluminium' : m} Blade`)
  if (categoryName === 'Core Bits') {
    s = s.replace(/\b([A-Z]{2,5}\d?)-Ø/g, '$1 Ø')
    s = s.replace(/\b([A-Z]{2,5}\d?)\s+Series\s+Ø/g, '$1 Ø')
  }
  s = s.replace(/\s+/g, ' ').trim()
  return s
}

// Pull a model code from a slug: first hyphen-segment that mixes letters + digits,
// else the first segment.
function modelTokenFromSlug(slug) {
  const parts = (slug || '').split('-').filter(Boolean)
  const codey = parts.find(p => /\d/.test(p) && /[a-z]/i.test(p))
  return (codey || parts[0] || '').toUpperCase()
}

// Map a DB product to its source slug. The disambiguated re-imports have SKUs
// like "<BASE>-<SUFFIX>"; PROPOSALS.json has them under the bare <BASE> SKU
// alongside the original. Resolve by matching the slug-suffix.
function resolveSlug(dbSku) {
  // Exact hit (non-duplicates)
  if (skuToSlugs.has(dbSku)) {
    const slugs = skuToSlugs.get(dbSku)
    return slugs[0]   // first occurrence in proposals = the one that kept the bare SKU
  }
  // Suffix-disambiguated SKU: "<BASE>-<SUFFIX>" where SUFFIX is uppercased slug tail
  const m = dbSku.match(/^(.+?)-([A-Z0-9\-]+)$/)
  if (m && skuToSlugs.has(m[1])) {
    const targetSuffix = m[2].toLowerCase()
    const slugs = skuToSlugs.get(m[1])
    // Match the slug whose tail matches the SKU suffix
    return slugs.find(s => s.toLowerCase().includes(targetSuffix.toLowerCase())) || slugs[slugs.length - 1]
  }
  return null
}

const all = await payload.find({ collection: 'products', limit: 1000, depth: 1 })

// Build proposed names with smart disambiguation
const rows = all.docs.map(p => ({
  id: p.id,
  sku: p.sku,
  current: p.name,
  proposedRaw: normaliseName(p.name, p.category?.name || ''),
  category: p.category?.name || '',
  slug: resolveSlug(p.sku),
}))

// Disambiguate dupes
const groupKey = (r) => `${r.category}::${r.proposedRaw}`
const grouped = new Map()
for (const r of rows) {
  if (!grouped.has(groupKey(r))) grouped.set(groupKey(r), [])
  grouped.get(groupKey(r)).push(r)
}
for (const [, group] of grouped) {
  if (group.length === 1) {
    group[0].proposed = group[0].proposedRaw
    continue
  }
  for (const r of group) {
    const token = modelTokenFromSlug(r.slug)
    r.proposed = token ? `${r.proposedRaw} (${token})` : r.proposedRaw
  }
}

// Apply
const changes = rows.filter(r => r.proposed !== r.current)
console.log(`applying ${changes.length} renames...`)
const log = []
for (const r of changes) {
  await payload.update({
    collection: 'products',
    id: r.id,
    data: { name: r.proposed },
  })
  log.push(`  ${r.sku.padEnd(40)} | ${r.current}  →  ${r.proposed}`)
}
console.log(log.join('\n'))
console.log(`done. updated ${changes.length} of ${rows.length} products.`)
await writeFile(path.join(HERE, 'RENAME-APPLIED.log'),
  changes.map(r => `${r.id}\t${r.sku}\t${r.current}\t${r.proposed}`).join('\n') + '\n')
process.exit(0)
