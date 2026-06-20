import type { Language } from './copy'

// ──────────────────────────────────────────────────────────────────────────
// Home landing copy — the transactional single-page redesign (June 2026).
//
// Kept in its own bilingual module rather than threaded through the 3,600-line
// COPY structure: this is a self-contained surface, and isolating it keeps the
// EN/BM parity reviewable and the giant CopyStructure type untouched. Consumed
// by HomePageClient via the same `language` from useLanguage(), so the EN+BM
// hard rule (every string bilingual, no hardcoded copy in components) still
// holds. If this posture spreads site-wide, fold it back into copy.ts.
//
// FACTS POLICY: verified facts only. Since 2007 · 247 SKUs · Shibuya distributor
// since 2014 · dispatch within 2 business days · core range 52–600mm. No
// unverified performance/time claims (no "2-hour reply", no "38m before
// re-dress", no "same-day dispatch").
// ──────────────────────────────────────────────────────────────────────────

export interface HomeLandingCopy {
  hero: {
    eyebrow: string
    headlineLine1: string
    headlineLine2Prefix: string
    headlineEmphasis: string
    lede: string
    ctaPrimary: string
    ctaSecondary: string
    stats: { value: string; label: string }[]
    badgeTag: string
    badgeValue: string
  }
  trustBar: string[]
  why: {
    eyebrow: string
    heading: string
    cards: { num: string; title: string; body: string }[]
  }
  products: {
    eyebrow: string
    heading: string
    tabAll: string
    enquire: string
    viewAll: string
    emptyHeading: string
    emptyBody: string
  }
  shibuya: {
    badge: string
    headingLine1: string
    headingLine2: string
    lede: string
    bullets: string[]
    cta: string
    stats: { value: string; label: string }[]
    tags: string[]
  }
  contact: {
    eyebrow: string
    heading: string
    labels: {
      fullName: string
      company: string
      phone: string
      email: string
      interest: string
      job: string
    }
    placeholders: {
      fullName: string
      company: string
      phone: string
      email: string
      job: string
    }
    interestOptions: string[]
    submit: string
    sending: string
    success: string
    error: string
    requiredError: string
    whatsappCta: string
    workshopLabel: string
    workshopValue: string
    emailLabel: string
    emailValue: string
    hoursLabel: string
    hoursValue: string
  }
}

