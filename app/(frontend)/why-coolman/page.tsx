import { getGlobal } from '@/lib/payload'
import { WhyCoolmanClient } from '@/components/pages/WhyCoolmanClient'

export default async function WhyCoolmanPage() {
  const data = await getGlobal('why-coolman-page')
  return <WhyCoolmanClient initialData={data} />
}
