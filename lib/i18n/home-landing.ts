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

// ──────────────────────────────────────────────────────────────────────────
// CMS overlay. The `home-page` Payload global (globals/HomePage.ts) mirrors the
// editable subset of this structure. resolveHomeLanding() overlays any non-blank
// CMS value on top of the code defaults above, language-aware, so a blank CMS
// field (or no CMS row at all) falls back to the code copy and the page never
// blanks out. Functional micro-copy (form labels, button states, interest
// options) is not in the CMS and always comes from the code defaults.
// ──────────────────────────────────────────────────────────────────────────

type RawText = string | null | undefined
type RawPair = { text?: RawText; textBM?: RawText }
type RawStat = { value?: RawText; label?: RawText; labelBM?: RawText }

export type RawHomePage = {
  hero?: {
    eyebrow?: RawText; eyebrowBM?: RawText
    headlineLineOne?: RawText; headlineLineOneBM?: RawText
    headlineLineTwoPrefix?: RawText; headlineLineTwoPrefixBM?: RawText
    headlineEmphasis?: RawText; headlineEmphasisBM?: RawText
    lede?: RawText; ledeBM?: RawText
    ctaPrimary?: RawText; ctaPrimaryBM?: RawText
    ctaSecondary?: RawText; ctaSecondaryBM?: RawText
    badgeTag?: RawText; badgeTagBM?: RawText
    badgeValue?: RawText; badgeValueBM?: RawText
    stats?: RawStat[] | null
  } | null
  trustBar?: { items?: RawPair[] | null } | null
  why?: {
    eyebrow?: RawText; eyebrowBM?: RawText; heading?: RawText; headingBM?: RawText
    cards?: Array<{ num?: RawText; title?: RawText; titleBM?: RawText; body?: RawText; bodyBM?: RawText }> | null
  } | null
  products?: { eyebrow?: RawText; eyebrowBM?: RawText; heading?: RawText; headingBM?: RawText } | null
  shibuya?: {
    badge?: RawText; badgeBM?: RawText
    headlineLineOne?: RawText; headlineLineOneBM?: RawText
    headlineLineTwo?: RawText; headlineLineTwoBM?: RawText
    lede?: RawText; ledeBM?: RawText; cta?: RawText; ctaBM?: RawText
    bullets?: RawPair[] | null
    stats?: RawStat[] | null
    tags?: RawPair[] | null
  } | null
  contact?: {
    eyebrow?: RawText; eyebrowBM?: RawText; heading?: RawText; headingBM?: RawText
    whatsappCta?: RawText; whatsappCtaBM?: RawText
    workshopValue?: RawText; workshopValueBM?: RawText
    emailValue?: RawText
    hoursValue?: RawText; hoursValueBM?: RawText
  } | null
}

