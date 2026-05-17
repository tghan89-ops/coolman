import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('payload', () => ({
  getPayload: vi.fn(),
}))

vi.mock('@payload-config', () => ({ default: {} }))

describe('getPublishedPosts', () => {
  beforeEach(() => vi.clearAllMocks())

  it('queries only posts with status=published, sorted newest first', async () => {
    const find = vi.fn().mockResolvedValue({
      docs: [{ id: 1, slug: 'a', status: 'published' }],
    })
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({ find } as any)

    const { getPublishedPosts } = await import('../payload')
    const result = await getPublishedPosts(10)

    expect(result).toHaveLength(1)
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'posts',
        where: { status: { equals: 'published' } },
        sort: '-publishedAt',
        limit: 10,
      }),
    )
  })

  it('returns [] on error (e.g. db down) so the page still renders', async () => {
    const find = vi.fn().mockRejectedValue(new Error('boom'))
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({ find } as any)

    const { getPublishedPosts } = await import('../payload')
    expect(await getPublishedPosts()).toEqual([])
  })
})

describe('getPostBySlug', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns the post when it exists and is published', async () => {
    const post = { id: 1, slug: 'how-to', status: 'published', title: 'How to' }
    const find = vi.fn().mockResolvedValue({ docs: [post] })
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({ find } as any)

    const { getPostBySlug } = await import('../payload')
    expect(await getPostBySlug('how-to')).toEqual(post)
  })

  it('returns null for a draft — drafts must not appear publicly', async () => {
    const draft = { id: 1, slug: 'how-to', status: 'draft' }
    const find = vi.fn().mockResolvedValue({ docs: [draft] })
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({ find } as any)

    const { getPostBySlug } = await import('../payload')
    expect(await getPostBySlug('how-to')).toBeNull()
  })

  it('returns null when no row matches the slug', async () => {
    const find = vi.fn().mockResolvedValue({ docs: [] })
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({ find } as any)

    const { getPostBySlug } = await import('../payload')
    expect(await getPostBySlug('missing')).toBeNull()
  })
})

describe('getAllPublishedPostSlugs', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns slug strings for generateStaticParams', async () => {
    const find = vi.fn().mockResolvedValue({
      docs: [{ slug: 'a' }, { slug: 'b' }, { slug: null }],
    })
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({ find } as any)

    const { getAllPublishedPostSlugs } = await import('../payload')
    expect(await getAllPublishedPostSlugs()).toEqual(['a', 'b'])
  })
})
