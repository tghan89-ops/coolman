import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { getProductById } from '@/lib/payload'
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
  const [product, contractor] = await Promise.all([
    getProductById(id),
    getContractorSession(h),
  ])
  if (!product) notFound()

  const isLoggedIn = contractor !== null
  const emailVerified =
    contractor !== null && contractor.status === 'Active' && !!contractor.email_verified_at
  const tierDiscountPct = contractor?.tier_discount_pct ?? 0

  return (
    <ProductDetailClient
      initialData={product}
      isLoggedIn={isLoggedIn}
      emailVerified={emailVerified}
      tierDiscountPct={tierDiscountPct}
    />
  )
}
