// Material rollup for the catalogue filter. The DB carries ~74 fine-grained
// `materials.name` tags (e.g. "Cured Concrete", "Neolith Tile") which are great
// on a product spec sheet but far too many to be a usable filter. This module
// collapses those fine tags into 8 coarse buckets used ONLY by the filter UI.
// The fine tags stay in the DB untouched and still drive spec display.
//
// This is the single source of truth shared by the server (filter counts) and
// the client (filter pills) so the two never drift. Pure module, no app imports.

export type MaterialBucketKey =
  | 'concrete'
  | 'masonry'
  | 'tile-stone'
  | 'asphalt'
  | 'metal'
  | 'glass'
  | 'wood'
  | 'other'

export interface MaterialBucket {
  key: MaterialBucketKey
  en: string
  bm: string
}

// Display order for the filter. `other` is a catch-all and the UI only renders
// it when its count > 0, but the bucket always exists so nothing can vanish.
export const MATERIAL_BUCKETS: MaterialBucket[] = [
  { key: 'concrete', en: 'Concrete', bm: 'Konkrit' },
  { key: 'masonry', en: 'Masonry & Brick', bm: 'Bata & Tembok' },
  { key: 'tile-stone', en: 'Tile & Stone', bm: 'Jubin & Batu' },
  { key: 'asphalt', en: 'Asphalt', bm: 'Asfalt' },
  { key: 'metal', en: 'Metal', bm: 'Logam' },
  { key: 'glass', en: 'Glass', bm: 'Kaca' },
  { key: 'wood', en: 'Wood', bm: 'Kayu' },
  { key: 'other', en: 'Other', bm: 'Lain-lain' },
]

// Explicit, hand-audited mapping of every LIVE fine tag → bucket. Verbatim DB
// strings (exact case). Lookup is case/space-insensitive via a normalized index
// below, but the canonical entries are kept readable here for review.
//
// Two deliberate splits to watch: "Quartz" (engineered stone) → tile-stone, but
// "Quartz Glass" → glass; they must not collapse together. "Glass Tile" → glass
// (it is glass, not a stone tile).
const EXPLICIT_MAP: Record<string, MaterialBucketKey> = {
  // ── concrete ──
  Concrete: 'concrete',
  'Concrete Panel': 'concrete',
  'Concrete Pile': 'concrete',
  'Concrete Slab': 'concrete',
  'Cured Concrete': 'concrete',
  'Green Concrete': 'concrete',
  'Heavy Rebars Concrete': 'concrete',
  'Hollow Precast': 'concrete',
  Precast: 'concrete',
  'Precast Concrete': 'concrete',
  'Reinforced Concrete': 'concrete',
  'Retaining Wall': 'concrete',
  Paver: 'concrete',
  'Fibre Cement Board': 'concrete',
  Premix: 'concrete',

  // ── masonry ──
  Brick: 'masonry',
  'Brick & Block': 'masonry',
  'Brick Wall': 'masonry',
  'Engineering Brick': 'masonry',
  'Hollow block': 'masonry',
  'Light Weight Block': 'masonry',
  Masonry: 'masonry',
  'Masonry/Brick': 'masonry',
  'Sand Brick': 'masonry',

  // ── tile-stone ──
  Ceramic: 'tile-stone',
  'Ceramic Tile': 'tile-stone',
  Dekton: 'tile-stone',
  'Dekton Tile': 'tile-stone',
  Granite: 'tile-stone',
  'Hard Tile': 'tile-stone',
  Homogeneous: 'tile-stone',
  'Homogeneous Tile': 'tile-stone',
  'Laminam Tile': 'tile-stone',
  'Lapitec Tile': 'tile-stone',
  Limestone: 'tile-stone',
  'Manmade Stone Tile': 'tile-stone',
  Marble: 'tile-stone',
  'Medium Hard Granite': 'tile-stone',
  'Medium Hard Tile': 'tile-stone',
  'Neolith Tile': 'tile-stone',
  Porcelain: 'tile-stone',
  Quartz: 'tile-stone',
  'Roof Tile': 'tile-stone',
  Sandstone: 'tile-stone',
  Stone: 'tile-stone',
  Tile: 'tile-stone',
  'Vitrified Tile': 'tile-stone',
  'general tile': 'tile-stone',

  // ── asphalt ──
  Asphalt: 'asphalt',

  // ── metal ──
  Aluminium: 'metal',
  'Aluminum (5mm or less)': 'metal',
  'Sheet metal (HB200 or less)': 'metal',
  'Stainless steel (10mm or less)': 'metal',
  Steel: 'metal',

  // ── glass ──
  'Art Glass': 'glass',
  'B270/Crown Glass': 'glass',
  'Ceramic Glass': 'glass',
  'Electronic Glass': 'glass',
  'Flat Glass': 'glass',
  'Float Glass': 'glass',
  'Fused Silica/Fused Quartz': 'glass',
  Glass: 'glass',
  'Glass Assemblies': 'glass',
  'Glass Tile': 'glass',
  'Glass Tubing': 'glass',
  Optics: 'glass',
  Photonics: 'glass',
  'Quartz Glass': 'glass',
  'Soda Lime Glass': 'glass',
  'Stained Glass': 'glass',
  'Technical Glass 1737F': 'glass',
  'Tempered Glass': 'glass',

  // ── wood ──
  // "Wood" is the only live wood tag, but we keep the bucket so the catalogue
  // can grow timber products without a code change.
  Wood: 'wood',

  // ── other ──
  Multipurpose: 'other',
  Pipe: 'other',
}

