/**
 * One-time seed to push BM (Bahasa Malaysia) defaults into the four CMS Globals.
 *
 * Why this exists: Payload `defaultValue` only fires when a Global doc is FIRST
 * created. Existing rows in the database keep whatever was there before the
 * schema was updated — so BM admin fields would show up blank in the Payload
 * admin even though the schema now has BM defaults.
 *
 * This script overwrites the four Globals (home-page, why-coolman-page,
 * applications-page, shibuya-page) with the full EN + BM content. After this
 * runs, Alan can open Globals → any page in the admin and see every BM field
 * pre-filled with the translation, ready to edit.
 *
 * Run once after deploy. Safe to re-run; it overwrites. Confirmed safe with GH
 * 2026-05-16 — no BM admin edits exist yet.
 *
 *   npx tsx scripts/seed-bm-defaults.ts
 */

import { getPayload } from 'payload'
import config from '@payload-config'

const homePage = {
  hero: {
    badge: 'Trusted by 500+ Malaysian Contractors',
    badgeBM: 'Dipercayai oleh 500+ Kontraktor Malaysia',
    headlineLine1: 'Industrial',
    headlineLine1BM: 'Alat Berlian',
    headlineLine2: 'Diamond Tools',
    headlineLine2BM: 'Industri',
    headlineLine3: 'Built for Performance',
    headlineLine3BM: 'Dibina untuk Prestasi',
    subheadline: 'Industrial-grade cutting solutions engineered for concrete, granite, marble, and more.',
    subheadlineBM: 'Penyelesaian pemotongan gred industri direka untuk konkrit, granit, marmar dan banyak lagi. Dibina untuk memenuhi standard kontraktor profesional yang menuntut.',
    primaryCtaLabel: 'Explore Products',
    primaryCtaLabelBM: 'Terokai Produk',
    secondaryCtaLabel: 'See applications',
    secondaryCtaLabelBM: 'Lihat aplikasi',
  },
  stats: [
    { value: '25+', label: 'Years', labelBM: 'Tahun' },
    { value: '500+', label: 'Contractors', labelBM: 'Kontraktor' },
    { value: '50K+', label: 'Projects', labelBM: 'Projek' },
    { value: '99%', label: 'On-Time', labelBM: 'Tepat Masa' },
  ],
  features: [
    { title: 'Superior Cutting Speed', titleBM: 'Kelajuan Pemotongan Unggul', description: '40% faster cutting compared to standard blades.', descriptionBM: 'Pemotongan 40% lebih pantas berbanding bilah standard.', stat: '40%', statLabel: 'Faster', statLabelBM: 'Lebih Pantas' },
    { title: 'Extended Blade Life', titleBM: 'Hayat Bilah Panjang', description: 'Proprietary bonding technology ensures longer life.', descriptionBM: 'Teknologi pengikatan proprietari memastikan hayat lebih panjang.', stat: '3×', statLabel: 'Longer', statLabelBM: 'Lebih Lama' },
    { title: 'Rapid Fulfillment', titleBM: 'Penghantaran Pantas', description: 'Same-day dispatch for orders placed before 2pm.', descriptionBM: 'Penghantaran hari yang sama untuk pesanan sebelum 2 petang.', stat: '24h', statLabel: 'Delivery', statLabelBM: 'Penghantaran' },
    { title: 'Technical Support', titleBM: 'Sokongan Teknikal', description: 'Dedicated team to help optimise your operations.', descriptionBM: 'Pasukan khusus untuk membantu mengoptimumkan operasi anda.', stat: '24/7', statLabel: 'Support', statLabelBM: 'Sokongan' },
  ],
  applicationList: [
    { id: 'concrete', label: 'Concrete', labelBM: 'Konkrit' },
    { id: 'granite', label: 'Granite', labelBM: 'Granit' },
    { id: 'marble', label: 'Marble', labelBM: 'Marmar' },
    { id: 'tile', label: 'Tile & Ceramic', labelBM: 'Jubin & Seramik' },
  ],
  ctaSection: {
    headline: 'Ready to Elevate Your Operations?',
    headlineBM: 'Sedia Untuk Meningkatkan Operasi Anda?',
    subheadline: 'Join 500+ professional contractors who trust Coolman for their diamond cutting needs.',
    subheadlineBM: 'Sertai 500+ kontraktor profesional yang mempercayai Coolman untuk keperluan pemotongan berlian mereka.',
    primaryCtaLabel: 'Request Consultation',
    primaryCtaLabelBM: 'Minta Perundingan',
    secondaryCtaLabel: 'Download Catalog',
    secondaryCtaLabelBM: 'Muat Turun Katalog',
  },
}

