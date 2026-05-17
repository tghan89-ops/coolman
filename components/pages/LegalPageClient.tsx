'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { useLanguage } from '@/lib/i18n/context'

export type LegalKind = 'privacy' | 'terms' | 'returns' | 'cookies'

export function LegalPageClient({
  kind,
  legalEntityName,
}: {
  kind: LegalKind
  legalEntityName: string
}) {
  const { t } = useLanguage()
  const block = t.legal[kind]

  return (
    <PublicLayout headerVariant="transparent">
      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-[1280px] px-6 pt-32 pb-20 lg:px-8 lg:pt-40 lg:pb-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
            {legalEntityName}
          </p>
          <h1 className="mt-6 max-w-[22ch] font-fraunces text-[clamp(40px,6vw,72px)] font-normal leading-[1.05] tracking-[-0.025em] text-paper">
            {block.title}
          </h1>
          <p className="mt-8 max-w-[60ch] text-lg leading-relaxed text-paper/80">
            {block.lede}
          </p>
        </div>
      </section>

      <section className="bg-paper text-ink">
        <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="border-l-2 border-accent/30 pl-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
              Draft
            </p>
            <p className="mt-3 text-base leading-relaxed text-ink/70">
              The full text of this notice is being prepared with counsel. Until it
              is published, the trade desk can answer any specific question on the
              record. Reach us through the contact page.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-navy transition-colors duration-150 ease-out hover:text-accent"
            >
              {t.nav.contact}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
