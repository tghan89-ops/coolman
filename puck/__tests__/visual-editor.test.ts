import { describe, it, expect } from 'vitest'
import { resolveNavItems, navLabel, DEFAULT_NAV, type NavItem } from '@/lib/navigation/context'
import { isPuckDataEmpty, templates, TEMPLATE_VALUES } from '@/puck/templates'
import puckConfig from '@/puck/config'

/**
 * Critical regression tests for the Puck visual editor (plan-eng-review iron rule).
 * Pure logic only — no DB, no React render needed.
 */

describe('Regression #1 — top menu can never vanish (CMS nav fallback)', () => {
  it('falls back to the built-in DEFAULT_NAV when CMS nav is empty', () => {
    expect(resolveNavItems([])).toBe(DEFAULT_NAV)
    expect(resolveNavItems(null)).toBe(DEFAULT_NAV)
    expect(resolveNavItems(undefined)).toBe(DEFAULT_NAV)
  })
  it('uses CMS items when present', () => {
    const items: NavItem[] = [{ type: 'link', label: 'X', href: '/x' }]
    expect(resolveNavItems(items)).toBe(items)
  })
  it('the built-in fallback still contains the core menu (Products mega + Contact)', () => {
    expect(DEFAULT_NAV.some((i) => i.type === 'mega-products')).toBe(true)
    expect(DEFAULT_NAV.some((i) => i.i18nKey === 'contact')).toBe(true)
  })
})

describe('nav label resolution (optional BM, EN fallback)', () => {
  const tNav = { contact: 'Contact', products: 'Products' }
  it('uses i18n key for built-in items', () => {
    expect(navLabel({ type: 'link', i18nKey: 'contact' }, 'EN', tNav)).toBe('Contact')
  })
  it('uses BM label when in BM and set', () => {
    expect(navLabel({ type: 'link', label: 'Promo', labelBM: 'Promosi' }, 'BM', tNav)).toBe('Promosi')
  })
  it('falls back to EN label when BM is blank', () => {
    expect(navLabel({ type: 'link', label: 'Promo', labelBM: null }, 'BM', tNav)).toBe('Promo')
  })
})

describe('Regression #3 — two-tier safety: no price/product/catalogue block in the palette', () => {
  const keys = Object.keys(puckConfig.components)
  it('free-form palette exposes none of the forbidden block types', () => {
    // The general (non-home) palette must never expose product/price/catalogue.
    // The locked, audited, read-only Home* sections are the only sanctioned
    // exception (HomeProducts is a read-only catalogue render, no price —
    // GH-approved two-tier exception, 2026-06-21).
    const freeForm = keys.filter((k) => !k.startsWith('Home') && !k.endsWith('Page')).map((k) => k.toLowerCase())
    const forbidden = ['price', 'product', 'cart', 'catalog', 'catalogue', 'sku', 'order']
    for (const f of forbidden) {
      expect(freeForm.some((k) => k.includes(f)), `free-form block "${f}" must not be exposed`).toBe(false)
    }
  })
  it('NO block anywhere exposes price / cart / sku / order (even home sections)', () => {
    const all = keys.map((k) => k.toLowerCase())
    for (const f of ['price', 'cart', 'sku', 'order']) {
      expect(all.some((k) => k.includes(f)), `block "${f}" must not exist anywhere`).toBe(false)
    }
  })
  it('palette is the known safe set', () => {
    expect(Object.keys(puckConfig.components).sort()).toEqual(
      [
        'Accordion', 'Button', 'CTABanner', 'Callout', 'Card', 'Checklist', 'Columns',
        'Divider', 'Feature', 'Gallery', 'Heading', 'Hero', 'Image', 'ImageText',
        'LogoStrip', 'Quote', 'Section', 'Spacer', 'Stats', 'Steps', 'Text', 'Video',
        // Bespoke locked home sections. HomeProducts is a READ-ONLY catalogue
        // render (GH-approved two-tier exception) — no price, not editable.
        'HomeHero', 'HomeTrustBar', 'HomeWhy', 'HomeProducts', 'HomeShibuya', 'HomeContact',
        // Locked editorial page blocks (one per page).
        'CareerPage', 'AboutPage', 'ApplicationsPage', 'ResourcesPage', 'TradePage',
        'ContactPage', 'BrotherhoodPage', 'ShibuyaPage', 'HeritagePage', 'WhyCoolmanPage',
        'LegalPage',
      ].sort(),
    )
  })
})

describe('empty-publish guard logic', () => {
  it('treats no-content as empty', () => {
    expect(isPuckDataEmpty(null)).toBe(true)
    expect(isPuckDataEmpty({})).toBe(true)
    expect(isPuckDataEmpty({ content: [] })).toBe(true)
  })
  it('treats a page with blocks as non-empty', () => {
    expect(isPuckDataEmpty({ content: [{ type: 'Heading', props: {} }] })).toBe(false)
  })
})

describe('templates seed valid, non-empty starters (except blank)', () => {
  it('every template value has a definition', () => {
    for (const v of TEMPLATE_VALUES) expect(templates[v]).toBeTruthy()
  })
  it('non-blank templates are non-empty; blank is empty', () => {
    expect(isPuckDataEmpty(templates.blank)).toBe(true)
    expect(isPuckDataEmpty(templates.landing)).toBe(false)
    expect(isPuckDataEmpty(templates.simple)).toBe(false)
  })
  it('template blocks reference only registered components', () => {
    const known = new Set(Object.keys(puckConfig.components))
    for (const v of TEMPLATE_VALUES) {
      for (const block of templates[v].content ?? []) {
        expect(known.has(block.type), `template "${v}" uses unknown block "${block.type}"`).toBe(true)
      }
    }
  })
})
