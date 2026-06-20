import { getCachedSettings, getProducts } from '@/lib/payload'
import { HomePageClient } from '@/components/home/HomePageClient'

export const revalidate = 60

export default async function HomePage() {
  // New transactional landing (June 2026). Copy lives in lib/i18n/home-landing.ts
  // (bilingual); the Products section is fed by the real catalogue so it stays
  // admin-editable — no hardcoded product list. Logged-out visitors see no
  // prices here (cards link through to the gated product page), so the slim
  // catalogue is safe to ship to the client.
  const [settings, products] = await Promise.all([
    getCachedSettings(),
    getProducts(),
  ])

  return <HomePageClient settings={settings ?? {}} products={products} />
}
