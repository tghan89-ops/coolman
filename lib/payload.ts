import config from '@payload-config'
import { getPayload } from 'payload'

async function getPayloadClient() {
  return getPayload({ config })
}

export async function getProducts(): Promise<any[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'products',
    limit: 200,
    sort: 'name',
  })
  return result.docs
}

export async function getProductById(id: string): Promise<any | null> {
  try {
    const payload = await getPayloadClient()
    const product = await payload.findByID({ collection: 'products', id })
    return product
  } catch {
    return null
  }
}

export async function filterProducts(params: {
  materials?: string[]
  applications?: string[]
  machinePower?: string[]
  category?: string
}): Promise<any[]> {
  const payload = await getPayloadClient()
  const where: Record<string, unknown> = {}

  if (params.category) {
    where.category = { equals: params.category }
  }
  if (params.materials?.length) {
    where.recommendedMaterials = { in: params.materials }
  }
  if (params.applications?.length) {
    where.applications = { in: params.applications }
  }
  if (params.machinePower?.length) {
    where.recommendedMachinePower = { in: params.machinePower }
  }

  const result = await payload.find({
    collection: 'products',
    where,
    limit: 200,
  })
  return result.docs
}

export async function getGlobal(slug: string): Promise<any> {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: slug as any })
}
