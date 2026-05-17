import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mirror the mocking style used in posts.test.ts so the Payload bootstrap
// doesn't try to spin up a real DB during tests.
vi.mock('payload', () => ({
  getPayload: vi.fn(),
}))

vi.mock('@payload-config', () => ({ default: {} }))

describe('getPublishedPostCount', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns totalDocs from a cheap (limit:0, depth:0) published-posts probe', async () => {
    const find = vi.fn().mockResolvedValue({ totalDocs: 5, docs: [] })
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({ find } as any)

    const { getPublishedPostCount } = await import('../payload')
    const count = await getPublishedPostCount()

    expect(count).toBe(5)
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'posts',
        where: { status: { equals: 'published' } },
        limit: 0,
        depth: 0,
      }),
    )
  })

  it('returns 0 when totalDocs is missing on the response (defensive default)', async () => {
    const find = vi.fn().mockResolvedValue({ docs: [] })
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({ find } as any)

    const { getPublishedPostCount } = await import('../payload')
    expect(await getPublishedPostCount()).toBe(0)
  })

  it('returns 0 when the query throws — header must still render', async () => {
    const find = vi.fn().mockRejectedValue(new Error('db down'))
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({ find } as any)

    const { getPublishedPostCount } = await import('../payload')
    expect(await getPublishedPostCount()).toBe(0)
  })
})
