/**
 * Phase 6 — rebuild the live home as a Puck page at slug /home-puck (preview).
 * The live home route (/) is untouched; this is a side-by-side comparison page.
 *
 * Run against the SCRATCH DB ONLY:
 *   PAYLOAD_DB_PUSH=true tsx --env-file=.env.scratch scripts/seed-home-puck.ts
 *
 * Fidelity notes (palette limits — see report to GH):
 *  - Hero is composed from Columns + Heading + Stats + Image, NOT the Puck "Hero"
 *    block, because that block renders Fraunces (banned on the home surface).
 *  - The live PRODUCTS grid is live catalogue data + barred from Puck by the
 *    two-tier rule, so it is represented here by 3 static category cards + a CTA
 *    into the real /products page.
 *  - The live CONTACT form is interactive (no form block exists), so it is
 *    represented by a CTA band into /contact.
 *  - The Shibuya band stays navy; bullets/stats are rendered as white Text
 *    (the Stats/Checklist blocks hardcode dark text, invisible on navy).
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { homeBlocks } from '../puck/blocks/home'

let n = 0
const id = (p: string) => `${p}-${++n}`

// High-fidelity locked-layout home: each section is the real markup, seeded with
// its real default copy (DRY — pulled from the block defaults). Products grid +
// contact form are intentionally NOT here yet (live data + two-tier ratification).
const puckData = {
  root: { props: { title: 'Coolman — home (Puck preview)' } },
  zones: {},
  content: [
    { type: 'HomeHero', props: { id: id('home-hero'), ...homeBlocks.HomeHero.defaultProps } },
    { type: 'HomeTrustBar', props: { id: id('home-trust'), ...homeBlocks.HomeTrustBar.defaultProps } },
    { type: 'HomeWhy', props: { id: id('home-why'), ...homeBlocks.HomeWhy.defaultProps } },
    { type: 'HomeProducts', props: { id: id('home-products'), ...homeBlocks.HomeProducts.defaultProps } },
    { type: 'HomeShibuya', props: { id: id('home-shibuya'), ...homeBlocks.HomeShibuya.defaultProps } },
    { type: 'HomeContact', props: { id: id('home-contact'), ...homeBlocks.HomeContact.defaultProps } },
  ],
}

const _legacyContent = {
  content: [
    // ---------- 1. HERO (2-col: copy + stats left, image right) ----------
    {
      type: 'Columns',
      props: {
        id: id('hero-cols'),
        layout: '7-5',
        spacing: 'loose',
        col1: [
          { type: 'Text', props: { id: id('hero-eyebrow'), text: 'DIAMOND TOOLS · SELANGOR · SINCE 2007', size: 'sm', color: 'accent', align: 'left' } },
          { type: 'Heading', props: { id: id('hero-h'), text: 'THE RIGHT BLADE FOR EVERY CUT', size: '3xl', color: 'navy', align: 'left' } },
          { type: 'Text', props: { id: id('hero-lede'), text: 'Blades, core bits and cutting systems engineered for Malaysian rock, rebar and schedule. Tell us the job — we send the spec and the price.', size: 'lg', color: 'ink-muted', align: 'left' } },
          { type: 'Button', props: { id: id('hero-cta1'), label: 'Browse products', href: '/products', variant: 'primary', align: 'left' } },
          { type: 'Button', props: { id: id('hero-cta2'), label: 'Speak to engineering', href: '/contact', variant: 'outline', align: 'left' } },
          { type: 'Stats', props: { id: id('hero-stats'), spacing: 'normal', items: [
            { value: '2007', label: 'Cutting since' },
            { value: '247', label: 'SKUs in stock' },
            { value: '2014', label: 'Shibuya partner' },
            { value: '2 days', label: 'Typical dispatch' },
          ] } },
        ],
        col2: [
          { type: 'Image', props: { id: id('hero-img'), image: { url: '/images/hero-blade.jpg', alt: 'Diamond cutting blade' }, size: '100', align: 'center', caption: '' } },
        ],
        col3: [],
      },
    },

    // ---------- 2. TRUST BAR ----------
    {
      type: 'Section',
      props: {
        id: id('trust-sec'),
        surface: 'paper',
        spacing: 'tight',
        content: [
          { type: 'Checklist', props: { id: id('trust-list'), columns: '2', items: [
            { text: 'Engineered in Selangor' },
            { text: 'Shibuya Japan distributor' },
            { text: 'WhatsApp tech support' },
            { text: 'Trade pricing for contractors' },
            { text: 'Dispatch within 2 business days' },
          ] } },
        ],
      },
    },

    // ---------- 3. WHY COOLMAN (eyebrow + heading + 3 numbered features) ----------
    { type: 'Text', props: { id: id('why-eyebrow'), text: 'WHY COOLMAN', size: 'sm', color: 'accent', align: 'left' } },
    { type: 'Heading', props: { id: id('why-h'), text: 'BUILT FOR THE MALAYSIAN JOB SITE', size: '2xl', color: 'navy', align: 'left' } },
    {
      type: 'Columns',
      props: {
        id: id('why-cols'),
        layout: '4-4-4',
        spacing: 'normal',
        col1: [ { type: 'Feature', props: { id: id('why-f1'), eyebrow: '01', heading: 'Engineered for the rock here', body: 'Tested on Malaysian aggregate, rebar and tropical concrete — not a European catalogue. If it cuts here, it cuts anywhere.', align: 'left' } } ],
        col2: [ { type: 'Feature', props: { id: id('why-f2'), eyebrow: '02', heading: 'The engineering desk answers', body: "Send the cut on WhatsApp. Alan's desk replies with the right spec — direct, with no salesman in between.", align: 'left' } } ],
        col3: [ { type: 'Feature', props: { id: id('why-f3'), eyebrow: '03', heading: 'Order direct, see the price', body: 'Trade accounts get tier pricing and reorder history. The effective price shows before you submit — never a surprise invoice.', align: 'left' } } ],
      },
    },

    // ---------- 4. PRODUCTS (catalogue is two-tier-barred → static range cards + CTA) ----------
    {
      type: 'Section',
      props: {
        id: id('prod-sec'),
        surface: 'paper',
        spacing: 'normal',
        content: [
          { type: 'Text', props: { id: id('prod-eyebrow'), text: 'PRODUCT RANGE', size: 'sm', color: 'accent', align: 'left' } },
          { type: 'Heading', props: { id: id('prod-h'), text: 'TOOLS FOR EVERY CUT', size: '2xl', color: 'navy', align: 'left' } },
          {
            type: 'Columns',
            props: {
              id: id('prod-cols'),
              layout: '4-4-4',
              spacing: 'normal',
              col1: [ { type: 'Card', props: { id: id('prod-c1'), image: null, heading: 'Diamond blades', body: 'Wet and dry blades for concrete, granite, asphalt and rebar.', ctaLabel: 'View range', ctaHref: '/products' } } ],
              col2: [ { type: 'Card', props: { id: id('prod-c2'), image: null, heading: 'Core drilling — Shibuya', body: 'Japanese core-drilling machines and bits, 52mm to 600mm.', ctaLabel: 'View range', ctaHref: '/products' } } ],
              col3: [ { type: 'Card', props: { id: id('prod-c3'), image: null, heading: 'Grinding & polishing', body: 'Cup wheels, segments and polishing pads for floor prep.', ctaLabel: 'View range', ctaHref: '/products' } } ],
            },
          },
          { type: 'Button', props: { id: id('prod-cta'), label: 'Browse the full catalogue', href: '/products', variant: 'primary', align: 'center' } },
        ],
      },
    },

    // ---------- 5. SHIBUYA BAND (navy) ----------
    {
      type: 'Section',
      props: {
        id: id('shib-sec'),
        surface: 'navy',
        spacing: 'loose',
        content: [
          {
            type: 'Columns',
            props: {
              id: id('shib-cols'),
              layout: '7-5',
              spacing: 'normal',
              col1: [
                { type: 'Text', props: { id: id('shib-eyebrow'), text: 'OFFICIAL MALAYSIA DISTRIBUTOR · SINCE 2014', size: 'sm', color: 'accent', align: 'left' } },
                { type: 'Heading', props: { id: id('shib-h'), text: 'SHIBUYA CORE DRILLING MACHINES', size: '2xl', color: 'white', align: 'left' } },
                { type: 'Text', props: { id: id('shib-lede'), text: "Japan's most trusted core-drilling technology, backed by Coolman's training, service and spare-part stock here in Malaysia.", size: 'lg', color: 'white', align: 'left' } },
                { type: 'Text', props: { id: id('shib-bullets'), text: '• Rated 52mm to 600mm core diameters\n• Reinforced concrete & post-tension rated\n• Operator training & on-site demo\n• Spare parts stocked locally', size: 'md', color: 'white', align: 'left' } },
                { type: 'Button', props: { id: id('shib-cta'), label: 'Request a demo', href: '/contact', variant: 'primary', align: 'left' } },
              ],
              col2: [
                { type: 'Text', props: { id: id('shib-stats'), text: '600mm — Max core size\n52mm — Min core size\n2014 — Distributor since\nMY — Local service', size: 'md', color: 'white', align: 'left' } },
                { type: 'Text', props: { id: id('shib-tags'), text: 'High-rise · Infrastructure · MEP services · Renovation', size: 'sm', color: 'accent', align: 'left' } },
              ],
              col3: [],
            },
          },
        ],
      },
    },

    // ---------- 6. CONTACT (interactive form barred from Puck → CTA into /contact) ----------
    { type: 'CTABanner', props: { id: id('contact-cta'), heading: 'Request a quote or the right spec', ctaLabel: 'Speak to engineering', ctaHref: '/contact' } },
  ],
}

async function main() {
  const payload = await getPayload({ config })
  const slug = 'home-puck'

  const existing = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, overrideAccess: true })
  if (existing.docs[0]) {
    const docId = existing.docs[0].id
    await payload.update({ collection: 'pages', id: docId, overrideAccess: true, data: { status: 'published', puckData } as never })
    console.log('Updated existing home-puck page', docId)
    console.log('View: http://localhost:3000/home-puck   Editor: http://localhost:3000/puck-editor/' + docId)
  } else {
    const doc = await payload.create({ collection: 'pages', overrideAccess: true, data: { title: 'Home (Puck preview)', slug, status: 'published', template: 'blank', puckData } as never })
    console.log('Created home-puck page', doc.id)
    console.log('View: http://localhost:3000/home-puck   Editor: http://localhost:3000/puck-editor/' + doc.id)
  }
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
