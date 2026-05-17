'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/lib/i18n/context'

export function DeliveryAddressForm({
  initialAddress,
  onSaved,
}: {
  initialAddress: string
  onSaved?: (address: string) => void
}) {
  const { t } = useLanguage()
  const [value, setValue] = useState(initialAddress)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [error, setError] = useState('')

  async function save() {
    setStatus('saving')
    setError('')
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryAddress: value }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus('error')
        setError(data.error ?? 'Failed to save.')
        return
      }
      setStatus('saved')
      onSaved?.(data.deliveryAddress ?? value)
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
      setError('Network error.')
    }
  }

  return (
    <Card className="border-white/10 bg-white/[0.02]">
      <CardHeader>
        <CardTitle className="text-lg text-white">{t.account.deliveryAddress}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Label htmlFor="delivery-address" className="sr-only">{t.account.deliveryAddress}</Label>
        <Textarea
          id="delivery-address"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          maxLength={500}
          className="resize-none border-white/20 bg-white/[0.04] text-white placeholder:text-ink-faint"
          placeholder="Site or office address (max 500 chars)"
        />
        <div className="flex items-center gap-3">
          <Button onClick={save} disabled={status === 'saving' || value === initialAddress}>
            {status === 'saving' ? '…' : t.account.saveAddress}
          </Button>
          {status === 'saved' && <span className="text-sm text-success">{t.account.addressSaved}</span>}
          {status === 'error' && <span className="text-sm text-danger">{error}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
