import { getGlobal } from '@/lib/payload'
import { WhyCoolmanClient } from '@/components/pages/WhyCoolmanClient'

export const revalidate = 60

export default async function WhyCoolmanPage() {
  const whyCoolmanData = await getGlobal('why-coolman-page')
  return <WhyCoolmanClient initialData={whyCoolmanData ?? null} />
}
