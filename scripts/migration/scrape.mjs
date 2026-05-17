#!/usr/bin/env node
// Stage 1: scrape coolman.com.my public WP REST API into source/raw/*.json
// and download all referenced media into source/media/.
// Read-only. No DB writes. No external API keys needed.

import { mkdir, writeFile, readFile, stat } from 'node:fs/promises'
import { createWriteStream, existsSync } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'

const BASE = 'https://coolman.com.my/wp-json/wp/v2'
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'source')
const RAW = path.join(ROOT, 'raw')
const MEDIA = path.join(ROOT, 'media')

await mkdir(RAW, { recursive: true })
await mkdir(MEDIA, { recursive: true })

const log = (...a) => console.log('[scrape]', ...a)

async function fetchJSON(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'coolman-migration/1.0' } })
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  return r.json()
}

async function fetchHead(url) {
  const r = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'coolman-migration/1.0' } })
  return { total: Number(r.headers.get('x-wp-total') || 0), pages: Number(r.headers.get('x-wp-totalpages') || 0) }
}

async function paginate(endpoint, label) {
  const head = await fetchHead(`${BASE}/${endpoint}?per_page=100`)
  log(`${label}: ${head.total} items across ${head.pages} pages`)
  const all = []
  for (let p = 1; p <= Math.max(1, head.pages); p++) {
    const page = await fetchJSON(`${BASE}/${endpoint}?per_page=100&page=${p}`)
    all.push(...page)
    log(`  ${label} page ${p}: +${page.length} (total ${all.length})`)
  }
  await writeFile(path.join(RAW, `${endpoint.replace(/[^a-z0-9_]/gi, '_')}.json`), JSON.stringify(all, null, 2))
  return all
}

async function downloadMedia(url) {
  if (!url) return null
  const ext = path.extname(new URL(url).pathname) || '.bin'
  const hash = crypto.createHash('sha1').update(url).digest('hex').slice(0, 12)
  const filename = `${hash}${ext}`
  const dest = path.join(MEDIA, filename)
  if (existsSync(dest)) {
    const s = await stat(dest)
    return { filename, bytes: s.size, cached: true, sourceUrl: url }
  }
  const r = await fetch(url, { headers: { 'User-Agent': 'coolman-migration/1.0' } })
  if (!r.ok) {
    log(`  ! media fetch failed ${r.status}: ${url}`)
    return null
  }
  await pipeline(r.body, createWriteStream(dest))
  const s = await stat(dest)
  return { filename, bytes: s.size, cached: false, sourceUrl: url }
}

// ---- run ----
log('scraping taxonomies, products, pages, posts')
const [productCats, productTags, productBrands, products, pages, posts, media] = await Promise.all([
  paginate('product_cat', 'product_cat'),
  paginate('product_tag', 'product_tag'),
  paginate('product_brand', 'product_brand'),
  paginate('product', 'products'),
  paginate('pages', 'pages'),
  paginate('posts', 'posts'),
  paginate('media', 'media'),
])

// Build media lookup
const mediaById = new Map(media.map(m => [m.id, m]))

log('downloading product images...')
const downloads = []
let totalBytes = 0
let i = 0
for (const p of products) {
  i++
  if (i % 20 === 0) log(`  ${i}/${products.length}`)
  // featured image
  if (p.featured_media && mediaById.has(p.featured_media)) {
    const src = mediaById.get(p.featured_media).source_url
    const d = await downloadMedia(src)
    if (d) { downloads.push({ productSlug: p.slug, role: 'featured', ...d }); totalBytes += d.bytes }
  }
  // gallery images parsed from HTML body
  const html = p.content?.rendered || ''
  const imgUrls = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1])
  for (const url of imgUrls.slice(0, 10)) {
    if (!url.startsWith('http')) continue
    const d = await downloadMedia(url)
    if (d) { downloads.push({ productSlug: p.slug, role: 'gallery', ...d }); totalBytes += d.bytes }
  }
}
await writeFile(path.join(RAW, 'media_downloads.json'), JSON.stringify(downloads, null, 2))

// ---- inventory report ----
const stripHtml = s => (s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const catCounts = productCats.map(c => `- ${c.name} (${c.count})`).join('\n')
const sampleRows = products.slice(0, 8).map(p => {
  const cats = (p.product_cat || []).map(id => productCats.find(c => c.id === id)?.name).filter(Boolean).join(', ')
  return `| ${p.slug} | ${p.title?.rendered} | ${cats} | ${stripHtml(p.content?.rendered).slice(0, 80)}... |`
}).join('\n')

const noImages = products.filter(p => !p.featured_media).length
const mb = (totalBytes / 1024 / 1024).toFixed(1)

const inventory = `# coolman.com.my — Inventory (scrape on ${new Date().toISOString().slice(0, 10)})

## Counts
- **Products:** ${products.length}
- **Product categories:** ${productCats.length}
- **Product tags:** ${productTags.length}
- **Product brands:** ${productBrands.length}
- **Pages:** ${pages.length}
- **Posts (blog):** ${posts.length}
- **Media library entries:** ${media.length}
- **Images downloaded:** ${downloads.length} (${mb} MB on disk)
- **Products with no featured image:** ${noImages}

## Product categories (\`product_cat\`)
${catCounts}

## Pages (these may need a Payload pages collection — flag if you want me to build one)
${pages.map(p => `- /${p.slug} — ${p.title?.rendered}`).join('\n')}

## Posts (blog)
${posts.length === 0 ? '_(none)_' : posts.map(p => `- /${p.slug} — ${p.title?.rendered}`).join('\n')}

## Sample products
| slug | title | wp categories | snippet |
|---|---|---|---|
${sampleRows}

## Files written
- \`source/raw/product.json\` — ${products.length} products
- \`source/raw/product_cat.json\` — ${productCats.length} categories
- \`source/raw/product_tag.json\` — ${productTags.length} tags
- \`source/raw/product_brand.json\` — ${productBrands.length} brands
- \`source/raw/pages.json\` — ${pages.length} pages
- \`source/raw/posts.json\` — ${posts.length} posts
- \`source/raw/media.json\` — ${media.length} media library entries
- \`source/raw/media_downloads.json\` — ${downloads.length} downloaded file records
- \`source/media/\` — ${downloads.length} image files (${mb} MB)
`

await writeFile(path.join(path.dirname(ROOT), 'INVENTORY.md'), inventory)
log(`done. wrote INVENTORY.md`)
