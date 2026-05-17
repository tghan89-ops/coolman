import { describe, it, expect } from 'vitest'
import { resolveBranch, type PriceStackBranch } from '@/components/catalogue/PriceStackCard'

// resolveBranch is the pure logic kernel of PriceStackCard — the 4-branch gate
// described in CLAUDE.md. The component itself wraps this with React-only
// rendering, but the gate decision must be testable without jsdom because the
// catalogue page surfaces (cards, hero, related products) all funnel through
// here. If this function ever lets a logged-out visitor through to a price
// branch, every product surface leaks pricing.

describe('PriceStackCard.resolveBranch', () => {
  it('logged-out visitor → "logged-out" no matter the tier or verified state', () => {
    const cases: Array<{ emailVerified: boolean; tierDiscountPct: number }> = [
      { emailVerified: false, tierDiscountPct: 0 },
      { emailVerified: true, tierDiscountPct: 0 },
      { emailVerified: false, tierDiscountPct: 0.05 },
      { emailVerified: true, tierDiscountPct: 0.15 },
    ]
    for (const c of cases) {
      expect(
        resolveBranch({ isLoggedIn: false, ...c }),
      ).toBe<PriceStackBranch>('logged-out')
    }
  })

  it('logged-in but email not verified → "unverified"', () => {
    expect(
      resolveBranch({ isLoggedIn: true, emailVerified: false, tierDiscountPct: 0 }),
    ).toBe<PriceStackBranch>('unverified')
    expect(
      resolveBranch({ isLoggedIn: true, emailVerified: false, tierDiscountPct: 0.1 }),
    ).toBe<PriceStackBranch>('unverified')
  })

  it('verified with zero tier → "list-only"', () => {
    expect(
      resolveBranch({ isLoggedIn: true, emailVerified: true, tierDiscountPct: 0 }),
    ).toBe<PriceStackBranch>('list-only')
  })

  it('verified with negative or zero tier coerces to "list-only" (defensive)', () => {
    // tier_discount_pct should never be negative in the DB, but if a bad row
    // sneaks in, we must not render a "stack-up" that subtracts a negative
    // (which would inflate the effective price above list).
    expect(
      resolveBranch({ isLoggedIn: true, emailVerified: true, tierDiscountPct: -0.05 }),
    ).toBe<PriceStackBranch>('list-only')
  })

  it('verified with NaN/Infinity/non-finite tier coerces to "list-only" (defensive)', () => {
    // NaN <= 0 is false in JS, so a plain comparison would let a bad tier
    // slip through and render "RM NaN" in the stack-up branch. Number.isFinite
    // catches NaN, Infinity, and -Infinity. Burned 2026-05-17 — see code-
    // quality review.
    expect(
      resolveBranch({ isLoggedIn: true, emailVerified: true, tierDiscountPct: Number.NaN }),
    ).toBe<PriceStackBranch>('list-only')
    expect(
      resolveBranch({ isLoggedIn: true, emailVerified: true, tierDiscountPct: Number.POSITIVE_INFINITY }),
    ).toBe<PriceStackBranch>('list-only')
  })

  it('verified with a positive tier → "stack-up"', () => {
    expect(
      resolveBranch({ isLoggedIn: true, emailVerified: true, tierDiscountPct: 0.05 }),
    ).toBe<PriceStackBranch>('stack-up')
    expect(
      resolveBranch({ isLoggedIn: true, emailVerified: true, tierDiscountPct: 0.2 }),
    ).toBe<PriceStackBranch>('stack-up')
  })
})
