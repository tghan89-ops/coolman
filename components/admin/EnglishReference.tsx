'use client'

import { useFormFields } from '@payloadcms/ui'

type Props = {
  path: string
}

// Shown above every BM field in the Malay tab — displays the current English value
// as a read-only reference so the translator can see what they are translating.
// Derives the EN path automatically by stripping the "BM" suffix.
export function EnglishReference({ path }: Props) {
  const enPath = path.endsWith('BM') ? path.slice(0, -2) : null

  const enValue = useFormFields(([fields]) =>
    enPath ? (fields[enPath]?.value as string) ?? null : null,
  )

  if (!enPath || !enValue) return null

  return (
    <div
      style={{
        fontSize: '12px',
        color: '#6b7280',
        marginBottom: '6px',
        padding: '6px 10px',
        background: '#f9fafb',
        borderRadius: '4px',
        borderLeft: '3px solid #d1d5db',
        lineHeight: '1.5',
        fontStyle: 'italic',
        whiteSpace: 'pre-wrap',
      }}
    >
      <span style={{ fontWeight: 600, fontStyle: 'normal', marginRight: '6px', color: '#374151' }}>
        EN:
      </span>
      {enValue}
    </div>
  )
}
