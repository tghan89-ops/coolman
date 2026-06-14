import { describe, it, expect } from 'vitest'
import {
  MATERIAL_BUCKETS,
  materialBucketKey,
  materialBucketLabel,
  type MaterialBucketKey,
} from '../material-group'

// The 74 LIVE material tags (verbatim DB `materials.name`) → expected bucket.
// Table-driven so a wrong remap is one obvious failing row.
const LIVE_TAGS: Array<[string, MaterialBucketKey]> = [
  // concrete (15)
  ['Concrete', 'concrete'],
  ['Concrete Panel', 'concrete'],
  ['Concrete Pile', 'concrete'],
  ['Concrete Slab', 'concrete'],
  ['Cured Concrete', 'concrete'],
  ['Green Concrete', 'concrete'],
  ['Heavy Rebars Concrete', 'concrete'],
  ['Hollow Precast', 'concrete'],
  ['Precast', 'concrete'],
  ['Precast Concrete', 'concrete'],
  ['Reinforced Concrete', 'concrete'],
  ['Retaining Wall', 'concrete'],
  ['Paver', 'concrete'],
  ['Fibre Cement Board', 'concrete'],
  ['Premix', 'concrete'],
  // masonry (9)
  ['Brick', 'masonry'],
  ['Brick & Block', 'masonry'],
  ['Brick Wall', 'masonry'],
  ['Engineering Brick', 'masonry'],
  ['Hollow block', 'masonry'],
  ['Light Weight Block', 'masonry'],
  ['Masonry', 'masonry'],
  ['Masonry/Brick', 'masonry'],
  ['Sand Brick', 'masonry'],
  // tile-stone (24)
  ['Ceramic', 'tile-stone'],
  ['Ceramic Tile', 'tile-stone'],
  ['Dekton', 'tile-stone'],
  ['Dekton Tile', 'tile-stone'],
  ['Granite', 'tile-stone'],
  ['Hard Tile', 'tile-stone'],
  ['Homogeneous', 'tile-stone'],
  ['Homogeneous Tile', 'tile-stone'],
  ['Laminam Tile', 'tile-stone'],
  ['Lapitec Tile', 'tile-stone'],
  ['Limestone', 'tile-stone'],
  ['Manmade Stone Tile', 'tile-stone'],
  ['Marble', 'tile-stone'],
  ['Medium Hard Granite', 'tile-stone'],
  ['Medium Hard Tile', 'tile-stone'],
  ['Neolith Tile', 'tile-stone'],
  ['Porcelain', 'tile-stone'],
  ['Quartz', 'tile-stone'],
  ['Roof Tile', 'tile-stone'],
  ['Sandstone', 'tile-stone'],
  ['Stone', 'tile-stone'],
  ['Tile', 'tile-stone'],
  ['Vitrified Tile', 'tile-stone'],
  ['general tile', 'tile-stone'],
  // asphalt (1)
  ['Asphalt', 'asphalt'],
  // metal (5)
  ['Aluminium', 'metal'],
  ['Aluminum (5mm or less)', 'metal'],
  ['Sheet metal (HB200 or less)', 'metal'],
  ['Stainless steel (10mm or less)', 'metal'],
  ['Steel', 'metal'],
  // glass (18)
  ['Art Glass', 'glass'],
  ['B270/Crown Glass', 'glass'],
  ['Ceramic Glass', 'glass'],
  ['Electronic Glass', 'glass'],
  ['Flat Glass', 'glass'],
  ['Float Glass', 'glass'],
  ['Fused Silica/Fused Quartz', 'glass'],
  ['Glass', 'glass'],
  ['Glass Assemblies', 'glass'],
  ['Glass Tile', 'glass'],
  ['Glass Tubing', 'glass'],
  ['Optics', 'glass'],
  ['Photonics', 'glass'],
  ['Quartz Glass', 'glass'],
  ['Soda Lime Glass', 'glass'],
  ['Stained Glass', 'glass'],
  ['Technical Glass 1737F', 'glass'],
  ['Tempered Glass', 'glass'],
  // other (2)
  ['Multipurpose', 'other'],
  ['Pipe', 'other'],
]

describe('materialBucketKey — live tags', () => {
  it('maps all 74 live tags to the audited bucket', () => {
    expect(LIVE_TAGS).toHaveLength(74)
    for (const [tag, expected] of LIVE_TAGS) {
      expect(materialBucketKey(tag), `"${tag}" should bucket as ${expected}`).toBe(expected)
    }
  })

  it('is forgiving of surrounding/extra whitespace and case', () => {
    expect(materialBucketKey('  concrete   slab ')).toBe('concrete')
    expect(materialBucketKey('GLASS TILE')).toBe('glass')
  })

  it('keeps the explicit "Wood" tag in the wood bucket', () => {
    expect(materialBucketKey('Wood')).toBe('wood')
  })
})

describe('Quartz vs Quartz Glass split', () => {
  it('keeps engineered-stone Quartz in tile-stone but Quartz Glass in glass', () => {
    expect(materialBucketKey('Quartz')).toBe('tile-stone')
    expect(materialBucketKey('Quartz Glass')).toBe('glass')
    expect(materialBucketKey('Quartz')).not.toBe(materialBucketKey('Quartz Glass'))
  })
})

describe('deterministic fallback for unseen future tags', () => {
  it('buckets by head-noun substring', () => {
    expect(materialBucketKey('Some New Granite Variant')).toBe('tile-stone')
    expect(materialBucketKey('XYZ Glass')).toBe('glass')
    expect(materialBucketKey('Totally Unknown')).toBe('other')
    expect(materialBucketKey('Recycled Asphalt')).toBe('asphalt')
    expect(materialBucketKey('Galvanized Iron')).toBe('metal')
    expect(materialBucketKey('Hardwood Timber')).toBe('wood')
  })

  it('prefers glass over stone/quartz when both words are present', () => {
    expect(materialBucketKey('Fused Quartz Display Glass')).toBe('glass')
  })

  it('treats blank/whitespace as other', () => {
    expect(materialBucketKey('')).toBe('other')
    expect(materialBucketKey('   ')).toBe('other')
  })
})

describe('MATERIAL_BUCKETS', () => {
  it('has 8 entries in display order with non-empty EN+BM labels', () => {
    expect(MATERIAL_BUCKETS.map((b) => b.key)).toEqual([
      'concrete',
      'masonry',
      'tile-stone',
      'asphalt',
      'metal',
      'glass',
      'wood',
      'other',
    ])
    for (const b of MATERIAL_BUCKETS) {
      expect(b.en.length).toBeGreaterThan(0)
      expect(b.bm.length).toBeGreaterThan(0)
    }
  })

  it('materialBucketLabel returns the right language', () => {
    expect(materialBucketLabel('tile-stone', 'EN')).toBe('Tile & Stone')
    expect(materialBucketLabel('tile-stone', 'BM')).toBe('Jubin & Batu')
    expect(materialBucketLabel('other', 'BM')).toBe('Lain-lain')
  })
})
