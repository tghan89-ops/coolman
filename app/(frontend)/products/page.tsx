import { headers } from 'next/headers'
import { getProducts } from '@/lib/payload'
import { ProductsClient } from '@/components/products/ProductsClient'
import { getContractorSession } from '@/lib/auth/contractor-session'
import { resolvePriceDisplayMode } from '@/components/products/PriceDisplay'

// Per-request render: every contractor sees their own tier-adjusted prices.
// We trade the ISR cache for per-contractor pricing accuracy.
export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const h = await headers()
  const [products, contractor] = await Promise.all([
    getProducts(),
    getContractorSession(h),
  ])

  const priceMode = resolvePriceDisplayMode({
    isAuthenticated: contractor !== null,
    isContractor: contractor !== null,
    isVerified: contractor !== null && contractor.status === 'Active' && !!contractor.email_verified_at,
    tierDiscountPct: contractor?.tier_discount_pct ?? 0,
  })

  return (
    <ProductsClient
      initialProducts={products}
      priceMode={priceMode}
      tierDiscountPct={contractor?.tier_discount_pct ?? 0}
    />
  )
}
