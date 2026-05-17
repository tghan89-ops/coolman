import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface HeritageBadgeProps {
  className?: string
}

const FOUNDING_YEAR = 2007

export function HeritageBadge({ className }: HeritageBadgeProps) {
  const years = new Date().getFullYear() - FOUNDING_YEAR

  return (
    <Link
      href="/heritage"
      className={cn(
        'inline-flex items-center gap-2 rounded-full',
        'border border-rule bg-paper',
        'px-3 py-1.5 min-h-[44px]',
        'transition-colors duration-150 ease-out',
        'hover:border-accent focus-visible:border-accent',
        className,
      )}
    >
      <span className="text-sm font-semibold text-navy">Coolman</span>
      <span aria-hidden className="text-ink-faint">
        ·
      </span>
      <span className="font-mono text-xs text-ink-muted">
        since {FOUNDING_YEAR}
      </span>
      <span aria-hidden className="text-ink-faint">
        ·
      </span>
      <span className="font-mono text-xs text-ink-muted">{years} years</span>
    </Link>
  )
}
