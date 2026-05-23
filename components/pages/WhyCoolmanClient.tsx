'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { ChinesePullquote, Pullquote } from '@/components/editorial/Pullquote'
import { useLanguage } from '@/lib/i18n/context'
import { useSettings } from '@/lib/settings/context'

interface Folio {
  folioLabel: string
  category: string
  title: string
  titleEmphasis: string
  summary: string
  metaAuthor: string
  metaSubject: string
  metaRead: string
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
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50">
            By
          </dt>
          <dd className="mt-1 text-sm text-ink">{folio.metaAuthor}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50">
            Subject
          </dt>
          <dd className="mt-1 text-sm text-ink">{folio.metaSubject}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50">
            Length
          </dt>
          <dd className="mt-1 font-mono text-sm text-ink">{folio.metaRead}</dd>
        </div>
      </dl>
    </header>
  )
}

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="space-y-5 text-base leading-relaxed text-ink/85 sm:text-[17px] sm:leading-[1.75]">
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-6 mt-12 font-fraunces text-[clamp(22px,2.4vw,30px)] font-normal leading-[1.15] tracking-[-0.015em] text-navy">
      {children}
    </h3>
  )
}

export function WhyCoolmanClient() {
  const { t } = useLanguage()
  const { whatsapp_number } = useSettings()
  const whatsappDigits = whatsapp_number.replace(/\D/g, '')
  const { hero, folio01, folio02, folio03, closingCta } = t.pages.whyCoolman

  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    { label: folio01.category, key: 'folio01' },
    { label: folio02.category, key: 'folio02' },
    { label: folio03.category, key: 'folio03' },
  ]

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
            {tabs.map((tab, idx) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === idx}
                onClick={() => setActiveTab(idx)}
                className={[
                  'flex-1 py-4 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-150 ease-out',
                  'border-b-2',
                  activeTab === idx
                    ? 'border-accent text-accent'
                    : 'border-transparent text-ink/40 hover:text-ink/70',
                ].join(' ')}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div role="tabpanel">
        {activeTab === 0 && (
          <article className="bg-paper text-ink">
            <div className="mx-auto max-w-3xl px-6 py-24 sm:px-12 sm:py-32">
              <FolioHeader folio={folio01} />

              <SectionHeading>{folio01.intro.heading}</SectionHeading>
              <Prose paragraphs={folio01.intro.paragraphs} />

              {folio01.myths.map((myth, idx) => (
                <section key={idx} className="mt-16">
                  <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent">
                    {myth.label}
                  </p>
                  <h3 className="mt-3 font-fraunces text-[clamp(26px,3vw,36px)] font-normal leading-[1.1] tracking-[-0.02em] text-navy">
                    {myth.title}
                  </h3>
                  <p className="mt-6 border-l-2 border-ink/15 pl-5 font-fraunces italic text-[clamp(17px,1.6vw,20px)] leading-[1.5] text-ink/70">
                    {myth.claim}
                  </p>
                  <div className="mt-8">
                    <Prose paragraphs={myth.paragraphs} />
                  </div>
                  {myth.pullquote ? <Pullquote>{myth.pullquote}</Pullquote> : null}
                  {myth.coda ? (
                    <div className="mt-10 border-t border-ink/10 pt-8">
                      <h4 className="mb-5 font-fraunces text-[clamp(20px,2vw,24px)] font-normal leading-[1.2] tracking-[-0.01em] text-navy">
                        {myth.coda.heading}
                      </h4>
                      <Prose paragraphs={myth.coda.paragraphs} />
                    </div>
                  ) : null}
                </section>
              ))}

              <div className="mt-16">
                <Pullquote>{folio01.bridgeQuote}</Pullquote>
              </div>

              <SectionHeading>{folio01.coda.heading}</SectionHeading>
              <Prose paragraphs={folio01.coda.paragraphs} />
            </div>
          </article>
        )}

        {activeTab === 1 && (
          <article className="bg-paper text-ink">
            <div className="mx-auto max-w-3xl px-6 py-24 sm:px-12 sm:py-32">
              <FolioHeader folio={folio02} />

              {folio02.sections.map((s, idx) => (
                <section key={idx} className="mt-4">
                  <SectionHeading>{s.heading}</SectionHeading>
                  <Prose paragraphs={s.paragraphs} />
                  {s.pullquote ? <Pullquote>{s.pullquote}</Pullquote> : null}
                </section>
              ))}

              <div className="mt-16">
                <Pullquote>{folio02.bridgeQuote}</Pullquote>
              </div>

              <SectionHeading>{folio02.coda.heading}</SectionHeading>
              <Prose paragraphs={folio02.coda.paragraphs} />
            </div>
          </article>
        )}

        {activeTab === 2 && (
          <article className="bg-paper text-ink">
            <div className="mx-auto max-w-3xl px-6 py-24 sm:px-12 sm:py-32">
              <FolioHeader folio={folio03} />

              {folio03.sections.map((s, idx) => (
                <section key={idx} className="mt-4">
                  <SectionHeading>{s.heading}</SectionHeading>
                  <Prose paragraphs={s.paragraphs} />
                  {s.pullquote ? <Pullquote>{s.pullquote}</Pullquote> : null}
                </section>
              ))}

              <div className="mt-16">
                <Pullquote>{folio03.bridgeQuote}</Pullquote>
              </div>

              <SectionHeading>{folio03.coda.heading}</SectionHeading>
              <Prose paragraphs={folio03.coda.paragraphs} />
            </div>
          </article>
        )}
      </div>

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
