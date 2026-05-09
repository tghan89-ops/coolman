import { getPayload } from 'payload'
import config from '@payload-config'
import { products } from '../lib/data/products'

async function seed() {
  const payload = await getPayload({ config })

  console.log(`Seeding ${products.length} products...`)

  for (const product of products) {
    try {
      await payload.create({
        collection: 'products',
        data: {
          sku: product.sku,
          name: product.name,
          description: product.description,
          category: product.category,
          diameter: product.diameter,
          arborSize: product.arborSize,
          segmentHeight: product.segmentHeight,
          bondType: product.bondType,
          recommendedMaterials: product.recommendedMaterials,
          applications: product.applications,
          recommendedMachinePower: product.recommendedMachinePower,
          recommendedCuttingVolume: product.recommendedCuttingVolume,
          listPrice: product.price,
        },
      })
      console.log(`✓ Created: ${product.sku} — ${product.name}`)
    } catch (err) {
      console.error(`✗ Failed: ${product.sku}`, err)
    }
  }

  console.log('Done.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
