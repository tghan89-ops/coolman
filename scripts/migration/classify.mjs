#!/usr/bin/env node
// Stage 2: deterministic classifier.
// Reads source/products.compact.json + taxonomy.json.
// Emits PROPOSALS.json (all 225), REVIEW.csv (low-confidence), CATEGORY-MAP.csv (WP→Payload).
//
// What it decides per product:
//   - payload category, materials[], applications[]
//   - machine tier
//   - diameter, arborSize, teeth count (where parseable from title)
//   - cleaned English description (grammar fixes) OR synthesized from title
//   - BM name + BM description (glossary template)
//   - confidence 0..1 — anything < 0.75 goes to REVIEW.csv

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)))
const SRC = path.join(ROOT, 'source')

const compact = JSON.parse(await readFile(path.join(SRC, 'products.compact.json'), 'utf8'))
const taxonomy = JSON.parse(await readFile(path.join(ROOT, 'taxonomy.json'), 'utf8'))

const tx = {
  cat: new Set(taxonomy.categories.map(c => c.key)),
  mat: new Set(taxonomy.materials.map(m => m.key)),
  app: new Set(taxonomy.applications.map(a => a.key)),
  tier: new Set(taxonomy.machineTiers.map(t => t.key)),
  catBM: Object.fromEntries(taxonomy.categories.map(c => [c.key, c.nameBM])),
  catEN: Object.fromEntries(taxonomy.categories.map(c => [c.key, c.name])),
  matBM: Object.fromEntries(taxonomy.materials.map(m => [m.key, m.nameBM])),
}

// ───────────── WP category → Payload category (deterministic) ─────────────
// Brand-only tags (COOLMAN®/SHIBUYA®/UNIKA®) ignored — they aren't real categories.
const WP_TO_PAYLOAD = {
  'Diamond Blade':              'cutting_blades',
  'Diamond Grinding':           'grinding_wheels',
  'Diamond Polishing Pad':      'polishing_pads',
  'Diamond Core Bit Wet':       'core_bits',
  'Dorai Handheld Core Bit':    'core_bits',
  'Diamond Bit':                'core_bits',          // refined below if Stone/Dorai signals present
  'Diamond Stone Bit':          'drill_bits',
  'Concrete Drill Bit':         'drill_bits',
  'MCTR Hole Saw':              'hole_saws',
  'T.C.T Hole Saw':             'hole_saws',
  'DymoDrill':                  'drilling_machines',
  'Wall Saw Machine':           'cutting_machines',
  'Walk Behind Saw':            'cutting_machines',
  'Tile Saw & Masonry Saw':     'cutting_machines',
  'Power Cutter':               'cutting_machines',
  'Floor Grinder':              'floor_equipment',
  'Shaving Collection System':  'floor_equipment',
  'Anchor Removing System':     'anchor_removal',
  'Optional Parts':             'accessories',
  'Uncategorized':              null,                  // forces review
}

// Default machine tier per Payload category (overridable via title heuristics)
const DEFAULT_TIER = {
  drilling_machines:  'professional',
  cutting_machines:   'industrial',
  floor_equipment:    'industrial',
  cutting_blades:     'trade',
  core_bits:          'professional',
  drill_bits:         'trade',
  grinding_wheels:    'trade',
  polishing_pads:     'trade',
  hole_saws:          'trade',
  anchors_fixings:    'trade',
  anchor_removal:     'trade',
  accessories:        'trade',
}

// ───────────── Keyword tables ─────────────
const MATERIAL_KW = [
  ['reinforced_concrete', /\b(reinforced\s*concrete|rebar)\b/i],
  ['concrete',            /\b(concrete|konkrit)\b/i],
  ['asphalt',             /\b(asphalt|asfalt)\b/i],
  ['aluminium',           /\b(aluminium|aluminum)\b/i],
  ['wood',                /\b(wood|timber|kayu)\b/i],
  ['steel',               /\b(steel|metal|keluli)\b/i],
  ['tile',                /\b(tile|jubin|porcelain|ceramic)\b/i],
  ['granite',             /\b(granite|granit)\b/i],
  ['marble',              /\b(marble|marmar)\b/i],
  ['stone',               /\b(stone|batu)\b/i],
  ['masonry',             /\b(masonry|brick|bata|block)\b/i],
]

