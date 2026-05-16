// app/api/admin/cleanup-empty-search-logs/route.ts
//
// One-off admin cleanup. Deletes Search Log rows whose `query` is blank — left
// behind by an earlier bug where landing on /products with no filters active
// still wrote a log entry. Safe to call repeatedly; second run does nothing.
//
// REMOVE this file once GH confirms the log is clean. Tracked in TODOS.md.

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAdminSession } from '@/lib/auth/admin-session'

export async function POST(req: NextRequest) {
  if (!(await getAdminSession(req.headers))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const payload = await getPayload({ config })

  const { docs, totalDocs } = await payload.find({
    collection: 'searchLogs',
    where: { query: { equals: '' } },
    limit: 5000,
    depth: 0,
    overrideAccess: true,
  })

  let deleted = 0
  for (const doc of docs) {
    try {
      await payload.delete({ collection: 'searchLogs', id: doc.id, overrideAccess: true })
      deleted++
    } catch (err) {
      console.error('[cleanup-empty-search-logs] failed to delete', doc.id, err)
    }
  }

  return NextResponse.json({ ok: true, found: totalDocs, deleted })
}
