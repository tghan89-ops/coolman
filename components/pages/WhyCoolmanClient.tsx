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

const fallback = {
  hero: {
    eyebrow: 'Why Coolman',
    title: 'The Coolman Advantage',
    lede: 'More than just tools - we provide complete cutting solutions and ongoing partnership for contractors who demand excellence.',
  },
  advantages: [
    { iconKey: 'zap', title: 'Superior Cutting Performance', body: 'Our diamond segments are formulated for 40% faster cutting speeds while maintaining precision.' },
    { iconKey: 'shield', title: 'Extended Blade Life', body: 'Proprietary bonding technology delivers up to 3x longer operational life.' },
    { iconKey: 'award', title: '25+ Years of Excellence', body: 'Since 1998, engineering cutting solutions for Malaysian contractors.' },
    { iconKey: 'truck', title: 'Rapid Fulfillment', body: 'Same-day dispatch for orders placed before 2pm.' },
    { iconKey: 'headphones', title: 'Technical Partnership', body: 'Dedicated engineering support to help you select the right tools.' },
    { iconKey: 'barChart3', title: 'B2B Pricing Advantage', body: 'Registered contractors enjoy exclusive pricing tiers.' },
  ],
  statsSection: { title: 'Trusted by Professionals', subtitle: 'Our track record speaks for itself.' },
  stats: [
    { value: '500+', label: 'Active Contractors' },
    { value: '50,000+', label: 'Projects Completed' },
    { value: '99.2%', label: 'On-Time Delivery' },
    { value: '4.9/5', label: 'Customer Rating' },
  ],
  testimonialsSection: { eyebrow: 'Testimonials', title: 'What Our Partners Say' },
  testimonials: [] as Array<{ quote: string; author: string; role: string }>,
  cta: {
    title: 'Ready to Experience the Difference?',
    body: 'Join 500+ professional contractors who trust Coolman.',
    primaryLabel: 'Become a Partner',
    primaryHref: '/auth/register',
    secondaryLabel: 'Contact Sales',
    secondaryHref: '/contact',
  },
}

export function WhyCoolmanClient({ initialData }: { initialData: any }) {
  const { language } = useLanguage()
  const pick = (en?: string | null, bm?: string | null): string => {
    if (language === 'BM' && bm && bm.trim()) return bm
    return en ?? ''
  }
  const { data } = useLivePreview({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 1,
  })

  const heroData = data?.hero ?? fallback.hero
  const advantages: any[] = data?.advantages?.length ? data.advantages : fallback.advantages
  const statsSectionData = data?.statsSection ?? fallback.statsSection
  const stats: any[] = data?.stats?.length ? data.stats : fallback.stats
  const testimonialsSectionData = data?.testimonialsSection ?? fallback.testimonialsSection
  const testimonials: any[] = data?.testimonials?.length ? data.testimonials : fallback.testimonials
  const ctaData = data?.cta ?? fallback.cta

  const heroEyebrow = pick(heroData?.eyebrow, heroData?.eyebrowBM) || fallback.hero.eyebrow
  const heroTitle = pick(heroData?.title, heroData?.titleBM) || fallback.hero.title
  const heroLede = pick(heroData?.lede, heroData?.ledeBM) || fallback.hero.lede

  const statsTitle = pick(statsSectionData?.title, statsSectionData?.titleBM) || fallback.statsSection.title
  const statsSubtitle = pick(statsSectionData?.subtitle, statsSectionData?.subtitleBM) || fallback.statsSection.subtitle

  const testimonialsEyebrow = pick(testimonialsSectionData?.eyebrow, testimonialsSectionData?.eyebrowBM) || fallback.testimonialsSection.eyebrow
  const testimonialsTitle = pick(testimonialsSectionData?.title, testimonialsSectionData?.titleBM) || fallback.testimonialsSection.title

  const ctaTitle = pick(ctaData?.title, ctaData?.titleBM) || fallback.cta.title
  const ctaBody = pick(ctaData?.body, ctaData?.bodyBM) || fallback.cta.body
  const ctaPrimaryLabel = pick(ctaData?.primaryLabel, ctaData?.primaryLabelBM) || fallback.cta.primaryLabel
  const ctaSecondaryLabel = pick(ctaData?.secondaryLabel, ctaData?.secondaryLabelBM) || fallback.cta.secondaryLabel
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
              const aTitle = pick(a.title, a.titleBM) || ''
              const aBody = pick(a.body, a.bodyBM) || ''
              return (
                <div key={a.id ?? i} className="hover-card group rounded-2xl border border-rule bg-white p-8">
                  <div className="inline-flex rounded-xl bg-accent/10 p-3 transition-colors group-hover:bg-accent">
                    <Icon className="h-6 w-6 text-accent transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-navy">{aTitle}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{aBody}</p>
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
              const sLabel = pick(s.label, s.labelBM) || ''
              return (
                <div key={s.id ?? i} className="text-center">
                  <div className="font-mono text-4xl font-bold text-accent lg:text-5xl">{s.value}</div>
                  <div className="mt-2 text-sm text-white/60">{sLabel}</div>
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
                const tQuote = pick(t.quote, t.quoteBM) || ''
                const tRole = pick(t.role, t.roleBM) || ''
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