const APPLICATION_KW = [
  ['wet_cutting',      /\b(wet)\b/i],
  ['dry_cutting',      /\b(dry)\b/i],
  ['floor_sawing',     /\b(floor saw|walk[- ]?behind|floor sawing)\b/i],
  ['wall_sawing',      /\b(wall saw|wall sawing)\b/i],
  ['handheld_cutting', /\b(hand[- ]?held|power cutter|cut[- ]n[- ]break)\b/i],
  ['core_drilling',    /\b(core (drill|bit|drilling)|coring)\b/i],
  ['anchor_drilling',  /\b(anchor (drill|drilling)|sds)\b/i],
  ['surface_grinding', /\b(grinding|grinder|surface prep)\b/i],
  ['polishing',        /\b(polish|polishing)\b/i],
  ['anchor_removal',   /\b(anchor remov|drop[- ]?in anchor|anchor resetter|setting tool)\b/i],
]

// ───────────── Title parsers ─────────────
// Diameter: "12\"", "12″", "Ø180mm", "180mm"
const reDiamMm     = /(?:Ø|⌀|diameter\s*)?(\d{2,4})\s*mm\b/i
const reDiamInch   = /(\d{1,2}(?:\.\d)?)\s*(?:″|"|''|inch(?:es)?)/i
const reTeeth      = /(\d{2,3})\s*teeth/i

function parseDiameter(title) {
  const mm = title.match(reDiamMm)
  if (mm) return `${mm[1]}mm`
  const inch = title.match(reDiamInch)
  if (inch) {
    // common inch→mm conversions for the blade sizes seen
    const map = { '4': '100mm', '5': '125mm', '7': '180mm', '9': '230mm', '10': '250mm', '12': '300mm', '14': '350mm', '16': '400mm', '18': '450mm' }
    return map[inch[1]] || `${inch[1]}"`
  }
  return null
}

function parseTeeth(title) {
  const m = title.match(reTeeth)
  return m ? Number(m[1]) : null
}

// ───────────── Grammar cleanup for existing English content ─────────────
// Issues observed on source site: stray space before punctuation, Unicode bold
// math chars, emoji bullets, run-on em-dashes used as bullets.

const BOLD_MAP = (() => {
  // Unicode Mathematical Bold Sans-Serif → ASCII
  const a = 0x1D5D4, A = 0x1D5BC
  const m = {}
  for (let i = 0; i < 26; i++) {
    m[String.fromCodePoint(A + i)] = String.fromCharCode(65 + i)
    m[String.fromCodePoint(a + i)] = String.fromCharCode(97 + i)
  }
  // Mathematical Bold (serif)
  const A2 = 0x1D400, a2 = 0x1D41A
  for (let i = 0; i < 26; i++) {
    m[String.fromCodePoint(A2 + i)] = String.fromCharCode(65 + i)
    m[String.fromCodePoint(a2 + i)] = String.fromCharCode(97 + i)
  }
  // Bold digits
  for (let i = 0; i < 10; i++) m[String.fromCodePoint(0x1D7EC + i)] = String(i)
  for (let i = 0; i < 10; i++) m[String.fromCodePoint(0x1D7CE + i)] = String(i)
  return m
})()

function normalizeUnicode(s) {
  return [...s].map(ch => BOLD_MAP[ch] ?? ch).join('')
}

function stripEmoji(s) {
  // strip pictographic emoji + variation selectors
  return s
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/️/g, '')
}

