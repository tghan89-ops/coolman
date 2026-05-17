import * as React from 'react'
import { cn } from '@/lib/utils'

export interface DealerCardProps {
  name: string
  area: string
  address: string
  whatsappNumber: string
  googleMapsQuery: string
  operatingHours?: string
  languages?: string
  specialisations?: string
  prefilledMessage?: string
  className?: string
}

const DEFAULT_PREFILLED_MESSAGE =
  'Hi, I found you through the Coolman Brotherhood directory.'

function splitCsv(value?: string): string[] {
  if (!value) return []
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function buildWhatsAppUrl(rawNumber: string, message: string): string {
  const digits = rawNumber.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

function buildMapsUrl(query: string): string {
  return `https://www.google.com/maps/?q=${encodeURIComponent(query)}`
}

export function DealerCard({
  name,
  area,
  address,
  whatsappNumber,
  googleMapsQuery,
  operatingHours,
  languages,
  specialisations,
  prefilledMessage,
  className,
}: DealerCardProps) {
  const message = prefilledMessage ?? DEFAULT_PREFILLED_MESSAGE
  const whatsappUrl = buildWhatsAppUrl(whatsappNumber, message)
  const mapsUrl = buildMapsUrl(googleMapsQuery)

  const languageTags = splitCsv(languages)
  const specialisationTags = splitCsv(specialisations)
  const hasMeta =
    operatingHours || languageTags.length > 0 || specialisationTags.length > 0

  return (
    <article
      className={cn(
        'bg-paper border border-rule rounded-lg p-6',
        'flex flex-col gap-5',
        className,
      )}
    >
      <header className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-semibold text-navy leading-tight tracking-tight">
          {name}
        </h2>
        <span className="text-xs uppercase tracking-[0.08em] text-ink-muted font-medium">
          {area}
        </span>
      </header>

      <address className="not-italic text-sm text-ink leading-relaxed whitespace-pre-line">
        {address}
      </address>

      {hasMeta ? (
        <div className="flex flex-col gap-3 pt-1">
          {operatingHours ? (
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-[0.08em] text-ink-faint font-medium">
                Hours
              </span>
              <span className="text-sm text-ink-muted">{operatingHours}</span>
            </div>
          ) : null}

          {languageTags.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.08em] text-ink-faint font-medium">
                Languages
              </span>
              {languageTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-rule bg-white px-2.5 py-0.5 text-xs text-ink"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {specialisationTags.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.08em] text-ink-faint font-medium">
                Specialises in
              </span>
              {specialisationTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-rule bg-white px-2.5 py-0.5 text-xs text-ink"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Message ${name} on WhatsApp`}
          className={cn(
            'inline-flex items-center justify-center gap-2',
            'min-h-[48px] px-4 rounded-md',
            'bg-success text-white text-sm font-medium',
            'transition-opacity duration-150 ease-out',
            'hover:opacity-90 focus-visible:opacity-90',
          )}
        >
          WhatsApp
        </a>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${name} in Google Maps`}
          className={cn(
            'inline-flex items-center justify-center gap-2',
            'min-h-[48px] px-4 rounded-md',
            'bg-accent-dark text-white text-sm font-medium',
            'transition-opacity duration-150 ease-out',
            'hover:opacity-90 focus-visible:opacity-90',
          )}
        >
          Open in Maps
        </a>
      </div>
    </article>
  )
}
