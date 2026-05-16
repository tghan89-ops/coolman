// Extract a YouTube video ID from the shapes Alan is likely to paste into the
// admin form: full watch URLs, shortened youtu.be links, embed URLs, and
// shorts. Returns null for anything that doesn't parse — the caller should
// render nothing rather than a broken iframe.

const ID_PATTERN = /^[A-Za-z0-9_-]{11}$/

export function extractYouTubeId(input: string | null | undefined): string | null {
  if (!input || typeof input !== 'string') return null
  const raw = input.trim()
  if (!raw) return null

  // Bare 11-char ID pasted directly.
  if (ID_PATTERN.test(raw)) return raw

  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return null
  }

  const host = url.hostname.replace(/^www\./, '').toLowerCase()

  if (host === 'youtu.be') {
    const id = url.pathname.slice(1).split('/')[0]
    return ID_PATTERN.test(id) ? id : null
  }

  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    const v = url.searchParams.get('v')
    if (v && ID_PATTERN.test(v)) return v

    const parts = url.pathname.split('/').filter(Boolean)
    // /embed/{id}, /shorts/{id}, /v/{id}, /live/{id}
    if (parts.length >= 2 && ['embed', 'shorts', 'v', 'live'].includes(parts[0])) {
      return ID_PATTERN.test(parts[1]) ? parts[1] : null
    }
  }

  return null
}

export function youTubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}`
}