const EN: HomeLandingCopy = {
  hero: {
    eyebrow: 'Diamond tools · Selangor · since 2007',
    headlineLine1: 'The right blade',
    headlineLine2Prefix: 'for ',
    headlineEmphasis: 'every cut',
    lede: 'Blades, core bits and cutting systems engineered for Malaysian rock, rebar and schedule. Tell us the job — we send the spec and the price.',
    ctaPrimary: 'Browse products',
    ctaSecondary: 'Speak to engineering',
    stats: [
      { value: '2007', label: 'Cutting since' },
      { value: '247', label: 'SKUs in stock' },
      { value: '2014', label: 'Shibuya partner' },
      { value: '2 days', label: 'Typical dispatch' },
    ],
    badgeTag: 'Ready stock',
    badgeValue: 'Shipped from Selangor',
  },
  trustBar: [
    'Engineered in Selangor',
    'Shibuya Japan distributor',
    'WhatsApp tech support',
    'Trade pricing for contractors',
    'Dispatch within 2 business days',
  ],
  why: {
    eyebrow: 'Why Coolman',
    heading: 'Built for the Malaysian job site',
    cards: [
      {
        num: '01',
        title: 'Engineered for the rock here',
        body: 'Tested on Malaysian aggregate, rebar and tropical concrete — not a European catalogue. If it cuts here, it cuts anywhere.',
      },
      {
        num: '02',
        title: 'The engineering desk answers',
        body: "Send the cut on WhatsApp. Alan's desk replies with the right spec — direct, with no salesman in between.",
      },
      {
        num: '03',
        title: 'Order direct, see the price',
        body: 'Trade accounts get tier pricing and reorder history. The effective price shows before you submit — never a surprise invoice.',
      },
    ],
  },
  products: {
    eyebrow: 'Product range',
    heading: 'Tools for every cut',
    tabAll: 'All',
    enquire: 'View',
    viewAll: 'Browse the full catalogue',
    emptyHeading: 'The full catalogue is online',
    emptyBody: 'Blades, core bits, grinding and polishing — browse the complete range and submit a request.',
  },
  shibuya: {
    badge: 'Official Malaysia distributor · since 2014',
    headingLine1: 'Shibuya core',
    headingLine2: 'drilling machines',
    lede: "Japan's most trusted core-drilling technology, backed by Coolman's training, service and spare-part stock here in Malaysia.",
    bullets: [
      'Rated 52mm to 600mm core diameters',
      'Reinforced concrete & post-tension rated',
      'Operator training & on-site demo',
      'Spare parts stocked locally',
    ],
    cta: 'Request a demo',
    stats: [
      { value: '600mm', label: 'Max core size' },
      { value: '52mm', label: 'Min core size' },
      { value: '2014', label: 'Distributor since' },
      { value: 'MY', label: 'Local service' },
    ],
    tags: ['High-rise', 'Infrastructure', 'MEP services', 'Renovation'],
  },
  contact: {
    eyebrow: 'Get in touch',
    heading: 'Request a quote or the right spec',
    labels: {
      fullName: 'Full name',
      company: 'Company',
      phone: 'Phone / WhatsApp',
      email: 'Email',
      interest: "I'm interested in",
      job: 'The job',
    },
    placeholders: {
      fullName: 'Ahmad Razif',
      company: 'ABC Contractors Sdn Bhd',
      phone: '+60 12-345 6789',
      email: 'ahmad@abc.com.my',
      job: "Material, machine, diameter, and what you're cutting…",
    },
    interestOptions: [
      'Diamond blades',
      'Core drilling (Shibuya)',
      'Grinding & polishing',
      'Opening a trade account',
      'Technical advice',
    ],
    submit: 'Send enquiry',
    sending: 'Sending…',
    success: "Enquiry sent. Alan's desk will get back to you — for anything urgent, WhatsApp us.",
    error: 'We could not send your enquiry. Please try again or WhatsApp us.',
    requiredError: 'Please add your name, email and a short note about the job.',
    whatsappCta: 'WhatsApp us now',
    workshopLabel: 'Workshop',
    workshopValue: 'Selangor, Malaysia',
    emailLabel: 'Email',
    emailValue: 'info@coolman.com.my',
    hoursLabel: 'Hours',
    hoursValue: 'Mon–Fri 8:30–17:30 · Sat 8:30–13:00',
  },
}

