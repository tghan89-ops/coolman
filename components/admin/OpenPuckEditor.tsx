'use client'

import { useDocumentInfo } from '@payloadcms/ui'

/**
 * Admin UI field rendered on a Page's edit screen: a button that opens the
 * visual (Puck) editor for this page. Shown only once the page exists (has an id).
 */
export function OpenPuckEditor() {
  const { id } = useDocumentInfo()
  if (!id) {
    return (
      <p style={{ fontSize: 13, color: '#64748b', margin: '8px 0' }}>
        Save this page once, then a “Open visual editor” button will appear here.
      </p>
    )
  }
  return (
    <a
      href={`/puck-editor/${id}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 40,
        padding: '0 16px',
        margin: '8px 0',
        borderRadius: 6,
        background: '#3b82f6',
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        textDecoration: 'none',
      }}
    >
      Open visual editor →
    </a>
  )
}

export default OpenPuckEditor
