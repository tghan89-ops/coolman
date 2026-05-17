import { getGlobal, getPublishedPosts } from '@/lib/payload'
import { ResourcesClient } from '@/components/pages/ResourcesClient'

export const revalidate = 60

export default async function ResourcesPage() {
  const [data, posts] = await Promise.all([
    getGlobal('resources-page'),
    getPublishedPosts(24),
  ])
  return <ResourcesClient initialData={data} posts={posts} />
}
