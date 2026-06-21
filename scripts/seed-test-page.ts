/**
 * Spike seed: creates a published Puck test page + seeds Navigation.
 * Run against the SCRATCH DB only:
 *   tsx --env-file=.env.scratch scripts/seed-test-page.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const puckData = {
  root: { props: { title: 'Spike test' } },
  zones: {},
  content: [
    { type: 'Hero', props: { id: 'h1', heading: 'Visual editing, on Coolman', sub: 'This page was built with drag-and-drop blocks.', ctaLabel: 'Contact us', ctaHref: '/contact', image: null, surface: 'navy' } },
    { type: 'Heading', props: { id: 'h2', text: 'What this proves', size: 'lg', color: 'navy', align: 'left' } },
    { type: 'Text', props: { id: 't1', text: 'Inline text, scale-step sizing, brand colours, and column slots — all on-brand.', size: 'md', color: 'ink', align: 'left' } },
    { type: 'Stats', props: { id: 's1', spacing: 'normal', items: [ { value: '247', label: 'SKUs in stock' }, { value: 'Since 2007', label: 'Serving contractors' }, { value: '500+', label: 'Contractors' }, { value: '2 days', label: 'Dispatch' } ] } },
    { type: 'CTABanner', props: { id: 'c1', heading: 'Ready to order?', ctaLabel: 'Get in touch', ctaHref: '/contact' } },
  ],
}

async function main() {
  const payload = await getPayload({ config })

  const existing = await payload.find({ collection: 'pages', where: { slug: { equals: 'spike-test' } }, limit: 1, overrideAccess: true })
  let id: string | number
  if (existing.docs[0]) {
    id = existing.docs[0].id
    await payload.update({ collection: 'pages', id, overrideAccess: true, data: { status: 'published', puckData } as never })
    console.log('Updated existing page', id)
  } else {
    const doc = await payload.create({ collection: 'pages', overrideAccess: true, data: { title: 'Spike test', slug: 'spike-test', status: 'published', template: 'landing', puckData } as never })
    id = doc.id
    console.log('Created page', id)
  }

  await payload.updateGlobal({
    slug: 'navigation',
    overrideAccess: true,
    data: {
      items: [
        { type: 'mega-products', label: 'Products' },
        { type: 'link', label: 'Shibuya', labelBM: 'Shibuya', linkType: 'internal', url: '/shibuya' },
        { type: 'link', label: 'Spike test', linkType: 'page', page: id },
        { type: 'link', label: 'Contact', linkType: 'internal', url: '/contact' },
      ],
    } as never,
  })
  console.log('Seeded navigation')

  console.log('Open: http://localhost:3000/spike-test  and editor: http://localhost:3000/puck-editor/' + id)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
