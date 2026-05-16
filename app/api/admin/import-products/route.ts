// app/api/admin/import-products/route.ts
//
// Admin-only bulk product CSV importer. Accepts a multipart upload with a
// single `file` field (text/csv), runs it through the parse → validate → upsert
// pipeline in lib/import/csv-products.ts, and returns a row-by-row summary.
//
// V1 has no admin UI page for this — Alan posts the file via curl or a small
// internal helper. The shape of the response is stable so a UI can be wired
// later without touching this route.

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAdminSession } from '@/lib/auth/admin-session'
import { parseProductCsv, importProducts } from '@/lib/import/csv-products'

const MAX_CSV_BYTES = 2 * 1024 * 1024 // 2 MB — generous for thousands of rows of text

export async function POST(req: NextRequest) {
  if (!(await getAdminSession(req.headers))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data with a "file" field' }, { status: 400 })
  }

  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing "file" field' }, { status: 400 })
  }
  if (file.size > MAX_CSV_BYTES) {
    return NextResponse.json(
      { error: `CSV too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Max 2 MB.` },
      { status: 413 },
    )
  }

  const text = await file.text()
  const rows = parseProductCsv(text)
  if (rows.length === 0) {
    return NextResponse.json({ error: 'CSV had no data rows' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const summary = await importProducts(rows, payload)
  return NextResponse.json(summary, { status: 200 })
}
