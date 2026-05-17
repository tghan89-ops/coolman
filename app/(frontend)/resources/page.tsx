import { getGlobal } from '@/lib/payload'
import { ResourcesClient } from '@/components/pages/ResourcesClient'

export const revalidate = 60

export default async function ResourcesPage() {
  const data = await getGlobal('resources-page')
  return <ResourcesClient initialData={data} />
}