const BM: HomeLandingCopy = {
  hero: {
    eyebrow: 'Alat berlian · Selangor · sejak 2007',
    headlineLine1: 'Bilah yang tepat',
    headlineLine2Prefix: 'untuk ',
    headlineEmphasis: 'setiap potongan',
    lede: 'Bilah, mata teras dan sistem pemotongan direka untuk batuan, rebar dan jadual kerja Malaysia. Beritahu kami kerjanya — kami hantar spesifikasi dan harganya.',
    ctaPrimary: 'Lihat produk',
    ctaSecondary: 'Cakap dengan kejuruteraan',
    stats: [
      { value: '2007', label: 'Memotong sejak' },
      { value: '247', label: 'SKU dalam stok' },
      { value: '2014', label: 'Rakan Shibuya' },
      { value: '2 hari', label: 'Penghantaran biasa' },
    ],
    badgeTag: 'Stok sedia',
    badgeValue: 'Dihantar dari Selangor',
  },
  trustBar: [
    'Direka di Selangor',
    'Pengedar Shibuya Japan',
    'Sokongan teknikal WhatsApp',
    'Harga dagangan untuk kontraktor',
    'Penghantaran dalam 2 hari bekerja',
  ],
  why: {
    eyebrow: 'Kenapa Coolman',
    heading: 'Dibina untuk tapak kerja Malaysia',
    cards: [
      {
        num: '01',
        title: 'Direka untuk batuan di sini',
        body: 'Diuji pada agregat, rebar dan konkrit tropika Malaysia — bukan katalog Eropah. Kalau ia memotong di sini, ia memotong di mana-mana.',
      },
      {
        num: '02',
        title: 'Meja kejuruteraan menjawab',
        body: 'Hantar potongan itu di WhatsApp. Meja Alan balas dengan spesifikasi yang betul — terus, tanpa jurujual di tengah.',
      },
      {
        num: '03',
        title: 'Pesan terus, lihat harga',
        body: 'Akaun dagangan dapat harga berperingkat dan sejarah pesanan. Harga efektif ditunjukkan sebelum anda hantar — tiada invois mengejut.',
      },
    ],
  },
  products: {
    eyebrow: 'Rangkaian produk',
    heading: 'Alat untuk setiap potongan',
    tabAll: 'Semua',
    enquire: 'Lihat',
    viewAll: 'Lihat katalog penuh',
    emptyHeading: 'Katalog penuh ada dalam talian',
    emptyBody: 'Bilah, mata teras, pengisaran dan penggilap — lihat rangkaian penuh dan hantar permintaan.',
  },
  shibuya: {
    badge: 'Pengedar rasmi Malaysia · sejak 2014',
    headingLine1: 'Mesin gerudi',
    headingLine2: 'teras Shibuya',
    lede: 'Teknologi penggerudian teras paling dipercayai dari Jepun, disokong latihan, servis dan stok alat ganti Coolman di Malaysia.',
    bullets: [
      'Dinilai untuk diameter teras 52mm hingga 600mm',
      'Konkrit bertetulang & post-tension',
      'Latihan operator & demo di tapak',
      'Alat ganti distok tempatan',
    ],
    cta: 'Minta demo',
    stats: [
      { value: '600mm', label: 'Saiz teras maks' },
      { value: '52mm', label: 'Saiz teras min' },
      { value: '2014', label: 'Pengedar sejak' },
      { value: 'MY', label: 'Servis tempatan' },
    ],
    tags: ['Bangunan tinggi', 'Infrastruktur', 'Perkhidmatan MEP', 'Pengubahsuaian'],
  },
  contact: {
    eyebrow: 'Hubungi kami',
    heading: 'Minta sebut harga atau spesifikasi yang betul',
    labels: {
      fullName: 'Nama penuh',
      company: 'Syarikat',
      phone: 'Telefon / WhatsApp',
      email: 'E-mel',
      interest: 'Saya berminat dengan',
      job: 'Kerja itu',
    },
    placeholders: {
      fullName: 'Ahmad Razif',
      company: 'ABC Contractors Sdn Bhd',
      phone: '+60 12-345 6789',
      email: 'ahmad@abc.com.my',
      job: 'Bahan, mesin, diameter, dan apa yang anda potong…',
    },
    interestOptions: [
      'Bilah berlian',
      'Penggerudian teras (Shibuya)',
      'Pengisaran & penggilap',
      'Buka akaun dagangan',
      'Nasihat teknikal',
    ],
    submit: 'Hantar pertanyaan',
    sending: 'Menghantar…',
    success: 'Pertanyaan dihantar. Meja Alan akan hubungi anda — untuk hal segera, WhatsApp kami.',
    error: 'Kami tidak dapat menghantar pertanyaan anda. Sila cuba lagi atau WhatsApp kami.',
    requiredError: 'Sila isi nama, e-mel dan nota ringkas tentang kerja itu.',
    whatsappCta: 'WhatsApp kami sekarang',
    workshopLabel: 'Bengkel',
    workshopValue: 'Selangor, Malaysia',
    emailLabel: 'E-mel',
    emailValue: 'info@coolman.com.my',
    hoursLabel: 'Waktu',
    hoursValue: 'Isn–Jum 8:30–17:30 · Sab 8:30–13:00',
  },
}

export const HOME_LANDING: Record<Language, HomeLandingCopy> = { EN, BM }
