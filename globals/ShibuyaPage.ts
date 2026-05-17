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
