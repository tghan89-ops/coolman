/**
 * Apply the corrected product catalogue (products-export-CORRECTED) to the CMS.
 *
 * Matches existing products by NORMALIZED ENGLISH NAME (not SKU — the SKUs are
 * exactly what this update is changing). For each matched product it updates the
 * SKU, names, descriptions, taxonomy, specs and (only when clean) the price,
 * preserving images and order references. Unmatched rows become new products.
 *
 * Pricing policy (GH decision 2026-06-14):
 *   - Price is written ONLY when it is a single positive number.
 *   - 0 / blank / range ("104-220") prices are treated as quote-only: never
 *     written over an existing price; new products with such prices are HELD
 *     (not created) because listPrice is a required field.
 *
 * Materials policy: obvious duplicates/typos merged to a canonical name; the
 * rest created. Every merge/creation is reported.
 *
 * Orphan policy: products in the CMS but absent from the file are LEFT as-is.
 *
 * DRY RUN by default. Pass --apply to write.
 *   npx tsx --env-file=.env.local scripts/apply-product-update.ts <file.xlsx> [--apply]
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import ExcelJS from 'exceljs'
import path from 'path'

const FILE = path.resolve(process.argv[2])
const APPLY = process.argv.includes('--apply')

// ── helpers ───────────────────────────────────────────────────────────────────
const cell = (row: ExcelJS.Row, c: number) => {
  const v = row.getCell(c).value
  return v === null || v === undefined ? '' : String(v).trim()
}
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()
const titleCaseIfUpper = (s: string) =>
  s === s.toUpperCase()
    ? s.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase())
    : s
function cleanPrice(raw: string): number | null {
  if (raw === '' || raw == null) return null
  const n = Number(raw)
  if (isNaN(n) || n <= 0) return null
  return n
}
function parseDiameterMm(d: string): number | undefined {
  const m = d.match(/(\d+(?:\.\d+)?)\s*mm/i)
  return m ? Number(m[1]) : undefined
}

// Material canonicalisation: fix typos, normalise case, merge obvious dupes.
const MATERIAL_ALIASES: Record<string, string> = {
  rc: 'Reinforced Concrete',
  'reinforcement concrete': 'Reinforced Concrete',
  'ceramic tiles': 'Ceramic Tile',
}
function canonMaterial(raw: string): string {
  let s = raw.replace(/\s+/g, ' ').trim()
  s = s.replace(/\.+$/, '').trim() // strip trailing periods: "Quartz." -> "Quartz"
  s = s.replace(/ore less/gi, 'or less') // typo fix
  s = titleCaseIfUpper(s) // DEKTON TILE -> Dekton Tile
  const alias = MATERIAL_ALIASES[s.toLowerCase()]
  return alias ?? s
}

// Whole-cell overrides for malformed Materials cells (sentence dumped into the
// tag field). Keyed on the normalised raw cell; value is the clean tag list.
const MATERIAL_CELL_OVERRIDES: Record<string, string[]> = {
  'fibre cement boards and ultra hard materials – hardieplank, minerit, eternit, mdf and corian.':
    ['Fibre Cement Board'],
}

type TaxMap = Map<string, number> // lowercased name -> id

async function loadTax(payload: any, collection: string): Promise<{ map: TaxMap }> {
  const res = await payload.find({ collection, limit: 500, depth: 0 })
  const map: TaxMap = new Map()
  for (const d of res.docs) map.set((d.name as string).toLowerCase(), d.id)
  return { map }
}

async function main() {
  console.log(`File: ${FILE}`)
  console.log(`Mode: ${APPLY ? 'APPLY (writing to DB)' : 'DRY RUN (no writes)'}\n`)
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(FILE)
  const ws = wb.getWorksheet('Products')!
  const payload = await getPayload({ config })

  const { map: catMap } = await loadTax(payload, 'categories')
  const { map: matMap } = await loadTax(payload, 'materials')
  const { map: appMap } = await loadTax(payload, 'applications')
  const { map: tierMap } = await loadTax(payload, 'machineTiers')

  const prods = (await payload.find({ collection: 'products', limit: 5000, depth: 0 })).docs as any[]
  const byName = new Map<string, any>()
  const bySku = new Map<string, any>()
  for (const p of prods) {
    if (!byName.has(norm(p.name || ''))) byName.set(norm(p.name || ''), p)
    bySku.set(norm(p.sku || ''), p)
  }
  // Every SKU the file wants to own — used to detect when a name match has
  // already been claimed by a *different* row (duplicate product names).
  const fileSkus = new Set<string>()
  for (let r = 2; r <= ws.rowCount; r++) {
    const s = cell(ws.getRow(r), 1)
    if (s) fileSkus.add(norm(s))
  }

  const createdMaterials: string[] = []
  const mergedMaterials = new Set<string>()
  const createdApplications: string[] = []

  async function ensureMaterial(rawName: string): Promise<number | null> {
    const canonical = canonMaterial(rawName)
    if (norm(canonical) !== norm(rawName)) mergedMaterials.add(`"${rawName}" -> "${canonical}"`)
    const key = canonical.toLowerCase()
    if (matMap.has(key)) return matMap.get(key)!
    if (!APPLY) {
      matMap.set(key, -1)
      createdMaterials.push(canonical)
      return -1
    }
    const doc = await payload.create({ collection: 'materials', data: { name: canonical, nameBM: canonical } as any })
    matMap.set(key, doc.id)
    createdMaterials.push(canonical)
    return doc.id
  }
  async function ensureApplication(rawName: string): Promise<number | null> {
    const name = rawName.replace(/\s+/g, ' ').trim()
    const key = name.toLowerCase()
    if (appMap.has(key)) return appMap.get(key)!
    if (!APPLY) {
      appMap.set(key, -1)
      createdApplications.push(name)
      return -1
    }
    const doc = await payload.create({ collection: 'applications', data: { name, nameBM: name } as any })
    appMap.set(key, doc.id)
    createdApplications.push(name)
    return doc.id
  }

  let updated = 0, created = 0
  const held: string[] = []
  const skuRenames: string[] = []
  const priceWritten: string[] = []
  const priceSkipped: string[] = []
  const errors: string[] = []

  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r)
    const sku = cell(row, 1)
    if (!sku) continue
    const nameEN = cell(row, 2)
    const nameBM = cell(row, 3)
    const descEN = cell(row, 4)
    const descBM = cell(row, 5)
    const catName = cell(row, 6)
    const tierName = cell(row, 7)
    const price = cleanPrice(cell(row, 8))
    const diameter = cell(row, 11)
    const arbor = cell(row, 12)
    const seg = cell(row, 13)
    const bondRaw = cell(row, 14)
    const bond = ['soft', 'medium', 'hard', 'extraHard'].includes(bondRaw) ? bondRaw : undefined
    const maxRPM = cell(row, 15)
    const yt = cell(row, 16)

    try {
      const catId = catName ? catMap.get(catName.toLowerCase()) : undefined
      const tierId = tierName ? tierMap.get(tierName.toLowerCase()) : undefined
      const rawMatCell = cell(row, 9)
      const matTokens = MATERIAL_CELL_OVERRIDES[norm(rawMatCell)]
        ?? rawMatCell.split(',').map((s) => s.trim()).filter(Boolean)
      const matIds: number[] = []
      for (const m of matTokens) {
        const id = await ensureMaterial(m)
        if (id != null) matIds.push(id)
      }
      const appIds: number[] = []
      for (const a of cell(row, 10).split(',').map((s) => s.trim()).filter(Boolean)) {
        const id = await ensureApplication(a)
        if (id != null) appIds.push(id)
      }

      // SKU-first matching. Fall back to name only when that named product is an
      // un-renamed old record (its current SKU is NOT already a target in the
      // file). This keeps duplicate-named variants as distinct products.
      let existing = bySku.get(norm(sku))
      if (!existing) {
        const nameHit = byName.get(norm(nameEN))
        if (nameHit && !fileSkus.has(norm(nameHit.sku || ''))) existing = nameHit
      }

      if (existing) {
        const data: Record<string, any> = {
          sku, name: nameEN, nameBM, description: descEN, descriptionBM: descBM,
        }
        if (catId) data.category = catId
        if (tierId) data.machineTier = tierId
        if (matIds.length) data.materials = matIds
        if (appIds.length) data.applications = appIds
        if (diameter) { data.diameter = diameter; const dm = parseDiameterMm(diameter); if (dm) data.diameterMm = dm }
        if (arbor) data.arborSize = arbor
        if (seg) data.segmentHeight = seg
        if (bond) data.bondType = bond
        if (maxRPM) data.maxRPM = maxRPM
        if (yt) data.youtubeUrl = yt
        if (price != null) { data.listPrice = price; priceWritten.push(`${sku}: ${existing.listPrice} -> ${price}`) }
        else priceSkipped.push(`${sku} (kept ${existing.listPrice})`)
        if (norm(existing.sku || '') !== norm(sku)) skuRenames.push(`${existing.sku} -> ${sku}`)
        if (APPLY) await payload.update({ collection: 'products', id: existing.id, data })
        updated++
      } else {
        // NEW product — requires a clean price (listPrice required) + required fields
        if (price == null) { held.push(`${sku} "${nameEN}" (no usable price)`); continue }
        const missing = []
        if (!nameBM) missing.push('nameBM'); if (!descEN) missing.push('description')
        if (!descBM) missing.push('descriptionBM'); if (!catId) missing.push('category'); if (!tierId) missing.push('machineTier')
        if (missing.length) { held.push(`${sku} "${nameEN}" (missing ${missing.join(',')})`); continue }
        const data: Record<string, any> = {
          sku, name: nameEN, nameBM, description: descEN, descriptionBM: descBM,
          category: catId, machineTier: tierId, listPrice: price,
        }
        if (matIds.length) data.materials = matIds
        if (appIds.length) data.applications = appIds
        if (diameter) { data.diameter = diameter; const dm = parseDiameterMm(diameter); if (dm) data.diameterMm = dm }
        if (arbor) data.arborSize = arbor
        if (seg) data.segmentHeight = seg
        if (bond) data.bondType = bond
        if (maxRPM) data.maxRPM = maxRPM
        if (yt) data.youtubeUrl = yt
        if (APPLY) await payload.create({ collection: 'products', data })
        created++
      }
    } catch (err) {
      errors.push(`Row ${r} (${sku}): ${String(err)}`)
    }
  }

  console.log('─── RESULT ───────────────────────────────────────')
  console.log(`Updated existing:  ${updated}`)
  console.log(`Created new:       ${created}`)
  console.log(`Held (not created): ${held.length}`)
  console.log(`SKU renames:       ${skuRenames.length}`)
  console.log(`Prices written:    ${priceWritten.length}`)
  console.log(`Prices kept (quote-only): ${priceSkipped.length}`)
  console.log(`Materials created: ${createdMaterials.length} -> ${[...new Set(createdMaterials)].join(', ') || '-'}`)
  console.log(`Materials merged:  ${mergedMaterials.size} -> ${[...mergedMaterials].join('; ') || '-'}`)
  console.log(`Applications created: ${createdApplications.length} -> ${[...new Set(createdApplications)].join(', ') || '-'}`)
  console.log(`\nHELD products (${held.length}):`); held.forEach((l) => console.log('  ' + l))
  console.log(`\nQuote-only prices kept (${priceSkipped.length}):`); priceSkipped.forEach((l) => console.log('  ' + l))
  if (errors.length) { console.log(`\nERRORS (${errors.length}):`); errors.forEach((e) => console.log('  ' + e)) }
  console.log(`\n${APPLY ? 'APPLIED.' : 'DRY RUN complete — re-run with --apply to write.'}`)
  process.exit(errors.length ? 1 : 0)
}
main().catch((e) => { console.error(e); process.exit(1) })
