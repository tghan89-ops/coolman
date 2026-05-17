import * as React from 'react'
import { cn } from '@/lib/utils'

export interface HeritageTimelineEntryProps {
  year: string
  /** Title of the event (was the only line in the legacy single-string layout). */
  event: string
  /** Optional Bahasa Malaysia mirror of `event`. Kept for backward compatibility;
   * new pages should drive language via the i18n context instead of passing this. */
  eventBM?: string
  /** Optional narrative body shown below the title. */
  body?: string
  /** Optional italic helper text (e.g. "Alan to supply year"). */
  note?: string
  isHighlight?: boolean
  className?: string
}

export function HeritageTimelineEntry({
  year,
  event,
  eventBM,
  body,
  note,
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
      <div className="flex flex-col gap-2">
        <p
          className={cn(
            'text-base sm:text-[1.0625rem] leading-relaxed',
            isHighlight ? 'text-navy font-medium' : 'text-navy',
          )}
        >
          {event}
        </p>
        {eventBM ? (
          <p className="text-sm text-ink-faint leading-relaxed">{eventBM}</p>
        ) : null}
        {body ? (
          <p className="text-[15px] leading-[1.65] text-ink-muted">{body}</p>
        ) : null}
        {note ? (
          <p className="font-fraunces italic text-[13px] leading-snug text-ink-faint">
            {note}
          </p>
        ) : null}
      </div>
    </div>
  )
}
