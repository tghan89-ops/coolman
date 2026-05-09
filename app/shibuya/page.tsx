import { getGlobal } from '@/lib/payload'
import { ShibuyaClient } from '@/components/pages/ShibuyaClient'

export default async function ShibuyaPage() {
  const shibuyaData = await getGlobal('shibuya-page')
  return <ShibuyaClient initialData={shibuyaData} />
}
