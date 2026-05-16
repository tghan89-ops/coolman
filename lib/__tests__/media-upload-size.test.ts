// lib/__tests__/media-upload-size.test.ts
// Confirms the Media collection ships the auto-resize pipeline that replaces
// the old 5 MB rejection. Regression guard for UAT 5.2 / 5.5 / 5.6 — burned 2026-05-16.

import { describe, it, expect } from 'vitest'
import { Media } from '@/collections/Media'

describe('Media upload pipeline', () => {
  it('does NOT carry a beforeValidate size-reject hook — oversized images are auto-resized, not refused', () => {
    expect(Media.hooks?.beforeValidate).toBeUndefined()
  })

  it('caps the master image at 2000px on the long edge and never enlarges smaller images', () => {
    const r = Media.upload && typeof Media.upload === 'object' ? Media.upload.resizeOptions : undefined
    expect(r).toBeDefined()
    expect(r?.width).toBe(2000)
    expect(r?.height).toBe(2000)
    expect(r?.fit).toBe('inside')
    expect(r?.withoutEnlargement).toBe(true)
  })

  it('pre-bakes a thumbnail and a card-sized variant for the catalogue grid', () => {
    const sizes = Media.upload && typeof Media.upload === 'object' ? Media.upload.imageSizes : undefined
    expect(sizes).toBeDefined()
    const names = (sizes ?? []).map((s) => s.name)
    expect(names).toEqual(expect.arrayContaining(['thumbnail', 'card']))
  })

  it('restricts mime types to JPEG / PNG / WebP — no SVG, no PDF, no zip', () => {
    const mimes =
      Media.upload && typeof Media.upload === 'object' ? Media.upload.mimeTypes : undefined
    expect(mimes).toEqual(['image/jpeg', 'image/png', 'image/webp'])
  })
})
