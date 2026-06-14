'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Minus, Plus, Play } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { PriceStackCard } from '@/components/catalogue/PriceStackCard'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { KillSwitchBanner } from '@/components/catalogue/KillSwitchBanner'
import { bondLabel } from '@/lib/products/bond-label'
import { familyAxisConfig, type SwitcherAxis } from '@/lib/products/family'
import { extractYouTubeId, youTubeEmbedUrl } from '@/lib/products/youtube'
import { calculateEffectivePrice } from '@/lib/pricing/calculate'
import { formatPrice } from '@/lib/utils/formatting'
import { useLanguage } from '@/lib/i18n/context'

// Payload relations come back as objects ({id, name, nameBM, ...}) once
// depth>=1 has resolved them; raw seeds and unresolved relations stay as
// strings or numbers. This loose shape covers both.
type RelationOrScalar =
  | { id?: string | number; name?: string; nameBM?: string }
  | string
  | number
  | null
  | undefined

type MediaSize = { url?: string | null }
type ProductMedia =
  | { url?: string | null; sizes?: { thumbnail?: MediaSize; card?: MediaSize; hero?: MediaSize } | null }
  | string
  | null
  | undefined

// Prefer a small pre-baked WebP variant over the full-size master. The master
// keeps its original format (a PNG product photo can be >1MB); the `card`
// variant is an 800px WebP (~30KB). Falls back to the master if a variant is
// missing (e.g. images uploaded before the variants existed).
function mediaUrl(m: ProductMedia, prefer: 'card' | 'thumbnail' = 'card'): string | null {
  if (!m || typeof m !== 'object') return null
  const sizes = m.sizes ?? {}
  const preferred = sizes[prefer]?.url
  const card = sizes.card?.url
  if (typeof preferred === 'string' && preferred) return preferred
  if (typeof card === 'string' && card) return card
  return typeof m.url === 'string' ? m.url : null
}

interface RelatedProductData {
  id: string | number
  name: string
  diameter?: RelationOrScalar
  bondType?: string | null
  image?: ProductMedia
  listPrice?: number | null
  materials?: RelationOrScalar[] | null
  family?: string | null
}

export interface ProductDetailData {
  id: string | number
  name: string
  nameBM?: string | null
  sku: string
  family?: string | null
  description?: string | null
  descriptionBM?: string | null
  image?: ProductMedia
  photos?: Array<{ id?: string | number; photo?: ProductMedia }> | null
  youtubeUrl?: string | null
  materials?: RelationOrScalar[] | null
  applications?: RelationOrScalar[] | null
  diameter?: RelationOrScalar
  diameterMm?: number | null
  arborSize?: RelationOrScalar
  segmentHeight?: RelationOrScalar
  /** Numeric value on the family's second axis (tooth/grit/segment). */
  variantValue?: number | null
  /** Pill text for the second axis (e.g. "60T", "80#", "6.5mm"). */
  variantLabel?: string | null
  bondType?: string | null
  maxRPM?: number | null
  machineTier?: RelationOrScalar
  listPrice?: number | null
  relatedProducts?: RelatedProductData[] | null
  documents?: Array<{
    id: string | number
    title: string
    titleBM?: string | null
    file?: ProductMedia
  }> | null
}

