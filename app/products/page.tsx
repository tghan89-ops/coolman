import { getProducts } from '@/lib/payload'
import { ProductsClient } from '@/components/products/ProductsClient'

export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductsClient initialProducts={products} />
}
