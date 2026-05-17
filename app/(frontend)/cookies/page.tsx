import { getGlobal } from '@/lib/payload'
import { COPY } from '@/lib/i18n/copy'
import { LegalPageClient } from '@/components/pages/LegalPageClient'

export const revalidate = 60

export async function generateMetadata() {
  const meta = COPY.EN.seo.cookies
  return {
    title: meta.title,
    description: meta.description,
  }
}

export default async function CookiesPage() {
  const settings = await getGlobal('settings', { overrideAccess: true })
  const legalEntityName =
    (settings as { legal_entity_name?: string | null } | null)?.legal_entity_name ||
    'Coolman Malaysia Sdn Bhd'
  return <LegalPageClient kind="cookies" legalEntityName={legalEntityName} />
}