// Normalize for forgiving lookup: trim, collapse internal whitespace, lowercase.
// We index the explicit map the same way so " concrete  slab " still resolves.
function normalize(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLowerCase()
}

const NORMALIZED_MAP: Record<string, MaterialBucketKey> = Object.fromEntries(
  Object.entries(EXPLICIT_MAP).map(([name, key]) => [normalize(name), key]),
)

// Deterministic fallback for any FUTURE tag not in the explicit map. WHY: a new
// DB tag must NEVER silently disappear from the filter. We bucket by the first
// matching head-noun substring. Order matters — "glass" is checked before
// "quartz"/"tile" so "Quartz Glass" lands in glass, and "asphalt"/"premix"
// before "concrete"-family words. Explicit map always wins over this.
function fallbackBucket(normalized: string): MaterialBucketKey {
  const has = (s: string) => normalized.includes(s)
  if (has('glass')) return 'glass'
  if (has('asphalt') || has('premix') || has('tarmac')) return 'asphalt'
  if (has('concrete') || has('precast') || has('rebar') || has('cement')) return 'concrete'
  if (has('brick') || has('block') || has('masonry')) return 'masonry'
  if (
    has('tile') ||
    has('granite') ||
    has('marble') ||
    has('stone') ||
    has('porcelain') ||
    has('ceramic') ||
    has('quartz')
  )
    return 'tile-stone'
  if (has('steel') || has('metal') || has('alumin') || has('iron')) return 'metal'
  if (has('wood') || has('timber')) return 'wood'
  return 'other'
}

/** Coarse filter bucket for a fine `materials.name` tag. Explicit map first,
 *  deterministic head-noun fallback for anything unseen. Input is trimmed and
 *  whitespace/case-normalized. Unknown/blank → 'other'. */
export function materialBucketKey(materialName: string): MaterialBucketKey {
  const normalized = normalize(materialName ?? '')
  if (!normalized) return 'other'
  return NORMALIZED_MAP[normalized] ?? fallbackBucket(normalized)
}

const BUCKET_BY_KEY: Record<MaterialBucketKey, MaterialBucket> = Object.fromEntries(
  MATERIAL_BUCKETS.map((b) => [b.key, b]),
) as Record<MaterialBucketKey, MaterialBucket>

/** Localized label for a bucket key. */
export function materialBucketLabel(key: MaterialBucketKey, lang: 'EN' | 'BM'): string {
  const bucket = BUCKET_BY_KEY[key]
  return lang === 'BM' ? bucket.bm : bucket.en
}
