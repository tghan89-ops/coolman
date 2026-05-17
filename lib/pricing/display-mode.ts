// lib/pricing/display-mode.ts
//
// Legacy server-safe pricing-mode helper retained for non-catalogue surfaces
// (e.g. the cart/checkout server flows) that still resolve a coarse mode from
// the session. The catalogue and product detail pages now read raw flags
// (`isLoggedIn`, `emailVerified`, `tierDiscountPct`) and pass them straight to
// `PriceStackCard`, which is the only component allowed to render product
// price text. Do not introduce new callers — prefer `PriceStackCard` directly.

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