export function ProductDetailClient({
  initialData,
  familyMembers = null,
  initialSize = null,
  initialVariant = null,
  isLoggedIn = false,
  emailVerified = false,
  tierDiscountPct = 0,
  ordersPaused = false,
  whatsappNumber = '',
}: {
  initialData: ProductDetailData
  /**
   * All sizes in this product's family, smallest diameter first. Null/absent
   * for a standalone product (no size switcher renders). When present, the
   * displayed `data` is driven by the selected member, so the gallery, specs,
   * price card and order button all follow the chosen size automatically.
   */
  familyMembers?: ProductDetailData[] | null
  /** Diameter (mm) to pre-select from `?size=` — falls back to initialData. */
  initialSize?: number | null
  /** Second-axis value to pre-select from `?v=` (tooth/grit/segment). */
  initialVariant?: number | null
  isLoggedIn?: boolean
  emailVerified?: boolean
  tierDiscountPct?: number
  /**
   * Mirrors `settings.orders_paused`. When true the cart CTA + quantity
   * stepper are disabled and the kill-switch banner renders at the top of the
   * page (CLAUDE.md hard rule: every order write path checks this flag).
   */
  ordersPaused?: boolean
  /** Mirrors `settings.whatsapp_number`. Drives the banner's WhatsApp link. */
  whatsappNumber?: string
}) {
  const { language, t } = useLanguage()
  const pd = t.pages.productDetail

  // A family always includes the loaded product; if the list is missing or
  // singular we treat this as a standalone product (no switcher).
  //
  // Coerce diameterMm/variantValue to real numbers up front: Postgres `numeric`
  // columns come back from the driver as STRINGS ("180", "6.5"), and the switcher
  // matches members with strict `===`. Normalising here (rather than at every
  // comparison) means a 6.5mm TUCKPOINT segment can never silently fail to match.
  const members: ProductDetailData[] | null = (() => {
    if (!(Array.isArray(familyMembers) && familyMembers.length > 1)) return null
    const toNum = (x: unknown): number | null => {
      if (x == null || x === '') return null
      const n = Number(x)
      return Number.isFinite(n) ? n : null
    }
    return familyMembers.map((m) => ({
      ...m,
      diameterMm: toNum(m.diameterMm),
      variantValue: toNum(m.variantValue),
    }))
  })()

  // Initial selection: honour ?size= (diameter mm) and ?v= (second axis) — the
  // exact member when both are given and present, else size-only, else v-only,
  // else the product the URL actually loaded, else the smallest (first) member.
  const initialActiveIdx = (() => {
    if (!members) return 0
    const eq = (a: unknown, b: number) => Number(a) === Number(b)
    if (initialSize != null && initialVariant != null) {
      const both = members.findIndex(
        (m) => eq(m.diameterMm, initialSize) && eq(m.variantValue, initialVariant),
      )
      if (both >= 0) return both
    }
    if (initialSize != null) {
      const bySize = members.findIndex((m) => eq(m.diameterMm, initialSize))
      if (bySize >= 0) return bySize
    }
    if (initialVariant != null) {
      const byVar = members.findIndex((m) => eq(m.variantValue, initialVariant))
      if (byVar >= 0) return byVar
    }
    const byId = members.findIndex((m) => String(m.id) === String(initialData.id))
    return byId >= 0 ? byId : 0
  })()

  const [activeIdx, setActiveIdx] = useState(initialActiveIdx)
  const data: ProductDetailData = members ? (members[activeIdx] ?? initialData) : initialData

  const isBM = language === 'BM'
  const displayName = isBM && data.nameBM ? data.nameBM : data.name
  const displayDescription = isBM && data.descriptionBM ? data.descriptionBM : data.description

  const [activeTab, setActiveTab] = useState<'specs' | 'applications' | 'usage' | 'parameters' | 'documents'>('specs')
  const [quantity, setQuantity] = useState(1)
  const nextHref = `/products/${data.id}`

  // Log this product view. Server attaches it to the contractor's most recent
  // search row (last 10 min) so the log reads "searched X then viewed Y".
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

  const labelOf = (v: any): string => {
    if (v == null) return ''
    if (typeof v === 'object') return v.name ?? v.nameBM ?? ''
    return String(v)
  }
  const keyOf = (v: any, fallback: number): string | number =>
    v == null ? fallback : typeof v === 'object' ? (v.id ?? fallback) : v

  const materials: RelationOrScalar[] = Array.isArray(data.materials) ? data.materials : []
  const applications: RelationOrScalar[] = Array.isArray(data.applications) ? data.applications : []
  const primaryMaterial = labelOf(materials[0])
  const machineTierLabel = labelOf(data.machineTier)

  const heroImageUrl: string | null = mediaUrl(data.image, 'card')

  const galleryUrls: string[] = Array.isArray(data.photos)
    ? data.photos
        .map((row) => mediaUrl(row?.photo, 'card'))
        .filter((u): u is string => !!u)
    : []

  const youTubeId = extractYouTubeId(data.youtubeUrl)
  type MediaItem =
    | { kind: 'image'; url: string }
    | { kind: 'video'; videoId: string; thumb: string }
  const photoItems: MediaItem[] = [
    ...(heroImageUrl ? [{ kind: 'image' as const, url: heroImageUrl }] : []),
    ...galleryUrls.map((url) => ({ kind: 'image' as const, url })),
  ]
  const mediaItems: MediaItem[] = youTubeId
    ? [
        ...photoItems,
        {
          kind: 'video' as const,
          videoId: youTubeId,
          thumb: `https://i.ytimg.com/vi/${youTubeId}/hqdefault.jpg`,
        },
      ]
    : photoItems
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const activeMedia: MediaItem | undefined = mediaItems[activeImageIdx]

  // ── Size/variant switcher ────────────────────────────────────────────────
  // A family declares 1–2 pill rows (lib/products/family.ts FAMILY_AXES): a size
  // ladder, a single non-size axis (grit), or size + a second axis (tooth /
  // segment). The grid is SPARSE — not every (size × variant) combo exists — so
  // the second-axis pills depend on the currently-selected size, and changing
  // size snaps the variant to the first one available at that size.
  // Resolve the axis config from the family code, which is constant across all
  // members — NOT from data.family (the active member), so the switcher shape
  // can't flip mid-session if one member row has a stray/blank family value.
  const axisCfg = familyAxisConfig(members?.[0]?.family ?? initialData.family)
  const isTwoAxis = members != null && axisCfg.axes.length > 1
  const curDia = data.diameterMm ?? null
  const curVar = data.variantValue ?? null

  // Swap the active member in-place (re-derives image/price/specs/SKU/order
  // target), reset the gallery, and reflect the selection in the URL (?size,
  // ?v) so it's shareable. replaceState avoids piling history on every tap.
  const applySelect = (idx: number) => {
    if (!members || idx < 0) return
    setActiveIdx(idx)
    setActiveImageIdx(0)
    const m = members[idx]
    if (m && typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (m.diameterMm != null) url.searchParams.set('size', String(m.diameterMm))
      else url.searchParams.delete('size')
      if (m.variantValue != null) url.searchParams.set('v', String(m.variantValue))
      else url.searchParams.delete('v')
      window.history.replaceState(window.history.state, '', url.toString())
    }
  }

  // Pick the member matching (dia, variant); if that exact pair is absent (the
  // chosen variant doesn't exist at the new size), fall back to the first member
  // at that size — keeping a valid selection on every tap.
  const selectByDiaVar = (dia: number | null, variant: number | null) => {
    if (!members) return
    let idx = members.findIndex((m) => m.diameterMm === dia && m.variantValue === variant)
    if (idx < 0) idx = members.findIndex((m) => m.diameterMm === dia)
    applySelect(idx)
  }
  const selectByVar = (variant: number | null) => {
    if (!members) return
    applySelect(members.findIndex((m) => m.variantValue === variant))
  }

  const axisRowLabel = (axis: SwitcherAxis): string =>
    axis === 'tooth'
      ? pd.sizeSwitcher.tooth
      : axis === 'grit'
        ? pd.sizeSwitcher.grit
        : axis === 'segment'
          ? pd.sizeSwitcher.segment
          : pd.sizeSwitcher.label

  // Pills for one axis row. Size: distinct diameters in member order. Variant:
  // distinct variant values — narrowed to the current size when two-axis.
  type Pill = { key: string; label: string; active: boolean; onClick: () => void }
  const pillsFor = (axis: SwitcherAxis): Pill[] => {
    if (!members) return []
    const out: Pill[] = []
    const seen = new Set<number>()
    if (axis === 'size') {
      for (const m of members) {
        const d = m.diameterMm
        if (d == null || seen.has(d)) continue
        seen.add(d)
        out.push({
          key: `size-${d}`,
          label: labelOf(m.diameter) || `${d}mm`,
          active: d === curDia,
          onClick: () => selectByDiaVar(d, curVar),
        })
      }
      return out
    }
    const pool = isTwoAxis ? members.filter((m) => m.diameterMm === curDia) : members
    for (const m of pool) {
      const v = m.variantValue
      if (v == null || seen.has(v)) continue
      seen.add(v)
      out.push({
        key: `var-${v}`,
        label: m.variantLabel || String(v),
        active: v === curVar,
        onClick: () => (isTwoAxis ? selectByDiaVar(curDia, v) : selectByVar(v)),
      })
    }
    return out
  }

  // Full spec rows for the specification tab table
  const specRows = [
    { label: pd.specs.diameter, value: labelOf(data.diameter) },
    { label: pd.specs.arborSize, value: labelOf(data.arborSize) },
    { label: pd.specs.segmentHeight, value: labelOf(data.segmentHeight) },
    { label: pd.specs.bondType, value: bondLabel(data.bondType) },
    { label: pd.specs.maxRPM, value: data.maxRPM ? String(data.maxRPM) : pd.specs.maxRPMFallback },
    { label: pd.specs.machineTier, value: machineTierLabel },
  ].filter((row) => row.value && row.value !== '')

  // 4 key stats for the quick-glance grid above the price card
  const quickStats = [
    { label: pd.specs.diameter, value: labelOf(data.diameter) || '—' },
    { label: pd.specs.segmentHeight, value: labelOf(data.segmentHeight) || '—' },
    { label: pd.specs.maxRPM, value: data.maxRPM ? String(data.maxRPM) : pd.specs.maxRPMFallback },
    { label: pd.specs.machineTier, value: machineTierLabel || '—' },
  ]

  const documents = Array.isArray(data.documents) ? data.documents : []

  // Related products from Payload (depth:2 resolves these to full objects).
  // Exclude any sibling that shares this product's family — those already live
  // in the size switcher above, so showing them again as "related" duplicates
  // the same blade.
  const relatedProducts: RelatedProductData[] = Array.isArray(data.relatedProducts)
    ? data.relatedProducts.filter(
        (p): p is RelatedProductData =>
          typeof p === 'object' &&
          p !== null &&
          !(members != null && data.family != null && (p as RelatedProductData).family === data.family),
      )
    : []

  // Usage-guide steps from i18n; step 03 interpolates max RPM when set.
  const usageSteps = pd.usageGuide.steps.map((step, idx) => {
    let body = step.body
    if (idx === 2 && data.maxRPM != null && step.bodyWithMaxRPM) {
      body = step.bodyWithMaxRPM.replace('{maxRPM}', String(data.maxRPM))
    }
    return { step: String(idx + 1).padStart(2, '0'), title: step.title, body }
  })

  // Line total shown in the order form when the user can see pricing.
  // Mirrors the same branch logic as PriceStackCard so the numbers agree.
  const effectiveUnitPrice: number | null = (() => {
    if (!isLoggedIn || !emailVerified || data.listPrice == null) return null
    if (!Number.isFinite(tierDiscountPct) || tierDiscountPct <= 0) return data.listPrice
    return calculateEffectivePrice(data.listPrice, tierDiscountPct, 0).effectivePrice
  })()
  const lineTotal = effectiveUnitPrice != null ? effectiveUnitPrice * quantity : null

  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
        pd.whatsappEnquiry.replace('{name}', displayName).replace('{sku}', data.sku),
      )}`
    : '#'

  const tabs = [
    { key: 'specs' as const, label: pd.tabs.specifications },
    { key: 'applications' as const, label: pd.tabs.applications },
    { key: 'usage' as const, label: pd.tabs.usageGuide },
    { key: 'parameters' as const, label: pd.tabs.parameters },
    { key: 'documents' as const, label: pd.tabs.documents },
  ]

  return (
    <PublicLayout>

      {/* ── KILL-SWITCH BANNER ───────────────────────────────────────── */}
      <KillSwitchBanner
        isPaused={ordersPaused}
        whatsappNumber={whatsappNumber}
        language={language}
      />

      {/* ── BREADCRUMB ───────────────────────────────────────────────── */}
      <div className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-7xl px-6 py-3 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-mono text-ink-muted">
            <Link href="/products" className="transition-colors hover:text-ink">
              {pd.breadcrumbProducts}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-rule flex-shrink-0" />
            <span className="text-ink truncate">{displayName}</span>
          </nav>
        </div>
      </div>

      {/* ── MAIN 2-COL DETAIL LAYOUT ─────────────────────────────────── */}
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14 lg:grid lg:grid-cols-[1.08fr_1fr] lg:gap-[72px] lg:items-start">

          {/* ── LEFT: GALLERY ──────────────────────────────────────── */}
          <div className="lg:sticky lg:top-24">

            {/* SKU pill */}
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-muted">{pd.skuLabel}</span>
              <span className="font-mono text-[10px] font-semibold text-ink">{data.sku}</span>
            </div>

            {/* Main media panel */}
            <div className="relative aspect-square overflow-hidden bg-[#EFF4FB]">
              {activeMedia?.kind === 'video' ? (
                <iframe
                  src={`${youTubeEmbedUrl(activeMedia.videoId)}?autoplay=1&rel=0`}
                  title={`${displayName} — product video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 h-full w-full"
                />
              ) : activeMedia?.kind === 'image' ? (
                <Image
                  src={activeMedia.url}
                  alt={displayName}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-center font-mono text-xs uppercase tracking-widest text-ink-muted">
                  {pd.noImageUploaded}
                </div>
              )}

              {/* Material badge — hidden while video plays */}
              {activeMedia?.kind !== 'video' && primaryMaterial && (
                <div className="absolute left-4 top-4 border border-accent/30 bg-white/80 px-2.5 py-1 backdrop-blur-sm">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                    {primaryMaterial}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {mediaItems.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {mediaItems.map((item, i) => (
                  <button
                    key={item.kind === 'video' ? `video-${item.videoId}` : `${item.url}-${i}`}
                    type="button"
                    onClick={() => setActiveImageIdx(i)}
                    className={`relative aspect-square overflow-hidden border transition-colors duration-150 ${
                      i === activeImageIdx
                        ? 'border-accent'
                        : 'border-rule bg-[#EFF4FB] hover:border-navy/30'
                    }`}
                    aria-label={item.kind === 'video' ? 'Play product video' : `View photo ${i + 1}`}
                  >
                    {item.kind === 'video' ? (
                      <>
                        <Image src={item.thumb} alt="Product video" fill unoptimized className="object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-navy/40">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95">
                            <Play className="h-3 w-3 fill-navy text-navy" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <Image src={item.url} alt={`${displayName} photo ${i + 1}`} fill className="object-contain bg-[#EFF4FB]" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Gallery meta strip: materials + applications tags */}
            {(materials.length > 0 || applications.length > 0) && (
              <div className="mt-4 border-t border-rule pt-4 flex flex-wrap gap-1.5">
                {materials.map((m, i) => (
                  <span key={keyOf(m, i)} className="border border-rule bg-white px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                    {labelOf(m)}
                  </span>
                ))}
                {applications.map((a, i) => (
                  <span key={keyOf(a, i + 100)} className="border border-accent/20 bg-accent/5 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-accent">
                    {labelOf(a)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: INFO + ORDER ────────────────────────────────── */}
          <div className="mt-10 lg:mt-0">

            {/* Eyebrow + name + description */}
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
              {primaryMaterial || pd.productTypeFallback}
            </p>
            <h1 className="mt-2 font-sans text-3xl font-bold leading-tight text-navy lg:text-4xl">
              {displayName}
            </h1>
            {displayDescription && (
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                {displayDescription}
              </p>
            )}

            {/* Quick stats: 4-col bordered grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 border border-rule divide-x divide-rule">
              {quickStats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center justify-center px-3 py-4 text-center ${i >= 2 ? 'border-t border-rule sm:border-t-0' : ''}`}
                >
                  <span className="font-mono text-base font-bold text-navy leading-none">{stat.value}</span>
                  <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Size/variant switcher — one pill row per axis the family declares.
                Tapping a pill swaps the active member: image, price, specs and the
                order SKU all follow, no page reload. A second axis (tooth/grit/
                segment) shows only the values available at the chosen size. */}
            {members && (
              <div className="mt-6 space-y-5">
                {axisCfg.axes.map((axis) => {
                  const pills = pillsFor(axis)
                  if (pills.length === 0) return null
                  const rowLabel = axisRowLabel(axis)
                  return (
                    <div key={axis}>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-muted">
                        {rowLabel}
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-2.5">
                        {pills.map((pill) => (
                          <button
                            key={pill.key}
                            type="button"
                            onClick={pill.onClick}
                            aria-pressed={pill.active}
                            aria-label={`${rowLabel}: ${pill.label}`}
                            className={`flex min-h-11 min-w-[84px] items-center justify-center rounded-md border px-4 py-2 font-mono text-sm font-bold leading-none transition-[border-color,background-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 ${
                              pill.active
                                ? 'border-accent bg-accent/5 text-navy shadow-[0_0_0_3px_rgba(59,130,246,0.12)]'
                                : 'border-rule bg-white text-ink hover:border-accent/50'
                            }`}
                          >
                            {pill.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Price card */}
            <div className="mt-6 border border-rule bg-paper p-5">
              <PriceStackCard
                listPrice={data.listPrice ?? 0}
                isLoggedIn={isLoggedIn}
                emailVerified={emailVerified}
                tierDiscountPct={tierDiscountPct}
                size="lg"
                tone="light"
                language={language}
              />
              <p className="mt-3 font-mono text-[10px] text-ink-muted">{pd.priceCard.footNote}</p>
            </div>

            {/* Order form */}
            <div className="mt-6 border border-navy bg-paper p-6">
              <h2 className="font-sans text-base font-bold text-navy">{pd.orderForm.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">{pd.orderForm.blurb}</p>

              {/* Quantity stepper */}
              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={ordersPaused || quantity <= 1}
                  aria-label="Decrease quantity"
                  aria-describedby={ordersPaused ? 'kill-switch-banner' : undefined}
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-rule bg-white text-navy transition-colors duration-150 hover:border-navy hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  disabled={ordersPaused}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  aria-label="Quantity"
                  aria-describedby={ordersPaused ? 'kill-switch-banner' : undefined}
                  className="font-mono h-11 w-16 border border-rule bg-white text-center text-base font-bold text-navy focus:border-navy focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={ordersPaused}
                  aria-label="Increase quantity"
                  aria-describedby={ordersPaused ? 'kill-switch-banner' : undefined}
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-rule bg-white text-navy transition-colors duration-150 hover:border-navy hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>

                {/* Line total */}
                {lineTotal != null && (
                  <div className="ml-auto text-right">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">{pd.orderForm.lineTotal}</span>
                    <span className="font-mono text-lg font-bold text-navy leading-none">{formatPrice(lineTotal)}</span>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="mt-4">
                <AddToCartButton
                  productId={data.id}
                  quantity={quantity}
                  nextHref={nextHref}
                  disabled={ordersPaused}
                  ariaDescribedBy={ordersPaused ? 'kill-switch-banner' : undefined}
                />
              </div>

              <p className="mt-4 text-[10px] leading-relaxed text-ink-muted">{pd.orderForm.footNote}</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── TABS: SPECS / APPLICATIONS / USAGE / PARAMETERS / DOCUMENTS ── */}
      <section className="bg-paper">
        {/* Tab nav */}
        <div className="border-b border-rule">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex gap-0 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative whitespace-nowrap px-4 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition-colors duration-150 sm:px-6 ${
                    activeTab === tab.key ? 'text-navy' : 'text-ink-muted hover:text-navy'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">

          {/* Full Specification tab — table format */}
          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {specRows.map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-paper'}>
                      <td className="border border-rule px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted w-2/5">
                        {row.label}
                      </td>
                      <td className="border border-rule px-4 py-3 font-mono text-sm font-semibold text-navy">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Application Notes tab */}
          {activeTab === 'applications' && (
            <div className="grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3">
              {applications.map((app, i) => (
                <div
                  key={keyOf(app, i)}
                  className="flex items-center gap-3 bg-paper px-5 py-4"
                >
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <p className="font-sans text-sm font-semibold text-navy">{labelOf(app)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Usage Guide tab */}
          {activeTab === 'usage' && (
            <div className="grid gap-4 lg:grid-cols-2">
              {usageSteps.map((item) => (
                <div key={item.step} className="flex gap-5 border border-rule bg-white p-5">
                  <div className="font-mono text-3xl font-bold text-rule leading-none flex-shrink-0">{item.step}</div>
                  <div>
                    <h4 className="font-sans text-sm font-bold uppercase tracking-wide text-navy">{item.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cutting Parameters tab — key numeric specs in table form */}
          {activeTab === 'parameters' && (
            <div className="max-w-2xl">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {[
                    { label: pd.specs.maxRPM, value: data.maxRPM ? String(data.maxRPM) : pd.specs.maxRPMFallback },
                    { label: pd.specs.machineTier, value: machineTierLabel },
                    { label: pd.specs.bondType, value: bondLabel(data.bondType) },
                  ].filter((r) => r.value && r.value !== '').map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-paper'}>
                      <td className="border border-rule px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted w-2/5">
                        {row.label}
                      </td>
                      <td className="border border-rule px-4 py-3 font-mono text-sm font-semibold text-navy">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Documents tab */}
          {activeTab === 'documents' && (
            documents.length > 0 ? (
              <ul className="max-w-2xl space-y-2">
                {documents.map((doc) => {
                  const docTitle = isBM && doc.titleBM ? doc.titleBM : doc.title
                  const docUrl = typeof doc.file === 'object' && doc.file?.url ? doc.file.url : null
                  return docUrl ? (
                    <li key={doc.id}>
                      <a
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 border border-rule bg-white px-4 py-3 transition-colors duration-150 hover:border-navy"
                      >
                        <span className="flex-1 font-sans text-sm font-semibold text-navy">{docTitle}</span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">{pd.documentDownload} ↓</span>
                      </a>
                    </li>
                  ) : null
                })}
              </ul>
            ) : (
              <p className="font-sans text-sm text-ink-muted">{pd.documentsEmpty}</p>
            )
          )}

        </div>
      </section>

      {/* ── RELATED PRODUCTS — paper background, 4-col grid ─────────── */}
      {relatedProducts.length > 0 && (
        <section className="bg-paper py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">{pd.sectionLabels.related}</p>
                <h2 className="mt-1 font-sans text-2xl font-bold text-navy lg:text-3xl">{pd.sectionLabels.relatedHeading}</h2>
              </div>
              <Link
                href="/products"
                className="hidden font-sans text-xs font-bold text-ink-muted transition-colors hover:text-navy sm:block"
              >
                {pd.sectionLabels.viewAll} →
              </Link>
            </div>

            {/* gap-px with bg-rule produces 1px hairline separators between cells */}
            <div className="grid grid-cols-2 gap-px bg-rule lg:grid-cols-4">
              {relatedProducts.map((p) => {
                const relatedImageUrl: string | null = mediaUrl(p.image, 'thumbnail')
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="group flex flex-col bg-paper transition-colors duration-150 hover:bg-[#EFF4FB]"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#EFF4FB]">
                      {relatedImageUrl ? (
                        <Image
                          src={relatedImageUrl}
                          alt={p.name}
                          fill
                          className="object-contain transition-transform duration-150 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                          {pd.noImage}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-accent">
                        {labelOf(p.materials?.[0]) || pd.sectionLabels.universal}
                      </p>
                      <h3 className="mt-1 font-sans text-sm font-bold text-navy leading-snug">
                        {p.name}
                      </h3>
                      <p className="mt-1 font-mono text-[10px] text-ink-muted">
                        {labelOf(p.diameter)} · {bondLabel(p.bondType)}
                      </p>
                      <div className="mt-3 border-t border-rule pt-3">
                        <PriceStackCard
                          listPrice={p.listPrice ?? 0}
                          isLoggedIn={isLoggedIn}
                          emailVerified={emailVerified}
                          tierDiscountPct={tierDiscountPct}
                          size="sm"
                          showStackUp={false}
                          tone="light"
                          language={language}
                        />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

    </PublicLayout>
  )
}
