// app/api/cron/unresponded-alert/route.ts
//
// Hourly Vercel Cron. For every pending order older than
// `settings.alert_threshold_hours` (default 24) that has not already been
// alerted, send one email to Alan + Pushpa (ALERT_RECIPIENTS env CSV) and
// stamp `alerted_at` on success. Failed sends leave `alerted_at` NULL so the
// next run retries naturally.
//
// Overlap guard (R4): if the previous run is still marked `running` and was
// started less than 55 minutes ago, exit early. Stops two crons from
// double-sending if Vercel ever overlaps invocations.

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendEmail } from '@/lib/email/send'

const JOB_NAME = 'unresponded-order-alert'
const OVERLAP_WINDOW_MS = 55 * 60 * 1000

export async function GET(req: NextRequest) {
  // 1. Auth via shared secret. Vercel Cron sends Authorization: Bearer <CRON_SECRET>.
  const authHeader = req.headers.get('authorization') ?? ''
  const expected = process.env.CRON_SECRET
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })

  // 2. Overlap guard. If a previous run is still flagged 'running' inside the
  // window, exit early without writing a new heartbeat row.
  const recent = await payload.find({
    collection: 'cronRuns',
    where: { job_name: { equals: JOB_NAME } },
    sort: '-started_at',
    limit: 1,
    overrideAccess: true,
  })
  const latest = recent.docs[0] as any
  if (latest && latest.status === 'running' && latest.started_at) {
    const age = Date.now() - new Date(latest.started_at).getTime()
    if (age < OVERLAP_WINDOW_MS) {
      return NextResponse.json({ skipped: 'previous run still in progress' }, { status: 200 })
    }
  }

  // 3. Heartbeat row — status='running'. Updated to 'completed' or 'failed' below.
  const heartbeat = await payload.create({
    collection: 'cronRuns',
    data: {
      job_name: JOB_NAME,
      started_at: new Date().toISOString(),
      status: 'running',
      rows_processed: 0,
    },
    overrideAccess: true,
  })

  try {
    // 4. Read alert threshold from Settings (frontend-editable, no hardcode).
    const settings = (await payload.findGlobal({
      slug: 'settings',
      overrideAccess: true,
    })) as any
    const thresholdHours: number = settings?.alert_threshold_hours ?? 24
    const cutoffISO = new Date(Date.now() - thresholdHours * 60 * 60 * 1000).toISOString()

    // 5. Recipients — ALERT_RECIPIENTS CSV preferred, ALAN_EMAIL fallback.
    const recipientsCsv = (process.env.ALERT_RECIPIENTS ?? '').trim()
    const fallback = process.env.ALAN_EMAIL ?? 'alan@coolman.com.my'
    const recipients = recipientsCsv
      ? recipientsCsv.split(',').map((s) => s.trim()).filter(Boolean)
      : [fallback]

    // 6. Find stale pending orders that have not been alerted yet.
    const stale = await payload.find({
      collection: 'orders',
      where: {
        and: [
          { order_status: { equals: 'pending' } },
          { submitted_at: { less_than: cutoffISO } },
          { alerted_at: { exists: false } },
        ],
      },
      depth: 1,
      limit: 200,
      overrideAccess: true,
    })

    let alerted = 0

    for (const order of stale.docs as any[]) {
      const contractorName =
        (order.contractor && typeof order.contractor === 'object' && (order.contractor.business_name || order.contractor.email)) ||
        'Unknown contractor'
      const productName =
        (order.product && typeof order.product === 'object' && (order.product.name || order.product.sku)) ||
        'Unknown product'
      const submittedDisplay = order.submitted_at
        ? new Date(order.submitted_at).toLocaleString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' })
        : 'unknown'

      const subject = `[Coolman] Unresponded order ${order.id} — over ${thresholdHours}h old`
      const html = `
        <p>Hi,</p>
        <p>This order has been pending for more than ${thresholdHours} hours:</p>
        <ul>
          <li><strong>Order ID:</strong> ${order.id}</li>
          <li><strong>Contractor:</strong> ${escapeHtml(String(contractorName))}</li>
          <li><strong>Product:</strong> ${escapeHtml(String(productName))}</li>
          <li><strong>Quantity:</strong> ${order.quantity}</li>
          <li><strong>Submitted:</strong> ${escapeHtml(submittedDisplay)} (MYT)</li>
        </ul>
        <p>Please acknowledge it in the admin panel.</p>
      `

      const result = await sendEmail({ to: recipients, subject, html })

      // Audit row — one per order processed, capturing send outcome.
      await payload.create({
        collection: 'emailDeliveries',
        data: {
          order: order.id,
          recipient: recipients.join(', '),
          email_type: 'unresponded_alert',
          status: result.success ? 'sent' : 'failed',
          resend_message_id: result.messageId ?? undefined,
          last_error: result.success ? undefined : result.error,
          sent_at: result.success ? new Date().toISOString() : undefined,
          retry_count: 0,
        },
        overrideAccess: true,
      })

      // Stamp alerted_at ONLY on success. A failed send re-fires next hour.
      if (result.success) {
        await payload.update({
          collection: 'orders',
          id: order.id,
          data: { alerted_at: new Date().toISOString() },
          overrideAccess: true,
        })
        alerted += 1
      }
    }

    await payload.update({
      collection: 'cronRuns',
      id: heartbeat.id,
      data: {
        completed_at: new Date().toISOString(),
        status: 'completed',
        rows_processed: alerted,
      },
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true, processed: stale.docs.length, alerted })
  } catch (err) {
    console.error('[cron/unresponded-alert]', err)
    await payload
      .update({
        collection: 'cronRuns',
        id: heartbeat.id,
        data: {
          completed_at: new Date().toISOString(),
          status: 'failed',
        },
        overrideAccess: true,
      })
      .catch(() => {})
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 })
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
