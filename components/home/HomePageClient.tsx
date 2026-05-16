'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowRight, Play, Check, MousePointer2 } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { useLanguage } from '@/lib/i18n/context'

export function HomePageClient({ initialData }: { initialData: any }) {
  const { data } = useLivePreview({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 1,
  })
  const { language, t } = useLanguage()
  const fb = t.home.fallback

  // BM-mode CMS-blank falls back to copy.ts BM (not CMS EN). copyFallback is already language-correct.
  const pickL = (en: string | null | undefined, bm: string | null | undefined, copyFallback: string): string => {
    if (language === 'BM') {
      if (bm && bm.trim()) return bm
      return copyFallback
    }
    if (en && en.trim()) return en
    return copyFallback
  }

  // Per-index merge: CMS overrides copy.ts only when filled. Otherwise copy.ts wins.
  const cmsApplications: any[] = data?.applicationList?.length ? data.applicationList : []
  const applications = fb.applicationList.map((copyItem, i) => {
    const cms = cmsApplications[i] ?? {}
    const cmsImage = typeof cms.image === 'object' && cms.image?.url ? cms.image.url : typeof cms.image === 'string' ? cms.image : ''
    return {
      id: cms.id || copyItem.id,
      label: pickL(cms.label, cms.labelBM, copyItem.label),
      image: cmsImage || copyItem.image,
    }
  })

  const cmsStats: any[] = data?.stats?.length ? data.stats : []
  const stats = fb.stats.map((copyItem, i) => {
    const cms = cmsStats[i] ?? {}
    return {
      value: cms.value || copyItem.value,
      label: pickL(cms.label, cms.labelBM, copyItem.label),
    }
  })

  const cmsFeatures: any[] = data?.features?.length ? data.features : []
  const features = fb.features.map((copyItem, i) => {
    const cms = cmsFeatures[i] ?? {}
    return {
      title: pickL(cms.title, cms.titleBM, copyItem.title),
      description: pickL(cms.description, cms.descriptionBM, copyItem.description),
      stat: cms.stat || copyItem.stat,
      statLabel: pickL(cms.statLabel, cms.statLabelBM, copyItem.statLabel),
    }
  })

  const [activeApplication, setActiveApplication] = useState(() => applications[0]?.id ?? 'concrete')
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const currentApp = applications.find(a => a.id === activeApplication) ?? applications[0]
  const currentAppLabel = currentApp?.label ?? ''

  const heroData = data?.hero ?? {}
  const heroBadge = pickL(heroData.badge, heroData.badgeBM, fb.hero.badge)
  const heroLine1 = pickL(heroData.headlineLine1, heroData.headlineLine1BM, fb.hero.line1)
  const heroLine2 = pickL(heroData.headlineLine2, heroData.headlineLine2BM, fb.hero.line2)
  const heroLine3 = pickL(heroData.headlineLine3, heroData.headlineLine3BM, fb.hero.line3)
  const heroSubheadline = pickL(heroData.subheadline, heroData.subheadlineBM, fb.hero.subheadline)
  const heroPrimaryCtaLabel = pickL(heroData.primaryCtaLabel, heroData.primaryCtaLabelBM, fb.hero.primaryCtaLabel)
  const heroSecondaryCtaLabel = pickL(heroData.secondaryCtaLabel, heroData.secondaryCtaLabelBM, fb.hero.secondaryCtaLabel)

  const heroImageUrl: string = (typeof heroData.heroImage === 'object' && heroData.heroImage?.url) || '/images/hero-blade.jpg'
  const heroImageAlt: string = (typeof heroData.heroImage === 'object' && heroData.heroImage?.alt) || fb.hero.imageAlt

  const ctaData = data?.ctaSection ?? {}
  const ctaHeadline = pickL(ctaData.headline, ctaData.headlineBM, fb.ctaSection.headline)
  const ctaSubheadline = pickL(ctaData.subheadline, ctaData.subheadlineBM, fb.ctaSection.subheadline)
  const ctaPrimaryLabel = pickL(ctaData.primaryCtaLabel, ctaData.primaryCtaLabelBM, fb.ctaSection.primaryCtaLabel)
  const ctaSecondaryLabel = pickL(ctaData.secondaryCtaLabel, ctaData.secondaryCtaLabelBM, fb.ctaSection.secondaryCtaLabel)

  const viewBladesLabel = t.home.viewBladesSuffix
    ? `${t.home.viewBladesPrefix} ${currentAppLabel} ${t.home.viewBladesSuffix}`.replace(/\s+/g, ' ').trim()
    : `${t.home.viewBladesPrefix} ${currentAppLabel}`.trim()

  return (
    <PublicLayout headerVariant="transparent">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen overflow-hidden bg-navy"
        onMouseMove={handleMouseMove}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30 transition-opacity"
          style={{ background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59,130,246,0.15), transparent 40%)` }}
        />

        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        <div className="absolute right-0 top-0 h-full w-1/2 opacity-40 lg:opacity-60">
          <Image src={heroImageUrl} alt={heroImageAlt} fill className="object-cover" priority unoptimized={heroImageUrl.startsWith('http')} />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-20 pt-32 lg:px-8">
          <div className="max-w-3xl">

            <div className="mb-8 inline-flex items-center gap-3 border border-accent/30 bg-accent/10 px-5 py-2.5">
              <span className="inline-flex h-2 w-2 rounded-full bg-accent" />
              <span className="text-sm font-semibold tracking-wide text-accent">{heroBadge}</span>
            </div>

            <h1 className="font-sans text-4xl font-bold leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-6xl">
              {heroLine1}
              <span className="block text-accent">{heroLine2}</span>
              <span className="block">{heroLine3}</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/60">
              {heroSubheadline}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" className="group h-14 overflow-hidden bg-accent-dark px-8 font-sans text-base font-bold text-white transition-colors hover:bg-accent" asChild>
                <Link href="/products">
                  {heroPrimaryCtaLabel}
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="group h-14 border-2 border-white/30 bg-transparent px-8 font-sans text-base font-bold text-white transition-[border-color,background-color,color] hover:border-white hover:bg-white hover:text-navy" asChild>
                <Link href="/why-coolman">
                  <Play className="mr-3 h-5 w-5" />
                  {heroSecondaryCtaLabel}
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 border-t border-white/10 md:grid-cols-4 lg:mt-32">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group cursor-pointer border-b border-r border-white/10 px-6 py-8 transition-colors last:border-r-0 hover:bg-white/5 md:border-b-0"
              >
                <div className="font-mono font-sans text-4xl font-bold text-white md:text-5xl">{stat.value}</div>
                <div className="mt-2 text-sm font-semibold text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <MousePointer2 className="h-5 w-5 text-white/40" />
          <span className="text-xs font-semibold tracking-widest text-white/40">{t.home.scroll}</span>
        </div>
      </section>

      {/* ── SOLUTIONS ────────────────────────────────────────────── */}
      <section className="bg-secondary py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="font-sans text-sm font-bold tracking-[0.3em] text-accent">{t.home.solutionsEyebrow}</p>
          <h2 className="mt-4 font-sans text-4xl font-bold text-navy lg:text-6xl">
            {t.home.solutionsTitleLine1}<br />{t.home.solutionsTitleLine2}
          </h2>

          <div className="mt-12 flex flex-wrap gap-0 border-b border-rule">
            {applications.map((app) => (
              <button
                key={app.id}
                onClick={() => setActiveApplication(app.id)}
                className={`relative px-6 py-4 font-sans text-base font-bold transition-colors md:px-8 md:text-lg ${
                  activeApplication === app.id ? 'text-navy' : 'text-ink-faint hover:text-ink-muted'
                }`}
              >
                {app.label}
                <span className={`absolute bottom-0 left-0 h-1 bg-accent transition-[width] ${activeApplication === app.id ? 'w-full' : 'w-0'}`} />
              </button>
            ))}
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden bg-navy">
              <Image
                src={currentApp?.image || '/images/blade-concrete.jpg'}
                alt={activeApplication}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <h3 className="font-sans text-3xl font-bold text-navy lg:text-4xl">
                {currentAppLabel} {t.home.materialCuttingSuffix}
              </h3>
              <p className="mt-6 text-lg leading-relaxed text-ink-muted">
                {t.home.materialDescription.replace('{material}', currentAppLabel.toLowerCase())}
              </p>

              <ul className="mt-8 space-y-4">
                {[t.home.bullets.segmentSpacing, t.home.bullets.bondHardness, t.home.bullets.precisionBalanced, t.home.bullets.extendedLife].map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center bg-accent">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-navy">{item}</span>
                  </li>
                ))}
              </ul>

              <Button className="mt-10 h-14 w-fit bg-navy px-8 font-sans font-bold text-white hover:bg-navy-light" asChild>
                <Link href={`/products?material=${activeApplication}`}>
                  {viewBladesLabel}
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY COOLMAN ──────────────────────────────────────────── */}
      <section className="bg-navy py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <p className="font-sans text-sm font-bold tracking-[0.3em] text-accent">{t.home.whyEyebrow}</p>
            <h2 className="mt-4 font-sans text-4xl font-bold text-white lg:text-6xl">
              {t.home.whyTitle}
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative cursor-pointer overflow-hidden border border-white/10 bg-white/5 p-8 transition-[border-color,background-color] hover:border-accent/50 hover:bg-white/10"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="relative">
                  <div className="font-mono font-sans text-5xl font-bold text-accent">
                    {feature.stat}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white/40">{feature.statLabel}</div>

                  <h3 className="mt-6 font-sans text-lg font-bold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{feature.description}</p>

                  <div className={`mt-6 flex items-center gap-2 text-accent transition-opacity ${hoveredFeature === index ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-sm font-bold">{t.cta.explore}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ─────────────────────────────────────────────── */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="font-sans text-sm font-bold tracking-[0.3em] text-accent">{t.home.productsEyebrow}</p>
              <h2 className="mt-4 font-sans text-4xl font-bold text-navy lg:text-6xl">{t.home.productsTitle}</h2>
            </div>
            <Link href="/products" className="group flex items-center gap-2 font-sans text-sm font-bold tracking-wide text-navy transition-colors hover:text-accent">
              {t.home.viewAllProducts}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              { name: t.home.placeholderProducts.graniteName, image: '/images/blade-granite.jpg', priceValue: '89', desc: t.home.placeholderProducts.graniteDesc },
              { name: t.home.placeholderProducts.concreteName, image: '/images/blade-concrete.jpg', priceValue: '75', desc: t.home.placeholderProducts.concreteDesc },
              { name: t.home.placeholderProducts.tileName, image: '/images/blade-tile.jpg', priceValue: '65', desc: t.home.placeholderProducts.tileDesc },
            ].map((product, index) => (
              <Link key={index} href="/products" className="group relative aspect-square overflow-hidden bg-secondary">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-navy/0 transition-colors group-hover:bg-navy/70" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-sm font-bold text-accent">
                      {t.home.placeholderProducts.priceFrom} <span className="font-mono">{product.priceValue}</span>
                    </p>
                  </div>
                  <h3 className="font-sans text-2xl font-bold text-white drop-shadow-lg">{product.name}</h3>
                  <p className="text-sm text-white/80 drop-shadow">{product.desc}</p>
                  <div className="mt-4 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="font-sans text-sm font-bold text-white">{t.cta.openProduct}</span>
                    <ArrowRight className="h-4 w-4 text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-accent py-24 lg:py-32">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(45deg, var(--navy) 25%, transparent 25%), linear-gradient(-45deg, var(--navy) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--navy) 75%), linear-gradient(-45deg, transparent 75%, var(--navy) 75%)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="font-sans text-4xl font-bold text-white lg:text-6xl">
            {ctaHeadline.split('\n').map((line: string, i: number, arr: string[]) => (
              i < arr.length - 1 ? <span key={i}>{line}<br /></span> : <span key={i}>{line}</span>
            ))}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">
            {ctaSubheadline}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="h-14 bg-white px-8 font-sans font-bold text-navy transition-colors hover:bg-secondary" asChild>
              <Link href="/contact">
                {ctaPrimaryLabel}
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 border-2 border-white bg-transparent px-8 font-sans font-bold text-white hover:bg-white hover:text-accent" asChild>
              <Link href="/resources">{ctaSecondaryLabel}</Link>
            </Button>
          </div>
        </div>
      </section>

    </PublicLayout>
  )
}
