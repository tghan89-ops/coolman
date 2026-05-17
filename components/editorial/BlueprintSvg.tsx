import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BlueprintSvgProps {
  children: React.ReactNode
  caption?: string
  className?: string
}

export function BlueprintSvg({ children, caption, className }: BlueprintSvgProps) {
  return (
    <figure
      className={cn(
        'relative bg-white border border-rule rounded-lg p-4 sm:p-6',
        className,
      )}
    >
      <div className="flex items-center justify-center">{children}</div>
      {caption ? (
        <figcaption
          className={cn(
            'absolute bottom-3 right-3 bg-white border border-ink-muted',
            'px-2 py-1 text-[11px] font-mono text-ink-muted leading-none tracking-tight',
          )}
        >
          DWG · {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
