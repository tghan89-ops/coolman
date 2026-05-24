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

describe('getActiveShibuyaMachines', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns active machines sorted by display_order', async () => {
    const mockMachines = [
      { id: 1, model_id: 'ts-405', model_name: 'TS-405', display_order: 10 },
      { id: 2, model_id: 'ts-605', model_name: 'TS-605', display_order: 20 },
    ]
    const findMock = vi.fn().mockResolvedValue({ docs: mockMachines })
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({ find: findMock } as any)

    const { getActiveShibuyaMachines } = await import('../payload')
    const result = await getActiveShibuyaMachines()

    expect(result).toHaveLength(2)
    expect(result[0].model_id).toBe('ts-403')
    // Sanity: filters by is_active and sorts by display_order.
    expect(findMock).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'shibuya-machines',
        where: { is_active: { equals: true } },
        sort: 'display_order',
      }),
    )
  })

  it('returns [] when Payload throws (e.g. fresh DB without the collection)', async () => {
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({
      find: vi.fn().mockRejectedValue(new Error('relation does not exist')),
    } as any)

    const { getActiveShibuyaMachines } = await import('../payload')
    const result = await getActiveShibuyaMachines()
    expect(result).toEqual([])
  })
})
