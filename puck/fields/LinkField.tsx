'use client'

/**
 * Custom Puck field: choose a link target from the pages that already exist —
 * the main site pages and any CMS pages built in this editor — instead of
 * hand-typing a URL (GH feedback: pick a page we already built and click it).
 *
 * Value stays a plain string href, so every block that renders `href={...}`
 * keeps working unchanged. A "Custom / external URL" row keeps the manual escape
 * hatch (mailto:, https://…, anchors).
 */
import { useEffect, useState } from 'react'

// Main built site routes worth linking to (curated — skips cart/account/legal
// plumbing). Mirrors app/(frontend) routes that exist today.
const SITE_PAGES: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Applications', href: '/applications' },
  { label: 'Resources', href: '/resources' },
  { label: 'Field Notes', href: '/field-notes' },
  { label: 'Heritage', href: '/heritage' },
  { label: 'Why Coolman', href: '/why-coolman' },
  { label: 'Brotherhood', href: '/brotherhood' },
  { label: 'Career', href: '/career' },
  { label: 'Shibuya', href: '/shibuya' },
  { label: 'Trade enquiry', href: '/trade' },
  { label: 'Contact', href: '/contact' },
]

const CUSTOM = '__custom__'

type PageDoc = { id: string | number; title?: string; slug?: string; status?: string }

export function LinkField({
  value,
  onChange,
}: {
  value: string | undefined
  onChange: (v: string) => void
}) {
  const [cmsPages, setCmsPages] = useState<{ label: string; href: string }[]>([])
  const v = value ?? ''
  const known = [...SITE_PAGES, ...cmsPages].some((p) => p.href === v)
  // Explicit "custom URL" mode so it survives an empty text box. Seed it from the
  // saved value: a non-empty value that isn't a known page means it's a custom URL.
  const [custom, setCustom] = useState<boolean>(v !== '' && !known)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/pages?limit=100&depth=0&sort=title', { credentials: 'include' })
        if (!res.ok) return
        const data = await res.json()
        const docs: PageDoc[] = Array.isArray(data?.docs) ? data.docs : []
        const pages = docs
          .filter((d) => d.slug)
          .map((d) => ({
            label: `${d.title || d.slug}${d.status && d.status !== 'published' ? ' (draft)' : ''}`,
            href: `/${d.slug}`,
          }))
        if (!cancelled) setCmsPages(pages)
      } catch {
        /* leave CMS pages empty; site pages + custom URL still work */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // What the dropdown shows: custom mode wins; else a matched page; else an
  // unknown non-empty value is treated as custom; else "no link".
  const selectValue = custom ? CUSTOM : known ? v : v ? CUSTOM : ''

  const onSelect = (next: string) => {
    if (next === CUSTOM) {
      setCustom(true) // keep whatever href is there so it can be edited
    } else {
      setCustom(false)
      onChange(next) // '' for "no link", or the chosen page href
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <select value={selectValue} onChange={(e) => onSelect(e.target.value)} style={selectStyle}>
        <option value="">— No link —</option>
        <optgroup label="Site pages">
          {SITE_PAGES.map((p) => (
            <option key={p.href} value={p.href}>
              {p.label}
            </option>
          ))}
        </optgroup>
        {cmsPages.length > 0 && (
          <optgroup label="Pages you built">
            {cmsPages.map((p) => (
              <option key={p.href} value={p.href}>
                {p.label}
              </option>
            ))}
          </optgroup>
        )}
        <option value={CUSTOM}>Custom / external URL…</option>
      </select>

      {selectValue === CUSTOM && (
        <input
          type="text"
          autoFocus
          placeholder="https://…  or  /any-path  or  mailto:…"
          value={v}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      )}

      {v && (
        <div style={{ fontSize: 11, color: '#94a3b8', wordBreak: 'break-all' }}>
          Links to: <span style={{ color: '#3b82f6' }}>{v}</span>
        </div>
      )}
    </div>
  )
}

const selectStyle: React.CSSProperties = {
  fontSize: 13,
  padding: '6px 8px',
  borderRadius: 6,
  border: '1px solid #cbd5e1',
  width: '100%',
  background: '#fff',
}
const inputStyle: React.CSSProperties = {
  fontSize: 13,
  padding: '6px 8px',
  borderRadius: 6,
  border: '1px solid #cbd5e1',
  width: '100%',
}
