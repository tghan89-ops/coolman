import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ChannelCardProps {
  icon: React.ReactNode
  label: string
  value: string
  href: string
  ariaLabel?: string
  className?: string
}

export function ChannelCard({
  icon,
  label,
  value,
  href,
  ariaLabel,
  className,
}: ChannelCardProps) {
  const isExternal = /^(https?:|mailto:|tel:)/.test(href)

  return (
    <a
      href={href}
      aria-label={ariaLabel ?? `${label}: ${value}`}
      {...(isExternal && href.startsWith('http')
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      className={cn(
        'hover-card group block bg-paper border border-rule rounded-lg',
        'p-6 min-h-[48px]',
        'flex flex-col gap-3',
        className,
      )}
    >
      <div className="w-8 h-8 flex items-center justify-center text-navy">
        {icon}
      </div>
      <span className="text-xs uppercase tracking-[0.08em] text-ink-muted font-medium">
        {label}
      </span>
      <span className="text-lg sm:text-xl text-navy font-medium leading-snug">
        {value}
      </span>
    </a>
  )
}
