// lib/__tests__/i18n.test.ts
import { describe, it, expect } from 'vitest'
import { COPY } from '../i18n/copy'

type AnyObj = Record<string, unknown>

function keyPaths(obj: AnyObj, prefix = ''): string[] {
  const out: string[] = []
  for (const k of Object.keys(obj)) {
    const p = prefix ? `${prefix}.${k}` : k
    const v = obj[k]
    if (v && typeof v === 'object') out.push(...keyPaths(v as AnyObj, p))
    else out.push(p)
  }
  return out.sort()
}

describe('i18n copy', () => {
  it('EN and BM have exactly the same key set (CLAUDE.md hard rule)', () => {
    const en = keyPaths(COPY.EN as AnyObj)
    const bm = keyPaths(COPY.BM as AnyObj)
    expect(bm).toEqual(en)
  })

  it('no BM string is left as an empty value', () => {
    const walk = (obj: AnyObj, path = ''): string[] => {
      const bad: string[] = []
      for (const k of Object.keys(obj)) {
        const p = path ? `${path}.${k}` : k
        const v = obj[k]
        if (v && typeof v === 'object') bad.push(...walk(v as AnyObj, p))
        else if (typeof v === 'string' && v.trim() === '') bad.push(p)
      }
      return bad
    }
    expect(walk(COPY.BM as AnyObj)).toEqual([])
  })
})
