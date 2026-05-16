import { getProductById } from '@/lib/payload'
import { OrderRequestForm, type OrderRequestProduct } from './OrderRequestForm'
import { parseInitialQuantity } from './parse-qty'

export const dynamic = 'force-dynamic'

export default async function OrderRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; qty?: string }>
}) {
  const { product: productId, qty } = await searchParams
  const initialQuantity = parseInitialQuantity(qty)

  let product: OrderRequestProduct | null = null
  if (productId) {
    const raw = await getProductById(productId)
    if (raw) {
      const imageUrl: string | null =
        raw.image && typeof raw.image === 'object' && typeof raw.image.url === 'string'
          ? raw.image.url
          : null
      product = {
        id: raw.id,
        sku: raw.sku,
        name: raw.name,
        listPrice: raw.listPrice,
        diameter: raw.diameter,
        imageUrl,
      }
    }
  }

  return (
    <OrderRequestForm
      product={product}
      productId={productId ?? null}
      initialQuantity={initialQuantity}
    />
  )
}
