// PriceStackCard is the ONLY component in the codebase allowed to render product price text.
// Bypassing it (e.g. printing `formatPrice(listPrice)` directly in a card or page) leaks
// pricing to logged-out visitors and violates the auth/tier gate in CLAUDE.md. Every price
// surface — catalogue card, product detail hero, order form — must mount this component.

import Link from 'next/link'
import { calculateEffectivePrice } from '@/lib/pricing/calculate'
import { formatPrice } from '@/lib/utils/formatting'
import { cn } from '@/lib/utils'

export type PriceStackBranch = 'logged-out' | 'unverified' | 'list-only' | 'stack-up'

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
  className?: string
}

function resolveBranch(props: {
  isLoggedIn: boolean
  emailVerified: boolean
  tierDiscountPct: number
}): PriceStackBranch {
  if (!props.isLoggedIn) return 'logged-out'
  if (!props.emailVerified) return 'unverified'
  if (props.tierDiscountPct <= 0) return 'list-only'
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
  className,
}: PriceStackCardProps) {
  const branch = resolveBranch({ isLoggedIn, emailVerified, tierDiscountPct })

  if (branch === 'logged-out') {
    // No price visible anywhere in this branch. Sign-in CTA replaces the number.
    return (
      <div className={cn('flex', className)}>
        <Link
          href={signInHref}
          className={cn(
            'inline-flex items-center justify-center min-h-11 px-4 rounded-md',
            'border border-rule bg-white text-sm font-semibold',
            'text-accent-dark hover:text-accent hover:border-accent',
            'transition-colors duration-150 ease-out',
          )}
          style={{ transitionProperty: 'color, border-color, box-shadow' }}
        >
          Sign in to see pricing
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
          'flex flex-col gap-1 rounded-md border px-4 py-3',
          'border-warn/30 bg-warn/5 text-sm text-ink',
          className,
        )}
      >
        <span className="font-semibold text-warn">Verification pending</span>
        <span className="text-ink-muted">
          Contract pricing will appear once your email is verified.{' '}
          <Link
            href={verifyEmailHref}
            className="text-accent-dark hover:text-accent underline underline-offset-2"
          >
            Resend verification email
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
            'font-mono font-semibold text-ink leading-none',
            LIST_ONLY_SIZE[size],
          )}
        >
          {formatPrice(listPrice)}
        </span>
      </div>
    )
  }

  // branch === 'stack-up'
  const breakdown = calculateEffectivePrice(listPrice, tierDiscountPct, promoDiscountPct)
  const hasPromo = promoDiscountPct > 0
  const tierPct = Math.round(tierDiscountPct * 100)
  const promoPct = Math.round(promoDiscountPct * 100)

  // If the caller explicitly hides the breakdown, collapse to just the effective price line.
  if (!showStackUp) {
    return (
      <div className={cn('flex flex-col', className)}>
        <span className={cn('font-mono font-bold text-navy leading-none', EFFECTIVE_SIZE[size])}>
          {formatPrice(breakdown.effectivePrice)}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 rounded-md',
        size === 'lg' && 'p-4 bg-[rgba(10,22,40,0.04)]',
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-3 text-sm text-ink-muted">
        <span>List price</span>
        <span className="font-mono line-through">{formatPrice(listPrice)}</span>
      </div>
      <div className="flex items-baseline justify-between gap-3 text-sm text-ink-muted">
        <span>Your tier discount</span>
        <span className="font-mono">−{tierPct}%</span>
      </div>
      {hasPromo && (
        <div className="flex items-baseline justify-between gap-3 text-sm text-ink-muted">
          <span>Promo</span>
          <span className="font-mono">−{promoPct}%</span>
        </div>
      )}
      <div
        className={cn(
          'mt-1 flex items-baseline justify-between gap-3 pt-2',
          'border-t border-dashed border-rule',
        )}
      >
        <span className="text-sm font-semibold text-navy">Your price</span>
        <span className={cn('font-mono font-bold text-navy leading-none', EFFECTIVE_SIZE[size])}>
          {formatPrice(breakdown.effectivePrice)}
        </span>
      </div>
    </div>
  )
}
