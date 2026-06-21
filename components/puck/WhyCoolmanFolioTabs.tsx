'use client'

/**
 * Interactive folio tab switcher for the locked Why-Coolman Puck page block.
 * Extracted from WhyCoolmanClient.tsx — tab state cannot live in a pure render.
 * Receives all editable copy as props (no CMS/context deps).
 */

export type FolioItem = {
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

function FolioHeader({ folio }: { folio: FolioItem }) {
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

function FolioBody({ folio }: { folio: FolioItem }) {
  return (
    <>
      <div className="space-y-5 text-base leading-relaxed text-ink/85 sm:text-[17px] sm:leading-[1.75]">
        {folio.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <blockquote className="border-l-[3px] border-accent pl-6 my-8">
        <p className="font-fraunces italic text-accent-light text-[1.75rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.2]">
          {folio.pullquote}
        </p>
      </blockquote>
    </>
  )
}

import { useState } from 'react'

export function WhyCoolmanFolioTabs({ folios }: { folios: FolioItem[] }) {
  const [activeTab, setActiveTab] = useState(0)
  const active = folios[activeTab] ?? folios[0]

  return (
    <>
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
        <div className="mx-auto max-w-3xl px-6 py-14 lg:px-8 lg:py-20">
          <FolioHeader folio={active} />
          <FolioBody folio={active} />
        </div>
      </article>
    </>
  )
}
