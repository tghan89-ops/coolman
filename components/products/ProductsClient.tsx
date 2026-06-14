'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Search, X } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { FilterSidebar, type FilterGroup } from '@/components/catalogue/FilterSidebar'
import { PriceStackCard } from '@/components/catalogue/PriceStackCard'
import { bondLabel } from '@/lib/products/bond-label'
import { diameterBucket } from '@/lib/products/diameter'
import { productMatchesQuery } from '@/lib/products/search'
import { groupByFamily } from '@/lib/products/family'
import { useLanguage } from '@/lib/i18n/context'

// Page size lives here as a justified hardcode — see LEARNINGS.md, section
// "Frontend-editability exceptions". 24 keeps three rows of 8 (xl), six rows
// of 4 (lg), or twelve rows of 2 (sm). Changing it requires a code edit by
// design.
const PAGE_SIZE = 24

// Filter group keys must stay in sync with what the server pre-computes in
// app/(frontend)/products/page.tsx. The strings ("material", "application",
// "diameter") flow into search-log entries verbatim so Alan can scan them.
const FILTER_KEYS = {
  category: 'category',
  material: 'material',
  application: 'application',
  diameter: 'diameter',
} as const

// Minimal shape of a Payload product as far as the catalogue grid card reads
// it. Server passes raw Payload docs (page.tsx → ProductsClient) and we cast
// at the boundary. Keep this in sync with the fields actually rendered below
// — adding a new product field to the grid means adding it here too. Anything
// not in this list should not be read from `product` in this component.
// Burned 2026-05-17 — see code-quality review (replaced repeated `any` reads).
export type ProductRelation = string | { id?: string | number; name?: string | null } | null | undefined

export interface ProductCardData {
  id: string | number
  name: string
  sku?: string | null
  category?: string | null
  listPrice: number
  diameter?: string | null
  diameterMm?: number | null
  bondType?: string | null
  family?: string | null
  variantValue?: number | null
  materials?: ProductRelation[]
  applications?: ProductRelation[]
  image?: { url?: string | null } | string | null
}

export interface ProductsClientProps {
  initialProducts: ProductCardData[]
  filterGroups: FilterGroup[]
  isLoggedIn?: boolean
  emailVerified?: boolean
  tierDiscountPct?: number
}

