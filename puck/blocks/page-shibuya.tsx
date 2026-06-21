/**
 * Bespoke locked PAGE block for the Shibuya core-drill page — same model as
 * CareerPage (puck/blocks/pages.tsx): the render reproduces the exact markup of
 * the live Shibuya page (components/pages/ShibuyaClient.tsx), with all copy as
 * editable fields and the machine roster + stat strips as editable arrays. The
 * layout is locked (one block per page, can't be moved/duplicated/deleted).
 *
 * Interactive regions (machine tab switcher + spec table, demo-request form)
 * are extracted into components/puck/ShibuyaSection.tsx ('use client'). This
 * block's render stays PURE (no hooks/handlers) and renders those client
 * components, passing editable copy + arrays as props.
 *
 * Two-tier rule: NO PRICE / no catalogue product card is rendered. The Shibuya
 * machines are brand/editorial content seeded from the current admin defaults,
 * NOT wired to the priced catalogue.
 *
 * Settings-derived bits (WhatsApp number) arrive via Puck `metadata.settings`.
 */
import type { ComponentConfig } from '@puckeditor/core'
import {
  ShibuyaLineupSection,
  ShibuyaDemoSection,
  type LineupMachine,
  type SpecLabels,
  type DemoFormLabels,
} from '@/components/puck/ShibuyaSection'

const LOCKED = { drag: false, duplicate: false, delete: false } as const

type Settings = { whatsapp_number?: string; contact_email_careers?: string }

const waHref = (n?: string) => {
  const d = (n || '').replace(/\D/g, '')
  return d.length >= 8 ? `https://wa.me/${d}` : '#'
}

type Stat = { number: React.ReactNode; label: React.ReactNode }
type ServicePoint = {
  number: React.ReactNode
  label: React.ReactNode
  title: React.ReactNode
  body: React.ReactNode
}

