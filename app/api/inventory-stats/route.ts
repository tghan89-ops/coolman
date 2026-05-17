// app/api/inventory-stats/route.ts — feeds the home "quiet door" stat tiles.
// Public, no auth. Cached for ~5 minutes via the Next.js fetch revalidate hint
// and an explicit Cache-Control header. Live values come from the DB; values
// that V1 cannot compute live (on-time %, dispatch cutoff) read from Settings
// where Alan types them in.

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const revalidate = 300

export async function GET() {
  const payload = await getPayload({ config })

  const [productsTotal, productsAsc, productsDesc, contractorsActive, settings] = await Promise.all([
    payload.find({ collection: 'products', limit: 0, overrideAccess: true }),
    payload.find({
      collection: 'products',
      where: { diameterMm: { exists: true } },
      sort: 'diameterMm',
      limit: 1,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'products',
      where: { diameterMm: { exists: true } },
      sort: '-diameterMm',
      limit: 1,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'contractors',
      where: { deactivated_at: { exists: false } },
      limit: 0,
      overrideAccess: true,
    }),
    payload.findGlobal({ slug: 'settings', overrideAccess: true }) as Promise<Record<string, any>>,
  ])

  const diameterMin = (productsAsc.docs[0] as any)?.diameterMm ?? null
  const diameterMax = (productsDesc.docs[0] as any)?.diameterMm ?? null

  return NextResponse.json(
    {
      skuCount: productsTotal.totalDocs,
      diameterMin,
      diameterMax,
      activeAccounts: contractorsActive.totalDocs,
      onTimePct: settings?.inventory_on_time_pct ?? null,
      dispatchCutoff: settings?.inventory_dispatch_cutoff ?? null,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    },
  )
}
