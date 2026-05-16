'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, ArrowRight, ArrowLeft, Check, Zap, Shield, RotateCcw, Ruler, Minus, Plus } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { PriceDisplay, type PriceDisplayMode } from '@/components/products/PriceDisplay'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { bondLabel } from '@/lib/products/bond-label'

export function ProductDetailClient({
  initialData,
  priceMode = 'public',
  tierDiscountPct = 0,
}: {
  initialData: any
  priceMode?: PriceDisplayMode
  tierDiscountPct?: number
}) {
  // Use the server-rendered product directly. useLivePreview is a Payload
  // admin feature — keeping it on the public detail page costs an extra fetch
  // and postMessage listener for every visitor on every navigation.
  const data = initialData

  const [activeTab, setActiveTab] = useState<'specs' | 'applications' | 'usage'>('specs')
  const [quantity, setQuantity] = useState(1)
  const nextHref = `/products/${data.id}`

  // Log this product view. Server attaches it to the contractor's most recent
  // search row (last 10 min) so the log reads "searched X then viewed Y".
  // Keyed on initialData.id so we only fire once per actual page, not on every
  // useLivePreview re-render.
  useEffect(() => {
    const productId = initialData?.id
    if (!productId) return
    fetch('/api/search-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ viewedProductId: String(productId) }),
      keepalive: true,
    }).catch(() => {})
  }, [initialData?.id])

  // Payload relations come back as objects ({id, name, nameBM, ...}); plain seeds may still be strings/numbers.
  const labelOf = (v: any): string => {
    if (v == null) return ''
    if (typeof v === 'object') return v.name ?? v.nameBM ?? ''
    return String(v)
  }
  const keyOf = (v: any, fallback: number): string | number =>
    v == null ? fallback : typeof v === 'object' ? (v.id ?? fallback) : v

  // Field names match collections/Products.ts. Earlier prototype names
  // (recommendedMaterials / recommendedMachinePower / recommendedCuttingVolume)
  // were leftovers from the seed data and returned empty on real Payload docs.
  const materials: any[] = Array.isArray(data.materials) ? data.materials : []
  const applications: any[] = Array.isArray(data.applications) ? data.applications : []
  const primaryMaterial = labelOf(materials[0])
  const machineTierLabel = labelOf(data.machineTier)

  // Resolve image URL from Payload media relation. If the product has no image
  // uploaded yet, we render a clean "no image" panel instead of substituting an
  // unrelated stock blade photo (which used to mislead admins into thinking the
  // upload had worked).
  const heroImageUrl: string | null =
    typeof data.image === 'object' && data.image?.url ? data.image.url : null

  // Gallery photos from the Products `photos` array field. Each entry is
  // { id, photo: media } once depth>=1 has resolved it. Filter out anything
  // that didn't resolve to a usable URL so we never render a broken thumbnail.
  const galleryUrls: string[] = Array.isArray(data.photos)
    ? data.photos
        .map((row: any) =>
          typeof row?.photo === 'object' && row.photo?.url ? (row.photo.url as string) : null,
        )
        .filter((u: string | null): u is string => !!u)
    : []

  // Combined image strip: hero first, then any additional gallery photos.
  const allImageUrls: string[] = heroImageUrl
    ? [heroImageUrl, ...galleryUrls]
    : galleryUrls
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const imageUrl: string | null = allImageUrls[activeImageIdx] ?? heroImageUrl

  const specs = [
    { label: 'Diameter', value: labelOf(data.diameter), icon: Ruler },
    { label: 'Arbor Size', value: labelOf(data.arborSize), icon: Ruler },
    { label: 'Segment Height', value: labelOf(data.segmentHeight), icon: Ruler },
    { label: 'Bond Type', value: bondLabel(data.bondType), icon: Shield },
    { label: 'Max RPM', value: data.maxRPM ?? 'See manual', icon: Zap },
    { label: 'Machine Tier', value: machineTierLabel, icon: RotateCcw },
  ]

  // Related products from Payload (depth:2 resolves these to full objects)
  const relatedProducts: any[] = Array.isArray(data.relatedProducts)
    ? data.relatedProducts.filter((p: any) => typeof p === 'object' && p !== null)
    : []

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
            <span className="font-medium text-white">{data.name}</span>
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
                <span className="font-mono text-xs font-semibold text-white/60">{data.sku}</span>
              </div>

              <div className="relative aspect-square overflow-hidden border border-white/10 bg-navy-light">
                {imageUrl ? (
                  <>
                    <Image
                      src={imageUrl}
                      alt={data.name}
                      fill
                      className="object-cover"
                      priority
                    />
                    {/* Overlay tint */}
                    <div className="absolute inset-0 bg-navy/20" />
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-center text-xs font-mono uppercase tracking-widest text-ink-muted">
                    No image uploaded
                  </div>
                )}

                {/* Material badge */}
                <div className="absolute left-4 top-4 border border-accent/40 bg-accent/20 px-3 py-1">
                  <span className="text-xs font-bold tracking-wider text-accent">
                    {primaryMaterial || 'Premium'}
                  </span>
                </div>
              </div>

              {/* Gallery thumbnails — only renders when admin has uploaded
                  extra photos in the `photos` array field on the product. */}
              {allImageUrls.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {allImageUrls.map((url, i) => (
                    <button
                      key={`${url}-${i}`}
                      type="button"
                      onClick={() => setActiveImageIdx(i)}
                      className={`relative aspect-square overflow-hidden border transition-colors ${
                        i === activeImageIdx
                          ? 'border-accent'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                      aria-label={`View photo ${i + 1}`}
                    >
                      <Image src={url} alt={`${data.name} photo ${i + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="flex flex-col justify-center">
              <p className="font-sans text-sm font-bold tracking-[0.3em] text-accent">
                {primaryMaterial || 'Diamond Blade'}
              </p>
              <h1 className="mt-3 font-sans text-4xl font-bold text-white lg:text-5xl">
                {data.name}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/60">
                {data.description}
              </p>

              {/* Price block — contractor-aware (server-resolved priceMode) */}
              <div className="mt-8 border border-white/10 bg-white/5 p-6">
                <div className="flex items-end justify-between gap-6">
                  <PriceDisplay
                    listPrice={data.listPrice}
                    tierDiscountPct={tierDiscountPct}
                    mode={priceMode}
                    size="detail"
                    tone="dark"
                  />
                  <div className="text-right">
                    <p className="text-xs text-white/40">Machine power</p>
                    <p className="mt-1 font-sans text-lg font-bold capitalize text-accent">{machineTierLabel || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Quick specs grid */}
              <div className="mt-8 grid grid-cols-3 gap-3">
                {specs.slice(0, 3).map((spec) => (
                  <div key={spec.label} className="border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-xs font-semibold text-white/40">{spec.label}</p>
                    <p className="font-mono mt-1 font-sans text-lg font-bold text-white">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Materials */}
              <div className="mt-8">
                <p className="mb-3 text-xs font-bold tracking-wider text-white/40">Recommended Materials</p>
                <div className="flex flex-wrap gap-2">
                  {materials.map((material: any, i: number) => (
                    <span key={keyOf(material, i)} className="border border-accent/30 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                      {labelOf(material)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantity selector */}
              <div className="mt-8">
                <p className="mb-3 text-xs font-bold tracking-wider text-white/40">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="flex h-12 w-12 items-center justify-center border border-white/20 bg-white/5 text-white transition-colors hover:border-accent hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    aria-label="Quantity"
                    className="font-mono h-12 w-20 border border-white/20 bg-white/5 text-center text-lg font-bold text-white focus:border-accent focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="flex h-12 w-12 items-center justify-center border border-white/20 bg-white/5 text-white transition-colors hover:border-accent hover:bg-accent/10"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <AddToCartButton productId={data.id} quantity={quantity} nextHref={nextHref} />
                <Button size="lg" variant="outline" className="h-14 border-2 border-white/30 bg-transparent font-sans font-bold text-white hover:border-white hover:bg-white hover:text-navy" asChild>
                  <Link href="/contact">Request a quote</Link>
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
            <div className="flex gap-0 overflow-x-auto">
              {(['specs', 'applications', 'usage'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative whitespace-nowrap px-4 py-5 font-sans text-sm font-bold capitalize transition-colors sm:px-8 ${
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
                    <p className="font-mono mt-0.5 font-sans text-lg font-bold text-navy">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Applications tab */}
          {activeTab === 'applications' && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {applications.map((app: any, i: number) => (
                <div key={keyOf(app, i)} className="flex items-center gap-4 border border-rule bg-white p-5">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center bg-accent">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <p className="font-semibold text-navy">{labelOf(app)}</p>
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
                { step: '03', title: 'Set Correct RPM', body: `Do not exceed ${data.maxRPM ?? 'rated'} RPM. Over-speeding causes premature failure.` },
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
              {relatedProducts.map((p: any) => {
                const relatedImageUrl: string | null =
                  typeof p.image === 'object' && p.image?.url ? p.image.url : null
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="group relative flex flex-col overflow-hidden border border-white/10 bg-white/5 transition-[border-color,box-shadow] hover:border-accent/30 hover:shadow-lg"
                  >
                    <div className="relative aspect-square overflow-hidden bg-navy-light">
                      {relatedImageUrl ? (
                        <Image
                          src={relatedImageUrl}
                          alt={p.name}
                          width={400}
                          height={400}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-center text-xs font-mono uppercase tracking-widest text-ink-muted">
                          No image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-navy/0 transition-[background-color] group-hover:bg-navy/60">
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex items-center gap-2 bg-accent-dark px-6 py-3 font-sans text-sm font-semibold text-white">
                            Open product
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="font-sans text-xs font-semibold tracking-wider text-accent">
                        {labelOf(p.materials?.[0]) || 'Universal'}
                      </p>
                      <h3 className="mt-2 font-sans text-lg font-bold text-white transition-colors group-hover:text-accent">
                        {p.name}
                      </h3>
                      <p className="mt-1 text-sm text-white/60">
                        {p.diameter} | {bondLabel(p.bondType)} Bond
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                        <PriceDisplay
                          listPrice={p.listPrice}
                          tierDiscountPct={tierDiscountPct}
                          mode={priceMode}
                          size="card"
                          tone="dark"
                        />
                        <ArrowRight className="h-5 w-5 text-white/40 transition-colors group-hover:text-accent" />
                      </div>
                    </div>
                  </Link>
                )
              })}
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
              <AddToCartButton productId={data.id} quantity={quantity} nextHref={nextHref} />
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
