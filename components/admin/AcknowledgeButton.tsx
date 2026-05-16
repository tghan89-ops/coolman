'use client'

import { useDocumentInfo, useFormFields } from '@payloadcms/ui'
import { useState } from 'react'

export function AcknowledgeButton() {
  const { id } = useDocumentInfo()
  const status = useFormFields(([fields]) => fields?.order_status?.value as string | undefined)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!id) {
    return (
      <div className="field-type ui" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 12, opacity: 0.7 }}>Save the order first to acknowledge it.</p>
      </div>
    )
  }

  if (status !== 'pending' || done) {
    return (
      <div className="field-type ui" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 13 }}>
          {status === 'acknowledged' || done ? '✓ Acknowledged' : `Status: ${status}`}
        </p>
      </div>
    )
  }

  async function acknowledge() {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/orders/${id}/acknowledge`, { method: 'POST', credentials: 'include' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Could not acknowledge')
      }
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not acknowledge')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="field-type ui" style={{ marginBottom: 16 }}>
      <button
        type="button"
        onClick={acknowledge}
        disabled={busy}
        style={{
          width: '100%',
          height: 44,
          borderRadius: 6,
          border: 'none',
          background: busy ? '#94a3b8' : '#3B82F6',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          cursor: busy ? 'default' : 'pointer',
        }}
      >
        {busy ? 'Acknowledging…' : 'Acknowledge order'}
      </button>
      <p style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
        Marks this order acknowledged and stamps the time. Does not affect the order kill switch.
      </p>
      {error && <p style={{ fontSize: 12, color: '#B91C1C', marginTop: 4 }}>{error}</p>}
    </div>
  )
}
