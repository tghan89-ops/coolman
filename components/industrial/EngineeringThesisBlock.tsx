import * as React from 'react'
import { cn } from '@/lib/utils'

export interface EngineeringThesisBlockProps {
  heading: string
  body: React.ReactNode
  blueprint: React.ReactNode
  blueprintCaption?: string
  imagePosition?: 'left' | 'right'
  className?: string
}

export function EngineeringThesisBlock({
  heading,
  body,
  blueprint,
  blueprintCaption,
  imagePosition = 'right',
  className,
}: EngineeringThesisBlockProps) {
  const blueprintFigure = (
    <figure
      className={cn(
        'bg-paper border border-rule rounded-lg p-4 sm:p-6',
        'flex flex-col gap-3',
      )}
    >
      <div className="flex items-center justify-center">{blueprint}</div>
      {blueprintCaption ? (
        <figcaption className="text-[11px] font-mono text-ink-muted tracking-tight leading-snug">
          {blueprintCaption}
        </figcaption>
      ) : null}
    </figure>
  )

  const textColumn = (
    <div className="flex flex-col gap-4 sm:gap-5">
      <h2
        className={cn(
          'font-fraunces text-navy tracking-tight',
          'text-[2rem] sm:text-[2.25rem] lg:text-[2.5rem]',
          'leading-[1.15]',
        )}
      >
        {heading}
      </h2>
      <div className="text-ink leading-[1.6] text-base sm:text-[1.0625rem]">
        {body}
      </div>
    </div>
  )

  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center',
        className,
      )}
    >
      {imagePosition === 'left' ? (
        <>
          <div className="order-1">{blueprintFigure}</div>
          <div className="order-2">{textColumn}</div>
        </>
      ) : (
        <>
          <div className="order-2 md:order-1">{textColumn}</div>
          <div className="order-1 md:order-2">{blueprintFigure}</div>
        </>
      )}
    </div>
  )
}
