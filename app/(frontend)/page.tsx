import { getGlobal, getPublishedPosts } from '@/lib/payload'
import { HomePageClient } from '@/components/home/HomePageClient'

export const revalidate = 60

export default async function HomePage() {
  const [settings, publishedPosts] = await Promise.all([
    getGlobal('settings'),
    getPublishedPosts(3),
  ])
  return (
    <HomePageClient
      settings={settings ?? {}}
      publishedPostsCount={publishedPosts.length}
    />
  )
}
