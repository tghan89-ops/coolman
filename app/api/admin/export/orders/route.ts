// app/api/admin/export/orders/route.ts — Excel export of all orders. Admin-only.

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAdminSession } from '@/lib/auth/admin-session'
import { xlsxResponse } from '@/lib/admin/xlsx'

const rel = (v: unknown, prop: string): string => {
  if (v && typeof v === 'object') return String((v as Record<string, unknown>)[prop] ?? (v as Record<string, unknown>).id ?? '')
  return v == null ? '' : String(v)
}

export async function GET(req: NextRequest) {
  if (!(await getAdminSession(req.headers))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'orders', limit: 10000, sort: '-submitted_at', depth: 1, overrideAccess: true })

  const rows = docs.map((o: Record<string, any>) => ({
    submitted_at: o.submitted_at ? new Date(o.submitted_at).toISOString() : '',
    company: rel(o.contractor, 'companyName'),
    product: rel(o.product, 'name'),
    quantity: o.quantity ?? '',
    list_price: o.list_price_at_submit ?? '',
    tier_discount_pct: o.tier_discount_pct_at_submit ?? 0,
    promo_discount_pct: o.promo_discount_pct_at_submit ?? 0,
    effective_price_per_unit: o.effective_price_at_submit ?? '',
    order_total: typeof o.effective_price_at_submit === 'number' && typeof o.quantity === 'number' ? o.effective_price_at_submit * o.quantity : '',
    status: o.order_status ?? '',
    acknowledged_at: o.acknowledged_at ? new Date(o.acknowledged_at).toISOString() : '',
    duplicate_flag: o.duplicate_flag ? 'YES' : '',
    delivery_address: o.delivery_address ?? '',
    notes: o.notes ?? '',
  }))

  return xlsxResponse('Orders', [
    { header: 'Submitted', key: 'submitted_at', width: 24 },
    { header: 'Company', key: 'company', width: 28 },
    { header: 'Product', key: 'product', width: 28 },
    { header: 'Qty', key: 'quantity', width: 8 },
    { header: 'List price', key: 'list_price', width: 12 },
    { header: 'Tier disc', key: 'tier_discount_pct', width: 10 },
    { header: 'Promo disc', key: 'promo_discount_pct', width: 10 },
    { header: 'Effective/unit', key: 'effective_price_per_unit', width: 14 },
    { header: 'Order total', key: 'order_total', width: 14 },
    { header: 'Status', key: 'status', width: 14 },
    { header: 'Acknowledged', key: 'acknowledged_at', width: 24 },
    { header: 'Duplicate?', key: 'duplicate_flag', width: 11 },
    { header: 'Delivery address', key: 'delivery_address', width: 32 },
    { header: 'Notes', key: 'notes', width: 32 },
  ], rows, `coolman-orders-${new Date().toISOString().slice(0, 10)}.xlsx`)
}
