import { describe, it, expect } from 'vitest'
import { toWaLink } from '@/components/catalogue/KillSwitchBanner'
import { COPY } from '@/lib/i18n/copy'

// KillSwitchBanner is a server component wrapping (a) a pure logic helper that
// converts the admin-entered WhatsApp number into a wa.me URL, and (b) i18n
// lookups against `COPY[language].killSwitch`. Both must be tested without
// jsdom because the banner is rendered on every catalogue/product/cart surface
// that needs to respect the `orders_paused` kill switch (CLAUDE.md hard rule).
//
// We deliberately do not render the JSX — vitest runs in node env. The branch
// "isPaused === false → renders nothing" is implemented as a top-of-component
// `if (!isPaused) return null` and is exercised by the i18n parity test plus
// integration; here we cover the parts that can drift silently: the COPY
// values and the digit-strip rule on the WhatsApp helper.

describe('KillSwitchBanner i18n copy', () => {
  it('EN copy has both a message and a CTA label', () => {
    expect(COPY.EN.killSwitch.message.length).toBeGreaterThan(0)
    expect(COPY.EN.killSwitch.ctaLabel.length).toBeGreaterThan(0)
  })

  it('BM copy has both a message and a CTA label', () => {
    expect(COPY.BM.killSwitch.message.length).toBeGreaterThan(0)
    expect(COPY.BM.killSwitch.ctaLabel.length).toBeGreaterThan(0)
  })

  it('EN and BM copy differ (so the toggle is actually doing something)', () => {
    expect(COPY.EN.killSwitch.message).not.toBe(COPY.BM.killSwitch.message)
    expect(COPY.EN.killSwitch.ctaLabel).not.toBe(COPY.BM.killSwitch.ctaLabel)
  })

  it('no em dash sneaks into the kill-switch copy (DESIGN.md rule)', () => {
    expect(COPY.EN.killSwitch.message).not.toMatch(/—/)
    expect(COPY.BM.killSwitch.message).not.toMatch(/—/)
    expect(COPY.EN.killSwitch.ctaLabel).not.toMatch(/—/)
    expect(COPY.BM.killSwitch.ctaLabel).not.toMatch(/—/)
  })
})

describe('KillSwitchBanner.toWaLink', () => {
  it('strips non-digit characters and produces a wa.me URL', () => {
    expect(toWaLink('+60 12-345 6789')).toBe('https://wa.me/60123456789')
    expect(toWaLink('+6012-3456789')).toBe('https://wa.me/60123456789')
    expect(toWaLink('60123456789')).toBe('https://wa.me/60123456789')
  })

  it('returns null when there are no digits at all', () => {
    // A blank or whitespace-only admin field must not produce a broken
    // https://wa.me/ link with no recipient.
    expect(toWaLink('')).toBeNull()
    expect(toWaLink('   ')).toBeNull()
    expect(toWaLink('abc-def')).toBeNull()
  })
})
