/**
 * Seed the rewired home-page and why-coolman-page globals with their default values.
 *
 * Why: The migration added new columns as NULL. Payload only applies `defaultValue`
 * when a document is first created — existing rows stay NULL, appearing blank in admin.
 * This script writes every default value so Alan sees pre-filled fields to edit.
 *
 * Safe to re-run. Run after deploying the 20260523_rewire_home_and_why_coolman_globals migration.
 *
 *   npm run seed:rewired-globals
 */

import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  const payload = await getPayload({ config })

  // ── HOME PAGE ────────────────────────────────────────────────────────────────

  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      hero: {
        eyebrow: 'Diamond tools · Selangor · since 2007',
        eyebrowBM: 'Alat berlian · Selangor · sejak 2007',
        headlineLineOne: 'The right blade',
        headlineLineOneBM: 'Bilah yang tepat',
        headlineLineTwoPrefix: 'for ',
        headlineLineTwoPrefixBM: 'untuk ',
        headlineEmphasis: 'every cut',
        headlineEmphasisBM: 'setiap potongan',
        lede: 'Blades, core bits and cutting systems engineered for Malaysian rock, rebar and schedule. Tell us the job — we send the spec and the price.',
        ledeBM: 'Bilah, mata teras dan sistem pemotongan direka untuk batuan, rebar dan jadual kerja Malaysia. Beritahu kami kerjanya — kami hantar spesifikasi dan harganya.',
        ctaPrimary: 'Browse products',
        ctaPrimaryBM: 'Lihat produk',
        ctaSecondary: 'Speak to engineering',
        ctaSecondaryBM: 'Cakap dengan kejuruteraan',
        badgeTag: 'Ready stock',
        badgeTagBM: 'Stok sedia',
        badgeValue: 'Shipped from Selangor',
        badgeValueBM: 'Dihantar dari Selangor',
        stats: [
          { value: '2007', label: 'Cutting since', labelBM: 'Memotong sejak' },
          { value: '247', label: 'SKUs in stock', labelBM: 'SKU dalam stok' },
          { value: '2014', label: 'Shibuya partner', labelBM: 'Rakan Shibuya' },
          { value: '2 days', label: 'Typical dispatch', labelBM: 'Penghantaran biasa' },
        ],
      },
      trustBar: {
        items: [
          { text: 'Engineered in Selangor', textBM: 'Direka di Selangor' },
          { text: 'Shibuya Japan distributor', textBM: 'Pengedar Shibuya Japan' },
          { text: 'WhatsApp tech support', textBM: 'Sokongan teknikal WhatsApp' },
          { text: 'Trade pricing for contractors', textBM: 'Harga dagangan untuk kontraktor' },
          { text: 'Dispatch within 2 business days', textBM: 'Penghantaran dalam 2 hari bekerja' },
        ],
      },
      why: {
        eyebrow: 'Why Coolman',
        eyebrowBM: 'Kenapa Coolman',
        heading: 'Built for the Malaysian job site',
        headingBM: 'Dibina untuk tapak kerja Malaysia',
        cards: [
          {
            num: '01',
            title: 'Engineered for the rock here',
            titleBM: 'Direka untuk batuan di sini',
            body: 'Tested on Malaysian aggregate, rebar and tropical concrete — not a European catalogue. If it cuts here, it cuts anywhere.',
            bodyBM: 'Diuji pada agregat, rebar dan konkrit tropika Malaysia — bukan katalog Eropah. Kalau ia memotong di sini, ia memotong di mana-mana.',
          },
          {
            num: '02',
            title: 'The engineering desk answers',
            titleBM: 'Meja kejuruteraan menjawab',
            body: "Send the cut on WhatsApp. Alan's desk replies with the right spec — direct, with no salesman in between.",
            bodyBM: 'Hantar potongan itu di WhatsApp. Meja Alan balas dengan spesifikasi yang betul — terus, tanpa jurujual di tengah.',
          },
          {
            num: '03',
            title: 'Order direct, see the price',
            titleBM: 'Pesan terus, lihat harga',
            body: 'Trade accounts get tier pricing and reorder history. The effective price shows before you submit — never a surprise invoice.',
            bodyBM: 'Akaun dagangan dapat harga berperingkat dan sejarah pesanan. Harga efektif ditunjukkan sebelum anda hantar — tiada invois mengejut.',
          },
        ],
      },
      products: {
        eyebrow: 'Product range',
        eyebrowBM: 'Rangkaian produk',
        heading: 'Tools for every cut',
        headingBM: 'Alat untuk setiap potongan',
      },
      shibuya: {
        badge: 'Official Malaysia distributor · since 2014',
        badgeBM: 'Pengedar rasmi Malaysia · sejak 2014',
        headlineLineOne: 'Shibuya core',
        headlineLineOneBM: 'Mesin gerudi',
        headlineLineTwo: 'drilling machines',
        headlineLineTwoBM: 'teras Shibuya',
        lede: "Japan's most trusted core-drilling technology, backed by Coolman's training, service and spare-part stock here in Malaysia.",
        ledeBM: 'Teknologi penggerudian teras paling dipercayai dari Jepun, disokong latihan, servis dan stok alat ganti Coolman di Malaysia.',
        cta: 'Request a demo',
        ctaBM: 'Minta demo',
        bullets: [
          { text: 'Rated 52mm to 600mm core diameters', textBM: 'Dinilai untuk diameter teras 52mm hingga 600mm' },
          { text: 'Reinforced concrete & post-tension rated', textBM: 'Konkrit bertetulang & post-tension' },
          { text: 'Operator training & on-site demo', textBM: 'Latihan operator & demo di tapak' },
          { text: 'Spare parts stocked locally', textBM: 'Alat ganti distok tempatan' },
        ],
        stats: [
          { value: '600mm', label: 'Max core size', labelBM: 'Saiz teras maks' },
          { value: '52mm', label: 'Min core size', labelBM: 'Saiz teras min' },
          { value: '2014', label: 'Distributor since', labelBM: 'Pengedar sejak' },
          { value: 'MY', label: 'Local service', labelBM: 'Servis tempatan' },
        ],
        tags: [
          { text: 'High-rise', textBM: 'Bangunan tinggi' },
          { text: 'Infrastructure', textBM: 'Infrastruktur' },
          { text: 'MEP services', textBM: 'Perkhidmatan MEP' },
          { text: 'Renovation', textBM: 'Pengubahsuaian' },
        ],
      },
      contact: {
        eyebrow: 'Get in touch',
        eyebrowBM: 'Hubungi kami',
        heading: 'Request a quote or the right spec',
        headingBM: 'Minta sebut harga atau spesifikasi yang betul',
        whatsappCta: 'WhatsApp us now',
        whatsappCtaBM: 'WhatsApp kami sekarang',
        workshopValue: 'Selangor, Malaysia',
        workshopValueBM: 'Selangor, Malaysia',
        emailValue: 'info@coolman.com.my',
        hoursValue: 'Mon–Fri 8:30–17:30 · Sat 8:30–13:00',
        hoursValueBM: 'Isn–Jum 8:30–17:30 · Sab 8:30–13:00',
      },
    },
  })

  console.log('✓ home-page seeded')

  // ── WHY COOLMAN PAGE ─────────────────────────────────────────────────────────

  await payload.updateGlobal({
    slug: 'why-coolman-page',
    data: {
      hero: {
        eyebrow: 'Why Coolman',
        eyebrowBM: 'Mengapa Coolman',
        title: 'A bond built for the ground',
        titleBM: 'Ikatan yang dibina untuk tanah',
        titleEmphasis: 'under your feet.',
        titleEmphasisBM: 'di bawah kaki anda.',
        lede: 'There is one reason this company exists. European bonds were not built for Malaysian aggregate. We have been cutting it since 1998 — we know what to change, and we change it in the matrix, not the marketing.',
        ledeBM: 'Ada satu sebab syarikat ini wujud. Bon Eropah tidak dibina untuk agregat Malaysia. Kami telah memotongnya sejak 1998 — kami tahu apa yang perlu diubah, dan kami ubahnya dalam matriks, bukan pemasaran.',
      },
      folio01: {
        folioLabel: 'Engineering Folio · 01 of 03',
        folioLabelBM: 'Folio Kejuruteraan · 01 dari 03',
        category: 'The Ground',
        categoryBM: 'Tanah',
        title: 'Every blade Coolman ships starts with the same question.',
        titleBM: 'Setiap bilah yang Coolman hantar bermula dengan soalan yang sama.',
        titleEmphasis: 'What is the ground actually doing to the segment.',
        titleEmphasisBM: 'Apa yang tanah sebenarnya lakukan kepada segmen.',
        summary: 'Most cutting tools sold in Malaysia are calibrated for European aggregate. Malaysian silica runs hotter, harder and less predictably. We built our bond formulations around that specific problem.',
        summaryBM: 'Kebanyakan alat pemotong yang dijual di Malaysia dikalibrasi untuk agregat Eropah. Silika Malaysia lebih panas, lebih keras dan kurang dapat diramal. Kami membina formulasi bon kami di sekitar masalah khusus itu.',
        metaAuthor: 'Alan, Founder',
        metaSubject: 'Aggregate science',
        metaSubjectBM: 'Sains agregat',
        metaRead: '4 min read',
        metaReadBM: '4 min baca',
        paragraphs: [
          {
            paragraph: 'That sounds obvious. It is not how most of the diamond tools sold in Malaysia are built. The bulk of the market is finished blades imported from Europe, calibrated for limestone-based aggregate, low silica, predictable mineralogy. They are excellent blades. They were not designed for the ground here.',
            paragraphBM: 'Itu kedengaran jelas. Itulah bukan cara kebanyakan alat berlian yang dijual di Malaysia dibina. Kebanyakan pasaran adalah bilah siap yang diimport dari Eropah, dikalibrasi untuk agregat berasaskan batu kapur, silika rendah, mineralogi yang dapat diramal. Mereka adalah bilah yang sangat baik. Mereka tidak direka untuk tanah di sini.',
          },
          {
            paragraph: 'Malaysian aggregate runs above 60% silica content. The fines are sharper, the quartz inclusion is higher, and the matrix that holds a diamond cutting segment needs to release diamonds faster or the segment glazes and stops cutting.',
            paragraphBM: 'Agregat Malaysia melebihi 60% kandungan silika. Halus lebih tajam, kandungan kuarza lebih tinggi, dan matriks yang memegang segmen pemotong berlian perlu melepaskan berlian dengan lebih pantas atau segmen mengaca dan berhenti memotong.',
          },
          {
            paragraph: 'Our bond formulations were developed over nineteen years of watching what happens to generic blades on Malaysian sites — and adjusting accordingly. We do not import a European formula and rebrand it. We manufacture to a specification that was written for this ground.',
            paragraphBM: 'Formulasi bon kami dibangunkan selama sembilan belas tahun melihat apa yang berlaku kepada bilah generik di tapak Malaysia — dan menyesuaikannya. Kami tidak mengimport formula Eropah dan meletak jenama semula. Kami mengeluar mengikut spesifikasi yang ditulis untuk tanah ini.',
          },
        ],
        pullquote: 'A blade that glazes on Malaysian aggregate is not a cheap blade. It is a blade that was made for a different country.',
        pullquoteBM: 'Bilah yang mengaca pada agregat Malaysia bukan bilah yang murah. Ia adalah bilah yang dibuat untuk negara lain.',
      },
      folio02: {
        folioLabel: 'Engineering Folio · 02 of 03',
        folioLabelBM: 'Folio Kejuruteraan · 02 dari 03',
        category: 'The Cost',
        categoryBM: 'Kos',
        title: 'The cheap blade is not cheap.',
        titleBM: 'Bilah yang murah tidak murah.',
        titleEmphasis: 'It is expensive in a way the invoice does not show.',
        titleEmphasisBM: 'Ia mahal dengan cara yang tidak ditunjukkan oleh invois.',
        summary: 'Total cost of a blade is not the purchase price. It is the number of cuts, the time per cut, the downtime when it fails, and the cost of a crew standing still while you wait for a replacement.',
        summaryBM: 'Jumlah kos bilah bukan harga belian. Ia adalah bilangan potongan, masa per potongan, masa henti apabila ia gagal, dan kos krew berdiri diam sambil anda menunggu penggantian.',
        metaAuthor: 'Alan, Founder',
        metaSubject: 'Total cost of ownership',
        metaSubjectBM: 'Jumlah kos pemilikan',
        metaRead: '3 min read',
        metaReadBM: '3 min baca',
        paragraphs: [
          {
            paragraph: "We have run the numbers on this across hundreds of sites. A blade that costs 30% less and lasts 40% fewer cuts is more expensive — before you factor in the downtime cost when it fails mid-job. The industry knows this. It keeps buying the cheaper blade because the invoice is the only number that lands on the desk.",
            paragraphBM: 'Kami telah mengira angka ini di ratusan tapak. Bilah yang berharga 30% lebih murah dan tahan 40% lebih sedikit potongan adalah lebih mahal — sebelum anda mengambil kira kos masa henti apabila ia gagal di tengah kerja. Industri tahu ini. Ia terus membeli bilah yang lebih murah kerana invois adalah satu-satunya nombor yang tiba di meja.',
          },
          {
            paragraph: 'We show our customers the full number. Life per cut, not price per blade. When you run the comparison properly, a Coolman blade running at full speed on Malaysian aggregate is almost always cheaper per metre cut than the alternative — and the alternative does not come with someone who will pick up the phone at 11pm.',
            paragraphBM: 'Kami menunjukkan kepada pelanggan kami nombor penuh. Hayat per potongan, bukan harga per bilah. Apabila anda menjalankan perbandingan dengan betul, bilah Coolman yang beroperasi pada kelajuan penuh pada agregat Malaysia hampir selalu lebih murah per meter potongan berbanding alternatif — dan alternatif itu tidak datang dengan seseorang yang akan mengangkat telefon pada jam 11 malam.',
          },
        ],
        pullquote: 'The industry keeps buying the cheaper blade because the invoice is the only number that lands on the desk.',
        pullquoteBM: 'Industri terus membeli bilah yang lebih murah kerana invois adalah satu-satunya nombor yang tiba di meja.',
      },
      folio03: {
        folioLabel: 'Engineering Folio · 03 of 03',
        folioLabelBM: 'Folio Kejuruteraan · 03 dari 03',
        category: 'The Partnership',
        categoryBM: 'Perkongsian',
        title: 'We do not sell blades.',
        titleBM: 'Kami tidak menjual bilah.',
        titleEmphasis: 'We solve cuts.',
        titleEmphasisBM: 'Kami menyelesaikan potongan.',
        summary: 'Every dealer and contractor who carries Coolman gets direct access to engineering — not a points programme, not a rebate structure. If you have a cut we have not seen before, we want to hear about it.',
        summaryBM: 'Setiap pengedar dan kontraktor yang membawa Coolman mendapat akses terus ke kejuruteraan — bukan program mata, bukan struktur rebat. Jika anda mempunyai potongan yang belum kami lihat sebelum ini, kami ingin mendengarnya.',
        metaAuthor: 'Alan, Founder',
        metaSubject: 'The Brotherhood System',
        metaSubjectBM: 'Sistem Brotherhood',
        metaRead: '3 min read',
        metaReadBM: '3 min baca',
        paragraphs: [
          {
            paragraph: 'The Brotherhood System is not a loyalty programme. It is how we work. Dealers who carry our blades get a direct line to the person who designed them. Contractors who use our blades get the same. If a cut goes wrong, you do not call a distributor who calls a regional rep who files a ticket. You call me.',
            paragraphBM: 'Sistem Brotherhood bukan program kesetiaan. Ia adalah cara kami bekerja. Pengedar yang membawa bilah kami mendapat talian terus kepada orang yang merekanya. Kontraktor yang menggunakan bilah kami mendapat perkara yang sama. Jika potongan gagal, anda tidak menghubungi pengedar yang menghubungi wakil wilayah yang membuat tiket. Anda telefon saya.',
          },
          {
            paragraph: 'This is not a sales pitch. It is a description of how the business has operated since 2007. We have customers who have been with us for fifteen years. The reason is not price. The reason is that when something went wrong on their site, we were there.',
            paragraphBM: 'Ini bukan promosi jualan. Ia adalah gambaran bagaimana perniagaan telah beroperasi sejak 2007. Kami mempunyai pelanggan yang telah bersama kami selama lima belas tahun. Sebabnya bukan harga. Sebabnya ialah apabila sesuatu yang salah berlaku di tapak mereka, kami ada.',
          },
        ],
        pullquote: 'If a cut goes wrong, you do not call a distributor. You call me.',
        pullquoteBM: 'Jika potongan gagal, anda tidak menghubungi pengedar. Anda telefon saya.',
      },
      closingCta: {
        eyebrow: 'Start here',
        eyebrowBM: 'Mulakan di sini',
        title: 'If the ground sounds familiar,',
        titleBM: 'Jika tanah itu kedengaran biasa,',
        titleEmphasis: "we should talk.",
        titleEmphasisBM: 'kita patut berbual.',
        body: "Most contractors who find Coolman do so after a blade has failed them on a job that mattered. We would rather meet you before that happens. Send us a photo of your cut, your aggregate, your blade. We will tell you what we think.",
        bodyBM: 'Kebanyakan kontraktor yang menemui Coolman berbuat demikian selepas bilah mengecewakan mereka pada kerja yang penting. Kami lebih suka bertemu anda sebelum itu berlaku. Hantar gambar potongan, agregat, bilah anda. Kami akan beritahu apa yang kami fikir.',
        whatsappCtaLabel: 'Send us a photo on WhatsApp',
        whatsappCtaLabelBM: 'Hantar gambar kepada kami di WhatsApp',
        fieldNotesCtaLabel: 'Read the Field Notes',
        fieldNotesCtaLabelBM: 'Baca Nota Lapangan',
      },
    },
  })

  console.log('✓ why-coolman-page seeded')

  // ── HERITAGE PAGE ─────────────────────────────────────────────────────────────

  await payload.updateGlobal({
    slug: 'heritage-page',
    data: {
      hero: {
        eyebrow: 'Heritage',
        eyebrowBM: 'Warisan',
        headline: 'Coolman, since 2007. Nineteen years of cuts that taught us how to build the blade.',
        headlineBM: 'Coolman, sejak 2007. Sembilan belas tahun potongan yang mengajar kami bagaimana membina bilah.',
        lede: 'A short history of a Malaysian diamond tools company. Founded in Selangor by a tradesman who had been in the cutting trade since 1998.',
        ledeBM: 'Sejarah ringkas sebuah syarikat alat berlian Malaysia. Diasaskan di Selangor oleh seorang tukang yang telah berada dalam bidang pemotongan sejak 1998.',
      },
      pj2007: {
        eyebrow: 'PJ, 2007', eyebrowBM: 'PJ, 2007',
        headline: 'A workshop on a side road in Selangor.',
        headlineBM: 'Sebuah bengkel di jalan kecil di Selangor.',
        paragraphs: [
          { paragraph: 'Coolman started in a single rented unit in Selangor in 2007. Two segment presses, a bench, and a phone that rang too often. Alan, the founder, had spent nine years in the cutting trade and had finally heard one complaint too many about blades that did not fit the rock.', paragraphBM: 'Coolman bermula di satu unit sewa di Selangor pada 2007. Dua mesin penekan segmen, sebuah meja, dan satu telefon yang berdering terlalu kerap. Alan, pengasas, telah menghabiskan sembilan tahun dalam bidang pemotongan dan akhirnya mendengar satu aduan terlalu banyak tentang bilah yang tidak sesuai untuk batu kita.' },
          { paragraph: 'The first year was quiet. The second was not. By the end of 2008, the workshop was running two shifts.', paragraphBM: 'Tahun pertama senyap. Tahun kedua tidak. Menjelang akhir 2008, bengkel itu beroperasi dua syif.' },
        ],
      },
      founding: {
        eyebrow: 'The founding decision', eyebrowBM: 'Keputusan pengasasan',
        headline: 'After nine years in the trade, a tradesman started his own.',
        headlineBM: 'Selepas sembilan tahun dalam bidang, seorang tukang memulakan syarikat sendiri.',
        paragraphs: [
          { paragraph: "Alan had been selling other companies' blades since 1998. He had watched the same three things go wrong on site, again and again. Price as the proxy for value. Dealers who had never held a blade. Imported blades that performed in Japan and failed in Selangor.", paragraphBM: 'Alan telah menjual bilah syarikat lain sejak 1998. Beliau telah menyaksi tiga perkara yang sama berlaku salah di tapak, berulang kali. Harga sebagai ukuran nilai. Pengedar yang tidak pernah memegang bilah. Bilah import yang berfungsi di Jepun dan gagal di Selangor.' },
          { paragraph: "In 2007, he stopped explaining other people's blades and started making his own. Coolman is the result.", paragraphBM: 'Pada 2007, beliau berhenti menjelaskan bilah orang lain dan mula membuat bilah sendiri. Coolman adalah hasilnya.' },
        ],
      },
      workshopDay: {
        eyebrow: 'The day it stopped being a workshop', eyebrowBM: 'Hari ia berhenti menjadi bengkel',
        headline: 'A piling job that ended in a redesign.',
        headlineBM: 'Sebuah kerja pancang yang berakhir dengan reka bentuk semula.',
        note: 'Year TBC. Alan to supply.', noteBM: 'Tahun TBC. Alan untuk sahkan tahun.',
        paragraphs: [
          { paragraph: "A contractor in Shah Alam called at 11pm. The blade we'd sold him that morning had not made it through the second pile. Alan drove out. He watched the cut. The aggregate was sharper than the spec had predicted. The bond was wrong.", paragraphBM: 'Seorang kontraktor di Shah Alam menelefon pada jam 11 malam. Bilah yang kami jual kepadanya pada pagi itu tidak dapat menembusi pancang kedua. Alan memandu ke tapak. Beliau melihat potongan itu. Agregat lebih tajam daripada yang spesifikasi ramalkan. Ikatan bilah itu salah.' },
          { paragraph: 'The blade was redesigned over the next four weeks. The new formulation, sandwich cobalt, became what the CM-X line is built on today. The workshop became a manufacturer the day Alan accepted that the contractor was right and the spec sheet was wrong. (Year TBC. Alan to supply.)', paragraphBM: 'Bilah itu direka semula dalam empat minggu seterusnya. Formulasi baru, sandwic kobalt, menjadi asas barisan CM-X hari ini. Bengkel itu menjadi pengeluar pada hari Alan menerima kontraktor itu betul dan helaian spesifikasi itu salah. (Tahun TBC. Alan untuk sahkan tahun.)' },
        ],
      },
      shibuyaYears: {
        eyebrow: 'With Shibuya since 2014', eyebrowBM: 'Bersama Shibuya sejak 2014',
        headline: 'Signed 2014. Renewed every year since.',
        headlineBM: 'Ditandatangani 2014. Diperbaharui setiap tahun sejak itu.',
        paragraphs: [
          { paragraph: 'In 2014 Coolman signed the exclusive Malaysian distribution agreement for Shibuya core drills. It has been renewed every year since. The same machines, built in Japan, supported by a Malaysian engineering team that has seen the cuts they actually do.', paragraphBM: 'Pada 2014, Coolman menandatangani perjanjian pengedaran eksklusif Malaysia untuk penggerudi teras Shibuya. Ia diperbaharui setiap tahun sejak itu. Mesin yang sama, dibuat di Jepun, disokong oleh pasukan kejuruteraan Malaysia yang telah melihat potongan yang ia sebenarnya buat.' },
          { paragraph: 'Shibuya makes the drill. Coolman makes sure the drill is the right answer to the cut in front of you.', paragraphBM: 'Shibuya membuat penggerudi. Coolman memastikan penggerudi itu adalah jawapan yang tepat kepada potongan di hadapan anda.' },
        ],
      },
      hardestYear: {
        eyebrow: 'The hardest year', eyebrowBM: 'Tahun paling sukar',
        headline: 'The product recall, and what came after.',
        headlineBM: 'Penarikan balik produk, dan apa yang berlaku selepasnya.',
        paragraphs: [
          { paragraph: 'In one production batch, the wrong bonding agent was used. The blades passed factory test. They failed on site. We recalled every unit, replaced every one, and wrote off the cost.', paragraphBM: 'Dalam satu batch pengeluaran, agen pengikat yang salah digunakan. Bilah lulus ujian kilang. Ia gagal di tapak. Kami menarik balik setiap unit, menggantikan setiap satu, dan menanggung kos.' },
          { paragraph: "What we kept was the customer base. Not one Brotherhood dealer left. The contractors who got the failed blade got the replacement, the apology, and a free second blade. Most of them are still with us. Business isn't a race for who can grow fastest. It's a question of who can endure longest.", paragraphBM: 'Apa yang kami kekalkan ialah pangkalan pelanggan. Tiada seorang pengedar Brotherhood meninggalkan. Kontraktor yang menerima bilah gagal menerima penggantian, permohonan maaf, dan satu bilah kedua percuma. Kebanyakan mereka masih bersama kami. Perniagaan bukan perlumbaan siapa boleh berkembang paling cepat. Ia adalah soalan siapa boleh bertahan paling lama.' },
        ],
      },
      twentyYears: {
        eyebrow: 'Twenty years from now', eyebrowBM: 'Dua puluh tahun dari sekarang',
        headline: "What we want Coolman to be when Alan's children run it.",
        headlineBM: 'Apa yang kami mahukan Coolman menjadi apabila anak-anak Alan menjalankannya.',
        paragraphs: [
          { paragraph: 'The same company. Larger inventory. More Field Notes in the archive. The same direct line to engineering. The same answer when a contractor calls at 11pm.', paragraphBM: 'Syarikat yang sama. Inventori yang lebih besar. Lebih banyak Field Notes dalam arkib. Talian terus yang sama ke kejuruteraan. Jawapan yang sama apabila seorang kontraktor menelefon pada jam 11 malam.' },
          { paragraph: 'Coolman is built to outlast its founder. That is the only metric of success we trust.', paragraphBM: 'Coolman dibina untuk bertahan lebih lama daripada pengasasnya. Itu satu-satunya ukuran kejayaan yang kami percaya.' },
        ],
      },
      timeline: {
        eyebrow: 'The timeline', eyebrowBM: 'Garis masa',
        headline: 'Nineteen years on one page.',
        headlineBM: 'Sembilan belas tahun pada satu halaman.',
        events: [
          { year: '1998', title: 'Alan enters the cutting trade',           titleBM: 'Alan memasuki bidang pemotongan',              body: "Nine years of selling other companies' blades begins.", bodyBM: 'Sembilan tahun menjual bilah syarikat lain bermula.' },
          { year: '2007', title: 'Coolman founded in Selangor',        titleBM: 'Coolman diasaskan di Selangor',           body: 'Two segment presses, a bench, a phone.',              bodyBM: 'Dua mesin penekan segmen, sebuah meja, sebuah telefon.' },
          { year: 'TBC',  title: 'Sandwich cobalt formulation developed',   titleBM: 'Formulasi sandwic kobalt dibangunkan',         body: 'After a piling job in Shah Alam taught us the spec sheet was wrong.', bodyBM: 'Selepas sebuah kerja pancang di Shah Alam mengajar kami spesifikasi adalah salah.', note: 'Alan to supply year', noteBM: 'Alan untuk sahkan tahun' },
          { year: '2014', title: 'Shibuya exclusive distribution signed',   titleBM: 'Pengedaran eksklusif Shibuya ditandatangani',  body: 'Renewed every year since.',                          bodyBM: 'Diperbaharui setiap tahun sejak itu.' },
          { year: 'TBC',  title: 'SIRIM certification awarded',             titleBM: 'Pensijilan SIRIM dianugerahkan',               body: 'Independent verification of the bonding spec.',       bodyBM: 'Pengesahan bebas spesifikasi ikatan kami.', note: 'Alan to supply year', noteBM: 'Alan untuk sahkan tahun' },
          { year: '2026', title: '247 SKUs in stock, ~500 active accounts', titleBM: '247 SKU dalam stok, ~500 akaun aktif',        body: '96% on-time dispatch. Same-day cut-off at 2pm.',     bodyBM: '96% hantar tepat waktu. Hadang hari sama jam 2 petang.' },
        ],
      },
    },
  })

  console.log('✓ heritage-page seeded')
  console.log('\nDone. All globals are now pre-filled in the Payload admin.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
