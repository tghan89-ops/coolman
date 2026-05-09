import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/payload'
import { ProductDetailClient } from '@/components/products/ProductDetailClient'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) notFound()
  return <ProductDetailClient initialData={product} />
}
