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
  const { data } = useLivePreview({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 1,
  })

  const hero = data?.hero ?? fallback.hero
  const advantages: any[] = data?.advantages?.length ? data.advantages : fallback.advantages
  const statsSection = data?.statsSection ?? fallback.statsSection
  const stats: any[] = data?.stats?.length ? data.stats : fallback.stats
  const testimonialsSection = data?.testimonialsSection ?? fallback.testimonialsSection
  const testimonials: any[] = data?.testimonials?.length ? data.testimonials : fallback.testimonials
  const cta = data?.cta ?? fallback.cta

  return (
    <PublicLayout>
      <section className="bg-navy pb-16 pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">{hero.eyebrow}</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white lg:text-5xl">{hero.title}</h1>
            <p className="mt-6 text-lg text-white/60">{hero.lede}</p>
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
            <h2 className="text-3xl font-bold text-white">{statsSection.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">{statsSection.subtitle}</p>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.id ?? i} className="text-center">
                <div className="font-mono text-4xl font-bold text-accent lg:text-5xl">{s.value}</div>
                <div className="mt-2 text-sm text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="bg-secondary py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">{testimonialsSection.eyebrow}</p>
              <h2 className="mt-3 text-3xl font-bold text-navy">{testimonialsSection.title}</h2>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <div key={t.id ?? i} className="rounded-2xl bg-white p-8 shadow-sm">
                  <p className="text-ink-muted">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-6">
                    <p className="font-semibold text-navy">{t.author}</p>
                    <p className="text-sm text-ink-muted">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-navy">{cta.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-muted">{cta.body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="h-14 rounded-xl bg-accent-dark px-8 text-white hover:bg-accent" asChild>
              <Link href={cta.primaryHref}>
                {cta.primaryLabel}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 rounded-xl border-rule px-8" asChild>
              <Link href={cta.secondaryHref}>{cta.secondaryLabel}</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
