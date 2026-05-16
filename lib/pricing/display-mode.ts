// lib/pricing/display-mode.ts
//
// Server-safe pricing-mode helper. Lives outside the 'use client' PriceDisplay
// component so server components (product list, product detail) can compute
// the mode from the session and pass it down as a prop.

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
