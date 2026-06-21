/**
 * Pilot tag: mark the 3 EcoSmart sizes as one family. Reversible — set family
 * back to null (or run with REVERT=1) to restore standalone products.
 *   npx tsx --env-file=.env.local scripts/_tag-ecosmart.ts
 *   REVERT=1 npx tsx --env-file=.env.local scripts/_tag-ecosmart.ts   # untag
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const SKUS = ['LWD300EN', 'LWD350EN', 'LWD400EN']
const REVERT = process.env.REVERT === '1'
const VALUE = REVERT ? null : 'ECOSMART'

const run = async () => {
  const payload = await getPayload({ config })
  const res = await payload.update({
    collection: 'products',
    where: { sku: { in: SKUS } },
    data: { family: VALUE } as any,
  })
  console.log(`${REVERT ? 'Untagged' : 'Tagged'} ${res.docs.length} products -> family=${VALUE}`)

  // Verify the grouping resolves exactly the 3 sizes, smallest first.
  const check = await payload.find({
    collection: 'products',
    where: { family: { equals: 'ECOSMART' } },
    sort: 'diameterMm',
    depth: 0,
    limit: 50,
  })
  console.log('Members now in ECOSMART:', check.docs.length)
  for (const p of check.docs as any[]) {
    console.log(`   ${p.sku}  ${p.diameter}  RM${p.listPrice}  (id ${p.id})`)
  }
  process.exit(0)
}
run().catch((e) => { console.error('FAILED:', e); process.exit(1) })
