import { getGlobal } from '@/lib/payload'
import { ContactClient } from '@/components/pages/ContactClient'

export default async function ContactPage() {
  const data = await getGlobal('contact-page')
  return <ContactClient initialData={data} />
}
