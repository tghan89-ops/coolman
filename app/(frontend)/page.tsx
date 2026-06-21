import { Render } from '@puckeditor/core/rsc'
import { getPayload } from 'payload'
import config from '@payload-config'
import puckConfig from '@/puck/config'
import { sanitizePuckData, type PuckData } from '@/puck/sanitize'
import { getCachedSettings, getProducts } from '@/lib/payload'
import { PublicLayout } from '@/components/layout/public-layout'
import { HomePageClient } from '@/components/home/HomePageClient'

// Render fresh each request: a CMS/visual-editor edit shows on the next reload.
// Catalogue stays behind its own 60s data cache (getProducts), so this is a
// light SSR render.
export const dynamic = 'force-dynamic'

async function getHomePage() {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'pages',
    where: { and: [{ slug: { equals: 'home' } }, { status: { equals: 'published' } }] },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return res.docs[0] ?? null
}

export default async function HomePage() {
  // Cut over to the visual (Puck) home when a published "home" page exists.
  // If it's ever missing or a transient DB error hits, fall back to the original
  // code home so the most important page can never go blank.
  const home = await getHomePage().catch(() => null)

  const [settings, products] = await Promise.all([getCachedSettings(), getProducts()])

  if (home) {
    const data = sanitizePuckData((home as { puckData?: PuckData }).puckData ?? { content: [] })
    if ((data.content ?? []).length > 0) {
      return (
        <PublicLayout>
          <Render config={puckConfig} data={data as never} metadata={{ products, settings }} />
        </PublicLayout>
      )
    }
  }

  // Fallback (only if the "home" Puck page is ever missing): original code-driven
  // home using its built-in copy defaults. The home-page global was retired with
  // the cutover, so no CMS read here.
  return <HomePageClient settings={settings ?? {}} products={products} initialData={null} />
}
