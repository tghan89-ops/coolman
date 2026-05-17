import { getGlobal } from '@/lib/payload'
import { ContactClient } from '@/components/pages/ContactClient'

export const revalidate = 60

export default async function ContactPage() {
  // `settings` is admin-restricted (see globals/Settings.ts). The public contact
  // page still needs to read whatsapp_number, legal_entity_*, opening_hours, and
  // inventory_dispatch_cutoff — so we read it with `overrideAccess: true`.
  const [contactPage, settings] = await Promise.all([
    getGlobal('contact-page'),
    getGlobal('settings', { overrideAccess: true }),
  ])
  return <ContactClient initialData={contactPage} settings={settings} />
}
