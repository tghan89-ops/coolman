import * as React from 'react'
import { cn } from '@/lib/utils'

export interface HeritageTimelineEntryProps {
  year: string
  event: string
  eventBM?: string
  isHighlight?: boolean
  className?: string
}

export function HeritageTimelineEntry({
  year,
  event,
  eventBM,
  isHighlight = false,
  className,
}: HeritageTimelineEntryProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-[6rem_1fr] sm:grid-cols-[8rem_1fr] gap-6 sm:gap-10 py-6 border-b border-rule',
        isHighlight && 'border-l-2 border-l-accent pl-4 sm:pl-6',
        className,
      )}
    >
      <div
        className={cn(
          'font-mono leading-none tracking-tight',
          'text-[1.5rem] sm:text-[2rem]',
          isHighlight ? 'text-accent' : 'text-navy',
        )}
      >
        {year}
      </div>
      <div className="flex flex-col gap-1">
        <p
          className={cn(
            'text-base sm:text-[1.0625rem] leading-relaxed',
            isHighlight ? 'text-navy font-medium' : 'text-ink-muted',
          )}
        >
          {event}
        </p>
        {eventBM ? (
          <p className="text-sm text-ink-faint leading-relaxed">{eventBM}</p>
        ) : null}
      </div>
    </div>
  )
}
