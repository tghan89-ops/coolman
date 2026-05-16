'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/lib/i18n/context'

export interface CartAddress {
  id: string | number
  label: string
  addressText: string
  isDefault: boolean
}

interface AddressSelectorProps {
  selectedId: string | number | null
  onSelect: (addr: CartAddress | null) => void
}

export function AddressSelector({ selectedId, onSelect }: AddressSelectorProps) {
  const { t } = useLanguage()
  const a = t.account.addresses

  const [items, setItems] = useState<CartAddress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/account/addresses', { credentials: 'include' })
        const data = await res.json()
        if (cancelled) return
        const list: CartAddress[] = data.addresses ?? []
        setItems(list)
        if (list.length > 0 && (selectedId == null || !list.find((x) => String(x.id) === String(selectedId)))) {
          const def = list.find((x) => x.isDefault) ?? list[0]
          onSelect(def)
        } else if (list.length === 0) {
          onSelect(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold uppercase tracking-widest">
          {t.account.deliveryAddress}
        </Label>
        <Link href="/account" className="text-xs font-semibold text-accent-dark underline">
          {a.edit}
        </Link>
      </div>

      {loading ? (
        <p className="text-xs text-muted-foreground">…</p>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-warn/30 bg-warn/10 px-3 py-2 text-sm">
          <p className="font-semibold text-warn">{a.none}</p>
          <p className="mt-1 text-muted-foreground">
            <Link href="/account" className="font-semibold underline">
              {a.addNew}
            </Link>
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((row) => {
            const checked = String(row.id) === String(selectedId)
            return (
              <li key={row.id}>
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                    checked
                      ? 'border-accent bg-accent/[0.06]'
                      : 'border-border/40 hover:border-accent/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery-address"
                    value={String(row.id)}
                    checked={checked}
                    onChange={() => onSelect(row)}
                    className="mt-1 h-4 w-4 accent-accent"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-ink">{row.label}</span>
                      {row.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-success">
                          <Star className="h-3 w-3" />
                          {a.defaultBadge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 whitespace-pre-line break-words text-sm text-muted-foreground">
                      {row.addressText}
                    </p>
                  </div>
                </label>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
