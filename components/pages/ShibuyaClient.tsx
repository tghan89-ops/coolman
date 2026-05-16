'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowDown, Play, Check } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { useLanguage } from '@/lib/i18n/context'

interface ShibuyaClientProps {
  initialData: any
}

export function ShibuyaClient({ initialData }: ShibuyaClientProps) {
  const { language, t } = useLanguage()
  const pick = (en?: string | null, bm?: string | null): string => {
    if (language === 'BM' && bm && bm.trim()) return bm
    return en ?? ''
  }
  const { data: liveData } = useLivePreview({
    initialData: initialData ?? {},
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 2,
  })
  // Tolerate a missing global (e.g. fresh production DB where ShibuyaPage
  // hasn't been seeded yet) — every field below falls back to a hardcoded
  // default already, but only if `data` itself is an object.
  const data: any = liveData ?? initialData ?? {}

  const [selectedMachine, setSelectedMachine] = useState<any>(null)

  useEffect(() => {
    const machines = data.machines ?? []
    setSelectedMachine(machines[2] ?? machines[0] ?? null)
  }, [data.machines])

  // ── Hero ────────────────────────────────────────────────────────────────────
  const heroBadge = pick(data.hero?.badge, data.hero?.badgeBM) || 'ENGINEERED IN JAPAN'
  const heroLine1 = pick(data.hero?.headlineLine1, data.hero?.headlineLine1BM) || 'Precision Without'
  const heroLine2 = pick(data.hero?.headlineLine2, data.hero?.headlineLine2BM) || 'Compromise'
  const heroSubheadline =
    pick(data.hero?.subheadline, data.hero?.subheadlineBM) ||
    'Shibuya core drilling machines represent five decades of Japanese engineering excellence. Trusted by professionals who demand nothing less than perfection.'
  const heroImageUrl = data.hero?.heroImage?.url ?? '/images/shibuya-hero.jpg'

  // ── Heritage ────────────────────────────────────────────────────────────────
  const heritageSince = data.heritage?.since ?? '1973'
  const heritageStatement =
    pick(data.heritage?.statement, data.heritage?.statementBM) ||
    'Five decades of relentless pursuit of perfection. Every Shibuya machine is a testament to Japanese craftsmanship.'

  // ── Craftsmanship ───────────────────────────────────────────────────────────
  const craftEyebrow = pick(data.craftsmanship?.sectionLabel, data.craftsmanship?.sectionLabelBM) || 'CRAFTSMANSHIP'
  const craftHeadline = pick(data.craftsmanship?.title, data.craftsmanship?.titleBM) || 'Built to Last Generations'
  const craftBody =
    pick(data.craftsmanship?.body, data.craftsmanship?.bodyBM) ||
    'Every Shibuya machine begins its life in our Osaka manufacturing facility, where traditional Japanese craftsmanship meets modern precision engineering.'
  const craftPoints = data.craftsmanship?.points ?? []
  const craftImageUrl = data.craftsmanship?.image?.url ?? '/images/shibuya-detail.jpg'

  // ── Machines ────────────────────────────────────────────────────────────────
  const machines: any[] = data.machines ?? []

  // ── InAction ────────────────────────────────────────────────────────────────
  const inActionHeadline = pick(data.inAction?.title, data.inAction?.titleBM) || 'Built for Real Work'
  const inActionBody =
    pick(data.inAction?.body, data.inAction?.bodyBM) ||
    'From high-rise construction to infrastructure projects, Shibuya machines perform flawlessly in the most demanding conditions.'
  const inActionCtaHref = '/applications'
  const inActionImageUrl = data.inAction?.image?.url ?? '/images/shibuya-action.jpg'

  // ── Support ─────────────────────────────────────────────────────────────────
  const supportHeadline = pick(data.support?.title, data.support?.titleBM) || 'We Stand Behind Every Machine'
  const supportItems = data.support?.items ?? []

  // ── CTA ─────────────────────────────────────────────────────────────────────
  const ctaHeadline = pick(data.cta?.headline, data.cta?.headlineBM) || 'Experience the Difference'
  const ctaSubheadline =
    pick(data.cta?.subheadline, data.cta?.subheadlineBM) ||
    'Schedule a demonstration at your site or visit our showroom to see Shibuya performance firsthand.'
  const ctaPrimaryLabel = pick(data.cta?.primaryCtaLabel, data.cta?.primaryCtaLabelBM) || 'Request a demo'
  const ctaPrimaryHref = '/contact'
  const ctaSecondaryLabel = pick(data.cta?.secondaryCtaLabel, data.cta?.secondaryCtaLabelBM) || 'Download Brochure'
  const ctaSecondaryHref = '/contact'

  return (
    <PublicLayout>

      {/* Hero - Cinematic reveal */}
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-shibuya-ink">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-shibuya-ink" />

        {/* Background image */}
        <div className="absolute inset-0 opacity-40">
          <Image
            src={heroImageUrl}
            alt="Shibuya Core Drill"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 lg:px-8">
          <div className="max-w-3xl">
            {/* Origin badge */}
            <div className="mb-8">
              <span className="inline-block border border-white/20 px-4 py-2 text-xs font-medium tracking-[0.3em] text-white/60">
                {heroBadge}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {heroLine1}
              <span className="block text-white/40">{heroLine2}</span>
            </h1>

            {/* Subheading */}
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/50">
              {heroSubheadline}
            </p>

            {/* CTA */}
            <div className="mt-12 flex flex-wrap gap-6">
              <Link
                href="#models"
                className="inline-flex items-center gap-3 bg-white px-8 py-4 text-sm font-semibold text-shibuya-ink transition-colors hover:bg-white/90"
              >
                {t.pages.shibuya.heroPrimaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button className="inline-flex items-center gap-3 border border-white/20 px-8 py-4 text-sm font-semibold text-white transition-[border-color,background-color] hover:border-white/40 hover:bg-white/5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30">
                  <Play className="h-3 w-3 fill-white" />
                </div>
                {t.pages.shibuya.heroSecondaryLabel}
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-3 text-white/30">
            <span className="text-xs tracking-[0.2em]">{t.pages.shibuya.scroll}</span>
            <ArrowDown className="h-4 w-4" />
          </div>
        </div>
      </section>

      {/* Heritage Statement */}
      <section className="bg-shibuya-paper py-32">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <p className="text-sm font-medium tracking-[0.2em] text-navy/40">{t.pages.shibuya.sincePrefix} {heritageSince}</p>
          <h2 className="mt-8 text-3xl font-bold leading-snug tracking-tight text-navy md:text-4xl lg:text-5xl">
            {heritageStatement}
          </h2>
          <div className="mx-auto mt-12 h-px w-16 bg-navy/20" />
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Image */}
            <div className="relative aspect-[4/5] overflow-hidden bg-shibuya-paper">
              <Image
                src={craftImageUrl}
                alt="Shibuya precision engineering"
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium tracking-[0.2em] text-navy/40">{craftEyebrow}</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-navy md:text-4xl">
                {craftHeadline}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-ink-muted">
                {craftBody}
              </p>

              <div className="mt-12 space-y-8">
                {craftPoints.map((point: any) => (
                  <div key={point.number} className="flex gap-6">
                    <span className="text-sm font-medium text-navy/20">{point.number}</span>
                    <div>
                      <h3 className="font-semibold text-navy">{pick(point.title, point.titleBM)}</h3>
                      <p className="mt-1 text-sm text-ink-muted">{pick(point.description, point.descriptionBM)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Models - Premium showcase */}
      <section id="models" className="bg-shibuya-ink py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-20 text-center">
            <p className="text-sm font-medium tracking-[0.2em] text-white/40">{t.pages.shibuya.modelsEyebrow}</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              {t.pages.shibuya.modelsHeadline}
            </h2>
          </div>

          {machines.length > 0 && (
            <>
              {/* Model tabs */}
              <div className="mb-16 flex flex-wrap justify-center gap-2 border-b border-white/10 pb-8">
                {machines.map((machine: any, idx: number) => (
                  <button
                    key={machine.modelId ?? idx}
                    onClick={() => setSelectedMachine(machine)}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      selectedMachine?.modelId === machine.modelId
                        ? 'bg-white text-shibuya-ink'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {machine.name}
                  </button>
                ))}
              </div>

              {/* Selected model */}
              {selectedMachine && (
                <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-white/5">
                    <Image
                      src={selectedMachine.image?.url ?? '/images/shibuya-hero.jpg'}
                      alt={selectedMachine.name ?? ''}
                      fill
                      className="object-contain p-8"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-medium tracking-[0.2em] text-accent">{pick(selectedMachine.tagline, selectedMachine.taglineBM)}</p>
                    <h3 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
                      {t.pages.shibuya.modelNamePrefix} {selectedMachine.name}
                    </h3>
                    <p className="mt-6 text-lg leading-relaxed text-white/50">
                      {pick(selectedMachine.description, selectedMachine.descriptionBM)}
                    </p>

                    {/* Specs grid */}
                    <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                      <div>
                        <p className="font-mono text-3xl font-bold text-white">{selectedMachine.motorPower}</p>
                        <p className="mt-1 text-sm text-white/40">{t.pages.shibuya.motorPowerLabel}</p>
                      </div>
                      <div>
                        <p className="font-mono text-3xl font-bold text-white">{selectedMachine.maxDiameter}</p>
                        <p className="mt-1 text-sm text-white/40">{t.pages.shibuya.maxDiameterLabel}</p>
                      </div>
                      <div>
                        <p className="font-mono text-3xl font-bold text-white">{selectedMachine.weight}</p>
                        <p className="mt-1 text-sm text-white/40">{t.pages.shibuya.weightLabel}</p>
                      </div>
                      <div>
                        <p className="font-mono text-3xl font-bold text-white">{selectedMachine.rpmRange}</p>
                        <p className="mt-1 text-sm text-white/40">{t.pages.shibuya.rpmRangeLabel}</p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mt-12">
                      <p className="mb-4 text-sm font-medium text-white/40">{t.pages.shibuya.keyFeaturesLabel}</p>
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {(selectedMachine.features ?? []).map((featureObj: any, idx: number) => (
                          <li key={idx} className="flex items-center gap-3 text-sm text-white/70">
                            <Check className="h-4 w-4 flex-shrink-0 text-accent" />
                            {pick(featureObj.feature, featureObj.featureBM)}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Price and CTA */}
                    <div className="mt-12 flex flex-wrap items-center gap-8">
                      <div>
                        <p className="text-sm text-white/40">{t.pages.shibuya.startingFromLabel}</p>
                        <p className="font-mono text-3xl font-bold text-white">{selectedMachine.price}</p>
                      </div>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-accent-dark px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-accent"
                      >
                        {t.pages.shibuya.requestQuote}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* In Action */}
      <section className="relative h-[80vh] overflow-hidden">
        <Image
          src={inActionImageUrl}
          alt="Shibuya in action"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-shibuya-ink/90 via-shibuya-ink/50 to-transparent" />
        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-xl">
              <p className="text-sm font-medium tracking-[0.2em] text-white/40">{t.pages.shibuya.inActionEyebrow}</p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
                {inActionHeadline}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/60">
                {inActionBody}
              </p>
              <Link
                href={inActionCtaHref}
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white"
              >
                {t.pages.shibuya.inActionCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="bg-shibuya-paper py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-3">
            <div>
              <p className="text-sm font-medium tracking-[0.2em] text-navy/40">{t.pages.shibuya.supportEyebrow}</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-navy">
                {supportHeadline}
              </h2>
            </div>
            <div className="lg:col-span-2">
              <div className="grid gap-12 sm:grid-cols-2">
                {supportItems.map((item: any, idx: number) => (
                  <div key={idx}>
                    <h3 className="text-lg font-semibold text-navy">{pick(item.title, item.titleBM)}</h3>
                    <p className="mt-2 text-ink-muted">{pick(item.description, item.descriptionBM)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-shibuya-ink py-32">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            {ctaHeadline}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/50">
            {ctaSubheadline}
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href={ctaPrimaryHref}
              className="inline-flex items-center gap-2 bg-white px-8 py-4 text-sm font-semibold text-shibuya-ink transition-colors hover:bg-white/90"
            >
              {ctaPrimaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={ctaSecondaryHref}
              className="inline-flex items-center gap-2 border border-white/20 px-8 py-4 text-sm font-semibold text-white transition-[border-color,background-color] hover:border-white/40 hover:bg-white/5"
            >
              {ctaSecondaryLabel}
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  )
}
