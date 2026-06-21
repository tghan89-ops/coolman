/**
 * Locked PAGE block for the Heritage page.
 * Pattern mirrors page-about.tsx / pages.tsx (CareerPage).
 * Layout locked; all editorial copy editable; layout structure fixed.
 * No Settings-derived values — Heritage page has no WA/email CTAs.
 *
 * The Chinese pull-quote (生意不是比谁跑得久，而是谁撑得久) is a FIXED design
 * element — intentionally not editable, not translated. Rendered verbatim
 * as the ChinesePullquote 'heritage' variant exactly as the live page does.
 * See CLAUDE.md hard rules and Pullquote.tsx ChinesePullquote.
 *
 * No price / product card / SKU / cart — safe under the two-tier hard rule.
 * No interactive UI (no form/state) — pure render, no 'use client' needed.
 */
import type { ComponentConfig } from '@puckeditor/core'

const LOCKED = { drag: false, duplicate: false, delete: false } as const

// The 2007 founding event is the central year on the timeline — highlighted.
const HIGHLIGHT_YEAR = '2007'

// ─── Inline pure-render copies of the shared components ─────────────────────
// These are reproduced inline (rather than imported) because the Puck render
// must be pure/server-safe and the originals carry no client state — they are
// just JSX helpers. Avoids adding 'use client' to the block file.

function DropCapInline({ children, className }: { children: string; className?: string }) {
  if (!children || !children.trim()) return null
  const cls = [
    'text-base leading-relaxed text-ink',
    '[&::first-letter]:font-fraunces',
    '[&::first-letter]:text-[5rem]',
    '[&::first-letter]:float-left',
    '[&::first-letter]:leading-[0.8]',
    '[&::first-letter]:mr-2',
    '[&::first-letter]:mt-2',
    '[&::first-letter]:text-navy',
    '[&::first-letter]:font-semibold',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <p className={cls} style={{ fontSize: '16px', lineHeight: '1.75' }}>
      {children}
    </p>
  )
}

