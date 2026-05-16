// components/admin/SearchAnalyticsView.tsx
//
// Custom Payload v3 admin view at /admin/search-analytics. Server-rendered.
// Aggregates the searchLogs collection in-memory and shows five panels:
//   1) Searches per day (mini bar chart)
//   2) Top filter combinations (query_normalized)
//   3) Top viewed products (flatten viewed_product_ids, count, look up names)
//   4) Logged-in vs anonymous split
//   5) Top contractors by activity
// Time window switchable via ?window=7|30|90 (default 30).
//
// Reads are gated by Payload's admin layout — only adminUsers can reach this
// route. We use overrideAccess on internal lookups (products/contractors) so
// the counts aren't silently truncated by per-collection access rules.

import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'

type Win = 7 | 30 | 90

function parseWindow(v: string | string[] | undefined): Win {
  const n = Number(Array.isArray(v) ? v[0] : v)
  return n === 7 || n === 90 ? n : 30
}

function fmtDateKey(d: Date): string {
  // YYYY-MM-DD in UTC. Cheap and stable.
  return d.toISOString().slice(0, 10)
}

function fmtDayLabel(key: string): string {
  // "May 14" — short, no year, fine for a 90-day max window.
  const d = new Date(key + 'T00:00:00Z')
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'UTC' })
}

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section
    style={{
      background: 'var(--theme-elevation-50)',
      border: '1px solid var(--theme-elevation-100)',
      borderRadius: 6,
      padding: '20px 24px',
      marginBottom: 20,
    }}
  >
    <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 600 }}>{title}</h2>
    {children}
  </section>
)

const Empty: React.FC<{ msg: string }> = ({ msg }) => (
  <div style={{ color: 'var(--theme-elevation-500)', fontStyle: 'italic', fontSize: 14 }}>{msg}</div>
)

