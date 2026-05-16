// app/api/search-log/route.ts
//
// Fire-and-forget catalogue search logging. The client POSTs the active filter
// set + result count after each search; we acknowledge immediately (202) and do
// the DB write in the background via `after()` so the shopper never waits on it.
// A failed write is swallowed — analytics must never break the catalogue.

import { NextRequest, NextResponse } from 'next/server'
import { after } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

function normalize(q: string): string {
  return q
    .toLowerCase()
    .normalize('NFD')
    // Strip Unicode combining marks (accents). Escaped form is encoding-safe —
    // a literal-range regex breaks if the file gets re-saved as anything other
    // than UTF-8 or a tool normalizes the source.
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function POST(req: NextRequest) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const query: string = typeof body?.query === 'string' ? body.query.slice(0, 500) : ''
  const resultCount: number =
    typeof body?.resultCount === 'number' && Number.isFinite(body.resultCount)
      ? Math.max(0, Math.trunc(body.resultCount))
      : 0
  const viewedProductIds: string[] = Array.isArray(body?.viewedProductIds)
    ? body.viewedProductIds.filter((x: unknown) => typeof x === 'string').slice(0, 20)
    : []

  // Empty query AND no result info → nothing worth logging.
  if (!query && resultCount === 0 && viewedProductIds.length === 0) {
    return NextResponse.json({ ok: true, skipped: true }, { status: 202 })
  }

  // Try to attribute to a logged-in contractor, but never block on it.
  // Use payload.auth() directly — an internal fetch to /api/contractors/me
  // is unreliable on Vercel because NEXT_PUBLIC_SERVER_URL falls back to
  // localhost in production and the call silently fails (same trap burned on
  // /api/orders/submit, see LEARNINGS.md 2026-05-16).
  let contractorId: string | number | null = null
  try {
    const payloadEarly = await getPayload({ config })
    const { user } = await payloadEarly.auth({ headers: req.headers })
    if (user && (user as any).collection === 'contractors' && user.id) {
      const rawId = user.id as string | number
      contractorId =
        typeof rawId === 'string' && /^\d+$/.test(rawId) ? Number(rawId) : rawId
    }
  } catch {
    /* anonymous search — fine */
  }

  after(async () => {
    try {
      const payload = await getPayload({ config })
      await payload.create({
        collection: 'searchLogs',
        data: {
          query,
          query_normalized: normalize(query),
          result_count: resultCount,
          ...(contractorId ? { contractor: contractorId } : {}),
          ...(viewedProductIds.length
            ? { viewed_product_ids: viewedProductIds.map((productId) => ({ productId })) }
            : {}),
        } as any,
        overrideAccess: true,
      })
    } catch (err) {
      console.error('[search-log] write failed (non-fatal)', err)
    }
  })

  return NextResponse.json({ ok: true }, { status: 202 })
}
