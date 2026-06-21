/**
 * Wave 2 (grit) + Wave 3 (tooth / segment) + DSERIES (size) tagging.
 * Sets `family` and, where the family has a second axis, `variantValue` +
 * `variantLabel`. Keyed by product id (stable; avoids unicode-SKU mismatch).
 * Data-only; the axis-aware switcher code ships separately. Reversible.
 *
 *   npx tsx --env-file=.env.local scripts/_tag-wave23.ts
 *   REVERT=1 npx tsx --env-file=.env.local scripts/_tag-wave23.ts   # untag all
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'

type Row = {
  id: number
  sku: string
  family: string
  variantValue: number | null
  variantLabel: string | null
}

const PLAN = (
  JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), '..', 'family-review', 'wave23-tags.json'), 'utf-8'),
  ) as { members: Row[] }
).members

const REVERT = process.env.REVERT === '1'

const run = async () => {
  const payload = await getPayload({ config })
  let ok = 0
  const failed: Array<{ id: number; sku: string; reason: string }> = []

  for (const row of PLAN) {
    try {
      await payload.update({
        collection: 'products',
        id: String(row.id),
        data: REVERT
          ? { family: null, variantValue: null, variantLabel: null }
          : { family: row.family, variantValue: row.variantValue, variantLabel: row.variantLabel },
      } as any)
      ok++
    } catch (e) {
      failed.push({ id: row.id, sku: row.sku, reason: e instanceof Error ? e.message : String(e) })
    }
  }

  console.log(`${REVERT ? 'Untagged' : 'Tagged'} ${ok}/${PLAN.length} products.`)
  if (failed.length) {
    console.log('FAILED:')
    for (const f of failed) console.log(`  id=${f.id} ${f.sku} -> ${f.reason}`)
  }

  if (!REVERT) {
    // Verify each family resolves to the expected member count + variant ladder.
    const byFamily = new Map<string, Row[]>()
    for (const r of PLAN) {
      if (!byFamily.has(r.family)) byFamily.set(r.family, [])
      byFamily.get(r.family)!.push(r)
    }
    console.log('\nVERIFY:')
    for (const [fam, rows] of byFamily) {
      const res = await payload.find({
        collection: 'products',
        where: { family: { equals: fam } },
        sort: ['diameterMm', 'variantValue'],
        depth: 0,
        limit: 100,
      })
      const mark = res.totalDocs === rows.length ? 'OK ' : '!! '
      const ladder = res.docs
        .map((d: any) => `${d.diameterMm ?? '?'}mm${d.variantLabel ? `/${d.variantLabel}` : ''}`)
        .join(', ')
      console.log(`  ${mark}${fam.padEnd(10)} expected ${rows.length}, got ${res.totalDocs}  [${ladder}]`)
    }
  }
  process.exit(failed.length ? 1 : 0)
}
run().catch((e) => {
  console.error('FATAL:', e)
  process.exit(1)
})
