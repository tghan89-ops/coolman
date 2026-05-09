'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowDown, Play, Check } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { useLivePreview } from '@payloadcms/live-preview-react'

interface ShibuyaClientProps {
  initialData: any
}

export function ShibuyaClient({ initialData }: ShibuyaClientProps) {
  const { data } = useLivePreview({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 2,
  })

  const [selectedMachine, setSelectedMachine] = useState<any>(null)

  useEffect(() => {
    const machines = data.machines ?? []
    setSelectedMachine(machines[2] ?? machines[0] ?? null)
  }, [data.machines])

  // ── Hero ────────────────────────────────────────────────────────────────────
  const heroBadge = data.hero?.badge ?? 'ENGINEERED IN JAPAN'
  const heroLine1 = data.hero?.headlineLine1 ?? 'Precision Without'
  const heroLine2 = data.hero?.headlineLine2 ?? 'Compromise'
  const heroSubheadline =
    data.hero?.subheadline ??
    'Shibuya core drilling machines represent five decades of Japanese engineering excellence. Trusted by professionals who demand nothing less than perfection.'
  const heroPrimaryLabel = 'Explore Models'
  const heroSecondaryLabel = 'Watch Film'
  const heroImageUrl = data.hero?.heroImage?.url ?? '/images/shibuya-hero.jpg'

  // ── Heritage ────────────────────────────────────────────────────────────────
  const heritageSince = data.heritage?.since ?? '1973'
  const heritageStatement =
    data.heritage?.statement ??
    'Five decades of relentless pursuit of perfection. Every Shibuya machine is a testament to Japanese craftsmanship.'

  // ── Craftsmanship ───────────────────────────────────────────────────────────
  const craftEyebrow = data.craftsmanship?.sectionLabel ?? 'CRAFTSMANSHIP'
  const craftHeadline = data.craftsmanship?.title ?? 'Built to Last Generations'
  const craftBody =
    data.craftsmanship?.body ??
    'Every Shibuya machine begins its life in our Osaka manufacturing facility, where traditional Japanese craftsmanship meets modern precision engineering.'
  const craftPoints = data.craftsmanship?.points ?? [
    {
      number: '01',
      title: 'Precision Manufacturing',
      description: 'Every component machined to tolerances of 0.01mm in our Osaka facility.',
    },
    {
      number: '02',
      title: 'Quality Materials',
      description: 'Aircraft-grade aluminum housings and hardened steel gearing throughout.',
    },
    {
      number: '03',
      title: 'Rigorous Testing',
      description: '72-hour continuous operation test before any machine leaves the factory.',
    },
    {
      number: '04',
      title: 'Hand Assembly',
      description: 'Final assembly by master technicians with decades of experience.',
    },
  ]
  const craftImageUrl = data.craftsmanship?.image?.url ?? '/images/shibuya-detail.jpg'

  // ── Machines ────────────────────────────────────────────────────────────────
  const machines: any[] = data.machines ?? []

  // ── InAction ────────────────────────────────────────────────────────────────
  const inActionEyebrow = 'IN THE FIELD'
  const inActionHeadline = data.inAction?.title ?? 'Built for Real Work'
  const inActionBody =
    data.inAction?.body ??
    'From high-rise construction to infrastructure projects, Shibuya machines perform flawlessly in the most demanding conditions.'
  const inActionCtaLabel = 'View Applications'
  const inActionCtaHref = '/applications'
  const inActionImageUrl = data.inAction?.image?.url ?? '/images/shibuya-action.jpg'

  // ── Support ─────────────────────────────────────────────────────────────────
  const supportEyebrow = 'SUPPORT'
  const supportHeadline = data.support?.title ?? 'We Stand Behind Every Machine'
  const supportItems = data.support?.items ?? [
    {
      title: '2-Year Warranty',
      description: 'Comprehensive manufacturer warranty with full parts and labor coverage.',
    },
    {
      title: 'Local Service Center',
      description: 'Dedicated service facility in Kuala Lumpur staffed by factory-trained technicians.',
    },
    {
      title: 'Spare Parts Stock',
      description: 'Full inventory of genuine Shibuya parts for rapid repairs and maintenance.',
    },
    {
      title: 'Operator Training',
      description: 'Complimentary training program included with every machine purchase.',
    },
  ]

  // ── CTA ─────────────────────────────────────────────────────────────────────
  const ctaHeadline = data.cta?.headline ?? 'Experience the Difference'
  const ctaSubheadline =
    data.cta?.subheadline ??
    'Schedule a demonstration at your site or visit our showroom to see Shibuya performance firsthand.'
  const ctaPrimaryLabel = data.cta?.primaryCtaLabel ?? 'Schedule Demo'
  const ctaPrimaryHref = '/contact'
  const ctaSecondaryLabel = data.cta?.secondaryCtaLabel ?? 'Download Brochure'
  const ctaSecondaryHref = '/contact'

  return (
    <PublicLayout>

      {/* Hero - Cinematic reveal */}
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#030508]">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030508]" />

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
            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
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
                className="inline-flex items-center gap-3 bg-white px-8 py-4 text-sm font-semibold text-[#030508] transition-colors hover:bg-white/90"
              >
                {heroPrimaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button className="inline-flex items-center gap-3 border border-white/20 px-8 py-4 text-sm font-semibold text-white transition-[border-color,background-color] hover:border-white/40 hover:bg-white/5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30">
                  <Play className="h-3 w-3 fill-white" />
                </div>
                {heroSecondaryLabel}
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-3 text-white/30">
            <span className="text-xs tracking-[0.2em]">SCROLL</span>
            <ArrowDown className="h-4 w-4" />
          </div>
        </div>
      </section>

      {/* Heritage Statement */}
      <section className="bg-[#f8f7f4] py-32">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <p className="text-sm font-medium tracking-[0.2em] text-navy/40">SINCE {heritageSince}</p>
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
            <div className="relative aspect-[4/5] overflow-hidden bg-[#f8f7f4]">
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
                      <h3 className="font-semibold text-navy">{point.title}</h3>
                      <p className="mt-1 text-sm text-ink-muted">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Models - Premium showcase */}
      <section id="models" className="bg-[#030508] py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-20 text-center">
            <p className="text-sm font-medium tracking-[0.2em] text-white/40">THE RANGE</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Choose Your Machine
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
                        ? 'bg-white text-[#030508]'
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
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
                    <Image
                      src={selectedMachine.image?.url ?? '/images/shibuya-hero.jpg'}
                      alt={selectedMachine.name ?? ''}
                      fill
                      className="object-contain p-8"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-medium tracking-[0.2em] text-accent">{selectedMachine.tagline}</p>
                    <h3 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
                      Shibuya {selectedMachine.name}
                    </h3>
                    <p className="mt-6 text-lg leading-relaxed text-white/50">
                      {selectedMachine.description}
                    </p>

                    {/* Specs grid */}
                    <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                      <div>
                        <p className="text-3xl font-bold text-white">{selectedMachine.motorPower}</p>
                        <p className="mt-1 text-sm text-white/40">Motor Power</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-white">{selectedMachine.maxDiameter}</p>
                        <p className="mt-1 text-sm text-white/40">Max Diameter</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-white">{selectedMachine.weight}</p>
                        <p className="mt-1 text-sm text-white/40">Weight</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-white">{selectedMachine.rpmRange}</p>
                        <p className="mt-1 text-sm text-white/40">RPM Range</p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mt-12">
                      <p className="mb-4 text-sm font-medium text-white/40">KEY FEATURES</p>
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {(selectedMachine.features ?? []).map((featureObj: any, idx: number) => (
                          <li key={idx} className="flex items-center gap-3 text-sm text-white/70">
                            <Check className="h-4 w-4 flex-shrink-0 text-accent" />
                            {featureObj.feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Price and CTA */}
                    <div className="mt-12 flex flex-wrap items-center gap-8">
                      <div>
                        <p className="text-sm text-white/40">Starting from</p>
                        <p className="text-3xl font-bold text-white">{selectedMachine.price}</p>
                      </div>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-accent px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
                      >
                        Request Quote
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#030508]/90 via-[#030508]/50 to-transparent" />
        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-xl">
              <p className="text-sm font-medium tracking-[0.2em] text-white/40">{inActionEyebrow}</p>
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
                {inActionCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="bg-[#f8f7f4] py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-3">
            <div>
              <p className="text-sm font-medium tracking-[0.2em] text-navy/40">{supportEyebrow}</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-navy">
                {supportHeadline}
              </h2>
            </div>
            <div className="lg:col-span-2">
              <div className="grid gap-12 sm:grid-cols-2">
                {supportItems.map((item: any, idx: number) => (
                  <div key={idx}>
                    <h3 className="text-lg font-semibold text-navy">{item.title}</h3>
                    <p className="mt-2 text-ink-muted">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#030508] py-32">
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
              className="inline-flex items-center gap-2 bg-white px-8 py-4 text-sm font-semibold text-[#030508] transition-colors hover:bg-white/90"
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
