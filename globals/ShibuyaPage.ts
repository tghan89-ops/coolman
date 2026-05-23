import type { GlobalConfig } from 'payload'
import { bilingualTabs } from '@/lib/admin/bilingualTabs'

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
    // ── Hero ──────────────────────────────────────────────────────────────────
    {
      name: 'hero',
      type: 'group',
      fields: bilingualTabs([
        { name: 'badge', type: 'text', defaultValue: 'Coolman × Shibuya Tools · Hiroshima' },
        { name: 'badgeBM', type: 'text', defaultValue: 'Coolman × Shibuya Tools · Hiroshima' },
        { name: 'badgeSince', type: 'text', defaultValue: 'Sole MY Partner Since 2011', admin: notTranslated },
        { name: 'headlineLine1', type: 'text', defaultValue: 'The best machine in the world.' },
        { name: 'headlineLine1BM', type: 'text', defaultValue: 'Mesin terbaik di dunia.' },
        { name: 'headlineEmphasis', type: 'text', defaultValue: 'The bond built for here.' },
        { name: 'headlineEmphasisBM', type: 'text', defaultValue: 'Ikatan yang dibina untuk sini.' },
        {
          name: 'subheadline',
          type: 'textarea',
          defaultValue:
            'Shibuya Tools, Hiroshima, has built precision core drilling machines since 1933. Coolman has built diamond segments calibrated for Malaysian aggregate since 1998. The partnership matches the machine to the ground — and the ground to the machine.',
        },
        {
          name: 'subheadlineBM',
          type: 'textarea',
          defaultValue:
            'Shibuya Tools, Hiroshima, telah membina mesin penggerudi teras berketepatan sejak 1933. Coolman telah membina segmen berlian yang dikalibrasi untuk agregat Malaysia sejak 1998.',
        },
      ]),
    },

    // ── Trust Bar ─────────────────────────────────────────────────────────────
    {
      name: 'trustBar',
      type: 'group',
      admin: { description: '4-stat strip shown below the hero.' },
      fields: bilingualTabs([
        {
          name: 'stats',
          type: 'array',
          minRows: 4,
          maxRows: 4,
          defaultValue: [
            { number: '300+', label: 'Shibuya machines\nin Malaysia', labelBM: 'Mesin Shibuya\ndi Malaysia' },
            { number: '2011', label: 'Sole authorised\nMalaysian partner', labelBM: 'Rakan kongsi Malaysia\nsah tunggal' },
            { number: '3 yr', label: 'Full mechanical\nwarranty', labelBM: 'Waranti mekanikal\npenuh' },
            { number: '48 h', label: 'Replacement parts\nfrom PJ workshop', labelBM: 'Alat ganti\ndari bengkel PJ' },
          ],
          fields: bilingualTabs([
            { name: 'number', type: 'text', required: true, admin: notTranslated },
            { name: 'label', type: 'text', required: true, admin: { description: 'Two lines separated by \\n' } },
            { name: 'labelBM', type: 'text' },
          ]),
        },
      ]),
    },

    // ── Machine Story ─────────────────────────────────────────────────────────
    {
      name: 'machineStory',
      type: 'group',
      admin: { description: 'Two-column partnership narrative.' },
      fields: bilingualTabs([
        { name: 'eyebrow', type: 'text', defaultValue: 'Two workshops, one cut' },
        { name: 'eyebrowBM', type: 'text', defaultValue: 'Dua bengkel, satu potongan' },
        { name: 'headline', type: 'text', defaultValue: 'The machine is Japanese. The bond is Malaysian.' },
        { name: 'headlineBM', type: 'text', defaultValue: 'Mesin itu Jepun. Ikatan itu Malaysia.' },
        {
          name: 'intro',
          type: 'textarea',
          defaultValue: 'Each side does what the other will not. The result is a machine-and-blade pairing where neither half has to compromise for the other.',
        },
        {
          name: 'introBM',
          type: 'textarea',
          defaultValue: 'Setiap pihak melakukan apa yang pihak lain tidak akan lakukan. Hasilnya adalah pasangan mesin dan mata yang mana tidak ada separuh yang perlu berkompromi.',
        },
        // Column 1: Shibuya / The machine
        { name: 'col1Tag', type: 'text', defaultValue: 'Shibuya · Since 1933' },
        { name: 'col1TagBM', type: 'text', defaultValue: 'Shibuya · Sejak 1933' },
        { name: 'col1Title', type: 'text', defaultValue: 'The machine.' },
        { name: 'col1TitleBM', type: 'text', defaultValue: 'Mesin itu.' },
        {
          name: 'col1Body',
          type: 'textarea',
          defaultValue:
            'Shibuya core drilling machines are precision instruments. Hand-built in Hiroshima. Servo-controlled feed rate, hydraulic counterbalance, magnetic-anchor and vacuum-anchor base systems, hole-runout tolerances measured in the tens of microns.\n\nWhat does not change in 92 years of Shibuya engineering: the machine is not the wear part. The blade is.',
        },
        { name: 'col1BodyBM', type: 'textarea' },
        { name: 'col1Country', type: 'text', defaultValue: 'Hiroshima, Japan', admin: notTranslated },
        // Column 2: Coolman / The bond
        { name: 'col2Tag', type: 'text', defaultValue: 'Coolman · Since 1998' },
        { name: 'col2TagBM', type: 'text', defaultValue: 'Coolman · Sejak 1998' },
        { name: 'col2Title', type: 'text', defaultValue: 'The bond.' },
        { name: 'col2TitleBM', type: 'text', defaultValue: 'Ikatan itu.' },
        {
          name: 'col2Body',
          type: 'textarea',
          defaultValue:
            'A Shibuya rig fitted with a European-bond core bit on a KL podium will run with mechanical precision and a glazed bit. The fault is not the machine. The fault is that the bond holding the diamond was not calibrated for the ground.\n\nCoolman builds the core bit the Shibuya rig deserves. Cobalt blend formulated against KL crushed granite, MRT3 segment work, Genting granite stocks, Pahang aggregate.',
        },
        { name: 'col2BodyBM', type: 'textarea' },
        { name: 'col2Country', type: 'text', defaultValue: 'Petaling Jaya, Malaysia', admin: notTranslated },
        // Optional site photo below the story pair
        { name: 'sitePhoto', type: 'upload', relationTo: 'media' },
        { name: 'sitePhotoAlt', type: 'text', admin: notTranslated },
      ]),
    },

    // ── Service Section ───────────────────────────────────────────────────────
    {
      name: 'serviceSection',
      type: 'group',
      admin: { description: 'Service & warranty section with stats, photos, and numbered service points.' },
      fields: bilingualTabs([
        { name: 'eyebrow', type: 'text', defaultValue: 'In-house service · Since 2011' },
        { name: 'eyebrowBM', type: 'text', defaultValue: 'Servis dalaman · Sejak 2011' },
        { name: 'headline', type: 'text', defaultValue: 'Two trained Shibuya technicians. Same workshop, same building.' },
        { name: 'headlineBM', type: 'text', defaultValue: 'Dua juruteknik Shibuya terlatih. Bengkel yang sama, bangunan yang sama.' },
        {
          name: 'body',
          type: 'textarea',
          defaultValue:
            'The Shibuya service contract is not subcontracted. Every machine sold in Malaysia is serviced in the Petaling Jaya workshop by technicians factory-trained in Hiroshima. Replacement parts are stocked locally — not air-freighted on demand.',
        },
        { name: 'bodyBM', type: 'textarea' },
        {
          name: 'stats',
          type: 'array',
          minRows: 3,
          maxRows: 3,
          defaultValue: [
            { number: '3 yr', label: 'Full mechanical warranty\nmotor, gearbox, feed assembly', labelBM: 'Waranti mekanikal penuh\nmotor, kotak gear, pemasangan suap' },
            { number: '48 h', label: 'Parts turnaround\nfrom PJ workshop stock', labelBM: 'Pusing ganti alat ganti\ndari stok bengkel PJ' },
            { number: '2', label: 'Factory-trained Shibuya\ntechnicians on staff', labelBM: 'Juruteknik Shibuya\nterlatih kilang dalam kakitangan' },
          ],
          fields: bilingualTabs([
            { name: 'number', type: 'text', required: true, admin: notTranslated },
            { name: 'label', type: 'text', required: true },
            { name: 'labelBM', type: 'text' },
          ]),
        },
        {
          name: 'photos',
          type: 'array',
          minRows: 0,
          maxRows: 3,
          fields: bilingualTabs([
            { name: 'photo', type: 'upload', relationTo: 'media' },
            { name: 'caption', type: 'text' },
            { name: 'captionBM', type: 'text' },
          ]),
        },
        {
          name: 'servicePoints',
          type: 'array',
          minRows: 4,
          maxRows: 4,
          defaultValue: [
            {
              number: '01',
              label: 'Warranty',
              labelBM: 'Waranti',
              title: 'Three-year full mechanical warranty.',
              titleBM: 'Waranti mekanikal penuh tiga tahun.',
              body: 'Every Shibuya machine sold through Coolman carries a three-year warranty on the motor, gearbox, and feed assembly. Parts and labour included. Loan unit provided during any repair period exceeding 48 hours.',
              bodyBM: 'Setiap mesin Shibuya yang dijual melalui Coolman mempunyai waranti tiga tahun untuk motor, kotak gear, dan pemasangan suap. Termasuk alat ganti dan buruh. Unit pinjaman disediakan semasa tempoh pembaikan melebihi 48 jam.',
            },
            {
              number: '02',
              label: 'Calibration',
              labelBM: 'Kalibrasi',
              title: 'Annual factory calibration, complimentary for three years.',
              titleBM: 'Kalibrasi kilang tahunan, percuma selama tiga tahun.',
              body: 'Free annual calibration for the first three years of ownership. Feed rate, anchor tolerance, motor draw under load. Calibration certificate issued after each session — accepted for compliance documentation on MRT, LRT, and government contracts.',
              bodyBM: 'Kalibrasi tahunan percuma untuk tiga tahun pertama pemilikan. Kadar suap, toleransi sauh, tarikan motor di bawah beban. Sijil kalibrasi dikeluarkan selepas setiap sesi.',
            },
            {
              number: '03',
              label: 'Parts',
              labelBM: 'Alat Ganti',
              title: 'Replacement parts in 48 hours.',
              titleBM: 'Alat ganti dalam 48 jam.',
              body: 'The Petaling Jaya workshop stocks every replacement part for the TS-403, TS-602, and TS-1000 lines. Air freight from Hiroshima for non-stocked parts: seven working days maximum.',
              bodyBM: 'Bengkel Petaling Jaya menyimpan setiap alat ganti untuk barisan TS-403, TS-602, dan TS-1000. Kargo udara dari Hiroshima untuk alat ganti yang tidak disimpan: maksimum tujuh hari bekerja.',
            },
            {
              number: '04',
              label: 'Training',
              labelBM: 'Latihan',
              title: 'On-site operator training, no charge, up to two operators.',
              titleBM: 'Latihan pengendali di tapak, tiada caj, sehingga dua pengendali.',
              body: 'Every new machine purchase includes a half-day operator training session. Conducted at the Petaling Jaya workshop or at your site — your choice. Covers rig setup, vacuum and stud anchoring, feed-rate selection, and water management.',
              bodyBM: 'Setiap pembelian mesin baharu termasuk sesi latihan pengendali setengah hari. Dijalankan di bengkel Petaling Jaya atau di tapak anda — pilihan anda.',
            },
          ],
          fields: bilingualTabs([
            { name: 'number', type: 'text', required: true, admin: notTranslated },
            { name: 'label', type: 'text', required: true },
            { name: 'labelBM', type: 'text' },
            { name: 'title', type: 'text', required: true },
            { name: 'titleBM', type: 'text' },
            { name: 'body', type: 'textarea', required: true },
            { name: 'bodyBM', type: 'textarea' },
          ]),
        },
      ]),
    },

    // ── CTA ───────────────────────────────────────────────────────────────────
    {
      name: 'cta',
      type: 'group',
      fields: bilingualTabs([
        { name: 'eyebrow', type: 'text', defaultValue: 'Order, service, or training' },
        { name: 'eyebrowBM', type: 'text', defaultValue: 'Pesanan, servis, atau latihan' },
        { name: 'headline', type: 'text', defaultValue: 'One conversation for the machine, the bit, and the cut.' },
        { name: 'headlineBM', type: 'text', defaultValue: 'Satu perbualan untuk mesin, mata, dan potongan.' },
        {
          name: 'body',
          type: 'textarea',
          defaultValue:
            'Whether you are buying a new Shibuya rig, sending one in for annual calibration, or wondering which line fits a job — the engineering desk handles all of it. Same number since 1998.',
        },
        { name: 'bodyBM', type: 'textarea' },
        { name: 'primaryCtaLabel', type: 'text', defaultValue: 'Open WhatsApp →' },
        { name: 'primaryCtaLabelBM', type: 'text', defaultValue: 'Buka WhatsApp →' },
        { name: 'secondaryCtaLabel', type: 'text', defaultValue: 'All channels' },
        { name: 'secondaryCtaLabelBM', type: 'text', defaultValue: 'Semua saluran' },
      ]),
    },

    // ── Legacy fields (hidden, preserved in DB) ───────────────────────────────
    {
      name: 'heritage',
      type: 'group',
      admin: { hidden: true },
      fields: bilingualTabs([
        { name: 'since', type: 'text' },
        { name: 'statement', type: 'textarea' },
        { name: 'statementBM', type: 'textarea' },
      ]),
    },
    {
      name: 'craftsmanship',
      type: 'group',
      admin: { hidden: true },
      fields: bilingualTabs([
        { name: 'sectionLabel', type: 'text' },
        { name: 'sectionLabelBM', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'titleBM', type: 'text' },
        { name: 'body', type: 'textarea' },
        { name: 'bodyBM', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'points',
          type: 'array',
          fields: bilingualTabs([
            { name: 'number', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'titleBM', type: 'text' },
            { name: 'description', type: 'textarea' },
            { name: 'descriptionBM', type: 'textarea' },
          ]),
        },
      ]),
    },
    {
      name: 'inAction',
      type: 'group',
      admin: { hidden: true },
      fields: bilingualTabs([
        { name: 'title', type: 'text' },
        { name: 'titleBM', type: 'text' },
        { name: 'body', type: 'textarea' },
        { name: 'bodyBM', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ]),
    },
    {
      name: 'support',
      type: 'group',
      admin: { hidden: true },
      fields: bilingualTabs([
        { name: 'title', type: 'text' },
        { name: 'titleBM', type: 'text' },
        {
          name: 'items',
          type: 'array',
          fields: bilingualTabs([
            { name: 'title', type: 'text' },
            { name: 'titleBM', type: 'text' },
            { name: 'description', type: 'textarea' },
            { name: 'descriptionBM', type: 'textarea' },
          ]),
        },
      ]),
    },
  ],
}
