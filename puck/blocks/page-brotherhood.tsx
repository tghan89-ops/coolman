/**
 * Locked PAGE block — Brotherhood dealer directory.
 *
 * Same model as CareerPage in pages.tsx: one block per page, layout locked
 * (no drag/duplicate/delete), copy editable via Puck fields, WhatsApp from
 * metadata.settings.  Interactive area-filter state is extracted into the
 * 'use client' BrotherhoodSection component so this render stays pure (works
 * on the server <Render> path and in the Puck editor).
 *
 * Markup is a faithful reproduction of:
 *   app/(frontend)/brotherhood/BrotherhoodDirectoryClient.tsx
 * minus the PublicLayout wrapper (the page shell adds that).
 *
 * Data shape: the `dealers` array field seeds placeholder entries.  In
 * production the page is populated via the Payload `dealers` collection and
 * the real /brotherhood route; the Puck version lets Alan edit the directory
 * copy and dealer list directly in the visual editor without touching Payload.
 */
import type { ComponentConfig } from '@puckeditor/core'
import {
  BrotherhoodSection,
  type DealerEntry,
  type BrotherhoodCopy,
} from '../../components/puck/BrotherhoodSection'

// ── Local copies of helpers (never import from pages.tsx) ───────────────────

const LOCKED = { drag: false, duplicate: false, delete: false } as const

type Settings = { whatsapp_number?: string }

// ── Block definition ────────────────────────────────────────────────────────

export const BrotherhoodPage: ComponentConfig = {
  label: 'Page · Brotherhood directory',
  permissions: LOCKED,

  fields: {
    // Hero section
    heroEyebrow: { type: 'text', label: 'Hero eyebrow', contentEditable: true },
    heroHeadline: { type: 'text', label: 'Hero headline', contentEditable: true },
    heroLede: { type: 'textarea', label: 'Hero lede', contentEditable: true },

    // Filter / empty-state UI copy
    filterLabel: { type: 'text', label: 'Filter label', contentEditable: true },
    filterAllLabel: { type: 'text', label: 'Filter "All areas" label', contentEditable: true },
    emptyHeadline: { type: 'text', label: 'Empty-state headline', contentEditable: true },
    emptyBody: { type: 'textarea', label: 'Empty-state body', contentEditable: true },
    emptyCtaLabel: { type: 'text', label: 'Empty-state CTA label', contentEditable: true },

    // Editable dealer directory
    dealers: {
      type: 'array',
      label: 'Dealers',
      arrayFields: {
        name: { type: 'text', label: 'Name', contentEditable: true },
        area: { type: 'text', label: 'Area / state', contentEditable: true },
        address: { type: 'textarea', label: 'Address', contentEditable: true },
        whatsapp_number: { type: 'text', label: 'WhatsApp number' },
        google_maps_query: { type: 'text', label: 'Google Maps query' },
        operating_hours: { type: 'text', label: 'Operating hours (optional)', contentEditable: true },
        languages: { type: 'text', label: 'Languages (comma-separated, optional)', contentEditable: true },
        specialisations: { type: 'text', label: 'Specialisations (comma-separated, optional)', contentEditable: true },
      },
      defaultItemProps: {
        name: 'Dealer Name Sdn Bhd',
        area: 'Selangor',
        address: 'No. 1, Jalan Contoh,\n40150 Shah Alam, Selangor',
        whatsapp_number: '601112345678',
        google_maps_query: 'Shah Alam Selangor',
        operating_hours: 'Mon–Fri 9am–6pm',
        languages: '',
        specialisations: '',
      },
    },
  },

  defaultProps: {
    heroEyebrow: 'The Brotherhood directory',
    heroHeadline: 'Authorised Coolman dealers across Malaysia.',
    heroLede:
      'The people who carry our blade to the worksite. Filter by area, message on WhatsApp, or open the address in Maps.',
    filterLabel: 'Filter by area',
    filterAllLabel: 'All areas',
    emptyHeadline: 'Brotherhood directory launching soon.',
    emptyBody:
      'Call sales for your nearest authorised dealer while we onboard the first cohort.',
    emptyCtaLabel: 'Message sales on WhatsApp',
    dealers: [
      {
        name: 'Bestcut Tools & Hardware',
        area: 'Selangor',
        address: 'No. 12, Jalan Perusahaan 2,\nKawasan Perindustrian Batu Caves,\n68100 Batu Caves, Selangor',
        whatsapp_number: '60123456789',
        google_maps_query: 'Batu Caves Industrial Area Selangor',
        operating_hours: 'Mon–Sat 8am–6pm',
        languages: 'English, Bahasa Malaysia, Mandarin',
        specialisations: 'Concrete cutting, Diamond blades',
      },
      {
        name: 'Precision Diamond Supply',
        area: 'Kuala Lumpur',
        address: 'Lot 5, Jalan Chan Sow Lin,\n55200 Kuala Lumpur',
        whatsapp_number: '60198765432',
        google_maps_query: 'Jalan Chan Sow Lin Kuala Lumpur',
        operating_hours: 'Mon–Fri 9am–5:30pm',
        languages: 'English, Mandarin',
        specialisations: 'Core drilling, Granite cutting',
      },
      {
        name: 'Southern Blade Centre',
        area: 'Johor',
        address: 'No. 8A, Jalan Skudai,\n81300 Johor Bahru, Johor',
        whatsapp_number: '60167891234',
        google_maps_query: 'Jalan Skudai Johor Bahru',
        operating_hours: 'Mon–Sat 8:30am–5:30pm',
        languages: 'English, Bahasa Malaysia',
        specialisations: '',
      },
    ],
  },

  render: ({
    heroEyebrow,
    heroHeadline,
    heroLede,
    filterLabel,
    filterAllLabel,
    emptyHeadline,
    emptyBody,
    emptyCtaLabel,
    dealers,
    puck,
  }) => {
    const s = (puck?.metadata?.settings as Settings) || {}
    const waNumber = s.whatsapp_number || ''

    const dealerRows = (dealers as DealerEntry[]) || []

    const copy: BrotherhoodCopy = {
      filterLabel: filterLabel as string,
      allLabel: filterAllLabel as string,
      emptyHeadline: emptyHeadline as string,
      emptyBody: emptyBody as string,
      emptyCtaLabel: emptyCtaLabel as string,
    }

    return (
      <>
        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="bg-navy text-paper">
          <div className="mx-auto max-w-[1280px] px-6 pt-32 pb-24 lg:px-8 lg:pt-40 lg:pb-32">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
              {heroEyebrow}
            </p>
            <h1 className="mt-6 max-w-[22ch] font-fraunces text-[clamp(40px,6vw,84px)] font-normal leading-[1.02] tracking-[-0.025em] text-paper">
              {heroHeadline}
            </h1>
            <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-ink-faint">
              {heroLede}
            </p>
          </div>
        </section>

        {/* ── DIRECTORY BODY ────────────────────────────────────────────── */}
        <section className="bg-paper">
          <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
            <BrotherhoodSection
              dealers={dealerRows}
              whatsappNumber={waNumber}
              copy={copy}
            />
          </div>
        </section>
      </>
    )
  },
}

export const brotherhoodPageBlocks = {
  BrotherhoodPage,
} satisfies Record<string, ComponentConfig>

export const brotherhoodPageBlockNames = Object.keys(brotherhoodPageBlocks)
