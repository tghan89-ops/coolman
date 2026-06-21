/** Verify the home-page global after fix45: new strings present, old gone, field count intact. */
import { getPayload } from 'payload'
import config from '@payload-config'

function countFields(val: any): number {
  if (val == null) return 0
  if (typeof val !== 'object') return 1
  if (Array.isArray(val)) return val.reduce((n, v) => n + countFields(v), 0)
  return Object.keys(val).reduce((n, k) => n + countFields(val[k]), 0)
}

const MUST_HAVE = [
  'Diamond blades for concrete, granite and tile · Selangor, since 2007',
  'The Right Blade for ',
  'Concrete, Granite and Tile.',
  'Coolman makes diamond blades, core bits and cutting systems for concrete, granite and tile.',
  'Bilah berlian untuk konkrit, granit dan jubin',
  'Konkrit, Granit dan Jubin.',
  'Coolman buat bilah berlian, mata teras dan sistem pemotongan untuk konkrit',
  'Senang ambil, tak payah kejar katalog',
  'Nombor kami, kami tak sorok.',
  'kami lebih suka datang tengok sendiri',
  'Kami bagitahu pandangan kami dulu',
]
const MUST_BE_GONE = [
  'Manufacturer of cutting tools',
  'Right Job ',
  'Matched with the Right Blade.',
  'Pintu yang senyap',
  'Kami tidak sembunyikan kami punya.',
  'Pengeluar alat pemotong',
]

async function main() {
  const payload = await getPayload({ config })
  const g: any = await payload.findGlobal({ slug: 'home-page', depth: 0 })
  const blob = JSON.stringify(g)

  console.log('Leaf-field count (incl. meta):', countFields(g))
  console.log('\n--- MUST HAVE ---')
  let ok = true
  for (const s of MUST_HAVE) {
    const present = blob.includes(s)
    if (!present) ok = false
    console.log(`  [${present ? 'OK' : 'FAIL'}] ${s.slice(0, 60)}`)
  }
  console.log('\n--- MUST BE GONE ---')
  for (const s of MUST_BE_GONE) {
    const gone = !blob.includes(s)
    if (!gone) ok = false
    console.log(`  [${gone ? 'OK' : 'FAIL'}] ${s.slice(0, 60)}`)
  }
  // Em-dash check across the whole global
  const emdash = blob.includes('—')
  console.log(`\nEm-dash present anywhere: ${emdash ? 'YES (review)' : 'no'}`)
  console.log(`\nVERIFY ${ok ? 'PASSED' : 'FAILED'}`)
  process.exit(ok ? 0 : 1)
}
main().catch((e) => { console.error('FATAL:', e?.message ?? e); process.exit(1) })
