import { getGlobal } from '@/lib/payload'
import { HeritagePageClient } from '@/components/pages/HeritagePageClient'

export const revalidate = 60

export default async function HeritagePage() {
  const heritageData = await getGlobal('heritage-page')
  return <HeritagePageClient initialData={heritageData ?? null} />
}
