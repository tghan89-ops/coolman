// PriceStackCard is the ONLY component in the codebase allowed to render product price text.
// Bypassing it (e.g. printing `formatPrice(listPrice)` directly in a card or page) leaks
// pricing to logged-out visitors and violates the auth/tier gate in CLAUDE.md. Every price
// surface — catalogue card, product detail hero, order form — must mount this component.

import Link from 'next/link'
import { calculateEffectivePrice } from '@/lib/pricing/calculate'
import { formatPrice } from '@/lib/utils/formatting'
import { COPY, type Language } from '@/lib/i18n/copy'
import { cn } from '@/lib/utils'

export type PriceStackBranch = 'logged-out' | 'unverified' | 'list-only' | 'stack-up'
export type PriceStackTone = 'light' | 'dark'

export interface PriceStackCardProps {
  listPrice: number
  isLoggedIn: boolean
  emailVerified: boolean
  tierDiscountPct: number
  promoDiscountPct?: number
  size?: 'sm' | 'md' | 'lg'
  showStackUp?: boolean
  signInHref?: string
  verifyEmailHref?: string
  language?: Language
  tone?: PriceStackTone
  className?: string
}

// Exported for unit testing. Pure logic, no React. Mirrors the four-branch
// access matrix specified in CLAUDE.md: logged-out shows no price, unverified
// shows a verification banner, list-only shows the raw list price, stack-up
// renders the full list → tier → promo → effective breakdown.
export function resolveBranch(props: {
  isLoggedIn: boolean
  emailVerified: boolean
  tierDiscountPct: number
}): PriceStackBranch {
  if (!props.isLoggedIn) return 'logged-out'
  if (!props.emailVerified) return 'unverified'
  // Use Number.isFinite so NaN, Infinity, and non-numeric reads all fall back
  // to the safer "list-only" branch instead of slipping into "stack-up" and
  // rendering "RM NaN". NaN <= 0 is false in JS, so a plain comparison would
  // not catch this — see code-quality review 2026-05-17.
  if (!Number.isFinite(props.tierDiscountPct) || props.tierDiscountPct <= 0) return 'list-only'
  return 'stack-up'
}

const EFFECTIVE_SIZE: Record<NonNullable<PriceStackCardProps['size']>, string> = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
}

const LIST_ONLY_SIZE: Record<NonNullable<PriceStackCardProps['size']>, string> = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
}

