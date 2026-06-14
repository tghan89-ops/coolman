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

  // --- Widened haystack: category / materials / applications ---

  it('matches on material name', () => {
    const p = { name: 'XR Coring Bit', materials: [{ name: 'Granite' }] }
    expect(productMatchesQuery(p, 'granite')).toBe(true)
  })

  it('matches on application name', () => {
    const p = { name: 'XR Coring Bit', applications: [{ name: 'Core Drilling' }] }
    expect(productMatchesQuery(p, 'core drilling')).toBe(true)
  })

  it('matches on category name', () => {
    const p = { name: 'GS Blade', category: 'Diamond Blades' }
    expect(productMatchesQuery(p, 'diamond blades')).toBe(true)
  })

  it('matches dual-shape relations given as bare strings', () => {
    const p = { name: 'XR Coring Bit', materials: ['Granite', 'Concrete'] }
    expect(productMatchesQuery(p, 'granite')).toBe(true)
    expect(productMatchesQuery(p, 'concrete')).toBe(true)
  })

  it('matches dual-shape relations given as bare numbers without throwing', () => {
    const p = { name: 'XR Coring Bit', materials: [123, null] }
    expect(productMatchesQuery(p, 'xr')).toBe(true)
    expect(productMatchesQuery(p, 'granite')).toBe(false)
  })

  it('token-AND: all tokens must appear somewhere in the haystack', () => {
    const p = {
      name: 'XR Coring Bit',
      category: 'Core Bits',
      materials: [{ name: 'Granite' }],
    }
    expect(productMatchesQuery(p, 'granite core')).toBe(true) // granite material + Core Bits category
    expect(productMatchesQuery(p, 'granite banana')).toBe(false) // banana matches nothing
  })

  it('expands trade-language synonyms (rebar -> Reinforced Concrete)', () => {
    const p = { name: 'Heavy Duty Bit', materials: [{ name: 'Reinforced Concrete' }] }
    expect(productMatchesQuery(p, 'rebar')).toBe(true)
  })

  it('expands Bahasa Malaysia synonyms (kaca -> Glass)', () => {
    const p = { name: 'Glass Drill', materials: [{ name: 'Glass' }] }
    expect(productMatchesQuery(p, 'kaca')).toBe(true)
  })

  it('ignores any description property — it is not part of the haystack', () => {
    const p = {
      name: 'XR Coring Bit',
      // description is intentionally excluded from the slim cache / haystack.
      description: 'unicornword exclusive secret',
    } as unknown as Parameters<typeof productMatchesQuery>[0]
    expect(productMatchesQuery(p, 'unicornword')).toBe(false)
    expect(productMatchesQuery(p, 'coring')).toBe(true)
  })
})
