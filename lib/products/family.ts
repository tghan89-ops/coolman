// Product family grouping. Sizes that share a non-empty `family` code collapse
// into one catalogue card and a size switcher on the product page. Products with
// no family code stay standalone. This module is the single source of truth for
// "what counts as one family" and is imported by BOTH the server (catalogue
// filter counts) and the client (grid collapse, switcher) so the two never drift.

export interface FamilyMember {
  id: string | number
  name: string
  listPrice: number
  diameter?: string | null
  diameterMm?: number | null
  family?: string | null
  /** Numeric value on the family's SECOND axis (tooth/grit/segment) — sorts pills. */
  variantValue?: number | null
  /** Pill text for the second axis (e.g. "60T", "80#", "6.5mm"). */
  variantLabel?: string | null
}

// ── Switcher axes ──────────────────────────────────────────────────────────
// A family's product page renders one pill row per axis, in this order. Every
// Wave-1 family is a pure size ladder (the default), so it isn't listed here.
// Families listed below carry a SECOND axis read from variantValue/variantLabel:
//   - 'tooth'   TCT saw blades (40T / 60T / 80T) at a given diameter
//   - 'grit'    grinding cups (60# / 80# / 120#) at one diameter
//   - 'segment' tuck-point blades (6.5 / 9.5 / 10 mm) at a given diameter
// The map is the single source of truth shared by the catalogue card (primary
// axis → badge noun) and the product-page switcher (which rows to render).
export type VariantAxis = 'tooth' | 'grit' | 'segment'
export type SwitcherAxis = 'size' | VariantAxis

export interface FamilyAxisConfig {
  /** Pill rows in render order. First entry is the "primary" axis. */
  axes: SwitcherAxis[]
  /** Explicit display name for variant families whose member names carry a
   *  size+variant token the auto-stripper can't reduce. Omit for size families. */
  displayName?: string
}

const DEFAULT_AXES: SwitcherAxis[] = ['size']

// Keyed by the LOWERCASED family code (matches familyKey's `fam:<code>`).
const FAMILY_AXES: Record<string, FamilyAxisConfig> = {
  gc100: { axes: ['grit'], displayName: 'GC100 Grinding Cup' },
  'tct-wood': { axes: ['size', 'tooth'], displayName: 'Wood Cutting Blade (TCT)' },
  'tct-alum': { axes: ['size', 'tooth'], displayName: 'Aluminium Cutting Blade (TCT)' },
  tuckpoint: { axes: ['size', 'segment'], displayName: 'Tuck Point Blade' },
  // Pure size ladder, but listed here only to give the card a clean name (the
  // member names start with the SKU "WSL600P ..." which the auto-stripper can't
  // reduce). One real blade per diameter; the PCS/PDA SKUs stay standalone.
  wallsawp: { axes: ['size'], displayName: 'Wall Saw Blade (P Series)' },
}

/**
 * Axis config for a family code (case-insensitive). Untagged or unknown codes
 * fall back to a plain single size axis, so every existing family is unchanged.
 */
export function familyAxisConfig(family?: string | null): FamilyAxisConfig {
  const code = typeof family === 'string' ? family.trim().toLowerCase() : ''
  return FAMILY_AXES[code] ?? { axes: DEFAULT_AXES }
}

/**
 * Group key for a product. Members sharing a non-empty `family` code group
 * together; everything else is its own singleton keyed by id (so the existing
 * one-card-per-product behaviour is preserved exactly for untagged products).
 */
export function familyKey(p: { id: string | number; family?: string | null }): string {
  const fam = typeof p.family === 'string' ? p.family.trim() : ''
  return fam ? `fam:${fam.toLowerCase()}` : `solo:${p.id}`
}

export function isFamilyTagged(p: { family?: string | null }): boolean {
  return typeof p.family === 'string' && p.family.trim().length > 0
}

/**
 * Strip a leading size token from a per-size product name to get the shared
 * family display name. Examples:
 *   "12″/300mm EcoSmart Series"  -> "EcoSmart Series"
 *   '14" / 350mm EcoSmart Series' -> "EcoSmart Series"
 *   "350mm Turbo Blade"          -> "Turbo Blade"
 * Falls back to the original name if nothing strippable is found.
 */
