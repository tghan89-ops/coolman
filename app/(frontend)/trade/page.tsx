import { getCachedSettings } from '@/lib/payload'
import { COPY } from '@/lib/i18n/copy'
import { TradeClient } from '@/components/pages/TradeClient'

export const revalidate = 60

export async function generateMetadata() {
  const meta = COPY.EN.seo.trade
  return {
    title: meta.title,
    description: meta.description,
  }
}

export default async function TradePage() {
  const settings = await getCachedSettings()
  const whatsappNumber =
    (settings as { whatsapp_number?: string | null } | null)?.whatsapp_number ||
    '+60126363156'
  return <TradeClient whatsappNumber={whatsappNumber} />
}
