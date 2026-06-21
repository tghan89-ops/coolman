/**
 * Tag the WALLSAW P-series as a clean single-axis SIZE family (WALLSAWP).
 * One real blade per diameter (GH 2026-06-14: WSL700P is the real 700mm; the
 * PCS/PDA SKUs stay standalone). Data-only, reversible.
 *   npx tsx --env-file=.env.local scripts/_tag-wallsawp.ts
 *   REVERT=1 npx tsx --env-file=.env.local scripts/_tag-wallsawp.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'
const IDS = [158, 157, 152, 151, 148, 147] // WSL600P,700P,800P,900P,1000P,1600P
const REVERT = process.env.REVERT === '1'
const run = async () => {
  const payload = await getPayload({ config })
  let ok = 0
  for (const id of IDS) {
    await payload.update({ collection: 'products', id: String(id), data: { family: REVERT ? null : 'WALLSAWP' } as any })
    ok++
  }
  console.log(`${REVERT ? 'Untagged' : 'Tagged'} ${ok}/${IDS.length}.`)
  if (!REVERT) {
    const r = await payload.find({ collection: 'products', where: { family: { equals: 'WALLSAWP' } }, sort: 'diameterMm', depth: 0, limit: 50 })
    console.log('VERIFY WALLSAWP:', r.totalDocs, 'members:', r.docs.map((d:any)=>`${d.diameterMm}mm(${d.sku})`).join(', '))
  }
  process.exit(0)
}
run().catch(e=>{console.error(e);process.exit(1)})
