import { cn } from '@/lib/utils'

export interface KillSwitchBannerProps {
  isPaused: boolean
  whatsappNumber?: string
  message?: string
  className?: string
}

function toWaLink(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, '')
  if (!digits) return null
  return `https://wa.me/${digits}`
}

export function KillSwitchBanner({
  isPaused,
  whatsappNumber,
  message,
  className,
}: KillSwitchBannerProps) {
  if (!isPaused) return null

  const copy =
    message ?? 'Orders are paused right now. Please reach us on WhatsApp to place a request.'
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
            Message us on WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}
