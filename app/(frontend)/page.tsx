import { getCachedSettings, getProducts, getGlobal } from '@/lib/payload'
import { HomePageClient } from '@/components/home/HomePageClient'
import type { RawHomePage } from '@/lib/i18n/home-landing'

export const revalidate = 60

export default async function HomePage() {
  // Copy comes from the `home-page` CMS global (admin-editable); resolveHomeLanding
  // in HomePageClient overlays it on the code defaults in lib/i18n/home-landing.ts,
  // so a blank field or a missing global never blanks the page. Products are fed
  // by the real catalogue; logged-out visitors see no prices here.
  const [settings, products, homeData] = await Promise.all([
    getCachedSettings(),
    getProducts(),
    getGlobal('home-page'),
  ])

  return (
    <HomePageClient
      settings={settings ?? {}}
      products={products}
      initialData={(homeData as RawHomePage | null) ?? null}
    />
  )
}
