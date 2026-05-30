import { describe, it, expect } from 'vitest'
import { productMatchesQuery } from '../search'

const pda = { name: '12"/300mm PDA Series', sku: '12_300MM_PDA_SERIES' }
const ghost = { name: '12"/300mm GHOST Series', sku: '12_300MM_GHOST_SERIES' }
const classic = { name: '14"/350mm CLASSIC Series', sku: '14_350MM_CLASSIC_SERIES' }

describe('productMatchesQuery', () => {
  it('matches on product name, case-insensitive', () => {
    expect(productMatchesQuery(pda, 'pda')).toBe(true)
    expect(productMatchesQuery(pda, 'PDA')).toBe(true)
    expect(productMatchesQuery(pda, 'ghost')).toBe(false)
  })

  it('matches on SKU / product code', () => {
    expect(productMatchesQuery(classic, 'classic_series')).toBe(true)
    expect(productMatchesQuery(classic, '14_350')).toBe(true)
    expect(productMatchesQuery(ghost, '350mm_classic')).toBe(false)
  })

  it('matches partial substrings in either field', () => {
    expect(productMatchesQuery(ghost, '300mm')).toBe(true) // appears in name
    expect(productMatchesQuery(ghost, 'series')).toBe(true)
  })

  it('treats empty / whitespace query as match-all', () => {
    expect(productMatchesQuery(pda, '')).toBe(true)
    expect(productMatchesQuery(pda, '   ')).toBe(true)
  })

  it('trims surrounding whitespace before matching', () => {
    expect(productMatchesQuery(pda, '  pda  ')).toBe(true)
  })

  it('does not throw on missing name or sku', () => {
    expect(productMatchesQuery({}, 'anything')).toBe(false)
    expect(productMatchesQuery({ name: null, sku: null }, 'x')).toBe(false)
    expect(productMatchesQuery({ name: 'Bridge Saw' }, 'bridge')).toBe(true)
  })
})
