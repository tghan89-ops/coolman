// lib/__tests__/admin-acknowledge.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('payload', () => ({ getPayload: vi.fn() }))
vi.mock('@payload-config', () => ({ default: {} }))

type MockPayload = {
  auth: ReturnType<typeof vi.fn>
  findByID: ReturnType<typeof vi.fn>
  update: ReturnType<typeof vi.fn>
}

const buildPayload = (over: Partial<MockPayload> = {}): MockPayload => ({
  auth: vi.fn().mockResolvedValue({ user: { id: 'admin-1', email: 'a@x.com', collection: 'adminUsers', role: 'admin' } }),
  findByID: vi.fn().mockResolvedValue({ id: 'ord-1', order_status: 'pending' }),
  update: vi.fn().mockResolvedValue({ id: 'ord-1', order_status: 'acknowledged', acknowledged_at: '2026-05-11T00:00:00.000Z' }),
  ...over,
})

const callPost = async (id: string) => {
  const { POST } = await import('../../app/api/admin/orders/[id]/acknowledge/route')
  const req = new Request(`http://localhost/api/admin/orders/${id}/acknowledge`, { method: 'POST' })
  return POST(req as any, { params: Promise.resolve({ id }) })
}

describe('POST /api/admin/orders/[id]/acknowledge', () => {
  beforeEach(() => vi.clearAllMocks())

  it('acknowledges a pending order: sets status + acknowledged_at, returns 200', async () => {
    const { getPayload } = await import('payload')
    const p = buildPayload()
    vi.mocked(getPayload).mockResolvedValue(p as any)

    const res = await callPost('ord-1')
    expect(res.status).toBe(200)
    expect(p.update).toHaveBeenCalledTimes(1)
    const arg = p.update.mock.calls[0][0]
    expect(arg.collection).toBe('orders')
    expect(arg.id).toBe('ord-1')
    expect(arg.data.order_status).toBe('acknowledged')
    expect(typeof arg.data.acknowledged_at).toBe('string')
    expect(arg.overrideAccess).toBe(true)
  })

  it('rejects a non-admin session with 401 and never touches the order', async () => {
    const { getPayload } = await import('payload')
    const p = buildPayload({ auth: vi.fn().mockResolvedValue({ user: { id: 'c-1', collection: 'contractors' } }) })
    vi.mocked(getPayload).mockResolvedValue(p as any)

    const res = await callPost('ord-1')
    expect(res.status).toBe(401)
    expect(p.update).not.toHaveBeenCalled()
  })

  it('rejects when there is no session at all with 401', async () => {
    const { getPayload } = await import('payload')
    const p = buildPayload({ auth: vi.fn().mockResolvedValue({ user: null }) })
    vi.mocked(getPayload).mockResolvedValue(p as any)

    const res = await callPost('ord-1')
    expect(res.status).toBe(401)
    expect(p.update).not.toHaveBeenCalled()
  })

  it('is a no-op on an already-acknowledged order (double-tap safe), returns 200 unchanged', async () => {
    const { getPayload } = await import('payload')
    const p = buildPayload({ findByID: vi.fn().mockResolvedValue({ id: 'ord-1', order_status: 'acknowledged' }) })
    vi.mocked(getPayload).mockResolvedValue(p as any)

    const res = await callPost('ord-1')
    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ unchanged: true })
    expect(p.update).not.toHaveBeenCalled()
  })

  it('returns 404 when the order does not exist', async () => {
    const { getPayload } = await import('payload')
    const p = buildPayload({ findByID: vi.fn().mockRejectedValue(new Error('not found')) })
    vi.mocked(getPayload).mockResolvedValue(p as any)

    const res = await callPost('missing')
    expect(res.status).toBe(404)
    expect(p.update).not.toHaveBeenCalled()
  })

  it('does NOT consult the orders_paused kill switch (no findGlobal call)', async () => {
    const { getPayload } = await import('payload')
    const findGlobal = vi.fn()
    const p = { ...buildPayload(), findGlobal }
    vi.mocked(getPayload).mockResolvedValue(p as any)

    await callPost('ord-1')
    expect(findGlobal).not.toHaveBeenCalled()
  })
})
