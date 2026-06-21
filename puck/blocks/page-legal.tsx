/**
 * Bespoke locked PAGE block — Legal pages
 *
 * One block used for all four legal pages (cookies, terms, privacy,
 * returns-warranty). The render reproduces the exact markup of
 * components/pages/LegalPageClient.tsx with layout locked and all
 * copy-driven text editable.
 *
 * Draft-notice body is intentionally editable so Alan can replace it
 * when full legal text is published with counsel. The "Reach us through
 * the contact page" link href is hard-coded to /contact because it is a
 * structural navigation element, not copy.
 *
 * Pure render (no client hooks). Works on both the server <Render> path
 * and inside the Puck editor.
 */
import type { ComponentConfig } from '@puckeditor/core'

const LOCKED = { drag: false, duplicate: false, delete: false } as const

// ─────────────────────────────────────────────────────────────────────────────
// LEGAL PAGE  (components/pages/LegalPageClient.tsx)
// ─────────────────────────────────────────────────────────────────────────────
export const LegalPage: ComponentConfig = {
  label: 'Page · Legal',
  permissions: LOCKED,
  fields: {
    legalEntityName: {
      type: 'text',
      label: 'Legal entity name',
      contentEditable: true,
    },
    title: {
      type: 'text',
      label: 'Page title',
      contentEditable: true,
    },
    lede: {
      type: 'textarea',
      label: 'Lede (hero subtext)',
      contentEditable: true,
    },
    draftBadge: {
      type: 'text',
      label: 'Draft badge label',
      contentEditable: true,
    },
    draftBody: {
      type: 'textarea',
      label: 'Draft notice body',
      contentEditable: true,
    },
    contactLinkLabel: {
      type: 'text',
      label: 'Contact link label',
      contentEditable: true,
    },
  },
  defaultProps: {
    legalEntityName: 'Coolman Malaysia Sdn Bhd',
    title: 'Legal',
    lede: 'Our legal notice for this page.',
    draftBadge: 'Draft',
    draftBody:
      'The full text of this notice is being prepared with counsel. Until it is published, the trade desk can answer any specific question on the record. Reach us through the contact page.',
    contactLinkLabel: 'Contact',
  },
  render: ({ legalEntityName, title, lede, draftBadge, draftBody, contactLinkLabel }) => {
    return (
      <>
        {/* Hero — navy background */}
        <section className="bg-navy text-paper">
          <div className="mx-auto max-w-[1280px] px-6 pt-32 pb-20 lg:px-8 lg:pt-40 lg:pb-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
              {legalEntityName}
            </p>
            <h1 className="mt-6 max-w-[22ch] font-fraunces text-[clamp(40px,6vw,72px)] font-normal leading-[1.05] tracking-[-0.025em] text-paper">
              {title}
            </h1>
            <p className="mt-8 max-w-[60ch] text-lg leading-relaxed text-paper/80">
              {lede}
            </p>
          </div>
        </section>

        {/* Draft notice — paper background */}
        <section className="bg-paper text-ink">
          <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8 lg:py-24">
            <div className="border-l-2 border-accent/30 pl-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
                {draftBadge}
              </p>
              <p className="mt-3 text-base leading-relaxed text-ink/70">
                {draftBody}
              </p>
              <a
                href="/contact"
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-navy transition-colors duration-150 ease-out hover:text-accent"
              >
                {contactLinkLabel}
                {/* ArrowRight icon reproduced inline as SVG — no client import needed */}
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
