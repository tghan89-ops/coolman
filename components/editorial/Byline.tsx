import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BylineProps {
  author: string
  publishedAt: Date | string
  readTimeMin?: number
  className?: string
}

function formatPublishedDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value : ''
  }
  return date.toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function Byline({ author, publishedAt, readTimeMin, className }: BylineProps) {
  const dateLabel = formatPublishedDate(publishedAt)
  const segments = [author, dateLabel]
  if (typeof readTimeMin === 'number' && readTimeMin > 0) {
    segments.push(`${readTimeMin} min read`)
  }

  return (
    <p
      className={cn(
        'text-sm text-ink-muted flex flex-wrap items-center gap-x-2 gap-y-1',
        className,
      )}
    >
      {segments.map((segment, i) => (
        <React.Fragment key={i}>
          {i > 0 ? (
            <span aria-hidden="true" className="text-ink-faint">
              ·
            </span>
          ) : null}
          <span>{segment}</span>
        </React.Fragment>
      ))}
    </p>
  )
}
