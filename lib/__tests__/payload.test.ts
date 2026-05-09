import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('payload', () => ({
  getPayload: vi.fn(),
}))

vi.mock('@payload-config', () => ({ default: {} }))

describe('getProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns array of products from Payload', async () => {
    const mockProducts = [
      { id: '1', name: 'Test Blade', sku: 'CM-TEST-001', listPrice: 100 },
    ]
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({
      find: vi.fn().mockResolvedValue({ docs: mockProducts }),
    } as any)

    const { getProducts } = await import('../payload')
    const result = await getProducts()
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Test Blade')
  })
})

describe('getProductById', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns a single product by id', async () => {
    const mockProduct = { id: 'abc123', name: 'Granite Pro', listPrice: 185 }
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({
      findByID: vi.fn().mockResolvedValue(mockProduct),
    } as any)

    const { getProductById } = await import('../payload')
    const result = await getProductById('abc123')
    expect(result?.name).toBe('Granite Pro')
  })

  it('returns null when product not found', async () => {
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({
      findByID: vi.fn().mockRejectedValue(new Error('Not found')),
    } as any)

    const { getProductById } = await import('../payload')
    const result = await getProductById('nonexistent')
    expect(result).toBeNull()
  })
})

describe('getGlobal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns global data by slug', async () => {
    const mockData = { heroTitle: 'Welcome' }
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({
      findGlobal: vi.fn().mockResolvedValue(mockData),
    } as any)

    const { getGlobal } = await import('../payload')
    const result = await getGlobal('home-page')
    expect(result).toEqual(mockData)
  })
})
