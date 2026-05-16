import type { GlobalConfig } from 'payload'

const bmDesc = { description: 'Bahasa Malaysia. Leave blank to fall back to English.' }
const notTranslated = { description: 'Not translated — numeric/spec value shown in both languages.' }

export const ShibuyaPage: GlobalConfig = {
  slug: 'shibuya-page',
  access: { read: () => true },
  admin: {
    livePreview: {
      url: () => `${process.env.NEXT_PUBLIC_SERVER_URL}/shibuya`,
    },
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'badge', type: 'text', defaultValue: 'ENGINEERED IN JAPAN' },
        { name: 'badgeBM', type: 'text', defaultValue: 'DIREKA DI JEPUN', admin: bmDesc },
        { name: 'headlineLine1', type: 'text', defaultValue: 'Precision Without' },
        { name: 'headlineLine1BM', type: 'text', defaultValue: 'Ketepatan Tanpa', admin: bmDesc },
        { name: 'headlineLine2', type: 'text', defaultValue: 'Compromise' },
        { name: 'headlineLine2BM', type: 'text', defaultValue: 'Kompromi', admin: bmDesc },
        { name: 'subheadline', type: 'textarea', defaultValue: 'Shibuya core drilling machines represent five decades of Japanese engineering excellence.' },
        { name: 'subheadlineBM', type: 'textarea', defaultValue: 'Mesin penggerudi teras Shibuya mewakili lima dekad kecemerlangan kejuruteraan Jepun.', admin: bmDesc },
        { name: 'heroImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'heritage',
      type: 'group',
      fields: [
        { name: 'since', type: 'text', defaultValue: '1973', admin: { description: 'Year only e.g. 1973 — the SINCE prefix is added automatically.' } },
        { name: 'statement', type: 'textarea', defaultValue: 'Five decades of relentless pursuit of perfection. Every Shibuya machine is a testament to Japanese craftsmanship.' },
        { name: 'statementBM', type: 'textarea', defaultValue: 'Lima dekad usaha tanpa henti mengejar kesempurnaan. Setiap mesin Shibuya adalah bukti seni bina Jepun.', admin: bmDesc },
      ],
    },
    {
      name: 'craftsmanship',
      type: 'group',
      fields: [
        { name: 'sectionLabel', type: 'text', defaultValue: 'CRAFTSMANSHIP' },
        { name: 'sectionLabelBM', type: 'text', defaultValue: 'SENI BINA', admin: bmDesc },
        { name: 'title', type: 'text', defaultValue: 'Built to Last Generations' },
        { name: 'titleBM', type: 'text', defaultValue: 'Dibina Untuk Bertahan Generasi', admin: bmDesc },
        { name: 'body', type: 'textarea', defaultValue: 'Every Shibuya machine begins its life in our Osaka manufacturing facility.' },
        { name: 'bodyBM', type: 'textarea', defaultValue: 'Setiap mesin Shibuya bermula di kilang pembuatan kami di Osaka.', admin: bmDesc },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'points',
          type: 'array',
          defaultValue: [
            { number: '01', title: 'Precision Manufacturing', titleBM: 'Pembuatan Ketepatan', description: 'Every component machined to tolerances of 0.01mm in our Osaka facility.', descriptionBM: 'Setiap komponen dimesin pada toleransi 0.01mm di kilang Osaka kami.' },
            { number: '02', title: 'Quality Materials', titleBM: 'Bahan Berkualiti', description: 'Aircraft-grade aluminum housings and hardened steel gearing throughout.', descriptionBM: 'Perumah aluminium gred pesawat dan gear keluli dikeraskan sepanjang.' },
            { number: '03', title: 'Rigorous Testing', titleBM: 'Ujian Ketat', description: '72-hour continuous operation test before any machine leaves the factory.', descriptionBM: 'Ujian operasi berterusan 72 jam sebelum mana-mana mesin keluar dari kilang.' },
            { number: '04', title: 'Hand Assembly', titleBM: 'Pemasangan Tangan', description: 'Final assembly by master technicians with decades of experience.', descriptionBM: 'Pemasangan akhir oleh juruteknik pakar dengan pengalaman berdekad.' },
          ],
          fields: [
            { name: 'number', type: 'text', required: true, admin: notTranslated },
            { name: 'title', type: 'text', required: true },
            { name: 'titleBM', type: 'text', admin: bmDesc },
            { name: 'description', type: 'textarea', required: true },
            { name: 'descriptionBM', type: 'textarea', admin: bmDesc },
          ],
        },
      ],
    },
    {
      name: 'machines',
      type: 'array',
      admin: { description: 'Machine models shown in the product range section. Order determines tab order on page.' },
      defaultValue: [
        { modelId: 'ts-132', name: 'TS-132', tagline: 'Precision Handheld', taglineBM: 'Pegang Tangan Tepat', description: 'Engineered for precision...', descriptionBM: 'Direka untuk ketepatan...', motorPower: '1,500W', maxDiameter: '132mm', weight: '8.5kg', rpmRange: '580-2,100', price: 'RM 4,500', features: [{ feature: 'Ergonomic handheld design', featureBM: 'Reka bentuk ergonomik pegang tangan' }, { feature: 'Wet and dry drilling modes', featureBM: 'Mod gerudi basah dan kering' }, { feature: 'Variable speed control', featureBM: 'Kawalan kelajuan boleh laras' }, { feature: 'Quick-release chuck', featureBM: 'Cuk pelepasan pantas' }] },
        { modelId: 'ts-162', name: 'TS-162', tagline: 'Professional Standard', taglineBM: 'Standard Profesional', description: 'The benchmark for professional core drilling...', descriptionBM: 'Penanda aras untuk penggerudian teras profesional...', motorPower: '2,200W', maxDiameter: '162mm', weight: '12kg', rpmRange: '480-1,800', price: 'RM 7,800', features: [{ feature: 'Rig-mounted stability', featureBM: 'Kestabilan dipasang rig' }, { feature: 'Auto-feed capability', featureBM: 'Keupayaan suap automatik' }, { feature: 'High-torque brushless motor', featureBM: 'Motor tanpa berus kilas tinggi' }, { feature: 'Integrated water supply', featureBM: 'Bekalan air bersepadu' }] },
        { modelId: 'ts-252', name: 'TS-252', tagline: 'Industrial Powerhouse', taglineBM: 'Kuasa Industri', description: 'Uncompromising power meets Japanese precision...', descriptionBM: 'Kuasa tanpa kompromi bertemu ketepatan Jepun...', motorPower: '3,200W', maxDiameter: '252mm', weight: '18kg', rpmRange: '320-1,200', price: 'RM 12,500', features: [{ feature: 'Industrial-grade construction', featureBM: 'Pembinaan gred industri' }, { feature: '3-speed gearbox', featureBM: 'Kotak gear 3-kelajuan' }, { feature: 'Intelligent overload protection', featureBM: 'Perlindungan beban pintar' }, { feature: 'Reinforced anchor system', featureBM: 'Sistem sauh diperkukuh' }] },
        { modelId: 'ts-402', name: 'TS-402', tagline: 'Maximum Performance', taglineBM: 'Prestasi Maksimum', description: 'The pinnacle of core drilling technology...', descriptionBM: 'Puncak teknologi penggerudian teras...', motorPower: '4,800W', maxDiameter: '402mm', weight: '28kg', rpmRange: '180-720', price: 'RM 22,000', features: [{ feature: 'Maximum drilling capacity', featureBM: 'Kapasiti penggerudian maksimum' }, { feature: 'Hydraulic feed system', featureBM: 'Sistem suap hidraulik' }, { feature: 'Remote operation capable', featureBM: 'Berupaya operasi jauh' }, { feature: 'Continuous duty rated', featureBM: 'Dinilai tugas berterusan' }] },
      ],
      fields: [
        { name: 'modelId', type: 'text', required: true, admin: { description: 'Internal ID e.g. ts-132 — not translated.' } },
        { name: 'name', type: 'text', required: true, admin: { description: 'Model name e.g. TS-132 — not translated.' } },
        { name: 'tagline', type: 'text', required: true },
        { name: 'taglineBM', type: 'text', admin: bmDesc },
        { name: 'description', type: 'textarea', required: true },
        { name: 'descriptionBM', type: 'textarea', admin: bmDesc },
        { name: 'motorPower', type: 'text', required: true, admin: { description: 'e.g. 1,500W — not translated.' } },
        { name: 'maxDiameter', type: 'text', required: true, admin: { description: 'e.g. 132mm — not translated.' } },
        { name: 'weight', type: 'text', required: true, admin: { description: 'e.g. 8.5kg — not translated.' } },
        { name: 'rpmRange', type: 'text', required: true, admin: { description: 'e.g. 580-2,100 — not translated.' } },
        { name: 'price', type: 'text', required: true, admin: { description: 'Display price string e.g. RM 4,500 — not translated.' } },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'features',
          type: 'array',
          fields: [
            { name: 'feature', type: 'text', required: true },
            { name: 'featureBM', type: 'text', admin: bmDesc },
          ],
        },
      ],
    },
    {
      name: 'inAction',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Built for Real Work' },
        { name: 'titleBM', type: 'text', defaultValue: 'Dibina Untuk Kerja Sebenar', admin: bmDesc },
        { name: 'body', type: 'textarea', defaultValue: 'From high-rise construction to infrastructure projects, Shibuya machines perform flawlessly.' },
        { name: 'bodyBM', type: 'textarea', defaultValue: 'Dari pembinaan pencakar langit hingga projek infrastruktur, mesin Shibuya berfungsi dengan sempurna.', admin: bmDesc },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'support',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'We Stand Behind Every Machine' },
        { name: 'titleBM', type: 'text', defaultValue: 'Kami Menyokong Setiap Mesin', admin: bmDesc },
        {
          name: 'items',
          type: 'array',
          defaultValue: [
            { title: '2-Year Warranty', titleBM: 'Waranti 2 Tahun', description: 'Comprehensive manufacturer warranty with full parts and labor coverage.', descriptionBM: 'Waranti pengilang komprehensif dengan liputan penuh alat ganti dan upah.' },
            { title: 'Local Service Center', titleBM: 'Pusat Servis Tempatan', description: 'Dedicated service facility in Kuala Lumpur staffed by factory-trained technicians.', descriptionBM: 'Kemudahan servis khusus di Kuala Lumpur yang dikendalikan oleh juruteknik terlatih kilang.' },
            { title: 'Spare Parts Stock', titleBM: 'Stok Alat Ganti', description: 'Full inventory of genuine Shibuya parts for rapid repairs and maintenance.', descriptionBM: 'Inventori penuh alat ganti Shibuya tulen untuk pembaikan dan penyelenggaraan pantas.' },
            { title: 'Operator Training', titleBM: 'Latihan Pengendali', description: 'Complimentary training program included with every machine purchase.', descriptionBM: 'Program latihan percuma disertakan dengan setiap pembelian mesin.' },
          ],
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'titleBM', type: 'text', admin: bmDesc },
            { name: 'description', type: 'textarea', required: true },
            { name: 'descriptionBM', type: 'textarea', admin: bmDesc },
          ],
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'headline', type: 'text', defaultValue: 'Experience the Difference' },
        { name: 'headlineBM', type: 'text', defaultValue: 'Rasai Perbezaannya', admin: bmDesc },
        { name: 'subheadline', type: 'textarea', defaultValue: 'Schedule a demonstration at your site or visit our showroom.' },
        { name: 'subheadlineBM', type: 'textarea', defaultValue: 'Jadualkan tunjuk cara di tapak anda atau lawati ruang pamer kami.', admin: bmDesc },
        { name: 'primaryCtaLabel', type: 'text', defaultValue: 'Request a demo' },
        { name: 'primaryCtaLabelBM', type: 'text', defaultValue: 'Minta demo', admin: bmDesc },
        { name: 'secondaryCtaLabel', type: 'text', defaultValue: 'Download Brochure' },
        { name: 'secondaryCtaLabelBM', type: 'text', defaultValue: 'Muat Turun Brosur', admin: bmDesc },
      ],
    },
  ],
}
