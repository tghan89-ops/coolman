// lib/i18n/missing-keys.ts
//
// Dev-time guard: the EN and BM copy trees must have exactly the same shape.
// CLAUDE.md hard rule — "EN and BM files updated simultaneously, never one
// without the other". This walks both trees and logs any divergence so a
// half-translated string is caught the moment the page loads in development.

import { COPY } from './copy'

type AnyObj = Record<string, unknown>

function diffKeys(a: AnyObj, b: AnyObj, path: string, missingInB: string[], missingInA: string[]) {
  for (const key of Object.keys(a)) {
    const p = path ? `${path}.${key}` : key
    if (!(key in b)) {
      missingInB.push(p)
      continue
    }
    const av = a[key]
    const bv = b[key]
    if (av && bv && typeof av === 'object' && typeof bv === 'object') {
      diffKeys(av as AnyObj, bv as AnyObj, p, missingInB, missingInA)
    }
  }
  for (const key of Object.keys(b)) {
    const p = path ? `${path}.${key}` : key
    if (!(key in a)) missingInA.push(p)
  }
}

let alreadyAudited = false

export function auditCopyKeys() {
  if (alreadyAudited || process.env.NODE_ENV === 'production') return
  alreadyAudited = true
  const missingInBM: string[] = []
  const missingInEN: string[] = []
  diffKeys(COPY.EN as AnyObj, COPY.BM as AnyObj, '', missingInBM, missingInEN)
  if (missingInBM.length) {
    console.warn('[i18n] keys present in EN but missing in BM:', missingInBM)
  }
  if (missingInEN.length) {
    console.warn('[i18n] keys present in BM but missing in EN:', missingInEN)
  }
}