export function PriceStackCard({
  listPrice,
  isLoggedIn,
  emailVerified,
  tierDiscountPct,
  promoDiscountPct = 0,
  size = 'md',
  showStackUp = true,
  signInHref = '/auth/login',
  verifyEmailHref = '/auth/verify-email',
  language = 'EN',
  tone = 'light',
  className,
}: PriceStackCardProps) {
  const branch = resolveBranch({ isLoggedIn, emailVerified, tierDiscountPct })
  const t = COPY[language].priceGate
  const isDark = tone === 'dark'

  if (branch === 'logged-out') {
    // No price visible anywhere in this branch. Sign-in CTA replaces the number.
    return (
      <div className={cn('flex', className)}>
        <Link
          href={signInHref}
          className={cn(
            'inline-flex items-center justify-center min-h-11 px-4 rounded-md',
            'border text-sm font-semibold',
            'transition-colors duration-150 ease-out',
            isDark
              ? // text-sky-300 over white/5 on navy clears WCAG AA comfortably
                // (~7:1) where text-accent (#3B82F6) sat at ~4.4:1 borderline.
                // Light tone unchanged. Burned 2026-05-17 — code-quality review.
                'border-white/20 bg-white/5 text-sky-300 hover:text-white hover:border-white/40'
              : 'border-rule bg-white text-accent-dark hover:text-accent hover:border-accent',
          )}
          style={{ transitionProperty: 'color, border-color, box-shadow' }}
        >
          {t.signInToSeePricing}
        </Link>
      </div>
    )
  }

  if (branch === 'unverified') {
    // Logged in but email not yet verified — no price, friendly status banner.
    return (
      <div
        role="status"
        className={cn(
          'flex flex-col gap-1 rounded-md border px-4 py-3 text-sm',
          isDark
            ? 'border-warn/40 bg-warn/10 text-white'
            : 'border-warn/30 bg-warn/5 text-ink',
          className,
        )}
      >
        <span className="font-semibold text-warn">{t.verificationPending}</span>
        <span className={isDark ? 'text-white/70' : 'text-ink-muted'}>
          {t.contractPricingHint}{' '}
          <Link
            href={verifyEmailHref}
            className={cn(
              'underline underline-offset-2 font-semibold',
              // Dark tone uses sky-300 for AA contrast over warn/10 on navy.
              isDark ? 'text-sky-300 hover:text-white' : 'text-accent-dark hover:text-accent',
            )}
          >
            {t.resendVerification}
          </Link>
        </span>
      </div>
    )
  }

  if (branch === 'list-only') {
    // Logged-in contractor with no tier discount — show list price only, no labels.
    return (
      <div className={cn('flex flex-col', className)}>
        <span
          className={cn(
            'font-mono font-semibold leading-none',
            LIST_ONLY_SIZE[size],
            isDark ? 'text-white' : 'text-ink',
          )}
        >
          {formatPrice(listPrice)}
        </span>
      </div>
    )
  }

  // branch === 'stack-up'
  // Defensive: coerce any non-finite (NaN/Infinity) promo to 0 so the stack-up
  // never renders "−NaN%" or inflates the effective price. tierDiscountPct is
  // already gated upstream by resolveBranch — if it's not finite we never get
  // here. See code-quality review 2026-05-17.
  const safePromoPct = Number.isFinite(promoDiscountPct) ? promoDiscountPct : 0
  const breakdown = calculateEffectivePrice(listPrice, tierDiscountPct, safePromoPct)
  const hasPromo = safePromoPct > 0
  const tierPct = Math.round(tierDiscountPct * 100)
  const promoPct = Math.round(safePromoPct * 100)

  // If the caller explicitly hides the breakdown, collapse to just the effective price line.
  if (!showStackUp) {
    return (
      <div className={cn('flex flex-col', className)}>
        <span
          className={cn(
            'font-mono font-bold leading-none',
            EFFECTIVE_SIZE[size],
            isDark ? 'text-accent' : 'text-navy',
          )}
        >
          {formatPrice(breakdown.effectivePrice)}
        </span>
      </div>
    )
  }

  const labelClass = isDark ? 'text-white/60' : 'text-ink-muted'
  const headingClass = isDark ? 'text-white' : 'text-navy'
  const effectiveClass = isDark ? 'text-accent' : 'text-navy'
  const ruleClass = isDark ? 'border-white/20' : 'border-rule'

  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 rounded-md',
        size === 'lg' && !isDark && 'p-4 bg-[rgba(10,22,40,0.04)]',
        size === 'lg' && isDark && 'p-4 bg-white/5',
        className,
      )}
    >
      <div className={cn('flex items-baseline justify-between gap-3 text-sm', labelClass)}>
        <span>{t.listPrice}</span>
        <span className="font-mono line-through">{formatPrice(listPrice)}</span>
      </div>
      <div className={cn('flex items-baseline justify-between gap-3 text-sm', labelClass)}>
        <span>{t.yourTierDiscount}</span>
        <span className="font-mono">{`−${tierPct}%`}</span>
      </div>
      {hasPromo && (
        <div className={cn('flex items-baseline justify-between gap-3 text-sm', labelClass)}>
          <span>{t.promo}</span>
          <span className="font-mono">{`−${promoPct}%`}</span>
        </div>
      )}
      <div
        className={cn(
          'mt-1 flex items-baseline justify-between gap-3 pt-2',
          'border-t border-dashed',
          ruleClass,
        )}
      >
        <span className={cn('text-sm font-semibold', headingClass)}>{t.yourPrice}</span>
        <span className={cn('font-mono font-bold leading-none', EFFECTIVE_SIZE[size], effectiveClass)}>
          {formatPrice(breakdown.effectivePrice)}
        </span>
      </div>
    </div>
  )
}
