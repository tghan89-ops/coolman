// lib/__tests__/orders.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock payload
vi.mock('payload', () => ({ getPayload: vi.fn() }))
vi.mock('@payload-config', () => ({ default: {} }))

// Mock next/headers for cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue({ value: 'test-session-token' }),
  }),
}))

// Mock drizzle-orm (imported by the route for sql tagged template)
vi.mock('drizzle-orm', () => ({
  sql: (strings: TemplateStringsArray, ...values: any[]) => ({ strings, values }),
}))

// Mock pricing helpers so they don't pull in heavy deps
vi.mock('@/lib/pricing/calculate', () => ({
  calculateEffectivePrice: vi.fn().mockReturnValue({
    effectivePrice: 90,
    tierDiscount: 10,
    promoDiscount: 0,
  }),
  isWithinDiscountCap: vi.fn().mockReturnValue(true),
  isPriceStale: vi.fn().mockReturnValue(false),
}))

vi.mock('@/lib/pricing/validate-promo', () => ({
  validatePromoCode: vi.fn().mockResolvedValue({ valid: false, reason: 'not_found' }),
}))

// Mock global fetch for /api/contractors/me
const mockMeResponse = {
  user: {
    id: 'contractor-1',
    email: 'test@example.com',
    collection: 'contractors',
    email_verified_at: '2026-01-01T00:00:00Z',
  },
}

const buildMockPayload = (overrides: Record<string, any> = {}) => ({
  db: {
    beginTransaction: vi.fn().mockResolvedValue('txn-123'),
    commitTransaction: vi.fn().mockResolvedValue(undefined),
    rollbackTransaction: vi.fn().mockResolvedValue(undefined),
    drizzle: {
      execute: vi.fn().mockResolvedValue({ rows: [] }),
    },
  },
  findGlobal: vi.fn().mockResolvedValue({
    orders_paused: false,
    order_rate_limit_per_hour: 20,
    duplicate_window_minutes: 10,
    max_combined_discount_pct: 0.40,
  }),
  find: vi.fn().mockResolvedValue({ docs: [], totalDocs: 0 }),
  findByID: vi.fn().mockImplementation(({ collection }: { collection: string }) => {
    if (collection === 'products') return { id: 'prod-1', listPrice: 100, name: 'Test Blade' }
    if (collection === 'contractors') return { id: 'contractor-1', tier_discount_pct: 0.10, email_verified_at: '2026-01-01' }
    return null
  }),
  create: vi.fn().mockResolvedValue({ id: 'order-1', order_status: 'pending' }),
  ...overrides,
})

