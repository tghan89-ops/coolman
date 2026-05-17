import * as React from 'react'
import { cn } from '@/lib/utils'

export interface DataStripCell {
  value: string
  label?: string
}

export interface DataStripProps {
  cells: DataStripCell[]
  className?: string
}

export function DataStrip({ cells, className }: DataStripProps) {
  if (!cells || cells.length === 0) return null

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row border border-rule rounded-lg overflow-hidden bg-white',
        className,
      )}
    >
      {cells.map((cell, i) => {
        const isLast = i === cells.length - 1
        return (
          <div
            key={i}
            className={cn(
              'flex-1 px-4 py-5 sm:px-6 sm:py-6 flex flex-col gap-2 items-start',
              !isLast && 'border-b sm:border-b-0 sm:border-r border-rule',
            )}
          >
            <span
              className={cn(
                'font-mono text-navy leading-none',
                'text-[2.25rem] sm:text-[2.5rem] lg:text-[3rem]',
                'tracking-tight',
              )}
            >
              {cell.value}
            </span>
            {cell.label ? (
              <span className="text-xs uppercase tracking-[0.08em] text-ink-muted font-medium">
                {cell.label}
              </span>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
