import { getGlobal } from '@/lib/payload'
import { COPY } from '@/lib/i18n/copy'
import { AboutClient } from '@/components/pages/AboutClient'

export const revalidate = 60

export async function generateMetadata() {
  const meta = COPY.EN.seo.about
  return {
    title: meta.title,
    description: meta.description,
  }
}

export default async function AboutPage() {
  const settings = await getGlobal('settings', { overrideAccess: true })
  const whatsappNumber =
    (settings as { whatsapp_number?: string | null } | null)?.whatsapp_number ||
    '+60126363156'
  return <AboutClient whatsappNumber={whatsappNumber} />
}
