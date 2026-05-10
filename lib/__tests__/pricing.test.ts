import { describe, it, expect } from 'vitest'
import { calculateEffectivePrice, isWithinDiscountCap, isPriceStale } from '../pricing/calculate'

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
