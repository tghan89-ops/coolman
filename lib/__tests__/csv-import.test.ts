// lib/__tests__/csv-import.test.ts
import { describe, it, expect, vi } from 'vitest'
import { parseProductCsv, validateProductRow, importProducts } from '../import/csv-products'

describe('parseProductCsv', () => {
  it('parses a basic header + row', () => {
    const csv = 'sku,name,nameBM,description,descriptionBM,listPrice\nA1,Blade,Mata,Cuts well,Cuts well BM,100'
    const rows = parseProductCsv(csv)
    expect(rows).toHaveLength(1)
    expect(rows[0].sku).toBe('A1')
    expect(rows[0].listPrice).toBe('100')
  })

  it('handles quoted fields with embedded commas', () => {
    const csv = 'sku,name,nameBM,description,descriptionBM,listPrice\nA1,"Blade, 14 inch","Mata, 14 inci","Strong, fast","Kuat, laju",250'
    const rows = parseProductCsv(csv)
    expect(rows[0].name).toBe('Blade, 14 inch')
    expect(rows[0].description).toBe('Strong, fast')
  })

  it('handles "" escaped quotes inside quoted fields', () => {
    const csv = 'sku,name,nameBM,description,descriptionBM,listPrice\nA1,"He said ""go""","Kata ""pergi""",d,dBM,10'
    const rows = parseProductCsv(csv)
    expect(rows[0].name).toBe('He said "go"')
    expect(rows[0].nameBM).toBe('Kata "pergi"')
  })

  it('handles CRLF line endings and trailing newline', () => {
    const csv = 'sku,name,nameBM,description,descriptionBM,listPrice\r\nA1,n,nb,d,db,10\r\nA2,n2,nb2,d2,db2,20\r\n'
    const rows = parseProductCsv(csv)
    expect(rows).toHaveLength(2)
    expect(rows[1].sku).toBe('A2')
  })

  it('skips wholly empty lines', () => {
    const csv = 'sku,name,nameBM,description,descriptionBM,listPrice\nA1,n,nb,d,db,10\n\nA2,n2,nb2,d2,db2,20\n'
    const rows = parseProductCsv(csv)
    expect(rows).toHaveLength(2)
  })

  it('returns [] for empty input', () => {
    expect(parseProductCsv('')).toEqual([])
  })
})

describe('validateProductRow', () => {
  const good = {
    sku: 'A1', name: 'Blade', nameBM: 'Mata',
    description: 'Cuts', descriptionBM: 'Cuts BM', listPrice: '100',
  }

  it('passes a valid row', () => {
    expect(validateProductRow(good)).toEqual([])
  })

  it('flags missing required fields', () => {
    const errs = validateProductRow({ ...good, sku: '', nameBM: '' })
    const fields = errs.map((e) => e.field)
    expect(fields).toContain('sku')
    expect(fields).toContain('nameBM')
  })

  it('rejects non-numeric price', () => {
    const errs = validateProductRow({ ...good, listPrice: 'abc' })
    expect(errs.some((e) => e.field === 'listPrice')).toBe(true)
  })

  it('rejects negative price', () => {
    const errs = validateProductRow({ ...good, listPrice: '-5' })
    expect(errs.some((e) => e.field === 'listPrice' && /negative/i.test(e.message))).toBe(true)
  })

  it('rejects malformed YouTube URL', () => {
    const errs = validateProductRow({ ...good, youtubeUrl: 'youtube.com/watch?v=xx' })
    expect(errs.some((e) => e.field === 'youtubeUrl')).toBe(true)
  })

  it('accepts a valid YouTube URL', () => {
    expect(validateProductRow({ ...good, youtubeUrl: 'https://youtube.com/watch?v=xx' })).toEqual([])
  })
})

describe('importProducts', () => {
  const buildPayload = (existingDocsBySku: Record<string, { id: string }> = {}) => {
    const find = vi.fn().mockImplementation(({ where }: { where: { sku: { equals: string } } }) => {
      const sku = where.sku.equals
      const existing = existingDocsBySku[sku]
      return existing ? { docs: [existing], totalDocs: 1 } : { docs: [], totalDocs: 0 }
    })
    const create = vi.fn().mockResolvedValue({ id: 'new-id' })
    const update = vi.fn().mockResolvedValue({ id: 'updated-id' })
    return { find, create, update } as any
  }

  it('creates a new product when SKU not found', async () => {
    const payload = buildPayload()
    const summary = await importProducts(
      [{ sku: 'NEW1', name: 'n', nameBM: 'nb', description: 'd', descriptionBM: 'db', listPrice: '50' }],
      payload,
    )
    expect(summary.created).toBe(1)
    expect(summary.updated).toBe(0)
    expect(summary.skipped).toBe(0)
    expect(payload.create).toHaveBeenCalledOnce()
    expect(payload.update).not.toHaveBeenCalled()
  })

  it('updates existing product when SKU matches', async () => {
    const payload = buildPayload({ EXIST1: { id: 'prod-xyz' } })
    const summary = await importProducts(
      [{ sku: 'EXIST1', name: 'n', nameBM: 'nb', description: 'd', descriptionBM: 'db', listPrice: '75' }],
      payload,
    )
    expect(summary.updated).toBe(1)
    expect(summary.created).toBe(0)
    expect(payload.update).toHaveBeenCalledWith(expect.objectContaining({ id: 'prod-xyz' }))
  })

  it('skips rows with validation errors and does not call create/update', async () => {
    const payload = buildPayload()
    const summary = await importProducts(
      [{ sku: '', name: '', nameBM: '', description: '', descriptionBM: '', listPrice: 'bad' }],
      payload,
    )
    expect(summary.skipped).toBe(1)
    expect(summary.created).toBe(0)
    expect(payload.create).not.toHaveBeenCalled()
    expect(payload.find).not.toHaveBeenCalled()
    expect(summary.rows[0].errors?.length).toBeGreaterThan(0)
  })

  it('reports create failure as skipped with error message', async () => {
    const payload = buildPayload()
    payload.create = vi.fn().mockRejectedValue(new Error('DB constraint X'))
    const summary = await importProducts(
      [{ sku: 'NEW2', name: 'n', nameBM: 'nb', description: 'd', descriptionBM: 'db', listPrice: '50' }],
      payload,
    )
    expect(summary.skipped).toBe(1)
    expect(summary.rows[0].errors?.[0].message).toBe('DB constraint X')
  })

  it('passes optional spec fields through and coerces maxRPM', async () => {
    const payload = buildPayload()
    await importProducts(
      [{
        sku: 'A1', name: 'n', nameBM: 'nb', description: 'd', descriptionBM: 'db', listPrice: '50',
        diameter: '350mm', maxRPM: '3000', youtubeUrl: 'https://youtu.be/abc',
      }],
      payload,
    )
    const data = payload.create.mock.calls[0][0].data
    expect(data.diameter).toBe('350mm')
    expect(data.maxRPM).toBe(3000)
    expect(data.youtubeUrl).toBe('https://youtu.be/abc')
  })
})
