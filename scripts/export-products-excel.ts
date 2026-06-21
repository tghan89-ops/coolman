/**
 * Export all products to an Excel file for staff to fill in missing details.
 *
 * Fetches every product from the database (via Payload local API), dumps each
 * row into an Excel sheet with pre-filled values, and adds a second sheet with
 * fill-in instructions.
 *
 * After staff fill in the Excel, the file can be re-imported via:
 *   npx tsx --env-file=.env.local scripts/import-products-excel.ts
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/export-products-excel.ts
 *
 * Output: products-export-YYYY-MM-DD.xlsx in the project root.
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import ExcelJS from 'exceljs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Product, Category, Material, Application, MachineTier } from '../payload-types.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.resolve(__dirname, '..')

// ─── Column definitions ───────────────────────────────────────────────────────

const COLUMNS: Array<{
  header: string
  key: string
  width: number
  required: boolean
  note: string
}> = [
  { header: 'SKU *', key: 'sku', width: 18, required: true, note: 'Unique product code. DO NOT change — used as the row identifier on re-import.' },
  { header: 'Name (EN) *', key: 'name', width: 32, required: true, note: 'English product name shown in the catalogue.' },
  { header: 'Name (BM) *', key: 'nameBM', width: 32, required: true, note: 'Bahasa Melayu product name.' },
  { header: 'Description (EN) *', key: 'description', width: 60, required: true, note: 'English description shown on the product detail page.' },
  { header: 'Description (BM) *', key: 'descriptionBM', width: 60, required: true, note: 'Bahasa Melayu description.' },
  { header: 'Category *', key: 'category', width: 28, required: true, note: 'Exact category name from the admin (e.g. "Diamond Blades").' },
  { header: 'Machine Tier *', key: 'machineTier', width: 22, required: true, note: 'Exact machine tier name (e.g. "Low Power").' },
  { header: 'List Price (MYR) *', key: 'listPrice', width: 18, required: true, note: 'Number only (e.g. 125.50). No currency symbol.' },
  { header: 'Materials', key: 'materials', width: 40, required: false, note: 'Comma-separated list of materials (e.g. "Granite, Concrete"). Must match admin names exactly.' },
  { header: 'Applications', key: 'applications', width: 40, required: false, note: 'Comma-separated list of applications (e.g. "Floor Cutting, Wall Cutting"). Must match admin names exactly.' },
  { header: 'Diameter', key: 'diameter', width: 14, required: false, note: 'Include unit (e.g. "230mm").' },
  { header: 'Arbor Size', key: 'arborSize', width: 14, required: false, note: 'e.g. "22.23mm" or "M14".' },
  { header: 'Segment Height', key: 'segmentHeight', width: 16, required: false, note: 'e.g. "10mm".' },
  { header: 'Bond Type', key: 'bondType', width: 14, required: false, note: 'One of: soft / medium / hard / extraHard' },
  { header: 'Max RPM', key: 'maxRPM', width: 14, required: false, note: 'e.g. "6650 RPM".' },
  { header: 'YouTube URL', key: 'youtubeUrl', width: 40, required: false, note: 'Full YouTube URL (e.g. https://youtube.com/watch?v=...).' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveName(rel: unknown): string {
  if (!rel) return ''
  if (typeof rel === 'object' && rel !== null && 'name' in rel) {
    return (rel as { name: string }).name
  }
  return ''
}

function resolveNames(rel: unknown): string {
  if (!Array.isArray(rel)) return ''
  return rel.map(resolveName).filter(Boolean).join(', ')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const payload = await getPayload({ config })

  console.log('Fetching all products…')
  const result = await payload.find({
    collection: 'products',
    limit: 2000,
    depth: 2,
    sort: 'category,diameterMm,name',
  })

  const products = result.docs as Product[]
  console.log(`Found ${products.length} products.`)

  // ── Build workbook ──────────────────────────────────────────────────────────
  const wb = new ExcelJS.Workbook()
  wb.creator = 'Coolman Export Script'
  wb.created = new Date()

  // ── Sheet 1: Products ───────────────────────────────────────────────────────
  const ws = wb.addWorksheet('Products', {
    views: [{ state: 'frozen', ySplit: 1 }],
  })

  ws.columns = COLUMNS.map((c) => ({
    header: c.header,
    key: c.key,
    width: c.width,
  }))

  // Style header row
  const headerRow = ws.getRow(1)
  headerRow.height = 22
  headerRow.eachCell((cell, colNumber) => {
    const colDef = COLUMNS[colNumber - 1]
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: colDef?.required ? 'FFCC0000' : 'FF2563EB' },
    }
    cell.alignment = { vertical: 'middle', wrapText: false }
    cell.border = {
      bottom: { style: 'medium', color: { argb: 'FF000000' } },
    }
  })

  // Populate data rows
  for (const p of products) {
    ws.addRow({
      sku: p.sku,
      name: p.name,
      nameBM: p.nameBM,
      description: p.description,
      descriptionBM: p.descriptionBM,
      category: resolveName(p.category),
      machineTier: resolveName(p.machineTier),
      listPrice: p.listPrice,
      materials: resolveNames(p.materials),
      applications: resolveNames(p.applications),
      diameter: p.diameter ?? '',
      arborSize: p.arborSize ?? '',
      segmentHeight: p.segmentHeight ?? '',
      bondType: p.bondType ?? '',
      maxRPM: p.maxRPM ?? '',
      youtubeUrl: p.youtubeUrl ?? '',
    })
  }

  // Style data rows — alternate row colour, wrap description cells
  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    const isEven = rowNumber % 2 === 0
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      if (isEven) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF1F5F9' },
        }
      }
      // Wrap long text columns (description cols are 4 and 5)
      if (colNumber === 4 || colNumber === 5) {
        cell.alignment = { wrapText: true, vertical: 'top' }
        row.height = 80
      }
    })
  })

  // Data validation: bondType dropdown
  const bondTypeCol = COLUMNS.findIndex((c) => c.key === 'bondType') + 1
  for (let r = 2; r <= products.length + 1; r++) {
    ws.getCell(r, bondTypeCol).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"soft,medium,hard,extraHard"'],
      showErrorMessage: true,
      errorTitle: 'Invalid value',
      error: 'Must be one of: soft, medium, hard, extraHard',
    }
  }

  // ── Sheet 2: Instructions ───────────────────────────────────────────────────
  const wi = wb.addWorksheet('Instructions')
  wi.columns = [
    { key: 'col', width: 20 },
    { key: 'note', width: 80 },
  ]

  const addHeading = (text: string) => {
    const row = wi.addRow([text, ''])
    row.getCell(1).font = { bold: true, size: 13, color: { argb: 'FF1E3A5F' } }
    row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0EAF8' } }
    wi.mergeCells(row.number, 1, row.number, 2)
    row.height = 20
  }

  const addNote = (col: string, note: string) => {
    const row = wi.addRow([col, note])
    row.getCell(1).font = { bold: true }
    row.getCell(2).alignment = { wrapText: true }
    row.height = 30
  }

  addHeading('How to fill in this spreadsheet')
  wi.addRow(['', ''])
  wi.addRow(['Red header columns', 'Required — must have a value for every product.'])
  wi.addRow(['Blue header columns', 'Optional — fill in as many as possible.'])
  wi.addRow(['SKU column', 'DO NOT change SKU values — they identify each product on re-import.'])
  wi.addRow(['', ''])

  addHeading('Column-by-column guide')
  wi.addRow(['', ''])
  for (const c of COLUMNS) {
    addNote(c.header, c.note)
  }

  wi.addRow(['', ''])
  addHeading('Re-importing')
  wi.addRow(['', 'Save this file as .xlsx and give it to the developer. Products are matched by SKU — existing rows are updated, no new products are created from this file.'])

  // ── Save ────────────────────────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10)
  const outPath = path.join(OUTPUT_DIR, `products-export-${today}.xlsx`)
  await wb.xlsx.writeFile(outPath)

  console.log(`\n✓ Exported ${products.length} products → ${outPath}`)
  console.log('  Red columns  = required fields')
  console.log('  Blue columns = optional fields')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
