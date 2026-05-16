import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as nextHeaders } from 'next/headers'
import { calculateEffectivePrice } from '@/lib/pricing/calculate'

interface ItemInput {
  productId: string | number
  quantity: number
}

async function resolveContractor(req: Request) {
  const payload = await getPayload({ config })
  const hdrs = (req.headers ?? (await nextHeaders())) as any
  const session = await payload.auth({ headers: hdrs })
  const user = (session as any)?.user
  if (!user || user.collection !== 'contractors') return { payload, user: null }
  const fresh = await payload.findByID({ collection: 'contractors', id: user.id })
  return { payload, user: fresh }
}

async function loadCartRow(payload: any, contractorId: number | string) {
  const res = await payload.find({
    collection: 'carts',
    where: { contractor: { equals: contractorId } },
    depth: 2,
    limit: 1,
  })
  return res.docs[0] ?? null
}

function hydrateItems(
  rows: Array<{ product: any; quantity: number; added_at: string }>,
  tierDiscountPct: number,
) {
  let subtotalList = 0
  let subtotalEffective = 0
  const items = rows.map((r) => {
    const product = typeof r.product === 'object' ? r.product : null
    const listPrice = Number(product?.listPrice ?? 0)
    const qty = Math.max(1, Math.floor(Number(r.quantity)))
    const pricing = calculateEffectivePrice(listPrice, tierDiscountPct, 0)
    subtotalList += listPrice * qty
    subtotalEffective += pricing.effectivePrice * qty
    return {
      productId: String(product?.id ?? r.product),
      name: product?.name ?? '',
      sku: product?.sku ?? '',
      imageUrl:
        typeof product?.image === 'object' && product?.image?.url
          ? product.image.url
          : null,
      listPrice,
      quantity: qty,
      addedAt: r.added_at,
    }
  })
  return { items, subtotalList, subtotalEffective }
}

export async function GET(req: NextRequest) {
  const { payload, user } = await resolveContractor(req)
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const cartRow = await loadCartRow(payload, user.id)
  const tierDiscountPct = Number(user.tier_discount_pct ?? 0)
  const { items, subtotalList, subtotalEffective } = hydrateItems(
    cartRow?.items ?? [],
    tierDiscountPct,
  )
  return NextResponse.json({ items, tierDiscountPct, subtotalList, subtotalEffective })
}

export async function PUT(req: NextRequest) {
  const { payload, user } = await resolveContractor(req)
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: { items?: ItemInput[] } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const inputs = Array.isArray(body.items) ? body.items : []
  for (const it of inputs) {
    if (typeof it !== 'object' || !it) return NextResponse.json({ error: 'invalid_item' }, { status: 400 })
    if (!Number.isFinite(Number(it.quantity)) || Number(it.quantity) < 1)
      return NextResponse.json({ error: 'invalid_quantity' }, { status: 400 })
  }

  const validatedItems = [] as Array<{ product: number; quantity: number; added_at: string }>
  for (const it of inputs) {
    const product = await payload.findByID({ collection: 'products', id: it.productId }).catch(() => null)
    if (!product) return NextResponse.json({ error: 'unknown_product', productId: it.productId }, { status: 400 })
    validatedItems.push({
      product: Number(product.id),
      quantity: Math.max(1, Math.floor(Number(it.quantity))),
      added_at: new Date().toISOString(),
    })
  }

  const existing = await loadCartRow(payload, user.id)
  if (existing) {
    await payload.update({ collection: 'carts', id: existing.id, data: { items: validatedItems } })
  } else {
    await payload.create({
      collection: 'carts',
      data: { contractor: user.id, items: validatedItems },
    })
  }

  const refreshed = await loadCartRow(payload, user.id)
  const tierDiscountPct = Number(user.tier_discount_pct ?? 0)
  const { items, subtotalList, subtotalEffective } = hydrateItems(
    refreshed?.items ?? [],
    tierDiscountPct,
  )
  return NextResponse.json({ items, tierDiscountPct, subtotalList, subtotalEffective })
}
