// components/admin/SearchSignalWidget.tsx
//
// Read-only admin dashboard widget. Surfaces search-log intelligence the raw
// Excel export can't make actionable: the owner cannot pivot 50k rows by hand.
//
// Two DB-side GROUP BY queries over `search_logs`, both last 30 days, grouped
// by the normalized-query column (`query_normalized`, falling back to `query`):
//   1. Top ZERO-RESULT queries  — WHERE result_count = 0. The priority signal;
//      every row here is a customer who searched and saw nothing. Seeds the
//      search synonym map.
//   2. Top HIGH-VOLUME queries  — any result_count, plus the latest result_count
//      so a high-demand + low/zero-result row stands out.
//
// Aggregation runs in Postgres (single GROUP BY each) rather than pulling rows
// into memory — the normalized column exists precisely for this, and the export
// already proves the table can hold 50k rows.
//
// Admin-gated: rendered only inside the Payload admin shell (beforeDashboard),
// which Payload already restricts to authenticated adminUsers. We also re-check
// the session via getAdminSession (the SAME gate the Excel export route uses)
// and render nothing if it doesn't hold — belt-and-braces, never public.

import { getPayload } from 'payload'
import config from '@payload-config'
import { sql } from '@payloadcms/db-postgres'
import { headers as nextHeaders } from 'next/headers'
import { getAdminSession } from '@/lib/auth/admin-session'
import Link from 'next/link'

interface QueryRow {
  q: string
  c: number
  latest_result?: number
}

export default async function SearchSignalWidget() {
  // Same admin gate as /api/admin/export/search-log — getAdminSession over the
  // request headers. If it fails, render nothing (no public exposure).
  try {
    const h = await nextHeaders()
    if (!(await getAdminSession(h))) return null
  } catch {
    return null
  }

  try {
    return await SearchSignalWidgetInner()
  } catch (err) {
    console.error('[SearchSignalWidget] render error:', err)
    return (
      <div
        style={{
          marginBottom: 32,
          padding: '12px 16px',
          border: '1px solid var(--theme-warning-500, #D97706)',
          borderRadius: 8,
          fontSize: 13,
        }}
      >
        Search-signal widget could not load — database may still be initialising. Refresh in a moment.
      </div>
    )
  }
}

async function SearchSignalWidgetInner() {
  const payload = await getPayload({ config })
  const db = (payload.db as any).drizzle

  // Normalized expression reused by both queries: prefer the normalized column,
  // fall back to the raw query, trimmed; skip blanks (product-only view rows).
  // Group by it so spelling/case variants collapse the way the export can't.
  const [zeroRes, topRes] = await Promise.all([
    db.execute(sql`
      SELECT COALESCE(NULLIF(TRIM(query_normalized), ''), TRIM(query)) AS q,
             COUNT(*)::int AS c
      FROM search_logs
      WHERE created_at >= NOW() - INTERVAL '30 days'
        AND result_count = 0
        AND COALESCE(NULLIF(TRIM(query_normalized), ''), TRIM(query)) <> ''
      GROUP BY 1
      ORDER BY c DESC, q ASC
      LIMIT 15
    `),
    db.execute(sql`
      SELECT q, c, latest_result FROM (
        SELECT COALESCE(NULLIF(TRIM(query_normalized), ''), TRIM(query)) AS q,
               COUNT(*)::int AS c,
               (ARRAY_AGG(result_count ORDER BY created_at DESC))[1]::int AS latest_result
        FROM search_logs
        WHERE created_at >= NOW() - INTERVAL '30 days'
          AND COALESCE(NULLIF(TRIM(query_normalized), ''), TRIM(query)) <> ''
        GROUP BY 1
      ) t
      ORDER BY c DESC, q ASC
      LIMIT 15
    `),
  ])

  const zeroRows = (zeroRes.rows ?? []) as QueryRow[]
  const topRows = (topRes.rows ?? []) as QueryRow[]

  const sectionStyle: React.CSSProperties = { marginBottom: 32 }
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 16,
  }
  const cardStyle: React.CSSProperties = {
    border: '1px solid var(--theme-elevation-150, #e0e0e0)',
    borderRadius: 8,
    padding: '16px 18px',
    background: 'var(--theme-elevation-0, #fff)',
  }
  const cardTitleStyle: React.CSSProperties = { margin: '0 0 4px', fontSize: 15, fontWeight: 600 }
  const cardSubStyle: React.CSSProperties = { margin: '0 0 12px', fontSize: 12, opacity: 0.7 }
  const tableStyle: React.CSSProperties = { width: '100%', fontSize: 13, borderCollapse: 'collapse' }
  const tdStyle: React.CSSProperties = { padding: '6px 0', wordBreak: 'break-word' }
  const numStyle: React.CSSProperties = {
    padding: '6px 0',
    textAlign: 'right',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600,
    whiteSpace: 'nowrap',
  }
  const emptyStyle: React.CSSProperties = { fontSize: 13, fontStyle: 'italic', opacity: 0.6 }

  return (
    <div style={sectionStyle}>
      <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>Search signal (last 30 days)</h2>
      <p style={{ margin: '0 0 16px', fontSize: 13, opacity: 0.7 }}>
        Grouped by normalised query. Zero-result searches are the priority — each one is a customer who found nothing.
      </p>

      <div style={gridStyle}>
        {/* Zero-result — priority panel, listed first */}
        <div style={{ ...cardStyle, borderColor: zeroRows.length ? 'var(--theme-warning-500, #D97706)' : undefined }}>
          <h3 style={cardTitleStyle}>Top searches with no results (30d)</h3>
          <p style={cardSubStyle}>Fix these first — add synonyms or stock the gap.</p>
          {zeroRows.length === 0 ? (
            <div style={emptyStyle}>No zero-result searches logged yet.</div>
          ) : (
            <table style={tableStyle}>
              <tbody>
                {zeroRows.map((r) => (
                  <tr key={r.q} style={{ borderBottom: '1px solid var(--theme-elevation-100, #f0f0f0)' }}>
                    <td style={tdStyle}>{r.q}</td>
                    <td style={numStyle}>{r.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* High-volume */}
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Top searches by volume (30d)</h3>
          <p style={cardSubStyle}>A high count with 0 results is a strong demand signal.</p>
          {topRows.length === 0 ? (
            <div style={emptyStyle}>No searches logged yet.</div>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr style={{ textAlign: 'left', opacity: 0.6 }}>
                  <th style={{ ...tdStyle, fontWeight: 500 }}>Query</th>
                  <th style={{ ...numStyle, fontWeight: 500 }}>Count</th>
                  <th style={{ ...numStyle, fontWeight: 500 }}>Latest results</th>
                </tr>
              </thead>
              <tbody>
                {topRows.map((r) => {
                  const zero = (r.latest_result ?? 0) === 0
                  return (
                    <tr key={r.q} style={{ borderBottom: '1px solid var(--theme-elevation-100, #f0f0f0)' }}>
                      <td style={tdStyle}>{r.q}</td>
                      <td style={numStyle}>{r.c}</td>
                      <td style={{ ...numStyle, color: zero ? 'var(--theme-warning-600, #B45309)' : undefined }}>
                        {r.latest_result ?? 0}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <p style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
        <Link href="/admin/search-analytics">Full search analytics</Link>
        {'  ·  '}
        <Link href="/api/admin/export/search-log">Download search log (Excel, no PII)</Link>
      </p>
    </div>
  )
}
