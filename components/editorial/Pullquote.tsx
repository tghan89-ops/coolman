import * as React from 'react'
import { cn } from '@/lib/utils'

export interface PullquoteProps {
  children: React.ReactNode
  attribution?: string
  className?: string
}

export function Pullquote({ children, attribution, className }: PullquoteProps) {
  return (
    <blockquote
      className={cn(
        'border-l-[3px] border-accent pl-6 my-8',
        className,
      )}
    >
      <p
        className={cn(
          'font-fraunces italic text-accent-light',
          'text-[1.75rem] sm:text-[2rem] lg:text-[2.5rem]',
          'leading-[1.2]',
        )}
      >
        {children}
      </p>
      {attribution ? (
        <footer className="mt-3 text-sm text-ink-muted not-italic">
          {attribution}
        </footer>
      ) : null}
    </blockquote>
  )
}

export type ChineseQuoteKey = 'home' | 'heritage' | 'why-coolman'

export interface ChinesePullquoteProps {
  quote: ChineseQuoteKey
  className?: string
}

const CHINESE_QUOTES: Record<ChineseQuoteKey, string> = {
  home: '不要只卖产品，解决问题',
  heritage: '生意不是比谁跑得久，而是谁撑得久',
  'why-coolman': '工地会告诉你真相',
}

const CHINESE_GLOSSES: Record<ChineseQuoteKey, string> = {
  home: "Don't just sell products, solve problems.",
  heritage: "Business isn't about who runs the longest — it's about who endures.",
  'why-coolman': 'The site will tell you the truth.',
}

export function ChinesePullquote({ quote, className }: ChinesePullquoteProps) {
  const text = CHINESE_QUOTES[quote]
  const gloss = CHINESE_GLOSSES[quote]

  return (
    <figure
      lang="zh"
      className={cn('text-center py-20 lg:py-28', className)}
    >
      {/* Rule above — signals intentional pause before the reader hits the characters */}
      <div className="mx-auto mb-10 h-px w-12 bg-rule" />
      <p
        className={cn(
          'font-chinese text-navy leading-[1.15] tracking-[0.06em]',
          'text-[clamp(2.25rem,6.5vw,5.5rem)]',
        )}
      >
        {text}
      </p>
      <figcaption className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
        {gloss}
      </figcaption>
      {/* Rule below — closes the pause */}
      <div className="mx-auto mt-10 h-px w-12 bg-rule" />
    </figure>
  )
}
