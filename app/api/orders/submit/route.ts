// app/api/orders/submit/route.ts
//
// Architecture: Uses Payload local API (in-process, no HTTP).
// ALL critical checks run in ONE Payload transaction (beginTransaction/commitTransaction).
// This prevents TOCTOU races on duplicate detection and idempotency.
// Email is sent synchronously AFTER commit via sendEmail — a mail failure never rolls back
// a confirmed order. The emailDeliveries rows serve as an audit log.
//
// Multi-line cart submission: accepts lines[] payload, fans out one orders row per line,
// all sharing the same submission_id. Cart is cleared inside the transaction.

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { calculateEffectivePrice, isWithinDiscountCap } from '@/lib/pricing/calculate'
import { validatePromoCode } from '@/lib/pricing/validate-promo'
import { sql } from '@payloadcms/db-vercel-postgres'
import { sendEmail } from '@/lib/email/send'

// ---------------------------------------------------------------------------
// Email rendering helpers
// ---------------------------------------------------------------------------

function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))
}

interface PerLine {
  product: any
  quantity: number
  listPrice: number
  effectivePerUnit: number
  lineTotal: number
}

interface RenderArgs {
  kind: 'admin' | 'contractor'
  contractor: any
  perLine: PerLine[]
  tierDiscountPct: number
  promoDiscountPct: number
  grandTotal: number
  deliveryAddress: string
  notes: string
  submissionId: string
  anyDuplicate: boolean
}