const SearchAnalyticsView: React.FC<AdminViewServerProps> = async ({
  initPageResult,
  params,
  searchParams,
}) => {
  // Block non-admins. Payload's admin layout already enforces this, but
  // belt-and-braces in case the view is mounted somewhere unexpected later.
  const user: any = initPageResult?.req?.user
  if (!user || user.collection !== 'adminUsers') {
    redirect('/admin/login')
  }

  const window: Win = parseWindow(searchParams?.window)
  const since = new Date(Date.now() - window * 24 * 60 * 60 * 1000)

  const payload = await getPayload({ config })

  // Pull every searchLogs row in the window. Cap at 5000 — beyond that we'd
  // need DB-side aggregation (GROUP BY in SQL). Easy to swap in later.
  const { docs: logs } = await payload.find({
    collection: 'searchLogs',
    where: { createdAt: { greater_than: since.toISOString() } },
    sort: '-createdAt',
    limit: 5000,
    depth: 0,
    overrideAccess: true,
  })

  // ─── 1. Searches per day ────────────────────────────────────────────────
  // Seed every day in the window with 0 so the chart doesn't collapse over
  // quiet stretches.
  const perDay = new Map<string, number>()
  for (let i = 0; i < window; i++) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    perDay.set(fmtDateKey(d), 0)
  }
  for (const row of logs as any[]) {
    if (!row.createdAt) continue
    const key = fmtDateKey(new Date(row.createdAt))
    if (perDay.has(key)) perDay.set(key, (perDay.get(key) || 0) + 1)
  }
  const perDayArr = Array.from(perDay.entries()).sort(([a], [b]) => a.localeCompare(b))
  const maxDay = Math.max(1, ...perDayArr.map(([, v]) => v))

  // ─── 2. Top filter combinations ─────────────────────────────────────────
  // Skip rows where query_normalized is empty (those are product-only views).
  const queryCounts = new Map<string, number>()
  for (const row of logs as any[]) {
    const q = (row.query_normalized || row.query || '').trim()
    if (!q) continue
    queryCounts.set(q, (queryCounts.get(q) || 0) + 1)
  }
  const topQueries = Array.from(queryCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10)

  // ─── 3. Top viewed products ─────────────────────────────────────────────
  const productCounts = new Map<string, number>()
  for (const row of logs as any[]) {
    const arr = Array.isArray(row.viewed_product_ids) ? row.viewed_product_ids : []
    for (const item of arr) {
      const pid = item?.productId
      if (!pid) continue
      productCounts.set(pid, (productCounts.get(pid) || 0) + 1)
    }
  }
  const topProductEntries = Array.from(productCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
  // Look up names for the top product IDs in one round-trip.
  let productNames = new Map<string, string>()
  if (topProductEntries.length) {
    try {
      const { docs } = await payload.find({
        collection: 'products',
        where: { id: { in: topProductEntries.map(([id]) => id) } },
        limit: 50,
        depth: 0,
        overrideAccess: true,
      })
      for (const d of docs as Array<{ id: string | number; name?: string; sku?: string }>) {
        productNames.set(String(d.id), d.name || d.sku || String(d.id))
      }
    } catch {
      /* fall back to raw IDs below */
    }
  }

  // ─── 4. Logged-in vs anonymous ──────────────────────────────────────────
  let loggedIn = 0
  let anon = 0
  for (const row of logs as any[]) {
    if (row.contractor) loggedIn++
    else anon++
  }
  const total = loggedIn + anon
  const loggedPct = total === 0 ? 0 : Math.round((loggedIn / total) * 100)

  // ─── 5. Top contractors ─────────────────────────────────────────────────
  const contractorCounts = new Map<string | number, { searches: number; views: number }>()
  for (const row of logs as any[]) {
    if (!row.contractor) continue
    const cid = row.contractor
    const entry = contractorCounts.get(cid) || { searches: 0, views: 0 }
    entry.searches++
    entry.views += Array.isArray(row.viewed_product_ids) ? row.viewed_product_ids.length : 0
    contractorCounts.set(cid, entry)
  }
  const topContractorEntries = Array.from(contractorCounts.entries())
    .sort((a, b) => b[1].searches - a[1].searches)
    .slice(0, 10)
  let contractorNames = new Map<string, string>()
  if (topContractorEntries.length) {
    try {
      const { docs } = await payload.find({
        collection: 'contractors',
        where: { id: { in: topContractorEntries.map(([id]) => id) } },
        limit: 50,
        depth: 0,
        overrideAccess: true,
      })
      for (const d of docs as Array<{ id: string | number; full_name?: string; company_name?: string; email?: string }>) {
        const label = d.full_name || d.company_name || d.email || String(d.id)
        contractorNames.set(String(d.id), label)
      }
    } catch {
      /* fall back to raw IDs */
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────
  const winBtn = (w: Win, label: string) => (
    <Link
      href={`/admin/search-analytics?window=${w}`}
      style={{
        padding: '6px 12px',
        marginRight: 6,
        borderRadius: 4,
        fontSize: 13,
        fontWeight: 500,
        textDecoration: 'none',
        background: window === w ? 'var(--theme-success-500)' : 'var(--theme-elevation-100)',
        color: window === w ? '#fff' : 'var(--theme-elevation-800)',
        border: '1px solid var(--theme-elevation-150)',
      }}
    >
      {label}
    </Link>
  )

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user ?? undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
    <div style={{ padding: '24px 32px', maxWidth: 1100 }}>
      <header style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>Search Analytics</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--theme-elevation-500)', fontSize: 14 }}>
            What contractors are searching for, what they're clicking on, and how active they've been over the last {window} days.
          </p>
        </div>
        <div>
          {winBtn(7, 'Last 7 days')}
          {winBtn(30, 'Last 30 days')}
          {winBtn(90, 'Last 90 days')}
        </div>
      </header>

      {/* Headline counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        <Card title="Total searches">
          <div style={{ fontSize: 36, fontWeight: 700 }}>{total}</div>
        </Card>
        <Card title="Logged in">
          <div style={{ fontSize: 36, fontWeight: 700 }}>
            {loggedIn} <span style={{ fontSize: 14, color: 'var(--theme-elevation-500)' }}>({loggedPct}%)</span>
          </div>
        </Card>
        <Card title="Anonymous">
          <div style={{ fontSize: 36, fontWeight: 700 }}>
            {anon} <span style={{ fontSize: 14, color: 'var(--theme-elevation-500)' }}>({100 - loggedPct}%)</span>
          </div>
        </Card>
      </div>

      {/* Per-day bar chart */}
      <Card title="Searches per day">
        {total === 0 ? (
          <Empty msg="No searches in this window yet." />
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 120, padding: '4px 0' }}>
            {perDayArr.map(([key, value]) => {
              const h = Math.max(2, Math.round((value / maxDay) * 110))
              return (
                <div
                  key={key}
                  title={`${fmtDayLabel(key)} — ${value} search${value === 1 ? '' : 'es'}`}
                  style={{
                    flex: 1,
                    height: h,
                    background: value === 0 ? 'var(--theme-elevation-100)' : 'var(--theme-success-500)',
                    borderRadius: '2px 2px 0 0',
                    minWidth: 2,
                  }}
                />
              )
            })}
          </div>
        )}
        {total > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--theme-elevation-500)' }}>
            <span>{fmtDayLabel(perDayArr[0][0])}</span>
            <span>{fmtDayLabel(perDayArr[perDayArr.length - 1][0])}</span>
          </div>
        )}
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card title="Top filter combinations">
          {topQueries.length === 0 ? (
            <Empty msg="No filtered searches yet." />
          ) : (
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <tbody>
                {topQueries.map(([q, n]) => (
                  <tr key={q} style={{ borderBottom: '1px solid var(--theme-elevation-100)' }}>
                    <td style={{ padding: '6px 0', wordBreak: 'break-word' }}>{q}</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card title="Top viewed products">
          {topProductEntries.length === 0 ? (
            <Empty msg="No product clicks yet." />
          ) : (
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <tbody>
                {topProductEntries.map(([pid, n]) => (
                  <tr key={pid} style={{ borderBottom: '1px solid var(--theme-elevation-100)' }}>
                    <td style={{ padding: '6px 0' }}>
                      <Link
                        href={`/admin/collections/products/${pid}`}
                        style={{ color: 'var(--theme-text)', textDecoration: 'none' }}
                      >
                        {productNames.get(String(pid)) || pid}
                      </Link>
                    </td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <Card title="Top contractors by search activity">
        {topContractorEntries.length === 0 ? (
          <Empty msg="No logged-in contractor searches yet." />
        ) : (
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--theme-elevation-500)' }}>
                <th style={{ padding: '6px 0', fontWeight: 500 }}>Contractor</th>
                <th style={{ padding: '6px 0', fontWeight: 500, textAlign: 'right' }}>Searches</th>
                <th style={{ padding: '6px 0', fontWeight: 500, textAlign: 'right' }}>Products viewed</th>
              </tr>
            </thead>
            <tbody>
              {topContractorEntries.map(([cid, stats]) => (
                <tr key={String(cid)} style={{ borderBottom: '1px solid var(--theme-elevation-100)' }}>
                  <td style={{ padding: '6px 0' }}>
                    <Link
                      href={`/admin/collections/contractors/${cid}`}
                      style={{ color: 'var(--theme-text)', textDecoration: 'none' }}
                    >
                      {contractorNames.get(String(cid)) || cid}
                    </Link>
                  </td>
                  <td style={{ padding: '6px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{stats.searches}</td>
                  <td style={{ padding: '6px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{stats.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <p style={{ color: 'var(--theme-elevation-400)', fontSize: 12, marginTop: 16 }}>
        Showing up to 5,000 search rows from the last {window} days.{' '}
        <Link href="/admin/collections/searchLogs" style={{ color: 'var(--theme-success-500)' }}>
          Open the raw Search Logs →
        </Link>
      </p>
    </div>
    </DefaultTemplate>
  )
}

export default SearchAnalyticsView
