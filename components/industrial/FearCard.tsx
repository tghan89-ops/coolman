import * as React from 'react'
import { cn } from '@/lib/utils'

export interface FearCardProps {
  icon: React.ReactNode
  title: string
  body: string
  className?: string
}

export function FearCard({ icon, title, body, className }: FearCardProps) {
  return (
    <div
      className={cn(
        'bg-paper border border-rule rounded-lg p-6',
        'flex flex-col gap-3',
        className,
      )}
    >
      <div
        aria-hidden
        className="w-8 h-8 flex items-center justify-center text-navy"
      >
        {icon}
      </div>
      <h3 className="text-[1.125rem] font-semibold text-navy leading-snug">
        {title}
      </h3>
      <p className="text-sm text-ink-muted leading-relaxed">{body}</p>
    </div>
  )
}
