/**
 * Tag the WALLSAW S-series as a clean single-axis SIZE family (WALLSAWS).
 * GH 2026-06-14: WSL800S and WSL800SE are 2 different blades — so the "S" blade
 * (800S + 1000S) is its own 2-size family; the SE/PE one-offs stay standalone.
 *   npx tsx --env-file=.env.local scripts/_tag-wallsaws.ts
 *   REVERT=1 ... to untag
 */
import { getPayload } from 'payload'
import config from '@payload-config'
const IDS = [153, 149] // WSL800S (800), WSL1000S (1000)
const REVERT = process.env.REVERT === '1'
const run = async () => {
  const payload = await getPayload({ config })
  for (const id of IDS) await payload.update({ collection: 'products', id: String(id), data: { family: REVERT ? null : 'WALLSAWS' } as any })
  console.log(`${REVERT ? 'Untagged' : 'Tagged'} ${IDS.length}.`)
  if (!REVERT) {
    const r = await payload.find({ collection: 'products', where: { family: { equals: 'WALLSAWS' } }, sort: 'diameterMm', depth: 0, limit: 50 })
    console.log('VERIFY WALLSAWS:', r.totalDocs, 'members:', r.docs.map((d:any)=>`${d.diameterMm}mm(${d.sku})`).join(', '))
  }
  process.exit(0)
}
run().catch(e=>{console.error(e);process.exit(1)})
