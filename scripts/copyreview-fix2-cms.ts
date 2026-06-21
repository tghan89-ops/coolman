/**
 * Fix 2 (numbers/dispatch) — CMS write for the 2 globals that hold the live strings.
 * SAFE: reads the FULL global, replaces exact known substrings everywhere, writes the
 * FULL object back (no partial update, so no sibling field can be dropped).
 *
 * Dry-run (default):  tsx --env-file=.env.local scripts/copyreview-fix2-cms.ts
 * Apply:              tsx --env-file=.env.local scripts/copyreview-fix2-cms.ts --apply
 *
 * Backups already taken by copyreview-backup-globals.ts before any --apply.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const APPLY = process.argv.includes('--apply')

const REPLACEMENTS: Record<string, Array<[string, string]>> = {
  'heritage-page': [
    ['96% on-time dispatch. Same-day cut-off at 2pm.', 'Dispatched from Selangor within 2 business days.'],
    ['96% hantar tepat waktu. Hadang hari sama jam 2 petang.', 'Dihantar dari Selangor dalam 2 hari bekerja.'],
  ],
  'shibuya-page': [
    [
      'Coolman has built diamond segments calibrated for Malaysian aggregate since 1998.',
      'Coolman has built diamond segments calibrated for Malaysian aggregate since 2007.',
    ],
    [
      'Coolman telah membina segmen berlian yang dikalibrasi untuk agregat Malaysia sejak 1998.',
      'Coolman telah membina segmen berlian yang dikalibrasi untuk agregat Malaysia sejak 2007.',
    ],
  ],
}

function deepReplace(val: any, pairs: Array<[string, string]>, hits: string[]): any {
  if (typeof val === 'string') {
    let s = val
    for (const [f, r] of pairs) {
      if (s.includes(f)) {
        s = s.split(f).join(r)
        hits.push(f)
      }
    }
    return s
  }
  if (Array.isArray(val)) return val.map((v) => deepReplace(v, pairs, hits))
  if (val && typeof val === 'object') {
    const o: any = {}
    for (const k of Object.keys(val)) o[k] = deepReplace(val[k], pairs, hits)
    return o
  }
  return val
}

async function main() {
  const payload = await getPayload({ config })
  let totalHits = 0
  for (const [slug, pairs] of Object.entries(REPLACEMENTS)) {
    const cur: any = await payload.findGlobal({ slug: slug as any, depth: 0 })
    const hits: string[] = []
    const next = deepReplace(cur, pairs, hits)
    delete next.id
    delete next.createdAt
    delete next.updatedAt
    delete next.globalType
    totalHits += hits.length
    console.log(`\n[${slug}] matched ${hits.length} expected string(s):`)
    for (const h of hits) console.log('   - ' + h.slice(0, 72) + (h.length > 72 ? '…' : ''))
    if (hits.length === 0) {
      console.log('   (no matches — nothing to do)')
      continue
    }
    if (APPLY) {
      await payload.updateGlobal({ slug: slug as any, data: next })
      console.log('   ✅ APPLIED to production.')
    } else {
      console.log('   (dry-run — no write)')
    }
  }
  console.log(`\n${APPLY ? 'Applied' : 'Dry-run'} complete. Total strings matched: ${totalHits} (expected 4).`)
  process.exit(0)
}

main().catch((e) => {
  console.error('FATAL:', e?.message ?? e)
  process.exit(1)
})
