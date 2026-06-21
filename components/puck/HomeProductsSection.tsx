'use client'

/**
 * Products section for the locked-layout Puck home — a faithful extract of the
 * live home's product grid (components/home/HomePageClient.tsx lines 271–370).
 *
 * READ-ONLY by design: products come in as a prop (injected via Puck `metadata`
 * from the server, or fetched for the editor preview). Nothing here edits the
 * catalogue and NO PRICE is shown — this is the agreed two-tier exception
 * (a read-only product render inside Puck), not an editable product block.
 */
import { useMemo, useState } from 'react'

export type GridProduct = {
  id: string | number
  name: string
  category: string | null
  diameter: string | null
  bondType: string | null
  materials: Array<{ name: string }>
  image: { url: string } | null
}

const ALL = '__all__'

function ProductGlyph() {
  return (
    <svg width="120" height="120" viewBox="0 0 130 130" fill="none" aria-hidden>
      <circle cx="65" cy="65" r="48" stroke="#2d3a50" strokeWidth="2" />
      <circle cx="65" cy="65" r="34" stroke="#3B82F6" strokeWidth="2" />
      <circle cx="65" cy="65" r="14" stroke="#2d3a50" strokeWidth="2" />
      <circle cx="65" cy="65" r="5" fill="#3B82F6" />
    </svg>
  )
}

export function HomeProductsSection({
  products,
  eyebrow,
  heading,
  tabAll,
  enquire,
  viewAll,
  emptyHeading,
  emptyBody,
}: {
  products: GridProduct[]
  eyebrow: string
  heading: string
  tabAll: string
  enquire: string
  viewAll: string
  emptyHeading: string
  emptyBody: string
}) {
  const categories = useMemo(() => {
    const seen: string[] = []
    for (const p of products) {
      if (p.category && !seen.includes(p.category)) seen.push(p.category)
    }
    return seen.slice(0, 4)
  }, [products])

  const [activeTab, setActiveTab] = useState<string>(ALL)

  const visibleProducts = useMemo(() => {
    const pool = activeTab === ALL ? products : products.filter((p) => p.category === activeTab)
    return pool.slice(0, 9)
  }, [products, activeTab])

  const tabBtn = (key: string, label: string) => {
    const active = key === activeTab
    return (
      <button
        key={key}
        type="button"
        onClick={() => setActiveTab(key)}
        className={`font-mono text-xs font-semibold uppercase tracking-[0.06em] rounded px-4 py-2.5 transition-colors duration-150 ease-out ${
          active ? 'bg-accent text-white' : 'bg-transparent text-ink-muted hover:text-navy'
        }`}
      >
        {label}
      </button>
    )
  }

  return (
    <section id="products" className="border-t border-[#E6E9EE] bg-[#F5F7FA] py-20 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-3.5 flex items-center gap-3">
              <span className="block h-0.5 w-[22px] bg-accent" />
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent">{eyebrow}</span>
            </div>
            <h2 className="text-[clamp(30px,3.6vw,42px)] font-bold uppercase leading-[1.02] tracking-[-0.02em] text-navy">{heading}</h2>
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1 rounded-md border border-[#E6E9EE] bg-white p-1">
              {tabBtn(ALL, tabAll)}
              {categories.map((cat) => tabBtn(cat, cat))}
            </div>
          )}
        </div>

        {visibleProducts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((p) => {
              const chips = [p.diameter, p.materials[0]?.name ?? p.bondType ?? null].filter(Boolean) as string[]
              return (
                <a
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group overflow-hidden rounded-lg border border-[#E6E9EE] bg-white text-navy transition-[box-shadow,border-color] duration-150 ease-out hover:border-accent hover:shadow-[0_6px_18px_rgba(10,22,40,0.08)]"
                >
                  <div className="flex aspect-[4/3] items-center justify-center bg-[#F4F4F0]">
                    {p.image?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image.url} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-navy">
                        <ProductGlyph />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    {p.category && <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent">{p.category}</div>}
                    <div className="mt-1.5 text-[21px] font-semibold tracking-[-0.01em] text-navy">{p.name}</div>
                    {chips.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {chips.map((chip) => (
                          <span key={chip} className="rounded-sm border border-[#E6E9EE] px-2.5 py-1 font-mono text-[11px] text-ink-muted">{chip}</span>
                        ))}
                      </div>
                    )}
                    <div className="mt-5 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-accent">{enquire} →</div>
                  </div>
                </a>
              )
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-[#E6E9EE] bg-white p-10 text-center">
            <h3 className="text-[22px] font-semibold text-navy">{emptyHeading}</h3>
            <p className="mx-auto mt-2 max-w-[44ch] text-[15px] leading-[1.6] text-ink-muted">{emptyBody}</p>
          </div>
        )}

        <div className="mt-10">
          <a href="/products" className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-accent transition-opacity duration-150 ease-out hover:opacity-80">
            {viewAll} →
          </a>
        </div>
      </div>
    </section>
  )
}
