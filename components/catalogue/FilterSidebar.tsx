'use client'

import * as React from 'react'
import { ChevronDown, X } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

// Long groups (Application has 22 values) collapse to this many rows + a
// "Show all" toggle, so no single group can wall off the panel.
const VISIBLE_CAP = 7

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
  /** Localized "Show all ({count})" / "Show less" for long-group toggles. */
  showAllLabel?: string
  showLessLabel?: string
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
  showAllLabel = 'Show all ({count})',
  showLessLabel = 'Show less',
  className,
}: FilterSidebarProps) {
  const totalSelected = React.useMemo(
    () => Object.values(selected).reduce((sum, list) => sum + list.length, 0),
    [selected],
  )

  // Accordion + "show all" UI state. Undefined = use the default rule (first
  // group open, plus any group with an active selection); an explicit boolean
  // means the user toggled it and we respect that.
  const firstKey = groups[0]?.key
  const [openOverride, setOpenOverride] = React.useState<Record<string, boolean>>({})
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})
  const isGroupOpen = (key: string, activeCount: number) =>
    openOverride[key] ?? (key === firstKey || activeCount > 0)

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
              'text-accent hover:opacity-80 transition-opacity duration-150 ease-out',
            )}
          >
            <X className="h-3 w-3" />
            Clear ({totalSelected})
          </button>
        )}
      </div>

      <div className="flex flex-col">
        {groups.map((group, idx) => {
          const sel = selected[group.key] ?? []
          const activeCount = sel.length
          const open = isGroupOpen(group.key, activeCount)
          // Pin selected options to the top so a ticked value is never hidden
          // under "Show all"; otherwise preserve the server order.
          const ordered = [...group.options].sort(
            (a, b) => (sel.includes(a.value) ? 0 : 1) - (sel.includes(b.value) ? 0 : 1),
          )
          const showToggle = ordered.length > VISIBLE_CAP
          const isExpanded = expanded[group.key] ?? false
          const visible = showToggle && !isExpanded ? ordered.slice(0, VISIBLE_CAP) : ordered
          return (
            <div key={group.key} className={cn(idx > 0 && 'border-t border-rule')}>
              <button
                type="button"
                onClick={() => setOpenOverride((o) => ({ ...o, [group.key]: !open }))}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-2 py-3 text-left"
              >
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-navy">
                  {group.label}
                  {!open && activeCount > 0 && (
                    <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[10px] font-semibold text-white">
                      {activeCount}
                    </span>
                  )}
                </span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-ink-muted transition-transform duration-150 ease-out',
                    open && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </button>
              {open && (
                <div className="pb-3">
                  <ul className="flex flex-col gap-1">
                    {visible.map((option) => {
                      const isChecked = sel.includes(option.value)
                      const id = `${group.key}-${option.value}`
                      // Faceting: a 0-match option is greyed and non-interactive
                      // unless already checked, so it can always be unticked.
                      const isDisabled = option.count === 0 && !isChecked
                      return (
                        <li key={option.value}>
                          <label
                            htmlFor={id}
                            aria-disabled={isDisabled}
                            className={cn(
                              'flex min-h-11 items-center gap-3 rounded-sm px-1',
                              'transition-colors duration-150 ease-out',
                              isDisabled
                                ? 'cursor-not-allowed opacity-40'
                                : 'cursor-pointer hover:bg-paper',
                            )}
                          >
                            <Checkbox
                              id={id}
                              checked={isChecked}
                              disabled={isDisabled}
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
                  {showToggle && (
                    <button
                      type="button"
                      onClick={() => setExpanded((e) => ({ ...e, [group.key]: !isExpanded }))}
                      className="mt-1 px-1 text-xs font-semibold text-accent transition-opacity duration-150 ease-out hover:opacity-80"
                    >
                      {isExpanded ? showLessLabel : showAllLabel.replace('{count}', String(ordered.length))}
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
