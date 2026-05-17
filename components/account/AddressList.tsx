'use client'

import { useEffect, useState } from 'react'
import { Plus, Star, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/lib/i18n/context'

export interface AddressRow {
  id: string | number
  label: string
  addressText: string
  isDefault: boolean
  updatedAt?: string
}

interface AddressListProps {
  onChanged?: () => void
}

const CAP = 5

export function AddressList({ onChanged }: AddressListProps) {
  const { t } = useLanguage()
  const a = t.account.addresses

  const [items, setItems] = useState<AddressRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | number | null>(null)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/account/addresses', { credentials: 'include' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'load_failed')
      setItems(data.addresses ?? [])
    } catch (e: any) {
      setError(e?.message ?? 'load_failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function notify() {
    onChanged?.()
  }

  async function create(form: { label: string; addressText: string; isDefault: boolean }) {
    const res = await fetch('/api/account/addresses', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'create_failed')
    await load()
    notify()
  }

  async function update(id: string | number, patch: Partial<AddressRow>) {
    const res = await fetch(`/api/account/addresses/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'update_failed')
    await load()
    notify()
  }

  async function remove(id: string | number) {
    if (!confirm(a.confirmDelete)) return
    const res = await fetch(`/api/account/addresses/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'delete_failed')
    await load()
    notify()
  }

  const atCap = items.length >= CAP

  return (
    <Card className="border-white/10 bg-white/[0.02]">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <CardTitle className="text-lg text-white">{a.title}</CardTitle>
        <Button
          type="button"
          size="sm"
          disabled={adding || atCap}
          onClick={() => setAdding(true)}
          className="bg-accent text-white hover:opacity-90"
        >
          <Plus className="mr-1 h-4 w-4" />
          {a.addNew}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <div className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </div>
        )}

        {atCap && !adding && (
          <p className="text-xs text-ink-muted">{a.atCap}</p>
        )}

        {adding && (
          <AddressForm
            onCancel={() => setAdding(false)}
            onSubmit={async (form) => {
              try {
                await create({ ...form, isDefault: items.length === 0 ? true : form.isDefault })
                setAdding(false)
              } catch (e: any) {
                const msg = String(e?.message ?? '')
                setError(msg === 'address_cap_reached' ? a.atCap : msg)
              }
            }}
            allowDefaultToggle={items.length > 0}
          />
        )}

        {loading ? (
          <p className="text-sm text-ink-muted">…</p>
        ) : items.length === 0 && !adding ? (
          <p className="text-sm text-ink-muted">{a.none}</p>
        ) : (
          <ul className="space-y-2">
            {items.map((row) => (
              <li key={row.id}>
                {editingId === row.id ? (
                  <AddressForm
                    initial={{ label: row.label, addressText: row.addressText, isDefault: row.isDefault }}
                    onCancel={() => setEditingId(null)}
                    allowDefaultToggle={!row.isDefault}
                    onSubmit={async (form) => {
                      try {
                        await update(row.id, form)
                        setEditingId(null)
                      } catch (e: any) {
                        setError(String(e?.message ?? ''))
                      }
                    }}
                  />
                ) : (
                  <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-semibold text-white">{row.label}</p>
                          {row.isDefault && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-success">
                              <Star className="h-3 w-3" />
                              {a.defaultBadge}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 whitespace-pre-line break-words text-sm text-ink-muted">
                          {row.addressText}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {!row.isDefault && (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-9 px-2 text-xs text-white hover:bg-white/10"
                            onClick={() =>
                              update(row.id, { isDefault: true }).catch((e) =>
                                setError(String(e?.message ?? '')),
                              )
                            }
                          >
                            {a.setDefault}
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          aria-label={a.edit}
                          className="h-9 w-9 text-white hover:bg-white/10"
                          onClick={() => setEditingId(row.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          aria-label={a.delete}
                          className="h-9 w-9 text-white hover:bg-danger/20 hover:text-danger"
                          onClick={() => remove(row.id).catch((e) => setError(String(e?.message ?? '')))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

function AddressForm({
  initial,
  onCancel,
  onSubmit,
  allowDefaultToggle,
}: {
  initial?: { label: string; addressText: string; isDefault: boolean }
  onCancel: () => void
  onSubmit: (form: { label: string; addressText: string; isDefault: boolean }) => Promise<void>
  allowDefaultToggle: boolean
}) {
  const { t } = useLanguage()
  const a = t.account.addresses
  const [label, setLabel] = useState(initial?.label ?? '')
  const [addressText, setAddressText] = useState(initial?.addressText ?? '')
  const [isDefault, setIsDefault] = useState(initial?.isDefault ?? false)
  const [saving, setSaving] = useState(false)

  const canSave = label.trim().length > 0 && addressText.trim().length > 0 && !saving

  return (
    <div className="rounded-lg border border-accent/30 bg-accent/[0.06] p-4">
      <div className="space-y-3">
        <div>
          <Label htmlFor="addr-label" className="text-xs font-semibold uppercase tracking-widest text-white">
            {a.label}
          </Label>
          <Input
            id="addr-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={40}
            placeholder={a.labelPlaceholder}
            className="mt-1 border-white/20 bg-white/[0.04] text-white placeholder:text-ink-faint"
          />
        </div>
        <div>
          <Label htmlFor="addr-text" className="text-xs font-semibold uppercase tracking-widest text-white">
            {t.account.deliveryAddress}
          </Label>
          <Textarea
            id="addr-text"
            value={addressText}
            onChange={(e) => setAddressText(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder={a.addressPlaceholder}
            className="mt-1 resize-none border-white/20 bg-white/[0.04] text-white placeholder:text-ink-faint"
          />
        </div>
        {allowDefaultToggle && (
          <label className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            {a.setDefault}
          </label>
        )}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            disabled={!canSave}
            onClick={async () => {
              setSaving(true)
              try {
                await onSubmit({ label: label.trim(), addressText: addressText.trim(), isDefault })
              } finally {
                setSaving(false)
              }
            }}
            className="bg-accent text-white hover:opacity-90"
          >
            {saving ? '…' : a.save}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onCancel}
            className="text-white hover:bg-white/10"
          >
            {a.cancel}
          </Button>
        </div>
      </div>
    </div>
  )
}
