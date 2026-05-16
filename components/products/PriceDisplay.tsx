'use client'

// components/products/PriceDisplay.tsx
//
// Server-aware price renderer. Receives a pre-resolved tier (decided server-side
// by reading the contractor session) and chooses one of four visual states.
//
// State matrix:
//   - public            → list price + "Log in for contract price"
//   - unverified        → list price + "Log in for contract price"
//                          (we treat "logged in but no contract eligibility"
//                          the same way the public sees it, with the same hint)
//   - verifiedNoTier    → list price only (nothing to discount)
//   - verifiedWithTier  → stack: list (strike) → tier % → effective (mono)

import Link from 'next/link'
import { formatPrice } from '@/lib/utils/formatting'
import { calculateEffectivePrice } from '@/lib/pricing/calculate'
import { COPY, type Language } from '@/lib/i18n/copy'
import type { PriceDisplayMode } from '@/lib/pricing/display-mode'

// Re-export so existing client-side imports keep working.
export { resolvePriceDisplayMode } from '@/lib/pricing/display-mode'
export type { PriceDisplayMode }
export type PriceDisplayTone = 'light' | 'dark'

export interface PriceDisplayProps {
  listPrice: number
  tierDiscountPct: number  // 0 if no tier or not verified
  mode: PriceDisplayMode
  language?: Language
  size?: 'card' | 'detail'  // card = compact, detail = stack
  tone?: PriceDisplayTone   // light = navy text on white; dark = white text on navy
  loginHref?: string
}

export function PriceDisplay({
  listPrice,
  tierDiscountPct,
  mode,
  language = 'EN',
  size = 'card',
  tone = 'light',
  loginHref = '/auth/login',
}: PriceDisplayProps) {
  const t = COPY[language].product
  const isDark = tone === 'dark'

  const labelClass = isDark ? 'text-white/60' : 'text-ink-muted'
  const strikeClass = isDark ? 'text-white/40' : 'text-ink-muted'
  const headingClass = isDark ? 'text-white' : 'text-navy'
  const effectiveClass = 'text-accent'
  const hintClass = isDark
    ? 'text-accent hover:text-white'
    : 'text-accent hover:text-accent-dark'

  if (mode === 'verifiedWithTier' && tierDiscountPct > 0) {
    const breakdown = calculateEffectivePrice(listPrice, tierDiscountPct, 0)
    if (size === 'detail') {
      return (
        <div className="space-y-1.5">
          <div className={`flex items-baseline gap-2 text-sm ${labelClass}`}>
            <span>{t.priceList}:</span>
            <span className="font-mono line-through">{formatPrice(listPrice)}</span>
          </div>
          <div className={`flex items-baseline gap-2 text-sm ${labelClass}`}>
            <span>{t.priceYourTier}:</span>
            <span className="font-mono">{(tierDiscountPct * 100).toFixed(0)}%</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-sm font-semibold ${headingClass}`}>{t.priceContract}:</span>
            <span className={`font-mono text-3xl font-bold ${effectiveClass}`}>
              {formatPrice(breakdown.effectivePrice)}
            </span>
          </div>
        </div>
      )
    }
    return (
      <div className="flex flex-col">
        <span className={`font-mono text-xs line-through ${strikeClass}`}>
          {formatPrice(listPrice)}
        </span>
        <span className={`font-mono text-lg font-bold ${effectiveClass}`}>
          {formatPrice(breakdown.effectivePrice)}
        </span>
      </div>
    )
  }

  // public / unverified / verifiedNoTier — all show list price.
  // The "log in for contract price" hint only renders in `detail` size, because
  // catalogue cards are wrapped in a Link and nesting <a> inside <a> is invalid
  // HTML. The catalogue page surfaces the hint as a separate page-level banner.
  return (
    <div className="flex flex-col">
      <span className={`font-mono font-bold ${headingClass} ${size === 'detail' ? 'text-3xl' : 'text-lg'}`}>
        {formatPrice(listPrice)}
      </span>
      {size === 'detail' && (mode === 'public' || mode === 'unverified') && (
        <Link
          href={loginHref}
          className={`mt-1 text-xs font-semibold ${hintClass}`}
        >
          {t.priceLogInForContract}
        </Link>
      )}
    </div>
  )
}

// resolvePriceDisplayMode lives in lib/pricing/display-mode.ts (server-safe)
// and is re-exported from this file for convenience.