const ShibuyaPage: ComponentConfig = {
  label: 'Page · Shibuya',
  permissions: LOCKED,
  fields: {
    // Hero
    heroBadge: { type: 'text', label: 'Hero · badge', contentEditable: true },
    heroBadgeSince: { type: 'text', label: 'Hero · badge (since)', contentEditable: true },
    heroLine1: { type: 'text', label: 'Hero · headline line 1', contentEditable: true },
    heroEmphasis: { type: 'text', label: 'Hero · headline emphasis', contentEditable: true },
    heroSub: { type: 'textarea', label: 'Hero · subheadline', contentEditable: true },
    heroPrimaryCta: { type: 'text', label: 'Hero · primary button', contentEditable: true },
    heroSecondaryCta: { type: 'text', label: 'Hero · secondary button', contentEditable: true },

    // Trust bar
    trustStats: {
      type: 'array',
      label: 'Trust bar stats',
      arrayFields: {
        number: { type: 'text', label: 'Number', contentEditable: true },
        label: { type: 'textarea', label: 'Label (use line breaks)', contentEditable: true },
      },
      defaultItemProps: { number: '0', label: 'Label' },
    },

    // Machine story
    storyEyebrow: { type: 'text', label: 'Story · eyebrow', contentEditable: true },
    storyHeadline: { type: 'text', label: 'Story · headline', contentEditable: true },
    storyIntro: { type: 'textarea', label: 'Story · intro', contentEditable: true },
    col1Tag: { type: 'text', label: 'Story · col 1 tag', contentEditable: true },
    col1Title: { type: 'text', label: 'Story · col 1 title', contentEditable: true },
    col1Body: { type: 'textarea', label: 'Story · col 1 body', contentEditable: true },
    col1Country: { type: 'text', label: 'Story · col 1 country', contentEditable: true },
    col2Tag: { type: 'text', label: 'Story · col 2 tag', contentEditable: true },
    col2Title: { type: 'text', label: 'Story · col 2 title', contentEditable: true },
    col2Body: { type: 'textarea', label: 'Story · col 2 body', contentEditable: true },
    col2Country: { type: 'text', label: 'Story · col 2 country', contentEditable: true },

    // Machine lineup
    lineupEyebrow: { type: 'text', label: 'Lineup · eyebrow', contentEditable: true },
    lineupHeadline: { type: 'text', label: 'Lineup · headline', contentEditable: true },
    keyFeaturesLabel: { type: 'text', label: 'Lineup · "key features" label', contentEditable: true },
    demoButtonLabel: { type: 'text', label: 'Lineup · demo button label', contentEditable: true },
    downloadSpecSheetLabel: { type: 'text', label: 'Lineup · spec-sheet button label', contentEditable: true },
    machines: {
      type: 'array',
      label: 'Machines',
      arrayFields: {
        modelId: { type: 'text', label: 'Model ID (tab key)', contentEditable: true },
        modelName: { type: 'text', label: 'Model name', contentEditable: true },
        tagline: { type: 'text', label: 'Tagline', contentEditable: true },
        description: { type: 'textarea', label: 'Description', contentEditable: true },
        maxDiameter: { type: 'text', label: 'Max diameter', contentEditable: true },
        anchor: { type: 'text', label: 'Anchor', contentEditable: true },
        motorPower: { type: 'text', label: 'Motor power', contentEditable: true },
        voltage: { type: 'text', label: 'Voltage', contentEditable: true },
        feedSystem: { type: 'text', label: 'Feed system', contentEditable: true },
        maxDepth: { type: 'text', label: 'Max depth', contentEditable: true },
        holeRunout: { type: 'text', label: 'Hole runout', contentEditable: true },
        weight: { type: 'text', label: 'Weight', contentEditable: true },
        bitPairing: { type: 'text', label: 'Coolman bit pairing', contentEditable: true },
        rpmRange: { type: 'text', label: 'RPM range', contentEditable: true },
        stockNote: { type: 'text', label: 'Stock / lead-time note', contentEditable: true },
        features: {
          type: 'array',
          label: 'Key features',
          arrayFields: {
            feature: { type: 'text', label: 'Feature', contentEditable: true },
          },
          defaultItemProps: { feature: 'Feature' },
        },
      },
      defaultItemProps: {
        modelId: 'model',
        modelName: 'Model',
        tagline: '',
        description: '',
        maxDiameter: '',
        anchor: '',
        motorPower: '',
        voltage: '',
        feedSystem: '',
        maxDepth: '',
        holeRunout: '',
        weight: '',
        bitPairing: '',
        rpmRange: '',
        stockNote: '',
        features: [],
      },
    },

    // Spec table labels
    maxDiameterLabel: { type: 'text', label: 'Spec label · max diameter', contentEditable: true },
    anchorLabel: { type: 'text', label: 'Spec label · anchor', contentEditable: true },
    motorPowerLabel: { type: 'text', label: 'Spec label · motor power', contentEditable: true },
    voltageLabel: { type: 'text', label: 'Spec label · voltage', contentEditable: true },
    feedSystemLabel: { type: 'text', label: 'Spec label · feed system', contentEditable: true },
    maxDepthLabel: { type: 'text', label: 'Spec label · max depth', contentEditable: true },
    holeRunoutLabel: { type: 'text', label: 'Spec label · hole runout', contentEditable: true },
    weightLabel: { type: 'text', label: 'Spec label · weight', contentEditable: true },
    bitPairingLabel: { type: 'text', label: 'Spec label · bit pairing', contentEditable: true },
    rpmRangeLabel: { type: 'text', label: 'Spec label · RPM range', contentEditable: true },

    // Service section
    serviceEyebrow: { type: 'text', label: 'Service · eyebrow', contentEditable: true },
    serviceHeadline: { type: 'text', label: 'Service · headline', contentEditable: true },
    serviceBody: { type: 'textarea', label: 'Service · body', contentEditable: true },
    serviceStats: {
      type: 'array',
      label: 'Service stats',
      arrayFields: {
        number: { type: 'text', label: 'Number', contentEditable: true },
        label: { type: 'textarea', label: 'Label (use line breaks)', contentEditable: true },
      },
      defaultItemProps: { number: '0', label: 'Label' },
    },
    servicePoints: {
      type: 'array',
      label: 'Service points',
      arrayFields: {
        number: { type: 'text', label: 'Number', contentEditable: true },
        label: { type: 'text', label: 'Label', contentEditable: true },
        title: { type: 'text', label: 'Title', contentEditable: true },
        body: { type: 'textarea', label: 'Body', contentEditable: true },
      },
      defaultItemProps: { number: '00', label: 'Label', title: 'Title', body: 'Body.' },
    },

    // Demo form labels
    demoTitle: { type: 'text', label: 'Demo · section title', contentEditable: true },
    demoName: { type: 'text', label: 'Demo · name label', contentEditable: true },
    demoCompany: { type: 'text', label: 'Demo · company label', contentEditable: true },
    demoPhone: { type: 'text', label: 'Demo · phone label', contentEditable: true },
    demoModel: { type: 'text', label: 'Demo · model label', contentEditable: true },
    demoModelPlaceholder: { type: 'text', label: 'Demo · model placeholder', contentEditable: true },
    demoProject: { type: 'text', label: 'Demo · project label', contentEditable: true },
    demoNotes: { type: 'text', label: 'Demo · notes label', contentEditable: true },
    demoSubmit: { type: 'text', label: 'Demo · submit button', contentEditable: true },
    demoSuccessTitle: { type: 'text', label: 'Demo · success title', contentEditable: true },
    demoSuccessBody: { type: 'textarea', label: 'Demo · success body', contentEditable: true },
    demoError: { type: 'textarea', label: 'Demo · error message', contentEditable: true },

    // CTA strip
    ctaEyebrow: { type: 'text', label: 'CTA · eyebrow', contentEditable: true },
    ctaHeadline: { type: 'text', label: 'CTA · headline', contentEditable: true },
    ctaBody: { type: 'textarea', label: 'CTA · body', contentEditable: true },
    ctaPrimaryLabel: { type: 'text', label: 'CTA · primary button', contentEditable: true },
    ctaSecondaryLabel: { type: 'text', label: 'CTA · secondary button', contentEditable: true },
  },
  defaultProps: {
    heroBadge: 'Coolman × Shibuya Tools · Hiroshima',
    heroBadgeSince: 'Sole MY Partner Since 2014',
    heroLine1: 'The best machine in the world.',
    heroEmphasis: 'The bond built for here.',
    heroSub:
      'Shibuya Tools, Hiroshima, has built precision core drilling machines since 1952. Coolman has built diamond segments calibrated for Malaysian aggregate since 1998. The partnership matches the machine to the ground — and the ground to the machine.',
    heroPrimaryCta: 'THE RANGE',
    heroSecondaryCta: 'Request a Shibuya Demo',

    trustStats: [
      { number: '300+', label: 'Shibuya machines\nin Malaysia' },
      { number: '2014', label: 'Sole authorised\nMalaysian partner' },
      { number: '3 yr', label: 'Full mechanical\nwarranty' },
      { number: '48 h', label: 'Replacement parts\nfrom PJ workshop' },
    ],

    storyEyebrow: 'Two workshops, one cut',
    storyHeadline: 'The machine is Japanese. The bond is Malaysian.',
    storyIntro:
      'Each side does what the other will not. The result is a machine-and-blade pairing where neither half has to compromise for the other.',
    col1Tag: 'Shibuya · Since 1952',
    col1Title: 'The machine.',
    col1Body:
      'Shibuya core drilling machines are precision instruments. Hand-built in Hiroshima. Servo-controlled feed rate, hydraulic counterbalance, magnetic-anchor and vacuum-anchor base systems, hole-runout tolerances measured in the tens of microns.\n\nWhat has not changed across decades of Shibuya engineering: the machine is not the wear part. The blade is.',
    col1Country: 'Hiroshima, Japan',
    col2Tag: 'Coolman · Since 1998',
    col2Title: 'The bond.',
    col2Body:
      'A Shibuya rig fitted with a European-bond core bit on a KL podium will run with mechanical precision and a glazed bit. The fault is not the machine. The fault is that the bond holding the diamond was not calibrated for the ground.\n\nCoolman builds the core bit the Shibuya rig deserves. Cobalt blend formulated against KL crushed granite, MRT3 segment work, Genting granite stocks, Pahang aggregate.',
    col2Country: 'Selangor, Malaysia',

    lineupEyebrow: 'THE RANGE',
    lineupHeadline: 'Choose Your Machine',
    keyFeaturesLabel: 'KEY FEATURES',
    demoButtonLabel: 'Request a Shibuya Demo',
    downloadSpecSheetLabel: 'Download Spec Sheet',
    machines: [
      {
        modelId: 'ts-405',
        modelName: 'TS-405',
        tagline: 'Compact rig · MEP cores.',
        description:
          'Hand-portable core drill for service penetrations up to 152 mm. Vacuum-anchor base, single-speed motor. The rig that pairs with most renovation and fit-out work.',
        maxDiameter: '25–152 mm',
        anchor: 'Vacuum or stud',
        motorPower: '',
        voltage: '',
        feedSystem: '',
        maxDepth: '',
        holeRunout: '',
        weight: '14.2 kg',
        bitPairing: '',
        rpmRange: '',
        stockNote: '',
        features: [],
      },
      {
        modelId: 'ts-605',
        modelName: 'TS-605',
        tagline: 'Structural rig · podium cores.',
        description:
          'Three-speed motor, servo feed, hydraulic counterbalance. For cores 152–400 mm through reinforced podium and basement slabs. The MRT3 contractor standard.',
        maxDiameter: '152–400 mm',
        anchor: 'Stud or magnetic',
        motorPower: '',
        voltage: '',
        feedSystem: '',
        maxDepth: '',
        holeRunout: '',
        weight: '38.6 kg',
        bitPairing: '',
        rpmRange: '',
        stockNote: '',
        features: [],
      },
      {
        modelId: 'ts-255',
        modelName: 'TS-255',
        tagline: 'Mid-range rig · general cores.',
        description:
          'Mid-range core drill for cores up to 255 mm. Suitable for general construction penetrations, slab openings, and service cores. Versatile anchor options.',
        maxDiameter: 'Up to 255 mm',
        anchor: 'Vacuum or stud',
        motorPower: '',
        voltage: '',
        feedSystem: '',
        maxDepth: '',
        holeRunout: '',
        weight: '',
        bitPairing: '',
        rpmRange: '',
        stockNote: '',
        features: [],
      },
    ],

    maxDiameterLabel: 'Max Diameter',
    anchorLabel: 'Anchor',
    motorPowerLabel: 'Motor Power',
    voltageLabel: 'Voltage',
    feedSystemLabel: 'Feed System',
    maxDepthLabel: 'Max Drilling Depth',
    holeRunoutLabel: 'Hole Runout',
    weightLabel: 'Weight',
    bitPairingLabel: 'Coolman Bit Pairing',
    rpmRangeLabel: 'RPM Range',

    serviceEyebrow: 'In-house service · Since 2014',
    serviceHeadline: 'Two trained Shibuya technicians. Same workshop, same building.',
    serviceBody:
      'The Shibuya service contract is not subcontracted. Every machine sold in Malaysia is serviced in the Selangor workshop by technicians factory-trained in Hiroshima. Replacement parts are stocked locally — not air-freighted on demand.',
    serviceStats: [
      { number: '3 yr', label: 'Full mechanical warranty\nmotor, gearbox, feed assembly' },
      { number: '48 h', label: 'Parts turnaround\nfrom PJ workshop stock' },
      { number: '2', label: 'Factory-trained Shibuya\ntechnicians on staff' },
    ],
    servicePoints: [
      {
        number: '01',
        label: 'Warranty',
        title: 'Three-year full mechanical warranty.',
        body: 'Every Shibuya machine sold through Coolman carries a three-year warranty on the motor, gearbox, and feed assembly. Parts and labour included. Loan unit provided during any repair period exceeding 48 hours.',
      },
      {
        number: '02',
        label: 'Calibration',
        title: 'Annual factory calibration, complimentary for three years.',
        body: 'Free annual calibration for the first three years of ownership. Feed rate, anchor tolerance, motor draw under load. Calibration certificate issued after each session — accepted for compliance documentation on MRT, LRT, and government contracts.',
      },
      {
        number: '03',
        label: 'Parts',
        title: 'Replacement parts in 48 hours.',
        body: 'The Selangor workshop stocks replacement parts for the TS-255, TS-405, and TS-605 lines. Contact us for availability on other models. Air freight from Hiroshima for non-stocked parts: seven working days maximum.',
      },
      {
        number: '04',
        label: 'Training',
        title: 'On-site operator training, no charge, up to two operators.',
        body: 'Every new machine purchase includes a half-day operator training session. Conducted at the Selangor workshop or at your site — your choice. Covers rig setup, vacuum and stud anchoring, feed-rate selection, and water management.',
      },
    ],

    demoTitle: 'Request a Shibuya Demo',
    demoName: 'Your Name',
    demoCompany: 'Company',
    demoPhone: 'Phone Number',
    demoModel: 'Machine Model of Interest',
    demoModelPlaceholder: 'Select a model…',
    demoProject: 'Project / Application',
    demoNotes: 'Additional Notes',
    demoSubmit: 'Send Request',
    demoSuccessTitle: 'Request received',
    demoSuccessBody: 'Our team will contact you within one business day to arrange the demo.',
    demoError: 'Something went wrong. Please try again or contact us via WhatsApp.',

    ctaEyebrow: 'Order, service, or training',
    ctaHeadline: 'One conversation for the machine, the bit, and the cut.',
    ctaBody:
      'Whether you are buying a new Shibuya rig, sending one in for annual calibration, or wondering which line fits a job — the engineering desk handles all of it. Same number.',
    ctaPrimaryLabel: 'Open WhatsApp →',
    ctaSecondaryLabel: 'All channels',
  },
  render: (props) => {
    const {
      heroBadge,
      heroBadgeSince,
      heroLine1,
      heroEmphasis,
      heroSub,
      heroPrimaryCta,
      heroSecondaryCta,
      trustStats,
      storyEyebrow,
      storyHeadline,
      storyIntro,
      col1Tag,
      col1Title,
      col1Body,
      col1Country,
      col2Tag,
      col2Title,
      col2Body,
      col2Country,
      lineupEyebrow,
      lineupHeadline,
      keyFeaturesLabel,
      demoButtonLabel,
      downloadSpecSheetLabel,
      machines,
      maxDiameterLabel,
      anchorLabel,
      motorPowerLabel,
      voltageLabel,
      feedSystemLabel,
      maxDepthLabel,
      holeRunoutLabel,
      weightLabel,
      bitPairingLabel,
      rpmRangeLabel,
      serviceEyebrow,
      serviceHeadline,
      serviceBody,
      serviceStats,
      servicePoints,
      demoTitle,
      demoName,
      demoCompany,
      demoPhone,
      demoModel,
      demoModelPlaceholder,
      demoProject,
      demoNotes,
      demoSubmit,
      demoSuccessTitle,
      demoSuccessBody,
      demoError,
      ctaEyebrow,
      ctaHeadline,
      ctaBody,
      ctaPrimaryLabel,
      ctaSecondaryLabel,
      puck,
    } = props

    const s = (puck?.metadata?.settings as Settings) || {}
    const wa = waHref(s.whatsapp_number)

    const trustRows = (trustStats as Stat[]) || []
    const serviceStatRows = (serviceStats as Stat[]) || []
    const servicePointRows = (servicePoints as ServicePoint[]) || []
    const machineRows = (machines as LineupMachine[]) || []

    // Plain-string copies for the interactive client components (these props
    // are not contentEditable inside the client islands — they're edited via
    // the same array/text fields above and rendered there).
    const specLabels: SpecLabels = {
      maxDiameter: String(maxDiameterLabel ?? ''),
      anchor: String(anchorLabel ?? ''),
      motorPower: String(motorPowerLabel ?? ''),
      voltage: String(voltageLabel ?? ''),
      feedSystem: String(feedSystemLabel ?? ''),
      maxDepth: String(maxDepthLabel ?? ''),
      holeRunout: String(holeRunoutLabel ?? ''),
      weight: String(weightLabel ?? ''),
      bitPairing: String(bitPairingLabel ?? ''),
      rpmRange: String(rpmRangeLabel ?? ''),
    }

    const demoLabels: DemoFormLabels = {
      title: String(demoTitle ?? ''),
      name: String(demoName ?? ''),
      company: String(demoCompany ?? ''),
      phone: String(demoPhone ?? ''),
      model: String(demoModel ?? ''),
      modelPlaceholder: String(demoModelPlaceholder ?? ''),
      project: String(demoProject ?? ''),
      notes: String(demoNotes ?? ''),
      submit: String(demoSubmit ?? ''),
      successTitle: String(demoSuccessTitle ?? ''),
      successBody: String(demoSuccessBody ?? ''),
      error: String(demoError ?? ''),
    }

    return (
      <>
        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="bg-paper py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-10 inline-flex items-center gap-3 border border-rule px-4 py-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-navy">{heroBadge}</span>
              <span className="h-3 w-px bg-rule" />
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">{heroBadgeSince}</span>
            </div>

            <h1 className="font-fraunces text-[clamp(36px,5vw,68px)] font-normal leading-[1.04] tracking-[-0.025em] text-navy">
              {heroLine1}
              <br />
              <em className="not-italic text-accent">{heroEmphasis}</em>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">{heroSub}</p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#lineup"
                className="inline-flex min-h-[48px] items-center gap-2 bg-navy px-8 py-3 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
              >
                {heroPrimaryCta}
              </a>
              <a
                href="#demo"
                className="inline-flex min-h-[48px] items-center gap-2 border border-rule px-8 py-3 text-sm font-semibold text-navy transition-colors hover:border-navy"
              >
                {heroSecondaryCta}
              </a>
            </div>
          </div>
        </section>

        {/* ── TRUST BAR ─────────────────────────────────────────────────────── */}
        <section className="border-y border-rule bg-paper">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-2 divide-x divide-rule lg:grid-cols-4">
              {trustRows.map((stat, i) => (
                <div key={i} className="px-6 py-8 text-center lg:py-10">
                  <p className="font-mono text-[26px] font-bold leading-none text-navy tabular-nums">{stat.number}</p>
                  <p className="mt-2 whitespace-pre-line font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MACHINE STORY ─────────────────────────────────────────────────── */}
        <section className="bg-paper py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{storyEyebrow}</p>
            <h2 className="mt-4 max-w-2xl font-fraunces text-[clamp(28px,3.2vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
              {storyHeadline}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">{storyIntro}</p>

            {/* Story pair */}
            <div className="mt-12 grid gap-px border border-rule bg-rule lg:grid-cols-2">
              <div className="bg-paper p-8 lg:p-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">{col1Tag}</p>
                <h3 className="mt-3 font-fraunces text-2xl font-normal text-navy">{col1Title}</h3>
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-muted">{col1Body}</p>
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">{col1Country}</p>
              </div>
              <div className="bg-paper p-8 lg:p-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">{col2Tag}</p>
                <h3 className="mt-3 font-fraunces text-2xl font-normal text-navy">{col2Title}</h3>
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-muted">{col2Body}</p>
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">{col2Country}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── MACHINE LINEUP (interactive island) ───────────────────────────── */}
        <ShibuyaLineupSection
          eyebrow={String(lineupEyebrow ?? '')}
          headline={String(lineupHeadline ?? '')}
          machines={machineRows}
          specLabels={specLabels}
          keyFeaturesLabel={String(keyFeaturesLabel ?? '')}
          demoLabel={String(demoButtonLabel ?? '')}
          downloadSpecSheetLabel={String(downloadSpecSheetLabel ?? '')}
        />

        {/* ── SERVICE ───────────────────────────────────────────────────────── */}
        <section className="border-t border-rule bg-paper py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{serviceEyebrow}</p>
            <h2 className="mt-4 max-w-2xl font-fraunces text-[clamp(28px,3.2vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
              {serviceHeadline}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">{serviceBody}</p>

            {/* Stats bar */}
            <div className="mt-10 grid grid-cols-3 divide-x divide-rule border border-rule">
              {serviceStatRows.map((stat, i) => (
                <div key={i} className="px-6 py-6 text-center">
                  <p className="font-mono text-[26px] font-bold leading-none text-navy tabular-nums">{stat.number}</p>
                  <p className="mt-2 whitespace-pre-line font-mono text-[10px] uppercase tracking-[0.10em] text-ink-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Photos — placeholders (uploads are not editable inside the locked block) */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden bg-[#EFF4FB]">
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-navy/20">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                      <rect x="4" y="9" width="28" height="21" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="18" cy="19" r="5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M12 9V7a2 2 0 012-2h8a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Numbered service points */}
            <div className="mt-16 space-y-8">
              {servicePointRows.map((sp, i) => (
                <div key={i} className="grid grid-cols-[140px_1fr] gap-6">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{sp.number}</p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">{sp.label}</p>
                  </div>
                  <div>
                    <h3 className="font-fraunces text-lg font-normal text-navy">{sp.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{sp.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DEMO FORM (interactive island) ────────────────────────────────── */}
        <ShibuyaDemoSection
          headline={String(storyHeadline ?? '')}
          body={String(heroSub ?? '')}
          machines={machineRows.map((m) => ({ modelId: m.modelId, modelName: m.modelName }))}
          labels={demoLabels}
        />

        {/* ── CTA STRIP ─────────────────────────────────────────────────────── */}
        <section className="bg-navy py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">{ctaEyebrow}</p>
                <h2 className="mt-4 font-fraunces text-[clamp(28px,3.2vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-paper">
                  {ctaHeadline}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-paper/60">{ctaBody}</p>
              </div>
              <div className="flex flex-col gap-3 lg:items-end">
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 bg-paper px-8 py-3 text-sm font-semibold text-navy transition-opacity hover:opacity-90 lg:w-auto lg:min-w-[220px]"
                >
                  {ctaPrimaryLabel}
                </a>
                <a
                  href="/contact"
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 border border-paper/30 px-8 py-3 text-sm font-semibold text-paper transition-colors hover:border-paper/60 lg:w-auto lg:min-w-[220px]"
                >
                  {ctaSecondaryLabel}
                </a>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  },
}

export { ShibuyaPage }
