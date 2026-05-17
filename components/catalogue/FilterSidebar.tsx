'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export interface FilterOption {
  value: string
  label: string
  count: number
}

export interface FilterGroup {
  key: string
  label: string
  options: FilterOption[]
}

export interface FilterSidebarProps {
  groups: FilterGroup[]
  selected: Record<string, string[]>
  onChange: (selected: Record<string, string[]>) => void
  onClear?: () => void
  searchLogDebounceMs?: number
  searchLogEndpoint?: string
  className?: string
}

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export function FilterSidebar({
  groups,
  selected,
  onChange,
  onClear,
  searchLogDebounceMs = 800,
  searchLogEndpoint = '/api/search-log',
  className,
}: FilterSidebarProps) {
  const totalSelected = React.useMemo(
    () => Object.values(selected).reduce((sum, list) => sum + list.length, 0),
    [selected],
  )

  // Fire-and-forget search-log ping on filter change. Debounced so a user
  // rapidly ticking three boxes triggers one log entry, not three.
  const debounceTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastFiredSignature = React.useRef<string>('')

  React.useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    debounceTimer.current = setTimeout(() => {
      const signature = JSON.stringify(selected)
      if (signature === lastFiredSignature.current) return
      lastFiredSignature.current = signature

      // Compose a synthetic query string from selected filter values so the
      // log row reads "tier=A,B; material=concrete" — easier for Alan to scan
      // than raw JSON.
      const queryParts: string[] = []
      for (const [key, values] of Object.entries(selected)) {
        if (values.length === 0) continue
        queryParts.push(`${key}=${values.join(',')}`)
      }
      const query = queryParts.join('; ')

      if (!query) return

      // Fire and forget — never block UI on logging.
      fetch(searchLogEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, resultCount: 0 }),
        keepalive: true,
      }).catch(() => {
        /* swallow — analytics must never break catalogue */
      })
    }, searchLogDebounceMs)

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [selected, searchLogDebounceMs, searchLogEndpoint])

  const handleToggle = (groupKey: string, value: string) => {
    const current = selected[groupKey] ?? []
    onChange({ ...selected, [groupKey]: toggleValue(current, value) })
  }

  const handleClear = () => {
    if (onClear) {
      onClear()
      return
    }
    const cleared: Record<string, string[]> = {}
    for (const group of groups) cleared[group.key] = []
    onChange(cleared)
  }

  return (
    <aside
      className={cn(
        'flex flex-col gap-6 rounded-md border border-rule bg-white p-6',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-navy">
          Filters
        </h3>
        {totalSelected > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              'inline-flex items-center gap-1 text-xs font-semibold',
              'text-accent-dark hover:text-accent transition-colors duration-150 ease-out',
            )}
          >
            <X className="h-3 w-3" />
            Clear ({totalSelected})
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {groups.map((group, idx) => (
          <React.Fragment key={group.key}>
            {idx > 0 && <div className="border-t border-rule" />}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-navy">
                {group.label}
              </h4>
              <ul className="flex flex-col gap-2">
                {group.options.map((option) => {
                  const isChecked = (selected[group.key] ?? []).includes(option.value)
                  const id = `${group.key}-${option.value}`
                  return (
                    <li key={option.value}>
                      <label
                        htmlFor={id}
                        className={cn(
                          'flex min-h-11 cursor-pointer items-center gap-3 rounded-sm px-1',
                          'hover:bg-paper transition-colors duration-150 ease-out',
                        )}
                      >
                        <Checkbox
                          id={id}
                          checked={isChecked}
                          onCheckedChange={() => handleToggle(group.key, option.value)}
                          className="border-rule data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                        />
                        <span className="flex-1 text-sm text-ink">{option.label}</span>
                        <span className="font-mono text-xs text-ink-muted">
                          ({option.count})
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          </React.Fragment>
        ))}
      </div>
    </aside>
  )
}
