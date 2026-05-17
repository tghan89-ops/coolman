import config from '@payload-config'
import { getPayload } from 'payload'

async function getPayloadClient() {
  return getPayload({ config })
}

export async function getProducts(): Promise<any[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      limit: 200,
      sort: 'name',
      depth: 2,
    })
    return result.docs
  } catch {
    return []
  }
}

export async function getProductById(id: string): Promise<any | null> {
  try {
    const payload = await getPayloadClient()
    const product = await payload.findByID({ collection: 'products', id, depth: 2 })
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
  try {
    const payload = await getPayloadClient()
    const where: Record<string, unknown> = {}

    if (params.category) {
      where.category = { equals: params.category }
    }
    if (params.materials?.length) {
      where.materials = { in: params.materials }
    }
    if (params.applications?.length) {
      where.applications = { in: params.applications }
    }
    if (params.machinePower?.length) {
      where.machineTier = { in: params.machinePower }
    }

    const result = await payload.find({
      collection: 'products',
      where,
      limit: 200,
    })
    return result.docs
  } catch {
    return []
  }
}

export async function getGlobal(slug: string): Promise<any> {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: slug as any })
  } catch {
    return null
  }
}

// Public-facing posts: only return published rows. Drafts are visible
// in /admin and live-preview, never on the public list.
export async function getPublishedPosts(limit = 24): Promise<any[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit,
      depth: 1,
    })
    return result.docs
  } catch {
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<any | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    })
    const post = result.docs[0]
    if (!post) return null
    // Drafts must never render on the public detail page.
    if ((post as any).status !== 'published') return null
    return post
  } catch {
    return null
  }
}

export async function getAllPublishedPostSlugs(): Promise<string[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      limit: 200,
      depth: 0,
    })
    return result.docs.map((d: any) => d.slug).filter(Boolean)
  } catch {
    return []
  }
}
