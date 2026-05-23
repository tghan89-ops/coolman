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
      opening: {
        eyebrow: 'Coolman · Manufacturer of cutting tools · Petaling Jaya, 2007',
        eyebrowBM: 'Coolman · Pengeluar alat pemotong · Petaling Jaya, 2007',
        headlinePrefix: 'Right Job ',
        headlinePrefixBM: 'Kerja yang Betul ',
        headlineEmphasis: 'Matched with the Right Blade.',
        headlineEmphasisBM: 'Dipadankan dengan Bilah yang Betul.',
        lede: 'Coolman has built diamond blades, core bits and cutting systems in Malaysia since 2007. Our founder, Alan, has been in the cutting trade since 1998. Every blade we make is engineered for the rock, the rebar and the schedule Malaysian contractors face.',
        ledeBM: 'Coolman telah membina bilah berlian, mata teras dan sistem pemotongan di Malaysia sejak 2007. Pengasas kami, Alan, telah berada dalam bidang pemotongan sejak 1998. Setiap bilah yang kami hasilkan direka untuk batu, besi tetulang dan jadual yang dihadapi kontraktor Malaysia.',
        ctaPrimary: 'Speak to engineering',
        ctaPrimaryBM: 'Berbual dengan kejuruteraan',
        ctaSecondary: 'Browse the tools',
        ctaSecondaryBM: 'Lihat alat',
      },
      fearGrid: {
        eyebrow: 'What contractors live with',
        eyebrowBM: 'Apa yang kontraktor tanggung',
        headline: "Four things keep the boss up at night. We've watched all four on site.",
        headlineBM: 'Empat perkara yang menjadikan bos sukar tidur. Kami sudah menyaksi keempat-empatnya di tapak.',
        cards: [
          {
            key: 'delay',
            title: 'A delay you cannot explain to the developer',
            titleBM: 'Kelewatan yang anda tidak boleh jelaskan kepada pemaju',
            body: 'The blade is slow. The schedule delays. The customer is already calling. We have watched this happen more times than we wish.',
            bodyBM: 'Bilah perlahan. Jadual tertunda. Pelanggan sudah pun menelefon. Kami sudah lihat ini berlaku lebih kerap daripada yang kami mahu.',
          },
          {
            key: 'equipment',
            title: 'Equipment that fails at 11pm on a road closure',
            titleBM: 'Peralatan yang gagal pada 11 malam semasa penutupan jalan',
            body: "When the cut has to be done tonight and the blade gives out at the wrong moment, the cost isn't the blade. It's the closure, the police, the developer phoning at 6am.",
            bodyBM: 'Apabila potongan mesti siap malam ini dan bilah putus pada saat yang salah, kos itu bukan bilah. Ia adalah penutupan, polis, dan pemaju yang menelefon pada jam 6 pagi.',
          },
          {
            key: 'inconsistency',
            title: 'Inconsistency between blades that should be identical',
            titleBM: 'Ketidakkonsistenan antara bilah yang sepatutnya serupa',
            body: 'One blade cuts. The next one of the same SKU lasts half as long. The crew loses faith. The supplier loses the account.',
            bodyBM: 'Satu bilah memotong. Bilah seterusnya dengan SKU yang sama tahan separuh sahaja. Krew hilang keyakinan. Pembekal hilang akaun.',
          },
          {
            key: 'alone',
            title: 'Being left alone with a cut nobody else has seen',
            titleBM: 'Ditinggalkan keseorangan dengan potongan yang belum pernah dilihat orang lain',
            body: 'A new aggregate. An unusual depth. A spec the supplier has never tested. The crew gets it. The supplier ducks the call.',
            bodyBM: 'Agregat baru. Kedalaman luar biasa. Spesifikasi yang pembekal tidak pernah uji. Krew faham. Pembekal mengelak panggilan.',
          },
        ],
      },
      threeMythsIntro: {
        eyebrow: 'Three myths',
        eyebrowBM: 'Tiga mitos',
        headline: 'Three things the cutting trade keeps getting wrong.',
        headlineBM: 'Tiga perkara yang industri pemotongan terus salah faham.',
        lede: "The cheap blade costs more by the end of the job. The dealer who's never been on site can't tell you why your blade glazed. And 'Made in Japan' doesn't mean it was made for cutting Malaysian concrete.",
        ledeBM: "Bilah yang murah sebenarnya lebih mahal pada akhir kerja. Pengedar yang tidak pernah ke tapak tidak dapat beritahu anda kenapa bilah anda mengaca. Dan 'Buatan Jepun' tidak bermakna ia dibuat untuk memotong konkrit Malaysia.",
        ctaLabel: 'Read the folio',
        ctaLabelBM: 'Baca folio',
      },
      brotherhoodIntro: {
        eyebrow: 'The Brotherhood System',
        eyebrowBM: 'Sistem Brotherhood',
        headline: 'How we work with the people who buy from us.',
        headlineBM: 'Bagaimana kami bekerja dengan orang yang membeli daripada kami.',
        lede: 'Dealers and contractors who work with Coolman get direct access to engineering, not a points system. If you carry our blades, we treat you like a partner — not a customer number.',
        ledeBM: 'Pengedar dan kontraktor yang bekerja dengan Coolman mendapat akses terus ke kejuruteraan, bukan sistem mata. Jika anda membawa bilah kami, kami layani anda seperti rakan kongsi — bukan nombor pelanggan.',
        ctaLabel: 'See the five principles',
        ctaLabelBM: 'Lihat lima prinsip',
      },
      alansLetter: {
        eyebrow: 'A letter from Alan',
        eyebrowBM: 'Surat daripada Alan',
        paragraphs: [
          {
            paragraph: 'When I started in the cutting trade in 1998, I thought I knew what a good blade was. Nine years later, when I founded Coolman in 2007, I knew I had been wrong. A good blade is not the one with the best segment formulation on paper. It is the one that finishes the cut on the night the contractor cannot afford to fail.',
            paragraphBM: 'Apabila saya memulakan kerjaya dalam bidang pemotongan pada 1998, saya fikir saya tahu apa itu bilah yang baik. Sembilan tahun kemudian, ketika saya mengasaskan Coolman pada 2007, saya sedar saya silap. Bilah yang baik bukan yang mempunyai formulasi segmen terbaik di atas kertas. Ia adalah yang menyiapkan potongan pada malam kontraktor tidak mampu untuk gagal.',
          },
          {
            paragraph: 'Coolman is built around that single sentence. Every blade we ship is engineered for the kind of cut that breaks weaker blades: Malaysian aggregate, hard rebar, long pours, monsoon damp, a foreman with three jobs running and no time to nurse a slow tool.',
            paragraphBM: 'Coolman dibina di sekitar satu ayat itu. Setiap bilah yang kami hantar direka untuk jenis potongan yang memecahkan bilah yang lebih lemah: agregat Malaysia, besi tetulang keras, tuangan panjang, lembap monsun, mandor dengan tiga kerja berjalan dan tiada masa untuk menjaga alat yang perlahan.',
          },
          {
            paragraph: 'I started Coolman because I had watched too many contractors get sold a blade by someone who had never been on site at 2am. That has not happened to a Coolman customer in 19 years and it never will. If your cut goes wrong, you call me. Not a hotline. Me.',
            paragraphBM: 'Saya mengasaskan Coolman kerana saya telah menyaksi terlalu ramai kontraktor dijual bilah oleh orang yang tidak pernah berada di tapak pada jam 2 pagi. Itu tidak pernah berlaku kepada pelanggan Coolman selama 19 tahun dan ia tidak akan berlaku. Jika potongan anda gagal, anda telefon saya. Bukan talian hotline. Saya.',
          },
          {
            paragraph: 'The next pages are not marketing. They are how we work, what we have learned, and the jobs that taught us. If you read them and we still feel right for your worksite, we should talk.',
            paragraphBM: 'Halaman seterusnya bukan pemasaran. Itu adalah cara kami bekerja, apa yang kami telah pelajari, dan kerja yang mengajar kami. Jika anda membaca dan kami masih dirasakan sesuai untuk tapak anda, mari kita berbual.',
          },
        ],
        signature: 'Alan',
        signatureLine2: 'Founder, Coolman',
        signatureLine2BM: 'Pengasas, Coolman',
      },
      quietDoor: {
        eyebrow: 'The quiet door',
        eyebrowBM: 'Pintu yang senyap',
        headline: 'The full range, in stock and ready to ship from Petaling Jaya.',
        headlineBM: 'Rangkaian penuh, dalam stok dan sedia untuk dihantar dari Petaling Jaya.',
        lede: 'No catalogue front. No PDF download chase. Just the inventory, the spec, and a phone call away if the blade you need is not the one we list.',
        ledeBM: 'Tiada muka katalog. Tiada perlu memburu PDF. Hanya inventori, spesifikasi, dan satu panggilan telefon jika bilah yang anda perlukan bukan yang kami senaraikan.',
        ctaPrimary: 'Open the catalogue',
        ctaPrimaryBM: 'Buka katalog',
        ctaSecondary: 'Speak to engineering',
        ctaSecondaryBM: 'Hubungi kejuruteraan',
      },
      conversation: {
        eyebrow: 'How to start the conversation',
        eyebrowBM: 'Bagaimana memulakan perbualan',
        headline: 'Three ways in. WhatsApp is the fastest.',
        headlineBM: 'Tiga cara masuk. WhatsApp paling cepat.',
        lede: "Most cuts begin with a phone call. We don't hide ours.",
        ledeBM: 'Kebanyakan potongan bermula dengan satu panggilan telefon. Kami tidak sembunyikan kami punya.',
        channels: [
          {
            tag: 'Primary',
            tagBM: 'Utama',
            title: 'Engineering desk on WhatsApp',
            titleBM: 'Meja kejuruteraan di WhatsApp',
            body: 'Send a photo of the cut, the aggregate, the blade. We will tell you what we think before we tell you what we sell.',
            bodyBM: 'Hantar gambar potongan, agregat, bilah. Kami akan beritahu apa kami fikir sebelum kami beritahu apa kami jual.',
            ctaLabel: 'Open WhatsApp',
            ctaLabelBM: 'Buka WhatsApp',
          },
          {
            tag: 'Office',
            tagBM: 'Pejabat',
            title: 'Petaling Jaya office line',
            titleBM: 'Talian pejabat Petaling Jaya',
            body: 'Speak to the team about an order, a dispatch, a returns question. Mon to Sat, 8:30am to 5:30pm.',
            bodyBM: 'Berbual dengan pasukan tentang pesanan, penghantaran, soalan pemulangan. Isnin hingga Sabtu, 8:30 pagi hingga 5:30 petang.',
            ctaLabel: 'Call the office',
            ctaLabelBM: 'Telefon pejabat',
          },
          {
            tag: 'On site',
            tagBM: 'Di tapak',
            title: 'Site visit form',
            titleBM: 'Borang lawatan tapak',
            body: "If the cut is unusual, we'd rather come and see it than guess. Tell us where and when.",
            bodyBM: 'Jika potongan luar biasa, kami lebih rela datang melihat daripada meneka. Beritahu kami di mana dan bila.',
            ctaLabel: 'Request a site visit',
            ctaLabelBM: 'Minta lawatan tapak',
          },
        ],
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
        lede: 'There is one reason this company exists. European bonds were not built for Malaysian aggregate. After twenty-seven years cutting it, we know what to change — and we change it in the matrix, not the marketing.',
        ledeBM: 'Ada satu sebab syarikat ini wujud. Bon Eropah tidak dibina untuk agregat Malaysia. Selepas dua puluh tujuh tahun memotongnya, kami tahu apa yang perlu diubah — dan kami ubahnya dalam matriks, bukan pemasaran.',
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
        lede: 'A short history of a Malaysian diamond tools company. Founded in Petaling Jaya by a tradesman who had been in the cutting trade since 1998.',
        ledeBM: 'Sejarah ringkas sebuah syarikat alat berlian Malaysia. Diasaskan di Petaling Jaya oleh seorang tukang yang telah berada dalam bidang pemotongan sejak 1998.',
      },
      pj2007: {
        eyebrow: 'PJ, 2007', eyebrowBM: 'PJ, 2007',
        headline: 'A workshop on a side road in Petaling Jaya.',
        headlineBM: 'Sebuah bengkel di jalan kecil di Petaling Jaya.',
        paragraphs: [
          { paragraph: 'Coolman started in a single rented unit in Petaling Jaya in 2007. Two segment presses, a bench, and a phone that rang too often. Alan, the founder, had spent nine years in the cutting trade and had finally heard one complaint too many about blades that did not fit the rock.', paragraphBM: 'Coolman bermula di satu unit sewa di Petaling Jaya pada 2007. Dua mesin penekan segmen, sebuah meja, dan satu telefon yang berdering terlalu kerap. Alan, pengasas, telah menghabiskan sembilan tahun dalam bidang pemotongan dan akhirnya mendengar satu aduan terlalu banyak tentang bilah yang tidak sesuai untuk batu kita.' },
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
        eyebrow: 'Twelve years with Shibuya', eyebrowBM: 'Dua belas tahun bersama Shibuya',
        headline: 'Signed 2014. Renewed every year since.',
        headlineBM: 'Ditandatangani 2014. Diperbaharui setiap tahun sejak itu.',
        paragraphs: [
          { paragraph: 'In 2014 Coolman signed the exclusive Malaysian distribution agreement for Shibuya core drills. Twelve years on, it has been renewed every year. The same machines built in Japan since 1923, supported by a Malaysian engineering team that has seen the cuts they actually do.', paragraphBM: 'Pada 2014, Coolman menandatangani perjanjian pengedaran eksklusif Malaysia untuk penggerudi teras Shibuya. Dua belas tahun kemudian, ia diperbaharui setiap tahun. Mesin yang sama dibuat di Jepun sejak 1923, disokong oleh pasukan kejuruteraan Malaysia yang telah melihat potongan yang ia sebenarnya buat.' },
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
          { year: '2007', title: 'Coolman founded in Petaling Jaya',        titleBM: 'Coolman diasaskan di Petaling Jaya',           body: 'Two segment presses, a bench, a phone.',              bodyBM: 'Dua mesin penekan segmen, sebuah meja, sebuah telefon.' },
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
