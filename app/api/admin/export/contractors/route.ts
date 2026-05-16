// app/api/admin/export/contractors/route.ts — Excel export of customer accounts. Admin-only.

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAdminSession } from '@/lib/auth/admin-session'
import { xlsxResponse } from '@/lib/admin/xlsx'

export async function GET(req: NextRequest) {
  if (!(await getAdminSession(req.headers))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'contractors', limit: 10000, sort: 'companyName', overrideAccess: true })

  const rows = docs.map((c: Record<string, any>) => ({
    company: c.companyName ?? '',
    email: c.email ?? '',
    phone: c.phone ?? '',
    tier_discount_pct: c.tier_discount_pct ?? 0,
    tier_discount_label: `${((c.tier_discount_pct ?? 0) * 100).toFixed(((c.tier_discount_pct ?? 0) * 100) % 1 === 0 ? 0 : 1)}%`,
    email_verified: c.email_verified_at ? 'YES' : 'no',
    status: c.deactivated_at ? 'deactivated' : 'active',
    delivery_address: c.deliveryAddress ?? '',
    created_at: c.createdAt ? new Date(c.createdAt).toISOString() : '',
  }))

  return xlsxResponse('Customers', [
    { header: 'Company', key: 'company', width: 30 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Phone', key: 'phone', width: 18 },
    { header: 'Tier disc (decimal)', key: 'tier_discount_pct', width: 18 },
    { header: 'Tier disc', key: 'tier_discount_label', width: 10 },
    { header: 'Email verified', key: 'email_verified', width: 14 },
    { header: 'Status', key: 'status', width: 14 },
    { header: 'Delivery address', key: 'delivery_address', width: 34 },
    { header: 'Joined', key: 'created_at', width: 24 },
  ], rows, `coolman-customers-${new Date().toISOString().slice(0, 10)}.xlsx`)
}
