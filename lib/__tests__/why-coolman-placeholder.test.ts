import { describe, it, expect } from 'vitest'
import { COPY } from '@/lib/i18n/copy'

// /why-coolman is shipped as a minimal placeholder for Phase B (hero strap +
// "Engineering Folio coming soon" + Field Notes CTA). Phase C will replace this
// block with the full Engineering Folio when Session 3 lands. Until then, the
// copy must be:
//   - free of em dashes (DESIGN.md / BRAND-VOICE.md rule for user-facing copy)
//   - non-empty in both EN and BM
//   - actually translated (EN and BM strings must differ — otherwise the BM
//     toggle silently shows English and we wouldn't notice)
//
// EN/BM key-set parity is already enforced for the whole COPY object by
// lib/__tests__/i18n.test.ts, so this file only covers what that one cannot:
// the contents of the new placeholder block.

const placeholderKeys = ['headline', 'body', 'fieldNotesCtaLabel'] as const
const heroKeys = ['title', 'titleEmphasis', 'lede'] as const

describe('/why-coolman placeholder copy', () => {
  it('contains no em dashes in EN', () => {
    const en = COPY.EN.pages.whyCoolman
    for (const k of heroKeys) expect(en.hero[k]).not.toMatch(/—/)
    for (const k of placeholderKeys) expect(en.placeholder[k]).not.toMatch(/—/)
    expect(en.hero.eyebrow).not.toMatch(/—/)
    expect(en.placeholder.eyebrow).not.toMatch(/—/)
  })

  it('contains no em dashes in BM', () => {
    const bm = COPY.BM.pages.whyCoolman
    for (const k of heroKeys) expect(bm.hero[k]).not.toMatch(/—/)
    for (const k of placeholderKeys) expect(bm.placeholder[k]).not.toMatch(/—/)
    expect(bm.hero.eyebrow).not.toMatch(/—/)
    expect(bm.placeholder.eyebrow).not.toMatch(/—/)
  })

  it('EN and BM differ on every placeholder string (so the toggle does something)', () => {
    const en = COPY.EN.pages.whyCoolman
    const bm = COPY.BM.pages.whyCoolman
    expect(en.hero.eyebrow).not.toBe(bm.hero.eyebrow)
    for (const k of heroKeys) expect(en.hero[k]).not.toBe(bm.hero[k])
    expect(en.placeholder.eyebrow).not.toBe(bm.placeholder.eyebrow)
    for (const k of placeholderKeys) {
      expect(en.placeholder[k]).not.toBe(bm.placeholder[k])
    }
  })
})
