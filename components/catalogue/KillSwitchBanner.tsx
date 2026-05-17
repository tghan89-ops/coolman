import { cn } from '@/lib/utils'
import { COPY, type Language } from '@/lib/i18n/copy'

export interface KillSwitchBannerProps {
  isPaused: boolean
  whatsappNumber?: string
  /** Optional override. When omitted, falls back to the i18n value for `language`. */
  message?: string
  /** Drives the i18n fallback for both message and CTA. Defaults to EN. */
  language?: Language
  className?: string
}

// Exported so tests (and other server callers) can convert a raw whatsapp
// number into a wa.me link without re-implementing the digit-strip rule.
export function toWaLink(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, '')
  if (!digits) return null
  return `https://wa.me/${digits}`
}

export function KillSwitchBanner({
  isPaused,
  whatsappNumber,
  message,
  language = 'EN',
  className,
}: KillSwitchBannerProps) {
  if (!isPaused) return null

  const killSwitchCopy = COPY[language].killSwitch
  const copy = message ?? killSwitchCopy.message
  const waLink = whatsappNumber ? toWaLink(whatsappNumber) : null

  return (
    <div
      role="status"
      className={cn(
        'w-full border-y border-warn/30 bg-warn/10 text-ink',
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-12">
        <p className="text-sm font-medium">{copy}</p>
        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex h-11 items-center justify-center gap-2 self-start rounded-md px-4',
              'bg-navy text-white text-sm font-semibold',
              'hover:bg-navy-light transition-colors duration-150 ease-out',
              'sm:self-auto',
            )}
          >
            {killSwitchCopy.ctaLabel}
          </a>
        )}
      </div>
    </div>
  )
}
