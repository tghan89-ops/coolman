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

const buildMockPayload = (createImpl?: any) => ({
  create: createImpl ?? vi.fn().mockResolvedValue({ id: 'log-1' }),
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
    vi.mocked(getPayload).mockResolvedValue(buildMockPayload(mockCreate) as any)

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
    vi.mocked(getPayload).mockResolvedValue(buildMockPayload(mockCreate) as any)

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

  it('a failed background write never throws to the caller', async () => {
    const { getPayload } = await import('payload')
    const mockCreate = vi.fn().mockRejectedValue(new Error('db down'))
    vi.mocked(getPayload).mockResolvedValue(buildMockPayload(mockCreate) as any)
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const res = await post({ query: 'category:Tile', resultCount: 3 })
    expect(res.status).toBe(202)
    await expect(runAfter()).resolves.toBeUndefined()
    expect(errSpy).toHaveBeenCalled()
    errSpy.mockRestore()
  })
})
