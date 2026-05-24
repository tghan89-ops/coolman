import { cache } from 'react'
import config from '@payload-config'
import { getPayload } from 'payload'

async function getPayloadClient() {
  return getPayload({ config })
}

// Raw row shape from the Payload `dealers` collection. Mirrors the snake_case
// field names on the collection. All fields except `id` are optional+nullable
// because that's what Payload can actually return for partially-filled admin
// rows; the runtime filter at the server boundary (in `app/(frontend)/
// brotherhood/page.tsx`) is what guarantees the trimmed `DealerRow` shape
// passed to the client component.
export type RawDealerRow = {
  id: string | number
  name?: string | null
  area?: string | null
  address?: string | null
  whatsapp_number?: string | null
  google_maps_query?: string | null
  operating_hours?: string | null
  languages?: string | null
  specialisations?: string | null
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

// Deduplicated within a single render pass (layout + page) so settings is
// only fetched from the DB once per request, regardless of how many server
// components call it.
export const getCachedSettings = cache(async () =>
  getGlobal('settings', { overrideAccess: true }),
)

export async function getGlobal(
  slug: string,
  opts?: { overrideAccess?: boolean },
): Promise<any> {
  try {
    const payload = await getPayloadClient()
    // `overrideAccess` lets public server pages read globals whose `access.read`
    // is restricted to admins (e.g. `settings`). The contact page needs this to
    // render the legal entity, WhatsApp number, address, and opening hours that
    // live on the Settings global. Existing callers omit the option and get the
    // default `false`, preserving previous behaviour.
    return await payload.findGlobal({
      slug: slug as any,
      overrideAccess: opts?.overrideAccess ?? false,
    })
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
      depth: 2,
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

// Public-facing dealer directory: only return active rows. Inactive dealers
// stay in /admin for archival but never render on /brotherhood.
export async function getActiveDealers(): Promise<RawDealerRow[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'dealers',
      where: { is_active: { equals: true } },
      sort: 'area,display_order,name',
      limit: 200,
    })
    // Payload's generated row type is an internal shape; cast at this single
    // boundary so the rest of the codebase consumes the honest snake_case
    // RawDealerRow contract.
    return result.docs as unknown as RawDealerRow[]
  } catch {
    return []
  }
}

// Raw row shape from the Payload `shibuya-machines` collection. Mirrors the
// snake_case fields on the collection. Optional+nullable everywhere except
// `id` for the same reason as RawDealerRow — Payload tolerates partial admin
// rows, and the runtime filter at the server boundary (in `app/(frontend)/
// shibuya/page.tsx`) is what guarantees the trimmed `ShibuyaMachine` shape
// passed to the client component.
export type RawShibuyaMachineRow = {
  id: string | number
  model_id?: string | null
  model_name?: string | null
  tagline?: string | null
  taglineBM?: string | null
  bond_match?: string | null
  bond_matchBM?: string | null
  description?: string | null
  descriptionBM?: string | null
  motor_power?: string | null
  max_diameter?: string | null
  weight?: string | null
  rpm_range?: string | null
  voltage?: string | null
  max_depth?: string | null
  feed_system?: string | null
  hole_runout?: string | null
  bit_pairing?: string | null
  stock_note?: string | null
  anchor?: string | null
  anchorBM?: string | null
  price?: string | null
  hero_image?: { url?: string | null; alt?: string | null } | string | number | null
  features?: Array<{ feature?: string | null; featureBM?: string | null }> | null
  display_order?: number | null
}

// Public-facing Shibuya machine roster: only return active rows, ordered by
// display_order. Inactive machines stay in /admin for archival but never
// render on /shibuya.
export async function getActiveShibuyaMachines(): Promise<RawShibuyaMachineRow[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'shibuya-machines',
      where: { is_active: { equals: true } },
      sort: 'display_order',
      limit: 50,
      depth: 1,
    })
    return result.docs as unknown as RawShibuyaMachineRow[]
  } catch {
    return []
  }
}

// Lightweight totalDocs probe used by the header to decide whether to surface
// the Field Notes nav link. The gate is `>= 3` — until at least three notes
// are published, the link stays hidden so the section doesn't ship empty.
// `limit: 0` keeps the query cheap; Payload still returns totalDocs.
export async function getPublishedPostCount(): Promise<number> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      limit: 0,
      depth: 0,
    })
    return result.totalDocs ?? 0
  } catch {
    return 0
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
