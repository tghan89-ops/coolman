'use client'

import { useCallback, useEffect, useState } from 'react'
import { Puck, type Data } from '@puckeditor/core'
import '@puckeditor/core/puck.css'
import puckConfig from '@/puck/config'
import { overrides } from '@/puck/overrides'
import { homeBlockNames } from '@/puck/blocks/home'
import { pageBlockNames } from '@/puck/blocks/pages'

// Blocks that lock their page's layout (no drag/add/delete; content stays editable).
const LOCKED_BLOCKS = new Set<string>([...homeBlockNames, ...pageBlockNames])

const EMPTY: Data = { root: { props: {} }, content: [], zones: {} } as unknown as Data

type SaveState = 'idle' | 'saving-draft' | 'saving-publish' | 'saved' | 'error'
type PageStatus = 'draft' | 'published'

export function EditorClient({ id }: { id: string }) {
  const [data, setData] = useState<Data | null>(null)
  const [title, setTitle] = useState<string>('')
  const [status, setStatus] = useState<PageStatus>('draft')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [save, setSave] = useState<SaveState>('idle')
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  // Live data for the locked read-only home blocks, so the products grid +
  // contact section preview correctly inside the editor (matches the public
  // render, which gets the same shape via Puck metadata on the server).
  const [meta, setMeta] = useState<{ products: unknown[]; settings: unknown }>({ products: [], settings: {} })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [pRes, sRes] = await Promise.all([
          fetch('/api/products?limit=12&depth=1', { credentials: 'include' }),
          fetch('/api/globals/settings?depth=0', { credentials: 'include' }),
        ])
        const pJson = pRes.ok ? await pRes.json() : { docs: [] }
        const settings = sRes.ok ? await sRes.json() : {}
        const products = (pJson.docs || []).map((d: Record<string, any>) => ({
          id: d.id,
          name: d.name,
          category: d.category?.name ?? null,
          diameter: d.diameter ?? null,
          bondType: d.bondType ?? null,
          materials: Array.isArray(d.materials) ? d.materials.map((m: any) => ({ name: m?.name })).filter((m: any) => m.name) : [],
          image: d.image?.url ? { url: d.image.url } : null,
        }))
        if (!cancelled) setMeta({ products, settings })
      } catch {
        /* editor still works without live data; read-only blocks show empty state */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/pages/${id}?depth=0`, { credentials: 'include' })
        if (res.status === 401 || res.status === 403) throw new Error('Please sign in to the admin first (/admin), then reopen this editor.')
        if (!res.ok) throw new Error(`Could not load this page (${res.status}).`)
        const doc = await res.json()
        if (cancelled) return
        setTitle(doc?.title || 'Untitled page')
        setStatus(doc?.status === 'published' ? 'published' : 'draft')
        const pd = doc?.puckData
        setData(pd && typeof pd === 'object' && Array.isArray(pd.content) ? pd : EMPTY)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  // One save path for both buttons; nextStatus decides draft vs live. Uses the
  // canvas data tracked via onChange, so it always saves the latest edits.
  const persist = useCallback(
    async (nextStatus: PageStatus) => {
      setSave(nextStatus === 'published' ? 'saving-publish' : 'saving-draft')
      setSaveMsg(null)
      try {
        const res = await fetch(`/api/pages/${id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ puckData: data ?? EMPTY, status: nextStatus }),
        })
        if (res.status === 401 || res.status === 403) throw new Error('Sign in to /admin first (same browser), then retry.')
        if (!res.ok) {
          const body = await res.json().catch(() => null)
          throw new Error(body?.errors?.[0]?.message || `Save failed (${res.status})`)
        }
        setStatus(nextStatus)
        setSave('saved')
        setSaveMsg(nextStatus === 'published' ? 'Published — now live ✓' : 'Draft saved ✓')
        setTimeout(() => setSave((s) => (s === 'saved' ? 'idle' : s)), 3000)
      } catch (e) {
        setSave('error')
        setSaveMsg(e instanceof Error ? e.message : 'Save failed')
      }
    },
    [id, data],
  )

  if (loading) return <div style={fullCenter}>Loading editor…</div>
  if (error) return <div style={{ ...fullCenter, color: '#b91c1c', textAlign: 'center', padding: 24 }}>{error}</div>

  const busy = save === 'saving-draft' || save === 'saving-publish'

  // Locked-layout pages (built from the bespoke Home* blocks): the arrangement is
  // fixed — no dragging, no adding, no deleting, no duplicating — but each
  // section's text and images stay editable. This is GH's "not movable, still
  // editable Puck-style" model. Detected from the content, so any page assembled
  // from locked sections inherits the behaviour without a special flag.
  const lockedLayout =
    !!data &&
    Array.isArray((data as { content?: { type?: string }[] }).content) &&
    (data as { content: { type?: string }[] }).content.some((c) => typeof c?.type === 'string' && LOCKED_BLOCKS.has(c.type))

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={topBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <a href="/admin/collections/pages" style={{ fontSize: 13, color: '#3b82f6', textDecoration: 'none', whiteSpace: 'nowrap' }}>← Back</a>
          <strong style={{ fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</strong>
          <span style={status === 'published' ? livePill : draftPill}>{status === 'published' ? 'LIVE' : 'DRAFT'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: 13, color: save === 'error' ? '#b91c1c' : save === 'saved' ? '#0f8a4f' : '#64748b' }}>
            {save === 'saving-draft' ? 'Saving draft…' : save === 'saving-publish' ? 'Publishing…' : saveMsg || ''}
          </span>
          <button type="button" onClick={() => persist('draft')} disabled={busy} style={draftBtn}>
            {save === 'saving-draft' ? 'Saving…' : 'Save draft'}
          </button>
          <button type="button" onClick={() => persist('published')} disabled={busy} style={publishBtn}>
            {save === 'saving-publish' ? 'Publishing…' : status === 'published' ? 'Update live page' : 'Publish'}
          </button>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Puck
          config={puckConfig}
          data={data ?? EMPTY}
          overrides={overrides}
          onChange={(d) => setData(d)}
          metadata={meta}
          permissions={lockedLayout ? { drag: false, delete: false, duplicate: false, insert: false } : undefined}
        />
      </div>
    </div>
  )
}

const fullCenter: React.CSSProperties = { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', color: '#475569' }
const topBar: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '8px 16px', borderBottom: '1px solid #e5e2da', background: '#fff' }
const baseBtn: React.CSSProperties = { fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 6, cursor: 'pointer', border: '1px solid transparent' }
const draftBtn: React.CSSProperties = { ...baseBtn, border: '1px solid #cbd5e1', background: '#fff', color: '#0a1628' }
const publishBtn: React.CSSProperties = { ...baseBtn, background: '#3b82f6', color: '#fff' }
const livePill: React.CSSProperties = { fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', padding: '2px 7px', borderRadius: 999, background: '#dcfce7', color: '#0f8a4f' }
const draftPill: React.CSSProperties = { fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', padding: '2px 7px', borderRadius: 999, background: '#f1f5f9', color: '#64748b' }
