import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ComparisonAxisProps {
  leftLabel: string
  rightLabel: string
  leftValue?: string
  rightValue?: string
  position: number
  className?: string
}

export function ComparisonAxis({
  leftLabel,
  rightLabel,
  leftValue,
  rightValue,
  position,
  className,
}: ComparisonAxisProps) {
  const clamped = Math.max(0, Math.min(1, position))
  const percent = `${clamped * 100}%`

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-end justify-between gap-4 mb-3">
        <div className="flex flex-col gap-1 max-w-[40%]">
          <span className="text-xs uppercase tracking-[0.08em] text-ink-muted font-medium">
            {leftLabel}
          </span>
          {leftValue ? (
            <span className="text-sm text-navy">{leftValue}</span>
          ) : null}
        </div>
        <div className="flex flex-col gap-1 max-w-[40%] items-end text-right">
          <span className="text-xs uppercase tracking-[0.08em] text-ink-muted font-medium">
            {rightLabel}
          </span>
          {rightValue ? (
            <span className="text-sm text-navy">{rightValue}</span>
          ) : null}
        </div>
      </div>

      <div className="relative h-6 flex items-center">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-rule" />
        <span
          aria-hidden
          className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-rule border border-rule"
        />
        <span
          aria-hidden
          className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-rule border border-rule"
        />
        <span
          aria-hidden
          className="absolute top-1/2 w-3 h-3 rounded-full bg-accent ring-2 ring-paper"
          style={{ left: percent, transform: 'translate(-50%, -50%)' }}
        />
      </div>
    </div>
  )
}
