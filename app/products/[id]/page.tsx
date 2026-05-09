'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ChevronRight, ArrowRight, ArrowLeft, Check, Zap, Shield, RotateCcw, Ruler } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { ProductCard } from '@/components/products/product-card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils/formatting'
import { getProductById, getRelatedProducts } from '@/lib/data/products'

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params)
  const product = getProductById(id)
  const [activeTab, setActiveTab] = useState<'specs' | 'applications' | 'usage'>('specs')

  if (!product) notFound()

  const relatedProducts = getRelatedProducts(id)

  const specs = [
    { label: 'Diameter', value: product.diameter, icon: Ruler },
    { label: 'Arbor Size', value: product.arborSize, icon: Ruler },
    { label: 'Segment Height', value: product.segmentHeight, icon: Ruler },
    { label: 'Bond Type', value: product.bondType, icon: Shield },
    { label: 'Max RPM', value: product.maxRPM ?? 'See manual', icon: Zap },
    { label: 'Cutting Volume', value: product.recommendedCuttingVolume, icon: RotateCcw },
  ]

  return (
    <PublicLayout>

      {/* ── BREADCRUMB ───────────────────────────────────────────── */}
      <div className="border-b border-white/10 bg-navy">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/products" className="flex items-center gap-1 text-white/50 transition-colors hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" />
              Products
            </Link>
            <ChevronRight className="h-4 w-4 text-white/30" />
            <span className="font-medium text-white">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── HERO + PRODUCT OVERVIEW ──────────────────────────────── */}
      <section className="relative bg-navy">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">

            {/* Left: Image */}
            <div className="relative">
              {/* SKU tag */}
              <div className="mb-4 inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1.5">
                <span className="text-xs font-bold tracking-widest text-white/40">SKU</span>
                <span className="text-xs font-semibold text-white/60">{product.sku}</span>
              </div>

              <div className="relative aspect-square overflow-hidden border border-white/10 bg-gradient-to-br from-navy-light to-navy">
                <Image
                  src={product.imagePlaceholder}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay tint */}
                <div className="absolute inset-0 bg-navy/20" />

                {/* Material badge */}
                <div className="absolute left-4 top-4 border border-accent/40 bg-accent/20 px-3 py-1 backdrop-blur-sm">
                  <span className="text-xs font-bold tracking-wider text-accent">
                    {product.recommendedMaterials?.[0] ?? 'Premium'}
                  </span>
                </div>
              </div>

              {/* Thumbnail row */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                {['/images/blade-granite.jpg', '/images/blade-concrete.jpg', '/images/blade-tile.jpg', '/images/hero-blade.jpg'].map((src, i) => (
                  <div key={i} className="aspect-square cursor-pointer overflow-hidden border border-white/10 opacity-60 transition-[border-color,opacity] hover:border-accent/50 hover:opacity-100">
                    <Image src={src} alt="" width={80} height={80} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Info */}
            <div className="flex flex-col justify-center">
              <p className="font-sans text-sm font-bold tracking-[0.3em] text-accent">
                {product.recommendedMaterials?.[0] ?? 'Diamond Blade'}
              </p>
              <h1 className="mt-3 font-sans text-4xl font-bold text-white lg:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/60">
                {product.description}
              </p>

              {/* Price block */}
              <div className="mt-8 border border-white/10 bg-white/5 p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-white/40">List price per unit</p>
                    <p className="mt-1 font-sans text-4xl font-bold text-white">{formatPrice(product.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/40">Machine power</p>
                    <p className="mt-1 font-sans text-lg font-bold capitalize text-accent">{product.recommendedMachinePower}</p>
                  </div>
                </div>
              </div>

              {/* Quick specs grid */}
              <div className="mt-8 grid grid-cols-3 gap-3">
                {specs.slice(0, 3).map((spec) => (
                  <div key={spec.label} className="border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-xs font-semibold text-white/40">{spec.label}</p>
                    <p className="mt-1 font-sans text-lg font-bold text-white">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Materials */}
              <div className="mt-8">
                <p className="mb-3 text-xs font-bold tracking-wider text-white/40">Recommended Materials</p>
                <div className="flex flex-wrap gap-2">
                  {product.recommendedMaterials.map((material) => (
                    <span key={material} className="border border-accent/30 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                      {material}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="group h-14 flex-1 bg-accent font-sans text-base font-bold text-white hover:bg-accent-dark" asChild>
                  <Link href={`/order-request?product=${product.id}`}>
                    Request Order
                    <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 border-2 border-white/30 bg-transparent font-sans font-bold text-white hover:border-white hover:bg-white hover:text-navy" asChild>
                  <Link href="/contact">Get Advice</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TABS: SPECS / APPLICATIONS / USAGE ───────────────────── */}
      <section className="bg-secondary">
        {/* Tab nav */}
        <div className="border-b border-rule bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex gap-0">
              {(['specs', 'applications', 'usage'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-8 py-5 font-sans text-sm font-bold capitalize transition-colors ${
                    activeTab === tab ? 'text-navy' : 'text-ink-faint hover:text-ink-muted'
                  }`}
                >
                  {tab === 'specs' ? 'Specifications' : tab === 'applications' ? 'Applications' : 'Usage Guide'}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-[width] ${activeTab === tab ? 'w-full' : 'w-0'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          {/* Specs tab */}
          {activeTab === 'specs' && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {specs.map((spec) => (
                <div key={spec.label} className="flex items-center gap-4 border border-rule bg-white p-5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-navy">
                    <spec.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-wider text-ink-faint">{spec.label}</p>
                    <p className="mt-0.5 font-sans text-lg font-bold text-navy">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Applications tab */}
          {activeTab === 'applications' && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.applications.map((app) => (
                <div key={app} className="flex items-center gap-4 border border-rule bg-white p-5">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center bg-accent">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <p className="font-semibold text-navy">{app}</p>
                </div>
              ))}
            </div>
          )}

          {/* Usage Guide tab */}
          {activeTab === 'usage' && (
            <div className="grid gap-6 lg:grid-cols-2">
              {[
                { step: '01', title: 'Inspect Before Use', body: 'Check for cracks, warping, or damage before mounting. Never use a damaged blade.' },
                { step: '02', title: 'Correct Mounting', body: 'Ensure the arbor size matches your machine. Tighten securely with the correct flange.' },
                { step: '03', title: 'Set Correct RPM', body: `Do not exceed ${product.maxRPM ?? 'rated'} RPM. Over-speeding causes premature failure.` },
                { step: '04', title: 'Use Water Cooling', body: 'Wet cutting extends blade life significantly. Dry cutting is only recommended for short bursts.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 border border-rule bg-white p-6">
                  <div className="font-sans text-4xl font-bold text-rule">{item.step}</div>
                  <div>
                    <h4 className="font-sans text-lg font-bold text-navy">{item.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── RELATED PRODUCTS ─────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="bg-navy py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-sans text-sm font-bold tracking-[0.3em] text-accent">Related</p>
                <h2 className="mt-2 font-sans text-3xl font-bold text-white lg:text-4xl">You Might Also Need</h2>
              </div>
              <Link href="/products" className="group hidden items-center gap-2 font-sans text-sm font-bold text-white/60 transition-colors hover:text-white sm:flex">
                View All
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA STRIP ────────────────────────────────────────────── */}
      <section className="bg-accent py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div>
              <h3 className="font-sans text-2xl font-bold text-white lg:text-3xl">Ready to order or need technical advice?</h3>
              <p className="mt-1 text-white/80">Our engineers are available to help you choose the right blade.</p>
            </div>
            <div className="flex gap-3">
              <Button className="h-12 bg-white px-6 font-sans font-bold text-navy hover:bg-secondary" asChild>
                <Link href={`/order-request?product=${product.id}`}>Request Order</Link>
              </Button>
              <Button variant="outline" className="h-12 border-2 border-white bg-transparent px-6 font-sans font-bold text-white hover:bg-white hover:text-accent" asChild>
                <Link href="/contact">Talk to an Engineer</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </PublicLayout>
  )
}
