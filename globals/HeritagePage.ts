import type { GlobalConfig } from 'payload'
import { bilingualTabs } from '@/lib/admin/bilingualTabs'

function sectionGroup(
  name: string,
  defs: {
    eyebrow: string; eyebrowBM: string
    headline: string; headlineBM: string
    note?: string; noteBM?: string
    paragraphs: Array<{ paragraph: string; paragraphBM: string }>
  },
) {
  const fields: Parameters<typeof Object.assign>[0][] = [
    { name: 'eyebrow',    type: 'text' as const, defaultValue: defs.eyebrow },
    { name: 'eyebrowBM',  type: 'text' as const, defaultValue: defs.eyebrowBM },
    { name: 'headline',   type: 'text' as const, defaultValue: defs.headline },
    { name: 'headlineBM', type: 'text' as const, defaultValue: defs.headlineBM },
  ]
  if (defs.note !== undefined) {
    fields.push(
      { name: 'note',   type: 'text' as const, defaultValue: defs.note,   admin: { description: 'Optional editorial note shown under the headline.' } },
      { name: 'noteBM', type: 'text' as const, defaultValue: defs.noteBM },
    )
  }
  fields.push({
    name: 'paragraphs',
    type: 'array' as const,
    defaultValue: defs.paragraphs,
    fields: bilingualTabs([
      { name: 'paragraph',   type: 'textarea' as const, required: true },
      { name: 'paragraphBM', type: 'textarea' as const },
    ]),
  })
  return { name, type: 'group' as const, fields: bilingualTabs(fields as any) }
}

