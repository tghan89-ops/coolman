import { describe, it, expect } from 'vitest'
import { resolvePriceDisplayMode } from '@/lib/pricing/display-mode'

describe('resolvePriceDisplayMode', () => {
  it('public — no auth → public', () => {
    expect(
      resolvePriceDisplayMode({
        isAuthenticated: false,
        isContractor: false,
        isVerified: false,
        tierDiscountPct: 0,
      }),
    ).toBe('public')
  })

  it('public — auth but not a contractor (admin) → public', () => {
    expect(
      resolvePriceDisplayMode({
        isAuthenticated: true,
        isContractor: false,
        isVerified: true,
        tierDiscountPct: 0.10,
      }),
    ).toBe('public')
  })

  it('unverified — contractor logged in but email not verified → unverified', () => {
    expect(
      resolvePriceDisplayMode({
        isAuthenticated: true,
        isContractor: true,
        isVerified: false,
        tierDiscountPct: 0.10,
      }),
    ).toBe('unverified')
  })

  it('verifiedNoTier — verified contractor on default 0% tier → verifiedNoTier', () => {
    expect(
      resolvePriceDisplayMode({
        isAuthenticated: true,
        isContractor: true,
        isVerified: true,
        tierDiscountPct: 0,
      }),
    ).toBe('verifiedNoTier')
  })

  it('verifiedWithTier — verified contractor with a tier > 0 → verifiedWithTier', () => {
    expect(
      resolvePriceDisplayMode({
        isAuthenticated: true,
        isContractor: true,
        isVerified: true,
        tierDiscountPct: 0.15,
      }),
    ).toBe('verifiedWithTier')
  })

  it('boundary — negative tier treated as no tier', () => {
    expect(
      resolvePriceDisplayMode({
        isAuthenticated: true,
        isContractor: true,
        isVerified: true,
        tierDiscountPct: -0.01,
      }),
    ).toBe('verifiedNoTier')
  })
})
