export interface PriceBreakdown {
  listPrice: number
  tierDiscountPct: number
  promoDiscountPct: number
  afterTierDiscount: number
  tierSaving: number
  afterPromoDiscount: number
  promoSaving: number
  effectivePrice: number
}

/**
 * Formula: list_price × (1 − tier) × (1 − promo)
 * All inputs are per-unit. Quantity multiplied outside this function.
 */
export function calculateEffectivePrice(
  listPrice: number,
  tierDiscountPct: number,
  promoDiscountPct: number,
): PriceBreakdown {
  const afterTierDiscount = listPrice * (1 - tierDiscountPct)
  const tierSaving = listPrice - afterTierDiscount
  const afterPromoDiscount = afterTierDiscount * (1 - promoDiscountPct)
  const promoSaving = afterTierDiscount - afterPromoDiscount

  return {
    listPrice,
    tierDiscountPct,
    promoDiscountPct,
    afterTierDiscount,
    tierSaving,
    afterPromoDiscount,
    promoSaving,
    effectivePrice: afterPromoDiscount,
  }
}

/**
 * Returns true if the discount is WITHIN the cap (order can proceed).
 * effective multiplier = (1-tier)*(1-promo) must be >= (1-maxCombinedPct)
 */
export function isWithinDiscountCap(
  tierDiscountPct: number,
  promoDiscountPct: number,
  maxCombinedDiscountPct: number,
): boolean {
  const effectiveMultiplier = (1 - tierDiscountPct) * (1 - promoDiscountPct)
  const minAllowedMultiplier = 1 - maxCombinedDiscountPct
  return effectiveMultiplier >= minAllowedMultiplier
}

/**
 * Validates a tier_discount_pct value (decimal, 0.10 = 10%).
 * Returns flags the admin UI or API can use to surface a warning before saving.
 * - invalid: outside [0, 1) → produces zero or negative prices
 * - suspicious: > 50% → unusual for a trade account, should require confirmation
 */
export function checkTierDiscountBounds(pct: number): {
  invalid: boolean
  suspicious: boolean
} {
  return {
    invalid: pct < 0 || pct >= 1,
    suspicious: pct > 0.5 && pct < 1,
  }
}

/**
 * Returns true if server-recomputed price differs from client price by > tolerance.
 * Used for stale-price guard in the order submission route.
 */
export function isPriceStale(
  serverPrice: number,
  clientPrice: number,
  toleranceMYR = 0.01,
): boolean {
  return Math.abs(serverPrice - clientPrice) > toleranceMYR
}
