import { cache } from 'react'
import { unstable_cache } from 'next/cache'
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

// Slim catalogue row — only the fields the grid + filters actually read.
// Mapping to this shape (instead of caching raw depth-2 docs) is what keeps the
// cached value small enough to store. Caching the full 200×depth-2 docs blew
// past Vercel's ~2MB data-cache item limit, so the cache SET failed silently
// ("Failed to set Next.js data cache") on every request — meaning the heavy
// query re-ran every hit and /products stayed ~5s. Burned 2026-05-30.
export type SlimProduct = {
  id: string | number
  name: string
  sku: string | null
  // The product's single category name (e.g. "Core Bits"). Required relationship
  // on every product, so depth:1 resolves the name. Carried on the slim row so
  // the catalogue can lead with a Category filter and so free-text search can
  // match category terms ("diamond blades"). One short string per row — trivial
  // cache-size impact. Added 2026-06-14 (filter revamp wave 1).
  category: string | null
  listPrice: number
  diameter: string | null
  diameterMm: number | null
  bondType: string | null
  family: string | null
  // Second switcher axis (tooth/grit/segment). Carried on the slim catalogue row
  // so groupByFamily can count distinct primary-axis values for variant families.
  variantValue: number | null
  materials: Array<{ name: string }>
  applications: Array<{ name: string }>
  image: { url: string } | null
}

// A populated relationship is an object with a `name`; an unpopulated one is a
// bare id (string|number). We only ever cache the name.
function relationName(r: unknown): string | null {
  if (r && typeof r === 'object' && 'name' in r) {
    const n = (r as { name?: unknown }).name
    return typeof n === 'string' && n ? n : null
  }
  return null
}

// Grid cards display at ~175–290px, so they should pull the small pre-baked
// variant Payload already generates at upload — NOT the up-to-2000px master.
// Using the master made the catalogue download megabytes of images per visit
// (a 1.26MB PNG master vs its 244KB/333px thumbnail; a 73KB webp master vs its
// 21KB/400px thumbnail). Prefer thumbnail → card → master. Burned 2026-05-30.
function gridImageUrl(img: any): string | null {
  if (!img || typeof img !== 'object') return null
  const sizes = img.sizes ?? {}
  const thumb = sizes.thumbnail?.url
  const card = sizes.card?.url
  if (typeof thumb === 'string' && thumb) return thumb
  if (typeof card === 'string' && card) return card
  return typeof img.url === 'string' ? img.url : null
}

function slimProduct(p: any): SlimProduct {
  const mats = Array.isArray(p?.materials) ? p.materials : []
  const apps = Array.isArray(p?.applications) ? p.applications : []
  const imageUrl = gridImageUrl(p?.image)
  return {
    id: p.id,
    name: typeof p?.name === 'string' ? p.name : '',
    sku: typeof p?.sku === 'string' ? p.sku : null,
    category: relationName(p?.category),
    listPrice: typeof p?.listPrice === 'number' ? p.listPrice : 0,
    diameter: typeof p?.diameter === 'string' ? p.diameter : null,
    diameterMm: typeof p?.diameterMm === 'number' ? p.diameterMm : null,
    bondType: typeof p?.bondType === 'string' ? p.bondType : null,
    family: typeof p?.family === 'string' && p.family.trim() ? p.family.trim() : null,
    variantValue: typeof p?.variantValue === 'number' ? p.variantValue : null,
    materials: mats.map(relationName).filter((n: string | null): n is string => !!n).map((name: string) => ({ name })),
    applications: apps.map(relationName).filter((n: string | null): n is string => !!n).map((name: string) => ({ name })),
    image: imageUrl ? { url: imageUrl } : null,
  }
}

// The full catalogue is identical for every visitor — only the per-contractor
// discount math differs, and that runs client-side in the browser. So we cache
// a slim catalogue for 60s instead of re-querying Postgres on every Products
// page hit. The Products page itself is `force-dynamic` (for per-contractor
// pricing), which disables the route cache, but this data-cache layer still
// applies. `depth: 1` is enough to populate the material/application names and
// the image URL (we don't need relations-of-relations). Admin edits to a
// product/price/stock surface within ~60s; revalidate the 'products' tag to
// flush sooner. Errors are NOT cached: the find throws out of the cached fn and
// we fall back to [] below, so a transient DB blip doesn't pin an empty
// catalogue for 60s.
const getProductsCached = unstable_cache(
  async (): Promise<SlimProduct[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      // 274 products today; 400 gives headroom so the whole catalogue loads and
      // families collapse correctly regardless of name-sort position. The cached
      // value is the slim shape (~150 bytes/row), so 400 rows is well under
      // Vercel's ~2MB data-cache item limit.
      limit: 400,
      sort: 'name',
      depth: 1,
    })
    return result.docs.map(slimProduct)
  },
  ['catalogue-products'],
  { revalidate: 60, tags: ['products'] },
)

export async function getProducts(): Promise<SlimProduct[]> {
  try {
    return await getProductsCached()
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

// All sizes that share a family code, smallest diameter first. Returned at the
// same depth (2) as getProductById so the size switcher can render any sibling's
// full specs, price, and image without a second fetch. Returns [] on error or
// when `family` is blank, so callers can treat "no family" and "lookup failed"
// identically (the product page falls back to the single product either way).
export async function getFamilyMembers(family: string): Promise<any[]> {
  const fam = typeof family === 'string' ? family.trim() : ''
  if (!fam) return []
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      where: { family: { equals: fam } },
      // Sort by size first, then the second axis (tooth/grit/segment) so pills
      // read smallest→largest on both rows. For pure size families diameterMm is
      // unique, so the variantValue tiebreak is a harmless no-op.
      sort: ['diameterMm', 'variantValue'],
      depth: 2,
      limit: 50,
    })
    return result.docs
  } catch (e) {
    // A failure here silently degrades to a standalone product (no switcher),
    // which is the safe fallback — but log it so the cause is visible in prod.
    console.error('[getFamilyMembers] failed for family:', fam, e)
    return []
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
