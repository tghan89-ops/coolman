'use client'

import { useField } from '@payloadcms/ui'
import { useState, useRef } from 'react'

const WARN_ABOVE = 0.30

export function TierDiscountField({ path }: { path: string }) {
  const { value, setValue, showError } = useField<number>({ path })
  const [pendingValue, setPendingValue] = useState<number | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const displayValue = value ?? 0

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const num = parseFloat(e.target.value) || 0
    if (num > WARN_ABOVE) {
      setPendingValue(num)
      setShowConfirm(true)
    } else {
      setValue(num)
    }
  }

  function handleConfirm() {
    if (pendingValue !== null) setValue(pendingValue)
    setShowConfirm(false)
    setPendingValue(null)
  }

  function handleCancel() {
    setShowConfirm(false)
    setPendingValue(null)
    if (inputRef.current) inputRef.current.value = String(displayValue)
  }

  return (
    <div className="field-type number">
      <label className="field-label">
        Tier Discount (decimal — 0.05 = 5%)
      </label>
      <input
        ref={inputRef}
        type="number"
        step="0.01"
        min="0"
        max="1"
        defaultValue={displayValue}
        onChange={handleChange}
        className="field-input"
        style={{
          width: '100%',
          padding: '8px',
          fontSize: '14px',
          border: showError ? '1px solid red' : '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
      <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
        Admin-only. 0.05 = 5% permanent discount.
      </p>

      {showConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tier-confirm-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)',
          }}
        >
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '420px',
            width: '90%',
          }}>
            <h2 id="tier-confirm-title" style={{ marginTop: 0, fontSize: '18px' }}>
              ⚠️ High discount — are you sure?
            </h2>
            <p style={{ color: '#444', lineHeight: 1.5 }}>
              You are setting a permanent tier discount of{' '}
              <strong>{((pendingValue ?? 0) * 100).toFixed(0)}%</strong>.
              This is above the warning threshold of {(WARN_ABOVE * 100).toFixed(0)}%.
              This discount applies to every order this contractor places.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '20px',
              justifyContent: 'flex-end',
            }}>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  background: '#dc2626',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Yes, set {((pendingValue ?? 0) * 100).toFixed(0)}% discount
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
