// Export all 225 products as a CSV for Alan to fill in pricing + missing details.
// Run with:  pnpm tsx --env-file=.env.local scripts/migration/export-for-alan.mjs
//
// Columns Alan can edit are marked [EDIT] in the header row.
// SKU / Name / Category are reference-only — do NOT change these.
// When Alan returns the file, run apply-from-alan.mjs (to be written) to push the
// edits back into the DB.

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeFile } from 'node:fs/promises'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const { getPayload } = await import('payload')
const { default: config } = await import('@payload-config')
const payload = await getPayload({ config })

const catOrder = ['Diamond Blades','Core Bits','Drill Bits','Grinding Wheels','Polishing Pads','Drilling Machines','Cutting Machines','Floor Equipment','Hole Saws','Anchors & Fixings','Anchor Removal Tools','Accessories & Parts']

const all = await payload.find({ collection: 'products', limit: 1000, depth: 1 })
console.log(`exporting ${all.docs.length} products...`)

const rows = all.docs.map(p => ({
  sku: p.sku,
  name: p.name,
  category: p.category?.name || '',
  machineTier: p.machineTier?.name || '',
  diameterMm: p.diameterMm ?? '',
  listPrice: p.listPrice ?? 0,
  diameter: p.diameter || '',
  arborSize: p.arborSize || '',
  segmentHeight: p.segmentHeight || '',
  bondType: p.bondType || '',
  maxRPM: p.maxRPM || '',
  youtubeUrl: p.youtubeUrl || '',
}))

rows.sort((a, b) => {
  const ca = catOrder.indexOf(a.category); const cb = catOrder.indexOf(b.category)
  if (ca !== cb) return ca - cb
  const da = a.diameterMm === '' ? 9999 : Number(a.diameterMm)
  const db = b.diameterMm === '' ? 9999 : Number(b.diameterMm)
  if (da !== db) return da - db
  return a.name.localeCompare(b.name)
})

const esc = (v) => {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

const header = [
  'SKU (do not edit)',
  'Product Name (do not edit)',
  'Category (do not edit)',
  'Machine Tier [EDIT: trade / professional / industrial]',
  'List Price RM [EDIT — REQUIRED]',
  'Diameter [EDIT — e.g. 230mm or 9″]',
  'Arbor Size [EDIT — e.g. 22.23mm or M14]',
  'Segment Height [EDIT — e.g. 10mm]',
  'Bond Type [EDIT: soft / medium / hard / extraHard]',
  'Max RPM [EDIT — e.g. 6650]',
  'YouTube URL [EDIT — full https:// link]',
  'Notes for me [optional — anything you want flagged]',
].join(',')

const body = rows.map(r => [
  r.sku, r.name, r.category, r.machineTier,
  r.listPrice, r.diameter, r.arborSize, r.segmentHeight,
  r.bondType, r.maxRPM, r.youtubeUrl, '',
].map(esc).join(',')).join('\n')

// Prepend UTF-8 BOM so Excel renders the ″ glyph correctly
const csv = '﻿' + header + '\n' + body + '\n'
const out = path.join(HERE, 'ALAN-FILL.csv')
await writeFile(out, csv)
console.log(`wrote ${out}`)
console.log(`  rows: ${rows.length}`)
console.log(`  with price already set (non-zero): ${rows.filter(r => Number(r.listPrice) > 0).length}`)
console.log(`  blank diameter: ${rows.filter(r => !r.diameter).length}`)
console.log(`  blank arbor size: ${rows.filter(r => !r.arborSize).length}`)
console.log(`  blank max RPM: ${rows.filter(r => !r.maxRPM).length}`)
process.exit(0)