function renderOrderEmail(args: RenderArgs): { subject: string; html: string } {
  const lineCount = args.perLine.length
  const grandFmt = `MYR ${args.grandTotal.toFixed(2)}`
  const companyName = String(args.contractor?.company_name ?? args.contractor?.companyName ?? args.contractor?.email ?? 'Contractor')
  const contractorEmail = String(args.contractor?.email ?? '')

  const subject =
    args.kind === 'admin'
      ? `New order request | ${companyName} | ${lineCount} item(s) | ${grandFmt}`
      : `Order received | ${lineCount} item(s) | ${grandFmt}`

  const rows = args.perLine
    .map(
      (ln) => `<tr>
    <td style="padding:8px 12px;border-top:1px solid #e5e7eb">${escapeHtml(ln.product.name ?? '')} <span style="color:#6b7280">(${escapeHtml(ln.product.sku ?? '')})</span></td>
    <td style="padding:8px 12px;border-top:1px solid #e5e7eb;text-align:right;font-family:monospace">${ln.quantity}</td>
    <td style="padding:8px 12px;border-top:1px solid #e5e7eb;text-align:right;font-family:monospace">MYR ${ln.listPrice.toFixed(2)}</td>
    <td style="padding:8px 12px;border-top:1px solid #e5e7eb;text-align:right;font-family:monospace">MYR ${ln.effectivePerUnit.toFixed(2)}</td>
    <td style="padding:8px 12px;border-top:1px solid #e5e7eb;text-align:right;font-family:monospace"><strong>MYR ${ln.lineTotal.toFixed(2)}</strong></td>
  </tr>`,
    )
    .join('')

  const priceBreakdownSection =
    args.kind === 'contractor'
      ? `<h3>Price breakdown</h3>
    <p>Tier discount: <strong>${(args.tierDiscountPct * 100).toFixed(1)}%</strong> · Promo discount: <strong>${(args.promoDiscountPct * 100).toFixed(1)}%</strong></p>`
      : `<p>Tier discount: ${(args.tierDiscountPct * 100).toFixed(1)}% · Promo discount: ${(args.promoDiscountPct * 100).toFixed(1)}%</p>`

  const duplicateWarning =
    args.anyDuplicate && args.kind === 'admin'
      ? `<p><strong>⚠️ Flagged as possible duplicate</strong> (same product within duplicate window).</p>`
      : ''

  const contractorSection =
    args.kind === 'admin'
      ? `<p>Contractor: <strong>${escapeHtml(companyName)}</strong> &lt;${escapeHtml(contractorEmail)}&gt;</p>`
      : `<p>Hi ${escapeHtml(companyName)},</p><p>Your order request has been received. Alan or the Coolman team will contact you shortly.</p>`

  const html = `<div style="font-family:sans-serif;max-width:640px">
    <h2>${escapeHtml(subject.split(' | ')[0])}</h2>
    <p>Submission: <code>${escapeHtml(args.submissionId)}</code></p>
    ${contractorSection}
    <p>Delivery address: ${escapeHtml(args.deliveryAddress)}</p>
    ${args.notes ? `<p>Notes: ${escapeHtml(args.notes)}</p>` : ''}
    <table style="width:100%;border-collapse:collapse;margin-top:16px">
      <thead><tr style="text-align:left;color:#6b7280;font-size:12px;letter-spacing:.05em;text-transform:uppercase">
        <th style="padding:8px 12px">Product</th>
        <th style="padding:8px 12px;text-align:right">Qty</th>
        <th style="padding:8px 12px;text-align:right">List</th>
        <th style="padding:8px 12px;text-align:right">Effective/unit</th>
        <th style="padding:8px 12px;text-align:right">Line total</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${priceBreakdownSection}
    <p style="font-size:20px"><strong>Grand total: ${grandFmt}</strong></p>
    ${duplicateWarning}
    ${args.kind === 'contractor' ? `<p style="margin-top:16px;">If anything looks wrong, reply to this email or call Coolman directly.</p><p>Coolman</p>` : ''}
  </div>`

  return { subject, html }
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config })

  // 1. Authenticate via Payload's native header-based auth
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

  // 3. Email verification gate
  if (!contractor.email_verified_at) {
    return NextResponse.json(
      { error: 'Please verify your email address before placing an order.' },
      { status: 403 },
    )
  }

  // 4. Parse and validate request body
  const body = await req.json()
  const submissionIdempotencyKey: string = String(body.submissionIdempotencyKey ?? '').trim()
  const lines: Array<{ productId: string | number; quantity: number }> = Array.isArray(body.lines)
    ? body.lines
    : []
  const addressId: string | number | null = body.addressId ?? null
  let deliveryAddress: string = String(body.deliveryAddress ?? '').trim()
  const notes: string = String(body.notes ?? '').trim()

  // If the client supplied an addressId, look it up and snapshot its text.
  // Verifies ownership via access control (overrideAccess:false + user).
  if (addressId !== null && addressId !== undefined && addressId !== '') {
    try {
      const addr = await payload.findByID({
        collection: 'addresses',
        id: addressId as any,
        overrideAccess: false,
        user: contractor,
      })
      const snap = String((addr as any)?.addressText ?? '').trim()
      if (!snap) {
        return NextResponse.json({ error: 'address_not_found' }, { status: 400 })
      }
      deliveryAddress = snap
    } catch {
      return NextResponse.json({ error: 'address_not_found' }, { status: 400 })
    }
  }
  const promoCodeStr: string = String(body.promoCode ?? '').trim()
  const clientEffectiveTotal: number = Number(body.clientEffectiveTotal ?? NaN)

  if (!submissionIdempotencyKey) {
    return NextResponse.json({ error: 'missing_submission_key' }, { status: 400 })
  }
  if (lines.length === 0) {
    return NextResponse.json({ error: 'empty_cart' }, { status: 400 })
  }
  if (!deliveryAddress) {
    return NextResponse.json({ error: 'missing_delivery_address' }, { status: 400 })
  }
  if (!Number.isFinite(clientEffectiveTotal)) {
    return NextResponse.json({ error: 'missing_total' }, { status: 400 })
  }
  for (const ln of lines) {
    if (!ln || !Number.isFinite(Number(ln.quantity)) || Number(ln.quantity) < 1) {
      return NextResponse.json({ error: 'invalid_line_quantity' }, { status: 400 })
    }
  }

  // Coerce contractor relation ID
  const contractorRelId: string | number =
    typeof contractor.id === 'string' && /^\d+$/.test(contractor.id)
      ? Number(contractor.id)
      : contractor.id

  const transactionID = await payload.db.beginTransaction()
  if (!transactionID) {
    return NextResponse.json({ error: 'Order submission failed. Please try again.' }, { status: 500 })
  }

  try {
    // 5. Read settings (inside transaction)
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
      return NextResponse.json(
        { error: 'Too many orders. Please wait before submitting again.' },
        { status: 429 },
      )
    }

    // 8. Idempotency precheck — if any order row already has this submission_id, return
    //    the existing order IDs (idempotent 200). Uses submission_id so all lines of a
    //    prior submission are caught, not just the first.
    const existingSubmission = await payload.find({
      collection: 'orders',
      where: {
        submission_id: { equals: submissionIdempotencyKey },
        contractor: { equals: contractorRelId },
      },
      limit: 100,
      req: { transactionID } as any,
      overrideAccess: true,
    })

    if (existingSubmission.docs.length > 0) {
      await payload.db.rollbackTransaction(transactionID)
      return NextResponse.json(
        {
          ok: true,
          idempotent: true,
          orderIds: existingSubmission.docs.map((o: any) => o.id),
          submission_id: submissionIdempotencyKey,
        },
        { status: 200 },
      )
    }

    // 9. Fetch fresh contractor data (for fresh tier_discount_pct + deactivation check)
    const freshContractor = await payload.findByID({
      collection: 'contractors',
      id: contractorRelId,
      req: { transactionID } as any,
      overrideAccess: true,
    })

    if ((freshContractor as any).deactivated_at) {
      await payload.db.rollbackTransaction(transactionID)
      return NextResponse.json(
        { error: 'Your account has been deactivated. Please contact Alan.' },
        { status: 403 },
      )
    }

    const tierDiscountPct: number = Number((freshContractor as any).tier_discount_pct ?? 0)

    // 10. Validate promo code (if provided)
    let promoDiscountPct = 0
    let validatedPromoId: string | null = null

    if (promoCodeStr) {
      const promoResult = await validatePromoCode(promoCodeStr)
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

    // 11. Combined discount cap
    const maxCombined = s.max_combined_discount_pct ?? 0.40
    if (!isWithinDiscountCap(tierDiscountPct, promoDiscountPct, maxCombined)) {
      await payload.db.rollbackTransaction(transactionID)
      return NextResponse.json(
        {
          error: `This promo code combined with your account discount exceeds the maximum allowed discount of ${(maxCombined * 100).toFixed(0)}%.`,
        },
        { status: 422 },
      )
    }

    // 12. Snapshot prices for every line and compute server grand total
    const perLine: PerLine[] = []
    let serverGrandTotal = 0

    for (const ln of lines) {
      const coercedProductId: string | number =
        typeof ln.productId === 'string' && /^\d+$/.test(ln.productId)
          ? Number(ln.productId)
          : ln.productId

      const product = await payload.findByID({
        collection: 'products',
        id: coercedProductId,
        req: { transactionID } as any,
        overrideAccess: true,
      })

      if (!product) {
        await payload.db.rollbackTransaction(transactionID)
        return NextResponse.json({ error: 'unknown_product', productId: ln.productId }, { status: 400 })
      }

      const listPrice = Number((product as any).listPrice ?? 0)
      if (!listPrice || listPrice <= 0) {
        await payload.db.rollbackTransaction(transactionID)
        return NextResponse.json(
          { error: 'Product price is not available. Please contact Alan.', productId: ln.productId },
          { status: 422 },
        )
      }

      const pricing = calculateEffectivePrice(listPrice, tierDiscountPct, promoDiscountPct)
      const quantity = Math.max(1, Math.floor(Number(ln.quantity)))
      const lineTotal = pricing.effectivePrice * quantity
      serverGrandTotal += lineTotal
      perLine.push({
        product: { ...product, id: coercedProductId },
        quantity,
        listPrice,
        effectivePerUnit: pricing.effectivePrice,
        lineTotal,
      })
    }

    // 13. Stale-price guard (grand total comparison, tolerance 0.01 MYR)
    if (Math.abs(serverGrandTotal - clientEffectiveTotal) > 0.01) {
      await payload.db.rollbackTransaction(transactionID)
      return NextResponse.json(
        {
          error: 'price_updated',
          message: 'The price has changed since you loaded this page. Please review the new price and resubmit.',
          serverEffectiveTotal: serverGrandTotal,
          serverEffectivePerUnit: perLine.length === 1 ? perLine[0].effectivePerUnit : null,
        },
        { status: 409 },
      )
    }

    // 14. Duplicate detection (conservative: per-line FOR UPDATE check; if ANY line has a
    //     duplicate within the window, ALL lines in this submission get duplicate_flag=true).
    //     This is the more conservative interpretation — a partial duplicate signals a retry.
    const duplicateWindowMs = (s.duplicate_window_minutes ?? 10) * 60 * 1000
    const windowStart = new Date(Date.now() - duplicateWindowMs).toISOString()
    const drizzle = (payload.db as any).drizzle

    let anyDuplicate = false
    for (const ln of perLine) {
      const coercedProductId = ln.product.id
      const dupCheck = await drizzle.execute(
        sql`SELECT id FROM orders WHERE contractor_id = ${contractorRelId} AND product_id = ${coercedProductId} AND submitted_at > ${windowStart} LIMIT 1 FOR UPDATE`,
      )
      if ((dupCheck?.rows?.length ?? dupCheck?.length ?? 0) > 0) {
        anyDuplicate = true
        break
      }
    }

    // 15. Fan out: create one order row per line, all sharing submission_id
    const createdIds: (number | string)[] = []
    for (let i = 0; i < perLine.length; i++) {
      const ln = perLine[i]
      const order = await payload.create({
        collection: 'orders',
        data: {
          contractor: contractorRelId,
          product: ln.product.id,
          quantity: ln.quantity,
          delivery_address: deliveryAddress,
          notes: notes || undefined,
          list_price_at_submit: ln.listPrice,
          tier_discount_pct_at_submit: tierDiscountPct,
          promo_discount_pct_at_submit: promoDiscountPct,
          effective_price_at_submit: ln.effectivePerUnit,
          order_status: 'pending',
          submitted_at: new Date().toISOString(),
          duplicate_flag: anyDuplicate,
          idempotency_key: `${submissionIdempotencyKey}:${i}`,
          submission_id: submissionIdempotencyKey,
          ...(validatedPromoId ? { promo_code: validatedPromoId } : {}),
        } as any,
        req: { transactionID } as any,
        overrideAccess: true,
      })
      createdIds.push(order.id)
    }

    // 16. Increment promo usage_count atomically (once per submission, not per line)
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

    // 17. Clear the contractor's cart (inside transaction)
    const cartRes = await payload.find({
      collection: 'carts',
      where: { contractor: { equals: contractorRelId } },
      limit: 1,
      req: { transactionID } as any,
      overrideAccess: true,
    })
    if (cartRes.docs[0]) {
      await payload.update({
        collection: 'carts',
        id: cartRes.docs[0].id,
        data: { items: [] },
        req: { transactionID } as any,
        overrideAccess: true,
      })
    }

    // 18. Resolve admin notification recipients
    //     Priority: Settings.order_notify_emails (comma-separated, admin-editable)
    //     Fallback: ALAN_EMAIL env var
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

    // Queue one emailDeliveries row per recipient (using first order id as the relation anchor)
    const queuedRows: Array<{ id: number | string; recipient: string; kind: 'admin' | 'contractor' }> = []
    for (const rcpt of adminRecipients) {
      const row = await payload.create({
        collection: 'emailDeliveries',
        data: {
          order: createdIds[0],
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
          order: createdIds[0],
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

    // Commit — all order rows, cart clear, and email queue land atomically
    await payload.db.commitTransaction(transactionID)

    // 19. Send emails synchronously AFTER commit so a Resend failure never rolls back
    //     a confirmed order. The delivery rows are updated in place for the audit log.
    try {
      for (const q of queuedRows) {
        const { subject, html } = renderOrderEmail({
          kind: q.kind,
          contractor: freshContractor,
          perLine,
          tierDiscountPct,
          promoDiscountPct,
          grandTotal: serverGrandTotal,
          deliveryAddress,
          notes,
          submissionId: submissionIdempotencyKey,
          anyDuplicate,
        })
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

    return NextResponse.json(
      { ok: true, orderIds: createdIds, submission_id: submissionIdempotencyKey },
      { status: 201 },
    )
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
