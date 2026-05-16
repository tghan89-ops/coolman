import { getGlobal } from '@/lib/payload'
import { ApplicationsClient } from '@/components/pages/ApplicationsClient'

export const revalidate = 60

export default async function ApplicationsPage() {
  const data = await getGlobal('applications-page')
  return <ApplicationsClient initialData={data} />
}
