import { getGlobal } from '@/lib/payload'
import { HomePageClient } from '@/components/home/HomePageClient'

export default async function HomePage() {
  const homeData = await getGlobal('home-page')
  return <HomePageClient initialData={homeData} />
}
