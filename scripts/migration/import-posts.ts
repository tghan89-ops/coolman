// Stage 3b — import 11 WordPress blog posts into Payload `posts` collection.
// Run with:  pnpm tsx --env-file=.env.local scripts/migration/import-posts.ts
//
// What it does:
//   1. Reads source/raw/posts.json and source/raw/media.json.
//   2. For each post: downloads the featured image (if available), uploads to Media,
//      decodes HTML entities, strips WP block comments, creates Post with
//      status='draft', stores sourceWpId for idempotent re-runs.
//   3. Writes POSTS-IMPORT-REPORT.md.
//
// Idempotent: skips posts whose sourceWpId already exists.
// EN-only: BM fields left blank. Existing pick(en, bm) fallback covers BM viewers
// until Alan adds translations through the admin.

import { getPayload } from 'payload'
import config from '@payload-config'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))

type WpPost = {
  id: number
  date: string
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  featured_media: number
  yoast_head_json?: { title?: string; description?: string }
}

type WpMedia = {
  id: number
  source_url: string
  alt_text?: string
}

const log = (...a: any[]) => console.log('[posts]', ...a)

function decodeEntities(s: string): string {
  return s
    .replace(/&#8243;/g, '"')
    .replace(/&#8242;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '-')
    .replace(/&#8230;/g, '...')
    .replace(/&hellip;/g, '...')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
}

function stripWpBlocks(html: string): string {
  return html
    .replace(/<!--\s*\/?wp:[^>]*-->/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function stripHtmlToText(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()
}

async function downloadImage(url: string): Promise<{ buf: Buffer; mime: string; filename: string } | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) {
      log(`  ! image fetch failed ${res.status}: ${url}`)
      return null
    }
    const ab = await res.arrayBuffer()
    const buf = Buffer.from(ab)
    const filename = url.split('/').pop() || 'image.webp'
    const ext = path.extname(filename).toLowerCase()
    const mime =
      ext === '.png' ? 'image/png' :
      ext === '.webp' ? 'image/webp' :
      ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
      'application/octet-stream'
    return { buf, mime, filename }
  } catch (err: any) {
    log(`  ! image fetch error: ${url} — ${err?.message || err}`)
    return null
  }
}

async function uploadHeroImage(
  payload: any,
  url: string,
  alt: string,
): Promise<any | null> {
  const filename = url.split('/').pop() || 'image.webp'

  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  })
  if (existing.docs.length > 0) return existing.docs[0].id

  const dl = await downloadImage(url)
  if (!dl) return null

  const created = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data: dl.buf, name: dl.filename, mimetype: dl.mime, size: dl.buf.length },
  })
  return created.id
}

async function run() {
  const payload = await getPayload({ config })

  const posts: WpPost[] = JSON.parse(
    await readFile(path.join(HERE, 'source', 'raw', 'posts.json'), 'utf8'),
  )
  const media: WpMedia[] = JSON.parse(
    await readFile(path.join(HERE, 'source', 'raw', 'media.json'), 'utf8'),
  )
  const mediaById = new Map<number, WpMedia>(media.map((m) => [m.id, m]))

  log(`importing ${posts.length} posts...`)
  const report: {
    slug: string
    title: string
    status: 'created' | 'skipped' | 'failed'
    heroResolved: boolean
    reason?: string
  }[] = []

  for (const p of posts) {
    const title = decodeEntities(p.title?.rendered || '')
    try {
      const existing = await payload.find({
        collection: 'posts',
        where: { sourceWpId: { equals: p.id } },
        limit: 1,
        depth: 0,
      })
      if (existing.docs.length > 0) {
        report.push({ slug: p.slug, title, status: 'skipped', heroResolved: false, reason: 'sourceWpId exists' })
        log(`  - skip (exists): ${p.slug}`)
        continue
      }

      // Hero image
      let heroId: any = null
      const m = mediaById.get(p.featured_media)
      if (m?.source_url) {
        heroId = await uploadHeroImage(payload, m.source_url, m.alt_text || title)
      }

      const content = stripWpBlocks(decodeEntities(p.content?.rendered || ''))
      const excerpt = stripHtmlToText(p.excerpt?.rendered || '').slice(0, 400)

      const seo: any = {}
      if (p.yoast_head_json?.title) seo.metaTitle = decodeEntities(p.yoast_head_json.title)
      if (p.yoast_head_json?.description) seo.metaDescription = decodeEntities(p.yoast_head_json.description)

      const data: any = {
        slug: p.slug,
        title,
        excerpt,
        content,
        status: 'draft',
        publishedAt: p.date,
        sourceWpId: p.id,
      }
      if (heroId) data.heroImage = heroId
      if (Object.keys(seo).length) data.seo = seo

      await payload.create({ collection: 'posts', data })
      report.push({ slug: p.slug, title, status: 'created', heroResolved: !!heroId })
      log(`  + created: ${p.slug}${heroId ? '' : ' (no hero)'}`)
    } catch (err: any) {
      report.push({
        slug: p.slug,
        title,
        status: 'failed',
        heroResolved: false,
        reason: err?.message?.slice(0, 200) || String(err),
      })
      log(`  x failed: ${p.slug} — ${err?.message || err}`)
    }
  }

  const created = report.filter((r) => r.status === 'created').length
  const skipped = report.filter((r) => r.status === 'skipped').length
  const failed = report.filter((r) => r.status === 'failed').length

  const rows = report
    .map(
      (r) =>
        `| ${r.slug} | ${r.status} | ${r.heroResolved ? 'Y' : 'N'} | ${r.reason || ''} |`,
    )
    .join('\n')

  const md = `# Posts Import Report - ${new Date().toISOString().slice(0, 10)}

## Summary
- **Created:** ${created}
- **Skipped (already existed):** ${skipped}
- **Failed:** ${failed}

## Notes
- All posts imported with **status = draft**. Alan publishes each one via /admin after BM review.
- **EN content only.** BM fields left blank intentionally - existing pick(en, bm) fallback shows EN to BM viewers until Alan translates. (Reason: existing translation helper is template-based for short product names; 9000-char prose needs human review.)
- Hero images downloaded live from coolman.com.my and uploaded to Media. Re-runs skip downloads via filename match.

## Per-post
| Slug | Status | Hero | Reason |
|---|---|---|---|
${rows}
`
  await writeFile(path.join(HERE, 'POSTS-IMPORT-REPORT.md'), md)
  log(`done. created=${created} skipped=${skipped} failed=${failed}`)
  log(`wrote POSTS-IMPORT-REPORT.md`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
