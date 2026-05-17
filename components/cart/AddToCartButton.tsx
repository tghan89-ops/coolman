'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth/context'
import { useCart } from '@/lib/cart/context'
import { useLanguage } from '@/lib/i18n/context'

export function AddToCartButton({
  productId,
  quantity,
  nextHref,
  disabled = false,
  ariaDescribedBy,
}: {
  productId: string | number
  quantity: number
  nextHref: string
  /**
   * When true the button is rendered non-interactive (and the click handler is
   * short-circuited). Used by the product detail page to gate the cart CTA
   * when `settings.orders_paused === true` — every order write path must
   * respect the kill switch (CLAUDE.md hard rule).
   */
  disabled?: boolean
  /**
   * When the parent renders a kill-switch banner explaining *why* orders are
   * paused, it passes the banner's id here so a screen reader announces the
   * banner copy as the explanation for the disabled control.
   */
  ariaDescribedBy?: string
}) {
  const { isAuthenticated } = useAuth()
  const { add } = useCart()
  const { t } = useLanguage()
  const [state, setState] = useState<'idle' | 'adding' | 'added'>('idle')

  if (!isAuthenticated) {
    return (
      <Button
        size="lg"
        className={`group h-14 flex-1 bg-accent-dark font-sans text-base font-bold text-white hover:bg-accent ${
          disabled ? 'pointer-events-none opacity-60' : ''
        }`}
        aria-disabled={disabled || undefined}
        aria-describedby={ariaDescribedBy}
        // Keep a disabled link out of the keyboard tab order. Without this,
        // sighted keyboard users can still tab to a visually-disabled link and
        // hit Enter to follow it — bypassing the visual gate.
        tabIndex={disabled ? -1 : undefined}
        asChild
      >
        <Link href={`/auth/login?next=${encodeURIComponent(nextHref)}`}>
          {t.product.loginToOrder}
          <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    )
  }

  return (
    <Button
      size="lg"
      className={`group h-14 flex-1 bg-accent-dark font-sans text-base font-bold text-white hover:bg-accent ${
        disabled ? 'cursor-not-allowed opacity-60' : ''
      }`}
      disabled={disabled || state === 'adding'}
      aria-describedby={ariaDescribedBy}
      onClick={async () => {
        // Defensive: even if the disabled prop didn't reach the underlying
        // button (e.g. asChild wrapper, custom styling), we never want to call
        // `add()` while the kill switch is on.
        if (disabled) return
        setState('adding')
        try {
          await add(String(productId), quantity)
          setState('added')
          setTimeout(() => setState('idle'), 2000)
        } catch {
          setState('idle')
        }
      }}
    >
      {state === 'added' ? (
        <>
          <Check className="mr-3 h-5 w-5" />
          {t.cart.added}
        </>
      ) : (
        <>
          {t.product.addToCart}
          <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </>
      )}
    </Button>
  )
}
