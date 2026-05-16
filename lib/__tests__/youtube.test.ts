// Guards the YouTube URL parsing used by the product detail page video embed.
// Bug context: admin saved a youtubeUrl on a product but nothing rendered on
// the public page — burned 2026-05-16. The fix is purely render-side, but if
// the parser silently drops a legitimate URL shape Alan would see the same
// "I pasted a link, nothing shows" symptom.

import { describe, it, expect } from 'vitest'
import { extractYouTubeId, youTubeEmbedUrl } from '@/lib/products/youtube'

describe('extractYouTubeId', () => {
  it('parses standard watch URLs', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(extractYouTubeId('https://youtube.com/watch?v=dQw4w9WgXcQ&t=30s')).toBe('dQw4w9WgXcQ')
  })

  it('parses youtu.be short links', () => {
    expect(extractYouTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(extractYouTubeId('https://youtu.be/dQw4w9WgXcQ?t=42')).toBe('dQw4w9WgXcQ')
  })

  it('parses /embed/, /shorts/, /v/ and /live/ paths', () => {
    expect(extractYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(extractYouTubeId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(extractYouTubeId('https://www.youtube.com/v/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(extractYouTubeId('https://www.youtube.com/live/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('accepts a bare 11-char video ID', () => {
    expect(extractYouTubeId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('returns null for junk, empty, or non-YouTube URLs', () => {
    expect(extractYouTubeId('')).toBeNull()
    expect(extractYouTubeId(null)).toBeNull()
    expect(extractYouTubeId(undefined)).toBeNull()
    expect(extractYouTubeId('not a url')).toBeNull()
    expect(extractYouTubeId('https://vimeo.com/123456')).toBeNull()
    expect(extractYouTubeId('https://www.youtube.com/watch?v=tooShort')).toBeNull()
    expect(extractYouTubeId('https://www.youtube.com/')).toBeNull()
  })
})

describe('youTubeEmbedUrl', () => {
  it('builds the nocookie embed URL', () => {
    expect(youTubeEmbedUrl('dQw4w9WgXcQ')).toBe(
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    )
  })
})
