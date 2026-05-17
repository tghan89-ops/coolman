'use client'

import { useMemo, useState } from 'react'
import { PublicLayout } from '@/components/layout/public-layout'
import { DealerCard } from '@/components/industrial/DealerCard'
import { useLanguage } from '@/lib/i18n/context'
import { cn } from '@/lib/utils'

// Row shape mirrors the Payload `dealers` collection — snake_case at the
// data boundary, mapped to DealerCard's camelCase props when rendering.
export interface DealerRow {
  id: string | number
  name: string
  area: string
  address: string
  whatsapp_number: string
  google_maps_query: string
  operating_hours?: string | null
  languages?: string | null
  specialisations?: string | null
}

interface BrotherhoodDirectoryClientProps {
  dealers: DealerRow[]
}

// Empty-state fallback CTA target. DealerCard already deep-links to per-dealer
// numbers from the collection; this hardcoded sales number is only used when
// zero active dealers exist. Long-term, source from Settings.
const SALES_WHATSAPP_DIGITS = '60126363156'

export function BrotherhoodDirectoryClient({ dealers }: BrotherhoodDirectoryClientProps) {
  const { t } = useLanguage()
  const b = t.brotherhoodDirectory

  // Filter values come from the data — never a hardcoded enum.
  const areas = useMemo(
    () => Array.from(new Set(dealers.map((d) => d.area))).sort(),
    [dealers],
  )

  // null = show all; otherwise filter by exact area match.
  const [activeArea, setActiveArea] = useState<string | null>(null)

  const visibleDealers = useMemo(() => {
    if (activeArea === null) return dealers
    return dealers.filter((d) => d.area === activeArea)
  }, [dealers, activeArea])

  const hasFilter = dealers.length > 0 && areas.length >= 2

  const salesWhatsAppUrl = `https://wa.me/${SALES_WHATSAPP_DIGITS}?text=${encodeURIComponent(
    b.emptyState.body,
  )}`

  return (
    <PublicLayout headerVariant="transparent">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-[1280px] px-6 pt-32 pb-24 lg:px-8 lg:pt-40 lg:pb-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
            {b.hero.eyebrow}
          </p>
          <h1 className="mt-6 max-w-[22ch] font-fraunces text-[clamp(40px,6vw,84px)] font-normal leading-[1.02] tracking-[-0.025em] text-paper">
            {b.hero.headline}
          </h1>
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-ink-faint">
            {b.hero.lede}
          </p>
        </div>
      </section>

      {/* ── DIRECTORY BODY ───────────────────────────────────────── */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
          {dealers.length === 0 ? (
            // Empty state: single centred CTA block. Single accent on the
            // button so it doesn't read as a stranded dealer card.
            <div className="mx-auto flex max-w-[60ch] flex-col items-center text-center">
              <h2 className="font-fraunces text-[clamp(28px,3vw,40px)] font-normal leading-[1.1] tracking-[-0.02em] text-navy">
                {b.emptyState.headline}
              </h2>
              <p className="mt-6 max-w-[60ch] text-[16px] leading-[1.75] text-ink-muted">
                {b.emptyState.body}
              </p>
              <a
                href={salesWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'mt-10 inline-flex items-center justify-center gap-2',
                  'min-h-[48px] px-6 rounded-md',
                  'bg-accent text-white text-sm font-medium',
                  'transition-opacity duration-150 ease-out',
                  'hover:opacity-90 focus-visible:opacity-90',
                )}
              >
                {b.emptyState.ctaLabel}
              </a>
            </div>
          ) : (
            <>
              {hasFilter ? (
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                    {b.filter.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveArea(null)}
                      aria-pressed={activeArea === null}
                      className={cn(
                        'inline-flex items-center justify-center',
                        'min-h-[44px] px-4 rounded-md text-sm font-medium',
                        'transition-opacity duration-150 ease-out',
                        'hover:opacity-90 focus-visible:opacity-90',
                        activeArea === null
                          ? 'bg-accent text-white'
                          : 'border border-rule text-ink bg-white',
                      )}
                    >
                      {b.filter.allLabel}
                    </button>
                    {areas.map((area) => {
                      const isActive = activeArea === area
                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() => setActiveArea(area)}
                          aria-pressed={isActive}
                          className={cn(
                            'inline-flex items-center justify-center',
                            'min-h-[44px] px-4 rounded-md text-sm font-medium',
                            'transition-opacity duration-150 ease-out',
                            'hover:opacity-90 focus-visible:opacity-90',
                            isActive
                              ? 'bg-accent text-white'
                              : 'border border-rule text-ink bg-white',
                          )}
                        >
                          {area}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null}

              <div
                className={cn(
                  'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
                  hasFilter && 'mt-12',
                )}
              >
                {visibleDealers.map((dealer) => (
                  <DealerCard
                    key={dealer.id}
                    name={dealer.name}
                    area={dealer.area}
                    address={dealer.address}
                    whatsappNumber={dealer.whatsapp_number}
                    googleMapsQuery={dealer.google_maps_query}
                    operatingHours={dealer.operating_hours ?? undefined}
                    languages={dealer.languages ?? undefined}
                    specialisations={dealer.specialisations ?? undefined}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
