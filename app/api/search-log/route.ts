// app/api/search-log/route.ts
//
// Fire-and-forget catalogue search logging. The client POSTs the active filter
// set + result count after each search; we acknowledge immediately (202) and do
// the DB write in the background via `after()` so the shopper never waits on it.
// A failed write is swallowed — analytics must never break the catalogue.
//
// Two modes:
//   1. Search event   — body has `query` (+ optional resultCount/viewedProductIds)
//                       → creates a new searchLogs row.
//   2. Product view   — body has `viewedProductId` (singular)
//                       → appends to the contractor's most recent search row
//                         from the last 10 min (so it reads "searched X then
//                         viewed Y"). Falls back to creating a minimal row if
//                         no recent search exists.

import { NextRequest, NextResponse } from 'next/server'
import { after } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const ATTACH_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const SUMMARY_MAX = 500

// Look up product names for a list of product IDs and return them as a
// comma-separated string in the same order as the input. Missing products are
// silently dropped. We pull `name` because Products uses it as `useAsTitle` —
// it's the human-readable label admins recognise.
async function buildSummary(payload: any, ids: string[]): Promise<string> {
  const cleaned = ids.filter((id) => typeof id === 'string' && id.length > 0)
  if (cleaned.length === 0) return ''
  try {
    const { docs } = await payload.find({
      collection: 'products',
      where: { id: { in: cleaned } },
      limit: 50,
      depth: 0,
      overrideAccess: true,
    })
    const byId = new Map<string, string>()
    for (const d of docs as Array<{ id: string | number; name?: string; sku?: string }>) {
      const label = d.name || d.sku || String(d.id)
      byId.set(String(d.id), label)
    }
    const names = cleaned.map((id) => byId.get(String(id))).filter(Boolean) as string[]
    return names.join(', ').slice(0, SUMMARY_MAX)
  } catch {
    return ''
  }
}

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
  const viewedProductId: string | null =
    typeof body?.viewedProductId === 'string' && body.viewedProductId.length > 0
      ? body.viewedProductId.slice(0, 64)
      : null

  // Nothing worth logging.
  if (!query && resultCount === 0 && viewedProductIds.length === 0 && !viewedProductId) {
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

      // Product-view ping: only meaningful for logged-in contractors. Anonymous
      // product views are dropped to avoid polluting the log with rows that
      // carry no attribution.
      if (viewedProductId && !query && resultCount === 0 && viewedProductIds.length === 0) {
        if (!contractorId) return
        const since = new Date(Date.now() - ATTACH_WINDOW_MS).toISOString()
        const { docs } = await payload.find({
          collection: 'searchLogs',
          where: {
            and: [
              { contractor: { equals: contractorId } },
              { createdAt: { greater_than: since } },
            ],
          },
          sort: '-createdAt',
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        const last = docs[0] as any
        if (last) {
          const existing: Array<{ productId?: string }> = Array.isArray(last.viewed_product_ids)
            ? last.viewed_product_ids
            : []
          const already = existing.some((row) => row?.productId === viewedProductId)
          if (!already) {
            const nextIds = [...existing.map((r) => r.productId).filter(Boolean) as string[], viewedProductId]
            const summary = await buildSummary(payload, nextIds)
            await payload.update({
              collection: 'searchLogs',
              id: last.id,
              data: {
                viewed_product_ids: [...existing, { productId: viewedProductId }],
                viewed_products_summary: summary,
              } as any,
              overrideAccess: true,
            })
          }
          return
        }
        // Logged-in contractor opened a product with no recent search — write
        // a minimal row so the view still shows up tied to their account.
        const minimalSummary = await buildSummary(payload, [viewedProductId])
        await payload.create({
          collection: 'searchLogs',
          data: {
            query: '',
            query_normalized: '',
            result_count: 0,
            contractor: contractorId,
            viewed_product_ids: [{ productId: viewedProductId }],
            viewed_products_summary: minimalSummary,
          } as any,
          overrideAccess: true,
        })
        return
      }

      // Normal search event → fresh row.
      const eventSummary = viewedProductIds.length
        ? await buildSummary(payload, viewedProductIds)
        : ''
      await payload.create({
        collection: 'searchLogs',
        data: {
          query,
          query_normalized: normalize(query),
          result_count: resultCount,
          ...(contractorId ? { contractor: contractorId } : {}),
          ...(viewedProductIds.length
            ? {
                viewed_product_ids: viewedProductIds.map((productId) => ({ productId })),
                viewed_products_summary: eventSummary,
              }
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
