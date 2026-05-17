import { describe, it, expect } from 'vitest'
import { splitLeadParagraph } from '../field-notes/split-lead-paragraph'

// The helper drives the drop-cap on Field Note articles. It MUST be a pure
// string slice — DOM parsing in JS would force the body into a client-only
// render path. Tests below pin the four shapes the helper has to survive:
// empty input, non-paragraph leading content, well-formed paragraph, and the
// malformed-but-still-shippable cases (attributes on <p>, missing </p>).

describe('splitLeadParagraph', () => {
  it('returns empty lead and rest for an empty string', () => {
    expect(splitLeadParagraph('')).toEqual({ lead: '', rest: '' })
  })

  it('puts the whole body into rest when it does not start with <p', () => {
    const html = '<h2>Heading first</h2><p>Then a paragraph.</p>'
    expect(splitLeadParagraph(html)).toEqual({ lead: '', rest: html })
  })

  it('extracts the first paragraph as lead and leaves the remainder in rest', () => {
    const html = '<p>First paragraph.</p><p>Second paragraph.</p><h2>More</h2>'
    const { lead, rest } = splitLeadParagraph(html)
    expect(lead).toBe('<p>First paragraph.</p>')
    expect(rest).toBe('<p>Second paragraph.</p><h2>More</h2>')
  })

  it('handles a <p> with attributes (class, id, etc.) as a paragraph', () => {
    const html = '<p class="intro">Lede line.</p><p>Body line.</p>'
    const { lead, rest } = splitLeadParagraph(html)
    expect(lead).toBe('<p class="intro">Lede line.</p>')
    expect(rest).toBe('<p>Body line.</p>')
  })

  it('falls back to rest-only when the opening <p has no closing </p>', () => {
    const html = '<p>Missing close tag, what now'
    expect(splitLeadParagraph(html)).toEqual({ lead: '', rest: html })
  })

  it('tolerates leading whitespace before the first <p>', () => {
    const html = '   \n<p>Trimmed lede.</p><p>Body.</p>'
    const { lead, rest } = splitLeadParagraph(html)
    expect(lead).toBe('<p>Trimmed lede.</p>')
    expect(rest).toBe('<p>Body.</p>')
  })

  it('matches case-insensitively on the closing tag (</P> shouted variant)', () => {
    const html = '<p>Loud closer.</P><p>Quieter body.</p>'
    const { lead, rest } = splitLeadParagraph(html)
    // The slice runs through the first lowercase match of </p>. The shouted
    // </P> is found by toLowerCase() in the helper, so the lead ends there.
    expect(lead).toBe('<p>Loud closer.</P>')
    expect(rest).toBe('<p>Quieter body.</p>')
  })
})