export function resolveHomeLanding(
  data: RawHomePage | null | undefined,
  language: Language,
): HomeLandingCopy {
  const base = HOME_LANDING[language]
  if (!data) return base

  // Language-aware pick with code fallback: BM uses bm→en→fallback, EN uses en→fallback.
  const L = (en: RawText, bm: RawText, fallback: string): string => {
    const v =
      language === 'BM'
        ? (bm && bm.trim()) || (en && en.trim()) || ''
        : (en && en.trim()) || ''
    return v || fallback
  }
  // Plain value (no translation, e.g. stat values, email): cms→fallback.
  const V = (val: RawText, fallback: string): string => (val && val.trim()) || fallback

  // Use the CMS array when it has rows (admin controls the count); otherwise the
  // code array. Each row merges field-by-field against the base row at the same
  // index (or the last base row when the admin added extra rows).
  const mergeRows = <T>(
    cmsRows: unknown[] | null | undefined,
    baseRows: T[],
    build: (row: any, baseRow: T) => T,
  ): T[] => {
    if (!Array.isArray(cmsRows) || cmsRows.length === 0) return baseRows
    return cmsRows.map((row, i) => build(row, baseRows[i] ?? baseRows[baseRows.length - 1] ?? ({} as T)))
  }

  const h = data.hero ?? {}
  const w = data.why ?? {}
  const p = data.products ?? {}
  const s = data.shibuya ?? {}
  const ct = data.contact ?? {}

  return {
    hero: {
      eyebrow: L(h.eyebrow, h.eyebrowBM, base.hero.eyebrow),
      headlineLine1: L(h.headlineLineOne, h.headlineLineOneBM, base.hero.headlineLine1),
      headlineLine2Prefix: L(h.headlineLineTwoPrefix, h.headlineLineTwoPrefixBM, base.hero.headlineLine2Prefix),
      headlineEmphasis: L(h.headlineEmphasis, h.headlineEmphasisBM, base.hero.headlineEmphasis),
      lede: L(h.lede, h.ledeBM, base.hero.lede),
      ctaPrimary: L(h.ctaPrimary, h.ctaPrimaryBM, base.hero.ctaPrimary),
      ctaSecondary: L(h.ctaSecondary, h.ctaSecondaryBM, base.hero.ctaSecondary),
      badgeTag: L(h.badgeTag, h.badgeTagBM, base.hero.badgeTag),
      badgeValue: L(h.badgeValue, h.badgeValueBM, base.hero.badgeValue),
      stats: mergeRows(h.stats, base.hero.stats, (r, b) => ({
        value: V(r?.value, b.value),
        label: L(r?.label, r?.labelBM, b.label),
      })),
    },
    trustBar: mergeRows(data.trustBar?.items, base.trustBar, (r, b) => L(r?.text, r?.textBM, b as string)),
    why: {
      eyebrow: L(w.eyebrow, w.eyebrowBM, base.why.eyebrow),
      heading: L(w.heading, w.headingBM, base.why.heading),
      cards: mergeRows(w.cards, base.why.cards, (r, b) => ({
        num: V(r?.num, b.num),
        title: L(r?.title, r?.titleBM, b.title),
        body: L(r?.body, r?.bodyBM, b.body),
      })),
    },
    products: {
      ...base.products,
      eyebrow: L(p.eyebrow, p.eyebrowBM, base.products.eyebrow),
      heading: L(p.heading, p.headingBM, base.products.heading),
    },
    shibuya: {
      badge: L(s.badge, s.badgeBM, base.shibuya.badge),
      headingLine1: L(s.headlineLineOne, s.headlineLineOneBM, base.shibuya.headingLine1),
      headingLine2: L(s.headlineLineTwo, s.headlineLineTwoBM, base.shibuya.headingLine2),
      lede: L(s.lede, s.ledeBM, base.shibuya.lede),
      cta: L(s.cta, s.ctaBM, base.shibuya.cta),
      bullets: mergeRows(s.bullets, base.shibuya.bullets, (r, b) => L(r?.text, r?.textBM, b as string)),
      stats: mergeRows(s.stats, base.shibuya.stats, (r, b) => ({
        value: V(r?.value, b.value),
        label: L(r?.label, r?.labelBM, b.label),
      })),
      tags: mergeRows(s.tags, base.shibuya.tags, (r, b) => L(r?.text, r?.textBM, b as string)),
    },
    contact: {
      ...base.contact,
      eyebrow: L(ct.eyebrow, ct.eyebrowBM, base.contact.eyebrow),
      heading: L(ct.heading, ct.headingBM, base.contact.heading),
      whatsappCta: L(ct.whatsappCta, ct.whatsappCtaBM, base.contact.whatsappCta),
      workshopValue: L(ct.workshopValue, ct.workshopValueBM, base.contact.workshopValue),
      emailValue: V(ct.emailValue, base.contact.emailValue),
      hoursValue: L(ct.hoursValue, ct.hoursValueBM, base.contact.hoursValue),
    },
  }
}
