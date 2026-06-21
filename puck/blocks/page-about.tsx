/**
 * Locked PAGE block for the About page.
 * Pattern mirrors pages.tsx (CareerPage). Layout locked; all copy editable.
 * Settings-derived value: whatsapp_number via puck.metadata.settings.
 * No price/catalogue/SKU/cart — safe under the two-tier hard rule.
 */
import type { ComponentConfig } from '@puckeditor/core'

const LOCKED = { drag: false, duplicate: false, delete: false } as const

type Settings = { whatsapp_number?: string }

const waHref = (n?: string) => {
  const d = (n || '').replace(/\D/g, '')
  return d.length >= 8 ? `https://wa.me/${d}` : '#'
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT  (components/pages/AboutClient.tsx)
// ─────────────────────────────────────────────────────────────────────────────
export const AboutPage: ComponentConfig = {
  label: 'Page · About',
  permissions: LOCKED,
  fields: {
    // ── Hero ──────────────────────────────────────────────────────────────
    heroEyebrow: { type: 'text', label: 'Hero eyebrow', contentEditable: true },
    heroHeadline: { type: 'text', label: 'Hero headline', contentEditable: true },
    heroLede: { type: 'textarea', label: 'Hero lede', contentEditable: true },

    // ── Stats ─────────────────────────────────────────────────────────────
    stats: {
      type: 'array',
      label: 'Stats',
      arrayFields: {
        label: { type: 'text', label: 'Label', contentEditable: true },
        value: { type: 'text', label: 'Value', contentEditable: true },
      },
      defaultItemProps: { label: 'Label', value: 'Value' },
    },

    // ── Closing CTA ───────────────────────────────────────────────────────
    ctaEyebrow: { type: 'text', label: 'CTA eyebrow', contentEditable: true },
    ctaTitle: { type: 'text', label: 'CTA title', contentEditable: true },
    ctaTitleEmphasis: { type: 'text', label: 'CTA title emphasis (italic)', contentEditable: true },
    ctaBody: { type: 'textarea', label: 'CTA body', contentEditable: true },
    ctaWhatsappLabel: { type: 'text', label: 'WhatsApp CTA label', contentEditable: true },
    ctaContactLabel: { type: 'text', label: 'Contact link label', contentEditable: true },
  },

  defaultProps: {
    // ── Hero ──────────────────────────────────────────────────────────────
    heroEyebrow: 'About',
    heroHeadline: 'Diamond cutting tools. Designed in Malaysia, for Malaysia.',
    heroLede:
      'Coolman has been built in Selangor since 2007. We make diamond blades, core bits and segment systems for Malaysian contractors. Around 500 active accounts. Same range, same direct line to engineering, for 19 years.',

    // ── Stats ─────────────────────────────────────────────────────────────
    stats: [
      { label: 'Founded in Selangor', value: '2007' },
      { label: 'Where the blade is made', value: 'Selangor' },
      { label: 'Active accounts', value: '~500' },
    ],

    // ── Closing CTA ───────────────────────────────────────────────────────
    ctaEyebrow: 'A conversation',
    ctaTitle: 'Got a cut that the spec',
    ctaTitleEmphasis: 'sheet cannot answer?',
    ctaBody:
      'Send a photo of the job, the aggregate, and the existing blade. The engineering desk replies the same working day. If you want to read more in the same voice, three Field Notes cover specific jobs that taught us what the folio above argues.',
    ctaWhatsappLabel: 'Open the engineering desk on WhatsApp',
    ctaContactLabel: 'Contact',
  },

  render: ({
    heroEyebrow,
    heroHeadline,
    heroLede,
    stats,
    ctaEyebrow,
    ctaTitle,
    ctaTitleEmphasis,
    ctaBody,
    ctaWhatsappLabel,
    ctaContactLabel,
    puck,
  }) => {
    const s = (puck?.metadata?.settings as Settings) || {}
    const statRows = (
      stats as { label: React.ReactNode; value: React.ReactNode }[]
    ) || []

    return (
      <>
        {/* ── Hero ───────────────────────────────────────────────────────── */}
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

        {/* ── Stats ──────────────────────────────────────────────────────── */}
        <section className="bg-paper text-ink">
          <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-8 lg:py-28">
            <dl className="grid grid-cols-1 gap-12 border-t border-ink/10 pt-12 sm:grid-cols-3">
              {statRows.map((stat, i) => (
                <div key={i}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50">
                    {stat.label}
                  </dt>
                  <dd className="mt-3 font-mono text-[clamp(28px,3.2vw,40px)] font-normal leading-tight text-navy">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Closing CTA ────────────────────────────────────────────────── */}
        <section className="bg-navy text-paper">
          <div className="mx-auto max-w-3xl px-6 py-24 lg:px-8 lg:py-28">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
              {ctaEyebrow}
            </p>
            <h2 className="mt-4 font-fraunces text-[clamp(28px,3.5vw,44px)] font-normal leading-[1.1] tracking-[-0.02em] text-paper">
              {ctaTitle}{' '}
              <span className="italic text-accent-light">{ctaTitleEmphasis}</span>
            </h2>
            <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-paper/80 sm:text-lg">
              {ctaBody}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={waHref(s.whatsapp_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-accent px-6 text-sm font-medium text-paper transition-colors duration-150 ease-out hover:bg-accent-light"
              >
                {/* MessageCircle icon — lucide 24px path */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                </svg>
                {ctaWhatsappLabel}
              </a>
              <a
                href="/contact"
                className="inline-flex min-h-[48px] items-center gap-2 text-sm font-medium text-paper transition-colors duration-150 ease-out hover:text-accent-light"
              >
                {ctaContactLabel}
                {/* ArrowRight icon — lucide 24px path */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </>
    )
  },
}
