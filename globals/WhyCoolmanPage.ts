import type { GlobalConfig } from 'payload'

const ICON_OPTIONS = [
  { label: 'Zap (speed)', value: 'zap' },
  { label: 'Shield (durability)', value: 'shield' },
  { label: 'Clock (time)', value: 'clock' },
  { label: 'Users (team)', value: 'users' },
  { label: 'Award (quality)', value: 'award' },
  { label: 'Truck (delivery)', value: 'truck' },
  { label: 'Headphones (support)', value: 'headphones' },
  { label: 'BarChart3 (analytics)', value: 'barChart3' },
]

const bmDesc = { description: 'Bahasa Malaysia. Leave blank to fall back to English.' }

export const WhyCoolmanPage: GlobalConfig = {
  slug: 'why-coolman-page',
  access: { read: () => true },
  admin: {
    livePreview: {
      url: () => `${process.env.NEXT_PUBLIC_SERVER_URL}/why-coolman`,
    },
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Why Coolman' },
        { name: 'eyebrowBM', type: 'text', defaultValue: 'Kenapa Coolman', admin: bmDesc },
        { name: 'title', type: 'text', defaultValue: 'The Coolman Advantage' },
        { name: 'titleBM', type: 'text', defaultValue: 'Kelebihan Coolman', admin: bmDesc },
        {
          name: 'lede',
          type: 'textarea',
          defaultValue:
            'More than just tools - we provide complete cutting solutions and ongoing partnership for contractors who demand excellence.',
        },
        { name: 'ledeBM', type: 'textarea', defaultValue: 'Lebih daripada sekadar alat - kami menyediakan penyelesaian pemotongan lengkap dan perkongsian berterusan untuk kontraktor yang menuntut kecemerlangan.', admin: bmDesc },
      ],
    },
    {
      name: 'advantages',
      type: 'array',
      admin: { description: 'Cards in the "Coolman advantage" grid.' },
      defaultValue: [
        { iconKey: 'zap', title: 'Superior Cutting Performance', titleBM: 'Prestasi Pemotongan Unggul', body: 'Our diamond segments are formulated for 40% faster cutting speeds while maintaining precision. Less time cutting means more projects completed.', bodyBM: 'Segmen berlian kami diformulasi untuk kelajuan pemotongan 40% lebih pantas sambil mengekalkan ketepatan. Kurang masa memotong bermakna lebih banyak projek disiapkan.' },
        { iconKey: 'shield', title: 'Extended Blade Life', titleBM: 'Hayat Bilah Yang Panjang', body: 'Proprietary bonding technology and premium diamond crystals deliver up to 3x longer operational life compared to standard blades.', bodyBM: 'Teknologi pengikatan proprietari dan kristal berlian premium memberikan hayat operasi sehingga 3x lebih lama berbanding bilah standard.' },
        { iconKey: 'award', title: '25+ Years of Excellence', titleBM: '25+ Tahun Kecemerlangan', body: 'Since 1998, we have been engineering cutting solutions for Malaysian contractors. Our expertise is built into every blade we produce.', bodyBM: 'Sejak 1998, kami telah mereka bentuk penyelesaian pemotongan untuk kontraktor Malaysia. Kepakaran kami terbina dalam setiap bilah yang kami hasilkan.' },
        { iconKey: 'truck', title: 'Rapid Fulfillment', titleBM: 'Penghantaran Pantas', body: 'Same-day dispatch for orders placed before 2pm. Our logistics network ensures fast delivery across Peninsular Malaysia.', bodyBM: 'Penghantaran pada hari yang sama untuk pesanan sebelum 2 petang. Rangkaian logistik kami memastikan penghantaran pantas di seluruh Semenanjung Malaysia.' },
        { iconKey: 'headphones', title: 'Technical Partnership', titleBM: 'Perkongsian Teknikal', body: 'Dedicated engineering support to help you select the right tools, optimize cutting parameters, and solve technical challenges.', bodyBM: 'Sokongan kejuruteraan khusus untuk membantu anda memilih alat yang tepat, mengoptimumkan parameter pemotongan dan menyelesaikan cabaran teknikal.' },
        { iconKey: 'barChart3', title: 'B2B Pricing Advantage', titleBM: 'Kelebihan Harga B2B', body: 'Registered contractors enjoy exclusive pricing tiers based on volume, with additional discounts on bulk orders.', bodyBM: 'Kontraktor berdaftar menikmati harga eksklusif berperingkat berdasarkan jumlah, dengan diskaun tambahan untuk pesanan pukal.' },
      ],
      fields: [
        { name: 'iconKey', type: 'select', required: true, options: ICON_OPTIONS, defaultValue: 'zap' },
        { name: 'title', type: 'text', required: true },
        { name: 'titleBM', type: 'text', admin: bmDesc },
        { name: 'body', type: 'textarea', required: true },
        { name: 'bodyBM', type: 'textarea', admin: bmDesc },
      ],
    },
    {
      name: 'statsSection',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Trusted by Professionals' },
        { name: 'titleBM', type: 'text', defaultValue: 'Dipercayai Oleh Profesional', admin: bmDesc },
        { name: 'subtitle', type: 'textarea', defaultValue: 'Our track record speaks for itself. Join hundreds of contractors who rely on Coolman.' },
        { name: 'subtitleBM', type: 'textarea', defaultValue: 'Rekod prestasi kami bercakap sendiri. Sertai ratusan kontraktor yang bergantung kepada Coolman.', admin: bmDesc },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      defaultValue: [
        { value: '500+', label: 'Active Contractors', labelBM: 'Kontraktor Aktif' },
        { value: '50,000+', label: 'Projects Completed', labelBM: 'Projek Disiapkan' },
        { value: '99.2%', label: 'On-Time Delivery', labelBM: 'Penghantaran Tepat Masa' },
        { value: '4.9/5', label: 'Customer Rating', labelBM: 'Penilaian Pelanggan' },
      ],
      fields: [
        { name: 'value', type: 'text', required: true, admin: { description: 'Numeric display — not translated.' } },
        { name: 'label', type: 'text', required: true },
        { name: 'labelBM', type: 'text', admin: bmDesc },
      ],
    },
    {
      name: 'testimonialsSection',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Testimonials' },
        { name: 'eyebrowBM', type: 'text', defaultValue: 'Testimoni', admin: bmDesc },
        { name: 'title', type: 'text', defaultValue: 'What Our Partners Say' },
        { name: 'titleBM', type: 'text', defaultValue: 'Apa Kata Rakan Kongsi Kami', admin: bmDesc },
      ],
    },
    {
      name: 'testimonials',
      type: 'array',
      defaultValue: [
        { quote: 'Coolman blades consistently outperform other brands we have tried. The cutting speed and blade life are exceptional.', quoteBM: 'Bilah Coolman secara konsisten mengatasi jenama lain yang kami cuba. Kelajuan pemotongan dan hayat bilah amat cemerlang.', author: 'Ahmad Razak', role: 'Director, ABC Construction', roleBM: 'Pengarah, ABC Construction' },
        { quote: 'Their technical support team helped us select the right blade for a challenging granite project. The results exceeded expectations.', quoteBM: 'Pasukan sokongan teknikal mereka membantu kami memilih bilah yang tepat untuk projek granit yang mencabar. Hasilnya melebihi jangkaan.', author: 'Lee Wei Ming', role: 'Senior Engineer, XYZ Contractors', roleBM: 'Jurutera Kanan, XYZ Contractors' },
        { quote: 'Fast delivery and consistent quality. Coolman has been our trusted supplier for over 10 years.', quoteBM: 'Penghantaran pantas dan kualiti konsisten. Coolman telah menjadi pembekal yang dipercayai selama lebih 10 tahun.', author: 'Siti Aminah', role: 'Procurement Manager, DEF Builders', roleBM: 'Pengurus Perolehan, DEF Builders' },
      ],
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'quoteBM', type: 'textarea', admin: bmDesc },
        { name: 'author', type: 'text', required: true, admin: { description: 'Person name — not translated.' } },
        { name: 'role', type: 'text', required: true },
        { name: 'roleBM', type: 'text', admin: bmDesc },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Ready to Experience the Difference?' },
        { name: 'titleBM', type: 'text', defaultValue: 'Sedia Merasai Perbezaannya?', admin: bmDesc },
        { name: 'body', type: 'textarea', defaultValue: 'Join 500+ professional contractors who trust Coolman for their diamond cutting needs.' },
        { name: 'bodyBM', type: 'textarea', defaultValue: 'Sertai 500+ kontraktor profesional yang mempercayai Coolman untuk keperluan pemotongan berlian mereka.', admin: bmDesc },
        { name: 'primaryLabel', type: 'text', defaultValue: 'Become a Partner' },
        { name: 'primaryLabelBM', type: 'text', defaultValue: 'Jadi Rakan Kongsi', admin: bmDesc },
        { name: 'primaryHref', type: 'text', defaultValue: '/auth/register' },
        { name: 'secondaryLabel', type: 'text', defaultValue: 'Contact Sales' },
        { name: 'secondaryLabelBM', type: 'text', defaultValue: 'Hubungi Jualan', admin: bmDesc },
        { name: 'secondaryHref', type: 'text', defaultValue: '/contact' },
      ],
    },
  ],
}
