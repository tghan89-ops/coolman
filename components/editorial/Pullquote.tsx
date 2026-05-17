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

export function ChinesePullquote({ quote, className }: ChinesePullquoteProps) {
  const text = CHINESE_QUOTES[quote]

  return (
    <blockquote
      lang="zh"
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
        {text}
      </p>
    </blockquote>
  )
}
