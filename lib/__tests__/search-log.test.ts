// lib/__tests__/search-log.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('payload', () => ({ getPayload: vi.fn() }))
vi.mock('@payload-config', () => ({ default: {} }))

// Run `after()` callbacks synchronously so we can assert on the background write.
const afterCallbacks: Array<() => any> = []
vi.mock('next/server', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/server')>()
  return {
    ...actual,
    after: (cb: () => any) => {
      afterCallbacks.push(cb)
    },
  }
})

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({ get: vi.fn().mockReturnValue(undefined) }),
}))

const runAfter = async () => {
  for (const cb of afterCallbacks.splice(0)) await cb()
}

const buildMockPayload = (overrides?: {
  create?: any
  find?: any
  update?: any
  auth?: any
}) => ({
  create: overrides?.create ?? vi.fn().mockResolvedValue({ id: 'log-1' }),
  find: overrides?.find ?? vi.fn().mockResolvedValue({ docs: [] }),
  update: overrides?.update ?? vi.fn().mockResolvedValue({ id: 'log-1' }),
  auth: overrides?.auth ?? vi.fn().mockResolvedValue({ user: null }),
})

const post = async (body: any) => {
  const { POST } = await import('../../app/api/search-log/route')
  const req = new Request('http://localhost/api/search-log', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
  return POST(req as any)
}

describe('POST /api/search-log', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    afterCallbacks.length = 0
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
  })

  it('logs a search with query + result count, returns 202', async () => {
    const { getPayload } = await import('payload')
    const mockCreate = vi.fn().mockResolvedValue({ id: 'log-1' })
    vi.mocked(getPayload).mockResolvedValue(buildMockPayload({ create: mockCreate }) as any)

    const res = await post({ query: 'category:Granite materials:Concrete', resultCount: 7 })
    expect(res.status).toBe(202)
    expect(await res.json()).toEqual({ ok: true })

    await runAfter()
    expect(mockCreate).toHaveBeenCalledTimes(1)
    const arg = mockCreate.mock.calls[0][0]
    expect(arg.collection).toBe('searchLogs')
    expect(arg.data.query).toBe('category:Granite materials:Concrete')
    expect(arg.data.result_count).toBe(7)
    expect(arg.overrideAccess).toBe(true)
  })

  it('skips logging when query is empty and there are no results, returns 202 skipped', async () => {
    const { getPayload } = await import('payload')
    const mockCreate = vi.fn()
    vi.mocked(getPayload).mockResolvedValue(buildMockPayload({ create: mockCreate }) as any)

    const res = await post({ query: '', resultCount: 0 })
    expect(res.status).toBe(202)
    expect(await res.json()).toEqual({ ok: true, skipped: true })

    await runAfter()
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('returns 400 on invalid JSON', async () => {
    const { POST } = await import('../../app/api/search-log/route')
    const req = new Request('http://localhost/api/search-log', { method: 'POST', body: 'not json' })
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })

  it('product view: appends productId to contractor’s most recent search row', async () => {
    const { getPayload } = await import('payload')
    const mockFind = vi.fn().mockResolvedValue({
      docs: [{ id: 42, viewed_product_ids: [{ productId: 'prev' }] }],
    })
    const mockUpdate = vi.fn().mockResolvedValue({ id: 42 })
    const mockCreate = vi.fn()
    const mockAuth = vi
      .fn()
      .mockResolvedValue({ user: { id: 7, collection: 'contractors' } })
    vi.mocked(getPayload).mockResolvedValue(
      buildMockPayload({
        find: mockFind,
        update: mockUpdate,
        create: mockCreate,
        auth: mockAuth,
      }) as any,
    )

    const res = await post({ viewedProductId: 'prod-123' })
    expect(res.status).toBe(202)
    await runAfter()

    expect(mockUpdate).toHaveBeenCalledTimes(1)
    const arg = mockUpdate.mock.calls[0][0]
    expect(arg.collection).toBe('searchLogs')
    expect(arg.id).toBe(42)
    expect(arg.data.viewed_product_ids).toEqual([
      { productId: 'prev' },
      { productId: 'prod-123' },
    ])
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('product view: dedupes — does not re-append a productId already on the row', async () => {
    const { getPayload } = await import('payload')
    const mockFind = vi.fn().mockResolvedValue({
      docs: [{ id: 42, viewed_product_ids: [{ productId: 'prod-123' }] }],
    })
    const mockUpdate = vi.fn()
    const mockCreate = vi.fn()
    const mockAuth = vi
      .fn()
      .mockResolvedValue({ user: { id: 7, collection: 'contractors' } })
    vi.mocked(getPayload).mockResolvedValue(
      buildMockPayload({
        find: mockFind,
        update: mockUpdate,
        create: mockCreate,
        auth: mockAuth,
      }) as any,
    )

    const res = await post({ viewedProductId: 'prod-123' })
    expect(res.status).toBe(202)
    await runAfter()

    expect(mockUpdate).not.toHaveBeenCalled()
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('product view: creates a minimal row when there is no recent search to attach to', async () => {
    const { getPayload } = await import('payload')
    const mockFind = vi.fn().mockResolvedValue({ docs: [] })
    const mockUpdate = vi.fn()
    const mockCreate = vi.fn().mockResolvedValue({ id: 'log-new' })
    const mockAuth = vi
      .fn()
      .mockResolvedValue({ user: { id: 7, collection: 'contractors' } })
    vi.mocked(getPayload).mockResolvedValue(
      buildMockPayload({
        find: mockFind,
        update: mockUpdate,
        create: mockCreate,
        auth: mockAuth,
      }) as any,
    )

    const res = await post({ viewedProductId: 'prod-123' })
    expect(res.status).toBe(202)
    await runAfter()

    expect(mockUpdate).not.toHaveBeenCalled()
    expect(mockCreate).toHaveBeenCalledTimes(1)
    const arg = mockCreate.mock.calls[0][0]
    expect(arg.data.viewed_product_ids).toEqual([{ productId: 'prod-123' }])
    expect(arg.data.contractor).toBe(7)
  })

  it('product view: anonymous (no contractor session) is dropped — no row created', async () => {
    const { getPayload } = await import('payload')
    const mockFind = vi.fn()
    const mockUpdate = vi.fn()
    const mockCreate = vi.fn()
    const mockAuth = vi.fn().mockResolvedValue({ user: null })
    vi.mocked(getPayload).mockResolvedValue(
      buildMockPayload({
        find: mockFind,
        update: mockUpdate,
        create: mockCreate,
        auth: mockAuth,
      }) as any,
    )

    const res = await post({ viewedProductId: 'prod-anon' })
    expect(res.status).toBe(202)
    await runAfter()

    expect(mockFind).not.toHaveBeenCalled()
    expect(mockUpdate).not.toHaveBeenCalled()
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('a failed background write never throws to the caller', async () => {
    const { getPayload } = await import('payload')
    const mockCreate = vi.fn().mockRejectedValue(new Error('db down'))
    vi.mocked(getPayload).mockResolvedValue(buildMockPayload({ create: mockCreate }) as any)
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const res = await post({ query: 'category:Tile', resultCount: 3 })
    expect(res.status).toBe(202)
    await expect(runAfter()).resolves.toBeUndefined()
    expect(errSpy).toHaveBeenCalled()
    errSpy.mockRestore()
  })
})
