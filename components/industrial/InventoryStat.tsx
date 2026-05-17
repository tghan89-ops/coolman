import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InventoryStatProps {
  value: string
  label: string
  className?: string
}

export function InventoryStat({ value, label, className }: InventoryStatProps) {
  return (
    <div className={cn('flex flex-col gap-2 items-start', className)}>
      <span
        className={cn(
          'font-mono text-navy leading-none tracking-tight',
          'text-[2.25rem] sm:text-[2.5rem] lg:text-[3rem]',
        )}
      >
        {value}
      </span>
      <span className="text-xs uppercase tracking-[0.08em] text-ink-muted font-medium">
        {label}
      </span>
    </div>
  )
}
