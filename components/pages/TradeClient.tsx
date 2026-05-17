'use client'

import Link from 'next/link'
import { ArrowRight, Check, MessageCircle } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { useLanguage } from '@/lib/i18n/context'

export function TradeClient({ whatsappNumber }: { whatsappNumber: string }) {
  const { t } = useLanguage()
  const tp = t.tradePage
  const waDigits = whatsappNumber.replace(/[^\d]/g, '')
  const waPrefilled = encodeURIComponent(tp.application.ctaLabel)
  const tiers = [tp.tiers.buyer, tp.tiers.dealer]

  return (
    <PublicLayout headerVariant="transparent">
      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-[1280px] px-6 pt-32 pb-24 lg:px-8 lg:pt-40 lg:pb-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
            {tp.hero.eyebrow}
          </p>
          <h1 className="mt-6 max-w-[22ch] font-fraunces text-[clamp(40px,6vw,84px)] font-normal leading-[1.02] tracking-[-0.025em] text-paper">
            {tp.hero.headline}
          </h1>
          <p className="mt-8 max-w-[58ch] text-lg leading-relaxed text-paper/80">
            {tp.hero.lede}
          </p>
        </div>
      </section>

      <section className="bg-paper text-ink">
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
            {tiers.map((tier) => (
              <article
                key={tier.title}
                className="flex h-full flex-col border border-ink/10 bg-paper p-8 sm:p-10"
              >
                <h2 className="font-fraunces text-[clamp(26px,3vw,36px)] font-normal leading-[1.1] tracking-[-0.02em] text-navy">
                  {tier.title}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-ink/80">
                  {tier.body}
                </p>
                <ul className="mt-8 space-y-3 border-t border-ink/10 pt-6">
                  {tier.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-ink">
                      <Check
                        className="mt-[3px] h-4 w-4 flex-none text-accent"
                        aria-hidden="true"
                      />
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper text-ink border-t border-ink/10">
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-8 lg:py-28">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {tp.application.eyebrow}
          </p>
          <h2 className="mt-4 max-w-[28ch] font-fraunces text-[clamp(28px,3.5vw,44px)] font-normal leading-[1.1] tracking-[-0.02em] text-navy">
            {tp.application.headline}
          </h2>
          <ol className="mt-12 grid grid-cols-1 gap-8 border-t border-ink/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {tp.application.steps.map((step, idx) => (
              <li key={step.title}>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
                  {String(idx + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 font-fraunces text-[clamp(20px,2vw,24px)] font-normal leading-[1.2] tracking-[-0.01em] text-navy">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href={`https://wa.me/${waDigits}?text=${waPrefilled}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-accent px-6 text-sm font-medium text-paper transition-colors duration-150 ease-out hover:bg-accent-light"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {tp.application.ctaLabel}
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[48px] items-center gap-2 text-sm font-medium text-navy transition-colors duration-150 ease-out hover:text-accent"
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
