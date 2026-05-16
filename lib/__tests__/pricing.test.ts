import { describe, it, expect, vi, beforeEach } from 'vitest'
import { calculateEffectivePrice, isWithinDiscountCap, isPriceStale } from '../pricing/calculate'

vi.mock('payload', () => ({ getPayload: vi.fn() }))
vi.mock('@payload-config', () => ({ default: {} }))

describe('calculateEffectivePrice', () => {
  it('no discounts — returns list price as effective price', () => {
    const r = calculateEffectivePrice(100, 0, 0)
    expect(r.effectivePrice).toBe(100)
    expect(r.tierSaving).toBe(0)
    expect(r.promoSaving).toBe(0)
  })

  it('tier only — 5% tier, no promo', () => {
    const r = calculateEffectivePrice(100, 0.05, 0)
    expect(r.effectivePrice).toBeCloseTo(95, 5)
    expect(r.tierSaving).toBeCloseTo(5, 5)
    expect(r.promoSaving).toBe(0)
  })

  it('promo only — 10% promo, no tier', () => {
    const r = calculateEffectivePrice(100, 0, 0.10)
    expect(r.effectivePrice).toBeCloseTo(90, 5)
    expect(r.tierSaving).toBe(0)
    expect(r.promoSaving).toBeCloseTo(10, 5)
  })

  it('stacked — 15% tier + 20% promo = 32% total savings (not 35%)', () => {
    // list=100, after tier=85, after promo=85*0.80=68
    const r = calculateEffectivePrice(100, 0.15, 0.20)
    expect(r.afterTierDiscount).toBeCloseTo(85, 5)
    expect(r.effectivePrice).toBeCloseTo(68, 5)
    expect(r.tierSaving).toBeCloseTo(15, 5)
    expect(r.promoSaving).toBeCloseTo(17, 5)
  })
})

describe('isWithinDiscountCap', () => {
  it('0% + 0% is within any cap', () => {
    expect(isWithinDiscountCap(0, 0, 0.40)).toBe(true)
  })

  it('30% tier + 15% promo = 40.5% combined — over 40% cap', () => {
    // effective = (1-0.30)*(1-0.15) = 0.70*0.85 = 0.595 → savings = 40.5%
    expect(isWithinDiscountCap(0.30, 0.15, 0.40)).toBe(false)
  })

  it('20% tier + 20% promo = 36% combined — within 40% cap', () => {
    // effective = 0.80 * 0.80 = 0.64 → savings = 36%
    expect(isWithinDiscountCap(0.20, 0.20, 0.40)).toBe(true)
  })

  it('exactly at cap boundary — within (returns true)', () => {
    // 40% cap: effective multiplier must be >= 0.60
    // (1-0.40)*(1-0) = 0.60 exactly → true
    expect(isWithinDiscountCap(0.40, 0, 0.40)).toBe(true)
  })
})

describe('isPriceStale', () => {
  it('same price — not stale', () => {
    expect(isPriceStale(100.00, 100.00)).toBe(false)
  })

  it('within tolerance — not stale', () => {
    expect(isPriceStale(100.005, 100.00)).toBe(false)
  })

  it('over tolerance — stale', () => {
    expect(isPriceStale(100.02, 100.00)).toBe(true)
  })
})

describe('validatePromoCode', () => {
  beforeEach(() => { vi.clearAllMocks(); vi.resetModules() })

  it('not_found when code does not exist', async () => {
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({
      find: vi.fn().mockResolvedValue({ docs: [] }),
    } as any)
    const { validatePromoCode } = await import('../pricing/validate-promo')
    const result = await validatePromoCode('FAKECODE')
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.reason).toBe('not_found')
  })

  it('inactive promo returns inactive', async () => {
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({
      find: vi.fn().mockResolvedValue({
        docs: [{ active: false, valid_from: '2026-01-01', valid_until: '2027-01-01', usage_count: 0, usage_cap: 100, promo_discount_pct: 0.10 }],
      }),
    } as any)
    const { validatePromoCode } = await import('../pricing/validate-promo')
    const result = await validatePromoCode('INACTIVE')
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.reason).toBe('inactive')
  })

  it('usage cap reached returns usage_cap_reached', async () => {
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({
      find: vi.fn().mockResolvedValue({
        docs: [{ active: true, valid_from: '2026-01-01', valid_until: '2027-12-31', usage_count: 100, usage_cap: 100, promo_discount_pct: 0.10 }],
      }),
    } as any)
    const { validatePromoCode } = await import('../pricing/validate-promo')
    const result = await validatePromoCode('CAPCODE')
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.reason).toBe('usage_cap_reached')
  })

  it('not-yet-active promo (valid_from in the future) returns not_yet_active', async () => {
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({
      find: vi.fn().mockResolvedValue({
        docs: [{ active: true, valid_from: '2099-01-01', valid_until: '2099-12-31', usage_count: 0, usage_cap: 100, promo_discount_pct: 0.10 }],
      }),
    } as any)
    const { validatePromoCode } = await import('../pricing/validate-promo')
    const result = await validatePromoCode('EARLYBIRD')
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.reason).toBe('not_yet_active')
  })

  it('expired promo (valid_until in the past) returns expired', async () => {
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({
      find: vi.fn().mockResolvedValue({
        docs: [{ active: true, valid_from: '2020-01-01', valid_until: '2020-12-31', usage_count: 0, usage_cap: 100, promo_discount_pct: 0.10 }],
      }),
    } as any)
    const { validatePromoCode } = await import('../pricing/validate-promo')
    const result = await validatePromoCode('OLDRAYA')
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.reason).toBe('expired')
  })

  it('valid promo returns promo_discount_pct', async () => {
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({
      find: vi.fn().mockResolvedValue({
        docs: [{ id: 'promo-1', active: true, valid_from: '2026-01-01', valid_until: '2027-12-31', usage_count: 0, usage_cap: 100, promo_discount_pct: 0.15 }],
      }),
    } as any)
    const { validatePromoCode } = await import('../pricing/validate-promo')
    const result = await validatePromoCode('RAYA15')
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.promo_discount_pct).toBe(0.15)
      expect(result.promoId).toBe('promo-1')
    }
  })
})
