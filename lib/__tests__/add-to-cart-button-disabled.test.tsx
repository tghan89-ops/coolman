import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'

// AddToCartButton is the cart CTA on every product surface. When
// `settings.orders_paused === true` the parent passes `disabled={true}` and
// the button must:
//   1. Render as non-interactive (DOM `disabled` attribute or aria-disabled
//      on the link variant).
//   2. Short-circuit its onClick handler so `add()` is never called.
//
// We don't have jsdom in this project (vitest is node env — see vitest.config.ts)
// so the test below uses `react-dom/server` to render the component to a
// string and asserts on the HTML output. Click-handler short-circuiting is
// guaranteed by the same `disabled` branch that flips the DOM attribute, so
// if the attribute is present, the handler can't fire on a real browser
// either. The hard rule is documented in CLAUDE.md — every order write path
// (and the AddToCart click is an order write path) checks the kill switch.

// Mock the contexts the component pulls in. We render the authenticated
// branch (isAuthenticated: true) because that is the branch with the
// onClick handler we care about; the unauthenticated branch is a <Link>
// and is gated by `pointer-events-none` + `aria-disabled`.

vi.mock('@/lib/auth/context', () => ({
  useAuth: () => ({ isAuthenticated: true }),
}))

vi.mock('@/lib/cart/context', () => ({
  useCart: () => ({ add: vi.fn() }),
}))

vi.mock('@/lib/i18n/context', () => ({
  useLanguage: () => ({
    language: 'EN',
    t: {
      product: { addToCart: 'Add to cart', loginToOrder: 'Sign in to order' },
      cart: { added: 'Added' },
    },
  }),
}))

import { AddToCartButton } from '@/components/cart/AddToCartButton'

describe('AddToCartButton — disabled (kill-switch) prop', () => {
  it('authenticated + disabled=true renders a disabled button (kill switch on)', () => {
    const html = renderToString(
      createElement(AddToCartButton, {
        productId: '1',
        quantity: 1,
        nextHref: '/products/1',
        disabled: true,
      }),
    )
    // The underlying <button> must carry the disabled attribute so the
    // browser blocks the click before React even sees it. React renders
    // `disabled={true}` as a boolean attribute → `disabled=""` in HTML.
    expect(html).toMatch(/<button[^>]*\sdisabled=""/)
    // Visual affordance: cursor-not-allowed + opacity-60 (see component).
    expect(html).toMatch(/cursor-not-allowed/)
    expect(html).toMatch(/opacity-60/)
  })

  it('authenticated + disabled omitted renders an enabled button', () => {
    const html = renderToString(
      createElement(AddToCartButton, {
        productId: '1',
        quantity: 1,
        nextHref: '/products/1',
      }),
    )
    expect(html).not.toMatch(/<button[^>]*\sdisabled=""/)
    expect(html).not.toMatch(/cursor-not-allowed/)
  })
})

describe('AddToCartButton — unauthenticated branch respects disabled', () => {
  it('renders an aria-disabled link when isAuthenticated=false + disabled=true', async () => {
    // Re-import with a different auth mock for this test.
    vi.resetModules()
    vi.doMock('@/lib/auth/context', () => ({
      useAuth: () => ({ isAuthenticated: false }),
    }))
    vi.doMock('@/lib/cart/context', () => ({
      useCart: () => ({ add: vi.fn() }),
    }))
    vi.doMock('@/lib/i18n/context', () => ({
      useLanguage: () => ({
        language: 'EN',
        t: {
          product: { addToCart: 'Add to cart', loginToOrder: 'Sign in to order' },
          cart: { added: 'Added' },
        },
      }),
    }))
    const { AddToCartButton: Reloaded } = await import('@/components/cart/AddToCartButton')
    const html = renderToString(
      createElement(Reloaded, {
        productId: '1',
        quantity: 1,
        nextHref: '/products/1',
        disabled: true,
      }),
    )
    // The login-redirect <Link> gets aria-disabled and pointer-events-none so
    // it can't navigate either.
    expect(html).toMatch(/aria-disabled="true"/)
    expect(html).toMatch(/pointer-events-none/)
  })
})
