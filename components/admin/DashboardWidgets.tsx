// components/admin/DashboardWidgets.tsx
//
// Rendered at the top of the Payload admin home screen (admin.components.beforeDashboard).
// Server component — reads live data via the Payload local API. Read-only:
// every number here links into the built-in admin lists/forms for action.

import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'

function startOfTodayISO(): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export default async function DashboardWidgets() {
  try {
    return await DashboardWidgetsInner()
  } catch (err) {
    console.error('[DashboardWidgets] render error:', err)
    return (
      <div style={{ marginBottom: 32, padding: '12px 16px', border: '1px solid var(--theme-warning-500, #D97706)', borderRadius: 8, fontSize: 13 }}>
        Dashboard widgets could not load — database may still be initialising. Refresh in a moment.
      </div>
    )
  }
}

async function DashboardWidgetsInner() {
  const payload = await getPayload({ config })

  const todayStart = startOfTodayISO()

  const [ordersToday, awaitingAck, duplicatesFlagged, oldestPending, settings, allProducts] = await Promise.all([
    payload.find({ collection: 'orders', where: { submitted_at: { greater_than_equal: todayStart } }, limit: 0, overrideAccess: true }),
    payload.find({ collection: 'orders', where: { order_status: { equals: 'pending' } }, limit: 0, overrideAccess: true }),
    payload.find({ collection: 'orders', where: { duplicate_flag: { equals: true }, order_status: { equals: 'pending' } }, limit: 0, overrideAccess: true }),
    payload.find({ collection: 'orders', where: { order_status: { equals: 'pending' } }, sort: 'submitted_at', limit: 1, overrideAccess: true }),
    payload.findGlobal({ slug: 'settings', overrideAccess: true }).catch(() => null),
    payload.find({ collection: 'products', limit: 1000, depth: 0, overrideAccess: true }),
  ])

  // Content readiness — a product is "complete" when it has both a primary
  // image and at least one YouTube video. Surfaces the catalogue gap so Alan
  // knows where to spend time before pushing customers at the site.
  const totalProducts = allProducts.totalDocs
  const completeProducts = (allProducts.docs as any[]).filter(
    (p) => p.image && p.youtubeUrl && String(p.youtubeUrl).trim().length > 0,
  ).length
  const readinessPct = totalProducts === 0 ? 0 : Math.round((completeProducts / totalProducts) * 100)
  const readinessLow = readinessPct < 80

  const s = (settings ?? {}) as { orders_paused?: boolean; alert_threshold_hours?: number }
  const thresholdHours = s.alert_threshold_hours ?? 24

  let oldestAgeHours: number | null = null
  const oldest = oldestPending.docs[0] as { submitted_at?: string } | undefined
  if (oldest?.submitted_at) {
    oldestAgeHours = Math.floor((Date.now() - new Date(oldest.submitted_at).getTime()) / 3_600_000)
  }
  const oldestOverdue = oldestAgeHours !== null && oldestAgeHours >= thresholdHours

  const defaultBorderColor = 'var(--theme-elevation-150, #e0e0e0)'
  const cardStyle: React.CSSProperties = {
    border: `1px solid ${defaultBorderColor}`,
    borderRadius: 8,
    padding: '16px 18px',
    minWidth: 170,
    background: 'var(--theme-elevation-0, #fff)',
  }
  const numStyle: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 600, lineHeight: 1.1 }
  const labelStyle: React.CSSProperties = { fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.7, marginTop: 6 }

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>Today at Coolman</h2>
      <p style={{ margin: '0 0 16px', fontSize: 13, opacity: 0.7 }}>Live snapshot — click any number to jump into the list.</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <Link href={`/admin/collections/orders?where[submitted_at][greater_than_equal]=${encodeURIComponent(todayStart)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={cardStyle}>
            <div style={numStyle}>{ordersToday.totalDocs}</div>
            <div style={labelStyle}>Orders today</div>
          </div>
        </Link>

        <Link href="/admin/collections/orders?where[order_status][equals]=pending" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ ...cardStyle, borderColor: awaitingAck.totalDocs > 0 ? 'var(--theme-warning-500, #D97706)' : defaultBorderColor }}>
            <div style={{ ...numStyle, color: awaitingAck.totalDocs > 0 ? 'var(--theme-warning-600, #B45309)' : undefined }}>{awaitingAck.totalDocs}</div>
            <div style={labelStyle}>Awaiting acknowledgement</div>
          </div>
        </Link>

        <Link href="/admin/collections/orders?where[duplicate_flag][equals]=true&where[order_status][equals]=pending" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ ...cardStyle, borderColor: duplicatesFlagged.totalDocs > 0 ? 'var(--theme-error-500, #B91C1C)' : defaultBorderColor }}>
            <div style={{ ...numStyle, color: duplicatesFlagged.totalDocs > 0 ? 'var(--theme-error-600, #991B1B)' : undefined }}>{duplicatesFlagged.totalDocs}</div>
            <div style={labelStyle}>Duplicates flagged</div>
          </div>
        </Link>

        <div style={{ ...cardStyle, borderColor: oldestOverdue ? 'var(--theme-error-500, #B91C1C)' : defaultBorderColor }}>
          <div style={{ ...numStyle, color: oldestOverdue ? 'var(--theme-error-600, #991B1B)' : undefined, fontSize: 22 }}>
            {oldestAgeHours === null ? '—' : `${oldestAgeHours}h`}
          </div>
          <div style={labelStyle}>Oldest unacknowledged{oldestOverdue ? ` (over ${thresholdHours}h!)` : ` / ${thresholdHours}h alert`}</div>
        </div>

        <Link href="/admin/globals/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ ...cardStyle, borderColor: s.orders_paused ? 'var(--theme-error-500, #B91C1C)' : 'var(--theme-success-500, #0F8A4F)' }}>
            <div style={{ ...numStyle, fontSize: 18, color: s.orders_paused ? 'var(--theme-error-600, #991B1B)' : 'var(--theme-success-600, #0B6B3D)' }}>
              {s.orders_paused ? 'PAUSED' : 'LIVE'}
            </div>
            <div style={labelStyle}>Order intake (kill switch)</div>
          </div>
        </Link>

        <Link href="/admin/collections/products" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ ...cardStyle, borderColor: readinessLow ? 'var(--theme-warning-500, #D97706)' : 'var(--theme-success-500, #0F8A4F)' }}>
            <div style={{ ...numStyle, color: readinessLow ? 'var(--theme-warning-600, #B45309)' : 'var(--theme-success-600, #0B6B3D)' }}>
              {readinessPct}%
            </div>
            <div style={labelStyle}>
              Catalogue complete — {completeProducts}/{totalProducts} with photo+video
            </div>
          </div>
        </Link>
      </div>

      <p style={{ marginTop: 16, fontSize: 13 }}>
        <Link href="/admin/collections/orders">Manage orders</Link>{'  ·  '}
        <Link href="/admin/collections/contractors">Customer accounts</Link>{'  ·  '}
        <Link href="/admin/collections/products">Products</Link>{'  ·  '}
        <Link href="/admin/globals/settings">Settings</Link>{'  ·  '}
        <Link href="/api/admin/export/orders">Download orders (Excel)</Link>{'  ·  '}
        <Link href="/api/admin/export/contractors">Download customers (Excel)</Link>{'  ·  '}
        <Link href="/api/admin/export/search-log">Download search log (Excel, no PII)</Link>
      </p>

      {/*
        Search-signal intelligence (top zero-result + high-volume queries, 30d)
        renders as its own widget — components/admin/SearchSignalWidget.tsx —
        mounted via admin.components.beforeDashboard in payload.config.ts. It is
        NOT embedded here to avoid a double-render if this DashboardWidgets is
        re-enabled. If you ever move it inline, drop it from beforeDashboard.
      */}
    </div>
  )
}
