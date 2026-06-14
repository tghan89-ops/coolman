// Trade-language synonym map for catalogue free-text search.
//
// Buyers type the words THEY use ("rebar", "core bit", "simen") which often do
// not appear verbatim in the catalogue taxonomy ("Reinforced Concrete",
// "Core Bits", "Concrete"). This map bridges that gap: a query token is
// expanded to a small OR-group of canonical terms that DO exist in the
// product haystack (name + sku + category + materials + applications).
//
// This is NOT fuzzy matching — it is a hand-curated, high-confidence lookup.
// Each value must be a substring of some real catalogue field, or it is dead
// weight. Keys are lowercased; comparison is substring, case-insensitive.
//
// SEEDED 2026-06-14 from the production zero-result search log
// (search_logs WHERE result_count=0, 180-day window). It is meant to GROW from
// that log: when a new genuine zero-result trade term shows up that SHOULD have
// matched something, add an entry here mapping it to the canonical taxonomy.
//
// Provenance per entry below: [log] = appeared in the real zero-result log;
// [hand] = obvious trade shorthand added pre-emptively.

export const SYNONYMS: Record<string, string[]> = {
  // --- Tooling shorthand (category-facing) ---
  'core bit': ['core bit', 'core bits', 'core drilling'], // [hand]
  'core bits': ['core bits', 'core drilling'], // [hand]
  corebit: ['core bit', 'core bits', 'core drilling'], // [hand]
  corebits: ['core bits', 'core drilling'], // [hand]
  'wall saw': ['wall saw', 'wall sawing'], // [hand]
  'wire saw': ['wire saw', 'wire sawing'], // [hand]
  'floor saw': ['floor saw', 'flat saw', 'road saw', 'floor sawing'], // [hand]
  'flat saw': ['flat saw', 'floor saw', 'floor sawing'], // [hand]
  'road saw': ['road saw', 'floor saw', 'floor sawing'], // [hand]
  blade: ['blade', 'diamond blade', 'saw blade'], // [hand]
  blades: ['blades', 'diamond blades', 'saw blades'], // [hand]
  grinder: ['grinding', 'grinding wheel', 'grinding cup', 'cup wheel'], // [hand]
  grinding: ['grinding', 'grinding wheel', 'surface grinding', 'edge grinding'], // [hand]
  cup: ['cup wheel', 'grinding cup', 'grinding wheel'], // [hand]
  drill: ['drill bit', 'drilling', 'drill bits'], // [hand]
  'hole saw': ['hole saw', 'hole saws'], // [hand]
  'hole saws': ['hole saws', 'hole saw'], // [hand]
  anchor: ['anchor', 'anchors', 'anchor setting', 'anchor drilling', 'anchor removal'], // [log: anchor setting / anchor removal tools]
  polish: ['polishing', 'polishing pad'], // [hand]
  polishing: ['polishing', 'polishing pad'], // [hand]

  // --- Material shorthand (EN) ---
  rebar: ['reinforced concrete', 'steel'], // [hand]
  rebars: ['reinforced concrete', 'steel'], // [log: heavy rebars]
  recon: ['reinforced concrete'], // [hand]
  'reinforced concrete': ['reinforced concrete'], // [log]
  cement: ['concrete', 'cement'], // [hand]
  iron: ['steel'], // [hand]
  metal: ['steel', 'sheet metal', 'stainless steel'], // [hand]
  porcelain: ['porcelain', 'porcelain tile', 'tile'], // [hand]
  ceramic: ['ceramic', 'ceramic tile', 'tile'], // [hand]
  stone: ['stone', 'stone cutting', 'sandstone', 'limestone'], // [log: asphalt,stone]
  tile: ['tile', 'tile cutting', 'tile drilling'], // [log: material=tile]
  glass: ['glass'], // [log: brick,glass]

  // --- Material shorthand (Bahasa Malaysia) ---
  simen: ['concrete', 'cement'], // [hand] BM: cement/concrete
  konkrit: ['concrete'], // [hand] BM: concrete
  kaca: ['glass'], // [hand] BM: glass
  besi: ['steel', 'reinforced concrete'], // [hand] BM: iron/steel
  batu: ['stone', 'brick'], // [hand] BM: stone/rock
  bata: ['brick'], // [hand] BM: brick
  jubin: ['tile'], // [hand] BM: tile
}

/**
 * Returns the synonym alternatives for a single (already-lowercased) query
 * token, ALWAYS including the token itself. Result is lowercased and deduped.
 * A token with no entry just returns `[token]`.
 */
export function expandToken(token: string): string[] {
  const t = token.trim().toLowerCase()
  if (!t) return []
  const alts = SYNONYMS[t] ?? []
  const out = [t, ...alts.map((a) => a.toLowerCase())]
  return Array.from(new Set(out))
}
