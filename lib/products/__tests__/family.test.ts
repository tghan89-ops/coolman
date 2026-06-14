import { describe, it, expect } from 'vitest'
import {
  familyKey,
  isFamilyTagged,
  familyDisplayName,
  primaryMember,
  groupByFamily,
  familyAxisConfig,
  type FamilyMember,
} from '../family'

// Mirrors the real EcoSmart pilot family (smallest first by diameter).
const eco300: FamilyMember = { id: 126, name: '12″/300mm EcoSmart Series', listPrice: 265, diameter: '300mm', diameterMm: 300, family: 'ECOSMART' }
const eco350: FamilyMember = { id: 127, name: '14″/350mm EcoSmart Series', listPrice: 275, diameter: '350mm', diameterMm: 350, family: 'ECOSMART' }
const eco400: FamilyMember = { id: 125, name: '16″/400mm EcoSmart Series', listPrice: 400, diameter: '400mm', diameterMm: 400, family: 'ECOSMART' }
const solo: FamilyMember = { id: 99, name: 'Tile Precision 115', listPrice: 95, diameter: '115mm', diameterMm: 115, family: null }

describe('familyKey', () => {
  it('groups members sharing a non-empty family code (case/space-insensitive)', () => {
    expect(familyKey(eco300)).toBe(familyKey(eco350))
    expect(familyKey({ id: 1, family: ' ecosmart ' })).toBe(familyKey({ id: 2, family: 'ECOSMART' }))
  })
  it('keeps untagged products as their own singleton keyed by id', () => {
    expect(familyKey(solo)).toBe('solo:99')
    expect(familyKey({ id: 5, family: '' })).toBe('solo:5')
    expect(familyKey({ id: 5, family: '   ' })).toBe('solo:5')
    expect(familyKey({ id: 6, family: null })).not.toBe(familyKey({ id: 7, family: null }))
  })
})

describe('isFamilyTagged', () => {
  it('is true only for a non-blank family code', () => {
    expect(isFamilyTagged(eco300)).toBe(true)
    expect(isFamilyTagged(solo)).toBe(false)
    expect(isFamilyTagged({ family: '  ' })).toBe(false)
  })
})

describe('familyDisplayName', () => {
  it('strips a leading size token to get the shared name', () => {
    expect(familyDisplayName('12″/300mm EcoSmart Series')).toBe('EcoSmart Series')
    expect(familyDisplayName('14" / 350mm EcoSmart Series')).toBe('EcoSmart Series')
    expect(familyDisplayName('350mm Turbo Blade')).toBe('Turbo Blade')
  })
  it('falls back to the original name when nothing is strippable', () => {
    expect(familyDisplayName('EcoSmart Series')).toBe('EcoSmart Series')
    expect(familyDisplayName('')).toBe('')
  })
})

describe('primaryMember', () => {
  it('returns the smallest-diameter member regardless of input order', () => {
    expect(primaryMember([eco400, eco300, eco350]).id).toBe(126)
  })
  it('treats missing diameter as largest so a real diameter always wins', () => {
    const noDia: FamilyMember = { id: 1, name: 'x', listPrice: 1, diameterMm: null }
    expect(primaryMember([noDia, eco300]).id).toBe(126)
  })
})

