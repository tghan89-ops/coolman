/**
 * Import corrected product data from an Excel file into the Payload CMS.
 *
 * For each row in the "Products" sheet:
 *   - Matches the product by SKU (case-insensitive)
 *   - Resolves category / machineTier / materials / applications by name
 *   - Creates any missing taxonomy entries (category, material, application)
 *     with sensible BM placeholders
 *   - Updates the product record
 *   - Skips rows whose SKU does not exist in the CMS
 *
 * Known name aliases handled automatically:
 *   - "RC" → "Reinforced Concrete"
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/import-products-excel.ts [path/to/file.xlsx]
 *
 * Defaults to: docs/Catalog/products-export-CORRECTED.xlsx
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import ExcelJS from 'exceljs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FILE_ARG = process.argv[2]
const FILE = FILE_ARG
  ? path.resolve(FILE_ARG)
  : path.resolve(__dirname, '../../docs/Catalog/products-export-CORRECTED.xlsx')

// ─── BM translations for new taxonomy entries ─────────────────────────────────
// If a name doesn't exist in the CMS it will be created with these BM defaults.
const BM_TRANSLATIONS: Record<string, string> = {
  // Categories
  'TCT Saw Blades': 'Mata Gergaji TCT',
  // Materials
  Brick: 'Bata',
  Masonry: 'Tembok',
  Ceramic: 'Seramik',
  Glass: 'Kaca',
  Porcelain: 'Porselin',
  // Applications
  'Anchor Setting': 'Pemasangan Angkur',
  'Surface Treatment': 'Rawatan Permukaan',
  'Tile Cutting': 'Pemotongan Jubin',
  'Tile Drilling': 'Penggerudian Jubin',
  'Tuck Pointing': 'Tuck Pointing',
  'Wet/Dry Cutting': 'Pemotongan Basah/Kering',
}

// Known aliases: what staff wrote → canonical CMS name
const MATERIAL_ALIASES: Record<string, string> = {
  RC: 'Reinforced Concrete',
}

// ─── Taxonomy cache ───────────────────────────────────────────────────────────

type TaxDoc = { id: number; name: string }
type TaxMap = Map<string, number> // lowercase name → id

async function loadTax(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: 'categories' | 'materials' | 'applications' | 'machineTiers',
): Promise<TaxMap> {
  const result = await payload.find({ collection, limit: 500, depth: 0 })
  const map: TaxMap = new Map()
  for (const doc of result.docs as TaxDoc[]) {
    map.set(doc.name.toLowerCase(), doc.id)
  }
  return map
}

async function ensureTax(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: 'categories' | 'materials' | 'applications' | 'machineTiers',
  map: TaxMap,
  name: string,
  created: string[],
): Promise<number | null> {
  if (!name) return null
  const key = name.toLowerCase()
  if (map.has(key)) return map.get(key)!

  const nameBM = BM_TRANSLATIONS[name] ?? name
  const doc = await payload.create({
    collection,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { name, nameBM } as any,
  })
  const id = (doc as unknown as TaxDoc).id
  map.set(key, id)
  created.push(`  + Created ${collection}: "${name}" (BM: "${nameBM}")`)
  return id
}

// ─── Excel helpers ────────────────────────────────────────────────────────────

function cellStr(row: ExcelJS.Row, col: number): string {
  const v = row.getCell(col).value
  if (v === null || v === undefined) return ''
  return String(v).trim()
}

function cellNum(row: ExcelJS.Row, col: number): number | null {
  const v = row.getCell(col).value
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return isNaN(n) ? null : n
}

function splitNames(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Reading: ${FILE}`)
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(FILE)
  const ws = wb.getWorksheet('Products')
  if (!ws) throw new Error('No "Products" sheet found in the Excel file.')

  const payload = await getPayload({ config })

  // Load taxonomy maps
  const catMap = await loadTax(payload, 'categories')
  const matMap = await loadTax(payload, 'materials')
  const appMap = await loadTax(payload, 'applications')
  const tierMap = await loadTax(payload, 'machineTiers')

  // Load all existing products (SKU → id)
  const prodResult = await payload.find({ collection: 'products', limit: 5000, depth: 0 })
  const skuMap = new Map<string, number>()
  for (const p of prodResult.docs) {
    skuMap.set((p.sku as string).toLowerCase(), p.id as number)
  }
  console.log(`Loaded ${skuMap.size} products from CMS.`)

  // ── Process rows ────────────────────────────────────────────────────────────
  const created: string[] = []
  let updated = 0
  let skipped = 0
  const errors: string[] = []
  const notFound: string[] = []

  const totalRows = ws.rowCount - 1
  let processed = 0

  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r)
    const sku = cellStr(row, 1)
    if (!sku) continue

    processed++
    if (processed % 25 === 0) console.log(`  … ${processed}/${totalRows}`)

    const productId = skuMap.get(sku.toLowerCase())
    if (!productId) {
      notFound.push(sku)
      skipped++
      continue
    }

    try {
      // Resolve category
      const catName = cellStr(row, 6)
      const catId = catName
        ? await ensureTax(payload, 'categories', catMap, catName, created)
        : undefined

      // Resolve machine tier
      const tierName = cellStr(row, 7)
      const tierId = tierName ? tierMap.get(tierName.toLowerCase()) ?? null : undefined

      // Resolve list price
      const listPrice = cellNum(row, 8)

      // Resolve materials (with alias expansion)
      const rawMats = splitNames(cellStr(row, 9))
      const matIds: number[] = []
      for (const m of rawMats) {
        const canonical = MATERIAL_ALIASES[m] ?? m
        const id = await ensureTax(payload, 'materials', matMap, canonical, created)
        if (id) matIds.push(id)
      }

      // Resolve applications
      const rawApps = splitNames(cellStr(row, 10))
      const appIds: number[] = []
      for (const a of rawApps) {
        const id = await ensureTax(payload, 'applications', appMap, a, created)
        if (id) appIds.push(id)
      }

      // Scalar fields
      const name = cellStr(row, 2) || undefined
      const nameBM = cellStr(row, 3) || undefined
      const description = cellStr(row, 4) || undefined
      const descriptionBM = cellStr(row, 5) || undefined
      const diameter = cellStr(row, 11) || undefined
      const arborSize = cellStr(row, 12) || undefined
      const segmentHeight = cellStr(row, 13) || undefined
      const bondTypeRaw = cellStr(row, 14)
      const bondType =
        bondTypeRaw && ['soft', 'medium', 'hard', 'extraHard'].includes(bondTypeRaw)
          ? (bondTypeRaw as 'soft' | 'medium' | 'hard' | 'extraHard')
          : undefined
      const maxRPM = cellStr(row, 15) || undefined
      const youtubeUrl = cellStr(row, 16) || undefined

      // Build update payload — only include fields that have a value
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: Record<string, any> = {}
      if (name !== undefined) data.name = name
      if (nameBM !== undefined) data.nameBM = nameBM
      if (description !== undefined) data.description = description
      if (descriptionBM !== undefined) data.descriptionBM = descriptionBM
      if (catId !== undefined && catId !== null) data.category = catId
      if (tierId !== undefined && tierId !== null) data.machineTier = tierId
      if (listPrice !== null) data.listPrice = listPrice
      if (matIds.length > 0) data.materials = matIds
      if (appIds.length > 0) data.applications = appIds
      if (diameter !== undefined) data.diameter = diameter
      if (arborSize !== undefined) data.arborSize = arborSize
      if (segmentHeight !== undefined) data.segmentHeight = segmentHeight
      if (bondType !== undefined) data.bondType = bondType
      if (maxRPM !== undefined) data.maxRPM = maxRPM
      if (youtubeUrl !== undefined) data.youtubeUrl = youtubeUrl

      await payload.update({ collection: 'products', id: productId, data })
      updated++
    } catch (err) {
      errors.push(`Row ${r} (${sku}): ${String(err)}`)
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  console.log('\n─── Import complete ───────────────────────────────')
  console.log(`✓ Updated:  ${updated} products`)
  console.log(`  Skipped:  ${skipped} (SKU not found in CMS)`)
  if (created.length) {
    console.log(`\nNew taxonomy entries created (${created.length}):`)
    created.forEach((l) => console.log(l))
  }
  if (notFound.length) {
    console.log(`\nSKUs not found in CMS (${notFound.length}):`)
    notFound.forEach((s) => console.log(`  - ${s}`))
  }
  if (errors.length) {
    console.log(`\n✗ Errors (${errors.length}):`)
    errors.forEach((e) => console.log(`  ${e}`))
  }
  process.exit(errors.length ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
