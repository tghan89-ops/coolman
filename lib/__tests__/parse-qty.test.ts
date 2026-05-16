import { describe, it, expect } from 'vitest'
import { parseInitialQuantity } from '../../app/(frontend)/order-request/parse-qty'

describe('parseInitialQuantity', () => {
  it('returns 1 when the qty param is missing', () => {
    expect(parseInitialQuantity(undefined)).toBe(1)
  })

  it('returns 1 when the qty param is empty string', () => {
    expect(parseInitialQuantity('')).toBe(1)
  })

  it('parses a valid positive integer', () => {
    expect(parseInitialQuantity('3')).toBe(3)
    expect(parseInitialQuantity('25')).toBe(25)
  })

  it('floors decimals', () => {
    expect(parseInitialQuantity('3.9')).toBe(3)
  })

  it('returns 1 for zero, negatives, and NaN', () => {
    expect(parseInitialQuantity('0')).toBe(1)
    expect(parseInitialQuantity('-5')).toBe(1)
    expect(parseInitialQuantity('abc')).toBe(1)
    expect(parseInitialQuantity('NaN')).toBe(1)
  })
})
