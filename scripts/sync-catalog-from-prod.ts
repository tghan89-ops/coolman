/**
 * Populate the SCRATCH DB with the real catalogue, mirrored from production's
 * PUBLIC API, so the /home-puck preview's products grid shows real data.
 *
 * - Taxonomy (categories / materials / applications / machineTiers) is mirrored
 *   first, building prod-id -> scratch-id maps.
 * - Products are then created with relation IDs remapped. Product images are set
 *   null (media files aren't synced — the home falls back to the product glyph).
 *
 * Idempotent guard: refuses to run if scratch already has products (avoids
 * duplicate-SKU errors on a re-run).
 *
 * SCRATCH ONLY — never against production:
 *   PAYLOAD_DB_PUSH=true tsx --env-file=.env.scratch scripts/sync-catalog-from-prod.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const PROD = 'https://demo.coolman.com.my/api'

async function fetchAll(collection: string): Promise<any[]> {
  const out: any[] = []
  let page = 1
  for (;;) {
    const res = await fetch(`${PROD}/${collection}?limit=100&depth=0&page=${page}`)
    if (!res.ok) throw new Error(`prod ${collection} -> HTTP ${res.status}`)
    const data = await res.json()
    out.push(...(data.docs || []))
    if (!data.hasNextPage) break
    page++
  }
  return out
}

const strip = (d: any) => {
  const { id, createdAt, updatedAt, ...rest } = d
  return rest
}

async function mirrorTaxonomy(payload: any, collection: string) {
  const docs = await fetchAll(collection)
  const map = new Map<number, number | string>()
  for (const d of docs) {
    try {
      const created = await payload.create({ collection, overrideAccess: true, data: strip(d) })
      map.set(d.id, created.id)
    } catch (e) {
      console.warn(`  ! ${collection} #${d.id} (${d.name}): ${(e as Error).message}`)
    }
  }
  console.log(`${collection}: ${map.size}/${docs.length} mirrored`)
  return map
}

async function main() {
  const payload = await getPayload({ config })

  const existing = await payload.count({ collection: 'products', overrideAccess: true })
  if (existing.totalDocs > 0) {
    console.log(`Scratch already has ${existing.totalDocs} products — skipping. (Clear them first to re-sync.)`)
    process.exit(0)
  }

  const catMap = await mirrorTaxonomy(payload, 'categories')
  const matMap = await mirrorTaxonomy(payload, 'materials')
  const appMap = await mirrorTaxonomy(payload, 'applications')
  const mtMap = await mirrorTaxonomy(payload, 'machineTiers')
  const defaultMt = [...mtMap.values()][0]

  const products = await fetchAll('products')
  let ok = 0
  let fail = 0
  for (const p of products) {
    const data: any = {
      sku: p.sku,
      name: p.name,
      nameBM: p.nameBM,
      description: p.description,
      descriptionBM: p.descriptionBM,
      listPrice: p.listPrice,
      diameter: p.diameter,
      diameterMm: p.diameterMm,
      family: p.family,
      variantValue: p.variantValue,
      variantLabel: p.variantLabel,
      arborSize: p.arborSize,
      segmentHeight: p.segmentHeight,
      bondType: p.bondType,
      maxRPM: p.maxRPM,
      youtubeUrl: p.youtubeUrl,
      category: catMap.get(p.category),
      machineTier: p.machineTier != null ? mtMap.get(p.machineTier) ?? defaultMt : defaultMt,
      materials: (p.materials || []).map((id: number) => matMap.get(id)).filter(Boolean),
      applications: (p.applications || []).map((id: number) => appMap.get(id)).filter(Boolean),
      image: null,
    }
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k])
    try {
      await payload.create({ collection: 'products', overrideAccess: true, data })
      ok++
    } catch (e) {
      fail++
      if (fail <= 8) console.warn(`  ! product ${p.sku}: ${(e as Error).message}`)
    }
  }
  console.log(`products: ${ok} created, ${fail} failed (of ${products.length})`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
