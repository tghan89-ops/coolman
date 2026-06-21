/**
 * Bespoke HOME blocks for the locked-layout / editable-content model (GH's call:
 * "some parts not movable, but still editable Puck-style").
 *
 * Each block's render is the EXACT markup of the live home section
 * (components/home/HomePageClient.tsx) — so a Puck page built from these looks
 * pixel-identical to the hand-coded home. The difference is purely the editing
 * surface: text + images are Puck fields (inline contentEditable), and every
 * block is locked (drag/duplicate/delete OFF) so the layout can't be rearranged
 * or broken — only its content edited.
 *
 * Pure render (props -> JSX, no client hooks) so this is safe on the server
 * <Render> path AND in the editor. Links use <a> (the catch-all renders
 * server-side; <a> needs no client runtime).
 *
 * These four sections are 100% presentational (no live data, no two-tier
 * conflict). The data-coupled PRODUCTS grid and the interactive CONTACT form are
 * handled separately (they need live data via Puck `metadata` + GH's two-tier
 * ratification) and are intentionally not in this file yet.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { MediaField, type MediaValue } from '../fields/MediaField'
import { LinkField } from '../fields/LinkField'
import { HomeProductsSection, type GridProduct } from '../../components/puck/HomeProductsSection'
import { HomeContactSection, type ContactCopy } from '../../components/puck/HomeContactSection'

// Lock a block: it can't be dragged, duplicated or deleted — but its fields stay
// editable (edit defaults true). This is the "fixed layout, editable content" gate.
const LOCKED = { drag: false, duplicate: false, delete: false } as const

const linkField = (label: string) =>
  ({
    type: 'custom' as const,
    label,
    render: ({ onChange, value }: { onChange: (v: string) => void; value: unknown }) => (
      <LinkField value={value as string} onChange={onChange} />
    ),
  })

const mediaField = (label: string) =>
  ({
    type: 'custom' as const,
    label,
    render: ({ onChange, value }: { onChange: (v: MediaValue) => void; value: unknown }) => (
      <MediaField value={value as MediaValue} onChange={onChange} />
    ),
  })

const container = 'mx-auto max-w-[1280px] px-6 lg:px-12'

// ─────────────────────────────────────────────────────────────────────────────
// 1. HERO  (HomePageClient.tsx lines 150–224)
// ─────────────────────────────────────────────────────────────────────────────
const HomeHero: ComponentConfig = {
  label: 'Home · Hero',
  permissions: LOCKED,
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow', contentEditable: true },
    headlineLine1: { type: 'text', label: 'Headline line 1', contentEditable: true },
    headlineLine2Prefix: { type: 'text', label: 'Headline line 2 (prefix)', contentEditable: true },
    headlineEmphasis: { type: 'text', label: 'Headline emphasis (accent)', contentEditable: true },
    lede: { type: 'textarea', label: 'Lede', contentEditable: true },
    ctaPrimary: { type: 'text', label: 'Primary button label', contentEditable: true },
    ctaPrimaryHref: linkField('Primary button link'),
    ctaSecondary: { type: 'text', label: 'Secondary button label', contentEditable: true },
    ctaSecondaryHref: linkField('Secondary button link'),
    image: mediaField('Hero image'),
    badgeTag: { type: 'text', label: 'Badge tag', contentEditable: true },
    badgeValue: { type: 'text', label: 'Badge value', contentEditable: true },
    stats: {
      type: 'array',
      label: 'Stats',
      arrayFields: {
        value: { type: 'text', label: 'Number', contentEditable: true },
        label: { type: 'text', label: 'Label', contentEditable: true },
      },
      defaultItemProps: { value: '00', label: 'Label' },
    },
  },
  defaultProps: {
    eyebrow: 'Diamond tools · Selangor · since 2007',
    headlineLine1: 'The right blade',
    headlineLine2Prefix: 'for ',
    headlineEmphasis: 'every cut',
    lede: 'Blades, core bits and cutting systems engineered for Malaysian rock, rebar and schedule. Tell us the job — we send the spec and the price.',
    ctaPrimary: 'Browse products',
    ctaPrimaryHref: '/products',
    ctaSecondary: 'Speak to engineering',
    ctaSecondaryHref: '/contact',
    image: { url: '/images/hero-blade.jpg', alt: 'Diamond blade cutting concrete' },
    badgeTag: 'Ready stock',
    badgeValue: 'Shipped from Selangor',
    stats: [
      { value: '2007', label: 'Cutting since' },
      { value: '247', label: 'SKUs in stock' },
      { value: '2014', label: 'Shibuya partner' },
      { value: '2 days', label: 'Typical dispatch' },
    ],
  },
  render: ({ eyebrow, headlineLine1, headlineLine2Prefix, headlineEmphasis, lede, ctaPrimary, ctaPrimaryHref, ctaSecondary, ctaSecondaryHref, image, badgeTag, badgeValue, stats }) => {
    const img = image as MediaValue
    const rows = (stats as { value: React.ReactNode; label: React.ReactNode }[]) || []
    return (
      <section className="bg-white">
        <div className="mx-auto max-w-[1280px] px-6 pt-14 lg:px-12 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="block h-0.5 w-7 bg-accent" />
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent">{eyebrow}</span>
              </div>
              <h1 className="text-[clamp(40px,6vw,68px)] font-bold uppercase leading-[0.98] tracking-[-0.025em] text-navy">
                {headlineLine1}
                <br />
                {headlineLine2Prefix}
                <span className="text-accent">{headlineEmphasis}</span>
              </h1>
              <p className="mt-6 max-w-[440px] text-lg leading-[1.55] text-ink-muted">{lede}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href={(ctaPrimaryHref as string) || '/products'} className="inline-flex items-center gap-2.5 rounded-[5px] bg-accent px-6 py-4 font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-opacity duration-150 ease-out hover:opacity-90">
                  {ctaPrimary} <span className="text-[15px]">→</span>
                </a>
                <a href={(ctaSecondaryHref as string) || '/contact'} className="inline-flex items-center gap-2.5 rounded-[5px] border border-[#cbd0d8] bg-white px-6 py-4 font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-navy transition-colors duration-150 ease-out hover:border-navy">
                  {ctaSecondary}
                </a>
              </div>
              <div className="mt-12 grid grid-cols-2 overflow-hidden rounded-lg border border-[#E6E9EE] sm:grid-cols-4">
                {rows.map((s, i) => (
                  <div key={i} className={`px-5 py-5 ${i > 0 ? 'border-[#E6E9EE] sm:border-l' : ''} ${i === 2 ? 'border-t sm:border-t-0' : ''} ${i === 3 ? 'border-t border-l sm:border-t-0' : ''}`}>
                    <div className="font-mono text-[28px] font-semibold text-navy">{s.value}</div>
                    <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-xl shadow-[0_18px_50px_rgba(10,22,40,0.18)] aspect-[4/5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img?.url || '/images/hero-blade.jpg'} alt={img?.alt || 'Diamond blade cutting concrete'} className="h-full w-full object-cover" />
              </div>
              <div className="absolute -left-4 bottom-9 rounded-lg bg-navy px-5 py-4 shadow-[0_10px_30px_rgba(10,22,40,0.3)]">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent-light">{badgeTag}</div>
                <div className="mt-1 font-mono text-[15px] font-semibold text-white">{badgeValue}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. TRUST BAR  (lines 226–241)
// ─────────────────────────────────────────────────────────────────────────────
const HomeTrustBar: ComponentConfig = {
  label: 'Home · Trust bar',
  permissions: LOCKED,
  fields: {
    items: {
      type: 'array',
      label: 'Items',
      arrayFields: { text: { type: 'text', label: 'Item', contentEditable: true } },
      defaultItemProps: { text: 'New item' },
    },
  },
  defaultProps: {
    items: [
      { text: 'Engineered in Selangor' },
      { text: 'Shibuya Japan distributor' },
      { text: 'WhatsApp tech support' },
      { text: 'Trade pricing for contractors' },
      { text: 'Dispatch within 2 business days' },
    ],
  },
  render: ({ items }) => {
    const rows = (items as { text: React.ReactNode }[]) || []
    return (
      <div className="mx-auto mt-16 max-w-[1280px] px-6 lg:px-12">
        <div className="flex flex-wrap border-y border-[#E6E9EE]">
          {rows.map((item, i) => (
            <div key={i} className={`flex min-w-[200px] flex-1 items-center gap-2.5 px-6 py-5 ${i < rows.length - 1 ? 'border-[#E6E9EE] md:border-r' : ''}`}>
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-accent" />
              <span className="text-[13px] font-semibold text-navy">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. WHY COOLMAN  (lines 243–269)
// ─────────────────────────────────────────────────────────────────────────────
const HomeWhy: ComponentConfig = {
  label: 'Home · Why Coolman',
  permissions: LOCKED,
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow', contentEditable: true },
    heading: { type: 'text', label: 'Heading', contentEditable: true },
    cards: {
      type: 'array',
      label: 'Cards',
      arrayFields: {
        num: { type: 'text', label: 'Number', contentEditable: true },
        title: { type: 'text', label: 'Title', contentEditable: true },
        body: { type: 'textarea', label: 'Body', contentEditable: true },
      },
      defaultItemProps: { num: '00', title: 'Card title', body: 'Card body.' },
    },
  },
  defaultProps: {
    eyebrow: 'Why Coolman',
    heading: 'Built for the Malaysian job site',
    cards: [
      { num: '01', title: 'Engineered for the rock here', body: 'Tested on Malaysian aggregate, rebar and tropical concrete — not a European catalogue. If it cuts here, it cuts anywhere.' },
      { num: '02', title: 'The engineering desk answers', body: "Send the cut on WhatsApp. Alan's desk replies with the right spec — direct, with no salesman in between." },
      { num: '03', title: 'Order direct, see the price', body: 'Trade accounts get tier pricing and reorder history. The effective price shows before you submit — never a surprise invoice.' },
    ],
  },
  render: ({ eyebrow, heading, cards }) => {
    const rows = (cards as { num: React.ReactNode; title: React.ReactNode; body: React.ReactNode }[]) || []
    return (
      <section className="bg-white py-20 lg:py-24">
        <div className={container}>
          <div className="mb-3.5 flex items-center gap-3">
            <span className="block h-0.5 w-[22px] bg-accent" />
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent">{eyebrow}</span>
          </div>
          <h2 className="mb-12 max-w-[20ch] text-[clamp(30px,3.6vw,42px)] font-bold uppercase leading-[1.02] tracking-[-0.02em] text-navy">{heading}</h2>
          <div className="grid gap-7 md:grid-cols-3">
            {rows.map((card, i) => (
              <div key={i} className="border-t-[3px] border-accent pt-6">
                <div className="font-mono text-[13px] font-semibold tracking-[0.1em] text-accent">{card.num}</div>
                <h3 className="mb-2.5 mt-3.5 text-[22px] font-semibold tracking-[-0.01em] text-navy">{card.title}</h3>
                <p className="text-[15px] leading-[1.65] text-ink-muted">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SHIBUYA BAND  (lines 372–432)
// ─────────────────────────────────────────────────────────────────────────────
const HomeShibuya: ComponentConfig = {
  label: 'Home · Shibuya band',
  permissions: LOCKED,
  fields: {
    badge: { type: 'text', label: 'Badge', contentEditable: true },
    headingLine1: { type: 'text', label: 'Heading line 1', contentEditable: true },
    headingLine2: { type: 'text', label: 'Heading line 2', contentEditable: true },
    lede: { type: 'textarea', label: 'Lede', contentEditable: true },
    cta: { type: 'text', label: 'Button label', contentEditable: true },
    ctaHref: linkField('Button link'),
    bullets: {
      type: 'array',
      label: 'Bullets',
      arrayFields: { text: { type: 'text', label: 'Bullet', contentEditable: true } },
      defaultItemProps: { text: 'New bullet' },
    },
    stats: {
      type: 'array',
      label: 'Stats',
      arrayFields: {
        value: { type: 'text', label: 'Number', contentEditable: true },
        label: { type: 'text', label: 'Label', contentEditable: true },
      },
      defaultItemProps: { value: '00', label: 'Label' },
    },
    tags: {
      type: 'array',
      label: 'Tags',
      arrayFields: { text: { type: 'text', label: 'Tag', contentEditable: true } },
      defaultItemProps: { text: 'New tag' },
    },
  },
  defaultProps: {
    badge: 'Official Malaysia distributor · since 2014',
    headingLine1: 'Shibuya core',
    headingLine2: 'drilling machines',
    lede: "Japan's most trusted core-drilling technology, backed by Coolman's training, service and spare-part stock here in Malaysia.",
    cta: 'Request a demo',
    ctaHref: '/contact',
    bullets: [
      { text: 'Rated 52mm to 600mm core diameters' },
      { text: 'Reinforced concrete & post-tension rated' },
      { text: 'Operator training & on-site demo' },
      { text: 'Spare parts stocked locally' },
    ],
    stats: [
      { value: '600mm', label: 'Max core size' },
      { value: '52mm', label: 'Min core size' },
      { value: '2014', label: 'Distributor since' },
      { value: 'MY', label: 'Local service' },
    ],
    tags: [
      { text: 'High-rise' },
      { text: 'Infrastructure' },
      { text: 'MEP services' },
      { text: 'Renovation' },
    ],
  },
  render: ({ badge, headingLine1, headingLine2, lede, cta, ctaHref, bullets, stats, tags }) => {
    const bl = (bullets as { text: React.ReactNode }[]) || []
    const st = (stats as { value: React.ReactNode; label: React.ReactNode }[]) || []
    const tg = (tags as { text: React.ReactNode }[]) || []
    return (
      <section className="overflow-hidden bg-navy py-20 lg:py-24">
        <div className="mx-auto grid max-w-[1280px] items-center gap-14 px-6 lg:grid-cols-2 lg:gap-16 lg:px-12">
          <div>
            <div className="mb-6 inline-flex items-center gap-2.5 rounded border border-white/15 bg-white/5 px-3.5 py-2">
              <span className="inline-flex h-3 w-[18px] items-center justify-center rounded-[1px] bg-white">
                <span className="h-[7px] w-[7px] rounded-full bg-[#bc002d]" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/80">{badge}</span>
            </div>
            <h2 className="text-[clamp(32px,4vw,46px)] font-bold uppercase leading-[1.0] tracking-[-0.02em] text-white">
              {headingLine1}
              <br />
              {headingLine2}
            </h2>
            <p className="mb-7 mt-5 max-w-[440px] text-[16px] leading-[1.65] text-ink-faint">{lede}</p>
            <div className="mb-9 flex flex-col gap-3">
              {bl.map((b, i) => (
                <div key={i} className="flex items-center gap-2.5 text-[15px] text-white/80">
                  <span className="h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                  {b.text}
                </div>
              ))}
            </div>
            <a href={(ctaHref as string) || '/contact'} className="inline-flex items-center gap-2.5 rounded-[5px] bg-accent px-6 py-4 font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-opacity duration-150 ease-out hover:opacity-90">
              {cta} <span>→</span>
            </a>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-white/10 bg-white/10">
              {st.map((s, i) => (
                <div key={i} className="bg-[#0E1A30] p-7">
                  <div className="font-mono text-[36px] font-semibold text-white">{s.value}</div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {tg.map((tag, i) => (
                <span key={i} className="rounded-sm border border-white/15 px-3 py-1.5 font-mono text-[11px] text-ink-faint">{tag.text}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PRODUCTS  (lines 271–370) — locked, READ-ONLY live grid (two-tier exception,
//    GH-approved). Products arrive via Puck metadata; only the copy is editable.
//    NO price is rendered.
// ─────────────────────────────────────────────────────────────────────────────
const HomeProducts: ComponentConfig = {
  label: 'Home · Products (read-only)',
  permissions: LOCKED,
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow', contentEditable: true },
    heading: { type: 'text', label: 'Heading', contentEditable: true },
    tabAll: { type: 'text', label: '"All" tab label', contentEditable: true },
    enquire: { type: 'text', label: 'Card link label', contentEditable: true },
    viewAll: { type: 'text', label: 'View-all link label', contentEditable: true },
    emptyHeading: { type: 'text', label: 'Empty-state heading', contentEditable: true },
    emptyBody: { type: 'textarea', label: 'Empty-state body', contentEditable: true },
  },
  defaultProps: {
    eyebrow: 'Product range',
    heading: 'Tools for every cut',
    tabAll: 'All',
    enquire: 'View',
    viewAll: 'Browse the full catalogue',
    emptyHeading: 'The full catalogue is online',
    emptyBody: 'Blades, core bits, grinding and polishing — browse the complete range and submit a request.',
  },
  render: ({ eyebrow, heading, tabAll, enquire, viewAll, emptyHeading, emptyBody, puck }) => {
    const products = ((puck?.metadata?.products as GridProduct[]) || []).map((p) => ({
      id: p.id, name: p.name, category: p.category ?? null, diameter: p.diameter ?? null,
      bondType: p.bondType ?? null, materials: p.materials || [], image: p.image ?? null,
    }))
    return (
      <HomeProductsSection
        products={products}
        eyebrow={eyebrow as string}
        heading={heading as string}
        tabAll={tabAll as string}
        enquire={enquire as string}
        viewAll={viewAll as string}
        emptyHeading={emptyHeading as string}
        emptyBody={emptyBody as string}
      />
    )
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CONTACT  (lines 434–573) — locked, real working form. WhatsApp via metadata.
// ─────────────────────────────────────────────────────────────────────────────
const CONTACT_DEFAULTS = {
  labels: { fullName: 'Full name', company: 'Company', phone: 'Phone / WhatsApp', email: 'Email', interest: "I'm interested in", job: 'The job' },
  placeholders: { fullName: 'Ahmad Razif', company: 'ABC Contractors Sdn Bhd', phone: '+60 12-345 6789', email: 'ahmad@abc.com.my', job: "Material, machine, diameter, and what you're cutting…" },
  interestOptions: ['Diamond blades', 'Core drilling (Shibuya)', 'Grinding & polishing', 'Opening a trade account', 'Technical advice'],
  submit: 'Send enquiry',
  sending: 'Sending…',
  success: "Enquiry sent. Alan's desk will get back to you — for anything urgent, WhatsApp us.",
  error: 'We could not send your enquiry. Please try again or WhatsApp us.',
  requiredError: 'Please add your name, email and a short note about the job.',
  whatsappCta: 'WhatsApp us now',
}

const HomeContact: ComponentConfig = {
  label: 'Home · Contact',
  permissions: LOCKED,
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow', contentEditable: true },
    heading: { type: 'text', label: 'Heading', contentEditable: true },
    whatsappCta: { type: 'text', label: 'WhatsApp button label', contentEditable: true },
    workshopLabel: { type: 'text', label: 'Workshop label', contentEditable: true },
    workshopValue: { type: 'text', label: 'Workshop value', contentEditable: true },
    emailLabel: { type: 'text', label: 'Email label', contentEditable: true },
    emailValue: { type: 'text', label: 'Email value', contentEditable: true },
    hoursLabel: { type: 'text', label: 'Hours label', contentEditable: true },
    hoursValue: { type: 'text', label: 'Hours value', contentEditable: true },
  },
  defaultProps: {
    eyebrow: 'Get in touch',
    heading: 'Request a quote or the right spec',
    whatsappCta: 'WhatsApp us now',
    workshopLabel: 'Workshop',
    workshopValue: 'Selangor, Malaysia',
    emailLabel: 'Email',
    emailValue: 'info@coolman.com.my',
    hoursLabel: 'Hours',
    hoursValue: 'Mon–Fri 8:30–17:30 · Sat 8:30–13:00',
  },
  render: ({ eyebrow, heading, whatsappCta, workshopLabel, workshopValue, emailLabel, emailValue, hoursLabel, hoursValue, puck }) => {
    const whatsappNumber = ((puck?.metadata?.settings as { whatsapp_number?: string })?.whatsapp_number) || '+60126363156'
    const c: ContactCopy = {
      ...CONTACT_DEFAULTS,
      eyebrow: eyebrow as string,
      heading: heading as string,
      whatsappCta: whatsappCta as string,
      workshopLabel: workshopLabel as string,
      workshopValue: workshopValue as string,
      emailLabel: emailLabel as string,
      emailValue: emailValue as string,
      hoursLabel: hoursLabel as string,
      hoursValue: hoursValue as string,
    }
    return <HomeContactSection whatsappNumber={whatsappNumber} c={c} />
  },
}

export const homeBlocks = {
  HomeHero,
  HomeTrustBar,
  HomeWhy,
  HomeProducts,
  HomeShibuya,
  HomeContact,
} satisfies Record<string, ComponentConfig>

export const homeBlockNames = Object.keys(homeBlocks)
