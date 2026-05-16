// app/api/orders/submit/route.ts
//
// Architecture: Uses Payload local API (in-process, no HTTP).
// ALL critical checks run in ONE Payload transaction (beginTransaction/commitTransaction).
// This prevents TOCTOU races on duplicate detection and idempotency.
// Email is queued (emailDeliveries row) — NOT sent synchronously.
// The email cron (Group 6) delivers queued emails.

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { calculateEffectivePrice, isWithinDiscountCap, isPriceStale } from '@/lib/pricing/calculate'
import { validatePromoCode } from '@/lib/pricing/validate-promo'
import { sql } from '@payloadcms/db-vercel-postgres'
import { sendEmail } from '@/lib/email/send'

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config })

  // 1. Authenticate via Payload's native header-based auth (no internal HTTP fetch).
  //    Reads the cookie out of req.headers and resolves to the auth-collection user.
  let contractor: any
  try {
    const { user } = await payload.auth({ headers: req.headers })
    if (!user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    contractor = user
  } catch {
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })
  }

  // 2. Explicit collection assertion — admin sessions must NOT reach this route
  if (contractor?.collection !== 'contractors') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 3. Email verification gate — unverified contractors cannot submit orders
  if (!contractor.email_verified_at) {
    return NextResponse.json(
      { error: 'Please verify your email address before placing an order.' },
      { status: 403 },
    )
  }

  // 4. Parse request body
  const body = await req.json()
  const { productId: rawProductId, quantity, deliveryAddress, notes, promoCode, idempotencyKey, clientEffectivePrice } = body

  if (!rawProductId || !quantity || !deliveryAddress || !idempotencyKey) {
    return NextResponse.json({ error: 'productId, quantity, deliveryAddress, and idempotencyKey are required' }, { status: 400 })
  }
  if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) {
    return NextResponse.json({ error: 'quantity must be a positive integer' }, { status: 400 })
  }

  // Coerce relation IDs: Postgres collections use integer PKs, but the client
  // sends strings from the URL (?product=2). Pass numeric strings as numbers.
  const productId: string | number =
    typeof rawProductId === 'string' && /^\d+$/.test(rawProductId)
      ? Number(rawProductId)
      : rawProductId
  const contractorRelId: string | number =
    typeof contractor.id === 'string' && /^\d+$/.test(contractor.id)
      ? Number(contractor.id)
      : contractor.id

  const transactionID = await payload.db.beginTransaction()
  if (!transactionID) {
    return NextResponse.json({ error: 'Order submission failed. Please try again.' }, { status: 500 })
  }

  try {
    // 5. Read settings (all checks inside the transaction)
    const settings = await payload.findGlobal({
      slug: 'settings',
      req: { transactionID } as any,
      overrideAccess: true,
    })

    const s = settings as any

    // 6. Kill switch
    if (s.orders_paused) {
      await payload.db.rollbackTransaction(transactionID)
      return NextResponse.json(
        { error: 'Orders are temporarily paused. Please try again later or contact Alan directly.' },
        { status: 423 },
      )
    }

    // 7. Rate limit — count contractor's orders in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const recentOrders = await payload.find({
      collection: 'orders',
      where: {
        contractor: { equals: contractorRelId },
        submitted_at: { greater_than: oneHourAgo },
      },
      limit: 0,
      req: { transactionID } as any,
      overrideAccess: true,
    })

    if (recentOrders.totalDocs >= (s.order_rate_limit_per_hour ?? 20)) {
      await payload.db.rollbackTransaction(transactionID)
      return NextResponse.json({ error: 'Too many orders. Please wait before submitting again.' }, { status: 429 })
    }

    // 8. Idempotency check — return existing order if same (contractor, idempotencyKey)
    const existingOrder = await payload.find({
      collection: 'orders',
      where: {
        idempotency_key: { equals: idempotencyKey },
        contractor: { equals: contractorRelId },
      },
      limit: 1,
      req: { transactionID } as any,
      overrideAccess: true,
    })

    if (existingOrder.docs.length) {
      await payload.db.rollbackTransaction(transactionID)
      return NextResponse.json({ order: existingOrder.docs[0], idempotent: true }, { status: 200 })
    }

    // 9. Fetch product (fresh — for stale-price guard)
    const product = await payload.findByID({
      collection: 'products',
      id: productId,
      req: { transactionID } as any,
      overrideAccess: true,
    })

    if (!product) {
      await payload.db.rollbackTransaction(transactionID)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // 10. Fetch fresh contractor data (for fresh tier_discount_pct)
    const freshContractor = await payload.findByID({
      collection: 'contractors',
      id: contractorRelId,
      req: { transactionID } as any,
      overrideAccess: true,
    })

    if ((freshContractor as any).deactivated_at) {
      await payload.db.rollbackTransaction(transactionID)
      return NextResponse.json({ error: 'Your account has been deactivated. Please contact Alan.' }, { status: 403 })
    }

    const tierDiscountPct = (freshContractor as any).tier_discount_pct ?? 0
    const listPrice = (product as any).listPrice ?? 0
    if (!listPrice || listPrice <= 0) {
      await payload.db.rollbackTransaction(transactionID)
      return NextResponse.json({ error: 'Product price is not available. Please contact Alan.' }, { status: 422 })
    }

    // 11. Validate promo code (if provided)
    let promoDiscountPct = 0
    let validatedPromoId: string | null = null

    if (promoCode) {
      const promoResult = await validatePromoCode(promoCode)
      if (!promoResult.valid) {
        await payload.db.rollbackTransaction(transactionID)
        const reasons: Record<string, string> = {
          not_found: 'Promo code not found.',
          inactive: 'This promo code is no longer active.',
          not_yet_active: 'This promo code is not yet valid.',
          expired: 'This promo code has expired.',
          usage_cap_reached: 'This promo code has reached its usage limit.',
        }
        return NextResponse.json({ error: reasons[promoResult.reason] }, { status: 422 })
      }
      promoDiscountPct = promoResult.promo_discount_pct
      validatedPromoId = promoResult.promoId
    }

    // 12. Combined discount cap
    const maxCombined = s.max_combined_discount_pct ?? 0.40
    if (!isWithinDiscountCap(tierDiscountPct, promoDiscountPct, maxCombined)) {
      await payload.db.rollbackTransaction(transactionID)
      return NextResponse.json(
        { error: `This promo code combined with your account discount exceeds the maximum allowed discount of ${(maxCombined * 100).toFixed(0)}%.` },
        { status: 422 },
      )
    }

    // 13. Stale-price guard
    const breakdown = calculateEffectivePrice(listPrice, tierDiscountPct, promoDiscountPct)
    const serverEffectiveTotal = breakdown.effectivePrice * quantity

    if (clientEffectivePrice !== undefined && isPriceStale(serverEffectiveTotal, clientEffectivePrice)) {
      await payload.db.rollbackTransaction(transactionID)
      return NextResponse.json(
        {
          error: 'price_updated',
          message: 'The price has changed since you loaded this page. Please review the new price and resubmit.',
          serverEffectiveTotal,
          serverEffectivePerUnit: breakdown.effectivePrice,
        },
        { status: 409 },
      )
    }

    // 14. Duplicate detection — SELECT FOR UPDATE to prevent race conditions
    const duplicateWindowMs = (s.duplicate_window_minutes ?? 10) * 60 * 1000
    const windowStart = new Date(Date.now() - duplicateWindowMs).toISOString()

    // Raw SQL FOR UPDATE — Payload's local API doesn't support row-level locking
    const drizzle = (payload.db as any).drizzle
    const duplicateCheck = await drizzle.execute(
      sql`SELECT id FROM orders WHERE contractor_id = ${contractorRelId} AND product_id = ${productId} AND submitted_at > ${windowStart} LIMIT 1 FOR UPDATE`,
    )
    const isDuplicate = (duplicateCheck?.rows?.length ?? duplicateCheck?.length ?? 0) > 0

    // 15. Create the order
    const order = await payload.create({
      collection: 'orders',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        contractor: contractorRelId,
        product: productId,
        quantity,
        delivery_address: deliveryAddress,
        notes: notes ?? '',
        list_price_at_submit: listPrice,
        tier_discount_pct_at_submit: tierDiscountPct,
        promo_discount_pct_at_submit: promoDiscountPct,
        effective_price_at_submit: breakdown.effectivePrice,
        order_status: 'pending',
        submitted_at: new Date().toISOString(),
        duplicate_flag: isDuplicate,
        idempotency_key: idempotencyKey,
        ...(validatedPromoId ? { promo_code: validatedPromoId } : {}),
      } as any,
      req: { transactionID } as any,
      overrideAccess: true,
    })

    // 16. Increment promo usage_count atomically (if promo used)
    if (validatedPromoId) {
      try {
        await drizzle.execute(
          sql`UPDATE "promo_codes" SET usage_count = usage_count + 1 WHERE id = ${validatedPromoId}`,
        )
      } catch (promoErr) {
        await payload.db.rollbackTransaction(transactionID).catch(() => {})
        console.error('[orders/submit] promo usage increment failed', promoErr)
        return NextResponse.json({ error: 'Order submission failed. Please try again.' }, { status: 500 })
      }
    }

    // 17. Resolve admin notification recipients
    //   Priority: Settings.order_notify_emails (comma-separated, admin-editable)
    //   Fallback: ALAN_EMAIL env var
    //   This is admin-editable from the Payload admin UI under Globals → Settings.
    const notifyRaw: string = (s.order_notify_emails ?? '').toString()
    const adminRecipients: string[] = notifyRaw
      .split(',')
      .map((e: string) => e.trim())
      .filter((e: string) => e.length > 0 && /\S+@\S+\.\S+/.test(e))
    if (adminRecipients.length === 0) {
      const envFallback = (process.env.ALAN_EMAIL || '').trim()
      if (envFallback) adminRecipients.push(envFallback)
    }

    const contractorEmail = ((freshContractor as any).email ?? '').toString().trim()

    // Queue one emailDeliveries row per recipient (admin + contractor)
    const queuedRows: Array<{ id: number | string; recipient: string; kind: 'admin' | 'contractor' }> = []
    for (const rcpt of adminRecipients) {
      const row = await payload.create({
        collection: 'emailDeliveries',
        data: {
          order: order.id,
          recipient: rcpt,
          email_type: 'order_confirmation',
          status: 'queued',
          retry_count: 0,
        },
        req: { transactionID } as any,
        overrideAccess: true,
      })
      queuedRows.push({ id: row.id, recipient: rcpt, kind: 'admin' })
    }
    if (contractorEmail && /\S+@\S+\.\S+/.test(contractorEmail)) {
      const row = await payload.create({
        collection: 'emailDeliveries',
        data: {
          order: order.id,
          recipient: contractorEmail,
          email_type: 'order_confirmation',
          status: 'queued',
          retry_count: 0,
        },
        req: { transactionID } as any,
        overrideAccess: true,
      })
      queuedRows.push({ id: row.id, recipient: contractorEmail, kind: 'contractor' })
    }

    // Commit the transaction — order and email queue rows land together
    await payload.db.commitTransaction(transactionID)

    // 18. Send the emails synchronously AFTER commit so a Resend failure can never
    //     roll back a confirmed order. We update each delivery row in place so the
    //     audit log reflects what really happened.
    try {
      const productRel: any = (order as any).product
      const productName =
        productRel && typeof productRel === 'object'
          ? productRel.name ?? `#${productId}`
          : `#${productId}`
      const productSku =
        productRel && typeof productRel === 'object' ? productRel.sku ?? '' : ''
      const orderTotal = breakdown.effectivePrice * quantity
      const contractorName =
        (freshContractor as any).company_name ?? (freshContractor as any).email ?? 'Contractor'

      const adminSubject = `New order #${order.id} — ${productName} × ${quantity}`
      const adminHtml = `
        <h2>New order received</h2>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Contractor:</strong> ${contractorName}</p>
        <p><strong>Contractor email:</strong> ${contractorEmail}</p>
        <p><strong>Product:</strong> ${productName} (${productSku})</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>List price:</strong> RM ${listPrice.toFixed(2)}</p>
        <p><strong>Tier discount:</strong> ${(tierDiscountPct * 100).toFixed(0)}%</p>
        <p><strong>Promo discount:</strong> ${(promoDiscountPct * 100).toFixed(0)}%</p>
        <p><strong>Effective price per unit:</strong> RM ${breakdown.effectivePrice.toFixed(2)}</p>
        <p><strong>Order total:</strong> RM ${orderTotal.toFixed(2)}</p>
        <p><strong>Delivery address:</strong><br/>${String(deliveryAddress).replace(/\n/g, '<br/>')}</p>
        ${notes ? `<p><strong>Notes:</strong><br/>${String(notes).replace(/\n/g, '<br/>')}</p>` : ''}
        ${isDuplicate ? '<p><strong>⚠️ Flagged as possible duplicate</strong> (same product within last 10 minutes).</p>' : ''}
      `

      // Contractor confirmation — shows full effective-price stack-up per DESIGN.md
      const contractorSubject = `Order #${order.id} received — Coolman`
      const contractorHtml = `
        <h2>Thank you — we've received your order</h2>
        <p>Hi ${contractorName},</p>
        <p>Your order request has been received. Alan or the Coolman team will contact you shortly to confirm details and arrange delivery.</p>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Product:</strong> ${productName}${productSku ? ` (${productSku})` : ''}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <h3>Price breakdown</h3>
        <table cellpadding="4" style="border-collapse:collapse;">
          <tr><td>List price</td><td style="text-align:right;font-family:monospace;">RM ${listPrice.toFixed(2)}</td></tr>
          <tr><td>Your tier discount</td><td style="text-align:right;font-family:monospace;">−${(tierDiscountPct * 100).toFixed(0)}%</td></tr>
          <tr><td>Promo discount</td><td style="text-align:right;font-family:monospace;">−${(promoDiscountPct * 100).toFixed(0)}%</td></tr>
          <tr><td><strong>Effective price per unit</strong></td><td style="text-align:right;font-family:monospace;"><strong>RM ${breakdown.effectivePrice.toFixed(2)}</strong></td></tr>
          <tr><td><strong>Order total (${quantity} × ${breakdown.effectivePrice.toFixed(2)})</strong></td><td style="text-align:right;font-family:monospace;"><strong>RM ${orderTotal.toFixed(2)}</strong></td></tr>
        </table>
        <p style="margin-top:16px;">If anything looks wrong, reply to this email or call Coolman directly.</p>
        <p>— Coolman</p>
      `

      for (const q of queuedRows) {
        const subject = q.kind === 'admin' ? adminSubject : contractorSubject
        const html = q.kind === 'admin' ? adminHtml : contractorHtml
        const result = await sendEmail({ to: q.recipient, subject, html })
        if (result.success) {
          await payload.update({
            collection: 'emailDeliveries',
            id: q.id,
            data: {
              status: 'sent',
              sent_at: new Date().toISOString(),
              ...(result.messageId ? { resend_message_id: result.messageId } : {}),
            } as any,
            overrideAccess: true,
          })
        } else {
          await payload.update({
            collection: 'emailDeliveries',
            id: q.id,
            data: {
              status: 'failed',
              last_error: result.error ?? 'unknown',
            } as any,
            overrideAccess: true,
          })
        }
      }
    } catch (mailErr) {
      console.error('[orders/submit] email send threw', mailErr)
      // Order already committed — never propagate a mail failure to the client.
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (err) {
    await payload.db.rollbackTransaction(transactionID).catch(() => {})
    console.error('[orders/submit]', err)
    try {
      const anyErr = err as any
      const inner = anyErr?.data?.errors ?? anyErr?.cause?.errors
      if (inner) {
        console.error('[orders/submit] field errors:', JSON.stringify(inner, null, 2))
      }
    } catch {}
    return NextResponse.json({ error: 'Order submission failed. Please try again.' }, { status: 500 })
  }
}
