'use client'

import { useFormFields } from '@payloadcms/ui'

function money(n: number | undefined): string {
  if (typeof n !== 'number' || Number.isNaN(n)) return '—'
  return `RM ${n.toFixed(2)}`
}
function pct(n: number | undefined): string {
  if (typeof n !== 'number' || Number.isNaN(n)) return '0%'
  return `${(n * 100).toFixed(n * 100 % 1 === 0 ? 0 : 1)}%`
}

// Read-only display of the locked-in price stack-up (CLAUDE.md hard rule:
// list → tier → promo → effective shown on every contractor-facing price
// surface — and Alan's order screen is the mirror of that).
export function OrderPriceStackUp() {
  const fields = useFormFields(([f]) => ({
    list: f?.list_price_at_submit?.value as number | undefined,
    tier: f?.tier_discount_pct_at_submit?.value as number | undefined,
    promo: f?.promo_discount_pct_at_submit?.value as number | undefined,
    eff: f?.effective_price_at_submit?.value as number | undefined,
    qty: f?.quantity?.value as number | undefined,
  }))

  const qty = fields.qty ?? 1
  const rowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontFamily: "'JetBrains Mono', monospace", fontSize: 14 }
  const labelCol: React.CSSProperties = { fontFamily: "'IBM Plex Sans', sans-serif", opacity: 0.75 }

  return (
    <div className="field-type ui" style={{ margin: '12px 0 20px', border: '1px solid var(--theme-elevation-150, #e0e0e0)', borderRadius: 8, padding: '12px 16px', maxWidth: 380 }}>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.7, marginBottom: 4 }}>Price (locked at submit)</div>
      <div style={rowStyle}><span style={labelCol}>List price</span><span>{money(fields.list)}</span></div>
      <div style={rowStyle}><span style={labelCol}>− Tier discount</span><span>{pct(fields.tier)}</span></div>
      <div style={rowStyle}><span style={labelCol}>− Promo discount</span><span>{pct(fields.promo)}</span></div>
      <div style={{ ...rowStyle, borderTop: '1px solid var(--theme-elevation-150, #e0e0e0)', marginTop: 4, paddingTop: 8, fontWeight: 600 }}>
        <span style={{ ...labelCol, opacity: 1, fontWeight: 600 }}>Effective / unit</span><span>{money(fields.eff)}</span>
      </div>
      <div style={{ ...rowStyle, fontWeight: 600 }}>
        <span style={{ ...labelCol, opacity: 1, fontWeight: 600 }}>Order total (× {qty})</span>
        <span>{money(typeof fields.eff === 'number' ? fields.eff * qty : undefined)}</span>
      </div>
    </div>
  )
}