export const HeritagePage: GlobalConfig = {
  slug: 'heritage-page',
  access: { read: () => true },
  admin: {
    livePreview: {
      url: () => `${process.env.NEXT_PUBLIC_SERVER_URL}/heritage`,
    },
  },
  fields: [
    // ── HERO ───────────────────────────────────────────────────────────────
    {
      name: 'hero',
      type: 'group',
      fields: bilingualTabs([
        { name: 'eyebrow',    type: 'text',     defaultValue: 'Heritage' },
        { name: 'eyebrowBM',  type: 'text',     defaultValue: 'Warisan' },
        { name: 'headline',   type: 'textarea', defaultValue: 'Coolman, since 2007. Nineteen years of cuts that taught us how to build the blade.' },
        { name: 'headlineBM', type: 'textarea', defaultValue: 'Coolman, sejak 2007. Sembilan belas tahun potongan yang mengajar kami bagaimana membina bilah.' },
        { name: 'lede',       type: 'textarea', defaultValue: 'A short history of a Malaysian diamond tools company. Founded in Petaling Jaya by a tradesman who had been in the cutting trade since 1998.' },
        { name: 'ledeBM',     type: 'textarea', defaultValue: 'Sejarah ringkas sebuah syarikat alat berlian Malaysia. Diasaskan di Petaling Jaya oleh seorang tukang yang telah berada dalam bidang pemotongan sejak 1998.' },
      ]),
    },

    // ── PJ, 2007 ───────────────────────────────────────────────────────────
    sectionGroup('pj2007', {
      eyebrow: 'PJ, 2007', eyebrowBM: 'PJ, 2007',
      headline: 'A workshop on a side road in Petaling Jaya.',
      headlineBM: 'Sebuah bengkel di jalan kecil di Petaling Jaya.',
      paragraphs: [
        {
          paragraph: 'Coolman started in a single rented unit in Petaling Jaya in 2007. Two segment presses, a bench, and a phone that rang too often. Alan, the founder, had spent nine years in the cutting trade and had finally heard one complaint too many about blades that did not fit the rock.',
          paragraphBM: 'Coolman bermula di satu unit sewa di Petaling Jaya pada 2007. Dua mesin penekan segmen, sebuah meja, dan satu telefon yang berdering terlalu kerap. Alan, pengasas, telah menghabiskan sembilan tahun dalam bidang pemotongan dan akhirnya mendengar satu aduan terlalu banyak tentang bilah yang tidak sesuai untuk batu kita.',
        },
        {
          paragraph: 'The first year was quiet. The second was not. By the end of 2008, the workshop was running two shifts.',
          paragraphBM: 'Tahun pertama senyap. Tahun kedua tidak. Menjelang akhir 2008, bengkel itu beroperasi dua syif.',
        },
      ],
    }),

    // ── THE FOUNDING DECISION ──────────────────────────────────────────────
    sectionGroup('founding', {
      eyebrow: 'The founding decision', eyebrowBM: 'Keputusan pengasasan',
      headline: 'After nine years in the trade, a tradesman started his own.',
      headlineBM: 'Selepas sembilan tahun dalam bidang, seorang tukang memulakan syarikat sendiri.',
      paragraphs: [
        {
          paragraph: "Alan had been selling other companies' blades since 1998. He had watched the same three things go wrong on site, again and again. Price as the proxy for value. Dealers who had never held a blade. Imported blades that performed in Japan and failed in Selangor.",
          paragraphBM: 'Alan telah menjual bilah syarikat lain sejak 1998. Beliau telah menyaksi tiga perkara yang sama berlaku salah di tapak, berulang kali. Harga sebagai ukuran nilai. Pengedar yang tidak pernah memegang bilah. Bilah import yang berfungsi di Jepun dan gagal di Selangor.',
        },
        {
          paragraph: "In 2007, he stopped explaining other people's blades and started making his own. Coolman is the result.",
          paragraphBM: 'Pada 2007, beliau berhenti menjelaskan bilah orang lain dan mula membuat bilah sendiri. Coolman adalah hasilnya.',
        },
      ],
    }),

    // ── THE DAY IT STOPPED BEING A WORKSHOP ───────────────────────────────
    sectionGroup('workshopDay', {
      eyebrow: 'The day it stopped being a workshop', eyebrowBM: 'Hari ia berhenti menjadi bengkel',
      headline: 'A piling job that ended in a redesign.',
      headlineBM: 'Sebuah kerja pancang yang berakhir dengan reka bentuk semula.',
      note: 'Year TBC. Alan to supply.', noteBM: 'Tahun TBC. Alan untuk sahkan tahun.',
      paragraphs: [
        {
          paragraph: "A contractor in Shah Alam called at 11pm. The blade we'd sold him that morning had not made it through the second pile. Alan drove out. He watched the cut. The aggregate was sharper than the spec had predicted. The bond was wrong.",
          paragraphBM: 'Seorang kontraktor di Shah Alam menelefon pada jam 11 malam. Bilah yang kami jual kepadanya pada pagi itu tidak dapat menembusi pancang kedua. Alan memandu ke tapak. Beliau melihat potongan itu. Agregat lebih tajam daripada yang spesifikasi ramalkan. Ikatan bilah itu salah.',
        },
        {
          paragraph: 'The blade was redesigned over the next four weeks. The new formulation, sandwich cobalt, became what the CM-X line is built on today. The workshop became a manufacturer the day Alan accepted that the contractor was right and the spec sheet was wrong. (Year TBC. Alan to supply.)',
          paragraphBM: 'Bilah itu direka semula dalam empat minggu seterusnya. Formulasi baru, sandwic kobalt, menjadi asas barisan CM-X hari ini. Bengkel itu menjadi pengeluar pada hari Alan menerima kontraktor itu betul dan helaian spesifikasi itu salah. (Tahun TBC. Alan untuk sahkan tahun.)',
        },
      ],
    }),

    // ── TWELVE YEARS WITH SHIBUYA ──────────────────────────────────────────
    sectionGroup('shibuyaYears', {
      eyebrow: 'Twelve years with Shibuya', eyebrowBM: 'Dua belas tahun bersama Shibuya',
      headline: 'Signed 2014. Renewed every year since.',
      headlineBM: 'Ditandatangani 2014. Diperbaharui setiap tahun sejak itu.',
      paragraphs: [
        {
          paragraph: 'In 2014 Coolman signed the exclusive Malaysian distribution agreement for Shibuya core drills. Twelve years on, it has been renewed every year. The same machines built in Japan since 1923, supported by a Malaysian engineering team that has seen the cuts they actually do.',
          paragraphBM: 'Pada 2014, Coolman menandatangani perjanjian pengedaran eksklusif Malaysia untuk penggerudi teras Shibuya. Dua belas tahun kemudian, ia diperbaharui setiap tahun. Mesin yang sama dibuat di Jepun sejak 1923, disokong oleh pasukan kejuruteraan Malaysia yang telah melihat potongan yang ia sebenarnya buat.',
        },
        {
          paragraph: 'Shibuya makes the drill. Coolman makes sure the drill is the right answer to the cut in front of you.',
          paragraphBM: 'Shibuya membuat penggerudi. Coolman memastikan penggerudi itu adalah jawapan yang tepat kepada potongan di hadapan anda.',
        },
      ],
    }),

    // ── THE HARDEST YEAR ───────────────────────────────────────────────────
    sectionGroup('hardestYear', {
      eyebrow: 'The hardest year', eyebrowBM: 'Tahun paling sukar',
      headline: 'The product recall, and what came after.',
      headlineBM: 'Penarikan balik produk, dan apa yang berlaku selepasnya.',
      paragraphs: [
        {
          paragraph: 'In one production batch, the wrong bonding agent was used. The blades passed factory test. They failed on site. We recalled every unit, replaced every one, and wrote off the cost.',
          paragraphBM: 'Dalam satu batch pengeluaran, agen pengikat yang salah digunakan. Bilah lulus ujian kilang. Ia gagal di tapak. Kami menarik balik setiap unit, menggantikan setiap satu, dan menanggung kos.',
        },
        {
          paragraph: "What we kept was the customer base. Not one Brotherhood dealer left. The contractors who got the failed blade got the replacement, the apology, and a free second blade. Most of them are still with us. Business isn't a race for who can grow fastest. It's a question of who can endure longest.",
          paragraphBM: 'Apa yang kami kekalkan ialah pangkalan pelanggan. Tiada seorang pengedar Brotherhood meninggalkan. Kontraktor yang menerima bilah gagal menerima penggantian, permohonan maaf, dan satu bilah kedua percuma. Kebanyakan mereka masih bersama kami. Perniagaan bukan perlumbaan siapa boleh berkembang paling cepat. Ia adalah soalan siapa boleh bertahan paling lama.',
        },
      ],
    }),

    // ── TWENTY YEARS FROM NOW ──────────────────────────────────────────────
    sectionGroup('twentyYears', {
      eyebrow: 'Twenty years from now', eyebrowBM: 'Dua puluh tahun dari sekarang',
      headline: "What we want Coolman to be when Alan's children run it.",
      headlineBM: 'Apa yang kami mahukan Coolman menjadi apabila anak-anak Alan menjalankannya.',
      paragraphs: [
        {
          paragraph: 'The same company. Larger inventory. More Field Notes in the archive. The same direct line to engineering. The same answer when a contractor calls at 11pm.',
          paragraphBM: 'Syarikat yang sama. Inventori yang lebih besar. Lebih banyak Field Notes dalam arkib. Talian terus yang sama ke kejuruteraan. Jawapan yang sama apabila seorang kontraktor menelefon pada jam 11 malam.',
        },
        {
          paragraph: 'Coolman is built to outlast its founder. That is the only metric of success we trust.',
          paragraphBM: 'Coolman dibina untuk bertahan lebih lama daripada pengasasnya. Itu satu-satunya ukuran kejayaan yang kami percaya.',
        },
      ],
    }),

    // ── THE TIMELINE ───────────────────────────────────────────────────────
    {
      name: 'timeline',
      type: 'group',
      fields: bilingualTabs([
        { name: 'eyebrow',    type: 'text', defaultValue: 'The timeline' },
        { name: 'eyebrowBM',  type: 'text', defaultValue: 'Garis masa' },
        { name: 'headline',   type: 'text', defaultValue: 'Nineteen years on one page.' },
        { name: 'headlineBM', type: 'text', defaultValue: 'Sembilan belas tahun pada satu halaman.' },
        {
          name: 'events',
          type: 'array',
          defaultValue: [
            { year: '1998', title: "Alan enters the cutting trade",              titleBM: 'Alan memasuki bidang pemotongan',                 body: "Nine years of selling other companies' blades begins.", bodyBM: 'Sembilan tahun menjual bilah syarikat lain bermula.' },
            { year: '2007', title: 'Coolman founded in Petaling Jaya',           titleBM: 'Coolman diasaskan di Petaling Jaya',              body: 'Two segment presses, a bench, a phone.',              bodyBM: 'Dua mesin penekan segmen, sebuah meja, sebuah telefon.' },
            { year: 'TBC',  title: 'Sandwich cobalt formulation developed',      titleBM: 'Formulasi sandwic kobalt dibangunkan',            body: 'After a piling job in Shah Alam taught us the spec sheet was wrong.', bodyBM: 'Selepas sebuah kerja pancang di Shah Alam mengajar kami spesifikasi adalah salah.', note: 'Alan to supply year', noteBM: 'Alan untuk sahkan tahun' },
            { year: '2014', title: 'Shibuya exclusive distribution signed',      titleBM: 'Pengedaran eksklusif Shibuya ditandatangani',     body: 'Renewed every year since.',                          bodyBM: 'Diperbaharui setiap tahun sejak itu.' },
            { year: 'TBC',  title: 'SIRIM certification awarded',                titleBM: 'Pensijilan SIRIM dianugerahkan',                  body: 'Independent verification of the bonding spec.',       bodyBM: 'Pengesahan bebas spesifikasi ikatan kami.', note: 'Alan to supply year', noteBM: 'Alan untuk sahkan tahun' },
            { year: '2026', title: '247 SKUs in stock, ~500 active accounts',    titleBM: '247 SKU dalam stok, ~500 akaun aktif',           body: '96% on-time dispatch. Same-day cut-off at 2pm.',     bodyBM: '96% hantar tepat waktu. Hadang hari sama jam 2 petang.' },
          ],
          fields: bilingualTabs([
            { name: 'year',    type: 'text',     required: true },
            { name: 'title',   type: 'text',     required: true },
            { name: 'titleBM', type: 'text' },
            { name: 'body',    type: 'textarea', required: true },
            { name: 'bodyBM',  type: 'textarea' },
            { name: 'note',    type: 'text' },
            { name: 'noteBM',  type: 'text' },
          ]),
        },
      ]),
    },
  ],
}
