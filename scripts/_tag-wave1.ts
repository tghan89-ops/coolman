/**
 * Wave 1: tag all clean single-axis SIZE families (from family-review/wave1-tags.json).
 * Data-only; the family switcher code is already live in prod. Reversible.
 *   npx tsx --env-file=.env.local scripts/_tag-wave1.ts
 *   REVERT=1 npx tsx --env-file=.env.local scripts/_tag-wave1.ts   # untag all Wave 1 SKUs
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'

const PLAN = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), '..', 'family-review', 'wave1-tags.json'), 'utf-8'),
) as Record<string, string[]>

const REVERT = process.env.REVERT === '1'

const run = async () => {
  const payload = await getPayload({ config })
  let ok = 0, missing: string[] = []

  for (const [code, skus] of Object.entries(PLAN)) {
    for (const sku of skus) {
      const res = await payload.update({
        collection: 'products',
        where: { sku: { equals: sku } },
        data: { family: REVERT ? null : code } as any,
      })
      if (res.docs.length === 1) ok++
      else missing.push(sku)
    }
  }

  console.log(`${REVERT ? 'Untagged' : 'Tagged'} ${ok} products across ${Object.keys(PLAN).length} families.`)
  if (missing.length) console.log('SKU NOT MATCHED (check exact sku):', missing.join(', '))

  if (!REVERT) {
    // Verify each family resolves to the expected member count.
    console.log('\nVERIFY:')
    for (const [code, skus] of Object.entries(PLAN)) {
      const r = await payload.find({
        collection: 'products',
        where: { family: { equals: code } },
        depth: 0, limit: 100,
      })
      const mark = r.totalDocs === skus.length ? 'OK ' : '!! '
      console.log(`  ${mark}${code.padEnd(14)} expected ${skus.length}, got ${r.totalDocs}`)
    }
  }
  process.exit(missing.length ? 1 : 0)
}
run().catch((e) => { console.error('FAILED:', e); process.exit(1) })