export function ProductsClient({
  initialProducts,
  filterGroups,
  isLoggedIn = false,
  emailVerified = false,
  tierDiscountPct = 0,
}: ProductsClientProps) {
  const { t, language } = useLanguage()
  const products = initialProducts
  const [selected, setSelected] = useState<Record<string, string[]>>({
    [FILTER_KEYS.category]: [],
    [FILTER_KEYS.material]: [],
    [FILTER_KEYS.application]: [],
    [FILTER_KEYS.diameter]: [],
  })
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filteredProducts = useMemo(() => {
    let result = products

    const selCategories = selected[FILTER_KEYS.category] ?? []
    const selMaterials = selected[FILTER_KEYS.material] ?? []
    const selApplications = selected[FILTER_KEYS.application] ?? []
    const selDiameters = selected[FILTER_KEYS.diameter] ?? []
    // Free-text search matches product name OR SKU/model code, case-insensitive.
    // Runs over the already-loaded catalogue, so results are instant. The
    // analytics log (below) records the query separately — never skip it.
    const q = query.trim().toLowerCase()

    const relationName = (r: ProductRelation): string => {
      if (r == null) return ''
      if (typeof r === 'object') return r.name ?? ''
      return String(r)
    }

    if (selCategories.length > 0) {
      result = result.filter((p) => selCategories.includes(p.category ?? ''))
    }
    if (selMaterials.length > 0) {
      result = result.filter((p) => {
        const mats = Array.isArray(p.materials) ? p.materials : []
        return mats.some((m) => selMaterials.includes(relationName(m)))
      })
    }
    if (selApplications.length > 0) {
      result = result.filter((p) => {
        const apps = Array.isArray(p.applications) ? p.applications : []
        return apps.some((a) => selApplications.includes(relationName(a)))
      })
    }
    if (selDiameters.length > 0) {
      result = result.filter((p) => {
        const bucket = diameterBucket(p.diameterMm)
        return selDiameters.includes(bucket)
      })
    }
    if (q) {
      result = result.filter((p) => productMatchesQuery(p, q))
    }

    return result
  }, [products, selected, query])

  // Collapse same-family sizes into one card. A diameter filter narrows the
  // members first (above), so a family shows only if at least one of its sizes
  // matched, and the card links to the smallest matching size. Untagged
  // products each form their own single-member group — identical to before.
  const groups = useMemo(() => groupByFamily(filteredProducts), [filteredProducts])

  const totalPages = Math.max(1, Math.ceil(groups.length / PAGE_SIZE))
  // Snap back to page 1 whenever the filter set or search text changes.
  useEffect(() => {
    setPage(1)
  }, [selected, query])

  // Catalogue search logging (hard rule: every catalogue search is logged).
  // We debounce 600ms so a settled query logs once, not on every keystroke, and
  // read the current result count from a ref so changing filters alone doesn't
  // re-fire a search event. Fire-and-forget: analytics must never break or slow
  // the catalogue, so failures are swallowed.
  const resultCountRef = useRef(0)
  // Log the number of cards the user actually sees (families collapsed), not the
  // raw SKU count, so search analytics match the displayed result count.
  resultCountRef.current = groups.length
  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) return
    const handle = setTimeout(() => {
      void fetch('/api/search-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, resultCount: resultCountRef.current }),
        keepalive: true,
      }).catch(() => {})
    }, 600)
    return () => clearTimeout(handle)
  }, [query])
  const safePage = Math.min(page, totalPages)
  const pagedGroups = useMemo(
    () => groups.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [groups, safePage],
  )

  const handleClear = () => {
    setSelected({
      [FILTER_KEYS.category]: [],
      [FILTER_KEYS.material]: [],
      [FILTER_KEYS.application]: [],
      [FILTER_KEYS.diameter]: [],
    })
    setQuery('')
  }

  return (
    <PublicLayout>
      {/* Hero — Session 4 verbatim copy. Light surface, no navy banner. */}
      <section className="border-b border-rule bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {t.catalogueIntro.eyebrow}
            </p>
            <h1 className="mt-4 font-fraunces text-4xl font-normal leading-[1.08] tracking-[-0.01em] text-navy sm:text-5xl">
              {t.catalogueIntro.headline}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-ink-muted sm:text-lg">
              {t.catalogueIntro.lede}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              {t.catalogueIntro.tradeNote}
            </p>
          </div>
        </div>
      </section>

      {/* Catalogue body — sidebar filters + product grid */}
      <section className="overflow-x-hidden bg-paper py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Filter sidebar — sticky with its own scroll so the filter panel
                doesn't require scrolling the whole page on long catalogues. */}
            <div className="lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
              <FilterSidebar
                groups={filterGroups}
                selected={selected}
                onChange={setSelected}
                onClear={handleClear}
                className="min-w-0"
              />
            </div>

            <div className="min-w-0">
              {/* Search box — instant filter by product name or code. */}
              <div className="mb-5">
                <label htmlFor="product-search" className="sr-only">
                  {t.products.searchLabel}
                </label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
                    aria-hidden="true"
                  />
                  <input
                    id="product-search"
                    type="search"
                    inputMode="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.products.searchPlaceholder}
                    aria-label={t.products.searchLabel}
                    className="h-12 w-full rounded-sm border border-rule bg-white pl-10 pr-10 text-sm text-navy placeholder:text-ink-faint transition-[border-color,box-shadow] duration-150 ease-out focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label={t.products.searchClear}
                      className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-sm text-ink-muted transition-colors duration-150 ease-out hover:bg-paper hover:text-navy"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Result count line */}
              <div className="mb-6 flex items-baseline justify-between">
                <p className="text-sm text-ink-muted">
                  <span className="font-mono font-semibold text-navy">{groups.length}</span>{' '}
                  {groups.length === 1 ? t.products.productSingular : t.products.productPlural}
                </p>
              </div>

              {groups.length > 0 ? (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {pagedGroups.map((group) => {
                      const rep = group.primary
                      const cardImageUrl: string | null =
                        typeof rep.image === 'object' && rep.image?.url
                          ? rep.image.url
                          : null
                      const primaryMaterialLabel = (() => {
                        const m = rep.materials?.[0]
                        const name = typeof m === 'object' && m !== null ? m.name : m
                        return (name || t.products.card.universal) as string
                      })()
                      return (
                        <Link
                          key={group.key}
                          href={`/products/${rep.id}`}
                          className="group relative flex flex-col overflow-hidden rounded-md border border-rule bg-white transition-[border-color,box-shadow] duration-150 ease-out hover:border-accent/40 hover:shadow-md"
                        >
                          <div className="relative aspect-square overflow-hidden bg-paper">
                            {/* Size-count badge — only for grouped families. */}
                            {group.isFamily && (
                              <span className="absolute left-3 top-3 z-10 rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                                {(group.primaryAxisIsSize
                                  ? t.products.card.sizeCount
                                  : t.products.card.optionCount
                                ).replace('{count}', String(group.optionCount))}
                              </span>
                            )}
                            {cardImageUrl ? (
                              <Image
                                src={cardImageUrl}
                                alt={group.displayName}
                                width={400}
                                height={400}
                                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-navy/5 text-center font-mono text-xs uppercase tracking-widest text-ink-muted">
                                {t.products.card.noImage}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                              {primaryMaterialLabel}
                            </p>
                            <h3 className="mt-2 text-lg font-semibold text-navy transition-colors group-hover:text-accent">
                              {group.displayName}
                            </h3>
                            <p className="mt-1 text-sm text-ink-muted">
                              <span className="font-mono">{group.diameterRange}</span>
                              {group.isFamily
                                ? ''
                                : (group.diameterRange ? ' | ' : '') +
                                  `${bondLabel(rep.bondType) || t.products.card.standardBond} ${t.products.card.bondSuffix}`}
                            </p>
                            <div className="mt-4 flex items-center justify-between border-t border-rule pt-4">
                              <PriceStackCard
                                listPrice={group.fromPrice}
                                isLoggedIn={isLoggedIn}
                                emailVerified={emailVerified}
                                tierDiscountPct={tierDiscountPct}
                                size="sm"
                                showStackUp={false}
                                pricePrefix={group.isFamily ? t.products.card.fromPrice : undefined}
                                language={language}
                              />
                              <ArrowRight className="h-5 w-5 text-ink-faint transition-colors group-hover:text-accent" />
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={safePage === 1}
                        className="min-h-11 rounded-sm bg-white px-4 text-sm font-semibold text-navy transition-colors duration-150 ease-out hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {t.products.pagination.previous}
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setPage(n)}
                          className={`h-11 w-11 rounded-sm font-mono text-sm font-semibold transition-colors duration-150 ease-out ${
                            n === safePage
                              ? 'bg-navy text-white'
                              : 'bg-white text-ink-muted hover:bg-paper hover:text-navy'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={safePage === totalPages}
                        className="min-h-11 rounded-sm bg-white px-4 text-sm font-semibold text-navy transition-colors duration-150 ease-out hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {t.products.pagination.next}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-md border border-rule bg-white py-20">
                  <p className="text-lg font-semibold text-navy">{t.products.empty.title}</p>
                  <p className="mt-2 text-sm text-ink-muted">{t.products.empty.message}</p>
                  <Button
                    onClick={handleClear}
                    className="mt-6 bg-navy font-semibold text-white hover:bg-navy-light"
                  >
                    {t.products.empty.clearButton}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

// Diameter bucketing. We bucket the raw diameterMm value into 100mm increments
