import * as React from 'react'
import { cn } from '@/lib/utils'

export interface DropCapProps {
  children: string
  className?: string
}

/**
 * Renders a paragraph with a CSS-driven drop-cap on the first letter.
 *
 * Accessibility: the full paragraph text is rendered as a single text node,
 * so screen readers read the paragraph in the natural left-to-right order
 * (including the first letter). The visual drop-cap is purely presentational,
 * applied via the CSS ::first-letter pseudo-element.
 */
export function DropCap({ children, className }: DropCapProps) {
  if (!children || !children.trim()) return null

  return (
    <p
      className={cn(
        'text-base leading-relaxed text-ink',
        '[&::first-letter]:font-fraunces',
        '[&::first-letter]:text-[5rem]',
        '[&::first-letter]:float-left',
        '[&::first-letter]:leading-[0.8]',
        '[&::first-letter]:mr-2',
        '[&::first-letter]:mt-2',
        '[&::first-letter]:text-navy',
        '[&::first-letter]:font-semibold',
        className,
      )}
    >
      {children}
    </p>
  )
}
