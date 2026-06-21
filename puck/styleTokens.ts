/**
 * Scale-step style controls for Puck blocks.
 *
 * Design decision (plan-design-review): editors resize / recolour / space by
 * picking from these curated steps, NOT by typing raw px/hex/fonts. Every step
 * maps to a real DESIGN.md token (Tailwind v4 utilities defined in
 * app/globals.css @theme). This is the anti-drift guardrail — an editor cannot
 * land on an off-brand value because off-brand values aren't offered.
 *
 * Hard rule (DESIGN.md): font FAMILIES are fixed. Fraunces is editorial-hero
 * only and is NOT exposed as a per-block choice — body/UI stay IBM Plex. There
 * is no "font" control here by design.
 *
 * Pure data + class lookups — server-importable (no React, no client code), so
 * both the editor and the server <Render> path can use it.
 */

type Option<T extends string> = { label: string; value: T }

// ---- Heading size (maps onto the type scale, not arbitrary px) ----
export type HeadingSize = 'sm' | 'md' | 'lg' | 'xl'
export const headingSizeOptions: Option<HeadingSize>[] = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
  { label: 'Extra large', value: 'xl' },
]
export const headingSizeClass: Record<HeadingSize, string> = {
  sm: 'text-xl md:text-2xl font-semibold tracking-tight',
  md: 'text-2xl md:text-3xl font-semibold tracking-tight',
  lg: 'text-3xl md:text-4xl font-semibold tracking-tight',
  xl: 'text-4xl md:text-5xl font-bold tracking-tight',
}

// ---- Body text size ----
export type TextSize = 'sm' | 'md' | 'lg'
export const textSizeOptions: Option<TextSize>[] = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
]
export const textSizeClass: Record<TextSize, string> = {
  sm: 'text-sm leading-relaxed',
  md: 'text-base md:text-lg leading-relaxed',
  lg: 'text-lg md:text-xl leading-relaxed',
}

// ---- Colour (brand palette only; single accent rule respected) ----
export type ColorToken = 'ink' | 'muted' | 'navy' | 'accent' | 'white'
export const colorOptions: Option<ColorToken>[] = [
  { label: 'Default (ink)', value: 'ink' },
  { label: 'Muted grey', value: 'muted' },
  { label: 'Navy', value: 'navy' },
  { label: 'Accent blue', value: 'accent' },
  { label: 'White (on dark)', value: 'white' },
]
export const textColorClass: Record<ColorToken, string> = {
  ink: 'text-ink',
  muted: 'text-ink-muted',
  navy: 'text-navy',
  accent: 'text-accent',
  white: 'text-white',
}

// ---- Vertical spacing (block padding) on the 4px base ----
export type Spacing = 'none' | 'tight' | 'normal' | 'loose'
export const spacingOptions: Option<Spacing>[] = [
  { label: 'None', value: 'none' },
  { label: 'Tight', value: 'tight' },
  { label: 'Normal', value: 'normal' },
  { label: 'Loose', value: 'loose' },
]
export const spacingClass: Record<Spacing, string> = {
  none: 'py-0',
  tight: 'py-6',
  normal: 'py-12 md:py-16',
  loose: 'py-20 md:py-28',
}

// ---- Alignment ----
export type Align = 'left' | 'center'
export const alignOptions: Option<Align>[] = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
]
export const alignClass: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center mx-auto',
}

// ---- Background surface (for section blocks) ----
export type Surface = 'none' | 'paper' | 'navy'
export const surfaceOptions: Option<Surface>[] = [
  { label: 'None', value: 'none' },
  { label: 'Paper', value: 'paper' },
  { label: 'Navy (dark)', value: 'navy' },
]
export const surfaceClass: Record<Surface, string> = {
  none: '',
  paper: 'bg-paper',
  navy: 'bg-navy text-white',
}

/** Safe class joiner. */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}
