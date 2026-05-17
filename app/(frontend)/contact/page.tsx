import { getGlobal } from '@/lib/payload'
import {
  ContactClient,
  type RawContactPage,
  type RawSettings,
} from '@/components/pages/ContactClient'

export const revalidate = 60

export default async function ContactPage() {
  // `settings` is admin-restricted (see globals/Settings.ts). The public contact
  // page still needs to read whatsapp_number, legal_entity_*, opening_hours, and
  // inventory_dispatch_cutoff — so we read it with `overrideAccess: true`.
  const [contactPage, settings] = await Promise.all([
    getGlobal('contact-page'),
    getGlobal('settings', { overrideAccess: true }),
  ])
  // Cast at this single server boundary. Payload's generated global types are
  // an internal shape; we narrow to the honest, minimal `RawContactPage` /
  // `RawSettings` contracts the client component actually consumes (mirrors
  // the brotherhood + shibuya pages' pattern with `RawDealerRow` /
  // `RawShibuyaMachineRow`).
  return (
    <ContactClient
      initialData={contactPage as unknown as RawContactPage | null}
      settings={settings as unknown as RawSettings | null}
    />
  )
}
