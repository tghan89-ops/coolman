import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockFindByID = vi.fn()
const mockFind = vi.fn()
const mockCreate = vi.fn()
const mockUpdate = vi.fn()
const mockAuth = vi.fn()

vi.mock('payload', () => ({
  getPayload: vi.fn(async () => ({
    findByID: mockFindByID,
    find: mockFind,
    create: mockCreate,
    update: mockUpdate,
    auth: mockAuth,
  })),
}))

vi.mock('@payload-config', () => ({ default: {} }))

import { GET as cartGet, PUT as cartPut } from '@/app/api/cart/route'
import { POST as cartSync } from '@/app/api/cart/sync/route'

function mkReq(body?: unknown): Request {
  return new Request('http://localhost/api/cart', {
    method: body ? 'PUT' : 'GET',
    headers: { 'Content-Type': 'application/json', cookie: 'coolman-token=x' },
    body: body ? JSON.stringify(body) : undefined,
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  mockAuth.mockResolvedValue({ user: { id: 99, collection: 'contractors' } })
  mockFindByID.mockImplementation(({ collection, id }: any) => {
    if (collection === 'contractors')
      return Promise.resolve({ id: 99, tier_discount_pct: 0.05 })
    if (collection === 'products')
      return Promise.resolve({ id: Number(id), name: `P${id}`, sku: `SKU-${id}`, listPrice: 100, image: null })
    return Promise.resolve(null)
  })
  mockFind.mockResolvedValue({ docs: [] })
})

describe('GET /api/cart', () => {
  it('returns empty cart for contractor with no row', async () => {
    const res = await cartGet(mkReq())
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.items).toEqual([])
    expect(json.tierDiscountPct).toBe(0.05)
  })

  it('401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({ user: null })
    const res = await cartGet(mkReq())
    expect(res.status).toBe(401)
  })

  it('401 when user is admin (admins do not have carts)', async () => {
    mockAuth.mockResolvedValue({ user: { id: 1, collection: 'adminUsers' } })
    const res = await cartGet(mkReq())
    expect(res.status).toBe(401)
  })
})

describe('PUT /api/cart', () => {
  it('creates a cart row when none exists', async () => {
    mockFind.mockResolvedValue({ docs: [] })
    const res = await cartPut(mkReq({ items: [{ productId: '1', quantity: 2 }] }))
    expect(res.status).toBe(200)
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ collection: 'carts' }),
    )
  })

  it('updates the existing cart row', async () => {
    mockFind.mockResolvedValue({ docs: [{ id: 7, contractor: 99, items: [] }] })
    const res = await cartPut(mkReq({ items: [{ productId: '1', quantity: 3 }] }))
    expect(res.status).toBe(200)
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ collection: 'carts', id: 7 }),
    )
  })

  it('rejects qty < 1', async () => {
    const res = await cartPut(mkReq({ items: [{ productId: '1', quantity: 0 }] }))
    expect(res.status).toBe(400)
  })

  it('rejects unknown product', async () => {
    mockFindByID.mockImplementation(({ collection, id }: any) =>
      collection === 'products' && Number(id) === 999
        ? Promise.resolve(null)
        : Promise.resolve({ id: 99, tier_discount_pct: 0.05 }),
    )
    const res = await cartPut(mkReq({ items: [{ productId: '999', quantity: 1 }] }))
    expect(res.status).toBe(400)
  })
})

describe('POST /api/cart/sync', () => {
  it('merges local into empty server cart', async () => {
    mockFind.mockResolvedValue({ docs: [] })
    const req = new Request('http://localhost/api/cart/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', cookie: 'coolman-token=x' },
      body: JSON.stringify({ items: [{ productId: '1', quantity: 2 }] }),
    })
    const res = await cartSync(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.items).toHaveLength(1)
    expect(json.items[0].quantity).toBe(2)
  })

  it('sums quantities for the same product', async () => {
    mockFind.mockResolvedValue({
      docs: [{ id: 7, contractor: 99, items: [{ product: 1, quantity: 3, added_at: new Date().toISOString() }] }],
    })
    const req = new Request('http://localhost/api/cart/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', cookie: 'coolman-token=x' },
      body: JSON.stringify({ items: [{ productId: '1', quantity: 2 }] }),
    })
    const res = await cartSync(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    const p1 = json.items.find((it: any) => String(it.productId) === '1')
    expect(p1.quantity).toBe(5)
  })

  it('empty payload is a no-op', async () => {
    mockFind.mockResolvedValue({ docs: [{ id: 7, contractor: 99, items: [{ product: 1, quantity: 3, added_at: new Date().toISOString() }] }] })
    const req = new Request('http://localhost/api/cart/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', cookie: 'coolman-token=x' },
      body: JSON.stringify({ items: [] }),
    })
    const res = await cartSync(req)
    expect(res.status).toBe(200)
    expect(mockUpdate).not.toHaveBeenCalled()
  })
})
