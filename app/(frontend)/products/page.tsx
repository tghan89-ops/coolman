import { headers } from 'next/headers'
import { getProducts } from '@/lib/payload'
import { ProductsClient } from '@/components/products/ProductsClient'
import { diameterBucket } from '@/lib/products/diameter'
import { getContractorSession } from '@/lib/auth/contractor-session'
import { COPY } from '@/lib/i18n/copy'
import type { FilterGroup } from '@/components/catalogue/FilterSidebar'

// Shape we actually touch when computing filter counts. Payload returns each
// relationship as an id (string|number) or, when depth>0, as the resolved doc
// (which is shaped roughly like { name: string }). Both shapes survive the
// `typeof m === 'object'` guard below.
type ProductFilterRow = {
  materials?: Array<{ name?: string | null } | string | number | null> | null
  applications?: Array<{ name?: string | null } | string | number | null> | null
  diameterMm?: number | null
}

// Per-request render: every contractor sees their own tier-adjusted prices.
// We trade the ISR cache for per-contractor pricing accuracy.
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const meta = COPY.EN.seo.catalogue
  return {
    title: meta.title,
    description: meta.description,
  }
}

// Diameter buckets are 100mm increments from 100mm to 900mm. Anything outside
// that range (or with no diameterMm value) falls into the 'other' bucket. The
// raw diameter spread is 100–600mm in current seed data, so the upper end
// gives headroom for new SKUs without code changes. Bucket boundaries are
// the same on the server (here) and the client (diameterBucket in
// ProductsClient.tsx) — both must agree byte-for-byte. See LEARNINGS.md
// "Frontend-editability exceptions" for the justification.
const DIAMETER_BUCKETS = [
  '100-200',
  '200-300',
  '300-400',
  '400-500',
  '500-600',
  '600-700',
  '700-800',
  '800-900',
] as const

function countBy<T>(list: T[], pick: (item: T) => string | null | undefined): Map<string, number> {
  const out = new Map<string, number>()
  for (const item of list) {
    const key = pick(item)
    if (!key) continue
    out.set(key, (out.get(key) ?? 0) + 1)
  }
  return out
}

export default async function ProductsPage() {
  const h = await headers()
  const [products, contractor] = await Promise.all([
    getProducts(),
    getContractorSession(h),
  ])

  const isLoggedIn = contractor !== null
  const emailVerified =
    contractor !== null && contractor.status === 'Active' && !!contractor.email_verified_at
  const tierDiscountPct = contractor?.tier_discount_pct ?? 0

  // Compute filter group counts from the FULL product list (not the filtered
  // view). This is the simpler choice: filter chips show "how many SKUs match
  // this option overall," not "how many would be left if I tick this." Trade-
  // off documented in BRIEF.md filter-count behaviour note. The opposite
  // (live recompute on every toggle) is a Phase C-plus refinement.

  const filterRows = products as unknown as ProductFilterRow[]

  // Material counts. Each product can have multiple materials; count each
  // distinct material name once per product.
  const materialCounts = new Map<string, number>()
  for (const p of filterRows) {
    const mats = Array.isArray(p.materials) ? p.materials : []
    const seen = new Set<string>()
    for (const m of mats) {
      const name = typeof m === 'object' && m !== null ? m.name : m
      if (typeof name === 'string' && name && !seen.has(name)) {
        seen.add(name)
        materialCounts.set(name, (materialCounts.get(name) ?? 0) + 1)
      }
    }
  }

  // Application counts — same shape as materials.
  const applicationCounts = new Map<string, number>()
  for (const p of filterRows) {
    const apps = Array.isArray(p.applications) ? p.applications : []
    const seen = new Set<string>()
    for (const a of apps) {
      const name = typeof a === 'object' && a !== null ? a.name : a
      if (typeof name === 'string' && name && !seen.has(name)) {
        seen.add(name)
        applicationCounts.set(name, (applicationCounts.get(name) ?? 0) + 1)
      }
    }
  }

  // Diameter counts — each product has exactly one diameterMm, so this is a
  // straight count-by-bucket.
  const diameterCounts = countBy(filterRows, (p) => diameterBucket(p.diameterMm ?? null))

  // We render the catalogue in the user's locale, but the URL doesn't carry
  // language — i18n is cookie-driven. For SSR we render the EN labels by
  // default; the client component re-renders with the active language on
  // hydration. The filter VALUES are always the canonical strings (material
  // names from Payload, bucket keys like "100-200") so they don't depend on
  // locale. Only the heading labels do.
  const t = COPY.EN.catalogueIntro.filters
  const diameterUnit = COPY.EN.catalogueIntro.filters.diameterUnit

  const materialGroup: FilterGroup = {
    key: 'material',
    label: t.materialLabel,
    options: Array.from(materialCounts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([value, count]) => ({ value, label: value, count })),
  }

  const applicationGroup: FilterGroup = {
    key: 'application',
    label: t.applicationLabel,
    options: Array.from(applicationCounts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([value, count]) => ({ value, label: value, count })),
  }

  const diameterGroup: FilterGroup = {
    key: 'diameter',
    label: t.diameterLabel,
    options: DIAMETER_BUCKETS.flatMap((bucket) => {
      const count = diameterCounts.get(bucket) ?? 0
      if (count === 0) return []
      const [from, to] = bucket.split('-')
      return [{
        value: bucket,
        label: `${from}–${to}${diameterUnit}`,
        count,
      }]
    }),
  }

  // Tack on "Other" only if at least one SKU is unbucketed — keeps the chip
  // list short and honest.
  const otherCount = diameterCounts.get('other') ?? 0
  if (otherCount > 0) {
    diameterGroup.options.push({ value: 'other', label: 'Other', count: otherCount })
  }

  const filterGroups: FilterGroup[] = [materialGroup, applicationGroup, diameterGroup]

  return (
    <ProductsClient
      initialProducts={products}
      filterGroups={filterGroups}
      isLoggedIn={isLoggedIn}
      emailVerified={emailVerified}
      tierDiscountPct={tierDiscountPct}
    />
  )
}