describe('groupByFamily', () => {
  it('collapses a family into one group with from-price, range, and stripped name', () => {
    const groups = groupByFamily([eco400, eco300, eco350])
    expect(groups).toHaveLength(1)
    const g = groups[0]
    expect(g.isFamily).toBe(true)
    expect(g.members).toHaveLength(3)
    expect(g.primary.id).toBe(126) // smallest is the link target + card image
    expect(g.fromPrice).toBe(265) // lowest list price
    expect(g.displayName).toBe('EcoSmart Series')
    expect(g.diameterRange).toBe('300–400 mm')
  })

  it('ignores unpriced (0) members when computing the from-price', () => {
    const draft: FamilyMember = { id: 200, name: '10″/250mm EcoSmart Series', listPrice: 0, diameter: '250mm', diameterMm: 250, family: 'ECOSMART' }
    const groups = groupByFamily([draft, eco300, eco400])
    expect(groups).toHaveLength(1)
    expect(groups[0].fromPrice).toBe(265) // not 0
  })

  it('leaves untagged products as their own single-member groups (unchanged behaviour)', () => {
    const groups = groupByFamily([solo])
    expect(groups).toHaveLength(1)
    expect(groups[0].isFamily).toBe(false)
    expect(groups[0].displayName).toBe('Tile Precision 115')
    expect(groups[0].fromPrice).toBe(95)
  })

  it('preserves first-appearance order across mixed solo + family rows', () => {
    const groups = groupByFamily([solo, eco300, eco350])
    expect(groups.map((g) => g.key)).toEqual(['solo:99', 'fam:ecosmart'])
  })

  it('a single surviving family member (e.g. after a diameter filter) is NOT a family card', () => {
    const groups = groupByFamily([eco350])
    expect(groups).toHaveLength(1)
    expect(groups[0].isFamily).toBe(false)
    // primary is that lone member, so the card links straight to it
    expect(groups[0].primary.id).toBe(127)
  })

  it('a size family badge counts distinct diameters (= members for a pure ladder)', () => {
    const g = groupByFamily([eco400, eco300, eco350])[0]
    expect(g.primaryAxisIsSize).toBe(true)
    expect(g.optionCount).toBe(3)
  })

  it('a two-axis family (TCT) counts DISTINCT sizes, not total SKUs, for the badge', () => {
    // 180mm has 40/60/80T, 230mm has 40/60T → 4 SKUs but only 2 distinct sizes
    const wood: FamilyMember[] = [
      { id: 1, name: '7″ 40-Tooth Wood Blade', listPrice: 70, diameter: '180mm', diameterMm: 180, family: 'TCT-WOOD', variantValue: 40, variantLabel: '40T' },
      { id: 2, name: '7″ 60-Tooth Wood Blade', listPrice: 80, diameter: '180mm', diameterMm: 180, family: 'TCT-WOOD', variantValue: 60, variantLabel: '60T' },
      { id: 3, name: '9″ 40-Tooth Wood Blade', listPrice: 105, diameter: '230mm', diameterMm: 230, family: 'TCT-WOOD', variantValue: 40, variantLabel: '40T' },
      { id: 4, name: '9″ 60-Tooth Wood Blade', listPrice: 125, diameter: '230mm', diameterMm: 230, family: 'TCT-WOOD', variantValue: 60, variantLabel: '60T' },
    ]
    const g = groupByFamily(wood)[0]
    expect(g.isFamily).toBe(true)
    expect(g.primaryAxisIsSize).toBe(true)
    expect(g.optionCount).toBe(2) // two distinct sizes, not 4 SKUs
    expect(g.displayName).toBe('Wood Cutting Blade (TCT)') // explicit config name
  })

  it('a non-size (grit) family badge counts distinct variant values, noun = options', () => {
    const grit: FamilyMember[] = [
      { id: 1, name: 'GC100-60#', listPrice: 50, diameter: '100mm', diameterMm: 100, family: 'GC100', variantValue: 60, variantLabel: '60#' },
      { id: 2, name: 'GC100-80#', listPrice: 50, diameter: '100mm', diameterMm: 100, family: 'GC100', variantValue: 80, variantLabel: '80#' },
      { id: 3, name: 'GC100-120#', listPrice: 50, diameter: '100mm', diameterMm: 100, family: 'GC100', variantValue: 120, variantLabel: '120#' },
    ]
    const g = groupByFamily(grit)[0]
    expect(g.isFamily).toBe(true)
    expect(g.primaryAxisIsSize).toBe(false) // grit is the primary axis here
    expect(g.optionCount).toBe(3)
    expect(g.displayName).toBe('GC100 Grinding Cup')
  })
})

describe('familyAxisConfig', () => {
  it('defaults unknown/untagged codes to a single size axis', () => {
    expect(familyAxisConfig('ECOSMART').axes).toEqual(['size'])
    expect(familyAxisConfig(null).axes).toEqual(['size'])
    expect(familyAxisConfig('  ').axes).toEqual(['size'])
  })
  it('resolves configured variant families case-insensitively', () => {
    expect(familyAxisConfig('GC100').axes).toEqual(['grit'])
    expect(familyAxisConfig('tct-wood').axes).toEqual(['size', 'tooth'])
    expect(familyAxisConfig('TuckPoint').axes).toEqual(['size', 'segment'])
  })
})
