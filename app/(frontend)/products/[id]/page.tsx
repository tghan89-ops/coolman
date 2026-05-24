import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { getCachedSettings, getProductById } from '@/lib/payload'
import { ProductDetailClient } from '@/components/products/ProductDetailClient'
import { getContractorSession } from '@/lib/auth/contractor-session'

// Per-request render so we can show each contractor their own contract price.
export const dynamic = 'force-dynamic'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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
      isLoggedIn={isLoggedIn}
      emailVerified={emailVerified}
      tierDiscountPct={tierDiscountPct}
      ordersPaused={ordersPaused}
      whatsappNumber={whatsappNumber}
    />
  )
}
