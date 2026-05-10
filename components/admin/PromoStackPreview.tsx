'use client'

import { useFormFields } from '@payloadcms/ui'

const EXAMPLE_TIERS = [
  { label: 'No tier discount', pct: 0 },
  { label: '10% tier discount', pct: 0.10 },
  { label: '20% tier discount', pct: 0.20 },
]
const REFERENCE_PRICE = 100

export function PromoStackPreview() {
  const [promoPctField] = useFormFields((context) => [context[0]['promo_discount_pct']])
  const promoPct = (promoPctField?.value as number) ?? 0

  return (
    <div style={{ marginTop: '8px', padding: '16px', background: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
      <p style={{ fontWeight: 600, marginBottom: '12px', fontSize: '14px' }}>
        Stacking preview — effect at MYR {REFERENCE_PRICE} list price
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
            <th style={{ padding: '4px 8px', color: '#6b7280' }}>Contractor tier</th>
            <th style={{ padding: '4px 8px', color: '#6b7280' }}>After tier</th>
            <th style={{ padding: '4px 8px', color: '#6b7280' }}>After promo ({(promoPct * 100).toFixed(0)}%)</th>
            <th style={{ padding: '4px 8px', color: '#6b7280' }}>Effective price</th>
          </tr>
        </thead>
        <tbody>
          {EXAMPLE_TIERS.map(({ label, pct }) => {
            const afterTier = REFERENCE_PRICE * (1 - pct)
            const effective = afterTier * (1 - promoPct)
            return (
              <tr key={label} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '6px 8px' }}>{label}</td>
                <td style={{ padding: '6px 8px' }}>MYR {afterTier.toFixed(2)}</td>
                <td style={{ padding: '6px 8px' }}>MYR {effective.toFixed(2)}</td>
                <td style={{ padding: '6px 8px', fontWeight: 700, color: effective < 60 ? '#dc2626' : '#111' }}>
                  MYR {effective.toFixed(2)}
                  {effective < 60 && <span style={{ marginLeft: 6, color: '#dc2626', fontSize: 11 }}>⚠️ &gt;40% off</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {promoPct > 0.25 && (
        <p style={{ marginTop: '10px', color: '#b45309', fontSize: '12px' }}>
          ⚠️ This is a large promo discount. Check with Alan that the effective prices above are intentional before saving.
        </p>
      )}
    </div>
  )
}
