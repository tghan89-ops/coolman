/**
 * Bespoke locked PAGE blocks — the same model as the home sections
 * (puck/blocks/home.tsx): each block's render is the exact markup of an existing
 * editorial page, with its copy as editable fields and the layout locked (one
 * block per page, can't be moved/duplicated/deleted). Settings-derived bits
 * (WhatsApp, emails) arrive via Puck `metadata.settings`.
 *
 * Pure render (no client hooks) so it works on the server <Render> path and in
 * the editor. Links use <a>.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { AboutPage } from './page-about'
import { ApplicationsPage } from './page-applications'
import { ResourcesPage } from './page-resources'
import { TradePage } from './page-trade'
import { ContactPage } from './page-contact'
import { BrotherhoodPage } from './page-brotherhood'
import { ShibuyaPage } from './page-shibuya'
import { HeritagePage } from './page-heritage'
import { WhyCoolmanPage } from './page-why-coolman'
import { LegalPage } from './page-legal'

const LOCKED = { drag: false, duplicate: false, delete: false } as const

type Settings = { whatsapp_number?: string; contact_email_careers?: string }

const waHref = (n?: string) => {
  const d = (n || '').replace(/\D/g, '')
  return d.length >= 8 ? `https://wa.me/${d}` : '#'
}

// ─────────────────────────────────────────────────────────────────────────────
// CAREER  (components/pages/CareerClient.tsx)
// ─────────────────────────────────────────────────────────────────────────────
const CareerPage: ComponentConfig = {
  label: 'Page · Career',
  permissions: LOCKED,
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow', contentEditable: true },
    heading: { type: 'text', label: 'Heading', contentEditable: true },
    lede: { type: 'textarea', label: 'Lede', contentEditable: true },
    rolesHeading: { type: 'text', label: 'Roles heading', contentEditable: true },
    roles: {
      type: 'array',
      label: 'Roles',
      arrayFields: {
        num: { type: 'text', label: 'Number', contentEditable: true },
        title: { type: 'text', label: 'Title', contentEditable: true },
        body: { type: 'textarea', label: 'Body', contentEditable: true },
      },
      defaultItemProps: { num: '00', title: 'Role', body: 'What this role does.' },
    },
    applyHeading: { type: 'text', label: 'Apply heading', contentEditable: true },
    applyBody: { type: 'textarea', label: 'Apply body', contentEditable: true },
    emailCta: { type: 'text', label: 'Email button label', contentEditable: true },
    whatsappCta: { type: 'text', label: 'WhatsApp button label', contentEditable: true },
  },
  defaultProps: {
    eyebrow: 'Careers · Selangor',
    heading: 'Build a career in cutting',
    lede: "Coolman has supplied Malaysian contractors with diamond tools since 2007. We grow by hiring people who respect the job site and want to get the spec right — not just close a sale.",
    rolesHeading: 'Where we usually hire',
    roles: [
      { num: '01', title: 'Technical sales', body: 'On the phone and on site with contractors — matching the right blade or rig to the cut, not pushing a price list.' },
      { num: '02', title: 'Workshop & dispatch', body: 'Picking, checking and getting stock out the door inside our 2-business-day dispatch promise.' },
      { num: '03', title: 'Engineering desk', body: 'Answering the WhatsApp spec questions that keep contractors cutting through the day.' },
    ],
    applyHeading: 'How to apply',
    applyBody: 'Send your CV and a line or two about the work you have done. We read every one.',
    emailCta: 'Email your CV',
    whatsappCta: 'WhatsApp us',
  },
  render: ({ eyebrow, heading, lede, rolesHeading, roles, applyHeading, applyBody, emailCta, whatsappCta, puck }) => {
    const s = (puck?.metadata?.settings as Settings) || {}
    const careersEmail = s.contact_email_careers || 'careers@coolman.com.my'
    const roleRows = (roles as { num: React.ReactNode; title: React.ReactNode; body: React.ReactNode }[]) || []
    return (
      <>
        <section className="bg-white">
          <div className="mx-auto max-w-[1280px] px-6 pt-16 pb-4 lg:px-12 lg:pt-24">
            <div className="mb-6 flex items-center gap-3">
              <span className="block h-0.5 w-7 bg-accent" />
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent">{eyebrow}</span>
            </div>
            <h1 className="max-w-[16ch] text-[clamp(40px,6vw,68px)] font-bold uppercase leading-[0.98] tracking-[-0.025em] text-navy">{heading}</h1>
            <p className="mt-6 max-w-[60ch] text-lg leading-[1.55] text-ink-muted">{lede}</p>
          </div>
        </section>

        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
            <h2 className="mb-10 text-[clamp(26px,3vw,36px)] font-bold uppercase leading-[1.04] tracking-[-0.02em] text-navy">{rolesHeading}</h2>
            <div className="grid gap-7 md:grid-cols-3">
              {roleRows.map((role, i) => (
                <div key={i} className="border-t-[3px] border-accent pt-6">
                  <div className="font-mono text-[13px] font-semibold tracking-[0.1em] text-accent">{role.num}</div>
                  <h3 className="mb-2.5 mt-3.5 text-[22px] font-semibold tracking-[-0.01em] text-navy">{role.title}</h3>
                  <p className="text-[15px] leading-[1.65] text-ink-muted">{role.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-navy py-16 lg:py-20">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
            <h2 className="text-[clamp(26px,3vw,36px)] font-bold uppercase leading-[1.04] tracking-[-0.02em] text-white">{applyHeading}</h2>
            <p className="mt-4 max-w-[52ch] text-[16px] leading-[1.6] text-ink-faint">{applyBody}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={`mailto:${careersEmail}`} className="inline-flex items-center gap-2.5 rounded-[5px] bg-accent px-6 py-4 font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-opacity duration-150 ease-out hover:opacity-90">{emailCta} →</a>
              <a href={waHref(s.whatsapp_number)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-[5px] border border-white/25 px-6 py-4 font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors duration-150 ease-out hover:border-white">{whatsappCta}</a>
            </div>
            <p className="mt-6 font-mono text-[12px] text-ink-faint">{careersEmail}</p>
          </div>
        </section>
      </>
    )
  },
}

export const pageBlocks = {
  CareerPage,
  AboutPage,
  ApplicationsPage,
  ResourcesPage,
  TradePage,
  ContactPage,
  BrotherhoodPage,
  ShibuyaPage,
  HeritagePage,
  WhyCoolmanPage,
  LegalPage,
} satisfies Record<string, ComponentConfig>

export const pageBlockNames = Object.keys(pageBlocks)
