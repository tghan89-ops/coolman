'use client'

import * as React from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface QuantityStepperProps {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  tone?: 'light' | 'dark'
  className?: string
}

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min
  return Math.min(Math.max(value, min), max)
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 9999,
  step = 1,
  disabled = false,
  tone = 'light',
  className,
}: QuantityStepperProps) {
  const [draft, setDraft] = React.useState<string>(String(value))

  React.useEffect(() => {
    setDraft(String(value))
  }, [value])

  const commit = (next: number) => {
    const clamped = clamp(next, min, max)
    if (clamped !== value) onChange(clamped)
    setDraft(String(clamped))
  }

  const handleDec = () => commit(value - step)
  const handleInc = () => commit(value + step)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '')
    setDraft(raw)
    if (raw === '') return
    const parsed = Number(raw)
    if (!Number.isNaN(parsed)) {
      const clamped = clamp(parsed, min, max)
      if (clamped !== value) onChange(clamped)
    }
  }

  const handleBlur = () => {
    if (draft === '') {
      commit(min)
      return
    }
    const parsed = Number(draft)
    commit(Number.isNaN(parsed) ? min : parsed)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      handleInc()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      handleDec()
    }
  }

  const isDark = tone === 'dark'
  const decDisabled = disabled || value <= min
  const incDisabled = disabled || value >= max

  const buttonBase = cn(
    'inline-flex h-11 w-11 items-center justify-center rounded-sm',
    'border transition-colors duration-150 ease-out',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    isDark
      ? 'border-white/30 text-white hover:bg-white/10'
      : 'border-rule text-navy bg-white hover:border-accent hover:text-accent',
  )

  return (
    <div
      className={cn(
        'inline-flex items-stretch gap-2',
        disabled && 'opacity-60',
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={handleDec}
        disabled={decDisabled}
        className={buttonBase}
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label="Quantity"
        value={draft}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          'h-11 w-16 rounded-sm border text-center font-mono text-base font-semibold',
          'tabular-nums outline-none transition-colors duration-150 ease-out',
          'disabled:cursor-not-allowed',
          'focus:border-accent',
          isDark
            ? 'border-white/30 bg-transparent text-white placeholder:text-white/40'
            : 'border-rule bg-white text-navy',
        )}
      />
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={handleInc}
        disabled={incDisabled}
        className={buttonBase}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
