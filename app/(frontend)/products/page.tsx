import { headers } from 'next/headers'
import { getProducts } from '@/lib/payload'
import { ProductsClient } from '@/components/products/ProductsClient'
import { diameterBucket } from '@/lib/products/diameter'
import { familyKey } from '@/lib/products/family'
import { getContractorSession } from '@/lib/auth/contractor-session'
import { COPY } from '@/lib/i18n/copy'
import type { FilterGroup } from '@/components/catalogue/FilterSidebar'

// Shape we actually touch when computing filter counts. Payload returns each
// relationship as an id (string|number) or, when depth>0, as the resolved doc
// (which is shaped roughly like { name: string }). Both shapes survive the
// `typeof m === 'object'` guard below.
type ProductFilterRow = {
  id: string | number
  family?: string | null
  category?: string | null
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

  // Filter chips count FAMILIES, not raw SKUs, so the numbers match the
  // collapsed grid (a 3-size family is one card and counts once). Group the
  // rows by family first, then aggregate each family's attributes once.
  const familyMap = new Map<string, ProductFilterRow[]>()
  for (const p of filterRows) {
    const k = familyKey({ id: p.id, family: p.family })
    if (!familyMap.has(k)) familyMap.set(k, [])
    familyMap.get(k)!.push(p)
  }
  const familyRows = Array.from(familyMap.values())

  // Category counts — the lead filter. Category is a required single-value
  // relationship and (verified against prod) no family code spans two
  // categories, so each family contributes its one category once. We still
  // union per family defensively, mirroring the material/application loops.
  const categoryCounts = new Map<string, number>()
  for (const members of familyRows) {
    const seen = new Set<string>()
    for (const p of members) {
      const name = p.category
      if (typeof name === 'string' && name && !seen.has(name)) {
        seen.add(name)
        categoryCounts.set(name, (categoryCounts.get(name) ?? 0) + 1)
      }
    }
  }

  // Material counts. A family contributes each distinct material once across
  // all of its sizes (materials are shared, but we union defensively).
  const materialCounts = new Map<string, number>()
  for (const members of familyRows) {
    const seen = new Set<string>()
    for (const p of members) {
      for (const m of Array.isArray(p.materials) ? p.materials : []) {
        const name = typeof m === 'object' && m !== null ? m.name : m
        if (typeof name === 'string' && name && !seen.has(name)) {
          seen.add(name)
          materialCounts.set(name, (materialCounts.get(name) ?? 0) + 1)
        }
      }
    }
  }

  // Application counts — same family-dedup shape as materials.
  const applicationCounts = new Map<string, number>()
  for (const members of familyRows) {
    const seen = new Set<string>()
    for (const p of members) {
      for (const a of Array.isArray(p.applications) ? p.applications : []) {
        const name = typeof a === 'object' && a !== null ? a.name : a
        if (typeof name === 'string' && name && !seen.has(name)) {
          seen.add(name)
          applicationCounts.set(name, (applicationCounts.get(name) ?? 0) + 1)
        }
      }
    }
  }

  // Diameter counts — a family spans diameters, so it counts once per distinct
  // bucket any of its sizes falls in (matches "show family if any size matches").
  const diameterCounts = new Map<string, number>()
  for (const members of familyRows) {
    const buckets = new Set<string>()
    for (const p of members) buckets.add(diameterBucket(p.diameterMm ?? null))
    for (const b of buckets) diameterCounts.set(b, (diameterCounts.get(b) ?? 0) + 1)
  }

  // We render the catalogue in the user's locale, but the URL doesn't carry
  // language — i18n is cookie-driven. For SSR we render the EN labels by
  // default; the client component re-renders with the active language on
  // hydration. The filter VALUES are always the canonical strings (material
  // names from Payload, bucket keys like "100-200") so they don't depend on
  // locale. Only the heading labels do.
  const t = COPY.EN.catalogueIntro.filters
  const diameterUnit = COPY.EN.catalogueIntro.filters.diameterUnit

  // Category leads the sidebar. Order by count desc (Diamond Blades, Core Bits,
  // …) so the biggest, most-likely buckets sit at the top; tiebreak by name.
  const categoryGroup: FilterGroup = {
    key: 'category',
    label: t.categoryLabel,
    options: Array.from(categoryCounts.entries())
      .sort(([a, ca], [b, cb]) => cb - ca || a.localeCompare(b))
      .map(([value, count]) => ({ value, label: value, count })),
  }

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

  // Decision-order funnel: what tool (Category) → what you're cutting (Material)
  // → how big (Diameter) → wet/dry & job refinement (Application, demoted last).
  const filterGroups: FilterGroup[] = [categoryGroup, materialGroup, diameterGroup, applicationGroup]

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
