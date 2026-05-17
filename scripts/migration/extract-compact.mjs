#!/usr/bin/env node
// Stage 2a: build a compact products-for-classification file from source/raw/product.json
// Output: source/products.compact.json — one row per product with only the fields
// needed for LLM classification (title, slug, wp categories, content snippet, image fact).

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'source')

const products = JSON.parse(await readFile(path.join(ROOT, 'raw', 'product.json'), 'utf8'))
const cats = JSON.parse(await readFile(path.join(ROOT, 'raw', 'product_cat.json'), 'utf8'))
const tags = JSON.parse(await readFile(path.join(ROOT, 'raw', 'product_tag.json'), 'utf8'))
const downloads = JSON.parse(await readFile(path.join(ROOT, 'raw', 'media_downloads.json'), 'utf8'))

const catById = new Map(cats.map(c => [c.id, c.name]))
const tagById = new Map(tags.map(t => [t.id, t.name]))

// Build per-product image filename list
const imagesByProduct = new Map()
for (const d of downloads) {
  if (!imagesByProduct.has(d.productSlug)) imagesByProduct.set(d.productSlug, [])
  imagesByProduct.get(d.productSlug).push({ filename: d.filename, role: d.role, sourceUrl: d.sourceUrl })
}

const decode = s => (s || '')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#8220;|&#8221;/g, '"')
  .replace(/&#8211;|&#8212;/g, '-')
  .replace(/&nbsp;/g, ' ')
  .replace(/&[a-z]+;/g, ' ')

const stripHtml = s => decode(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

// Extract YouTube URLs from body
const youtubeRe = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i

const compact = products.map(p => {
  const html = p.content?.rendered || ''
  const yt = html.match(youtubeRe)
  return {
    wpId: p.id,
    slug: p.slug,
    title: decode(p.title?.rendered),
    wpCategories: (p.product_cat || []).map(id => catById.get(id)).filter(Boolean),
    wpTags: (p.product_tag || []).map(id => tagById.get(id)).filter(Boolean),
    content: stripHtml(p.content?.rendered).slice(0, 1200), // 1.2k char snippet plenty for classification
    contentLen: stripHtml(p.content?.rendered).length,
    youtubeUrl: yt ? `https://youtube.com/watch?v=${yt[1]}` : null,
    images: imagesByProduct.get(p.slug) || [],
    sourceUrl: p.link,
  }
})

await writeFile(path.join(ROOT, 'products.compact.json'), JSON.stringify(compact, null, 2))

// Stats
const withImages = compact.filter(p => p.images.length > 0).length
const withContent = compact.filter(p => p.contentLen > 50).length
const withYoutube = compact.filter(p => p.youtubeUrl).length
console.log(`wrote ${compact.length} compact rows`)
console.log(`  with images:    ${withImages}`)
console.log(`  with content:   ${withContent} (>50 chars)`)
console.log(`  with YouTube:   ${withYoutube}`)
console.log(`  avg content:    ${Math.round(compact.reduce((a, p) => a + p.contentLen, 0) / compact.length)} chars`)

// Bucket by WP category for quick inspection
const buckets = new Map()
for (const p of compact) {
  for (const c of p.wpCategories) buckets.set(c, (buckets.get(c) || 0) + 1)
}
console.log('\nBy WP category:')
for (const [c, n] of [...buckets].sort((a, b) => b[1] - a[1])) console.log(`  ${n.toString().padStart(3)} ${c}`)