describe('POST /api/orders/submit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockMeResponse,
    }))
  })

  it('kill switch returns 423', async () => {
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue(buildMockPayload({
      findGlobal: vi.fn().mockResolvedValue({ orders_paused: true }),
    }) as any)

    const { POST } = await import('../../app/api/orders/submit/route')
    const req = new Request('http://localhost/api/orders/submit', {
      method: 'POST',
      body: JSON.stringify({
        productId: 'prod-1',
        quantity: 1,
        deliveryAddress: '123 Test St',
        idempotencyKey: crypto.randomUUID(),
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req as any)
    expect(res.status).toBe(423)
    const body = await res.json()
    expect(body.error).toContain('paused')
  })

  it('idempotency — second submit with same key returns 200 with existing order', async () => {
    const existingOrder = { id: 'order-existing', order_status: 'pending' }
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue(buildMockPayload({
      find: vi.fn().mockImplementation(({ collection, where }: { collection: string; where: any }) => {
        if (collection === 'orders' && where?.idempotency_key) {
          return { docs: [existingOrder], totalDocs: 1 }
        }
        return { docs: [], totalDocs: 0 }
      }),
    }) as any)

    const { POST } = await import('../../app/api/orders/submit/route')
    const idemKey = crypto.randomUUID()
    const req = new Request('http://localhost/api/orders/submit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'prod-1', quantity: 1, deliveryAddress: '123 Test St', idempotencyKey: idemKey }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req as any)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.idempotent).toBe(true)
    expect(body.order.id).toBe('order-existing')
  })

  it('duplicate within window — order created with duplicate_flag=true, not blocked', async () => {
    const { getPayload } = await import('payload')
    const mockCreate = vi.fn().mockResolvedValue({ id: 'order-2', order_status: 'pending' })
    vi.mocked(getPayload).mockResolvedValue(buildMockPayload({
      find: vi.fn().mockResolvedValue({ docs: [], totalDocs: 0 }),
      db: {
        beginTransaction: vi.fn().mockResolvedValue('txn-abc'),
        commitTransaction: vi.fn().mockResolvedValue(undefined),
        rollbackTransaction: vi.fn().mockResolvedValue(undefined),
        drizzle: {
          execute: vi.fn().mockResolvedValue({ rows: [{ id: 'order-1' }] }),
        },
      },
      create: mockCreate,
    }) as any)

    const { POST } = await import('../../app/api/orders/submit/route')
    const req = new Request('http://localhost/api/orders/submit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'prod-1', quantity: 1, deliveryAddress: '123 Test St', idempotencyKey: crypto.randomUUID() }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req as any)
    expect(res.status).toBe(201)
    const createCallData = mockCreate.mock.calls[0][0].data
    expect(createCallData.duplicate_flag).toBe(true)
  })

  it('email queue failure causes transaction rollback — order is not silently lost', async () => {
    const { getPayload } = await import('payload')
    const mockCreate = vi.fn()
      .mockResolvedValueOnce({ id: 'order-3', order_status: 'pending' })
      .mockRejectedValueOnce(new Error('Email queue write failed'))

    vi.mocked(getPayload).mockResolvedValue(buildMockPayload({
      find: vi.fn().mockResolvedValue({ docs: [], totalDocs: 0 }),
      create: mockCreate,
    }) as any)

    const { POST } = await import('../../app/api/orders/submit/route')
    const req = new Request('http://localhost/api/orders/submit', {
      method: 'POST',
      body: JSON.stringify({ productId: 'prod-1', quantity: 1, deliveryAddress: '123 Test St', idempotencyKey: crypto.randomUUID() }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req as any)
    // Email queue failure → outer catch → rollback → 500
    // The key assertion: create was called at least once (order path ran), and the response is 500 not 201
    expect(res.status).toBe(500)
    expect(mockCreate).toHaveBeenCalledTimes(2)
  })

  it('R11 — stale price returns 409 with fresh server price, order not created', async () => {
    const { getPayload } = await import('payload')
    const calc = await import('@/lib/pricing/calculate')
    vi.mocked(calc.isPriceStale).mockReturnValue(true)
    const mockCreate = vi.fn().mockResolvedValue({ id: 'order-x', order_status: 'pending' })
    vi.mocked(getPayload).mockResolvedValue(buildMockPayload({ create: mockCreate }) as any)

    const { POST } = await import('../../app/api/orders/submit/route')
    const req = new Request('http://localhost/api/orders/submit', {
      method: 'POST',
      body: JSON.stringify({
        productId: 'prod-1',
        quantity: 1,
        deliveryAddress: '123 Test St',
        idempotencyKey: crypto.randomUUID(),
        clientEffectivePrice: 50,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req as any)
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error).toBe('price_updated')
    expect(body.serverEffectivePerUnit).toBe(90)
    expect(mockCreate).not.toHaveBeenCalled()
    vi.mocked(calc.isPriceStale).mockReturnValue(false)
  })

  it('R12 — combined discount over cap returns 422, order not created', async () => {
    const { getPayload } = await import('payload')
    const calc = await import('@/lib/pricing/calculate')
    // Force cap-breach branch on the route's own check
    vi.mocked(calc.isWithinDiscountCap).mockReturnValueOnce(false)
    const mockCreate = vi.fn().mockResolvedValue({ id: 'order-y', order_status: 'pending' })
    vi.mocked(getPayload).mockResolvedValue(
      buildMockPayload({
        create: mockCreate,
        findByID: vi.fn().mockImplementation(({ collection }: { collection: string }) => {
          if (collection === 'products') return { id: 'prod-1', listPrice: 100, name: 'Test Blade' }
          if (collection === 'contractors')
            return { id: 'contractor-1', tier_discount_pct: 0.30, email_verified_at: '2026-01-01' }
          return null
        }),
      }) as any,
    )

    const { POST } = await import('../../app/api/orders/submit/route')
    const req = new Request('http://localhost/api/orders/submit', {
      method: 'POST',
      body: JSON.stringify({
        productId: 'prod-1',
        quantity: 1,
        deliveryAddress: '123 Test St',
        idempotencyKey: crypto.randomUUID(),
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req as any)
    expect(res.status).toBe(422)
    const body = await res.json()
    expect(body.error).toMatch(/exceeds the maximum allowed discount/i)
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('OV2-3 — admin session hitting the contractor submit route returns 403', async () => {
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue(buildMockPayload() as any)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: 'admin-1', email: 'alan@coolman.com.my', collection: 'adminUsers' } }),
    }))

    const { POST } = await import('../../app/api/orders/submit/route')
    const req = new Request('http://localhost/api/orders/submit', {
      method: 'POST',
      body: JSON.stringify({
        productId: 'prod-1',
        quantity: 1,
        deliveryAddress: '123 Test St',
        idempotencyKey: crypto.randomUUID(),
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req as any)
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toBe('Forbidden')
  })
})
