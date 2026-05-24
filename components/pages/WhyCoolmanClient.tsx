'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { ChinesePullquote, Pullquote } from '@/components/editorial/Pullquote'
import { useLanguage } from '@/lib/i18n/context'
import { useSettings } from '@/lib/settings/context'

export type RawFolioParagraph = { paragraph?: string | null; paragraphBM?: string | null }
export type RawFolioGroup = {
  folioLabel?: string | null; folioLabelBM?: string | null
  category?: string | null; categoryBM?: string | null
  title?: string | null; titleBM?: string | null
  titleEmphasis?: string | null; titleEmphasisBM?: string | null
  summary?: string | null; summaryBM?: string | null
  metaAuthor?: string | null
  metaSubject?: string | null; metaSubjectBM?: string | null
  metaRead?: string | null; metaReadBM?: string | null
  paragraphs?: RawFolioParagraph[] | null
  pullquote?: string | null; pullquoteBM?: string | null
}
export type RawWhyCoolmanPage = {
  hero?: {
    eyebrow?: string | null; eyebrowBM?: string | null
    title?: string | null; titleBM?: string | null
    titleEmphasis?: string | null; titleEmphasisBM?: string | null
    lede?: string | null; ledeBM?: string | null
  } | null
  folio01?: RawFolioGroup | null
  folio02?: RawFolioGroup | null
  folio03?: RawFolioGroup | null
  closingCta?: {
    eyebrow?: string | null; eyebrowBM?: string | null
    title?: string | null; titleBM?: string | null
    titleEmphasis?: string | null; titleEmphasisBM?: string | null
    body?: string | null; bodyBM?: string | null
    whatsappCtaLabel?: string | null; whatsappCtaLabelBM?: string | null
    fieldNotesCtaLabel?: string | null; fieldNotesCtaLabelBM?: string | null
  } | null
}

type Props = { initialData: RawWhyCoolmanPage | null }

interface Folio {
  folioLabel: string
  category: string
  title: string
  titleEmphasis: string
  summary: string
  metaAuthor: string
  metaSubject: string
  metaRead: string
  paragraphs: string[]
  pullquote: string
}

function FolioHeader({ folio }: { folio: Folio }) {
  return (
    <header className="mb-12 sm:mb-16">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
        {folio.folioLabel}
      </p>
      <h2 className="mt-4 font-fraunces text-[clamp(32px,4vw,56px)] font-normal leading-[1.05] tracking-[-0.025em] text-navy">
        {folio.title}{' '}
        <span className="italic text-accent">{folio.titleEmphasis}</span>
      </h2>
      <p className="mt-6 max-w-[60ch] text-base leading-relaxed text-ink/80 sm:text-lg">
        {folio.summary}
      </p>
      <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-ink/10 pt-6 sm:grid-cols-3">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50">By</dt>
          <dd className="mt-1 text-sm text-ink">{folio.metaAuthor}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50">Subject</dt>
          <dd className="mt-1 text-sm text-ink">{folio.metaSubject}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50">Length</dt>
          <dd className="mt-1 font-mono text-sm text-ink">{folio.metaRead}</dd>
        </div>
      </dl>
    </header>
  )
}