const whyCoolmanPage = {
  hero: {
    eyebrow: 'Why Coolman',
    eyebrowBM: 'Kenapa Coolman',
    title: 'The Coolman Advantage',
    titleBM: 'Kelebihan Coolman',
    lede: 'More than just tools - we provide complete cutting solutions and ongoing partnership for contractors who demand excellence.',
    ledeBM: 'Lebih daripada sekadar alat - kami menyediakan penyelesaian pemotongan lengkap dan perkongsian berterusan untuk kontraktor yang menuntut kecemerlangan.',
  },
  advantages: [
    { iconKey: 'zap', title: 'Superior Cutting Performance', titleBM: 'Prestasi Pemotongan Unggul', body: 'Our diamond segments are formulated for 40% faster cutting speeds while maintaining precision. Less time cutting means more projects completed.', bodyBM: 'Segmen berlian kami diformulasi untuk kelajuan pemotongan 40% lebih pantas sambil mengekalkan ketepatan. Kurang masa memotong bermakna lebih banyak projek disiapkan.' },
    { iconKey: 'shield', title: 'Extended Blade Life', titleBM: 'Hayat Bilah Yang Panjang', body: 'Proprietary bonding technology and premium diamond crystals deliver up to 3x longer operational life compared to standard blades.', bodyBM: 'Teknologi pengikatan proprietari dan kristal berlian premium memberikan hayat operasi sehingga 3x lebih lama berbanding bilah standard.' },
    { iconKey: 'award', title: '25+ Years of Excellence', titleBM: '25+ Tahun Kecemerlangan', body: 'Since 1998, we have been engineering cutting solutions for Malaysian contractors. Our expertise is built into every blade we produce.', bodyBM: 'Sejak 1998, kami telah mereka bentuk penyelesaian pemotongan untuk kontraktor Malaysia. Kepakaran kami terbina dalam setiap bilah yang kami hasilkan.' },
    { iconKey: 'truck', title: 'Rapid Fulfillment', titleBM: 'Penghantaran Pantas', body: 'Same-day dispatch for orders placed before 2pm. Our logistics network ensures fast delivery across Peninsular Malaysia.', bodyBM: 'Penghantaran pada hari yang sama untuk pesanan sebelum 2 petang. Rangkaian logistik kami memastikan penghantaran pantas di seluruh Semenanjung Malaysia.' },
    { iconKey: 'headphones', title: 'Technical Partnership', titleBM: 'Perkongsian Teknikal', body: 'Dedicated engineering support to help you select the right tools, optimize cutting parameters, and solve technical challenges.', bodyBM: 'Sokongan kejuruteraan khusus untuk membantu anda memilih alat yang tepat, mengoptimumkan parameter pemotongan dan menyelesaikan cabaran teknikal.' },
    { iconKey: 'barChart3', title: 'B2B Pricing Advantage', titleBM: 'Kelebihan Harga B2B', body: 'Registered contractors enjoy exclusive pricing tiers based on volume, with additional discounts on bulk orders.', bodyBM: 'Kontraktor berdaftar menikmati harga eksklusif berperingkat berdasarkan jumlah, dengan diskaun tambahan untuk pesanan pukal.' },
  ],
  statsSection: {
    title: 'Trusted by Professionals',
    titleBM: 'Dipercayai Oleh Profesional',
    subtitle: 'Our track record speaks for itself. Join hundreds of contractors who rely on Coolman.',
    subtitleBM: 'Rekod prestasi kami bercakap sendiri. Sertai ratusan kontraktor yang bergantung kepada Coolman.',
  },
  stats: [
    { value: '500+', label: 'Active Contractors', labelBM: 'Kontraktor Aktif' },
    { value: '50,000+', label: 'Projects Completed', labelBM: 'Projek Disiapkan' },
    { value: '99.2%', label: 'On-Time Delivery', labelBM: 'Penghantaran Tepat Masa' },
    { value: '4.9/5', label: 'Customer Rating', labelBM: 'Penilaian Pelanggan' },
  ],
  testimonialsSection: {
    eyebrow: 'Testimonials',
    eyebrowBM: 'Testimoni',
    title: 'What Our Partners Say',
    titleBM: 'Apa Kata Rakan Kongsi Kami',
  },
  testimonials: [
    { quote: 'Coolman blades consistently outperform other brands we have tried. The cutting speed and blade life are exceptional.', quoteBM: 'Bilah Coolman secara konsisten mengatasi jenama lain yang kami cuba. Kelajuan pemotongan dan hayat bilah amat cemerlang.', author: 'Ahmad Razak', role: 'Director, ABC Construction', roleBM: 'Pengarah, ABC Construction' },
    { quote: 'Their technical support team helped us select the right blade for a challenging granite project. The results exceeded expectations.', quoteBM: 'Pasukan sokongan teknikal mereka membantu kami memilih bilah yang tepat untuk projek granit yang mencabar. Hasilnya melebihi jangkaan.', author: 'Lee Wei Ming', role: 'Senior Engineer, XYZ Contractors', roleBM: 'Jurutera Kanan, XYZ Contractors' },
    { quote: 'Fast delivery and consistent quality. Coolman has been our trusted supplier for over 10 years.', quoteBM: 'Penghantaran pantas dan kualiti konsisten. Coolman telah menjadi pembekal yang dipercayai selama lebih 10 tahun.', author: 'Siti Aminah', role: 'Procurement Manager, DEF Builders', roleBM: 'Pengurus Perolehan, DEF Builders' },
  ],
  cta: {
    title: 'Ready to Experience the Difference?',
    titleBM: 'Sedia Merasai Perbezaannya?',
    body: 'Join 500+ professional contractors who trust Coolman for their diamond cutting needs.',
    bodyBM: 'Sertai 500+ kontraktor profesional yang mempercayai Coolman untuk keperluan pemotongan berlian mereka.',
    primaryLabel: 'Become a Partner',
    primaryLabelBM: 'Jadi Rakan Kongsi',
    primaryHref: '/auth/register',
    secondaryLabel: 'Contact Sales',
    secondaryLabelBM: 'Hubungi Jualan',
    secondaryHref: '/contact',
  },
}

