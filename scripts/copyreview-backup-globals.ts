/**
 * READ-ONLY. Snapshots every CMS global to a timestamped JSON backup before any
 * copy-review write touches production. Run:
 *   tsx --env-file=.env.local scripts/copyreview-backup-globals.ts
 *
 * Does NOT write to the database. Only reads (findGlobal) and writes local files.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { writeFileSync, mkdirSync } from 'fs'

const OUT = 'C:/Users/Tan Guan Han/Apps/Coolman/copy-review/cms-backup'
const SLUGS = [
  'home-page',
  'heritage-page',
  'why-coolman-page',
  'applications-page',
  'resources-page',
  'shibuya-page',
  'contact-page',
] as const

async function main() {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  mkdirSync(OUT, { recursive: true })
  const payload = await getPayload({ config })

  const summary: Record<string, string> = {}
  for (const slug of SLUGS) {
    try {
      const data = await payload.findGlobal({ slug: slug as any, depth: 0 })
      const path = `${OUT}/${slug}.${stamp}.json`
      writeFileSync(path, JSON.stringify(data, null, 2), 'utf8')
      const keys = Object.keys(data || {}).filter(
        (k) => !['id', 'createdAt', 'updatedAt', 'globalType'].includes(k),
      )
      // crude "is it populated" signal: any non-empty string value anywhere
      const blob = JSON.stringify(data)
      summary[slug] = `${keys.length} fields · ${blob.length} bytes`
    } catch (e: any) {
      summary[slug] = `ERROR: ${e?.message ?? e}`
    }
  }

  console.log('Backed up to:', OUT)
  console.log('Timestamp:', stamp)
  for (const [k, v] of Object.entries(summary)) console.log(`  ${k}: ${v}`)
  process.exit(0)
}

main().catch((e) => {
  console.error('FATAL:', e?.message ?? e)
  process.exit(1)
})
