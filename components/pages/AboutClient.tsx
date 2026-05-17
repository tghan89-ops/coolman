'use client'

import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { useLanguage } from '@/lib/i18n/context'

export function AboutClient({ whatsappNumber }: { whatsappNumber: string }) {
  const { t } = useLanguage()
  const a = t.aboutPage
  const waDigits = whatsappNumber.replace(/[^\d]/g, '')

  return (
    <PublicLayout headerVariant="transparent">
      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-[1280px] px-6 pt-32 pb-24 lg:px-8 lg:pt-40 lg:pb-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
            {a.hero.eyebrow}
          </p>
          <h1 className="mt-6 max-w-[22ch] font-fraunces text-[clamp(40px,6vw,84px)] font-normal leading-[1.02] tracking-[-0.025em] text-paper">
            {a.hero.headline}
          </h1>
          <p className="mt-8 max-w-[58ch] text-lg leading-relaxed text-paper/80">
            {a.hero.lede}
          </p>
        </div>
      </section>

      <section className="bg-paper text-ink">
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-8 lg:py-28">
          <dl className="grid grid-cols-1 gap-12 border-t border-ink/10 pt-12 sm:grid-cols-3">
            {[a.founded, a.builtIn, a.accounts].map((stat) => (
              <div key={stat.label}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50">
                  {stat.label}
                </dt>
                <dd className="mt-3 font-mono text-[clamp(28px,3.2vw,40px)] font-normal leading-tight text-navy">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-3xl px-6 py-24 lg:px-8 lg:py-28">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
            {t.pages.whyCoolman.closingCta.eyebrow}
          </p>
          <h2 className="mt-4 font-fraunces text-[clamp(28px,3.5vw,44px)] font-normal leading-[1.1] tracking-[-0.02em] text-paper">
            {t.pages.whyCoolman.closingCta.title}{' '}
            <span className="italic text-accent-light">{t.pages.whyCoolman.closingCta.titleEmphasis}</span>
          </h2>
          <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-paper/80 sm:text-lg">
            {t.pages.whyCoolman.closingCta.body}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href={`https://wa.me/${waDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-accent px-6 text-sm font-medium text-paper transition-colors duration-150 ease-out hover:bg-accent-light"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {t.pages.whyCoolman.closingCta.whatsappCtaLabel}
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[48px] items-center gap-2 text-sm font-medium text-paper transition-colors duration-150 ease-out hover:text-accent-light"
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
