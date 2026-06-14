'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUp, ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { FilterSidebar, type FilterGroup } from '@/components/catalogue/FilterSidebar'
import { PriceStackCard } from '@/components/catalogue/PriceStackCard'
import { bondLabel } from '@/lib/products/bond-label'
import { diameterBucket } from '@/lib/products/diameter'
import { productMatchesQuery } from '@/lib/products/search'
import { groupByFamily, familyKey } from '@/lib/products/family'
import {
  materialBucketKey,
  materialBucketLabel,
  type MaterialBucketKey,
} from '@/lib/products/material-group'
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

type SortKey = 'name' | 'price-asc' | 'price-desc' | 'diameter'

// Filter/search/sort/page state is mirrored into the URL query string so that
// (a) the browser Back button from a product page restores the exact filtered
// view, (b) the product page can offer a "Back to results" link, and (c) a
// filtered catalogue URL is shareable. Multi-value groups are comma-joined.
interface CatalogueUrlState {
  selected: Record<string, string[]>
  query: string
  sort: SortKey
  page: number
}

function parseCatalogueParams(sp: URLSearchParams): CatalogueUrlState {
  const get = (k: string) => {
    const v = sp.get(k)
    return v ? v.split(',').filter(Boolean) : []
  }
  const sortRaw = sp.get('sort')
  const sort: SortKey =
    sortRaw === 'price-asc' || sortRaw === 'price-desc' || sortRaw === 'diameter'
      ? sortRaw
      : 'name'
  return {
    selected: {
      [FILTER_KEYS.category]: get('category'),
      [FILTER_KEYS.material]: get('material'),
      [FILTER_KEYS.application]: get('application'),
      [FILTER_KEYS.diameter]: get('diameter'),
    },
    query: sp.get('q') ?? '',
    sort,
    page: Math.max(1, Number(sp.get('page')) || 1),
  }
}

