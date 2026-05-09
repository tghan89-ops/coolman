'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowRight, Play, Zap, Shield, Clock, Users, Check, MousePointer2 } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { useLivePreview } from '@payloadcms/live-preview-react'

const applications = [
  { id: 'concrete', label: 'Concrete', image: '/images/blade-concrete.jpg' },
  { id: 'granite', label: 'Granite', image: '/images/blade-granite.jpg' },
  { id: 'marble', label: 'Marble', image: '/images/blade-granite.jpg' },
  { id: 'tile', label: 'Tile & Ceramic', image: '/images/blade-tile.jpg' },
]

const defaultStats = [
  { value: '25+', label: 'Years' },
  { value: '500+', label: 'Contractors' },
  { value: '50K+', label: 'Projects' },
  { value: '99%', label: 'On-Time' },
]

const features = [
  {
    icon: Zap,
    title: 'Superior Cutting Speed',
    description: '40% faster cutting compared to standard blades.',
    stat: '40%',
    statLabel: 'Faster'
  },
  {
    icon: Shield,
    title: 'Extended Blade Life',
    description: 'Proprietary bonding technology ensures longer life.',
    stat: '3×',
    statLabel: 'Longer'
  },
  {
    icon: Clock,
    title: 'Rapid Fulfillment',
    description: 'Same-day dispatch for orders placed before 2pm.',
    stat: '24h',
    statLabel: 'Delivery'
  },
  {
    icon: Users,
    title: 'Technical Support',
    description: 'Dedicated team to help optimise your operations.',
    stat: '24/7',
    statLabel: 'Support'
  },
]

