import { getGlobal, getPublishedPosts } from '@/lib/payload'
import { HomePageClient } from '@/components/home/HomePageClient'

export const revalidate = 60

export default async function HomePage() {
  const [settings, publishedPosts, homePageData] = await Promise.all([
    getGlobal('settings'),
    getPublishedPosts(3),
    getGlobal('home-page'),
  ])
  return (
    <HomePageClient
      settings={settings ?? {}}
      publishedPostsCount={publishedPosts.length}
      initialData={homePageData ?? null}
    />
  )
}
