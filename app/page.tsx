"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ArrowRight, Play, Zap, Shield, Clock, Users, Check, MousePointer2 } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'

const applications = [
  { id: 'concrete', label: 'Concrete', image: '/images/blade-concrete.jpg' },
  { id: 'granite', label: 'Granite', image: '/images/blade-granite.jpg' },
  { id: 'marble', label: 'Marble', image: '/images/blade-granite.jpg' },
  { id: 'tile', label: 'Tile & Ceramic', image: '/images/blade-tile.jpg' },
]

const stats = [
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

export default function HomePage() {
  const [activeApplication, setActiveApplication] = useState('concrete')
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const currentApp = applications.find(a => a.id === activeApplication)

  return (
    <PublicLayout headerVariant="transparent">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen overflow-hidden bg-[#0a1628]"
        onMouseMove={handleMouseMove}
      >
        {/* Interactive spotlight */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30 transition-opacity duration-300"
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
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0a1628]/80 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-20 pt-32 lg:px-8">
          <div className="max-w-3xl">

            {/* Badge */}
            <div className={`mb-8 inline-flex items-center gap-3 border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-5 py-2.5 backdrop-blur-sm transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3b82f6] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3b82f6]" />
              </span>
              <span className="text-sm font-semibold tracking-wide text-[#3b82f6]">Trusted by 500+ Malaysian Contractors</span>
            </div>

            {/* Headline */}
            <h1 className={`font-sans text-5xl font-bold leading-[0.95] tracking-tight text-white transition-all duration-700 delay-100 sm:text-5xl md:text-6xl lg:text-6xl ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              Industrial
              <span className="block text-[#3b82f6]">Diamond Tools</span>
              <span className="block">Built for Performance</span>
            </h1>

            <p className={`mt-8 max-w-xl text-lg leading-relaxed text-white/60 transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              Industrial-grade cutting solutions engineered for concrete, granite, marble, and more.
              Built to meet the demanding standards of professional contractors.
            </p>

            {/* CTA Buttons */}
            <div className={`mt-10 flex flex-wrap gap-4 transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Button size="lg" className="group h-14 overflow-hidden bg-[#3b82f6] px-8 font-sans text-base font-bold text-white transition-all hover:bg-[#2563eb]" asChild>
                <Link href="/products">
                  Explore Products
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="group h-14 border-2 border-white/30 bg-transparent px-8 font-sans text-base font-bold text-white transition-all hover:border-white hover:bg-white hover:text-[#0a1628]" asChild>
                <Link href="/why-coolman">
                  <Play className="mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  Watch Demo
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats bar */}
          <div className={`mt-20 grid grid-cols-2 border-t border-white/10 transition-all duration-700 delay-500 md:grid-cols-4 lg:mt-32 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group cursor-pointer border-b border-r border-white/10 px-6 py-8 transition-all duration-300 last:border-r-0 hover:bg-white/5 md:border-b-0"
              >
                <div className="font-sans text-4xl font-bold text-white transition-transform duration-300 group-hover:scale-110 md:text-5xl">{stat.value}</div>
                <div className="mt-2 text-sm font-semibold text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <MousePointer2 className="h-5 w-5 animate-bounce text-white/40" />
          <span className="text-xs font-semibold tracking-widest text-white/40">Scroll</span>
        </div>
      </section>

      {/* ── SOLUTIONS ────────────────────────────────────────────── */}
      <section className="bg-[#f8fafc] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="font-sans text-sm font-bold tracking-[0.3em] text-[#3b82f6]">Solutions</p>
          <h2 className="mt-4 font-sans text-4xl font-bold text-[#0a1628] lg:text-6xl">
            Cutting Solutions for<br />Every Material
          </h2>

          {/* Interactive material tabs */}
          <div className="mt-12 flex flex-wrap gap-0 border-b border-[#e2e8f0]">
            {applications.map((app) => (
              <button
                key={app.id}
                onClick={() => setActiveApplication(app.id)}
                className={`relative px-6 py-4 font-sans text-base font-bold transition-all duration-300 md:px-8 md:text-lg ${
                  activeApplication === app.id ? 'text-[#0a1628]' : 'text-[#94a3b8] hover:text-[#64748b]'
                }`}
              >
                {app.label}
                <span className={`absolute bottom-0 left-0 h-1 bg-[#3b82f6] transition-all duration-300 ${activeApplication === app.id ? 'w-full' : 'w-0'}`} />
              </button>
            ))}
          </div>

          {/* Application showcase */}
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#0a1628]">
              <Image
                src={currentApp?.image || '/images/blade-concrete.jpg'}
                alt={activeApplication}
                fill
                className="object-cover transition-all duration-700"
              />
              <div className="absolute left-1/4 top-1/3 h-4 w-4 animate-pulse cursor-pointer rounded-full bg-[#3b82f6] ring-4 ring-[#3b82f6]/30" />
              <div className="absolute right-1/3 top-1/2 h-4 w-4 animate-pulse cursor-pointer rounded-full bg-[#3b82f6] ring-4 ring-[#3b82f6]/30" style={{ animationDelay: '0.5s' }} />
            </div>

            <div className="flex flex-col justify-center">
              <h3 className="font-sans text-3xl font-bold text-[#0a1628] lg:text-4xl">
                {currentApp?.label} Cutting
              </h3>
              <p className="mt-6 text-lg leading-relaxed text-[#64748b]">
                Our {currentApp?.label.toLowerCase()} cutting blades feature specialised diamond segment
                configurations and bond formulations engineered for maximum efficiency and extended operational life.
              </p>

              <ul className="mt-8 space-y-4">
                {['Optimised segment spacing for material', 'Application-specific bond hardness', 'Precision balanced for smooth cuts', 'Extended 3× operational life'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center bg-[#3b82f6]">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-[#0a1628]">{item}</span>
                  </li>
                ))}
              </ul>

              <Button className="mt-10 h-14 w-fit bg-[#0a1628] px-8 font-sans font-bold text-white hover:bg-[#122036]" asChild>
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
      <section className="bg-[#0a1628] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <p className="font-sans text-sm font-bold tracking-[0.3em] text-[#3b82f6]">Why Coolman</p>
            <h2 className="mt-4 font-sans text-4xl font-bold text-white lg:text-6xl">
              The Coolman Advantage
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative cursor-pointer overflow-hidden border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-500 hover:border-[#3b82f6]/50 hover:bg-white/10"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-[#3b82f6]/20 to-transparent transition-opacity duration-500 ${hoveredFeature === index ? 'opacity-100' : 'opacity-0'}`} />

                <div className="relative">
                  <div className="font-sans text-5xl font-bold text-[#3b82f6] transition-transform duration-500 group-hover:scale-110">
                    {feature.stat}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white/40">{feature.statLabel}</div>

                  <h3 className="mt-6 font-sans text-lg font-bold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{feature.description}</p>

                  <div className={`mt-6 flex items-center gap-2 text-[#3b82f6] transition-all duration-300 ${hoveredFeature === index ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
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
              <p className="font-sans text-sm font-bold tracking-[0.3em] text-[#3b82f6]">Our Products</p>
              <h2 className="mt-4 font-sans text-4xl font-bold text-[#0a1628] lg:text-6xl">Diamond Blades</h2>
            </div>
            <Link href="/products" className="group flex items-center gap-2 font-sans text-sm font-bold tracking-wide text-[#0a1628] transition-colors hover:text-[#3b82f6]">
              View All Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              { name: 'Granite Blade', image: '/images/blade-granite.jpg', price: 'From RM 89', desc: 'For natural stone cutting' },
              { name: 'Concrete Blade', image: '/images/blade-concrete.jpg', price: 'From RM 75', desc: 'Heavy-duty construction' },
              { name: 'Tile Blade', image: '/images/blade-tile.jpg', price: 'From RM 65', desc: 'Precision ceramic cutting' },
            ].map((product, index) => (
              <Link key={index} href="/products" className="group relative aspect-square overflow-hidden bg-[#f1f5f9]">
                <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-[#0a1628]/0 transition-all duration-500 group-hover:bg-[#0a1628]/70" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-sm font-bold text-[#3b82f6]">{product.price}</p>
                  </div>
                  <h3 className="font-sans text-2xl font-bold text-white drop-shadow-lg transition-transform duration-500 group-hover:-translate-y-2">{product.name}</h3>
                  <p className="text-sm text-white/80 drop-shadow transition-all duration-500 group-hover:-translate-y-2">{product.desc}</p>
                  <div className="mt-4 flex translate-y-4 items-center gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
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
      <section className="relative overflow-hidden bg-[#3b82f6] py-24 lg:py-32">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="font-sans text-4xl font-bold text-white lg:text-6xl">
            Ready to Elevate<br />Your Operations?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">
            Join 500+ professional contractors who trust Coolman for their diamond cutting needs.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="h-14 bg-white px-8 font-sans font-bold text-[#0a1628] transition-all hover:bg-[#f1f5f9]" asChild>
              <Link href="/contact">
                Request Consultation
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 border-2 border-white bg-transparent px-8 font-sans font-bold text-white hover:bg-white hover:text-[#3b82f6]" asChild>
              <Link href="/resources">Download Catalog</Link>
            </Button>
          </div>
        </div>
      </section>

    </PublicLayout>
  )
}