function TimelineEntryInline({
  year,
  event,
  body,
  note,
  isHighlight,
}: {
  year: string
  event: string
  body?: string
  note?: string
  isHighlight?: boolean
}) {
  const rowClass = [
    'grid grid-cols-[6rem_1fr] sm:grid-cols-[8rem_1fr] gap-6 sm:gap-10 py-6 border-b border-rule',
    isHighlight ? 'border-l-2 border-l-accent pl-4 sm:pl-6' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const yearClass = [
    'font-mono leading-none tracking-tight text-[1.5rem] sm:text-[2rem]',
    isHighlight ? 'text-accent' : 'text-navy',
  ].join(' ')

  const eventClass = [
    'text-base sm:text-[1.0625rem] leading-relaxed',
    isHighlight ? 'text-navy font-medium' : 'text-navy',
  ].join(' ')

  return (
    <div className={rowClass}>
      <div className={yearClass}>{year}</div>
      <div className="flex flex-col gap-2">
        <p className={eventClass}>{event}</p>
        {body ? (
          <p className="text-[0.9375rem] leading-[1.65] text-ink-muted">{body}</p>
        ) : null}
        {note ? (
          <p className="font-fraunces italic text-[0.8125rem] leading-snug text-ink-faint">{note}</p>
        ) : null}
      </div>
    </div>
  )
}

// Fixed Chinese pull-quote — rendered exactly as the live page's
// <ChinesePullquote quote="heritage" /> with the same markup from Pullquote.tsx.
// This is a locked design element: NOT editable, NOT translated, NOT toggled.
function ChinesePullquoteHeritage() {
  return (
    <figure lang="zh" className="text-center py-20 lg:py-28">
      <div className="mx-auto mb-10 h-px w-12 bg-rule" />
      <p
        className={[
          'font-chinese text-navy leading-[1.15] tracking-[0.06em]',
          'text-[clamp(2.25rem,6.5vw,5.5rem)]',
        ].join(' ')}
      >
        生意不是比谁跑得久，而是谁撑得久
      </p>
      <figcaption className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
        Business isn&apos;t about who runs the longest — it&apos;s about who endures.
      </figcaption>
      <div className="mx-auto mt-10 h-px w-12 bg-rule" />
    </figure>
  )
}

// ─── HeritagePage block ──────────────────────────────────────────────────────

export const HeritagePage: ComponentConfig = {
  label: 'Page · Heritage',
  permissions: LOCKED,

  fields: {
    // ── Hero ────────────────────────────────────────────────────────────────
    heroEyebrow: { type: 'text', label: 'Hero eyebrow', contentEditable: true },
    heroHeadline: { type: 'text', label: 'Hero headline', contentEditable: true },
    heroLede: { type: 'textarea', label: 'Hero lede', contentEditable: true },

    // ── Section: PJ, 2007 ───────────────────────────────────────────────────
    pj2007Eyebrow: { type: 'text', label: 'PJ 2007 · eyebrow', contentEditable: true },
    pj2007Headline: { type: 'text', label: 'PJ 2007 · headline', contentEditable: true },
    pj2007Body: {
      type: 'array',
      label: 'PJ 2007 · paragraphs',
      arrayFields: {
        para: { type: 'textarea', label: 'Paragraph', contentEditable: true },
      },
      defaultItemProps: { para: '' },
    },

    // ── Section: The founding decision ──────────────────────────────────────
    foundingEyebrow: { type: 'text', label: 'Founding · eyebrow', contentEditable: true },
    foundingHeadline: { type: 'text', label: 'Founding · headline', contentEditable: true },
    foundingBody: {
      type: 'array',
      label: 'Founding · paragraphs',
      arrayFields: {
        para: { type: 'textarea', label: 'Paragraph', contentEditable: true },
      },
      defaultItemProps: { para: '' },
    },

    // ── Section: The day it stopped being a workshop ─────────────────────────
    workshopEyebrow: { type: 'text', label: 'Workshop day · eyebrow', contentEditable: true },
    workshopHeadline: { type: 'text', label: 'Workshop day · headline', contentEditable: true },
    workshopNote: { type: 'text', label: 'Workshop day · italic note (optional)', contentEditable: true },
    workshopBody: {
      type: 'array',
      label: 'Workshop day · paragraphs',
      arrayFields: {
        para: { type: 'textarea', label: 'Paragraph', contentEditable: true },
      },
      defaultItemProps: { para: '' },
    },

    // ── Section: Twelve years with Shibuya ──────────────────────────────────
    shibuyaEyebrow: { type: 'text', label: 'Shibuya · eyebrow', contentEditable: true },
    shibuyaHeadline: { type: 'text', label: 'Shibuya · headline', contentEditable: true },
    shibuyaBody: {
      type: 'array',
      label: 'Shibuya · paragraphs',
      arrayFields: {
        para: { type: 'textarea', label: 'Paragraph', contentEditable: true },
      },
      defaultItemProps: { para: '' },
    },

    // (Chinese pull-quote is FIXED here — no field)

    // ── Section: The hardest year ────────────────────────────────────────────
    hardestEyebrow: { type: 'text', label: 'Hardest year · eyebrow', contentEditable: true },
    hardestHeadline: { type: 'text', label: 'Hardest year · headline', contentEditable: true },
    hardestBody: {
      type: 'array',
      label: 'Hardest year · paragraphs',
      arrayFields: {
        para: { type: 'textarea', label: 'Paragraph', contentEditable: true },
      },
      defaultItemProps: { para: '' },
    },

    // ── Section: Twenty years from now ──────────────────────────────────────
    twentyEyebrow: { type: 'text', label: 'Twenty years · eyebrow', contentEditable: true },
    twentyHeadline: { type: 'text', label: 'Twenty years · headline', contentEditable: true },
    twentyBody: {
      type: 'array',
      label: 'Twenty years · paragraphs',
      arrayFields: {
        para: { type: 'textarea', label: 'Paragraph', contentEditable: true },
      },
      defaultItemProps: { para: '' },
    },

    // ── Section: Timeline ────────────────────────────────────────────────────
    timelineEyebrow: { type: 'text', label: 'Timeline · eyebrow', contentEditable: true },
    timelineHeadline: { type: 'text', label: 'Timeline · headline', contentEditable: true },
    timelineEvents: {
      type: 'array',
      label: 'Timeline events',
      arrayFields: {
        year: { type: 'text', label: 'Year', contentEditable: true },
        title: { type: 'text', label: 'Event title', contentEditable: true },
        body: { type: 'textarea', label: 'Event body', contentEditable: true },
        note: { type: 'text', label: 'Italic note (optional)', contentEditable: true },
      },
      defaultItemProps: { year: 'YYYY', title: 'Event', body: '', note: '' },
    },
  },

  defaultProps: {
    // ── Hero ────────────────────────────────────────────────────────────────
    heroEyebrow: 'Heritage',
    heroHeadline:
      'Coolman, since 2007. Nineteen years of cuts that taught us how to build the blade.',
    heroLede:
      'A short history of a Malaysian diamond tools company. Founded in Selangor by a tradesman who had been in the cutting trade since 1998.',

    // ── PJ 2007 ─────────────────────────────────────────────────────────────
    pj2007Eyebrow: 'PJ, 2007',
    pj2007Headline: 'A workshop on a side road in Selangor.',
    pj2007Body: [
      {
        para: 'Coolman started in a single rented unit in Selangor in 2007. Two segment presses, a bench, and a phone that rang too often. Alan, the founder, had spent nine years in the cutting trade and had finally heard one complaint too many about blades that did not fit the rock.',
      },
      { para: 'The first year was quiet. The second was not. By the end of 2008, the workshop was running two shifts.' },
    ],

    // ── Founding ─────────────────────────────────────────────────────────────
    foundingEyebrow: 'The founding decision',
    foundingHeadline: 'After nine years in the trade, a tradesman started his own.',
    foundingBody: [
      {
        para: "Alan had been selling other companies' blades since 1998. He had watched the same three things go wrong on site, again and again. Price as the proxy for value. Dealers who had never held a blade. Imported blades that performed in Japan and failed in Selangor.",
      },
      {
        para: "In 2007, he stopped explaining other people's blades and started making his own. Coolman is the result.",
      },
    ],

    // ── Workshop day ─────────────────────────────────────────────────────────
    workshopEyebrow: 'The day it stopped being a workshop',
    workshopHeadline: 'A piling job that ended in a redesign.',
    workshopNote: 'Year TBC. Alan to supply.',
    workshopBody: [
      {
        para: "A contractor in Shah Alam called at 11pm. The blade we'd sold him that morning had not made it through the second pile. Alan drove out. He watched the cut. The aggregate was sharper than the spec had predicted. The bond was wrong.",
      },
      {
        para: 'The blade was redesigned over the next four weeks. The new formulation, sandwich cobalt, became what the CM-X line is built on today. The workshop became a manufacturer the day Alan accepted that the contractor was right and the spec sheet was wrong. (Year TBC. Alan to supply.)',
      },
    ],

    // ── Shibuya ──────────────────────────────────────────────────────────────
    shibuyaEyebrow: 'Twelve years with Shibuya',
    shibuyaHeadline: 'Signed 2014. Renewed every year since.',
    shibuyaBody: [
      {
        para: 'In 2014 Coolman signed the exclusive Malaysian distribution agreement for Shibuya core drills. Twelve years on, it has been renewed every year. The same machines built in Japan since 1923, supported by a Malaysian engineering team that has seen the cuts they actually do.',
      },
      {
        para: 'Shibuya makes the drill. Coolman makes sure the drill is the right answer to the cut in front of you.',
      },
    ],

    // ── Hardest year ─────────────────────────────────────────────────────────
    hardestEyebrow: 'The hardest year',
    hardestHeadline: 'The product recall, and what came after.',
    hardestBody: [
      {
        para: 'In one production batch, the wrong bonding agent was used. The blades passed factory test. They failed on site. We recalled every unit, replaced every one, and wrote off the cost.',
      },
      {
        para: "What we kept was the customer base. Not one Brotherhood dealer left. The contractors who got the failed blade got the replacement, the apology, and a free second blade. Most of them are still with us. Business isn't a race for who can grow fastest. It's a question of who can endure longest.",
      },
    ],

    // ── Twenty years ─────────────────────────────────────────────────────────
    twentyEyebrow: 'Twenty years from now',
    twentyHeadline: "What we want Coolman to be when Alan's children run it.",
    twentyBody: [
      {
        para: 'The same company. Larger inventory. More Field Notes in the archive. The same direct line to engineering. The same answer when a contractor calls at 11pm.',
      },
      { para: 'Coolman is built to outlast its founder. That is the only metric of success we trust.' },
    ],

    // ── Timeline ─────────────────────────────────────────────────────────────
    timelineEyebrow: 'The timeline',
    timelineHeadline: 'Nineteen years on one page.',
    timelineEvents: [
      { year: '1998', title: 'Alan enters the cutting trade', body: "Nine years of selling other companies' blades begins.", note: '' },
      { year: '2007', title: 'Coolman founded in Selangor', body: 'Two segment presses, a bench, a phone.', note: '' },
      { year: 'TBC', title: 'Sandwich cobalt formulation developed', body: 'After a piling job in Shah Alam taught us the spec sheet was wrong.', note: 'Alan to supply year' },
      { year: '2014', title: 'Shibuya exclusive distribution signed', body: 'Renewed every year since.', note: '' },
      { year: 'TBC', title: 'SIRIM certification awarded', body: 'Independent verification of the bonding spec.', note: 'Alan to supply year' },
      { year: '2026', title: '247 SKUs in stock, ~500 active accounts', body: 'Dispatched from Selangor within 2 business days.', note: '' },
    ],
  },

  render: ({
    heroEyebrow,
    heroHeadline,
    heroLede,
    pj2007Eyebrow,
    pj2007Headline,
    pj2007Body,
    foundingEyebrow,
    foundingHeadline,
    foundingBody,
    workshopEyebrow,
    workshopHeadline,
    workshopNote,
    workshopBody,
    shibuyaEyebrow,
    shibuyaHeadline,
    shibuyaBody,
    hardestEyebrow,
    hardestHeadline,
    hardestBody,
    twentyEyebrow,
    twentyHeadline,
    twentyBody,
    timelineEyebrow,
    timelineHeadline,
    timelineEvents,
  }) => {
    // ── type-narrowed helpers ───────────────────────────────────────────────
    type ParaRow = { para: React.ReactNode }
    type EventRow = {
      year: string
      title: React.ReactNode
      body: React.ReactNode
      note: React.ReactNode
    }

    const paras = (raw: unknown): ParaRow[] =>
      Array.isArray(raw) ? (raw as ParaRow[]) : []

    const events = (raw: unknown): EventRow[] =>
      Array.isArray(raw) ? (raw as EventRow[]) : []

    return (
      <>
        {/* 1. HERO ─────────────────────────────────────────────────────────── */}
        <section className="bg-navy text-paper">
          <div className="mx-auto max-w-[1280px] px-6 pt-28 pb-16 lg:px-8 lg:pt-36 lg:pb-24">
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

        {/* 2. PJ, 2007 ──────────────────────────────────────────────────────── */}
        <section className="bg-paper">
          <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              {pj2007Eyebrow}
            </p>
            <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
              {pj2007Headline}
            </h2>
            <div className="mt-10 max-w-[680px]">
              {paras(pj2007Body).map((row, i) =>
                i === 0 ? (
                  <DropCapInline key={i} className="text-[16px] leading-[1.75] text-navy">
                    {row.para as string}
                  </DropCapInline>
                ) : (
                  <p key={i} className="mt-6 text-[16px] leading-[1.75] text-navy">
                    {row.para}
                  </p>
                ),
              )}
            </div>
          </div>
        </section>

        {/* 3. THE FOUNDING DECISION ────────────────────────────────────────── */}
        <section className="bg-paper border-t border-rule">
          <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              {foundingEyebrow}
            </p>
            <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
              {foundingHeadline}
            </h2>
            <div className="mt-10 max-w-[680px]">
              {paras(foundingBody).map((row, i) => (
                <p key={i} className={['text-[16px] leading-[1.75] text-navy', i !== 0 ? 'mt-6' : ''].filter(Boolean).join(' ')}>
                  {row.para}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* 4. THE DAY IT STOPPED BEING A WORKSHOP ─────────────────────────── */}
        <section className="bg-paper border-t border-rule">
          <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              {workshopEyebrow}
            </p>
            <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
              {workshopHeadline}
            </h2>
            {workshopNote ? (
              <p className="mt-4 font-fraunces italic text-[15px] text-ink-faint">
                {workshopNote}
              </p>
            ) : null}
            <div className="mt-10 max-w-[680px]">
              {paras(workshopBody).map((row, i) => (
                <p key={i} className={['text-[16px] leading-[1.75] text-navy', i !== 0 ? 'mt-6' : ''].filter(Boolean).join(' ')}>
                  {row.para}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* 5. TWELVE YEARS WITH SHIBUYA ────────────────────────────────────── */}
        <section className="bg-paper border-t border-rule">
          <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              {shibuyaEyebrow}
            </p>
            <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
              {shibuyaHeadline}
            </h2>
            <div className="mt-10 max-w-[680px]">
              {paras(shibuyaBody).map((row, i) => (
                <p key={i} className={['text-[16px] leading-[1.75] text-navy', i !== 0 ? 'mt-6' : ''].filter(Boolean).join(' ')}>
                  {row.para}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* 6. CHINESE PULL-QUOTE (FIXED — not editable, by design) ──────────── */}
        <section className="bg-paper border-t border-rule">
          <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-8 lg:py-16">
            <ChinesePullquoteHeritage />
          </div>
        </section>

        {/* 7. THE HARDEST YEAR ──────────────────────────────────────────────── */}
        <section className="bg-paper border-t border-rule">
          <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              {hardestEyebrow}
            </p>
            <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
              {hardestHeadline}
            </h2>
            <div className="mt-10 max-w-[680px]">
              {paras(hardestBody).map((row, i) => (
                <p key={i} className={['text-[16px] leading-[1.75] text-navy', i !== 0 ? 'mt-6' : ''].filter(Boolean).join(' ')}>
                  {row.para}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* 8. TWENTY YEARS FROM NOW ────────────────────────────────────────── */}
        <section className="bg-paper border-t border-rule">
          <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              {twentyEyebrow}
            </p>
            <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
              {twentyHeadline}
            </h2>
            <div className="mt-10 max-w-[680px]">
              {paras(twentyBody).map((row, i) => (
                <p key={i} className={['text-[16px] leading-[1.75] text-navy', i !== 0 ? 'mt-6' : ''].filter(Boolean).join(' ')}>
                  {row.para}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* 9. THE TIMELINE ──────────────────────────────────────────────────── */}
        <section className="bg-paper border-t border-rule">
          <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              {timelineEyebrow}
            </p>
            <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
              {timelineHeadline}
            </h2>
            <div className="mt-12 max-w-3xl">
              {events(timelineEvents).map((evt, i) => (
                <TimelineEntryInline
                  key={`${String(evt.year)}-${i}`}
                  year={String(evt.year)}
                  event={String(evt.title)}
                  body={evt.body ? String(evt.body) : undefined}
                  note={evt.note ? String(evt.note) : undefined}
                  isHighlight={String(evt.year) === HIGHLIGHT_YEAR}
                />
              ))}
            </div>
          </div>
        </section>
      </>
    )
  },
}