export function familyDisplayName(name: string): string {
  if (!name) return name
  const stripped = name
    // optional inch token (12, 12″, 12"), optional slash, then the mm token
    .replace(/^\s*\d+\s*[″"]?\s*\/?\s*\d+\s*mm\b/i, '')
    // any leftover leading separators / whitespace
    .replace(/^[\s\-–—/|·,]+/, '')
    .trim()
  return stripped.length > 0 ? stripped : name
}

/**
 * Smallest-diameter member of a group is the "primary": it provides the default
 * landing size, the catalogue card image, and the shared-copy source. Ties and
 * missing diameters sort last by Infinity so a real diameter always wins.
 */
export function primaryMember<T extends FamilyMember>(members: T[]): T {
  return [...members].sort(
    (a, b) => (a.diameterMm ?? Infinity) - (b.diameterMm ?? Infinity),
  )[0]
}

export interface FamilyGroup<T extends FamilyMember> {
  key: string
  isFamily: boolean
  members: T[]
  /** Smallest-diameter member — card image + default landing size + link target. */
  primary: T
  /** Lowest list price across the members present (drives the "from" price). */
  fromPrice: number
  /** Display name with the size token stripped (family) or the raw name (solo). */
  displayName: string
  /** "300–400 mm" for a multi-size family, else the single member's diameter. */
  diameterRange: string | null
  /** True when this family's first switcher axis is size (drives the card badge
   *  noun: "N sizes" vs "N options"). */
  primaryAxisIsSize: boolean
  /** Count of DISTINCT values on the primary axis — what the card badge shows.
   *  For a size family this equals the number of distinct diameters; for a grit
   *  family, the number of distinct grits. (members.length over-counts when a
   *  family has a second axis, e.g. 9 SKUs across 6 diameters.) */
  optionCount: number
}

/**
 * Collapse a flat product list into display groups, preserving the order in
 * which each group's FIRST member appears (so an upstream sort is respected).
 * A family with one surviving member (e.g. after a diameter filter) still
 * renders as that single size, not as a family card.
 */
export function groupByFamily<T extends FamilyMember>(products: T[]): FamilyGroup<T>[] {
  const order: string[] = []
  const buckets = new Map<string, T[]>()
  for (const p of products) {
    const key = familyKey(p)
    if (!buckets.has(key)) {
      buckets.set(key, [])
      order.push(key)
    }
    buckets.get(key)!.push(p)
  }

  return order.map((key) => {
    const members = buckets.get(key)!
    const primary = primaryMember(members)
    const isFamily = key.startsWith('fam:') && members.length > 1
    const cfg = familyAxisConfig(members[0]?.family)
    const primaryAxisIsSize = cfg.axes[0] === 'size'
    // Distinct primary-axis values (diameters for a size family, variant values
    // otherwise) — the honest "how many choices" count for the card badge.
    const distinct = new Set(
      members
        .map((m) => (primaryAxisIsSize ? m.diameterMm : m.variantValue))
        .filter((v): v is number => typeof v === 'number'),
    )
    const optionCount = distinct.size > 0 ? distinct.size : members.length
    // "from" price ignores unpriced members (listPrice 0/blank) so a not-yet-
    // priced size can't make the card read "from RM 0.00"; if every member is
    // unpriced, fall back to the primary's own value.
    const priced = members.filter((m) => m.listPrice > 0)
    const fromPrice = Math.min(...(priced.length ? priced : members).map((m) => m.listPrice))

    let diameterRange: string | null = primary.diameter ?? null
    if (isFamily) {
      const dias = members
        .map((m) => m.diameterMm)
        .filter((d): d is number => typeof d === 'number')
      if (dias.length > 0) {
        const lo = Math.min(...dias)
        const hi = Math.max(...dias)
        diameterRange = lo === hi ? `${lo} mm` : `${lo}–${hi} mm`
      }
    }

    return {
      key,
      isFamily,
      members,
      primary,
      fromPrice,
      // Variant families get an explicit name (their member names carry both a
      // size AND a variant token the auto-stripper can't reduce); pure size
      // families keep the proven Wave-1 auto-strip.
      displayName: isFamily
        ? cfg.displayName ?? familyDisplayName(primary.name)
        : primary.name,
      diameterRange,
      primaryAxisIsSize,
      optionCount,
    }
  })
}
