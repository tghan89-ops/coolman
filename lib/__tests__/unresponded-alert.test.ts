// lib/__tests__/unresponded-alert.test.ts
//
// Tests for the hour-23 unresponded-order alert cron at
// app/api/cron/unresponded-alert/route.ts
//
// Covers:
//   1. Auth — missing/wrong Bearer token returns 401
//   2. Overlap guard — exits early when a previous run is still 'running'
//      inside the 55-minute window
//   3. Happy path — stale pending order triggers one email, audit row,
//      and stamps alerted_at
//   4. Failed send — leaves alerted_at NULL so next run retries
//   5. Threshold filter — query uses settings.alert_threshold_hours

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('payload', () => ({ getPayload: vi.fn() }))
vi.mock('@payload-config', () => ({ default: {} }))

// sendEmail mock — flipped per test via mockSendEmail.mockResolvedValue(...)
const mockSendEmail = vi.fn()
vi.mock('@/lib/email/send', () => ({
  sendEmail: (...args: any[]) => mockSendEmail(...args),
}))

import { getPayload } from 'payload'
import { GET } from '@/app/api/cron/unresponded-alert/route'

const ORIGINAL_ENV = { ...process.env }

const buildReq = (auth?: string) =>
  new NextRequest('http://localhost/api/cron/unresponded-alert', {
    headers: auth ? { authorization: auth } : {},
  })

const buildPayloadMock = ({
  latestCronRun = null,
  staleOrders = [] as any[],
  threshold = 24,
  heartbeatId = 'cron-row-1',
}: {
  latestCronRun?: any
  staleOrders?: any[]
  threshold?: number
  heartbeatId?: string
}) => {
  const findMock = vi.fn()
  // First find call → cronRuns latest
  findMock.mockResolvedValueOnce({ docs: latestCronRun ? [latestCronRun] : [] })
  // Second find call → stale orders
  findMock.mockResolvedValueOnce({ docs: staleOrders })

  return {
    find: findMock,
    findGlobal: vi.fn().mockResolvedValue({ alert_threshold_hours: threshold }),
    create: vi
      .fn()
      // heartbeat cronRuns row
      .mockResolvedValueOnce({ id: heartbeatId })
      // subsequent .create calls are emailDeliveries rows — return generic
      .mockResolvedValue({ id: 'email-row' }),
    update: vi.fn().mockResolvedValue({}),
  }
}

