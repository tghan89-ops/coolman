// lib/__tests__/media-upload-size.test.ts
// Covers the friendly oversized-image rejection path in collections/Media.ts
// so the user sees a readable message instead of a stream abort.
// Regression guard for UAT 5.5 — burned 2026-05-16.

import { describe, it, expect } from 'vitest'
import { Media } from '@/collections/Media'

function runBeforeValidate(fileSizeBytes: number | undefined) {
  const hook = Media.hooks?.beforeValidate?.[0] as
    | ((ctx: { req: any }) => void)
    | undefined
  if (!hook) throw new Error('beforeValidate hook missing on Media')
  hook({ req: { file: fileSizeBytes === undefined ? undefined : { size: fileSizeBytes } } })
}

describe('Media oversized-upload rejection', () => {
  it('throws a friendly message naming both the 5 MB cap and the actual size', () => {
    const eightMb = 8 * 1024 * 1024
    expect(() => runBeforeValidate(eightMb)).toThrowError(
      /Picture is too large.*5 MB.*8\.0 MB/,
    )
  })

  it('lets a file exactly at the 5 MB cap through', () => {
    expect(() => runBeforeValidate(5 * 1024 * 1024)).not.toThrow()
  })

  it('lets a small file through', () => {
    expect(() => runBeforeValidate(200 * 1024)).not.toThrow()
  })

  it('does nothing when no file is attached (non-upload validate calls)', () => {
    expect(() => runBeforeValidate(undefined)).not.toThrow()
  })
})
