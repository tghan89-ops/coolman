// Produce a CSV of proposed normalised product names — no DB writes.
// Run with:  pnpm tsx --env-file=.env.local scripts/migration/propose-rename.mjs
//
// Normalisation rules:
//   - Inch glyph: always "″" (Unicode prime), never " inch", "in", or '"'.
//   - Size pair: no spaces around "/" → "12″/300mm" not "12″ / 300mm".
//   - Segment-height blades: "4″-10mm Segment" (single dash, no spaces).
//   - Core bits: "<Series> Ø<mm>mm" — drop hyphen between series and Ø.
//   - Drop trailing decorations like "( NEW! )", "(NEW)".
//   - Drop "Inner Diameter" suffix.
//   - "<n> Teeth Wood" → "<n>-Tooth Wood Blade".
//   - Collapse multiple spaces.

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeFile } from 'node:fs/promises'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const { getPayload } = await import('payload')
const { default: config } = await import('@payload-config')
const payload = await getPayload({ config })

function normaliseName(name, categoryName) {
  let s = name

  // 1. Strip noise
  s = s.replace(/\(\s*NEW!?\s*\)/gi, '')
  s = s.replace(/\bInner Diameter\b/gi, '')

  // 2. Inch glyph: "12 inch", "12in", "12\"" -> "12″"
  s = s.replace(/(\d+(?:\.\d+)?)\s*(?:inch|in\b|")/gi, '$1″')

  // 3. Tighten size pair: "12″ / 300mm" or "12″/ 300mm" -> "12″/300mm"
  s = s.replace(/(\d+(?:\.\d+)?\s*″)\s*\/\s*(Ø?\s*\d+(?:\.\d+)?\s*mm)/g, (_, a, b) => {
    return a.replace(/\s+/g, '') + '/' + b.replace(/\s+/g, '')
  })

  // 4. Segment-height blades: "4″ – 10mm", "4″- 6.5mm" -> "4″-10mm Segment"
  s = s.replace(/(\d+(?:\.\d+)?\s*″)\s*[-–]\s*(\d+(?:\.\d+)?\s*mm)\b(?!\s*Segment)/g,
    (_, a, b) => `${a.replace(/\s+/g, '')}-${b.replace(/\s+/g, '')} Segment`)
  // PCD ones: "4″ – PCD" -> "4″ PCD"
  s = s.replace(/(\d+(?:\.\d+)?\s*″)\s*[-–]\s*PCD\b/g, '$1 PCD')

  // 5. Teeth wording: "40 Teeth Wood" -> "40-Tooth Wood Blade",
  //    "40 Teeth Aluminium" -> "40-Tooth Aluminium Blade"
  s = s.replace(/(\d+)\s*Teeth\s+(Wood|Aluminium|Aluminum)/gi,
    (_, n, m) => `${n}-Tooth ${m === 'Aluminum' ? 'Aluminium' : m} Blade`)

  // 6. Core bits: "DD1-Ø14mm" -> "DD1 Ø14mm", "CBT-Ø52mm" -> "CBT Ø52mm"
  if (categoryName === 'Core Bits') {
    s = s.replace(/\b([A-Z]{2,5}\d?)-Ø/g, '$1 Ø')
    // "DORAI Ø25mm" already fine
    // "SBB Series Ø100mm" -> "SBB Ø100mm"
    s = s.replace(/\b([A-Z]{2,5}\d?)\s+Series\s+Ø/g, '$1 Ø')
    // "PDA Ø52mm" fine
  }

  // 7. Tile saw: keep as "<size> Tile Saw Blade" — they all already have it
  // 8. Collapse whitespace, trim
  s = s.replace(/\s+/g, ' ').trim()

  return s
}

const all = await payload.find({ collection: 'products', limit: 1000, depth: 1 })
console.log(`scanning ${all.docs.length} products...`)

// Detect duplicates of the proposed name within the same category
const proposed = all.docs.map(p => ({
  id: p.id,
  sku: p.sku,
  current: p.name,
  proposedRaw: normaliseName(p.name, p.category?.name || ''),
  category: p.category?.name || '',
  diameterMm: p.diameterMm,
}))

// Find dupes (same proposed name + same category) and append SKU tail for disambiguation
const groupKey = (r) => `${r.category}::${r.proposedRaw}`
const counts = new Map()
for (const r of proposed) counts.set(groupKey(r), (counts.get(groupKey(r)) || 0) + 1)

const seen = new Map()
for (const r of proposed) {
  const k = groupKey(r)
  if (counts.get(k) > 1) {
    const n = (seen.get(k) || 0) + 1
    seen.set(k, n)
    // Use a short tail of the SKU as the disambiguator
    const tail = r.sku.split(/[-_]/).filter(Boolean).slice(-1)[0]
    r.proposed = n === 1 ? r.proposedRaw : `${r.proposedRaw} (${tail})`
  } else {
    r.proposed = r.proposedRaw
  }
}

// Sort by category, then diameter, then proposed name (so the CSV reads like the admin list)
const catOrder = ['Diamond Blades','Core Bits','Drill Bits','Grinding Wheels','Polishing Pads','Drilling Machines','Cutting Machines','Floor Equipment','Hole Saws','Anchors & Fixings','Anchor Removal Tools','Accessories & Parts']
proposed.sort((a, b) => {
  const ca = catOrder.indexOf(a.category); const cb = catOrder.indexOf(b.category)
  if (ca !== cb) return ca - cb
  const da = a.diameterMm ?? 9999; const db = b.diameterMm ?? 9999
  if (da !== db) return da - db
  return a.proposed.localeCompare(b.proposed)
})

// Stats
const changed = proposed.filter(r => r.proposed !== r.current).length
const unchanged = proposed.length - changed
console.log(`would change: ${changed}, unchanged: ${unchanged}`)

// Write CSV
const esc = (v) => {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
const header = 'id,sku,category,diameter_mm,current_name,proposed_name,changed\n'
const rows = proposed.map(r =>
  [r.id, r.sku, r.category, r.diameterMm ?? '', r.current, r.proposed, r.proposed !== r.current ? 'yes' : ''].map(esc).join(',')
).join('\n')

await writeFile(path.join(HERE, 'RENAME-PROPOSAL.csv'), header + rows + '\n')
console.log(`wrote RENAME-PROPOSAL.csv (${proposed.length} rows, ${changed} would change)`)
process.exit(0)
