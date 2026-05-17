import { describe, it, expect } from 'vitest'
import { resolveHeroImageUrl, resolveHeroImageAlt, resolveHeroFocal } from '../hero-image'

const FB_URL = '/images/hero-blade.jpg'
const FB_ALT = 'Default alt'

describe('resolveHeroImageUrl', () => {
  it('prefers the hero-sized variant when present', () => {
    const input = { url: '/orig.jpg', sizes: { hero: { url: '/hero-1200.jpg' } } }
    expect(resolveHeroImageUrl(input, FB_URL)).toBe('/hero-1200.jpg')
  })

  it('falls back to the original url when hero size is missing', () => {
    const input = { url: '/orig.jpg', sizes: {} }
    expect(resolveHeroImageUrl(input, FB_URL)).toBe('/orig.jpg')
  })

  it('falls back to the original url when sizes is null', () => {
    const input = { url: '/orig.jpg', sizes: null }
    expect(resolveHeroImageUrl(input, FB_URL)).toBe('/orig.jpg')
  })

  it('falls back to the static asset when input is null', () => {
    expect(resolveHeroImageUrl(null, FB_URL)).toBe(FB_URL)
  })

  it('falls back to the static asset when input is a number (unresolved Payload relation id)', () => {
    expect(resolveHeroImageUrl(123, FB_URL)).toBe(FB_URL)
  })

  it('falls back to the static asset when hero url is an empty string', () => {
    const input = { url: '', sizes: { hero: { url: '' } } }
    expect(resolveHeroImageUrl(input, FB_URL)).toBe(FB_URL)
  })
})

describe('resolveHeroImageAlt', () => {
  it('uses the image alt when present', () => {
    expect(resolveHeroImageAlt({ alt: 'Worker' }, FB_ALT)).toBe('Worker')
  })

  it('falls back when alt is missing', () => {
    expect(resolveHeroImageAlt({}, FB_ALT)).toBe(FB_ALT)
  })

  it('falls back when input is not an object', () => {
    expect(resolveHeroImageAlt(null, FB_ALT)).toBe(FB_ALT)
  })
})

describe('resolveHeroFocal', () => {
  it('returns the focal point from the image when set', () => {
    expect(resolveHeroFocal({ focalX: 80, focalY: 30 })).toEqual({ x: 80, y: 30 })
  })

  it('defaults to centre when no focal point is set', () => {
    expect(resolveHeroFocal({})).toEqual({ x: 50, y: 50 })
  })

  it('respects a focal point of 0 (top-left edge)', () => {
    expect(resolveHeroFocal({ focalX: 0, focalY: 0 })).toEqual({ x: 0, y: 0 })
  })

  it('defaults to centre when input is not an object', () => {
    expect(resolveHeroFocal(null)).toEqual({ x: 50, y: 50 })
  })
})
