/**
 * Legacy price-display branch resolver. Kept only to satisfy
 * `lib/__tests__/pricing-display.test.ts`. All live render paths now
 * use `resolveBranch` from `components/catalogue/PriceStackCard.tsx`.
 * Delete this file and its test in a follow-up once we confirm no
 * indirect imports remain.
 */

export type PriceDisplayMode = 'public' | 'unverified' | 'verifiedNoTier' | 'verifiedWithTier'

export function resolvePriceDisplayMode(opts: {
  isAuthenticated: boolean
  isContractor: boolean
  isVerified: boolean
  tierDiscountPct: number
}): PriceDisplayMode {
  if (!opts.isAuthenticated || !opts.isContractor) return 'public'
  if (!opts.isVerified) return 'unverified'
  if (opts.tierDiscountPct <= 0) return 'verifiedNoTier'
  return 'verifiedWithTier'
}
