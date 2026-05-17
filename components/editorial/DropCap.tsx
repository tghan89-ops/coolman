import * as React from 'react'
import { cn } from '@/lib/utils'

export interface DropCapProps {
  children: string
  className?: string
}

export function DropCap({ children, className }: DropCapProps) {
  if (!children || !children.trim()) return null

  const trimmed = children.trimStart()
  const firstChar = trimmed.charAt(0)
  const rest = trimmed.slice(1)

  return (
    <p className={cn('text-base leading-relaxed text-ink', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'font-fraunces float-left text-navy',
          'mr-3 mt-1',
        )}
        style={{
          fontSize: '4rem',
          lineHeight: 1,
          fontWeight: 600,
        }}
      >
        {firstChar}
      </span>
      {rest}
    </p>
  )
}
