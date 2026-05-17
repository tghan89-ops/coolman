'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { ChinesePullquote } from '@/components/editorial/Pullquote'
import { useLanguage } from '@/lib/i18n/context'

export function WhyCoolmanClient() {
  const { t } = useLanguage()
  const { hero, placeholder } = t.pages.whyCoolman

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

      <section className="bg-paper text-ink">
        <div className="mx-auto max-w-3xl px-6 py-24 sm:px-12 sm:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {placeholder.eyebrow}
          </p>
          <h2 className="mt-4 font-fraunces text-[clamp(28px,3vw,40px)] font-normal leading-[1.1] tracking-[-0.02em] text-navy">
            {placeholder.headline}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink/80 sm:text-lg">
            {placeholder.body}
          </p>
          <Link
            href="/field-notes"
            className="mt-10 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-accent transition-colors duration-150 ease-out hover:text-accent-light"
          >
            {placeholder.fieldNotesCtaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-6 pb-24 sm:px-12 sm:pb-32">
          <ChinesePullquote quote="why-coolman" />
        </div>
      </section>
    </PublicLayout>
  )
}
