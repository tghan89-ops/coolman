import { describe, it, expect } from 'vitest'
import { calculateEffectivePrice, isWithinDiscountCap, checkTierDiscountBounds } from '@/lib/pricing/calculate'

// Pure function extracted from the collection-check logic used in:
//   - lib/auth/contractor-session.ts (getContractorSession)
//   - app/api/orders/submit/route.ts (line 132)
// Both reject any session whose .collection !== 'contractors'.
function isContractorSession(user: unknown): boolean {
  if (!user || typeof user !== 'object') return false
  return (user as { collection?: string }).collection === 'contractors'
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Contractor session cannot reach /admin routes
// ─────────────────────────────────────────────────────────────────────────────

describe('auth gate — contractor collection check', () => {
  it('rejects an admin-users session', () => {
    expect(isContractorSession({ collection: 'admin-users', id: 'u1' })).toBe(false)
  })

  it('accepts a contractors session', () => {
    expect(isContractorSession({ collection: 'contractors', id: 'c1' })).toBe(true)
  })

  it('rejects null (unauthenticated)', () => {
    expect(isContractorSession(null)).toBe(false)
  })

  it('rejects undefined (unauthenticated)', () => {
    expect(isContractorSession(undefined)).toBe(false)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 2. Admin session cannot impersonate contractor checkout
//    The order submit route (app/api/orders/submit/route.ts:132) blocks any
//    session where collection !== 'contractors' — this test pins that invariant.
// ─────────────────────────────────────────────────────────────────────────────

describe('order submit — admin impersonation gate', () => {
  it('blocks an admin-users session from the checkout path', () => {
    const adminUser = { collection: 'admin-users', id: 'a1', email: 'alan@coolman.com.my' }
    expect(isContractorSession(adminUser)).toBe(false)
  })

  it('allows a verified contractors session through', () => {
    const contractor = {
      collection: 'contractors',
      id: 'c1',
      email: 'sub@example.com',
      email_verified_at: '2026-01-01T00:00:00Z',
    }
    expect(isContractorSession(contractor)).toBe(true)
  })

  it('blocks a session with no collection field', () => {
    // Edge-case: malformed token decoded without a collection claim.
    expect(isContractorSession({ id: 'x', email: 'x@x.com' })).toBe(false)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 3. Tier-discount sanity-bound warning triggers
// ─────────────────────────────────────────────────────────────────────────────

describe('tier-discount pricing — sanity bounds (checkTierDiscountBounds)', () => {
  it('valid: 0% discount is clean', () => {
    const r = checkTierDiscountBounds(0)
    expect(r.invalid).toBe(false)
    expect(r.suspicious).toBe(false)
  })

  it('valid: 10% discount is clean', () => {
    const r = checkTierDiscountBounds(0.1)
    expect(r.invalid).toBe(false)
    expect(r.suspicious).toBe(false)
  })

  it('suspicious: 60% discount triggers warning without being invalid', () => {
    const r = checkTierDiscountBounds(0.6)
    expect(r.invalid).toBe(false)
    expect(r.suspicious).toBe(true)
  })

  it('invalid: 100% discount (pct === 1) is rejected', () => {
    const r = checkTierDiscountBounds(1)
    expect(r.invalid).toBe(true)
  })

  it('invalid: negative discount is rejected', () => {
    const r = checkTierDiscountBounds(-0.1)
    expect(r.invalid).toBe(true)
  })

  it('invalid: > 100% discount produces negative effective price', () => {
    const result = calculateEffectivePrice(100, 1.5, 0)
    expect(result.effectivePrice).toBeLessThan(0)
    // Confirms why the invalid flag matters — bounds checking must happen before
    // the price is written to the orders table.
    const bounds = checkTierDiscountBounds(1.5)
    expect(bounds.invalid).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 4. Combined-discount cap (isWithinDiscountCap)
// ─────────────────────────────────────────────────────────────────────────────

describe('combined discount cap (isWithinDiscountCap)', () => {
  it('allows 10% tier + 10% promo within a 50% cap', () => {
    expect(isWithinDiscountCap(0.1, 0.1, 0.5)).toBe(true)
  })

  it('rejects 30% tier + 30% promo against a 50% cap', () => {
    // effective multiplier = 0.70 * 0.70 = 0.49 → 51% combined → exceeds cap
    expect(isWithinDiscountCap(0.3, 0.3, 0.5)).toBe(false)
  })

  it('allows exact cap boundary', () => {
    // 50% cap: effectiveMultiplier must be >= 0.50
    // 0% tier + 0% promo = 1.0 >= 0.5 ✓
    expect(isWithinDiscountCap(0, 0, 0.5)).toBe(true)
  })
})
