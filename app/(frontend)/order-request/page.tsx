import { getProductById } from '@/lib/payload'
import { OrderRequestForm, type OrderRequestProduct } from './OrderRequestForm'

export const dynamic = 'force-dynamic'

export default async function OrderRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>
}) {
  const { product: productId } = await searchParams

  let product: OrderRequestProduct | null = null
  if (productId) {
    const raw = await getProductById(productId)
    if (raw) {
      product = {
        id: raw.id,
        sku: raw.sku,
        name: raw.name,
        listPrice: raw.listPrice,
        diameter: raw.diameter,
      }
    }
  }

  return <OrderRequestForm product={product} productId={productId ?? null} />
}