function catalogueParamsString(state: {
  selected: Record<string, string[]>
  query: string
  sort: SortKey
  page: number
}): string {
  const p = new URLSearchParams()
  for (const key of [
    FILTER_KEYS.category,
    FILTER_KEYS.material,
    FILTER_KEYS.application,
    FILTER_KEYS.diameter,
  ]) {
    const vals = state.selected[key] ?? []
    if (vals.length) p.set(key, vals.join(','))
  }
  if (state.query.trim()) p.set('q', state.query.trim())
  if (state.sort !== 'name') p.set('sort', state.sort)
  if (state.page > 1) p.set('page', String(state.page))
  return p.toString()
}

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
  const pathname = usePathname()
  const searchParams = useSearchParams()
  // Seed all filter/search/sort/page state from the URL once, so landing on a
  // shared/bookmarked link — or returning via the browser Back button from a
  // product page — restores the exact view. searchParams is available on both
  // the server render and the client, so the lazy initializer is consistent
  // (no hydration flash).
  const [initialState] = useState(() => parseCatalogueParams(searchParams))

  const [selected, setSelected] = useState<Record<string, string[]>>(initialState.selected)
  const [query, setQuery] = useState(initialState.query)
  const [page, setPage] = useState(initialState.page)
  // Mobile filter bottom-sheet open state. Desktop shows the sidebar inline and
  // never uses this.
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [sortBy, setSortBy] = useState<SortKey>(initialState.sort)
  const [showBackToTop, setShowBackToTop] = useState(false)

  const totalSelected = useMemo(
    () => Object.values(selected).reduce((sum, list) => sum + list.length, 0),
    [selected],
  )

  const relationName = (r: ProductRelation): string => {
    if (r == null) return ''
    if (typeof r === 'object') return r.name ?? ''
    return String(r)
  }

  // Filtering + faceting in one pass. Material is matched by its COARSE BUCKET
  // (materialBucketKey), not the fine DB tag, so the rolled-up filter works.
  // Free-text search matches name/SKU/category/materials/applications (see
  // productMatchesQuery) over the already-loaded catalogue, so it's instant.
  // The analytics log (below) records the query separately — never skip it.
  const { filteredProducts, facetedGroups, activeChips } = useMemo(() => {
    const selCategories = selected[FILTER_KEYS.category] ?? []
    const selMaterials = selected[FILTER_KEYS.material] ?? []
    const selApplications = selected[FILTER_KEYS.application] ?? []
    const selDiameters = selected[FILTER_KEYS.diameter] ?? []
    const q = query.trim().toLowerCase()

    const matchCat = (p: ProductCardData) =>
      selCategories.length === 0 || selCategories.includes(p.category ?? '')
    const matchMat = (p: ProductCardData) => {
      if (selMaterials.length === 0) return true
      const mats = Array.isArray(p.materials) ? p.materials : []
      return mats.some((m) => {
        const n = relationName(m)
        return !!n && selMaterials.includes(materialBucketKey(n))
      })
    }
    const matchApp = (p: ProductCardData) => {
      if (selApplications.length === 0) return true
      const apps = Array.isArray(p.applications) ? p.applications : []
      return apps.some((a) => selApplications.includes(relationName(a)))
    }
    const matchDia = (p: ProductCardData) =>
      selDiameters.length === 0 || selDiameters.includes(diameterBucket(p.diameterMm))
    const matchSearch = (p: ProductCardData) => !q || productMatchesQuery(p, q)

    const filtered = products.filter(
      (p) => matchCat(p) && matchMat(p) && matchApp(p) && matchDia(p) && matchSearch(p),
    )

    // Family-aware faceting: count how many CARDS (families collapsed), not raw
    // SKUs, carry each option value — mirrors the server's family-dedup so the
    // sidebar numbers match the collapsed grid. Trivial cost on ~274 items.
    const familyAwareCounts = (
      prods: ProductCardData[],
      getValues: (p: ProductCardData) => string[],
    ): Map<string, number> => {
      const fam = new Map<string, ProductCardData[]>()
      for (const p of prods) {
        const k = familyKey(p)
        const arr = fam.get(k)
        if (arr) arr.push(p)
        else fam.set(k, [p])
      }
      const counts = new Map<string, number>()
      for (const members of fam.values()) {
        const seen = new Set<string>()
        for (const p of members)
          for (const v of getValues(p)) {
            if (v && !seen.has(v)) {
              seen.add(v)
              counts.set(v, (counts.get(v) ?? 0) + 1)
            }
          }
      }
      return counts
    }

    const catVals = (p: ProductCardData) => (p.category ? [p.category] : [])
    const matVals = (p: ProductCardData) => {
      const out: string[] = []
      for (const m of Array.isArray(p.materials) ? p.materials : []) {
        const n = relationName(m)
        if (n) out.push(materialBucketKey(n))
      }
      return out
    }
    const appVals = (p: ProductCardData) =>
      (Array.isArray(p.applications) ? p.applications : []).map(relationName).filter(Boolean)
    const diaVals = (p: ProductCardData) => [diameterBucket(p.diameterMm)]

    // Each group's faceted counts come from the set filtered by all OTHER groups
    // (plus search), so its own options stay live during multi-select.
    const facetCat = familyAwareCounts(
      products.filter((p) => matchMat(p) && matchApp(p) && matchDia(p) && matchSearch(p)),
      catVals,
    )
    const facetMat = familyAwareCounts(
      products.filter((p) => matchCat(p) && matchApp(p) && matchDia(p) && matchSearch(p)),
      matVals,
    )
    const facetApp = familyAwareCounts(
      products.filter((p) => matchCat(p) && matchMat(p) && matchDia(p) && matchSearch(p)),
      appVals,
    )
    const facetDia = familyAwareCounts(
      products.filter((p) => matchCat(p) && matchMat(p) && matchApp(p) && matchSearch(p)),
      diaVals,
    )
    const countsByKey: Record<string, Map<string, number>> = {
      [FILTER_KEYS.category]: facetCat,
      [FILTER_KEYS.material]: facetMat,
      [FILTER_KEYS.application]: facetApp,
      [FILTER_KEYS.diameter]: facetDia,
    }

    const faceted: FilterGroup[] = filterGroups.map((g) => {
      const counts = countsByKey[g.key]
      return {
        ...g,
        options: g.options.map((o) => ({
          ...o,
          count: counts?.get(o.value) ?? 0,
          // Material options are localized from the bucket key; others keep
          // their canonical/server label.
          label:
            g.key === FILTER_KEYS.material
              ? materialBucketLabel(o.value as MaterialBucketKey, language)
              : o.label,
        })),
      }
    })

    const labelFor = (groupKey: string, value: string) => {
      const g = faceted.find((fg) => fg.key === groupKey)
      return g?.options.find((opt) => opt.value === value)?.label ?? value
    }
    const chips: Array<{ groupKey: string; value: string; label: string }> = []
    for (const g of filterGroups)
      for (const value of selected[g.key] ?? [])
        chips.push({ groupKey: g.key, value, label: labelFor(g.key, value) })

    return { filteredProducts: filtered, facetedGroups: faceted, activeChips: chips }
  }, [products, selected, query, language, filterGroups])

  // Collapse same-family sizes into one card. A diameter filter narrows the
  // members first (above), so a family shows only if at least one of its sizes
  // matched, and the card links to the smallest matching size. Untagged
  // products each form their own single-member group — identical to before.
  const groups = useMemo(() => groupByFamily(filteredProducts), [filteredProducts])

  // Sort the collapsed cards. Default 'name' keeps the server's A–Z order.
  // Price sorts are offered to logged-in users only — logged-out visitors see
  // no price and get no price-order signal (CLAUDE.md price gate).
  const sortedGroups = useMemo(() => {
    if (sortBy === 'name') return groups
    const arr = [...groups]
    if (sortBy === 'price-asc') arr.sort((a, b) => a.fromPrice - b.fromPrice)
    else if (sortBy === 'price-desc') arr.sort((a, b) => b.fromPrice - a.fromPrice)
    else if (sortBy === 'diameter')
      arr.sort(
        (a, b) => (a.primary.diameterMm ?? Infinity) - (b.primary.diameterMm ?? Infinity),
      )
    return arr
  }, [groups, sortBy])

  const totalPages = Math.max(1, Math.ceil(groups.length / PAGE_SIZE))
  // Snap back to page 1 whenever the filter set, search text, or sort changes —
  // but NOT on the initial mount, or we'd discard a page restored from the URL.
  const didMountRef = useRef(false)
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }
    setPage(1)
  }, [selected, query, sortBy])

  // Mirror state into the URL (no Next navigation — history.replaceState keeps
  // filtering instant and client-side; we only READ searchParams on mount). The
  // back-button + browser-back restore read this same URL.
  const catalogueQs = useMemo(
    () => catalogueParamsString({ selected, query, sort: sortBy, page }),
    [selected, query, sortBy, page],
  )
  useEffect(() => {
    const url = catalogueQs ? `${pathname}?${catalogueQs}` : pathname
    window.history.replaceState(window.history.state, '', url)
  }, [catalogueQs, pathname])

  // Back-to-top affordance (mobile): the page can run >10,000px tall, so once
  // the user has scrolled past a screen we offer a one-tap jump back to the
  // search + filter controls.
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 800)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
    () => sortedGroups.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [sortedGroups, safePage],
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

  // Remove a single active filter value (from a chip ✕). Reuses the same
  // selection state the sidebar drives.
  const removeChip = (groupKey: string, value: string) => {
    setSelected({
      ...selected,
      [groupKey]: (selected[groupKey] ?? []).filter((v) => v !== value),
    })
  }

  // Reusable Sort control (used in the desktop toolbar and the mobile bar).
  // Price options are logged-in only so logged-out visitors get no price signal.
  const sortControl = (extraClass?: string) => (
    <div className={cn('relative', extraClass)}>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
        aria-label={t.products.sortLabel}
        className="h-11 w-full cursor-pointer appearance-none rounded-sm border border-rule bg-white pl-3 pr-8 text-sm font-semibold text-navy transition-colors duration-150 ease-out focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      >
        <option value="name">{t.products.sortNameAsc}</option>
        {isLoggedIn && <option value="price-asc">{t.products.sortPriceAsc}</option>}
        {isLoggedIn && <option value="price-desc">{t.products.sortPriceDesc}</option>}
        <option value="diameter">{t.products.sortDiameter}</option>
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
        aria-hidden="true"
      />
    </div>
  )

  return (
    <PublicLayout>
      {/* Compact catalogue masthead — a working tool surface, not a magazine
          cover, so products sit near the top instead of below the fold. The
          full lede/trade copy lived here before and pushed the grid down; the
          live result count below carries the real product number. */}
      <section className="border-b border-rule bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {t.catalogueIntro.eyebrow}
            </p>
            <h1 className="mt-2 font-fraunces text-2xl font-normal leading-[1.1] tracking-[-0.01em] text-navy sm:text-3xl">
              {t.catalogueIntro.headline}
            </h1>
          </div>
        </div>
      </section>

      {/* Catalogue body — sidebar filters + product grid.
          overflow-x-CLIP (not hidden): clip stops horizontal overflow WITHOUT
          turning this section into a scroll container, which `hidden` does and
          which silently broke the mobile sticky filter bar. */}
      <section className="overflow-x-clip bg-paper py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Desktop: inline sticky sidebar. Accordion-collapsed it fits the
                viewport with no scrollbar; when groups are expanded past the
                screen it scrolls INTERNALLY (max-h + overflow-y-auto) so the
                bottom groups stay reachable without scrolling to the page end.
                Hidden below lg, where the bottom-sheet takes over. */}
            <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:overscroll-contain">
              <FilterSidebar
                groups={facetedGroups}
                selected={selected}
                onChange={setSelected}
                onClear={handleClear}
                showAllLabel={t.products.showAll}
                showLessLabel={t.products.showLess}
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

              {/* Mobile filter + sort bar — sticky BELOW the 80px fixed header
                  (top-24) so it stays reachable as the grid scrolls. Holds the
                  Filters drawer trigger, the live result count, and Sort. */}
              <div className="sticky top-24 z-30 -mx-6 mb-4 border-y border-rule bg-paper/95 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-paper/80 lg:hidden">
                <div className="flex items-center gap-2">
                  <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                    <button
                      type="button"
                      onClick={() => setFilterSheetOpen(true)}
                      className="flex flex-1 items-center justify-between gap-2 rounded-sm border border-rule bg-white px-4 py-3 text-sm font-semibold text-navy transition-colors duration-150 ease-out hover:border-accent/40"
                    >
                      <span className="inline-flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                        {totalSelected > 0
                          ? t.products.filtersCount.replace('{count}', String(totalSelected))
                          : t.products.filtersHeader}
                      </span>
                      <span className="font-mono text-xs text-ink-muted">
                        {groups.length}
                      </span>
                    </button>
                    <SheetContent
                      side="bottom"
                      className="flex max-h-[85vh] flex-col gap-0 rounded-t-xl p-0 data-[state=open]:duration-150 data-[state=closed]:duration-150"
                    >
                      <SheetTitle className="sr-only">{t.products.filtersHeader}</SheetTitle>
                      <div className="flex-1 overflow-y-auto px-5 py-4">
                        <FilterSidebar
                          groups={facetedGroups}
                          selected={selected}
                          onChange={setSelected}
                          onClear={handleClear}
                          showAllLabel={t.products.showAll}
                          showLessLabel={t.products.showLess}
                          className="border-0 bg-transparent p-0"
                        />
                    </div>
                    <SheetFooter className="flex-row gap-3 border-t border-rule px-5 py-4">
                      <button
                        type="button"
                        onClick={handleClear}
                        className="min-h-11 flex-1 rounded-sm border border-rule bg-white text-sm font-semibold text-navy transition-colors duration-150 ease-out hover:bg-paper"
                      >
                        {t.products.clear}
                      </button>
                      <SheetClose asChild>
                        <button
                          type="button"
                          className="min-h-11 flex-1 rounded-sm bg-navy text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-navy-light"
                        >
                          {t.products.showResults.replace('{count}', String(groups.length))}
                        </button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                  </Sheet>
                  {sortControl('w-[44%] shrink-0')}
                </div>
              </div>

              {/* Result count + sort toolbar. On mobile, sort lives in the
                  sticky bar above; here it shows only the count. On desktop the
                  sort control sits to the right of the count. */}
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm text-ink-muted">
                  <span className="font-mono font-semibold text-navy">{groups.length}</span>{' '}
                  {groups.length === 1 ? t.products.productSingular : t.products.productPlural}
                </p>
                <div className="hidden lg:block lg:w-56">{sortControl()}</div>
              </div>

              {/* Active-filter chips — one per selected value, ✕ removes just that
                  one. The single best "what am I looking at" cue, especially on
                  mobile once the filter sheet closes. */}
              {activeChips.length > 0 && (
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  {activeChips.map((chip) => (
                    <button
                      key={`${chip.groupKey}-${chip.value}`}
                      type="button"
                      onClick={() => removeChip(chip.groupKey, chip.value)}
                      aria-label={t.products.removeFilter.replace('{label}', chip.label)}
                      className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-rule bg-white py-1 pl-3 pr-2 text-xs font-semibold text-navy transition-colors duration-150 ease-out hover:border-accent/40 hover:bg-paper"
                    >
                      <span>{chip.label}</span>
                      <X className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleClear}
                    className="ml-1 text-xs font-semibold text-accent transition-opacity duration-150 ease-out hover:opacity-80"
                  >
                    {t.products.clearAll}
                  </button>
                </div>
              )}

              {groups.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
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
                          href={`/products/${rep.id}${catalogueQs ? `?from=${encodeURIComponent(catalogueQs)}` : ''}`}
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
                                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 50vw, 33vw"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-navy/5 text-center font-mono text-xs uppercase tracking-widest text-ink-muted">
                                {t.products.card.noImage}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col p-3 sm:p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent sm:text-xs">
                              {primaryMaterialLabel}
                            </p>
                            <h3 className="mt-1.5 text-base font-semibold leading-snug text-navy transition-colors group-hover:text-accent sm:mt-2 sm:text-lg">
                              {group.displayName}
                            </h3>
                            <p className="mt-1 text-sm text-ink-muted">
                              <span className="font-mono">{group.diameterRange}</span>
                              {group.isFamily
                                ? ''
                                : (group.diameterRange ? ' | ' : '') +
                                  `${bondLabel(rep.bondType) || t.products.card.standardBond} ${t.products.card.bondSuffix}`}
                            </p>
                            <div className="mt-3 flex items-center justify-between gap-2 border-t border-rule pt-3 sm:mt-4 sm:pt-4">
                              <PriceStackCard
                                listPrice={group.fromPrice}
                                isLoggedIn={isLoggedIn}
                                emailVerified={emailVerified}
                                tierDiscountPct={tierDiscountPct}
                                size="sm"
                                showStackUp={false}
                                pricePrefix={group.isFamily ? t.products.card.fromPrice : undefined}
                                language={language}
                                gateTone="muted"
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
                <div className="flex flex-col items-center justify-center rounded-md border border-rule bg-white px-6 py-20 text-center">
                  {/* Recoverable empty state: a search miss gets search-specific
                      copy (the query echoed back), a filter-only miss keeps the
                      filter wording. Clear resets both. */}
                  <p className="text-lg font-semibold text-navy">
                    {query.trim()
                      ? t.products.empty.searchTitle.replace('{query}', query.trim())
                      : t.products.empty.title}
                  </p>
                  <p className="mt-2 max-w-md text-sm text-ink-muted">
                    {query.trim() ? t.products.empty.searchHint : t.products.empty.message}
                  </p>
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

      {/* Back-to-top — mobile only; the grid can run very tall, so once past a
          screen we offer a one-tap jump to the search + filter controls. */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label={t.products.backToTop}
        className={cn(
          'fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-rule bg-navy text-white shadow-md transition-opacity duration-150 ease-out lg:hidden',
          showBackToTop ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <ArrowUp className="h-5 w-5" aria-hidden="true" />
      </button>
    </PublicLayout>
  )
}

// Diameter bucketing. We bucket the raw diameterMm value into 100mm increments
