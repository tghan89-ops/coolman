import { getGlobal } from '@/lib/payload'
import { COPY } from '@/lib/i18n/copy'
import { ContactClient, type RawContactPage } from '@/components/pages/ContactClient'

export const revalidate = 60

export async function generateMetadata() {
  const meta = COPY.EN.seo.contact
  return {
    title: meta.title,
    description: meta.description,
  }
}

export default async function ContactPage() {
  // Settings are fetched once at the (frontend) layout and exposed through the
  // SettingsProvider; ContactClient reads them via useSettings(). No need for a
  // second fetch here.
  const contactPage = await getGlobal('contact-page')
  return <ContactClient initialData={contactPage as unknown as RawContactPage | null} />
}