describe('GET /api/cron/unresponded-alert', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...ORIGINAL_ENV, CRON_SECRET: 'test-secret', ALAN_EMAIL: 'alan@coolman.com.my' }
    delete process.env.ALERT_RECIPIENTS
  })

  it('returns 401 when Authorization header is missing or wrong', async () => {
    const res = await GET(buildReq())
    expect(res.status).toBe(401)

    const res2 = await GET(buildReq('Bearer wrong'))
    expect(res2.status).toBe(401)
  })

  it('exits early when previous run is still running inside overlap window', async () => {
    const recent = new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5 min ago
    const payloadMock = buildPayloadMock({
      latestCronRun: { status: 'running', started_at: recent },
    })
    ;(getPayload as any).mockResolvedValue(payloadMock)

    const res = await GET(buildReq('Bearer test-secret'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.skipped).toMatch(/in progress/i)
    // No heartbeat written, no emails sent
    expect(payloadMock.create).not.toHaveBeenCalled()
    expect(mockSendEmail).not.toHaveBeenCalled()
  })

  it('happy path — sends one email per stale order and stamps alerted_at', async () => {
    const cutoffOlder = new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString() // 30h old
    const staleOrder = {
      id: 'order-1',
      quantity: 5,
      submitted_at: cutoffOlder,
      contractor: { business_name: 'Acme Construction' },
      product: { name: '350mm Diamond Blade' },
    }
    const payloadMock = buildPayloadMock({ staleOrders: [staleOrder] })
    ;(getPayload as any).mockResolvedValue(payloadMock)
    mockSendEmail.mockResolvedValue({ success: true, messageId: 'rs-abc' })

    const res = await GET(buildReq('Bearer test-secret'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({ ok: true, processed: 1, alerted: 1 })

    // Email sent once
    expect(mockSendEmail).toHaveBeenCalledTimes(1)
    const emailCall = mockSendEmail.mock.calls[0][0]
    expect(emailCall.to).toEqual(['alan@coolman.com.my'])
    expect(emailCall.subject).toContain('order-1')
    expect(emailCall.html).toContain('Acme Construction')
    expect(emailCall.html).toContain('350mm Diamond Blade')

    // emailDeliveries audit row created with status='sent'
    const deliveryCreate = payloadMock.create.mock.calls.find(
      (c: any[]) => c[0].collection === 'emailDeliveries',
    )
    expect(deliveryCreate).toBeDefined()
    expect(deliveryCreate![0].data).toMatchObject({
      order: 'order-1',
      email_type: 'unresponded_alert',
      status: 'sent',
      resend_message_id: 'rs-abc',
    })

    // alerted_at stamped on the order
    const orderUpdate = payloadMock.update.mock.calls.find(
      (c: any[]) => c[0].collection === 'orders' && c[0].id === 'order-1',
    )
    expect(orderUpdate).toBeDefined()
    expect(orderUpdate![0].data.alerted_at).toBeTruthy()
  })

  it('failed send leaves alerted_at NULL so next run retries', async () => {
    const staleOrder = {
      id: 'order-2',
      quantity: 1,
      submitted_at: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
      contractor: { business_name: 'Foo' },
      product: { name: 'Bar' },
    }
    const payloadMock = buildPayloadMock({ staleOrders: [staleOrder] })
    ;(getPayload as any).mockResolvedValue(payloadMock)
    mockSendEmail.mockResolvedValue({ success: false, error: 'Resend 500' })

    const res = await GET(buildReq('Bearer test-secret'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.alerted).toBe(0)

    // Audit row written with status='failed'
    const deliveryCreate = payloadMock.create.mock.calls.find(
      (c: any[]) => c[0].collection === 'emailDeliveries',
    )
    expect(deliveryCreate![0].data).toMatchObject({
      status: 'failed',
      last_error: 'Resend 500',
    })

    // No order update — alerted_at must stay NULL
    const orderUpdate = payloadMock.update.mock.calls.find(
      (c: any[]) => c[0].collection === 'orders' && c[0].id === 'order-2',
    )
    expect(orderUpdate).toBeUndefined()
  })

  it('uses settings.alert_threshold_hours when computing the cutoff', async () => {
    const payloadMock = buildPayloadMock({ staleOrders: [], threshold: 48 })
    ;(getPayload as any).mockResolvedValue(payloadMock)

    await GET(buildReq('Bearer test-secret'))

    // Second find() call is the stale-orders query — inspect its where clause
    const ordersFindCall = payloadMock.find.mock.calls[1][0]
    expect(ordersFindCall.collection).toBe('orders')
    const andClauses = ordersFindCall.where.and
    const submittedClause = andClauses.find((c: any) => c.submitted_at)
    expect(submittedClause).toBeDefined()
    const cutoffMs = new Date(submittedClause.submitted_at.less_than).getTime()
    const expectedMs = Date.now() - 48 * 60 * 60 * 1000
    // Within 5 seconds of expected — Date.now() drift tolerant
    expect(Math.abs(cutoffMs - expectedMs)).toBeLessThan(5000)
  })

  it('uses ALERT_RECIPIENTS CSV when set, parsed into an array', async () => {
    process.env.ALERT_RECIPIENTS = 'alan@coolman.com.my, pushpa@coolman.com.my'
    const staleOrder = {
      id: 'order-3',
      quantity: 2,
      submitted_at: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
      contractor: { business_name: 'X' },
      product: { name: 'Y' },
    }
    const payloadMock = buildPayloadMock({ staleOrders: [staleOrder] })
    ;(getPayload as any).mockResolvedValue(payloadMock)
    mockSendEmail.mockResolvedValue({ success: true, messageId: 'rs-2' })

    await GET(buildReq('Bearer test-secret'))

    expect(mockSendEmail.mock.calls[0][0].to).toEqual([
      'alan@coolman.com.my',
      'pushpa@coolman.com.my',
    ])
  })
})
