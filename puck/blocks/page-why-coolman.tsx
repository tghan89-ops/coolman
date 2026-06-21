/**
 * Bespoke locked PAGE block — Why-Coolman (Engineering Folio).
 * Reproduces the exact markup of components/pages/WhyCoolmanClient.tsx with all
 * editorial copy as editable fields and the layout locked (one block per page).
 *
 * Interactive folio tab UI (useState) lives in
 * components/puck/WhyCoolmanFolioTabs.tsx ('use client').
 *
 * ChinesePullquote `工地会告诉你真相` is a fixed design element — NOT an editable
 * field, NOT translated. Reproduced verbatim from Pullquote.tsx ChinesePullquote.
 *
 * Settings deps: `puck.metadata.settings.whatsapp_number`
 */
import type { ComponentConfig } from '@puckeditor/core'
import { WhyCoolmanFolioTabs } from '@/components/puck/WhyCoolmanFolioTabs'
import type { FolioItem } from '@/components/puck/WhyCoolmanFolioTabs'

// ─── Local constants (not imported from pages.tsx) ────────────────────────────
const LOCKED = { drag: false, duplicate: false, delete: false } as const

type Settings = { whatsapp_number?: string }

const waHref = (n?: string) => {
  const d = (n || '').replace(/\D/g, '')
  return d.length >= 8 ? `https://wa.me/${d}` : '#'
}

