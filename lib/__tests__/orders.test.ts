// lib/__tests__/orders.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock payload
vi.mock('payload', () => ({ getPayload: vi.fn() }))
vi.mock('@payload-config', () => ({ default: {} }))

// Mock drizzle-orm (imported by the route for sql tagged template)
vi.mock('drizzle-orm', () => ({
  sql: (strings: TemplateStringsArray, ...values: any[]) => ({ strings, values }),
}))

// Mock pricing helpers so they don't pull in heavy deps.
// list_price = 100, tier = 0.05, promo = 0 → effectivePrice = 95
vi.mock('@/lib/pricing/calculate', () => ({
  calculateEffectivePrice: vi.fn().mockReturnValue({
    effectivePrice: 95,
    tierDiscount: 5,
    promoDiscount: 0,
  }),
  isWithinDiscountCap: vi.fn().mockReturnValue(true),
  isPriceStale: vi.fn().mockReturnValue(false),
}))

vi.mock('@/lib/pricing/validate-promo', () => ({
  validatePromoCode: vi.fn().mockResolvedValue({ valid: false, reason: 'not_found' }),
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mkBody(overrides: Partial<any> = {}) {
  return {
    submissionIdempotencyKey: 'sub-key-1',
    lines: [{ productId: '1', quantity: 2 }],
    deliveryAddress: '123 Test St',
    notes: '',
    clientEffectiveTotal: 190, // 2 × (100 × 0.95)
    ...overrides,
  }
}

function mkReq(body: any) {
  return new Request('http://localhost/api/orders/submit', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

const defaultContractorAuth = {
  user: {
    id: 99,
    email: 'contractor@test.com',
    collection: 'contractors',
    email_verified_at: '2026-01-01T00:00:00Z',
  },
}

// Reusable mock stubs — tests can override via buildMockPayload overrides
let mockCreate: ReturnType<typeof vi.fn>
let mockFind: ReturnType<typeof vi.fn>
let mockFindByID: ReturnType<typeof vi.fn>
let mockUpdate: ReturnType<typeof vi.fn>

function buildMockPayload(overrides: Record<string, any> = {}) {
  mockCreate = vi.fn().mockResolvedValue({ id: 1, order_status: 'pending' })
  mockFind = vi.fn().mockResolvedValue({ docs: [], totalDocs: 0 })
  mockFindByID = vi.fn().mockImplementation(({ collection }: { collection: string }) => {
    if (collection === 'products')
      return Promise.resolve({ id: 1, listPrice: 100, name: 'Test Blade', sku: 'SKU-1' })
    if (collection === 'contractors')
      return Promise.resolve({
        id: 99,
        email: 'contractor@test.com',
        tier_discount_pct: 0.05,
        email_verified_at: '2026-01-01',
      })
    return Promise.resolve(null)
  })
  mockUpdate = vi.fn().mockResolvedValue({})

  return {
    auth: vi.fn().mockResolvedValue(defaultContractorAuth),
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
      order_notify_emails: '',
    }),
    find: mockFind,
    findByID: mockFindByID,
    create: mockCreate,
    update: mockUpdate,
    ...overrides,
  }
}

// Import the route under test — must happen AFTER mocks are in place
async function submitOrder(req: Request) {
  const { POST } = await import('../../app/api/orders/submit/route')
  return POST(req as any)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('POST /api/orders/submit (multi-line)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  // ------------------------------------------------------------------
  // Auth + kill switch
  // ------------------------------------------------------------------

  it('kill switch returns 423', async () => {
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue(
      buildMockPayload({
        findGlobal: vi.fn().mockResolvedValue({ orders_paused: true }),
      }) as any,
    )
    const res = await submitOrder(mkReq(mkBody()))
    expect(res.status).toBe(423)
    const body = await res.json()
    expect(body.error).toContain('paused')
  })

  it('OV2-3 — admin session returns 403', async () => {
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue(
      buildMockPayload({
        auth: vi.fn().mockResolvedValue({
          user: { id: 'admin-1', email: 'alan@coolman.com.my', collection: 'adminUsers' },
        }),
      }) as any,
    )
    const res = await submitOrder(mkReq(mkBody()))
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toBe('Forbidden')
  })

  // ------------------------------------------------------------------
  // Input validation
  // ------------------------------------------------------------------

  it('rejects empty lines[]', async () => {
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue(buildMockPayload() as any)
    const res = await submitOrder(mkReq(mkBody({ lines: [] })))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('empty_cart')
  })

  it('rejects missing submissionIdempotencyKey', async () => {
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue(buildMockPayload() as any)
    const res = await submitOrder(mkReq(mkBody({ submissionIdempotencyKey: '' })))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('missing_submission_key')
  })

  // ------------------------------------------------------------------
  // Idempotency
  // ------------------------------------------------------------------

  it('idempotency — second submit with same submission_id returns 200', async () => {
    const existingOrder = { id: 'order-existing', order_status: 'pending' }
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue(
      buildMockPayload({
        find: vi.fn().mockImplementation(({ collection, where }: any) => {
          if (collection === 'orders' && where?.submission_id) {
            return Promise.resolve({ docs: [existingOrder], totalDocs: 1 })
          }
          return Promise.resolve({ docs: [], totalDocs: 0 })
        }),
      }) as any,
    )
    const res = await submitOrder(mkReq(mkBody()))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.idempotent).toBe(true)
    expect(body.orderIds).toContain('order-existing')
  })

  // ------------------------------------------------------------------
  // Duplicate detection
  // ------------------------------------------------------------------

  it('duplicate within window — order(s) created with duplicate_flag=true', async () => {
    const { getPayload } = await import('payload')
    const localMockCreate = vi.fn().mockResolvedValue({ id: 2, order_status: 'pending' })
    vi.mocked(getPayload).mockResolvedValue(
      buildMockPayload({
        find: vi.fn().mockResolvedValue({ docs: [], totalDocs: 0 }),
        db: {
          beginTransaction: vi.fn().mockResolvedValue('txn-abc'),
          commitTransaction: vi.fn().mockResolvedValue(undefined),
          rollbackTransaction: vi.fn().mockResolvedValue(undefined),
          drizzle: {
            // First execute call = duplicate check → row found → isDuplicate
            execute: vi.fn().mockResolvedValue({ rows: [{ id: 'order-old' }] }),
          },
        },
        create: localMockCreate,
      }) as any,
    )
    const res = await submitOrder(mkReq(mkBody()))
    expect(res.status).toBe(201)
    const orderCalls = localMockCreate.mock.calls.filter((c: any) => c[0].collection === 'orders')
    expect(orderCalls[0][0].data.duplicate_flag).toBe(true)
  })

  // ------------------------------------------------------------------
  // Email queueing
  // ------------------------------------------------------------------

  it('email queue failure causes transaction rollback — order is not silently lost', async () => {
    const { getPayload } = await import('payload')
    const localMockCreate = vi.fn()
      .mockResolvedValueOnce({ id: 'order-3', order_status: 'pending' }) // order row
      .mockRejectedValueOnce(new Error('Email queue write failed'))       // emailDelivery row

    vi.mocked(getPayload).mockResolvedValue(
      buildMockPayload({
        find: vi.fn().mockResolvedValue({ docs: [], totalDocs: 0 }),
        create: localMockCreate,
      }) as any,
    )
    const res = await submitOrder(mkReq(mkBody()))
    // Email queue failure inside the txn → outer catch → rollback → 500
    expect(res.status).toBe(500)
    // order create was called, then emailDelivery create threw
    const orderCalls = localMockCreate.mock.calls.filter((c: any) => c[0].collection === 'orders')
    expect(orderCalls).toHaveLength(1)
  })

  it('queues one email per Settings.order_notify_emails recipient + one for contractor', async () => {
    const { getPayload } = await import('payload')
    const createCalls: any[] = []
    const localMockCreate = vi.fn().mockImplementation((args: any) => {
      createCalls.push(args)
      if (args.collection === 'orders') return Promise.resolve({ id: 'order-99', order_status: 'pending' })
      return Promise.resolve({ id: `delivery-${createCalls.length}` })
    })
    const localMockUpdate = vi.fn().mockResolvedValue({})
    vi.mocked(getPayload).mockResolvedValue(
      buildMockPayload({
        findGlobal: vi.fn().mockResolvedValue({
          orders_paused: false,
          order_rate_limit_per_hour: 20,
          duplicate_window_minutes: 10,
          max_combined_discount_pct: 0.40,
          order_notify_emails: 'alan@coolman.com.my, sales@coolman.com.my, , bad-email',
        }),
        create: localMockCreate,
        update: localMockUpdate,
      }) as any,
    )
    const res = await submitOrder(mkReq(mkBody()))
    expect(res.status).toBe(201)
    const deliveryCreates = createCalls.filter((c) => c.collection === 'emailDeliveries')
    const recipients = deliveryCreates.map((c) => c.data.recipient).sort()
    expect(recipients).toEqual([
      'alan@coolman.com.my',
      'contractor@test.com',
      'sales@coolman.com.my',
    ])
  })

  it('falls back to ALAN_EMAIL env when Settings.order_notify_emails is blank', async () => {
    process.env.ALAN_EMAIL = 'fallback@coolman.com.my'
    const { getPayload } = await import('payload')
    const createCalls: any[] = []
    const localMockCreate = vi.fn().mockImplementation((args: any) => {
      createCalls.push(args)
      if (args.collection === 'orders') return Promise.resolve({ id: 'order-100', order_status: 'pending' })
      return Promise.resolve({ id: `delivery-${createCalls.length}` })
    })
    vi.mocked(getPayload).mockResolvedValue(
      buildMockPayload({
        findGlobal: vi.fn().mockResolvedValue({
          orders_paused: false,
          order_rate_limit_per_hour: 20,
          duplicate_window_minutes: 10,
          max_combined_discount_pct: 0.40,
          order_notify_emails: '',
        }),
        create: localMockCreate,
        update: vi.fn().mockResolvedValue({}),
      }) as any,
    )
    const res = await submitOrder(mkReq(mkBody()))
    expect(res.status).toBe(201)
    const recipients = createCalls
      .filter((c) => c.collection === 'emailDeliveries')
      .map((c) => c.data.recipient)
      .sort()
    expect(recipients).toEqual(['contractor@test.com', 'fallback@coolman.com.my'])
  })

  // ------------------------------------------------------------------
  // Stale price
  // ------------------------------------------------------------------

  it('R11 — stale grand total returns 409 with server total, order not created', async () => {
    const { getPayload } = await import('payload')
    // clientEffectiveTotal = 50, server = 190 (2 × 95) → gap > 0.01 → 409
    // We use the real isPriceStale logic indirectly via Math.abs — no need to mock it
    // but since it's mocked globally as returning false, override for this test.
    const calc = await import('@/lib/pricing/calculate')
    vi.mocked(calc.isPriceStale).mockReturnValue(true)

    const localMockCreate = vi.fn().mockResolvedValue({ id: 'order-x', order_status: 'pending' })
    vi.mocked(getPayload).mockResolvedValue(
      buildMockPayload({ create: localMockCreate }) as any,
    )
    const res = await submitOrder(
      mkReq(mkBody({ clientEffectiveTotal: 50 })),
    )
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error).toBe('price_updated')
    expect(typeof body.serverEffectiveTotal).toBe('number')
    expect(localMockCreate).not.toHaveBeenCalled()
    vi.mocked(calc.isPriceStale).mockReturnValue(false)
  })

  it('R12 — combined discount over cap returns 422, order not created', async () => {
    const { getPayload } = await import('payload')
    const calc = await import('@/lib/pricing/calculate')
    vi.mocked(calc.isWithinDiscountCap).mockReturnValueOnce(false)
    const localMockCreate = vi.fn().mockResolvedValue({ id: 'order-y', order_status: 'pending' })
    vi.mocked(getPayload).mockResolvedValue(
      buildMockPayload({
        create: localMockCreate,
        findByID: vi.fn().mockImplementation(({ collection }: { collection: string }) => {
          if (collection === 'products')
            return Promise.resolve({ id: 1, listPrice: 100, name: 'Test Blade', sku: 'SKU-1' })
          if (collection === 'contractors')
            return Promise.resolve({ id: 99, tier_discount_pct: 0.30, email_verified_at: '2026-01-01' })
          return Promise.resolve(null)
        }),
      }) as any,
    )
    const res = await submitOrder(mkReq(mkBody()))
    expect(res.status).toBe(422)
    const body = await res.json()
    expect(body.error).toMatch(/exceeds the maximum allowed discount/i)
    expect(localMockCreate).not.toHaveBeenCalled()
  })

  // ------------------------------------------------------------------
  // NEW: multi-line, cart clear, empty-lines
  // ------------------------------------------------------------------

  it('multi-line submission creates N order rows with shared submission_id', async () => {
    const { getPayload } = await import('payload')
    const localMockCreate = vi.fn().mockResolvedValue({ id: 1 })
    const localMockFindByID = vi.fn().mockImplementation(({ collection, id }: any) => {
      if (collection === 'products')
        return Promise.resolve({ id: Number(id), name: `P${id}`, listPrice: 100, sku: `SKU-${id}` })
      if (collection === 'contractors')
        return Promise.resolve({ id: 99, email: 'c@test.com', tier_discount_pct: 0.05 })
      return Promise.resolve(null)
    })
    vi.mocked(getPayload).mockResolvedValue(
      buildMockPayload({
        findByID: localMockFindByID,
        create: localMockCreate,
      }) as any,
    )
    const res = await submitOrder(
      mkReq(
        mkBody({
          lines: [
            { productId: '1', quantity: 2 },
            { productId: '2', quantity: 1 },
          ],
          clientEffectiveTotal: 285, // 2×95 + 1×95
        }),
      ),
    )
    expect(res.status).toBe(201)
    const orderCalls = localMockCreate.mock.calls.filter((c: any) => c[0].collection === 'orders')
    expect(orderCalls).toHaveLength(2)
    expect(orderCalls[0][0].data.submission_id).toBe('sub-key-1')
    expect(orderCalls[1][0].data.submission_id).toBe('sub-key-1')
    expect(orderCalls[0][0].data.idempotency_key).toBe('sub-key-1:0')
    expect(orderCalls[1][0].data.idempotency_key).toBe('sub-key-1:1')
  })

  it('clears the cart after successful submission', async () => {
    const { getPayload } = await import('payload')
    const localMockCreate = vi.fn().mockResolvedValue({ id: 1 })
    const localMockUpdate = vi.fn().mockResolvedValue({})
    const localMockFind = vi.fn().mockImplementation(({ collection }: any) => {
      if (collection === 'carts')
        return Promise.resolve({
          docs: [{ id: 7, contractor: 99, items: [{ product: 1, quantity: 2 }] }],
          totalDocs: 1,
        })
      // orders find calls (rate limit, idempotency)
      return Promise.resolve({ docs: [], totalDocs: 0 })
    })
    vi.mocked(getPayload).mockResolvedValue(
      buildMockPayload({
        find: localMockFind,
        create: localMockCreate,
        update: localMockUpdate,
      }) as any,
    )
    await submitOrder(mkReq(mkBody()))
    const cartUpdate = localMockUpdate.mock.calls.find(
      (c: any) => c[0].collection === 'carts' && c[0].id === 7,
    )
    expect(cartUpdate?.[0].data.items).toEqual([])
  })

  it('response shape is {ok, orderIds, submission_id}', async () => {
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue(buildMockPayload() as any)
    const res = await submitOrder(mkReq(mkBody()))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(Array.isArray(body.orderIds)).toBe(true)
    expect(body.submission_id).toBe('sub-key-1')
  })
})
