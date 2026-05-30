/**
 * One-shot: regenerate the responsive image variants for every existing Media
 * doc so they pick up the new WebP `formatOptions` (see collections/Media.ts).
 *
 * WHY: product photos uploaded as PNG produce ~250KB thumbnails (PNG is
 * lossless). After switching the thumbnail/card/hero variants to WebP, NEW
 * uploads are small automatically — but existing images keep their old PNG
 * variants until the file is re-processed. Payload only regenerates sizes when
 * a file is (re)uploaded, so this script fetches each original and re-uploads
 * it through the Local API, which re-runs sharp with the current config.
 *
 * SAFETY:
 *  - Idempotent: skips any doc whose thumbnail is already a .webp.
 *  - Reads originals from the PROD media route (NEXT_PUBLIC_SERVER_URL is
 *    localhost in dev, so we hit ORIGIN_BASE explicitly).
 *  - The master file is re-uploaded unchanged (same bytes, same format); only
 *    the derived variants change format.
 *  - DRY RUN by default. Pass `--apply` to actually write.
 *  - Pass `--only=<filename>` to process a single image first as a smoke test.
 *
 *   # dry run (lists what would change):
 *   npx tsx --env-file=.env.local scripts/regenerate-media-sizes.ts
 *   # one image, for real:
 *   npx tsx --env-file=.env.local scripts/regenerate-media-sizes.ts --apply --only=02bfacf22a1f.png
 *   # everything, for real:
 *   npx tsx --env-file=.env.local scripts/regenerate-media-sizes.ts --apply
 */

import { getPayload } from 'payload'
import config from '@payload-config'

// Where the original master bytes can actually be fetched from. The local dev
// server URL won't have the files, so default to production. Override with
// ORIGIN_BASE if regenerating against a different live origin.
const ORIGIN_BASE = process.env.ORIGIN_BASE ?? 'https://coolman-omega.vercel.app'

const APPLY = process.argv.includes('--apply')
const ONLY = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1] ?? null

function thumbnailIsWebp(doc: any): boolean {
  const url: unknown = doc?.sizes?.thumbnail?.url
  return typeof url === 'string' && url.toLowerCase().includes('.webp')
}

async function fetchOriginal(filename: string): Promise<Buffer | null> {
  const url = `${ORIGIN_BASE}/api/media/file/${encodeURIComponent(filename)}`
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`  ! could not fetch original (${res.status}): ${url}`)
      return null
    }
    return Buffer.from(await res.arrayBuffer())
  } catch (err) {
    console.warn(`  ! fetch failed: ${url} — ${(err as Error).message}`)
    return null
  }
}

async function main() {
  const payload = await getPayload({ config })
  const { docs, totalDocs } = await payload.find({
    collection: 'media',
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  })

  console.log(
    `Media docs: ${totalDocs}. Mode: ${APPLY ? 'APPLY' : 'DRY RUN'}${ONLY ? ` (only ${ONLY})` : ''}\n`,
  )

  let processed = 0
  let skipped = 0
  let failed = 0

  for (const doc of docs as any[]) {
    const filename: string = doc.filename
    if (ONLY && filename !== ONLY) continue

    if (thumbnailIsWebp(doc)) {
      skipped++
      console.log(`= skip (already webp): ${filename}`)
      continue
    }

    console.log(`${APPLY ? '→' : '·'} ${filename}  (${doc.mimeType}, ${doc.filesize} bytes)`)
    if (!APPLY) {
      processed++
      continue
    }

    const buf = await fetchOriginal(filename)
    if (!buf) {
      failed++
      continue
    }

    try {
      await payload.update({
        collection: 'media',
        id: doc.id,
        data: {},
        file: {
          data: buf,
          mimetype: doc.mimeType,
          name: filename,
          size: buf.length,
        },
        overrideAccess: true,
      })
      processed++
      console.log(`  ✓ regenerated`)
    } catch (err) {
      failed++
      console.warn(`  ! update failed: ${(err as Error).message}`)
    }
  }

  console.log(
    `\nDone. ${APPLY ? 'regenerated' : 'would regenerate'}: ${processed}, skipped (already webp): ${skipped}, failed: ${failed}`,
  )
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