const applicationsPage = {
  heroTitle: 'Applications',
  heroTitleBM: 'Aplikasi',
  heroSubtitle: 'Find the right Coolman blade for your specific material and application.',
  heroSubtitleBM: 'Cari bilah Coolman yang tepat untuk bahan dan aplikasi khusus anda.',
  sections: [
    { title: 'Concrete Cutting', titleBM: 'Pemotongan Konkrit', description: 'Heavy-duty diamond blades engineered for reinforced concrete, cured slabs, and structural elements.', descriptionBM: 'Bilah berlian tugas berat yang direka untuk konkrit bertetulang, papak terawat dan elemen struktur.' },
    { title: 'Granite & Natural Stone', titleBM: 'Granit & Batu Asli', description: 'Precision blades for cutting granite countertops, natural stone, and hard rock materials.', descriptionBM: 'Bilah ketepatan untuk memotong meja granit, batu asli dan bahan batu keras.' },
    { title: 'Marble & Soft Stone', titleBM: 'Marmar & Batu Lembut', description: 'Specialized segments for clean, chip-free cuts in marble, limestone, and soft stone.', descriptionBM: 'Segmen khusus untuk pemotongan bersih dan bebas serpihan pada marmar, batu kapur dan batu lembut.' },
    { title: 'Tile & Ceramics', titleBM: 'Jubin & Seramik', description: 'Fine-grit diamond blades for precise cuts in porcelain, ceramic tiles, and glass.', descriptionBM: 'Bilah berlian halus untuk pemotongan tepat pada porselin, jubin seramik dan kaca.' },
    { title: 'Asphalt Cutting', titleBM: 'Pemotongan Asfalt', description: 'Durable blades designed for roadwork, asphalt overlays, and pavement cutting.', descriptionBM: 'Bilah tahan lasak yang direka untuk kerja jalan, lapisan asfalt dan pemotongan turapan.' },
    { title: 'Brick & Masonry', titleBM: 'Bata & Tembok', description: 'All-purpose blades for cutting brick, block, and general masonry materials.', descriptionBM: 'Bilah serba guna untuk memotong bata, blok dan bahan tembok am.' },
  ],
}

