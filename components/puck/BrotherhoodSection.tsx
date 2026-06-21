'use client'

/**
 * Interactive area-filter + dealer grid for the locked-layout Puck Brotherhood
 * page block.  Extracted from BrotherhoodDirectoryClient.tsx — the only reason
 * this is a client component is the useState/useMemo area filter.
 *
 * Props come entirely from the Puck block's editable fields; no CMS/fetch calls
 * happen here.  The block render (page-brotherhood.tsx) stays pure so it works
 * on the server <Render> path and in the editor.
 */

import { useMemo, useState } from 'react'
import { DealerCard } from '@/components/industrial/DealerCard'
import { cn } from '@/lib/utils'

export interface DealerEntry {
  name: string
  area: string
  address: string
  whatsapp_number: string
  google_maps_query: string
  operating_hours?: string
  languages?: string
  specialisations?: string
}

export type BrotherhoodCopy = {
  filterLabel: string
  allLabel: string
  emptyHeadline: string
  emptyBody: string
  emptyCtaLabel: string
}

interface BrotherhoodSectionProps {
  dealers: DealerEntry[]
  whatsappNumber: string
  copy: BrotherhoodCopy
}

export function BrotherhoodSection({ dealers, whatsappNumber, copy }: BrotherhoodSectionProps) {
  const whatsappDigits = (whatsappNumber || '').replace(/\D/g, '')

  const areas = useMemo(
    () => Array.from(new Set(dealers.map((d) => d.area))).sort(),
    [dealers],
  )

  const [activeArea, setActiveArea] = useState<string | null>(null)

  const visibleDealers = useMemo(() => {
    if (activeArea === null) return dealers
    return dealers.filter((d) => d.area === activeArea)
  }, [dealers, activeArea])

  const hasFilter = dealers.length > 0 && areas.length >= 2

  const salesWhatsAppUrl =
    whatsappDigits.length >= 8
      ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(copy.emptyBody)}`
      : '#'

  if (dealers.length === 0) {
    return (
      <div className="mx-auto flex max-w-[60ch] flex-col items-center text-center">
        <h2 className="font-fraunces text-[clamp(28px,3vw,40px)] font-normal leading-[1.1] tracking-[-0.02em] text-navy">
          {copy.emptyHeadline}
        </h2>
        <p className="mt-6 max-w-[60ch] text-[16px] leading-[1.75] text-ink-muted">
          {copy.emptyBody}
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
          {copy.emptyCtaLabel}
        </a>
      </div>
    )
  }

  return (
    <>
      {hasFilter ? (
        <div className="flex flex-col gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {copy.filterLabel}
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
              {copy.allLabel}
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
        {visibleDealers.map((dealer, i) => (
          <DealerCard
            key={i}
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
  )
}
