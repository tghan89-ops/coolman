// app/(frontend)/account/page.tsx
//
// Server component. Reads the logged-in contractor's real orders from Payload
// (not a static fixture) and hands them to the AccountClient for rendering.
// Filtering by `contractor` relation uses the numeric-coerced ID — Postgres
// integer PKs reject string IDs at the query layer.

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { AccountClient, type AccountOrder } from './AccountClient'

export const dynamic = 'force-dynamic'

function titleCase(s: string) {
  if (!s) return 'Pending'
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default async function AccountPage() {
  const hdrs = await headers()
  let orders: AccountOrder[] = []

  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: hdrs })
    if (user && (user as any).collection === 'contractors') {
      const rawId = (user as any).id
      const contractorId: string | number =
        typeof rawId === 'string' && /^\d+$/.test(rawId) ? Number(rawId) : rawId

      const result = await payload.find({
        collection: 'orders',
        where: { contractor: { equals: contractorId } },
        depth: 1,
        sort: '-submitted_at',
        limit: 100,
        overrideAccess: false,
        user,
      } as any)

      orders = result.docs.map((o: any) => {
        const productRel = o.product
        const productName =
          productRel && typeof productRel === 'object' ? productRel.name ?? 'Product' : 'Product'
        const productSku =
          productRel && typeof productRel === 'object' ? productRel.sku ?? '' : ''
        const perUnit = Number(o.effective_price_at_submit ?? 0)
        const qty = Number(o.quantity ?? 1)
        return {
          id: String(o.id),
          product: { name: productName, sku: productSku },
          quantity: qty,
          effectivePrice: perUnit * qty,
          status: titleCase(String(o.order_status ?? 'pending')) as AccountOrder['status'],
          submittedAt: o.submitted_at,
        }
      })
    }
  } catch (err) {
    console.error('[account/page] failed to load orders', err)
    orders = []
  }

  return <AccountClient orders={orders} />
}