function FolioBody({ folio }: { folio: Folio }) {
  return (
    <>
      <div className="space-y-5 text-base leading-relaxed text-ink/85 sm:text-[17px] sm:leading-[1.75]">
        {folio.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <Pullquote>{folio.pullquote}</Pullquote>
    </>
  )
}

export function WhyCoolmanClient({ initialData }: Props) {
  const { data } = useLivePreview<RawWhyCoolmanPage>({
    initialData: initialData ?? ({} as RawWhyCoolmanPage),
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 1,
  })

  const { language, t } = useLanguage()
  const { whatsapp_number } = useSettings()
  const whatsappDigits = whatsapp_number.replace(/\D/g, '')
  const copy = t.pages.whyCoolman

  const pickL = (en: string | null | undefined, bm: string | null | undefined, fallback: string): string => {
    if (language === 'BM' && bm && bm.trim()) return bm
    if (en && en.trim()) return en
    return fallback
  }

  const mergeParas = (
    cmsParas: RawFolioParagraph[] | null | undefined,
    copyParas: string[]
  ): string[] => {
    if (cmsParas && cmsParas.length > 0) {
      return cmsParas.map((p, i) => pickL(p.paragraph, p.paragraphBM, copyParas[i] ?? ''))
    }
    return copyParas
  }

  const buildFolio = (raw: RawFolioGroup | null | undefined, c: typeof copy.folio01): Folio => ({
    folioLabel:    pickL(raw?.folioLabel,    raw?.folioLabelBM,    c.folioLabel),
    category:      pickL(raw?.category,      raw?.categoryBM,      c.category),
    title:         pickL(raw?.title,         raw?.titleBM,         c.title),
    titleEmphasis: pickL(raw?.titleEmphasis, raw?.titleEmphasisBM, c.titleEmphasis),
    summary:       pickL(raw?.summary,       raw?.summaryBM,       c.summary),
    metaAuthor:    raw?.metaAuthor?.trim()  || c.metaAuthor,
    metaSubject:   pickL(raw?.metaSubject,   raw?.metaSubjectBM,   c.metaSubject),
    metaRead:      pickL(raw?.metaRead,      raw?.metaReadBM,      c.metaRead),
    paragraphs:    mergeParas(raw?.paragraphs, c.paragraphs),
    pullquote:     pickL(raw?.pullquote,     raw?.pullquoteBM,     c.pullquote),
  })

  const hero = {
    eyebrow:       pickL(data?.hero?.eyebrow,       data?.hero?.eyebrowBM,       copy.hero.eyebrow),
    title:         pickL(data?.hero?.title,         data?.hero?.titleBM,         copy.hero.title),
    titleEmphasis: pickL(data?.hero?.titleEmphasis, data?.hero?.titleEmphasisBM, copy.hero.titleEmphasis),
    lede:          pickL(data?.hero?.lede,          data?.hero?.ledeBM,          copy.hero.lede),
  }

  const folios: Folio[] = [
    buildFolio(data?.folio01, copy.folio01),
    buildFolio(data?.folio02, copy.folio02),
    buildFolio(data?.folio03, copy.folio03),
  ]

  const closingCta = {
    eyebrow:           pickL(data?.closingCta?.eyebrow,           data?.closingCta?.eyebrowBM,           copy.closingCta.eyebrow),
    title:             pickL(data?.closingCta?.title,             data?.closingCta?.titleBM,             copy.closingCta.title),
    titleEmphasis:     pickL(data?.closingCta?.titleEmphasis,     data?.closingCta?.titleEmphasisBM,     copy.closingCta.titleEmphasis),
    body:              pickL(data?.closingCta?.body,              data?.closingCta?.bodyBM,              copy.closingCta.body),
    whatsappCtaLabel:  pickL(data?.closingCta?.whatsappCtaLabel,  data?.closingCta?.whatsappCtaLabelBM,  copy.closingCta.whatsappCtaLabel),
    fieldNotesCtaLabel: pickL(data?.closingCta?.fieldNotesCtaLabel, data?.closingCta?.fieldNotesCtaLabelBM, copy.closingCta.fieldNotesCtaLabel),
  }

  const [activeTab, setActiveTab] = useState(0)

  return (
    <PublicLayout>
      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-12 sm:py-32 lg:py-40">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
            {hero.eyebrow}
          </p>
          <h1 className="mt-6 max-w-[20ch] font-fraunces text-[clamp(40px,6vw,84px)] font-normal leading-[1.02] tracking-[-0.025em] text-paper">
            {hero.title}{' '}
            <span className="italic text-accent-light">{hero.titleEmphasis}</span>
          </h1>
          <p className="mt-8 max-w-[52ch] text-base leading-relaxed text-paper/80 sm:text-lg">
            {hero.lede}
          </p>
        </div>
      </section>

      <div className="sticky top-0 z-10 bg-paper border-b border-ink/10">
        <div className="mx-auto max-w-3xl px-6 sm:px-12">
          <div className="flex" role="tablist">
            {folios.map((folio, idx) => (
              <button
                key={folio.folioLabel}
                role="tab"
                aria-selected={activeTab === idx}
                onClick={() => setActiveTab(idx)}
                className={[
                  'flex-1 py-4 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-150 ease-out',
                  'border-b-2',
                  activeTab === idx
                    ? 'border-accent text-accent cursor-default'
                    : 'border-transparent text-ink/40 hover:text-ink hover:border-ink/20 cursor-pointer',
                ].join(' ')}
              >
                {folio.category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <article className="bg-paper text-ink" role="tabpanel">
        <div className="mx-auto max-w-3xl px-6 py-24 sm:px-12 sm:py-32">
          <FolioHeader folio={folios[activeTab]} />
          <FolioBody folio={folios[activeTab]} />
        </div>
      </article>

      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-6 pb-12 sm:px-12 sm:pb-16">
          <ChinesePullquote quote="why-coolman" />
        </div>
      </section>

      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-3xl px-6 py-24 sm:px-12 sm:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
            {closingCta.eyebrow}
          </p>
          <h2 className="mt-4 font-fraunces text-[clamp(28px,3.5vw,44px)] font-normal leading-[1.1] tracking-[-0.02em] text-paper">
            {closingCta.title}{' '}
            <span className="italic text-accent-light">{closingCta.titleEmphasis}</span>
          </h2>
          <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-paper/80 sm:text-lg">
            {closingCta.body}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href={`https://wa.me/${whatsappDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-accent px-6 text-sm font-medium text-paper transition-opacity duration-150 ease-out hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {closingCta.whatsappCtaLabel}
            </Link>
            <Link
              href="/field-notes"
              className="inline-flex min-h-[48px] items-center gap-2 text-sm font-medium text-paper transition-colors duration-150 ease-out hover:text-accent-light"
            >
              {closingCta.fieldNotesCtaLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
