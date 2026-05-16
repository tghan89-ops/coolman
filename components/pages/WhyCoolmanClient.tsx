'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Users,
  Award,
  Truck,
  Headphones,
  BarChart3,
  type LucideIcon,
} from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { useLanguage } from '@/lib/i18n/context'

const ICONS: Record<string, LucideIcon> = {
  zap: Zap,
  shield: Shield,
  clock: Clock,
  users: Users,
  award: Award,
  truck: Truck,
  headphones: Headphones,
  barChart3: BarChart3,
}

export function WhyCoolmanClient({ initialData }: { initialData: any }) {
  const { language, t } = useLanguage()
  const fallback = t.pages.whyCoolman
  // copyFallback is already in the active language (EN or BM) from copy.ts
  const pickL = (en: string | null | undefined, bm: string | null | undefined, copyFallback: string): string => {
    if (language === 'BM') {
      if (bm && bm.trim()) return bm
      return copyFallback
    }
    if (en && en.trim()) return en
    return copyFallback
  }
  const { data } = useLivePreview({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 1,
  })

  const heroData = data?.hero ?? {}
  const cmsAdvantages: any[] = data?.advantages?.length ? data.advantages : []
  const advantages = fallback.advantages.map((copyItem, i) => {
    const cms = cmsAdvantages[i] ?? {}
    return {
      iconKey: cms.iconKey || copyItem.iconKey,
      title: pickL(cms.title, cms.titleBM, copyItem.title),
      body: pickL(cms.body, cms.bodyBM, copyItem.body),
      id: cms.id ?? i,
    }
  })
  const statsSectionData = data?.statsSection ?? {}
  const cmsStats: any[] = data?.stats?.length ? data.stats : []
  const stats = fallback.stats.map((copyItem, i) => {
    const cms = cmsStats[i] ?? {}
    return {
      value: cms.value || copyItem.value,
      label: pickL(cms.label, cms.labelBM, copyItem.label),
      id: cms.id ?? i,
    }
  })
  const testimonialsSectionData = data?.testimonialsSection ?? {}
  const testimonials: any[] = data?.testimonials?.length ? data.testimonials : []
  const ctaData = data?.cta ?? {}

  const heroEyebrow = pickL(heroData?.eyebrow, heroData?.eyebrowBM, fallback.hero.eyebrow)
  const heroTitle = pickL(heroData?.title, heroData?.titleBM, fallback.hero.title)
  const heroLede = pickL(heroData?.lede, heroData?.ledeBM, fallback.hero.lede)

  const statsTitle = pickL(statsSectionData?.title, statsSectionData?.titleBM, fallback.statsSection.title)
  const statsSubtitle = pickL(statsSectionData?.subtitle, statsSectionData?.subtitleBM, fallback.statsSection.subtitle)

  const testimonialsEyebrow = pickL(testimonialsSectionData?.eyebrow, testimonialsSectionData?.eyebrowBM, fallback.testimonialsSection.eyebrow)
  const testimonialsTitle = pickL(testimonialsSectionData?.title, testimonialsSectionData?.titleBM, fallback.testimonialsSection.title)

  const ctaTitle = pickL(ctaData?.title, ctaData?.titleBM, fallback.cta.title)
  const ctaBody = pickL(ctaData?.body, ctaData?.bodyBM, fallback.cta.body)
  const ctaPrimaryLabel = pickL(ctaData?.primaryLabel, ctaData?.primaryLabelBM, fallback.cta.primaryLabel)
  const ctaSecondaryLabel = pickL(ctaData?.secondaryLabel, ctaData?.secondaryLabelBM, fallback.cta.secondaryLabel)
  const ctaPrimaryHref = ctaData?.primaryHref || fallback.cta.primaryHref
  const ctaSecondaryHref = ctaData?.secondaryHref || fallback.cta.secondaryHref

  return (
    <PublicLayout>
      <section className="bg-navy pb-16 pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">{heroEyebrow}</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white lg:text-5xl">{heroTitle}</h1>
            <p className="mt-6 text-lg text-white/60">{heroLede}</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {advantages.map((a, i) => {
              const Icon = ICONS[a.iconKey] ?? Zap
              return (
                <div key={a.id ?? i} className="hover-card group rounded-2xl border border-rule bg-white p-8">
                  <div className="inline-flex rounded-xl bg-accent/10 p-3 transition-colors group-hover:bg-accent">
                    <Icon className="h-6 w-6 text-accent transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-navy">{a.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{a.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-navy py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">{statsTitle}</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">{statsSubtitle}</p>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((s, i) => {
              return (
                <div key={s.id ?? i} className="text-center">
                  <div className="font-mono text-4xl font-bold text-accent lg:text-5xl">{s.value}</div>
                  <div className="mt-2 text-sm text-white/60">{s.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="bg-secondary py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">{testimonialsEyebrow}</p>
              <h2 className="mt-3 text-3xl font-bold text-navy">{testimonialsTitle}</h2>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {testimonials.map((t, i) => {
                const tQuote = pickL(t.quote, t.quoteBM, t.quote ?? '')
                const tRole = pickL(t.role, t.roleBM, t.role ?? '')
                return (
                  <div key={t.id ?? i} className="rounded-2xl bg-white p-8 shadow-sm">
                    <p className="text-ink-muted">&ldquo;{tQuote}&rdquo;</p>
                    <div className="mt-6">
                      <p className="font-semibold text-navy">{t.author}</p>
                      <p className="text-sm text-ink-muted">{tRole}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-navy">{ctaTitle}</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-muted">{ctaBody}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="h-14 rounded-xl bg-accent-dark px-8 text-white hover:bg-accent" asChild>
              <Link href={ctaPrimaryHref}>
                {ctaPrimaryLabel}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 rounded-xl border-rule px-8" asChild>
              <Link href={ctaSecondaryHref}>{ctaSecondaryLabel}</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