function cleanDescription(raw) {
  if (!raw || raw.length < 30) return null
  let s = stripEmoji(normalizeUnicode(raw))
  // collapse straight quotes/dashes
  s = s.replace(/[""]/g, '"').replace(/['']/g, "'")
  // remove stray space before punctuation: "performance ." → "performance."
  s = s.replace(/\s+([.,;:!?])/g, '$1')
  // collapse multiple spaces
  s = s.replace(/\s{2,}/g, ' ').trim()
  // split em-dash bullet runs into proper lines: "feature - explanation - feature2" stays single line
  // but "– Foo – Bar – Baz" → "\n- Foo\n- Bar\n- Baz" when 3+ are present
  const dashCount = (s.match(/–|—/g) || []).length
  if (dashCount >= 3) {
    s = s.replace(/\s*[–—]\s*/g, '\n- ')
  } else {
    s = s.replace(/[–—]/g, '-')
  }
  // remove orphan leading "- " on first line
  s = s.replace(/^-\s+/, '')
  // tidy "Key Features & Benefits:" run-on → newline
  s = s.replace(/(Key Features[^:]*:)\s*/i, '\n\n$1\n')
  return s.trim()
}

// ───────────── Description synthesis (for title-only products) ─────────────
function synthDescription(p, derived) {
  const { category, materials, diameter, teeth } = derived
  const catName = tx.catEN[category] || 'product'
  const matText = materials.length
    ? materials.map(k => taxonomy.materials.find(m => m.key === k)?.name.toLowerCase()).filter(Boolean).join(', ')
    : null

  const bits = []
  if (diameter && teeth) {
    bits.push(`${p.title} — ${diameter} ${catName.toLowerCase().replace(/s$/, '')} with ${teeth} teeth`)
  } else if (diameter) {
    bits.push(`${p.title} — ${diameter} ${catName.toLowerCase()}`)
  } else {
    bits.push(`${p.title} — ${catName}`)
  }
  if (matText) bits.push(`Designed for cutting ${matText}.`)
  bits.push(`Professional-grade tool for construction and contractor use.`)
  return bits.join('. ').replace(/\.\./g, '.')
}

// ───────────── BM translation (glossary template) ─────────────
const BM_CAT = {
  cutting_blades:    'Mata pemotong',
  core_bits:         'Mata gerudi teras',
  drill_bits:        'Mata gerudi',
  grinding_wheels:   'Roda canai',
  polishing_pads:    'Pad penggilap',
  drilling_machines: 'Mesin penggerudi',
  cutting_machines:  'Mesin pemotong',
  floor_equipment:   'Peralatan lantai',
  hole_saws:         'Gergaji lubang',
  anchors_fixings:   'Tambat',
  anchor_removal:    'Alat tanggal tambat',
  accessories:       'Aksesori',
}

function bmDescription(p, derived) {
  const { category, materials, diameter } = derived
  const catBM = BM_CAT[category] || 'produk'
  const matBM = materials.map(k => tx.matBM[k]?.toLowerCase()).filter(Boolean).join(', ')
  const parts = []
  if (diameter) {
    parts.push(`${p.title} — ${catBM.toLowerCase()} bersaiz ${diameter}`)
  } else {
    parts.push(`${p.title} — ${catBM.toLowerCase()}`)
  }
  if (matBM) parts.push(`Direka untuk memotong ${matBM}.`)
  parts.push(`Alat gred profesional untuk kerja pembinaan dan kontraktor.`)
  return parts.join('. ').replace(/\.\.+/g, '.')
}

