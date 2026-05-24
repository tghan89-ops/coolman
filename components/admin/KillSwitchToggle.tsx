'use client'
// Admin kill-switch widget — shown at the top of the Payload dashboard.
// Toggling requires an AlertDialog confirmation so a pocket-tap can't
// accidentally pause or resume order intake.
import { useState, useEffect, useCallback } from 'react'

const KILL_SWITCH_BANNER_TEXT =
  'Orders are paused right now. Reach us on WhatsApp to place a request.'

export default function KillSwitchToggle() {
  const [isPaused, setIsPaused] = useState<boolean | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/globals/settings?depth=0', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setIsPaused(!!d.orders_paused))
      .catch(() => {})
  }, [])

  const confirmToggle = useCallback(async () => {
    setLoading(true)
    setDialogOpen(false)
    try {
      const res = await fetch('/api/globals/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders_paused: !isPaused }),
        credentials: 'include',
      })
      if (res.ok) {
        const next = !isPaused
        setIsPaused(next)
        setToast(
          next
            ? 'Kill switch ON — orders are now paused. Contractors cannot submit.'
            : 'Kill switch OFF — orders are live again.',
        )
        setTimeout(() => setToast(null), 6000)
      } else {
        setToast('Failed to update — check your connection and try again.')
        setTimeout(() => setToast(null), 6000)
      }
    } finally {
      setLoading(false)
    }
  }, [isPaused])

  if (isPaused === null) return null

  const isLive = !isPaused

  const wrapStyle: React.CSSProperties = {
    marginBottom: 24,
    padding: '14px 18px',
    borderRadius: 8,
    border: `1px solid ${isPaused ? 'var(--theme-error-400, #F87171)' : 'var(--theme-success-400, #34D399)'}`,
    background: isPaused
      ? 'var(--theme-error-50, #FEF2F2)'
      : 'var(--theme-success-50, #F0FDF4)',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap' as const,
  }

  const statusStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    fontSize: 14,
    color: isPaused
      ? 'var(--theme-error-700, #B91C1C)'
      : 'var(--theme-success-700, #15803D)',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    opacity: 0.75,
    flex: 1,
  }

  const btnStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer',
    fontSize: 13,
    fontWeight: 600,
    background: isPaused ? 'var(--theme-success-600, #16A34A)' : 'var(--theme-error-600, #DC2626)',
    color: '#fff',
    opacity: loading ? 0.6 : 1,
  }

  return (
    <>
      <div style={wrapStyle}>
        <span style={statusStyle}>{isPaused ? 'ORDERS PAUSED' : 'ORDERS LIVE'}</span>
        <span style={labelStyle}>
          {isPaused
            ? 'Contractors cannot submit orders. The banner is live on the site.'
            : 'Order intake is open. Contractors can submit normally.'}
        </span>
        <button style={btnStyle} disabled={loading} onClick={() => setDialogOpen(true)}>
          {isPaused ? 'Resume orders' : 'Pause orders'}
        </button>
      </div>

      {toast && (
        <div
          style={{
            marginBottom: 16,
            padding: '10px 16px',
            borderRadius: 6,
            background: 'var(--theme-elevation-100, #f5f5f5)',
            fontSize: 13,
            border: '1px solid var(--theme-elevation-200, #e0e0e0)',
          }}
        >
          {toast}
        </div>
      )}

      {dialogOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ks-dialog-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Backdrop */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
            }}
            onClick={() => setDialogOpen(false)}
          />

          {/* Dialog */}
          <div
            style={{
              position: 'relative',
              background: 'var(--theme-elevation-0, #fff)',
              borderRadius: 10,
              padding: 28,
              maxWidth: 480,
              width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            }}
          >
            <h2
              id="ks-dialog-title"
              style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}
            >
              {isLive ? 'Pause order intake?' : 'Resume order intake?'}
            </h2>

            <p style={{ fontSize: 13, margin: '0 0 16px', opacity: 0.75 }}>
              {isLive
                ? 'This will immediately show the following banner to all contractors on the site:'
                : 'This will remove the pause banner and allow contractors to submit orders again.'}
            </p>

            {isLive && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 6,
                  border: '1px solid #FCD34D',
                  background: '#FFFBEB',
                  fontSize: 13,
                  marginBottom: 20,
                  color: '#92400E',
                }}
              >
                <strong>Banner contractors will see:</strong>
                <br />
                {KILL_SWITCH_BANNER_TEXT}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDialogOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px solid var(--theme-elevation-200, #ccc)',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmToggle}
                style={{
                  padding: '8px 20px',
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 700,
                  background: isLive
                    ? 'var(--theme-error-600, #DC2626)'
                    : 'var(--theme-success-600, #16A34A)',
                  color: '#fff',
                }}
              >
                {isLive ? 'Yes, pause orders' : 'Yes, resume orders'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
