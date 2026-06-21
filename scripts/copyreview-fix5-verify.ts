/** READ-ONLY verification for fix5. Confirms new BM in, old BM gone, EN sentinels intact. */
import { getPayload } from 'payload'
import config from '@payload-config'

const checks: Record<string, { newIn: string[]; oldGone: string[]; enIntact: string[] }> = {
  'heritage-page': {
    newIn: [
      'ajar kami macam mana nak buat bilah',
      'dah dalam kerja memotong sejak 1998',
      'Lebih banyak Nota Lapangan dalam arkib',
      'Dalam satu kelompok pengeluaran',
    ],
    oldGone: [
      'potongan yang mengajar kami bagaimana membina bilah',
      'telah berada dalam bidang pemotongan sejak 1998',
      'Lebih banyak Field Notes dalam arkib',
      'Dalam satu batch pengeluaran',
    ],
    enIntact: [
      'Coolman, since 2007. Nineteen years of cuts that taught us how to build the blade.',
      'Dispatched from Selangor within 2 business days.',
    ],
  },
  'why-coolman-page': {
    newIn: [
      'Ada satu sebab syarikat ni wujud',
      'Kalau potongan gagal, anda tak telefon pengedar. Anda telefon saya.',
      'invois je nombor yang sampai atas meja',
    ],
    oldGone: [
      'Ada satu sebab syarikat ini wujud',
      'Jika potongan gagal, anda tidak menghubungi pengedar. Anda telefon saya.',
      'invois adalah satu-satunya nombor yang tiba di meja.',
    ],
    enIntact: [
      'If a cut goes wrong, you do not call a distributor. You call me.',
      'A bond built for the ground',
    ],
  },
  'shibuya-page': {
    newIn: ['Mesinnya Jepun. Ikatannya Malaysia.', 'Coolman pula dah membina segmen berlian'],
    oldGone: ['Mesin itu Jepun. Ikatan itu Malaysia.'],
    enIntact: [
      'The machine is Japanese. The bond is Malaysian.',
      'Coolman has built diamond segments calibrated for Malaysian aggregate since 2007.',
    ],
  },
}

async function main() {
  const payload = await getPayload({ config })
  let fail = 0
  for (const [slug, c] of Object.entries(checks)) {
    const g: any = await payload.findGlobal({ slug: slug as any, depth: 0 })
    const blob = JSON.stringify(g)
    const fieldCount = Object.keys(g).filter(
      (k) => !['id', 'createdAt', 'updatedAt', 'globalType'].includes(k),
    ).length
    console.log(`\n[${slug}] top-level field count: ${fieldCount}`)
    for (const s of c.newIn) {
      const ok = blob.includes(s)
      if (!ok) fail++
      console.log(`  new BM   ${ok ? 'PRESENT ' : 'MISSING!'} : ${s.slice(0, 50)}`)
    }
    for (const s of c.oldGone) {
      const gone = !blob.includes(s)
      if (!gone) fail++
      console.log(`  old BM   ${gone ? 'GONE    ' : 'STILL THERE!'} : ${s.slice(0, 50)}`)
    }
    for (const s of c.enIntact) {
      const ok = blob.includes(s)
      if (!ok) fail++
      console.log(`  EN       ${ok ? 'INTACT  ' : 'CHANGED!'} : ${s.slice(0, 50)}`)
    }
  }
  console.log(`\n${fail === 0 ? '✅ ALL VERIFICATION CHECKS PASSED' : `❌ ${fail} CHECK(S) FAILED`}`)
  process.exit(fail === 0 ? 0 : 1)
}

main().catch((e) => {
  console.error('FATAL:', e?.message ?? e)
  process.exit(1)
})
