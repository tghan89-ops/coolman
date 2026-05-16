// app/api/admin/orders/[id]/acknowledge/route.ts
//
// One-tap "Acknowledge" for Alan. This is a STATUS CHANGE on an existing
// order — not an order create — so it deliberately does NOT check the
// `orders_paused` kill switch (that switch only gates new submissions).
// Admin-only: requires a valid `adminUsers` session.

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAdminSession } from '@/lib/auth/admin-session'

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession(req.headers)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await ctx.params
  if (!id) {
    return NextResponse.json({ error: 'Order id required' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  let existing: { order_status?: string } | null = null
  try {
    existing = (await payload.findByID({ collection: 'orders', id, overrideAccess: true })) as any
  } catch {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
  if (!existing) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  // Only a pending order can be acknowledged. Anything further along is a no-op
  // returned as-is so a double-tap is harmless.
  if (existing.order_status !== 'pending') {
    return NextResponse.json({ order: existing, unchanged: true }, { status: 200 })
  }

  try {
    const updated = await payload.update({
      collection: 'orders',
      id,
      data: {
        order_status: 'acknowledged',
        acknowledged_at: new Date().toISOString(),
      } as any,
      overrideAccess: true,
    })
    return NextResponse.json({ order: updated }, { status: 200 })
  } catch (err) {
    console.error('[admin/orders/acknowledge]', err)
    return NextResponse.json({ error: 'Could not acknowledge order. Please try again.' }, { status: 500 })
  }
}
