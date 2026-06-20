import { getCachedSettings, getProducts, getGlobal } from '@/lib/payload'
import { HomePageClient } from '@/components/home/HomePageClient'
import type { RawHomePage } from '@/lib/i18n/home-landing'

// Render fresh on every request so a CMS edit to the `home-page` global shows
// on the very next reload — no 60s ISR window where the public page serves the
// old copy while the admin live-preview already shows the new one. The cost is
// one cheap single-row global read per hit; the heavy catalogue query stays
// behind its own 60s data cache (getProducts), so this is a light SSR render.
export const dynamic = 'force-dynamic'

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
