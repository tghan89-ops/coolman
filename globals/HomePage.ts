import type { GlobalConfig } from 'payload'

const bmDesc = { description: 'Bahasa Malaysia. Leave blank to fall back to English.' }

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  access: { read: () => true },
  admin: {
    livePreview: {
      url: () => `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    },
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'badge', type: 'text', defaultValue: 'Trusted by 500+ Malaysian Contractors' },
        { name: 'badgeBM', type: 'text', defaultValue: 'Dipercayai oleh 500+ Kontraktor Malaysia', admin: bmDesc },
        { name: 'headlineLine1', type: 'text', defaultValue: 'Industrial' },
        { name: 'headlineLine1BM', type: 'text', defaultValue: 'Alat Berlian', admin: bmDesc },
        { name: 'headlineLine2', type: 'text', defaultValue: 'Diamond Tools' },
        { name: 'headlineLine2BM', type: 'text', defaultValue: 'Industri', admin: bmDesc },
        { name: 'headlineLine3', type: 'text', defaultValue: 'Built for Performance' },
        { name: 'headlineLine3BM', type: 'text', defaultValue: 'Dibina untuk Prestasi', admin: bmDesc },
        { name: 'subheadline', type: 'textarea', defaultValue: 'Industrial-grade cutting solutions engineered for concrete, granite, marble, and more.' },
        { name: 'subheadlineBM', type: 'textarea', defaultValue: 'Penyelesaian pemotongan gred industri direka untuk konkrit, granit, marmar dan banyak lagi. Dibina untuk memenuhi standard kontraktor profesional yang menuntut.', admin: bmDesc },
        { name: 'primaryCtaLabel', type: 'text', defaultValue: 'Explore Products' },
        { name: 'primaryCtaLabelBM', type: 'text', defaultValue: 'Terokai Produk', admin: bmDesc },
        { name: 'secondaryCtaLabel', type: 'text', defaultValue: 'See applications' },
        { name: 'secondaryCtaLabelBM', type: 'text', defaultValue: 'Lihat aplikasi', admin: bmDesc },
        { name: 'heroImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      defaultValue: [
        { value: '25+', label: 'Years', labelBM: 'Tahun' },
        { value: '500+', label: 'Contractors', labelBM: 'Kontraktor' },
        { value: '50K+', label: 'Projects', labelBM: 'Projek' },
        { value: '99%', label: 'On-Time', labelBM: 'Tepat Masa' },
      ],
      fields: [
        { name: 'value', type: 'text', required: true, admin: { description: 'Numeric display — not translated.' } },
        { name: 'label', type: 'text', required: true },
        { name: 'labelBM', type: 'text', admin: bmDesc },
      ],
    },
    {
      name: 'features',
      type: 'array',
      admin: { description: 'Feature cards shown in the "Why Coolman" section.' },
      defaultValue: [
        { title: 'Superior Cutting Speed', titleBM: 'Kelajuan Pemotongan Unggul', description: '40% faster cutting compared to standard blades.', descriptionBM: 'Pemotongan 40% lebih pantas berbanding bilah standard.', stat: '40%', statLabel: 'Faster', statLabelBM: 'Lebih Pantas' },
        { title: 'Extended Blade Life', titleBM: 'Hayat Bilah Panjang', description: 'Proprietary bonding technology ensures longer life.', descriptionBM: 'Teknologi pengikatan proprietari memastikan hayat lebih panjang.', stat: '3×', statLabel: 'Longer', statLabelBM: 'Lebih Lama' },
        { title: 'Rapid Fulfillment', titleBM: 'Penghantaran Pantas', description: 'Same-day dispatch for orders placed before 2pm.', descriptionBM: 'Penghantaran hari yang sama untuk pesanan sebelum 2 petang.', stat: '24h', statLabel: 'Delivery', statLabelBM: 'Penghantaran' },
        { title: 'Technical Support', titleBM: 'Sokongan Teknikal', description: 'Dedicated team to help optimise your operations.', descriptionBM: 'Pasukan khusus untuk membantu mengoptimumkan operasi anda.', stat: '24/7', statLabel: 'Support', statLabelBM: 'Sokongan' },
      ],
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'titleBM', type: 'text', admin: bmDesc },
        { name: 'description', type: 'textarea', required: true },
        { name: 'descriptionBM', type: 'textarea', admin: bmDesc },
        { name: 'stat', type: 'text', required: true, admin: { description: 'Numeric display e.g. 40% or 3× — not translated.' } },
        { name: 'statLabel', type: 'text', required: true, admin: { description: 'e.g. Faster, Longer' } },
        { name: 'statLabelBM', type: 'text', admin: bmDesc },
      ],
    },
    {
      name: 'applicationList',
      type: 'array',
      admin: { description: 'Application categories shown in the homepage selector.' },
      defaultValue: [
        { id: 'concrete', label: 'Concrete', labelBM: 'Konkrit' },
        { id: 'granite', label: 'Granite', labelBM: 'Granit' },
        { id: 'marble', label: 'Marble', labelBM: 'Marmar' },
        { id: 'tile', label: 'Tile & Ceramic', labelBM: 'Jubin & Seramik' },
      ],
      fields: [
        { name: 'id', type: 'text', required: true, admin: { description: 'URL-safe slug e.g. concrete' } },
        { name: 'label', type: 'text', required: true },
        { name: 'labelBM', type: 'text', admin: bmDesc },
        { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Upload an image. Leave blank to use the built-in default for this slot.' } },
      ],
    },
    {
      name: 'ctaSection',
      type: 'group',
      fields: [
        { name: 'headline', type: 'text', defaultValue: "Ready to Elevate Your Operations?" },
        { name: 'headlineBM', type: 'text', defaultValue: 'Sedia Untuk Meningkatkan Operasi Anda?', admin: bmDesc },
        { name: 'subheadline', type: 'textarea', defaultValue: "Join 500+ professional contractors who trust Coolman for their diamond cutting needs." },
        { name: 'subheadlineBM', type: 'textarea', defaultValue: 'Sertai 500+ kontraktor profesional yang mempercayai Coolman untuk keperluan pemotongan berlian mereka.', admin: bmDesc },
        { name: 'primaryCtaLabel', type: 'text', defaultValue: 'Request Consultation' },
        { name: 'primaryCtaLabelBM', type: 'text', defaultValue: 'Minta Perundingan', admin: bmDesc },
        { name: 'secondaryCtaLabel', type: 'text', defaultValue: 'Download Catalog' },
        { name: 'secondaryCtaLabelBM', type: 'text', defaultValue: 'Muat Turun Katalog', admin: bmDesc },
      ],
    },
  ],
}
