import { describe, it, expect } from 'vitest'
import { COPY } from '@/lib/i18n/copy'

// /why-coolman is the Engineering Folio: three long-form pieces (folio01 three
// myths, folio02 Malaysian aggregate, folio03 Brotherhood System) plus a
// closing CTA. Each folio has hero meta, intro/sections, optional pullquotes,
// a bridgeQuote between body and coda, and a coda.
//
// Rules this file enforces (that the global i18n parity test cannot):
//   - no em dashes (—) anywhere in user-facing copy (DESIGN.md / BRAND-VOICE.md)
//   - EN and BM must actually differ on every leaf string (so the BM toggle
//     does something)
//   - structural shape: folio01 has exactly 3 myths; folio02 and folio03 each
//     have at least 4 body sections (drift guard — Session 3 supplies 5 each)
//
// EN/BM key-set parity for the whole COPY object is handled by i18n.test.ts.

const en = COPY.EN.pages.whyCoolman
const bm = COPY.BM.pages.whyCoolman

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') {
    out.push(value)
  } else if (Array.isArray(value)) {
    for (const v of value) collectStrings(v, out)
  } else if (value && typeof value === 'object') {
    for (const v of Object.values(value)) collectStrings(v, out)
  }
  return out
}

describe('/why-coolman Engineering Folio copy', () => {
  it('contains no em dashes in EN', () => {
    for (const s of collectStrings(en)) {
      expect(s, `EN string contains em dash: ${s}`).not.toMatch(/—/)
    }
  })

  it('contains no em dashes in BM', () => {
    for (const s of collectStrings(bm)) {
      expect(s, `BM string contains em dash: ${s}`).not.toMatch(/—/)
    }
  })

  it('EN and BM differ on hero strings', () => {
    expect(en.hero.eyebrow).not.toBe(bm.hero.eyebrow)
    expect(en.hero.title).not.toBe(bm.hero.title)
    expect(en.hero.titleEmphasis).not.toBe(bm.hero.titleEmphasis)
    expect(en.hero.lede).not.toBe(bm.hero.lede)
  })

  it('EN and BM differ on folio01 leaf strings', () => {
    expect(en.folio01.title).not.toBe(bm.folio01.title)
    expect(en.folio01.summary).not.toBe(bm.folio01.summary)
    expect(en.folio01.intro.heading).not.toBe(bm.folio01.intro.heading)
    expect(en.folio01.bridgeQuote).not.toBe(bm.folio01.bridgeQuote)
    expect(en.folio01.coda.heading).not.toBe(bm.folio01.coda.heading)
    for (let i = 0; i < en.folio01.myths.length; i++) {
      expect(en.folio01.myths[i].title).not.toBe(bm.folio01.myths[i].title)
      expect(en.folio01.myths[i].claim).not.toBe(bm.folio01.myths[i].claim)
    }
  })

  it('EN and BM differ on folio02 leaf strings', () => {
    expect(en.folio02.title).not.toBe(bm.folio02.title)
    expect(en.folio02.summary).not.toBe(bm.folio02.summary)
    expect(en.folio02.bridgeQuote).not.toBe(bm.folio02.bridgeQuote)
    expect(en.folio02.coda.heading).not.toBe(bm.folio02.coda.heading)
    for (let i = 0; i < en.folio02.sections.length; i++) {
      expect(en.folio02.sections[i].heading).not.toBe(bm.folio02.sections[i].heading)
    }
  })

  it('EN and BM differ on folio03 leaf strings', () => {
    expect(en.folio03.title).not.toBe(bm.folio03.title)
    expect(en.folio03.summary).not.toBe(bm.folio03.summary)
    expect(en.folio03.bridgeQuote).not.toBe(bm.folio03.bridgeQuote)
    expect(en.folio03.coda.heading).not.toBe(bm.folio03.coda.heading)
    for (let i = 0; i < en.folio03.sections.length; i++) {
      expect(en.folio03.sections[i].heading).not.toBe(bm.folio03.sections[i].heading)
    }
  })

  it('EN and BM differ on closingCta strings', () => {
    expect(en.closingCta.eyebrow).not.toBe(bm.closingCta.eyebrow)
    expect(en.closingCta.title).not.toBe(bm.closingCta.title)
    expect(en.closingCta.titleEmphasis).not.toBe(bm.closingCta.titleEmphasis)
    expect(en.closingCta.body).not.toBe(bm.closingCta.body)
    expect(en.closingCta.whatsappCtaLabel).not.toBe(bm.closingCta.whatsappCtaLabel)
    expect(en.closingCta.fieldNotesCtaLabel).not.toBe(bm.closingCta.fieldNotesCtaLabel)
  })

  it('folio01 has exactly three myths in both EN and BM', () => {
    expect(en.folio01.myths).toHaveLength(3)
    expect(bm.folio01.myths).toHaveLength(3)
  })

  it('folio02 and folio03 have matching section counts across EN and BM', () => {
    expect(en.folio02.sections.length).toBe(bm.folio02.sections.length)
    expect(en.folio03.sections.length).toBe(bm.folio03.sections.length)
    expect(en.folio02.sections.length).toBeGreaterThanOrEqual(4)
    expect(en.folio03.sections.length).toBeGreaterThanOrEqual(4)
  })

  it('every myth in folio01 has paragraphs in EN and BM', () => {
    for (let i = 0; i < en.folio01.myths.length; i++) {
      expect(en.folio01.myths[i].paragraphs.length).toBeGreaterThan(0)
      expect(bm.folio01.myths[i].paragraphs.length).toBeGreaterThan(0)
    }
  })
})
