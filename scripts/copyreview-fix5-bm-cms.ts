/**
 * Fix 5 (Bahasa) — re-voice stiff/baku/calque/machine-translated BM strings into
 * natural SPOKEN TRADE MALAY across the 3 editorial globals owned by this pass:
 *   heritage-page, why-coolman-page, shibuya-page.
 *
 * EN is left untouched. Only *BM fields change.
 *
 * SAFE protocol (same as copyreview-fix2-cms.ts):
 *   - read FULL global (findGlobal depth:0)
 *   - back up the FULL object to copy-review/cms-backup/<slug>.PREWRITE.<stamp>.json
 *   - deep-replace exact known BM substrings everywhere in the FULL object
 *   - strip id/createdAt/updatedAt/globalType
 *   - updateGlobal with the FULL object (never partial)
 *
 * Dry-run (default):  tsx --env-file=.env.local scripts/copyreview-fix5-bm-cms.ts
 * Apply:              tsx --env-file=.env.local scripts/copyreview-fix5-bm-cms.ts --apply
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { writeFileSync, mkdirSync } from 'fs'

const APPLY = process.argv.includes('--apply')
const BACKUP_DIR = 'C:/Users/Tan Guan Han/Apps/Coolman/copy-review/cms-backup'

// Each pair: [exact current BM string, natural spoken-trade BM rewrite].
// Faithful to the EN meaning; only de-stiffens / removes calque.
const REPLACEMENTS: Record<string, Array<[string, string]>> = {
  'heritage-page': [
    // hero
    [
      'Coolman, sejak 2007. Sembilan belas tahun potongan yang mengajar kami bagaimana membina bilah.',
      'Coolman, sejak 2007. Sembilan belas tahun memotong yang ajar kami macam mana nak buat bilah.',
    ],
    [
      'Sejarah ringkas sebuah syarikat alat berlian Malaysia. Diasaskan di Selangor oleh seorang tukang yang telah berada dalam bidang pemotongan sejak 1998.',
      'Sejarah ringkas sebuah syarikat alat berlian Malaysia. Dimulakan di Selangor oleh seorang tukang yang dah dalam kerja memotong sejak 1998.',
    ],
    // pj2007
    [
      'Coolman bermula di satu unit sewa di Selangor pada 2007. Dua mesin penekan segmen, sebuah meja, dan satu telefon yang berdering terlalu kerap. Alan, pengasas, telah menghabiskan sembilan tahun dalam bidang pemotongan dan akhirnya mendengar satu aduan terlalu banyak tentang bilah yang tidak sesuai untuk batu kita.',
      'Coolman bermula di satu unit sewa di Selangor pada 2007. Dua mesin penekan segmen, satu meja, dan satu telefon yang asyik berdering. Alan, pengasasnya, dah sembilan tahun dalam kerja memotong, dan akhirnya dengar dah cukup banyak aduan pasal bilah yang tak makan dengan batu kita.',
    ],
    [
      'Tahun pertama senyap. Tahun kedua tidak. Menjelang akhir 2008, bengkel itu beroperasi dua syif.',
      'Tahun pertama lengang. Tahun kedua tak. Hujung 2008, bengkel dah jalan dua syif.',
    ],
    // founding
    [
      'Selepas sembilan tahun dalam bidang, seorang tukang memulakan syarikat sendiri.',
      'Lepas sembilan tahun dalam kerja ni, seorang tukang buka syarikat sendiri.',
    ],
    [
      'Alan telah menjual bilah syarikat lain sejak 1998. Beliau telah menyaksi tiga perkara yang sama berlaku salah di tapak, berulang kali. Harga sebagai ukuran nilai. Pengedar yang tidak pernah memegang bilah. Bilah import yang berfungsi di Jepun dan gagal di Selangor.',
      'Alan jual bilah syarikat orang lain sejak 1998. Dia tengok tiga benda yang sama jadi silap di tapak, berulang-ulang kali. Orang ukur nilai ikut harga je. Pengedar yang tak pernah pegang bilah. Bilah import yang elok di Jepun tapi gagal di Selangor.',
    ],
    [
      'Pada 2007, beliau berhenti menjelaskan bilah orang lain dan mula membuat bilah sendiri. Coolman adalah hasilnya.',
      'Pada 2007, dia berhenti menerangkan bilah orang lain dan mula buat bilah sendiri. Coolman lah hasilnya.',
    ],
    // workshopDay
    [
      'Seorang kontraktor di Shah Alam menelefon pada jam 11 malam. Bilah yang kami jual kepadanya pada pagi itu tidak dapat menembusi pancang kedua. Alan memandu ke tapak. Beliau melihat potongan itu. Agregat lebih tajam daripada yang spesifikasi ramalkan. Ikatan bilah itu salah.',
      'Seorang kontraktor di Shah Alam telefon pukul 11 malam. Bilah yang kami jual kat dia pagi tu tak lepas pancang kedua. Alan pandu terus ke tapak. Dia tengok sendiri potongan tu. Agregatnya lagi tajam daripada apa yang spec cakap. Ikatan bilah tu salah.',
    ],
    [
      'Bilah itu direka semula dalam empat minggu seterusnya. Formulasi baru, sandwic kobalt, menjadi asas barisan CM-X hari ini. Bengkel itu menjadi pengeluar pada hari Alan menerima kontraktor itu betul dan helaian spesifikasi itu salah. (Tahun TBC. Alan untuk sahkan tahun.)',
      'Bilah tu direka semula dalam empat minggu lepas tu. Formulasi baru, sandwic kobalt, jadi asas barisan CM-X sampai hari ni. Bengkel jadi pengeluar hari Alan mengaku kontraktor tu betul dan spec sheet tu yang salah. (Tahun TBC. Alan untuk sahkan tahun.)',
    ],
    // shibuyaYears
    [
      'Pada 2014, Coolman menandatangani perjanjian pengedaran eksklusif Malaysia untuk penggerudi teras Shibuya. Ia diperbaharui setiap tahun sejak itu. Mesin yang sama, dibuat di Jepun, disokong oleh pasukan kejuruteraan Malaysia yang telah melihat potongan yang ia sebenarnya buat.',
      'Pada 2014, Coolman tandatangan perjanjian pengedaran eksklusif Malaysia untuk gerudi teras Shibuya. Diperbaharui tiap-tiap tahun sejak tu. Mesin yang sama, buatan Jepun, disokong oleh pasukan kejuruteraan Malaysia yang dah tengok sendiri potongan yang mesin tu betul-betul buat.',
    ],
    [
      'Shibuya membuat penggerudi. Coolman memastikan penggerudi itu adalah jawapan yang tepat kepada potongan di hadapan anda.',
      'Shibuya buat gerudi. Coolman pastikan gerudi tu jawapan yang betul untuk potongan depan mata anda.',
    ],
    // hardestYear
    [
      'Dalam satu batch pengeluaran, agen pengikat yang salah digunakan. Bilah lulus ujian kilang. Ia gagal di tapak. Kami menarik balik setiap unit, menggantikan setiap satu, dan menanggung kos.',
      'Dalam satu kelompok pengeluaran, agen pengikat yang salah terpakai. Bilah lulus ujian kilang. Tapi gagal di tapak. Kami tarik balik tiap-tiap unit, ganti satu-satu, dan tanggung sendiri kosnya.',
    ],
    [
      'Apa yang kami kekalkan ialah pangkalan pelanggan. Tiada seorang pengedar Brotherhood meninggalkan. Kontraktor yang menerima bilah gagal menerima penggantian, permohonan maaf, dan satu bilah kedua percuma. Kebanyakan mereka masih bersama kami. Perniagaan bukan perlumbaan siapa boleh berkembang paling cepat. Ia adalah soalan siapa boleh bertahan paling lama.',
      'Apa yang kami kekalkan ialah pelanggan kami. Tak ada seorang pun pengedar Brotherhood yang lari. Kontraktor yang dapat bilah gagal tu dapat ganti, maaf kami, dan satu bilah kedua percuma. Kebanyakan mereka masih dengan kami sampai sekarang. Bisnes bukan lumba siapa boleh besar paling cepat. Bisnes pasal siapa boleh bertahan paling lama.',
    ],
    // twentyYears
    [
      'Syarikat yang sama. Inventori yang lebih besar. Lebih banyak Field Notes dalam arkib. Talian terus yang sama ke kejuruteraan. Jawapan yang sama apabila seorang kontraktor menelefon pada jam 11 malam.',
      'Syarikat yang sama. Stok yang lebih besar. Lebih banyak Nota Lapangan dalam arkib. Talian terus yang sama ke kejuruteraan. Jawapan yang sama bila kontraktor telefon pukul 11 malam.',
    ],
    [
      'Coolman dibina untuk bertahan lebih lama daripada pengasasnya. Itu satu-satunya ukuran kejayaan yang kami percaya.',
      'Coolman dibina untuk hidup lebih lama daripada pengasasnya. Itu saja ukuran kejayaan yang kami percaya.',
    ],
    // timeline
    [
      'Sembilan belas tahun pada satu halaman.',
      'Sembilan belas tahun dalam satu halaman.',
    ],
    [
      'Selepas sebuah kerja pancang di Shah Alam mengajar kami spesifikasi adalah salah.',
      'Lepas satu kerja pancang di Shah Alam ajar kami yang spec tu salah.',
    ],
    [
      'Pengesahan bebas spesifikasi ikatan kami.',
      'Pengesahan bebas untuk spesifikasi ikatan kami.',
    ],
  ],

  'why-coolman-page': [
    // hero
    [
      'Ada satu sebab syarikat ini wujud. Bon Eropah tidak dibina untuk agregat Malaysia. Kami telah memotongnya sejak 1998 — kami tahu apa yang perlu diubah, dan kami ubahnya dalam matriks, bukan pemasaran.',
      'Ada satu sebab syarikat ni wujud. Bon Eropah memang tak dibuat untuk agregat Malaysia. Kami dah memotongnya sejak 1998, jadi kami tahu apa yang kena ubah, dan kami ubah dalam matriks, bukan dalam pemasaran.',
    ],
    // folio01
    [
      'Apa yang tanah sebenarnya lakukan kepada segmen.',
      'Apa sebenarnya tanah buat pada segmen.',
    ],
    [
      'Kebanyakan alat pemotong yang dijual di Malaysia dikalibrasi untuk agregat Eropah. Silika Malaysia lebih panas, lebih keras dan kurang dapat diramal. Kami membina formulasi bon kami di sekitar masalah khusus itu.',
      'Kebanyakan alat pemotong yang dijual di Malaysia dikalibrasi untuk agregat Eropah. Silika Malaysia lebih panas, lebih keras dan susah nak dijangka. Kami bina formulasi bon kami khas untuk masalah tu.',
    ],
    [
      'Bilah yang mengaca pada agregat Malaysia bukan bilah yang murah. Ia adalah bilah yang dibuat untuk negara lain.',
      'Bilah yang mengaca pada agregat Malaysia bukannya bilah murah. Ia bilah yang dibuat untuk negara lain.',
    ],
    [
      'Itu kedengaran jelas. Itulah bukan cara kebanyakan alat berlian yang dijual di Malaysia dibina. Kebanyakan pasaran adalah bilah siap yang diimport dari Eropah, dikalibrasi untuk agregat berasaskan batu kapur, silika rendah, mineralogi yang dapat diramal. Mereka adalah bilah yang sangat baik. Mereka tidak direka untuk tanah di sini.',
      'Bunyi macam benda biasa. Tapi bukan macam tu kebanyakan alat berlian yang dijual di Malaysia dibuat. Sebahagian besar pasaran ni bilah siap yang diimport dari Eropah, dikalibrasi untuk agregat batu kapur, silika rendah, mineralogi yang senang dijangka. Bilah-bilah tu memang bagus. Cuma ia bukan dibuat untuk tanah kita di sini.',
    ],
    [
      'Agregat Malaysia melebihi 60% kandungan silika. Halus lebih tajam, kandungan kuarza lebih tinggi, dan matriks yang memegang segmen pemotong berlian perlu melepaskan berlian dengan lebih pantas atau segmen mengaca dan berhenti memotong.',
      'Agregat Malaysia kandungan silikanya lebih 60%. Habuknya lebih tajam, kuarzanya lebih tinggi, dan matriks yang pegang segmen berlian tu kena lepas berlian lebih laju, kalau tak segmen akan mengaca dan berhenti memotong.',
    ],
    [
      'Formulasi bon kami dibangunkan selama sembilan belas tahun melihat apa yang berlaku kepada bilah generik di tapak Malaysia — dan menyesuaikannya. Kami tidak mengimport formula Eropah dan meletak jenama semula. Kami mengeluar mengikut spesifikasi yang ditulis untuk tanah ini.',
      'Formulasi bon kami dibangunkan selama sembilan belas tahun, tengok apa jadi pada bilah biasa di tapak Malaysia, dan ubah ikut keadaan. Kami tak import formula Eropah lepas tu tampal jenama sendiri. Kami buat ikut spesifikasi yang ditulis khas untuk tanah ni.',
    ],
    // folio02
    [
      'Ia mahal dengan cara yang tidak ditunjukkan oleh invois.',
      'Ia mahal dengan cara yang invois tak tunjuk.',
    ],
    [
      'Jumlah kos bilah bukan harga belian. Ia adalah bilangan potongan, masa per potongan, masa henti apabila ia gagal, dan kos krew berdiri diam sambil anda menunggu penggantian.',
      'Jumlah kos sebenar bilah bukan harga belinya. Ia berapa banyak potongan ia buat, masa setiap potongan, masa terbuang bila ia gagal, dan kos krew tercegat menunggu ganti.',
    ],
    [
      'Industri terus membeli bilah yang lebih murah kerana invois adalah satu-satunya nombor yang tiba di meja.',
      'Industri asyik beli bilah yang lebih murah sebab invois je nombor yang sampai atas meja.',
    ],
    [
      'Kami telah mengira angka ini di ratusan tapak. Bilah yang berharga 30% lebih murah dan tahan 40% lebih sedikit potongan adalah lebih mahal — sebelum anda mengambil kira kos masa henti apabila ia gagal di tengah kerja. Industri tahu ini. Ia terus membeli bilah yang lebih murah kerana invois adalah satu-satunya nombor yang tiba di meja.',
      'Kami dah kira angka ni di ratusan tapak. Bilah yang 30% lebih murah tapi tahan 40% kurang potongan sebenarnya lagi mahal, belum kira lagi kos masa terbuang bila ia gagal tengah-tengah kerja. Industri tahu hal ni. Tapi masih beli bilah yang lebih murah sebab invois je nombor yang sampai atas meja.',
    ],
    [
      'Kami menunjukkan kepada pelanggan kami nombor penuh. Hayat per potongan, bukan harga per bilah. Apabila anda menjalankan perbandingan dengan betul, bilah Coolman yang beroperasi pada kelajuan penuh pada agregat Malaysia hampir selalu lebih murah per meter potongan berbanding alternatif — dan alternatif itu tidak datang dengan seseorang yang akan mengangkat telefon pada jam 11 malam.',
      'Kami tunjuk pelanggan kami nombor penuhnya. Berapa lama tahan per potongan, bukan harga per bilah. Bila anda banding betul-betul, bilah Coolman yang jalan laju penuh pada agregat Malaysia hampir selalu lebih murah per meter potongan berbanding bilah lain, dan bilah lain tu tak datang sekali dengan orang yang sanggup angkat telefon pukul 11 malam.',
    ],
    // folio03
    [
      'Setiap pengedar dan kontraktor yang membawa Coolman mendapat akses terus ke kejuruteraan — bukan program mata, bukan struktur rebat. Jika anda mempunyai potongan yang belum kami lihat sebelum ini, kami ingin mendengarnya.',
      'Setiap pengedar dan kontraktor yang bawa Coolman dapat akses terus ke kejuruteraan, bukan program mata, bukan struktur rebat. Kalau anda ada potongan yang kami belum pernah jumpa, kami nak dengar.',
    ],
    [
      'Jika potongan gagal, anda tidak menghubungi pengedar. Anda telefon saya.',
      'Kalau potongan gagal, anda tak telefon pengedar. Anda telefon saya.',
    ],
    [
      'Sistem Brotherhood bukan program kesetiaan. Ia adalah cara kami bekerja. Pengedar yang membawa bilah kami mendapat talian terus kepada orang yang merekanya. Kontraktor yang menggunakan bilah kami mendapat perkara yang sama. Jika potongan gagal, anda tidak menghubungi pengedar yang menghubungi wakil wilayah yang membuat tiket. Anda telefon saya.',
      'Sistem Brotherhood bukan program kesetiaan. Ia memang cara kami bekerja. Pengedar yang bawa bilah kami dapat talian terus kepada orang yang reka bilah tu. Kontraktor yang guna bilah kami pun sama. Kalau potongan gagal, anda tak payah telefon pengedar yang telefon wakil wilayah yang buka tiket. Anda telefon saya.',
    ],
    [
      'Ini bukan promosi jualan. Ia adalah gambaran bagaimana perniagaan telah beroperasi sejak 2007. Kami mempunyai pelanggan yang telah bersama kami selama lima belas tahun. Sebabnya bukan harga. Sebabnya ialah apabila sesuatu yang salah berlaku di tapak mereka, kami ada.',
      'Ini bukan ayat jualan. Ini cara bisnes kami berjalan sejak 2007. Ada pelanggan yang dah lima belas tahun dengan kami. Bukan sebab harga. Sebabnya bila ada benda jadi silap di tapak mereka, kami ada di situ.',
    ],
    // closingCta
    [
      'Kebanyakan kontraktor yang menemui Coolman berbuat demikian selepas bilah mengecewakan mereka pada kerja yang penting. Kami lebih suka bertemu anda sebelum itu berlaku. Hantar gambar potongan, agregat, bilah anda. Kami akan beritahu apa yang kami fikir.',
      'Kebanyakan kontraktor jumpa Coolman lepas bilah kecewakan mereka pada kerja yang penting. Kami lebih suka jumpa anda sebelum benda tu jadi. Hantar gambar potongan, agregat, dan bilah anda. Kami beritahu apa pandangan kami.',
    ],
  ],

  'shibuya-page': [
    // hero
    [
      'Shibuya Tools, Hiroshima, telah membina mesin penggerudi teras berketepatan sejak 1952. Coolman telah membina segmen berlian yang dikalibrasi untuk agregat Malaysia sejak 2007.',
      'Shibuya Tools, Hiroshima, dah membina mesin gerudi teras berketepatan sejak 1952. Coolman pula dah membina segmen berlian yang dikalibrasi untuk agregat Malaysia sejak 2007.',
    ],
    // machineStory
    [
      'Setiap pihak melakukan apa yang pihak lain tidak akan lakukan. Hasilnya adalah pasangan mesin dan mata yang mana tidak ada separuh yang perlu berkompromi.',
      'Setiap pihak buat apa yang pihak satu lagi tak buat. Hasilnya pasangan mesin dan mata di mana tak ada sebelah pun yang kena berkompromi.',
    ],
    [
      'Mesin itu Jepun. Ikatan itu Malaysia.',
      'Mesinnya Jepun. Ikatannya Malaysia.',
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
  mkdirSync(BACKUP_DIR, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  let totalHits = 0
  let totalExpected = 0

  for (const [slug, pairs] of Object.entries(REPLACEMENTS)) {
    totalExpected += pairs.length
    const cur: any = await payload.findGlobal({ slug: slug as any, depth: 0 })

    // PREWRITE backup of the FULL object before any change.
    if (APPLY) {
      const bpath = `${BACKUP_DIR}/${slug}.PREWRITE.${stamp}.json`
      writeFileSync(bpath, JSON.stringify(cur, null, 2), 'utf8')
      console.log(`[${slug}] backup -> ${bpath}`)
    }

    const hits: string[] = []
    const next = deepReplace(cur, pairs, hits)
    delete next.id
    delete next.createdAt
    delete next.updatedAt
    delete next.globalType

    totalHits += hits.length
    console.log(`\n[${slug}] matched ${hits.length}/${pairs.length} expected BM string(s):`)
    const matchedSet = new Set(hits)
    for (const [f] of pairs) {
      const mark = matchedSet.has(f) ? '  ok ' : ' MISS'
      console.log(`  [${mark}] ${f.slice(0, 64)}${f.length > 64 ? '…' : ''}`)
    }

    if (hits.length !== pairs.length) {
      console.log(`  ⚠️  MATCH COUNT MISMATCH for ${slug} — expected ${pairs.length}, got ${hits.length}.`)
    }

    if (APPLY) {
      if (hits.length === 0) {
        console.log('   (no matches — skipping write)')
      } else {
        await payload.updateGlobal({ slug: slug as any, data: next })
        console.log('   ✅ APPLIED to production.')
      }
    } else {
      console.log('   (dry-run — no write)')
    }
  }

  console.log(
    `\n${APPLY ? 'Applied' : 'Dry-run'} complete. Total BM strings matched: ${totalHits} (expected ${totalExpected}).`,
  )
  process.exit(totalHits === totalExpected ? 0 : 2)
}

main().catch((e) => {
  console.error('FATAL:', e?.message ?? e)
  process.exit(1)
})
