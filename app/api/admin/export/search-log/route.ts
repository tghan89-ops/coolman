// app/api/admin/export/search-log/route.ts — Excel export of the search log. Admin-only.
//
// PII redaction (Group 13): the search log links to a contractor, but the
// export must NOT carry contractor names or emails. We only emit a boolean
// "logged in?" flag — never the identity. Do not add a contractor column here.

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAdminSession } from '@/lib/auth/admin-session'
import { xlsxResponse } from '@/lib/admin/xlsx'

export async function GET(req: NextRequest) {
  if (!(await getAdminSession(req.headers))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const payload = await getPayload({ config })
  // depth: 0 — never resolve the contractor relationship, so no name/email is loaded.
  const { docs } = await payload.find({ collection: 'searchLogs', limit: 50000, sort: '-createdAt', depth: 0, overrideAccess: true })

  const rows = docs.map((l: Record<string, any>) => ({
    created_at: l.createdAt ? new Date(l.createdAt).toISOString() : '',
    query: l.query ?? '',
    query_normalized: l.query_normalized ?? '',
    result_count: l.result_count ?? 0,
    logged_in: l.contractor ? 'yes' : 'no',
    products_viewed: Array.isArray(l.viewed_product_ids) ? l.viewed_product_ids.length : 0,
    led_to_order: l.submitted_order_id ? 'yes' : 'no',
  }))

  return xlsxResponse('SearchLog', [
    { header: 'When', key: 'created_at', width: 24 },
    { header: 'Query (filters)', key: 'query', width: 40 },
    { header: 'Query (normalised)', key: 'query_normalized', width: 40 },
    { header: 'Results shown', key: 'result_count', width: 14 },
    { header: 'Logged in?', key: 'logged_in', width: 12 },
    { header: 'Products viewed', key: 'products_viewed', width: 16 },
    { header: 'Led to order?', key: 'led_to_order', width: 14 },
  ], rows, `coolman-search-log-${new Date().toISOString().slice(0, 10)}.xlsx`)
}