export function HomePageClient({ initialData }: { initialData: any }) {
  const { data } = useLivePreview({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 1,
  })

  const [activeApplication, setActiveApplication] = useState('concrete')
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const currentApp = applications.find(a => a.id === activeApplication)

  // Payload-driven data with fallbacks
  const heroBadge = data?.hero?.badge ?? 'Trusted by 500+ Malaysian Contractors'
  const heroLine1 = data?.hero?.headlineLine1 ?? 'Industrial'
  const heroLine2 = data?.hero?.headlineLine2 ?? 'Diamond Tools'
  const heroLine3 = data?.hero?.headlineLine3 ?? 'Built for Performance'
  const heroSubheadline = data?.hero?.subheadline ?? 'Industrial-grade cutting solutions engineered for concrete, granite, marble, and more. Built to meet the demanding standards of professional contractors.'
  const heroPrimaryCtaLabel = data?.hero?.primaryCtaLabel ?? 'Explore Products'
  const heroSecondaryCtaLabel = data?.hero?.secondaryCtaLabel ?? 'Watch Demo'
  const stats: Array<{ value: string; label: string }> = data?.stats ?? defaultStats
  const ctaHeadline = data?.ctaSection?.headline ?? 'Ready to Elevate\nYour Operations?'
  const ctaSubheadline = data?.ctaSection?.subheadline ?? 'Join 500+ professional contractors who trust Coolman for their diamond cutting needs.'
  const ctaPrimaryLabel = data?.ctaSection?.primaryCtaLabel ?? 'Request Consultation'
  const ctaSecondaryLabel = data?.ctaSection?.secondaryCtaLabel ?? 'Download Catalog'

  return (
    <PublicLayout headerVariant="transparent">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen overflow-hidden bg-navy"
        onMouseMove={handleMouseMove}
      >
        {/* Interactive spotlight */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30 transition-opacity"
          style={{ background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59,130,246,0.15), transparent 40%)` }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        {/* Hero image */}
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-40 lg:opacity-60">
          <Image src="/images/hero-blade.jpg" alt="Diamond blade cutting" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-20 pt-32 lg:px-8">
          <div className="max-w-3xl">

            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-3 border border-accent/30 bg-accent/10 px-5 py-2.5 backdrop-blur-sm">
              <span className="inline-flex h-2 w-2 rounded-full bg-accent" />
              <span className="text-sm font-semibold tracking-wide text-accent">{heroBadge}</span>
            </div>

            {/* Headline */}
            <h1 className="font-sans text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-6xl">
              {heroLine1}
              <span className="block text-accent">{heroLine2}</span>
              <span className="block">{heroLine3}</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/60">
              {heroSubheadline}
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" className="group h-14 overflow-hidden bg-accent px-8 font-sans text-base font-bold text-white transition-colors hover:bg-accent-dark" asChild>
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

          {/* Stats bar */}
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <MousePointer2 className="h-5 w-5 text-white/40" />
          <span className="text-xs font-semibold tracking-widest text-white/40">Scroll</span>
        </div>
      </section>

      {/* ── SOLUTIONS ────────────────────────────────────────────── */}
      <section className="bg-secondary py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="font-sans text-sm font-bold tracking-[0.3em] text-accent">Solutions</p>
          <h2 className="mt-4 font-sans text-4xl font-bold text-navy lg:text-6xl">
            Cutting Solutions for<br />Every Material
          </h2>

          {/* Interactive material tabs */}
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

          {/* Application showcase */}
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
                {currentApp?.label} Cutting
              </h3>
              <p className="mt-6 text-lg leading-relaxed text-ink-muted">
                Our {currentApp?.label.toLowerCase()} cutting blades feature specialised diamond segment
                configuration and bond formulations engineered for maximum efficiency and extended operational life.
              </p>

              <ul className="mt-8 space-y-4">
                {['Optimised segment spacing for material', 'Application-specific bond hardness', 'Precision balanced for smooth cuts', 'Extended 3× operational life'].map((item, i) => (
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
                  View {currentApp?.label} Blades
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
            <p className="font-sans text-sm font-bold tracking-[0.3em] text-accent">Why Coolman</p>
            <h2 className="mt-4 font-sans text-4xl font-bold text-white lg:text-6xl">
              The Coolman Advantage
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative cursor-pointer overflow-hidden border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-[border-color,background-color] hover:border-accent/50 hover:bg-white/10"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent transition-opacity ${hoveredFeature === index ? 'opacity-100' : 'opacity-0'}`} />

                <div className="relative">
                  <div className="font-mono font-sans text-5xl font-bold text-accent">
                    {feature.stat}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white/40">{feature.statLabel}</div>

                  <h3 className="mt-6 font-sans text-lg font-bold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{feature.description}</p>

                  <div className={`mt-6 flex items-center gap-2 text-accent transition-opacity ${hoveredFeature === index ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-sm font-bold">Learn More</span>
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
              <p className="font-sans text-sm font-bold tracking-[0.3em] text-accent">Our Products</p>
              <h2 className="mt-4 font-sans text-4xl font-bold text-navy lg:text-6xl">Diamond Blades</h2>
            </div>
            <Link href="/products" className="group flex items-center gap-2 font-sans text-sm font-bold tracking-wide text-navy transition-colors hover:text-accent">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              { name: 'Granite Blade', image: '/images/blade-granite.jpg', price: 'From RM 89', desc: 'For natural stone cutting' },
              { name: 'Concrete Blade', image: '/images/blade-concrete.jpg', price: 'From RM 75', desc: 'Heavy-duty construction' },
              { name: 'Tile Blade', image: '/images/blade-tile.jpg', price: 'From RM 65', desc: 'Precision ceramic cutting' },
            ].map((product, index) => (
              <Link key={index} href="/products" className="group relative aspect-square overflow-hidden bg-secondary">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-navy/0 transition-colors group-hover:bg-navy/70" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-sm font-bold text-accent">{product.price}</p>
                  </div>
                  <h3 className="font-sans text-2xl font-bold text-white drop-shadow-lg">{product.name}</h3>
                  <p className="text-sm text-white/80 drop-shadow">{product.desc}</p>
                  <div className="mt-4 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="font-sans text-sm font-bold text-white">View Details</span>
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
          backgroundImage: `linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="font-sans text-4xl font-bold text-white lg:text-6xl">
            {ctaHeadline.split('\n').map((line: string, i: number) => (
              i === 0 ? <span key={i}>{line}<br /></span> : <span key={i}>{line}</span>
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
