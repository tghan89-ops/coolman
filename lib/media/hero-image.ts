// Pure helpers for resolving a Payload media reference into the values the
// homepage hero `<Image>` needs: a URL, alt text, and focal-point coordinates.
//
// Lives separately so it can be unit-tested without rendering React.

export type HeroImageInput = unknown

interface HeroImageObject {
  url?: string | null
  alt?: string | null
  focalX?: number | null
  focalY?: number | null
  sizes?: {
    hero?: { url?: string | null } | null
  } | null
}

function asObject(input: HeroImageInput): HeroImageObject | null {
  return input && typeof input === 'object' ? (input as HeroImageObject) : null
}

// Prefer the `hero` sized variant — that's the one Payload regenerates whenever
// an admin re-saves the image with a different crop or focal point. Fall back to
// the original URL only when the variant isn't ready (media uploaded before the
// hero size existed and not yet re-saved). Final fallback is the static asset.
export function resolveHeroImageUrl(input: HeroImageInput, fallback: string): string {
  const obj = asObject(input)
  return obj?.sizes?.hero?.url || obj?.url || fallback
}

export function resolveHeroImageAlt(input: HeroImageInput, fallback: string): string {
  const obj = asObject(input)
  return obj?.alt || fallback
}

// Focal point comes from Payload as 0-100 percentages from the top-left of the
// (possibly already cropped) image. Default to centre so untagged images still
// look reasonable.
export function resolveHeroFocal(input: HeroImageInput): { x: number; y: number } {
  const obj = asObject(input)
  const x = typeof obj?.focalX === 'number' ? obj.focalX : 50
  const y = typeof obj?.focalY === 'number' ? obj.focalY : 50
  return { x, y }
}
