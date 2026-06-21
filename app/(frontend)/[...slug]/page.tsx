import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Render } from '@puckeditor/core/rsc'
import { getPayload } from 'payload'
import config from '@payload-config'
import puckConfig from '@/puck/config'
import { PublicLayout } from '@/components/layout/public-layout'
import { getProducts, getCachedSettings } from '@/lib/payload'
import { sanitizePuckData, type PuckData } from '@/puck/sanitize'

/**
 * Catch-all renderer for Puck pages. This is the LOWEST-priority route in the
 * (frontend) group — Next resolves explicit folders (/products, /contact, …)
 * before this dynamic catch-all, so it only handles slugs that map to a
 * published Page and never shadows an existing route.
 *
 * Safety (plan reviews):
 *  - Unpublished / missing slug → 404 (notFound), never a blank screen.
 *  - Malformed/unknown blocks are filtered out before render, so one bad block
 *    can't break the page for visitors.
 */

export const revalidate = 60

async function getPublishedPage(slug: string) {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'pages',
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return res.docs[0] ?? null
}

const sanitize = sanitizePuckData

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getPublishedPage(slug.join('/')).catch(() => null)
  if (!page) return {}
  const seo = (page as { seo?: { metaTitle?: string; metaDescription?: string }; title?: string }).seo
  return {
    title: seo?.metaTitle || (page as { title?: string }).title || undefined,
    description: seo?.metaDescription || undefined,
  }
}

export default async function PuckPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  // Degrade safely on a transient DB error (matches lib/payload.ts pattern):
  // a blip becomes a clean 404, never a 500 over the whole catch-all surface.
  const page = await getPublishedPage(slug.join('/')).catch(() => null)
  if (!page) notFound()

  const data = sanitize((page as { puckData?: PuckData }).puckData ?? { content: [] })
  // Empty-publish guard belongs to the collection hook; defensively, an empty
  // page still renders chrome (header/footer) rather than crashing.

  // Live data for the locked read-only home blocks (products grid + contact
  // WhatsApp). Injected via Puck `metadata` so the blocks stay pure renders and
  // the catalogue is read-only (no editable product/price block). Both reads are
  // cached (getProducts 60s; settings cached), so this stays a light SSR render.
  const needsCatalogue = (data.content ?? []).some((b) => b.type === 'HomeProducts' || b.type === 'HomeContact')
  const [products, settings] = await Promise.all([
    needsCatalogue ? getProducts() : Promise.resolve([]),
    getCachedSettings(), // cheap, cached — page blocks (Career, etc.) read whatsapp/emails from here
  ])

  return (
    <PublicLayout>
      <Render config={puckConfig} data={data as never} metadata={{ products, settings }} />
    </PublicLayout>
  )
}
