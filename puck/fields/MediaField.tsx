'use client'

/**
 * Custom Puck field: upload a photo (drag-and-drop OR click), pick one from the
 * Payload Media library, or paste a URL. Stored value: { id?, url, alt? }.
 *
 * Design decision (plan-design-review Pass 2): in-place media that matches the
 * Wix flow — drag a file onto the box, or open the library and pick — instead of
 * hand-typing URLs. URL field stays as a last-resort fallback so an editor is
 * never stuck.
 *
 * Upload path: multipart POST to /api/media with `file` + `_payload` (JSON).
 * The Media collection requires `alt`, so we seed it from the filename; the
 * editor can refine alt in the field below. Runs with the admin session
 * (credentials: 'include').
 */
import { useEffect, useState, useCallback, useRef } from 'react'

export type MediaValue = { id?: string; url: string; alt?: string } | null

type MediaDoc = { id: string; url?: string; alt?: string; filename?: string }

const ACCEPT = 'image/jpeg,image/png,image/webp'

export function MediaField({
  value,
  onChange,
}: {
  value: MediaValue
  onChange: (v: MediaValue) => void
}) {
  const [open, setOpen] = useState(false)
  const [docs, setDocs] = useState<MediaDoc[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/media?limit=48&sort=-createdAt&depth=0', {
        credentials: 'include',
      })
      if (!res.ok) throw new Error(`Media list failed (${res.status})`)
      const data = await res.json()
      setDocs(Array.isArray(data?.docs) ? data.docs : [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load media')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open && docs.length === 0) load()
  }, [open, docs.length, load])

  const uploadFile = useCallback(
    async (file: File) => {
      setError(null)
      if (!ACCEPT.split(',').includes(file.type)) {
        setError('Use a JPEG, PNG or WebP image.')
        return
      }
      setUploading(true)
      try {
        const altSeed = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || 'Image'
        const fd = new FormData()
        fd.append('file', file)
        fd.append('_payload', JSON.stringify({ alt: altSeed }))
        const res = await fetch('/api/media', { method: 'POST', body: fd, credentials: 'include' })
        if (res.status === 401 || res.status === 403) throw new Error('Sign in to /admin first, then retry the upload.')
        if (!res.ok) {
          const msg = await res.json().catch(() => null)
          throw new Error(msg?.errors?.[0]?.message || `Upload failed (${res.status}).`)
        }
        const data = await res.json()
        const doc: MediaDoc | undefined = data?.doc
        if (!doc?.url) throw new Error('Upload succeeded but no URL came back.')
        onChange({ id: doc.id, url: doc.url, alt: doc.alt || altSeed })
        setDocs((prev) => [doc, ...prev]) // show it at the top of the library too
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Upload failed')
      } finally {
        setUploading(false)
      }
    },
    [onChange],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer?.files?.[0]
      if (file) uploadFile(file)
    },
    [uploadFile],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Drop zone doubles as the preview. Drag a file anywhere on it, or click to choose. */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        title="Click to choose a photo, or drag one here"
        style={{
          position: 'relative',
          cursor: uploading ? 'progress' : 'pointer',
          borderRadius: 6,
          border: dragOver ? '2px dashed #3b82f6' : '1px dashed #cbd5e1',
          background: dragOver ? '#eff6ff' : value?.url ? 'transparent' : '#f8fafc',
          overflow: 'hidden',
          minHeight: value?.url ? undefined : 96,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {value?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value.url}
            alt={value.alt || ''}
            style={{ width: '100%', maxHeight: 160, objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ padding: 16, textAlign: 'center', color: '#64748b', fontSize: 13 }}>
            {uploading ? 'Uploading…' : (<><strong style={{ color: '#3b82f6' }}>Click to upload</strong> or drag a photo here<br /><span style={{ fontSize: 11, color: '#94a3b8' }}>JPEG · PNG · WebP</span></>)}
          </div>
        )}
        {dragOver && value?.url && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8', fontSize: 13, fontWeight: 600 }}>
            Drop to replace
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT}
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) uploadFile(f)
          e.target.value = '' // allow re-selecting the same file
        }}
      />

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} style={btnStyle}>
          {uploading ? 'Uploading…' : 'Upload photo'}
        </button>
        <button type="button" onClick={() => setOpen((v) => !v)} style={btnStyle}>
          {open ? 'Close library' : 'Pick from library'}
        </button>
        {value?.url && (
          <button type="button" onClick={() => onChange(null)} style={{ ...btnStyle, color: '#b91c1c' }}>
            Remove
          </button>
        )}
      </div>

      {error && <div style={{ fontSize: 12, color: '#b91c1c' }}>{error}</div>}

      <input
        type="text"
        placeholder="Alt text (describe the image)"
        value={value?.alt ?? ''}
        onChange={(e) => onChange(value?.url ? { ...value, alt: e.target.value } : value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="…or paste an image URL"
        value={value?.id ? '' : value?.url ?? ''}
        onChange={(e) => onChange(e.target.value ? { url: e.target.value, alt: value?.alt } : null)}
        style={inputStyle}
      />

      {open && (
        <div style={{ border: '1px solid #e5e2da', borderRadius: 6, padding: 8, maxHeight: 260, overflowY: 'auto' }}>
          {loading && <div style={{ fontSize: 13, color: '#64748b' }}>Loading…</div>}
          {!loading && docs.length === 0 && (
            <div style={{ fontSize: 13, color: '#64748b' }}>No media uploaded yet — use “Upload photo” above.</div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {docs.map((d) =>
              d.url ? (
                <button
                  key={d.id}
                  type="button"
                  title={d.filename || d.alt || ''}
                  onClick={() => {
                    onChange({ id: d.id, url: d.url!, alt: d.alt || '' })
                    setOpen(false)
                  }}
                  style={{ padding: 0, border: '1px solid #e5e2da', borderRadius: 4, overflow: 'hidden', cursor: 'pointer', background: 'none' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.url} alt={d.alt || ''} style={{ width: '100%', height: 70, objectFit: 'cover', display: 'block' }} />
                </button>
              ) : null,
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  fontSize: 13,
  padding: '6px 10px',
  borderRadius: 6,
  border: '1px solid #cbd5e1',
  background: '#fff',
  cursor: 'pointer',
}
const inputStyle: React.CSSProperties = {
  fontSize: 13,
  padding: '6px 8px',
  borderRadius: 6,
  border: '1px solid #cbd5e1',
  width: '100%',
}
