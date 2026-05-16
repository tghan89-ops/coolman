import { getGlobal } from '@/lib/payload'
import { ApplicationsClient } from '@/components/pages/ApplicationsClient'

export default async function ApplicationsPage() {
  const data = await getGlobal('applications-page')
  return <ApplicationsClient initialData={data} />
}
