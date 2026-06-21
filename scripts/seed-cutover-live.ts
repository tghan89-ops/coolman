/**
 * FULL CUTOVER seed — publish the Puck versions of the home + main editorial
 * pages at their LIVE slugs, so the catch-all route ([...slug]) and the rewritten
 * home route render them. Legal pages are intentionally excluded (the Puck legal
 * block is a placeholder; the code legal routes stay).
 *
 * Idempotent: upserts by slug. Safe to re-run.
 *
 * Run ON THE DROPLET against prod:
 *   tsx --env-file=.env scripts/seed-cutover-live.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { homeBlocks } from '../puck/blocks/home'
import { pageBlocks } from '../puck/blocks/pages'

let n = 0
const bid = (p: string) => `${p}-${++n}`

// Home: composed of the locked Home* sections, seeded from their real defaults.
const homePuckData = {
  root: { props: { title: 'Coolman' } },
  zones: {},
  content: [
    { type: 'HomeHero', props: { id: bid('home-hero'), ...homeBlocks.HomeHero.defaultProps } },
    { type: 'HomeTrustBar', props: { id: bid('home-trust'), ...homeBlocks.HomeTrustBar.defaultProps } },
    { type: 'HomeWhy', props: { id: bid('home-why'), ...homeBlocks.HomeWhy.defaultProps } },
    { type: 'HomeProducts', props: { id: bid('home-products'), ...homeBlocks.HomeProducts.defaultProps } },
    { type: 'HomeShibuya', props: { id: bid('home-shibuya'), ...homeBlocks.HomeShibuya.defaultProps } },
    { type: 'HomeContact', props: { id: bid('home-contact'), ...homeBlocks.HomeContact.defaultProps } },
  ],
}

// Editorial pages at their LIVE slugs -> the matching locked page block.
const EDITORIAL: { slug: string; title: string; block: keyof typeof pageBlocks }[] = [
  { slug: 'about', title: 'About', block: 'AboutPage' },
  { slug: 'applications', title: 'Applications', block: 'ApplicationsPage' },
  { slug: 'resources', title: 'Resources', block: 'ResourcesPage' },
  { slug: 'trade', title: 'Trade', block: 'TradePage' },
  { slug: 'contact', title: 'Contact', block: 'ContactPage' },
  { slug: 'brotherhood', title: 'Brotherhood', block: 'BrotherhoodPage' },
  { slug: 'shibuya', title: 'Shibuya', block: 'ShibuyaPage' },
  { slug: 'heritage', title: 'Heritage', block: 'HeritagePage' },
  { slug: 'why-coolman', title: 'Why Coolman', block: 'WhyCoolmanPage' },
  { slug: 'career', title: 'Career', block: 'CareerPage' },
]

async function upsert(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string,
  title: string,
  puckData: unknown,
) {
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs[0]) {
    await payload.update({
      collection: 'pages',
      id: existing.docs[0].id,
      overrideAccess: true,
      data: { status: 'published', puckData } as never,
    })
    console.log(`updated  ${slug}  (id ${existing.docs[0].id})`)
  } else {
    const doc = await payload.create({
      collection: 'pages',
      overrideAccess: true,
      data: { title, slug, status: 'published', template: 'blank', puckData } as never,
    })
    console.log(`created  ${slug}  (id ${doc.id})`)
  }
}

async function main() {
  const payload = await getPayload({ config })
  await upsert(payload, 'home', 'Home', homePuckData)
  for (const { slug, title, block } of EDITORIAL) {
    const puckData = {
      root: { props: { title } },
      zones: {},
      content: [{ type: block, props: { id: bid(slug), ...pageBlocks[block].defaultProps } }],
    }
    await upsert(payload, slug, title, puckData)
  }
  console.log('CUTOVER_SEED_DONE')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
