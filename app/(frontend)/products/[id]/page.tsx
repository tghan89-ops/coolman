import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { getCachedSettings, getProductById, getFamilyMembers } from '@/lib/payload'
import { ProductDetailClient } from '@/components/products/ProductDetailClient'
import { getContractorSession } from '@/lib/auth/contractor-session'
import { COPY } from '@/lib/i18n/copy'

// Per-request render so we can show each contractor their own contract price.
export const dynamic = 'force-dynamic'

// Per-product SEO: build a unique, keyworded title/description from the product's
// real fields (name + material + diameter) so every SKU is independently findable,
// instead of every product page sharing one generic title. Falls back to the
// generic productTemplate meta when the product can't be loaded.
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) {
    const meta = COPY.EN.seo.productTemplate
    return { title: meta.title, description: meta.description }
  }

  const name: string = typeof product.name === 'string' && product.name ? product.name : 'Coolman product'
  const diameter: string | undefined =
    typeof product.diameter === 'string' && product.diameter ? product.diameter : undefined
  const materials: string[] = []
  if (Array.isArray(product.materials)) {
    for (const m of product.materials) {
      if (m && typeof m === 'object' && 'name' in m && (m as { name?: unknown }).name) {
        materials.push(String((m as { name: unknown }).name))
      }
    }
  }
  const material = materials[0]
  const has = (s?: string) => !!s && name.toLowerCase().includes(s.toLowerCase())

  const titleCore = material && !has(material) ? `${name} for ${material}` : name
  const title = `${titleCore} · Coolman Malaysia`

  const description =
    `${name}${diameter && !has(diameter) ? `, ${diameter}` : ''}${material && !has(material) ? ` for ${material}` : ''}. ` +
    'Specs, application notes and dispatch from Selangor within 2 business days.'

  return { title, description }
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ size?: string; v?: string }>
}) {
  const { id } = await params
  const { size, v } = await searchParams
  const h = await headers()
  // `settings` is admin-restricted (see globals/Settings.ts). The public product
  // detail page needs to read `orders_paused` (kill switch — CLAUDE.md hard rule)
  // and `whatsapp_number` (the fallback contact when ordering is paused), so we
  // pass `overrideAccess: true` exactly as the contact page does.
  const [product, contractor, settings] = await Promise.all([
    getProductById(id),
    getContractorSession(h),
    getCachedSettings(),
  ])
  if (!product) notFound()

  // If this product is part of a size family, load all siblings (smallest
  // diameter first) so the page can render a size switcher. getFamilyMembers
  // returns [] when there's no family code, so familyMembers stays null and the
  // page behaves exactly as a standalone product. A blank initial-size means
  // the client defaults to this product's own size.
  const familyCode: string | null =
    typeof product.family === 'string' && product.family.trim() ? product.family.trim() : null
  const members = familyCode ? await getFamilyMembers(familyCode) : []
  const familyMembers = members.length > 1 ? members : null
  const initialSize: number | null =
    size != null && size !== '' && Number.isFinite(Number(size)) ? Number(size) : null
  const initialVariant: number | null =
    v != null && v !== '' && Number.isFinite(Number(v)) ? Number(v) : null

  const isLoggedIn = contractor !== null
  const emailVerified =
    contractor !== null && contractor.status === 'Active' && !!contractor.email_verified_at
  const tierDiscountPct = contractor?.tier_discount_pct ?? 0
  // Defensive coercions: settings may be null on a brand-new install, and the
  // boolean field can come back as null/undefined for the same reason. The
  // banner self-hides when isPaused is false, so a safe default is `false`.
  const ordersPaused: boolean = settings?.orders_paused === true
  const whatsappNumber: string =
    typeof settings?.whatsapp_number === 'string' ? settings.whatsapp_number : ''

  return (
    <ProductDetailClient
      initialData={product}
      familyMembers={familyMembers}
      initialSize={initialSize}
      initialVariant={initialVariant}
      isLoggedIn={isLoggedIn}
      emailVerified={emailVerified}
      tierDiscountPct={tierDiscountPct}
      ordersPaused={ordersPaused}
      whatsappNumber={whatsappNumber}
    />
  )
}
