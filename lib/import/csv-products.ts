// lib/import/csv-products.ts
//
// Admin-only bulk product importer. Designed for Alan to upload a CSV of new
// or updated products without clicking through the form 100 times.
//
// Pipeline:
//   parseProductCsv(raw)      → rows (header-keyed objects)
//   validateProductRow(row)   → { ok | errors[] }
//   importProducts(rows, p)   → per-row { sku, action: 'created' | 'updated' | 'skipped', errors? }
//
// Validation enforces the brief's "EN + BM required" rule and rejects obvious
// garbage (missing SKU, non-numeric price). The actual create/update goes
// through Payload's local API, so any further collection-level validation
// (FK lookups, access rules) still runs.

import type { Payload } from 'payload'

export interface ProductCsvRow {
  sku: string
  name: string
  nameBM: string
  description: string
  descriptionBM: string
  listPrice: string
  // Optional / lookup-resolved
  category?: string
  machineTier?: string
  diameter?: string
  arborSize?: string
  segmentHeight?: string
  bondType?: string
  maxRPM?: string
  youtubeUrl?: string
  [key: string]: string | undefined
}

export interface RowValidationError {
  field: string
  message: string
}

export interface RowImportResult {
  sku: string
  action: 'created' | 'updated' | 'skipped'
  errors?: RowValidationError[]
}

export interface ImportSummary {
  total: number
  created: number
  updated: number
  skipped: number
  rows: RowImportResult[]
}

/**
 * Minimal RFC-4180 parser. Handles:
 *  - quoted fields with embedded commas, newlines, and "" escaped quotes
 *  - trailing newline at EOF
 *  - CRLF or LF line endings
 * Returns header-keyed row objects.
 */
export function parseProductCsv(raw: string): ProductCsvRow[] {
  const rows: string[][] = []
  let field = ''
  let row: string[] = []
  let inQuotes = false
  let i = 0

  while (i < raw.length) {
    const c = raw[i]
    if (inQuotes) {
      if (c === '"' && raw[i + 1] === '"') { field += '"'; i += 2; continue }
      if (c === '"') { inQuotes = false; i += 1; continue }
      field += c; i += 1; continue
    }
    if (c === '"') { inQuotes = true; i += 1; continue }
    if (c === ',') { row.push(field); field = ''; i += 1; continue }
    if (c === '\r' && raw[i + 1] === '\n') { row.push(field); rows.push(row); field = ''; row = []; i += 2; continue }
    if (c === '\n' || c === '\r') { row.push(field); rows.push(row); field = ''; row = []; i += 1; continue }
    field += c; i += 1
  }
  // Flush last field/row if file did not end with a newline
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  if (rows.length === 0) return []
  const header = rows[0].map((h) => h.trim())
  const out: ProductCsvRow[] = []
  for (let r = 1; r < rows.length; r += 1) {
    const cells = rows[r]
    // Skip wholly empty lines (common at EOF)
    if (cells.length === 1 && cells[0].trim() === '') continue
    const obj: ProductCsvRow = { sku: '', name: '', nameBM: '', description: '', descriptionBM: '', listPrice: '' }
    for (let h = 0; h < header.length; h += 1) {
      obj[header[h]] = (cells[h] ?? '').trim()
    }
    out.push(obj)
  }
  return out
}

export function validateProductRow(row: ProductCsvRow): RowValidationError[] {
  const errors: RowValidationError[] = []
  const requireText = (key: keyof ProductCsvRow, label: string) => {
    const v = row[key]
    if (!v || String(v).trim().length === 0) errors.push({ field: String(key), message: `${label} is required` })
  }
  requireText('sku', 'SKU')
  requireText('name', 'English name (name)')
  requireText('nameBM', 'Bahasa Melayu name (nameBM)')
  requireText('description', 'English description (description)')
  requireText('descriptionBM', 'Bahasa Melayu description (descriptionBM)')

  const price = Number(row.listPrice)
  if (!Number.isFinite(price)) {
    errors.push({ field: 'listPrice', message: 'List price must be a number' })
  } else if (price < 0) {
    errors.push({ field: 'listPrice', message: 'List price cannot be negative' })
  }

  if (row.youtubeUrl && row.youtubeUrl.length > 0 && !/^https?:\/\//i.test(row.youtubeUrl)) {
    errors.push({ field: 'youtubeUrl', message: 'YouTube URL must start with http(s)://' })
  }

  return errors
}

/**
 * Bulk upsert. Matches existing products by SKU; creates new, updates existing.
 * Rows with validation errors are skipped (not partially written) and reported.
 *
 * NOTE: This only handles scalar fields. Relations (category, materials,
 * applications, machineTier, image, photos, relatedProducts) are intentionally
 * left to the admin form for V1 — the CSV is for catalogue text+price, not
 * media/taxonomy wiring.
 */
export async function importProducts(rows: ProductCsvRow[], payload: Payload): Promise<ImportSummary> {
  const results: RowImportResult[] = []
  let created = 0
  let updated = 0
  let skipped = 0

  for (const row of rows) {
    const errors = validateProductRow(row)
    if (errors.length > 0) {
      results.push({ sku: row.sku || '(no sku)', action: 'skipped', errors })
      skipped += 1
      continue
    }

    // Normalize SKU to uppercase on both sides of the lookup so a re-upload
    // with different casing ("a1" vs "A1") updates the same product instead
    // of silently creating a duplicate.
    const skuNormalized = row.sku.toUpperCase()

    const existing = await payload.find({
      collection: 'products',
      where: { sku: { equals: skuNormalized } },
      limit: 1,
      overrideAccess: true,
    })

    const data: Record<string, unknown> = {
      sku: skuNormalized,
      name: row.name,
      nameBM: row.nameBM,
      description: row.description,
      descriptionBM: row.descriptionBM,
      listPrice: Number(row.listPrice),
    }
    if (row.diameter) data.diameter = row.diameter
    if (row.arborSize) data.arborSize = row.arborSize
    if (row.segmentHeight) data.segmentHeight = row.segmentHeight
    if (row.bondType) data.bondType = row.bondType
    if (row.maxRPM) {
      const rpm = Number(row.maxRPM)
      if (Number.isFinite(rpm) && rpm > 0) data.maxRPM = rpm
    }
    if (row.youtubeUrl) data.youtubeUrl = row.youtubeUrl

    try {
      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'products',
          id: (existing.docs[0] as { id: string }).id,
          data,
          overrideAccess: true,
        })
        results.push({ sku: row.sku, action: 'updated' })
        updated += 1
      } else {
        await payload.create({
          collection: 'products',
          data,
          overrideAccess: true,
        })
        results.push({ sku: row.sku, action: 'created' })
        created += 1
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      results.push({ sku: row.sku, action: 'skipped', errors: [{ field: '_', message: msg }] })
      skipped += 1
    }
  }

  return { total: rows.length, created, updated, skipped, rows: results }
}
