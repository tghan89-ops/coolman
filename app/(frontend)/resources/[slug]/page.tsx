import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPublishedPostSlugs } from '@/lib/payload'
import { PostDetailClient } from '@/components/pages/PostDetailClient'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllPublishedPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  const title = post.seo?.metaTitle || post.title
  const description = post.seo?.metaDescription || post.excerpt
  return { title, description }
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()
  return <PostDetailClient post={post} />
}