const shibuyaPage = {
  hero: {
    badge: 'ENGINEERED IN JAPAN',
    badgeBM: 'DIREKA DI JEPUN',
    headlineLine1: 'Precision Without',
    headlineLine1BM: 'Ketepatan Tanpa',
    headlineLine2: 'Compromise',
    headlineLine2BM: 'Kompromi',
    subheadline: 'Shibuya core drilling machines represent five decades of Japanese engineering excellence.',
    subheadlineBM: 'Mesin penggerudi teras Shibuya mewakili lima dekad kecemerlangan kejuruteraan Jepun.',
  },
  heritage: {
    since: '1973',
    statement: 'Five decades of relentless pursuit of perfection. Every Shibuya machine is a testament to Japanese craftsmanship.',
    statementBM: 'Lima dekad usaha tanpa henti mengejar kesempurnaan. Setiap mesin Shibuya adalah bukti seni bina Jepun.',
  },
  craftsmanship: {
    sectionLabel: 'CRAFTSMANSHIP',
    sectionLabelBM: 'SENI BINA',
    title: 'Built to Last Generations',
    titleBM: 'Dibina Untuk Bertahan Generasi',
    body: 'Every Shibuya machine begins its life in our Osaka manufacturing facility.',
    bodyBM: 'Setiap mesin Shibuya bermula di kilang pembuatan kami di Osaka.',
    points: [
      { number: '01', title: 'Precision Manufacturing', titleBM: 'Pembuatan Ketepatan', description: 'Every component machined to tolerances of 0.01mm in our Osaka facility.', descriptionBM: 'Setiap komponen dimesin pada toleransi 0.01mm di kilang Osaka kami.' },
      { number: '02', title: 'Quality Materials', titleBM: 'Bahan Berkualiti', description: 'Aircraft-grade aluminum housings and hardened steel gearing throughout.', descriptionBM: 'Perumah aluminium gred pesawat dan gear keluli dikeraskan sepanjang.' },
      { number: '03', title: 'Rigorous Testing', titleBM: 'Ujian Ketat', description: '72-hour continuous operation test before any machine leaves the factory.', descriptionBM: 'Ujian operasi berterusan 72 jam sebelum mana-mana mesin keluar dari kilang.' },
      { number: '04', title: 'Hand Assembly', titleBM: 'Pemasangan Tangan', description: 'Final assembly by master technicians with decades of experience.', descriptionBM: 'Pemasangan akhir oleh juruteknik pakar dengan pengalaman berdekad.' },
    ],
  },
  machines: [
    { modelId: 'ts-132', name: 'TS-132', tagline: 'Precision Handheld', taglineBM: 'Pegang Tangan Tepat', description: 'Engineered for precision...', descriptionBM: 'Direka untuk ketepatan...', motorPower: '1,500W', maxDiameter: '132mm', weight: '8.5kg', rpmRange: '580-2,100', price: 'RM 4,500', features: [{ feature: 'Ergonomic handheld design', featureBM: 'Reka bentuk ergonomik pegang tangan' }, { feature: 'Wet and dry drilling modes', featureBM: 'Mod gerudi basah dan kering' }, { feature: 'Variable speed control', featureBM: 'Kawalan kelajuan boleh laras' }, { feature: 'Quick-release chuck', featureBM: 'Cuk pelepasan pantas' }] },
    { modelId: 'ts-162', name: 'TS-162', tagline: 'Professional Standard', taglineBM: 'Standard Profesional', description: 'The benchmark for professional core drilling...', descriptionBM: 'Penanda aras untuk penggerudian teras profesional...', motorPower: '2,200W', maxDiameter: '162mm', weight: '12kg', rpmRange: '480-1,800', price: 'RM 7,800', features: [{ feature: 'Rig-mounted stability', featureBM: 'Kestabilan dipasang rig' }, { feature: 'Auto-feed capability', featureBM: 'Keupayaan suap automatik' }, { feature: 'High-torque brushless motor', featureBM: 'Motor tanpa berus kilas tinggi' }, { feature: 'Integrated water supply', featureBM: 'Bekalan air bersepadu' }] },
    { modelId: 'ts-252', name: 'TS-252', tagline: 'Industrial Powerhouse', taglineBM: 'Kuasa Industri', description: 'Uncompromising power meets Japanese precision...', descriptionBM: 'Kuasa tanpa kompromi bertemu ketepatan Jepun...', motorPower: '3,200W', maxDiameter: '252mm', weight: '18kg', rpmRange: '320-1,200', price: 'RM 12,500', features: [{ feature: 'Industrial-grade construction', featureBM: 'Pembinaan gred industri' }, { feature: '3-speed gearbox', featureBM: 'Kotak gear 3-kelajuan' }, { feature: 'Intelligent overload protection', featureBM: 'Perlindungan beban pintar' }, { feature: 'Reinforced anchor system', featureBM: 'Sistem sauh diperkukuh' }] },
    { modelId: 'ts-402', name: 'TS-402', tagline: 'Maximum Performance', taglineBM: 'Prestasi Maksimum', description: 'The pinnacle of core drilling technology...', descriptionBM: 'Puncak teknologi penggerudian teras...', motorPower: '4,800W', maxDiameter: '402mm', weight: '28kg', rpmRange: '180-720', price: 'RM 22,000', features: [{ feature: 'Maximum drilling capacity', featureBM: 'Kapasiti penggerudian maksimum' }, { feature: 'Hydraulic feed system', featureBM: 'Sistem suap hidraulik' }, { feature: 'Remote operation capable', featureBM: 'Berupaya operasi jauh' }, { feature: 'Continuous duty rated', featureBM: 'Dinilai tugas berterusan' }] },
  ],
  inAction: {
    title: 'Built for Real Work',
    titleBM: 'Dibina Untuk Kerja Sebenar',
    body: 'From high-rise construction to infrastructure projects, Shibuya machines perform flawlessly.',
    bodyBM: 'Dari pembinaan pencakar langit hingga projek infrastruktur, mesin Shibuya berfungsi dengan sempurna.',
  },
  support: {
    title: 'We Stand Behind Every Machine',
    titleBM: 'Kami Menyokong Setiap Mesin',
    items: [
      { title: '2-Year Warranty', titleBM: 'Waranti 2 Tahun', description: 'Comprehensive manufacturer warranty with full parts and labor coverage.', descriptionBM: 'Waranti pengilang komprehensif dengan liputan penuh alat ganti dan upah.' },
      { title: 'Local Service Center', titleBM: 'Pusat Servis Tempatan', description: 'Dedicated service facility in Kuala Lumpur staffed by factory-trained technicians.', descriptionBM: 'Kemudahan servis khusus di Kuala Lumpur yang dikendalikan oleh juruteknik terlatih kilang.' },
      { title: 'Spare Parts Stock', titleBM: 'Stok Alat Ganti', description: 'Full inventory of genuine Shibuya parts for rapid repairs and maintenance.', descriptionBM: 'Inventori penuh alat ganti Shibuya tulen untuk pembaikan dan penyelenggaraan pantas.' },
      { title: 'Operator Training', titleBM: 'Latihan Pengendali', description: 'Complimentary training program included with every machine purchase.', descriptionBM: 'Program latihan percuma disertakan dengan setiap pembelian mesin.' },
    ],
  },
  cta: {
    headline: 'Experience the Difference',
    headlineBM: 'Rasai Perbezaannya',
    subheadline: 'Schedule a demonstration at your site or visit our showroom.',
    subheadlineBM: 'Jadualkan tunjuk cara di tapak anda atau lawati ruang pamer kami.',
    primaryCtaLabel: 'Request a demo',
    primaryCtaLabelBM: 'Minta demo',
    secondaryCtaLabel: 'Download Brochure',
    secondaryCtaLabelBM: 'Muat Turun Brosur',
  },
}

async function seed() {
  const payload = await getPayload({ config })

  const targets: Array<{ slug: 'home-page' | 'why-coolman-page' | 'applications-page' | 'shibuya-page'; data: unknown }> = [
    { slug: 'home-page', data: homePage },
    { slug: 'why-coolman-page', data: whyCoolmanPage },
    { slug: 'applications-page', data: applicationsPage },
    { slug: 'shibuya-page', data: shibuyaPage },
  ]

  for (const t of targets) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.updateGlobal({ slug: t.slug as any, data: t.data as any })
      console.log(`✓ Updated global: ${t.slug}`)
    } catch (err) {
      console.error(`✗ Failed: ${t.slug}`, err)
    }
  }

  console.log('Done.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
