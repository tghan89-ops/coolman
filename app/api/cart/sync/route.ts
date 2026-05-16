import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as nextHeaders } from 'next/headers'
import { calculateEffectivePrice } from '@/lib/pricing/calculate'

interface ItemInput { productId: string | number; quantity: number }

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config })
  const hdrs = (req.headers ?? (await nextHeaders())) as any
  const session = await payload.auth({ headers: hdrs })
  const user = (session as any)?.user
  if (!user || user.collection !== 'contractors')
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: { items?: ItemInput[] } = {}
  try { body = await req.json() } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }) }
  const local = Array.isArray(body.items) ? body.items : []

  const cartRes = await payload.find({
    collection: 'carts',
    where: { contractor: { equals: user.id } },
    limit: 1,
    depth: 2,
  })
  const existing = cartRes.docs[0] ?? null

  const merged = new Map<string, number>()
  for (const r of existing?.items ?? []) {
    const pid = String(typeof r.product === 'object' ? r.product.id : r.product)
    merged.set(pid, (merged.get(pid) ?? 0) + Math.max(1, Math.floor(Number(r.quantity))))
  }
  for (const r of local) {
    const pid = String(r.productId)
    const qty = Math.max(1, Math.floor(Number(r.quantity)))
    if (!Number.isFinite(qty)) continue
    merged.set(pid, (merged.get(pid) ?? 0) + qty)
  }

  if (local.length === 0) {
    const fresh = await payload.findByID({ collection: 'contractors', id: user.id })
    const tierDiscountPct = Number((fresh as any).tier_discount_pct ?? 0)
    const items = (existing?.items ?? []).map((r: any) => ({
      productId: String(typeof r.product === 'object' ? r.product.id : r.product),
      name: typeof r.product === 'object' ? r.product.name : '',
      sku: typeof r.product === 'object' ? r.product.sku : '',
      imageUrl:
        typeof r.product === 'object' && typeof r.product.image === 'object'
          ? r.product.image?.url ?? null
          : null,
      listPrice: Number(typeof r.product === 'object' ? r.product.listPrice : 0),
      quantity: Math.max(1, Math.floor(Number(r.quantity))),
      addedAt: r.added_at,
    }))
    let subtotalList = 0
    let subtotalEffective = 0
    for (const it of items) {
      const pricing = calculateEffectivePrice(it.listPrice, tierDiscountPct, 0)
      subtotalList += it.listPrice * it.quantity
      subtotalEffective += pricing.effectivePrice * it.quantity
    }
    return NextResponse.json({ items, tierDiscountPct, subtotalList, subtotalEffective })
  }

  // fetch contractor tier discount
  const contractorFresh = await payload.findByID({ collection: 'contractors', id: user.id })
  const tierDiscountPct = Number((contractorFresh as any).tier_discount_pct ?? 0)

  // validate and collect product objects while building DB rows
  const validatedItems: Array<{ product: number; quantity: number; added_at: string }> = []
  const productMap = new Map<string, any>()
  const addedAtMap = new Map<string, string>()
  const now = new Date().toISOString()
  for (const [productId, quantity] of merged) {
    const product = await payload.findByID({ collection: 'products', id: productId }).catch(() => null)
    if (!product) continue
    const pid = String(product.id)
    productMap.set(pid, product)
    addedAtMap.set(pid, now)
    validatedItems.push({
      product: Number(product.id),
      quantity,
      added_at: now,
    })
  }

  if (existing) {
    await payload.update({ collection: 'carts', id: existing.id, data: { items: validatedItems } })
  } else {
    await payload.create({ collection: 'carts', data: { contractor: user.id, items: validatedItems } })
  }

  // build response from in-memory validated data (avoids a stale re-fetch in tests)
  let subtotalList = 0
  let subtotalEffective = 0
  const items = validatedItems.map((r) => {
    const p = productMap.get(String(r.product))
    const listPrice = Number(p?.listPrice ?? 0)
    const qty = Math.max(1, Math.floor(Number(r.quantity)))
    const pricing = calculateEffectivePrice(listPrice, tierDiscountPct, 0)
    subtotalList += listPrice * qty
    subtotalEffective += pricing.effectivePrice * qty
    return {
      productId: String(r.product),
      name: p?.name ?? '',
      sku: p?.sku ?? '',
      imageUrl: typeof p?.image === 'object' && p?.image?.url ? p.image.url : null,
      listPrice,
      quantity: qty,
      addedAt: r.added_at,
    }
  })
  return NextResponse.json({ items, tierDiscountPct, subtotalList, subtotalEffective })
}
