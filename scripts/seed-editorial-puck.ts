/**
 * Seed locked-editable Puck preview pages for the editorial routes, at <slug>-puck
 * (live routes untouched). Each page is one locked page-block seeded with its real
 * default copy. Extended wave by wave as pages are converted.
 *
 * SCRATCH ONLY:
 *   PAYLOAD_DB_PUSH=true tsx --env-file=.env.scratch scripts/seed-editorial-puck.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { pageBlocks } from '../puck/blocks/pages'

// slug -> { title, block type, optional content override }. Add an entry per
// converted page. `props` is merged over the block's defaultProps — used by the
// four legal pages, which share one generic LegalPage block but differ in copy.
const LEGAL_SHARED = {
  legalEntityName: 'Coolman Malaysia Sdn Bhd',
  draftBadge: 'Draft',
  draftBody:
    'The full text of this notice is being prepared with counsel. Until it is published, the trade desk can answer any specific question on the record. Reach us through the contact page.',
  contactLinkLabel: 'Contact',
}

const PAGES: {
  slug: string
  title: string
  block: keyof typeof pageBlocks
  props?: Record<string, unknown>
}[] = [
  { slug: 'career-puck', title: 'Career (Puck preview)', block: 'CareerPage' },
  { slug: 'about-puck', title: 'About (Puck preview)', block: 'AboutPage' },
  { slug: 'applications-puck', title: 'Applications (Puck preview)', block: 'ApplicationsPage' },
  { slug: 'resources-puck', title: 'Resources (Puck preview)', block: 'ResourcesPage' },
  { slug: 'trade-puck', title: 'Trade (Puck preview)', block: 'TradePage' },
  { slug: 'contact-puck', title: 'Contact (Puck preview)', block: 'ContactPage' },
  { slug: 'brotherhood-puck', title: 'Brotherhood (Puck preview)', block: 'BrotherhoodPage' },
  { slug: 'shibuya-puck', title: 'Shibuya (Puck preview)', block: 'ShibuyaPage' },
  { slug: 'heritage-puck', title: 'Heritage (Puck preview)', block: 'HeritagePage' },
  { slug: 'why-coolman-puck', title: 'Why Coolman (Puck preview)', block: 'WhyCoolmanPage' },
  {
    slug: 'cookies-puck',
    title: 'Cookie notice (Puck preview)',
    block: 'LegalPage',
    props: { ...LEGAL_SHARED, title: 'Cookie notice', lede: 'The cookies our site uses, what they do, and how to switch them off if you prefer.' },
  },
  {
    slug: 'terms-puck',
    title: 'Terms of sale (Puck preview)',
    block: 'LegalPage',
    props: { ...LEGAL_SHARED, title: 'Terms of sale', lede: 'The terms under which Coolman Malaysia Sdn Bhd sells diamond cutting tools to trade and Brotherhood customers in Malaysia.' },
  },
  {
    slug: 'privacy-puck',
    title: 'Privacy (Puck preview)',
    block: 'LegalPage',
    props: { ...LEGAL_SHARED, title: 'Privacy', lede: 'How Coolman handles the personal information of contractors, dealers and site visitors. Plain English. No surprises.' },
  },
  {
    slug: 'returns-warranty-puck',
    title: 'Returns and warranty (Puck preview)',
    block: 'LegalPage',
    props: { ...LEGAL_SHARED, title: 'Returns and warranty', lede: 'How to return a Coolman blade, what the warranty covers, and what to do if a blade fails before its rated life.' },
  },
]

let n = 0
const id = (p: string) => `${p}-${++n}`

async function main() {
  const payload = await getPayload({ config })
  for (const { slug, title, block, props } of PAGES) {
    const puckData = {
      root: { props: { title } },
      zones: {},
      content: [{ type: block, props: { id: id(slug), ...pageBlocks[block].defaultProps, ...(props ?? {}) } }],
    }
    const existing = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, overrideAccess: true })
    if (existing.docs[0]) {
      await payload.update({ collection: 'pages', id: existing.docs[0].id, overrideAccess: true, data: { status: 'published', puckData } as never })
      console.log(`Updated ${slug} -> http://localhost:3000/${slug}  (editor: /puck-editor/${existing.docs[0].id})`)
    } else {
      const doc = await payload.create({ collection: 'pages', overrideAccess: true, data: { title, slug, status: 'published', template: 'blank', puckData } as never })
      console.log(`Created ${slug} -> http://localhost:3000/${slug}  (editor: /puck-editor/${doc.id})`)
    }
  }
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
