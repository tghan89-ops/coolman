/**
 * Fix 4 (front door / 5-second test) + Fix 5 (Bahasa) — CMS write for the `home-page` global ONLY.
 *
 * SAFE: reads the FULL global (depth:0), writes a PREWRITE backup, applies targeted field
 * edits to the FULL object, strips id/createdAt/updatedAt/globalType, then updateGlobal with
 * the FULL object (no partial update — no sibling field can be dropped).
 *
 * Dry-run (default):  npx tsx --env-file=.env.local scripts/fix45-homepage.ts
 * Apply:              npx tsx --env-file=.env.local scripts/fix45-homepage.ts --apply
 *
 * NOTE: .env.local points at PRODUCTION. That is expected and authorized — no preview DB.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

const APPLY = process.argv.includes('--apply')
const SLUG = 'home-page' as const

// ---- Fix 4: explicit field VALUES for the `opening` group (front door) ----
// EN + BM together. Names the materials (concrete, granite, tile) + what Coolman makes,
// in Alan's plain voice, without restructuring the schema or killing the editorial tone.
const OPENING_SET: Record<string, string> = {
  eyebrow: 'Coolman · Diamond blades for concrete, granite and tile · Selangor, since 2007',
  headlinePrefix: 'The Right Blade for ',
  headlineEmphasis: 'Concrete, Granite and Tile.',
  lede:
    "Coolman makes diamond blades, core bits and cutting systems for concrete, granite and tile. We have built them in Selangor since 2007. Alan, our founder, has cut for a living since 1998, so every blade is matched to the rock, the rebar and the deadline a Malaysian site throws at it.",
  eyebrowBM: 'Coolman · Bilah berlian untuk konkrit, granit dan jubin · Selangor, sejak 2007',
  headlinePrefixBM: 'Bilah yang Betul untuk ',
  headlineEmphasisBM: 'Konkrit, Granit dan Jubin.',
  ledeBM:
    'Coolman buat bilah berlian, mata teras dan sistem pemotongan untuk konkrit, granit dan jubin. Kami bina di Selangor sejak 2007. Alan, pengasas kami, dah memotong sejak 1998, jadi setiap bilah dipadan dengan batu, besi tetulang dan tarikh akhir yang tapak Malaysia bagi.',
}

// ---- Fix 5: exact known BM strings to replace (idiomatic spoken-trade Malay) ----
// Each pair is [exactCurrentString, replacement]. Applied with deepReplace across the FULL object.
const BM_REPLACEMENTS: Array<[string, string]> = [
  // quietDoor.eyebrowBM — "Pintu yang senyap" is a baffling literal calque.
  ['Pintu yang senyap', 'Senang ambil, tak payah kejar katalog'],
  // quietDoor.ledeBM — "Tiada muka katalog. Tiada perlu memburu PDF." is stiff calque.
  [
    'Tiada muka katalog. Tiada perlu memburu PDF. Hanya inventori, spesifikasi, dan satu panggilan telefon jika bilah yang anda perlukan bukan yang kami senaraikan.',
    'Tak payah kejar katalog. Tak payah cari-cari PDF. Stok, spesifikasi, semua ada. Bilah yang anda nak tak ada dalam senarai? Telefon kami, kami uruskan.',
  ],
  // conversation.ledeBM — "kami punya" register clash + calque.
  [
    'Kebanyakan potongan bermula dengan satu panggilan telefon. Kami tidak sembunyikan kami punya.',
    'Kebanyakan kerja bermula dengan satu panggilan. Nombor kami, kami tak sorok.',
  ],
  // conversation.channels[Primary].bodyBM — "apa kami fikir / apa kami jual" reads machine-translated.
  [
    'Hantar gambar potongan, agregat, bilah. Kami akan beritahu apa kami fikir sebelum kami beritahu apa kami jual.',
    'Hantar gambar potongan, agregat dan bilah. Kami bagitahu pandangan kami dulu, bukan terus nak jual.',
  ],
  // conversation.channels[On site].bodyBM — "lebih rela datang melihat daripada meneka" slightly stiff.
  [
    'Jika potongan luar biasa, kami lebih rela datang melihat daripada meneka. Beritahu kami di mana dan bila.',
    'Kalau potongan tu pelik, kami lebih suka datang tengok sendiri daripada agak-agak. Bagitahu kami di mana dan bila.',
  ],
  // brotherhoodIntro.lede + ledeBM — em-dash banned in user-facing copy (BRAND-VOICE §2). EN+BM together.
  [
    'we treat you like a partner — not a customer number.',
    'we treat you like a partner, not a customer number.',
  ],
  [
    'kami layani anda seperti rakan kongsi — bukan nombor pelanggan.',
    'kami layani anda seperti rakan kongsi, bukan nombor pelanggan.',
  ],
]

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

function countFields(val: any): number {
  if (val == null) return 0
  if (typeof val !== 'object') return 1
  if (Array.isArray(val)) return val.reduce((n, v) => n + countFields(v), 0)
  return Object.keys(val).reduce((n, k) => n + countFields(val[k]), 0)
}

async function main() {
  const payload = await getPayload({ config })
  const cur: any = await payload.findGlobal({ slug: SLUG, depth: 0 })

  // (b) PREWRITE backup of the live object BEFORE any change.
  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = resolve(
    process.cwd(),
    '..',
    'copy-review',
    'cms-backup',
    `home-page.PREWRITE.${ts}.json`,
  )
  writeFileSync(backupPath, JSON.stringify(cur, null, 2), 'utf8')
  console.log(`PREWRITE backup written: ${backupPath}\n`)

  const beforeLeafCount = countFields(cur)

  // Build the next object: deep copy, apply Fix 5 string replacements, then Fix 4 field sets.
  const hits: string[] = []
  const next: any = deepReplace(cur, BM_REPLACEMENTS, hits)

  console.log('--- Fix 5 (Bahasa) string replacements ---')
  for (const [f] of BM_REPLACEMENTS) {
    const matched = hits.includes(f)
    console.log(`  [${matched ? 'OK' : 'MISS'}] ${f.slice(0, 64)}${f.length > 64 ? '…' : ''}`)
  }

  console.log('\n--- Fix 4 (front door) opening field sets ---')
  for (const [k, v] of Object.entries(OPENING_SET)) {
    const before = next.opening?.[k]
    if (before === undefined) {
      console.log(`  [MISS] opening.${k} does not exist — ABORT`)
      process.exit(1)
    }
    console.log(`  opening.${k}`)
    console.log(`    before: ${before}`)
    console.log(`    after : ${v}`)
    next.opening[k] = v
  }

  delete next.id
  delete next.createdAt
  delete next.updatedAt
  delete next.globalType

  const afterLeafCount = countFields(next) + 4 // +4 for the stripped meta fields
  console.log(`\nLeaf-field count — before: ${beforeLeafCount}, after(+meta): ${afterLeafCount}`)
  if (beforeLeafCount !== afterLeafCount) {
    console.log('  WARNING: leaf-field count changed — investigate before applying.')
  }

  const expectedFix5 = BM_REPLACEMENTS.length
  console.log(`Fix 5 matched ${new Set(hits).size}/${expectedFix5} expected BM strings.`)

  if (APPLY) {
    await payload.updateGlobal({ slug: SLUG, data: next })
    console.log('\n✅ APPLIED to production (home-page global).')
  } else {
    console.log('\n(dry-run — no write. Re-run with --apply to write.)')
  }
  process.exit(0)
}

main().catch((e) => {
  console.error('FATAL:', e?.message ?? e)
  process.exit(1)
})