// ─────────────────────────────────────────────────────────────────────────────
// WHY-COOLMAN PAGE BLOCK
// ─────────────────────────────────────────────────────────────────────────────
export const WhyCoolmanPage: ComponentConfig = {
  label: 'Page · Why Coolman',
  permissions: LOCKED,

  fields: {
    // ── Hero ──────────────────────────────────────────────────────────────────
    heroEyebrow: { type: 'text', label: 'Hero · Eyebrow', contentEditable: true },
    heroTitle: { type: 'text', label: 'Hero · Title', contentEditable: true },
    heroTitleEmphasis: { type: 'text', label: 'Hero · Title emphasis (italic)', contentEditable: true },
    heroLede: { type: 'textarea', label: 'Hero · Lede', contentEditable: true },

    // ── Folio 01 ──────────────────────────────────────────────────────────────
    folio01Label: { type: 'text', label: 'Folio 01 · Label', contentEditable: true },
    folio01Category: { type: 'text', label: 'Folio 01 · Tab label', contentEditable: true },
    folio01Title: { type: 'text', label: 'Folio 01 · Title', contentEditable: true },
    folio01TitleEmphasis: { type: 'text', label: 'Folio 01 · Title emphasis', contentEditable: true },
    folio01Summary: { type: 'textarea', label: 'Folio 01 · Summary', contentEditable: true },
    folio01MetaAuthor: { type: 'text', label: 'Folio 01 · Author', contentEditable: true },
    folio01MetaSubject: { type: 'text', label: 'Folio 01 · Subject', contentEditable: true },
    folio01MetaRead: { type: 'text', label: 'Folio 01 · Read time', contentEditable: true },
    folio01Paragraphs: {
      type: 'array',
      label: 'Folio 01 · Body paragraphs',
      arrayFields: {
        paragraph: { type: 'textarea', label: 'Paragraph', contentEditable: true },
      },
      defaultItemProps: { paragraph: '' },
    },
    folio01Pullquote: { type: 'textarea', label: 'Folio 01 · Pull-quote', contentEditable: true },

    // ── Folio 02 ──────────────────────────────────────────────────────────────
    folio02Label: { type: 'text', label: 'Folio 02 · Label', contentEditable: true },
    folio02Category: { type: 'text', label: 'Folio 02 · Tab label', contentEditable: true },
    folio02Title: { type: 'text', label: 'Folio 02 · Title', contentEditable: true },
    folio02TitleEmphasis: { type: 'text', label: 'Folio 02 · Title emphasis', contentEditable: true },
    folio02Summary: { type: 'textarea', label: 'Folio 02 · Summary', contentEditable: true },
    folio02MetaAuthor: { type: 'text', label: 'Folio 02 · Author', contentEditable: true },
    folio02MetaSubject: { type: 'text', label: 'Folio 02 · Subject', contentEditable: true },
    folio02MetaRead: { type: 'text', label: 'Folio 02 · Read time', contentEditable: true },
    folio02Paragraphs: {
      type: 'array',
      label: 'Folio 02 · Body paragraphs',
      arrayFields: {
        paragraph: { type: 'textarea', label: 'Paragraph', contentEditable: true },
      },
      defaultItemProps: { paragraph: '' },
    },
    folio02Pullquote: { type: 'textarea', label: 'Folio 02 · Pull-quote', contentEditable: true },

    // ── Folio 03 ──────────────────────────────────────────────────────────────
    folio03Label: { type: 'text', label: 'Folio 03 · Label', contentEditable: true },
    folio03Category: { type: 'text', label: 'Folio 03 · Tab label', contentEditable: true },
    folio03Title: { type: 'text', label: 'Folio 03 · Title', contentEditable: true },
    folio03TitleEmphasis: { type: 'text', label: 'Folio 03 · Title emphasis', contentEditable: true },
    folio03Summary: { type: 'textarea', label: 'Folio 03 · Summary', contentEditable: true },
    folio03MetaAuthor: { type: 'text', label: 'Folio 03 · Author', contentEditable: true },
    folio03MetaSubject: { type: 'text', label: 'Folio 03 · Subject', contentEditable: true },
    folio03MetaRead: { type: 'text', label: 'Folio 03 · Read time', contentEditable: true },
    folio03Paragraphs: {
      type: 'array',
      label: 'Folio 03 · Body paragraphs',
      arrayFields: {
        paragraph: { type: 'textarea', label: 'Paragraph', contentEditable: true },
      },
      defaultItemProps: { paragraph: '' },
    },
    folio03Pullquote: { type: 'textarea', label: 'Folio 03 · Pull-quote', contentEditable: true },

    // ── Closing CTA ───────────────────────────────────────────────────────────
    ctaEyebrow: { type: 'text', label: 'CTA · Eyebrow', contentEditable: true },
    ctaTitle: { type: 'text', label: 'CTA · Title', contentEditable: true },
    ctaTitleEmphasis: { type: 'text', label: 'CTA · Title emphasis (italic)', contentEditable: true },
    ctaBody: { type: 'textarea', label: 'CTA · Body', contentEditable: true },
    ctaWhatsappLabel: { type: 'text', label: 'CTA · WhatsApp button label', contentEditable: true },
    ctaFieldNotesLabel: { type: 'text', label: 'CTA · Field Notes link label', contentEditable: true },
  },

  defaultProps: {
    // Hero
    heroEyebrow: 'Engineering Folio',
    heroTitle: 'Three arguments.',
    heroTitleEmphasis: 'One trade.',
    heroLede: 'Three arguments that establish where Coolman stands on the cutting trade. The myths the industry still teaches. The case for matching bonds to Malaysian aggregate. The Brotherhood philosophy.',

    // Folio 01
    folio01Label: 'Engineering Folio №01',
    folio01Category: 'Industry position',
    folio01Title: 'Three things the cutting trade keeps',
    folio01TitleEmphasis: 'getting wrong.',
    folio01Summary: 'After nearly thirty years in the Malaysian diamond tools industry, three beliefs are repeated so often they sound like wisdom. They are not.',
    folio01MetaAuthor: 'Coolman Engineering',
    folio01MetaSubject: 'Industry positioning',
    folio01MetaRead: '1 min read',
    folio01Paragraphs: [
      { paragraph: 'Three beliefs dominate sales conversations in the Malaysian cutting trade. Customers only care about price. More dealers means more growth. Made in Japan beats Made in China. Each one is repeated so often it sounds like wisdom. Each one is wrong.' },
      { paragraph: "A blade is RM300. A day's delay on a Klang Valley piling project can cost RM10,000 in penalties before you count idle workers. When a contractor pushes on price, they're asking whether they can trust the supplier — not whether the blade is cheap. On dealers: by year five of aggressive expansion, margins compress, service hollows out, and the brand is worth less than when it started. On country of origin: the variance inside any country's production is now larger than the average gap between countries." },
      { paragraph: 'The myths survive because they let suppliers avoid harder conversations. The contractors who stay profitable longest have already stopped believing them.' },
    ],
    folio01Pullquote: 'The conversation was never about the blade.',

    // Folio 02
    folio02Label: 'Engineering Folio №02',
    folio02Category: 'Technical',
    folio02Title: 'Malaysian aggregate breaks',
    folio02TitleEmphasis: 'European blades.',
    folio02Summary: 'A technical argument about why blades bonded for European concrete underperform on Malaysian sites, and what to do about it.',
    folio02MetaAuthor: 'Coolman Engineering',
    folio02MetaSubject: 'Bond design · Aggregate composition',
    folio02MetaRead: '1 min read',
    folio02Paragraphs: [
      { paragraph: "A diamond blade doesn't cut — it abrades. Diamonds in the segment scrape away the material; as they dull, the bond around them wears to expose fresh diamonds underneath. Everything depends on matching the bond hardness to how abrasive the material is." },
      { paragraph: 'Malaysian concrete is granite-dominant. Granite has high silica content — noticeably more abrasive than the limestone aggregate that calibrates most European blades. A bond formulation correct for European concrete is, on Malaysian granite, too soft. It wears faster than designed. Segments deteriorate early. Contractors blame the operator or the machine. The actual problem is upstream: the bond was never matched to the material.' },
      { paragraph: "Coolman's CM-X line uses a three-layer cobalt construction — each layer at a different diamond concentration. As the outer layer wears faster than European-bond designs expected, the inner layers keep exposing fresh diamonds. The blade is engineered for the aggregate it will actually cut, not the aggregate on a European spec sheet." },
    ],
    folio02Pullquote: 'The blade does not care what the spec sheet says. It cares what the rock does.',

    // Folio 03
    folio03Label: 'Engineering Folio №03',
    folio03Category: 'Brand philosophy',
    folio03Title: 'The Brotherhood',
    folio03TitleEmphasis: 'System.',
    folio03Summary: 'Every diamond tools brand in Malaysia has a dealer network. Most are functionally broken by year five. This is the operating philosophy that has kept ours profitable for nearly two decades.',
    folio03MetaAuthor: 'Coolman Engineering',
    folio03MetaSubject: 'Distribution philosophy',
    folio03MetaRead: '1 min read',
    folio03Paragraphs: [
      { paragraph: 'Every diamond tools brand in Malaysia has a dealer network. Most are functionally broken by year five. The pattern: aggressive recruitment, maximum discounts, no territorial protection. Dealers compete against each other for the same contractors. Margins compress. Some fold. The survivors cut service to stay alive.' },
      { paragraph: 'The Brotherhood runs the opposite way. Fewer dealers per region than the industry standard. Each protected from direct competition by other Coolman dealers in their territory. Margins maintained at a level that makes technical investment rational. No direct-sales operation that undercuts our own dealer base.' },
      { paragraph: 'The cost is real in the short term: foregone volume, foregone margin, the discipline to say no every quarter. The return is a dealer base that has, in most cases, carried Coolman for years. That experience compounds into something a competitor cannot easily copy.' },
    ],
    folio03Pullquote: 'The most stable dealer network wins. Not the largest.',

    // Closing CTA
    ctaEyebrow: 'A conversation',
    ctaTitle: 'Got a cut that the spec',
    ctaTitleEmphasis: 'sheet cannot answer?',
    ctaBody: 'Send a photo of the job, the aggregate, and the existing blade. The engineering desk replies the same working day. If you want to read more in the same voice, three Field Notes cover specific jobs that taught us what the folio above argues.',
    ctaWhatsappLabel: 'Open the engineering desk on WhatsApp',
    ctaFieldNotesLabel: 'Read the Field Notes',
  },

  render: ({
    heroEyebrow, heroTitle, heroTitleEmphasis, heroLede,
    folio01Label, folio01Category, folio01Title, folio01TitleEmphasis, folio01Summary,
    folio01MetaAuthor, folio01MetaSubject, folio01MetaRead, folio01Paragraphs, folio01Pullquote,
    folio02Label, folio02Category, folio02Title, folio02TitleEmphasis, folio02Summary,
    folio02MetaAuthor, folio02MetaSubject, folio02MetaRead, folio02Paragraphs, folio02Pullquote,
    folio03Label, folio03Category, folio03Title, folio03TitleEmphasis, folio03Summary,
    folio03MetaAuthor, folio03MetaSubject, folio03MetaRead, folio03Paragraphs, folio03Pullquote,
    ctaEyebrow, ctaTitle, ctaTitleEmphasis, ctaBody, ctaWhatsappLabel, ctaFieldNotesLabel,
    puck,
  }) => {
    const s = (puck?.metadata?.settings as Settings) || {}

    // Shape flat array fields (each item is { paragraph: string }) into string[]
    const toParas = (raw: unknown): string[] => {
      if (!Array.isArray(raw)) return []
      return (raw as { paragraph?: string }[]).map((r) => r?.paragraph ?? '')
    }

    const folios: FolioItem[] = [
      {
        folioLabel: folio01Label as string,
        category: folio01Category as string,
        title: folio01Title as string,
        titleEmphasis: folio01TitleEmphasis as string,
        summary: folio01Summary as string,
        metaAuthor: folio01MetaAuthor as string,
        metaSubject: folio01MetaSubject as string,
        metaRead: folio01MetaRead as string,
        paragraphs: toParas(folio01Paragraphs),
        pullquote: folio01Pullquote as string,
      },
      {
        folioLabel: folio02Label as string,
        category: folio02Category as string,
        title: folio02Title as string,
        titleEmphasis: folio02TitleEmphasis as string,
        summary: folio02Summary as string,
        metaAuthor: folio02MetaAuthor as string,
        metaSubject: folio02MetaSubject as string,
        metaRead: folio02MetaRead as string,
        paragraphs: toParas(folio02Paragraphs),
        pullquote: folio02Pullquote as string,
      },
      {
        folioLabel: folio03Label as string,
        category: folio03Category as string,
        title: folio03Title as string,
        titleEmphasis: folio03TitleEmphasis as string,
        summary: folio03Summary as string,
        metaAuthor: folio03MetaAuthor as string,
        metaSubject: folio03MetaSubject as string,
        metaRead: folio03MetaRead as string,
        paragraphs: toParas(folio03Paragraphs),
        pullquote: folio03Pullquote as string,
      },
    ]

    return (
      <>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="bg-navy text-paper">
          <div className="mx-auto max-w-7xl px-6 pt-28 pb-16 lg:px-8 lg:pt-36 lg:pb-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
              {heroEyebrow}
            </p>
            <h1 className="mt-6 max-w-[20ch] font-fraunces text-[clamp(40px,6vw,84px)] font-normal leading-[1.02] tracking-[-0.025em] text-paper">
              {heroTitle}{' '}
              <span className="italic text-accent-light">{heroTitleEmphasis}</span>
            </h1>
            <p className="mt-8 max-w-[52ch] text-base leading-relaxed text-paper/80 sm:text-lg">
              {heroLede}
            </p>
          </div>
        </section>

        {/* ── Folio tabs + article — interactive, extracted to client component ─ */}
        <WhyCoolmanFolioTabs folios={folios} />

        {/* ── Chinese pull-quote — fixed design element, never editable ───────
            Reproduces <ChinesePullquote quote="why-coolman" /> verbatim.
            String `工地会告诉你真相` is intentional, not translated, not toggled. */}
        <section className="bg-paper">
          <div className="mx-auto max-w-7xl px-6 pb-12 sm:px-12 sm:pb-16">
            <figure lang="zh" className="text-center py-20 lg:py-28">
              <div className="mx-auto mb-10 h-px w-12 bg-rule" />
              <p className="font-chinese text-navy leading-[1.15] tracking-[0.06em] text-[clamp(2.25rem,6.5vw,5.5rem)]">
                工地会告诉你真相
              </p>
              <figcaption className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                The site will tell you the truth.
              </figcaption>
              <div className="mx-auto mt-10 h-px w-12 bg-rule" />
            </figure>
          </div>
        </section>

        {/* ── Closing CTA ───────────────────────────────────────────────────── */}
        <section className="bg-navy text-paper">
          <div className="mx-auto max-w-3xl px-6 py-14 lg:px-8 lg:py-20">
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
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-accent px-6 text-sm font-medium text-paper transition-opacity duration-150 ease-out hover:opacity-90"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.139.561 4.14 1.543 5.873L.057 23.998l6.304-1.654A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.644-.52-5.148-1.422l-.369-.218-3.822 1.002.883-3.667-.237-.378A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
                {ctaWhatsappLabel}
              </a>
              <a
                href="/field-notes"
                className="inline-flex min-h-[48px] items-center gap-2 text-sm font-medium text-paper transition-colors duration-150 ease-out hover:text-accent-light"
              >
                {ctaFieldNotesLabel}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={16} height={16} aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </>
    )
  },
}
