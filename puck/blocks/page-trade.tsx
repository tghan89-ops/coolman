/**
 * Locked PAGE block for the Trade page.
 * Reproduces the exact markup of TradeClient.tsx / app/(frontend)/trade/page.tsx.
 * Every visible copy string is an editable Puck field; layout is locked.
 * WhatsApp number comes from metadata.settings (same pattern as CareerPage).
 * The interactive CTA buttons (WhatsApp pre-filled link + /contact link) are
 * extracted into components/puck/TradeSection.tsx ('use client').
 */
import type { ComponentConfig } from '@puckeditor/core'
import { TradeSection } from '@/components/puck/TradeSection'
import { Check } from 'lucide-react'

const LOCKED = { drag: false, duplicate: false, delete: false } as const

type Settings = { whatsapp_number?: string }

export const TradePage: ComponentConfig = {
  label: 'Page · Trade',
  permissions: LOCKED,
  fields: {
    // ── Hero ──────────────────────────────────────────────────────────────────
    heroEyebrow: { type: 'text', label: 'Hero eyebrow', contentEditable: true },
    heroHeadline: { type: 'text', label: 'Hero headline', contentEditable: true },
    heroLede: { type: 'textarea', label: 'Hero lede', contentEditable: true },

    // ── Tier cards ────────────────────────────────────────────────────────────
    buyerTitle: { type: 'text', label: 'Trade buyer · Title', contentEditable: true },
    buyerBody: { type: 'textarea', label: 'Trade buyer · Body', contentEditable: true },
    buyerBullets: {
      type: 'array',
      label: 'Trade buyer · Bullets',
      arrayFields: {
        text: { type: 'text', label: 'Bullet', contentEditable: true },
      },
      defaultItemProps: { text: 'Benefit' },
    },
    dealerTitle: { type: 'text', label: 'Brotherhood dealer · Title', contentEditable: true },
    dealerBody: { type: 'textarea', label: 'Brotherhood dealer · Body', contentEditable: true },
    dealerBullets: {
      type: 'array',
      label: 'Brotherhood dealer · Bullets',
      arrayFields: {
        text: { type: 'text', label: 'Bullet', contentEditable: true },
      },
      defaultItemProps: { text: 'Benefit' },
    },

    // ── Application section ───────────────────────────────────────────────────
    appEyebrow: { type: 'text', label: 'Application · Eyebrow', contentEditable: true },
    appHeadline: { type: 'text', label: 'Application · Headline', contentEditable: true },
    steps: {
      type: 'array',
      label: 'Application steps',
      arrayFields: {
        title: { type: 'text', label: 'Step title', contentEditable: true },
        body: { type: 'textarea', label: 'Step body', contentEditable: true },
      },
      defaultItemProps: { title: 'Step', body: 'What happens in this step.' },
    },
    ctaLabel: { type: 'text', label: 'WhatsApp CTA label', contentEditable: true },
    contactLabel: { type: 'text', label: 'Contact link label', contentEditable: true },
  },

  defaultProps: {
    heroEyebrow: 'Trade',
    heroHeadline:
      'For dealers and trade buyers. The relationship matters more than the order.',
    heroLede:
      'Two ways to work with Coolman. The right one depends on whether you want a supplier or a partner.',

    buyerTitle: 'Trade buyer',
    buyerBody:
      'Access to the full Coolman catalogue at trade pricing. Dispatch from Selangor within 2 business days.',
    buyerBullets: [
      { text: 'Full catalogue access' },
      { text: 'Trade pricing' },
      { text: 'Dispatch within 2 business days' },
    ],

    dealerTitle: 'Brotherhood dealer',
    dealerBody:
      'Everything the trade buyer gets, plus joint site visits, exclusive territory in agreed regions, and a direct line to engineering for your customers.',
    dealerBullets: [
      { text: 'Trade pricing + Brotherhood tier' },
      { text: 'Joint site visits with engineering' },
      { text: 'Direct line for your customers' },
      { text: 'Exclusive territory by agreement' },
    ],

    appEyebrow: 'How to apply',
    appHeadline:
      'Four steps. We will be honest about whether the fit is right.',
    steps: [
      {
        title: '1. Send your business profile',
        body: 'Tell us who you are, where you operate, and what you cut. A short message is enough to start.',
      },
      {
        title: '2. We come and see you',
        body: 'For Brotherhood applications, we visit your premises or a site you are working on.',
      },
      {
        title: '3. We agree the terms',
        body: 'Pricing, territory, support. Nothing complicated, all in writing.',
      },
      {
        title: '4. We start working',
        body: 'A first order, an engineering introduction to your customers, and a working relationship.',
      },
    ],
    ctaLabel: 'Start the conversation',
    contactLabel: 'Contact',
  },

  render: ({
    heroEyebrow,
    heroHeadline,
    heroLede,
    buyerTitle,
    buyerBody,
    buyerBullets,
    dealerTitle,
    dealerBody,
    dealerBullets,
    appEyebrow,
    appHeadline,
    steps,
    ctaLabel,
    contactLabel,
    puck,
  }) => {
    const s = (puck?.metadata?.settings as Settings) || {}
    const whatsappNumber = s.whatsapp_number || '+60126363156'

    const tiers = [
      {
        title: buyerTitle as React.ReactNode,
        body: buyerBody as React.ReactNode,
        bullets: (buyerBullets as { text: React.ReactNode }[]) || [],
      },
      {
        title: dealerTitle as React.ReactNode,
        body: dealerBody as React.ReactNode,
        bullets: (dealerBullets as { text: React.ReactNode }[]) || [],
      },
    ]
    const stepRows = (steps as { title: React.ReactNode; body: React.ReactNode }[]) || []

    return (
      <>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="bg-navy text-paper">
          <div className="mx-auto max-w-[1280px] px-6 pt-32 pb-24 lg:px-8 lg:pt-40 lg:pb-32">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
              {heroEyebrow}
            </p>
            <h1 className="mt-6 max-w-[22ch] font-fraunces text-[clamp(40px,6vw,84px)] font-normal leading-[1.02] tracking-[-0.025em] text-paper">
              {heroHeadline}
            </h1>
            <p className="mt-8 max-w-[58ch] text-lg leading-relaxed text-paper/80">
              {heroLede}
            </p>
          </div>
        </section>

        {/* ── Tier cards ───────────────────────────────────────────────────── */}
        <section className="bg-paper text-ink">
          <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-8 lg:py-28">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
              {tiers.map((tier, i) => (
                <article
                  key={i}
                  className="flex h-full flex-col border border-ink/10 bg-paper p-8 sm:p-10"
                >
                  <h2 className="font-fraunces text-[clamp(26px,3vw,36px)] font-normal leading-[1.1] tracking-[-0.02em] text-navy">
                    {tier.title}
                  </h2>
                  <p className="mt-5 text-base leading-relaxed text-ink/80">{tier.body}</p>
                  <ul className="mt-8 space-y-3 border-t border-ink/10 pt-6">
                    {tier.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-ink">
                        <Check
                          className="mt-[3px] h-4 w-4 flex-none text-accent"
                          aria-hidden="true"
                        />
                        <span className="leading-relaxed">{b.text}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Application section ──────────────────────────────────────────── */}
        <section className="border-t border-ink/10 bg-paper text-ink">
          <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-8 lg:py-28">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              {appEyebrow}
            </p>
            <h2 className="mt-4 max-w-[28ch] font-fraunces text-[clamp(28px,3.5vw,44px)] font-normal leading-[1.1] tracking-[-0.02em] text-navy">
              {appHeadline}
            </h2>
            <ol className="mt-12 grid grid-cols-1 gap-8 border-t border-ink/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
              {stepRows.map((step, idx) => (
                <li key={idx}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
                    {String(idx + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-3 font-fraunces text-[clamp(20px,2vw,24px)] font-normal leading-[1.2] tracking-[-0.01em] text-navy">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/75">{step.body}</p>
                </li>
              ))}
            </ol>
            {/* Interactive CTA buttons — client component */}
            <TradeSection
              ctaLabel={typeof ctaLabel === 'string' ? ctaLabel : 'Start the conversation'}
              contactLabel={typeof contactLabel === 'string' ? contactLabel : 'Contact'}
              whatsappNumber={whatsappNumber}
            />
          </div>
        </section>
      </>
    )
  },
}