// ───────────── Main classification ─────────────
function classify(p) {
  const reasons = []
  let confidence = 1.0

  // 1. Category — process specific WP cats before generic "Diamond Bit"
  const realWpCats = p.wpCategories.filter(c => !/®$/.test(c))
  const PRIORITY = [
    'Diamond Stone Bit', 'Dorai Handheld Core Bit', 'Diamond Core Bit Wet',
    'MCTR Hole Saw', 'T.C.T Hole Saw',
    'Tile Saw & Masonry Saw', 'Wall Saw Machine', 'Walk Behind Saw', 'Power Cutter',
    'Floor Grinder', 'Shaving Collection System',
    'Anchor Removing System', 'DymoDrill',
    'Diamond Blade', 'Diamond Grinding', 'Diamond Polishing Pad',
    'Concrete Drill Bit', 'Diamond Bit',
    'Optional Parts', 'Uncategorized',
  ]
  let category = null
  for (const want of PRIORITY) {
    if (realWpCats.some(c => c.replace('&amp;', '&') === want)) {
      category = WP_TO_PAYLOAD[want]
      if (category) break
    }
  }
  if (!category) {
    confidence -= 0.5
    reasons.push(`no WP category mapped (raw: ${p.wpCategories.join(', ')})`)
  }

  // override: title naming an accessory part wins over the WP category
  if (/\b(adaptor|adapter|tube|rod|setting tool|catheter|resetter|hammering tool)\b/i.test(p.title)) {
    category = 'accessories'
  }
  // refine: "Diamond Bit" alone is too vague — needs Dorai/Stone/Wet signal
  if (category === 'core_bits' && realWpCats.includes('Diamond Bit') && realWpCats.length === 1) {
    confidence -= 0.15
    reasons.push('Diamond Bit only — verify core vs stone')
  }

  // 2. Materials
  const text = `${p.title} ${p.content}`.toLowerCase()
  const materials = []
  for (const [key, re] of MATERIAL_KW) {
    if (re.test(text) && !materials.includes(key)) materials.push(key)
  }
  // promote: blade product with diameter but no material → assume concrete (most common)
  if (category === 'cutting_blades' && materials.length === 0) {
    materials.push('concrete')
    confidence -= 0.1
    reasons.push('blade with no material signal — defaulted to concrete')
  }
  if (category === 'core_bits' && materials.length === 0) {
    materials.push('concrete', 'reinforced_concrete')
  }

  // 3. Applications
  const applications = []
  for (const [key, re] of APPLICATION_KW) {
    if (re.test(text) && !applications.includes(key)) applications.push(key)
  }
  // defaults by category if nothing detected
  if (applications.length === 0) {
    const defaults = {
      cutting_blades:     ['dry_cutting'],
      core_bits:          ['core_drilling', 'wet_cutting'],
      drill_bits:         ['anchor_drilling'],
      grinding_wheels:    ['surface_grinding'],
      polishing_pads:     ['polishing'],
      drilling_machines:  ['core_drilling'],
      cutting_machines:   ['floor_sawing'],
      floor_equipment:    ['surface_grinding'],
      hole_saws:          ['dry_cutting'],
      anchor_removal:     ['anchor_removal'],
      accessories:        [],
    }
    if (defaults[category]?.length) {
      applications.push(...defaults[category])
      confidence -= 0.05
    }
  }

  // 4. Machine tier
  let machineTier = DEFAULT_TIER[category] || 'trade'
  if (/\bK3000|K970|FS\s?\d+|SS-300/i.test(p.title)) machineTier = 'industrial'
  if (/\bhand[- ]?held|hh\d/i.test(p.title)) machineTier = 'trade'

  // 5. Diameter / teeth / arbor
  const diameter = parseDiameter(p.title) || parseDiameter(p.content)
  const teeth = parseTeeth(p.title)
  // most circular blades use 22.23mm arbor (7/8")
  const arborSize = category === 'cutting_blades' && diameter ? '22.23mm' : null

  // 6. Descriptions
  let description = cleanDescription(p.content)
  let descSource = 'cleaned'
  if (!description) {
    description = synthDescription(p, { category, materials, diameter, teeth })
    descSource = 'synthesized'
    confidence -= 0.05
  }
  const descriptionBM = bmDescription(p, { category, materials, diameter })

  // 7. SKU + nameBM
  const sku = p.title
    .replace(/[""]/g, '"')
    .replace(/[^A-Z0-9.\-″"]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toUpperCase()
    .slice(0, 32)
  const nameBM = p.title // proper noun — model number / English part-name unchanged

  confidence = Math.max(0, Math.min(1, confidence))

  return {
    wpId: p.id,
    slug: p.slug,
    sku,
    name: p.title,
    nameBM,
    category,
    materials,
    applications,
    machineTier,
    diameter,
    arborSize,
    teeth,
    description,
    descriptionBM,
    descSource,
    youtubeUrl: p.youtubeUrl,
    images: p.images,
    sourceUrl: p.sourceUrl,
    wpCategories: p.wpCategories,
    confidence: Number(confidence.toFixed(2)),
    needsReview: confidence < 0.75,
    reviewReasons: reasons,
  }
}

const proposals = compact.map(classify)

await writeFile(path.join(ROOT, 'PROPOSALS.json'), JSON.stringify(proposals, null, 2))

// REVIEW.csv — low-confidence rows only
function csvEscape(s) {
  if (s == null) return ''
  const str = String(s)
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

const reviewRows = proposals.filter(p => p.needsReview)
const reviewHeader = ['sku', 'name', 'wpCategories', 'proposed_category', 'materials', 'applications', 'machineTier', 'confidence', 'reasons', 'sourceUrl']
const reviewCsv = [
  reviewHeader.join(','),
  ...reviewRows.map(r => [
    r.sku, r.name, r.wpCategories.join('|'), r.category || '(NONE)',
    r.materials.join('|'), r.applications.join('|'), r.machineTier,
    r.confidence, r.reviewReasons.join(' / '), r.sourceUrl,
  ].map(csvEscape).join(',')),
].join('\n')
await writeFile(path.join(ROOT, 'REVIEW.csv'), reviewCsv)

// CATEGORY-MAP.csv — WP category → Payload category, one row each, with counts
const wpCounts = new Map()
for (const p of compact) {
  for (const c of p.wpCategories) wpCounts.set(c, (wpCounts.get(c) || 0) + 1)
}
const mapHeader = ['wp_category', 'product_count', 'payload_category', 'payload_category_label', 'is_brand_tag', 'note']
const mapRows = [...wpCounts.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(([c, n]) => {
    const isBrand = /®$/.test(c)
    const k = WP_TO_PAYLOAD[c.replace('&amp;', '&')]
    return [
      c, n,
      isBrand ? '(ignored)' : (k || '(REVIEW)'),
      isBrand ? 'brand tag' : (k ? tx.catEN[k] : ''),
      isBrand ? 'yes' : '',
      isBrand ? 'brand tags collapsed into product.brand field, not Payload Category' : '',
    ]
  })
const mapCsv = [mapHeader.join(','), ...mapRows.map(r => r.map(csvEscape).join(','))].join('\n')
await writeFile(path.join(ROOT, 'CATEGORY-MAP.csv'), mapCsv)

// Stats
const byCat = {}
for (const p of proposals) byCat[p.category || '(NONE)'] = (byCat[p.category || '(NONE)'] || 0) + 1
const synthCount = proposals.filter(p => p.descSource === 'synthesized').length
const cleanCount = proposals.filter(p => p.descSource === 'cleaned').length

console.log(`wrote PROPOSALS.json (${proposals.length} rows)`)
console.log(`wrote REVIEW.csv (${reviewRows.length} low-confidence)`)
console.log(`wrote CATEGORY-MAP.csv (${mapRows.length} WP categories)`)
console.log('')
console.log('By proposed Payload category:')
for (const [k, n] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${n.toString().padStart(3)} ${k}`)
}
console.log('')
console.log(`Description source: ${cleanCount} cleaned, ${synthCount} synthesized`)
console.log(`Confidence: avg ${(proposals.reduce((a, p) => a + p.confidence, 0) / proposals.length).toFixed(2)}, ${reviewRows.length} need review`)
