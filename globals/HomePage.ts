import type { GlobalConfig } from 'payload'
import { bilingualTabs } from '@/lib/admin/bilingualTabs'

// Home Page global — rewired June 2026 to match the transactional landing
// (HomePageClient). Mirrors the structure of lib/i18n/home-landing.ts, which
// remains the code-side fallback: any field left blank here falls back to that
// module, so the page never blanks out. Functional micro-copy (form field
// labels, "Sending…", interest options) stays in code by design — only the
// marketing copy is admin-editable. BM fields fall back to EN when blank.
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  access: { read: () => true },
  admin: {
    livePreview: {
      url: () => `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    },
  },
  fields: [
    // ── HERO ──────────────────────────────────────────────────────────────
    {
      name: 'hero',
      type: 'group',
      fields: bilingualTabs([
        { name: 'eyebrow', type: 'text', defaultValue: 'Diamond tools · Selangor · since 2007' },
        { name: 'eyebrowBM', type: 'text', defaultValue: 'Alat berlian · Selangor · sejak 2007', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'headlineLineOne', type: 'text', defaultValue: 'The right blade', admin: { description: 'First line of the hero headline.' } },
        { name: 'headlineLineOneBM', type: 'text', defaultValue: 'Bilah yang tepat', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'headlineLineTwoPrefix', type: 'text', defaultValue: 'for ', admin: { description: 'Start of the second line, before the blue word(s). Keep the trailing space.' } },
        { name: 'headlineLineTwoPrefixBM', type: 'text', defaultValue: 'untuk ', admin: { description: 'Bahasa Malaysia. Keep the trailing space.' } },
        { name: 'headlineEmphasis', type: 'text', defaultValue: 'every cut', admin: { description: 'The blue emphasised word(s) at the end of the headline.' } },
        { name: 'headlineEmphasisBM', type: 'text', defaultValue: 'setiap potongan', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'lede', type: 'textarea', defaultValue: 'Blades, core bits and cutting systems engineered for Malaysian rock, rebar and schedule. Tell us the job — we send the spec and the price.' },
        { name: 'ledeBM', type: 'textarea', defaultValue: 'Bilah, mata teras dan sistem pemotongan direka untuk batuan, rebar dan jadual kerja Malaysia. Beritahu kami kerjanya — kami hantar spesifikasi dan harganya.', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'ctaPrimary', type: 'text', defaultValue: 'Browse products' },
        { name: 'ctaPrimaryBM', type: 'text', defaultValue: 'Lihat produk', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'ctaSecondary', type: 'text', defaultValue: 'Speak to engineering' },
        { name: 'ctaSecondaryBM', type: 'text', defaultValue: 'Cakap dengan kejuruteraan', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'badgeTag', type: 'text', defaultValue: 'Ready stock', admin: { description: 'Small label on the image badge.' } },
        { name: 'badgeTagBM', type: 'text', defaultValue: 'Stok sedia', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'badgeValue', type: 'text', defaultValue: 'Shipped from Selangor', admin: { description: 'Bold line on the image badge.' } },
        { name: 'badgeValueBM', type: 'text', defaultValue: 'Dihantar dari Selangor', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        {
          name: 'stats',
          type: 'array',
          admin: { description: 'The four stat tiles under the hero buttons. Value is shown as-is (no translation); label is bilingual.' },
          defaultValue: [
            { value: '2007', label: 'Cutting since', labelBM: 'Memotong sejak' },
            { value: '247', label: 'SKUs in stock', labelBM: 'SKU dalam stok' },
            { value: '2014', label: 'Shibuya partner', labelBM: 'Rakan Shibuya' },
            { value: '2 days', label: 'Typical dispatch', labelBM: 'Penghantaran biasa' },
          ],
          fields: [
            { name: 'value', type: 'text', required: true, admin: { description: 'e.g. 2007, 247, 2 days — shown as-is, not translated.' } },
            { name: 'label', type: 'text', required: true },
            { name: 'labelBM', type: 'text', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
          ],
        },
      ]),
    },

    // ── TRUST BAR ─────────────────────────────────────────────────────────
    {
      name: 'trustBar',
      type: 'group',
      fields: [
        {
          name: 'items',
          type: 'array',
          admin: { description: 'The strip of short trust statements under the hero.' },
          defaultValue: [
            { text: 'Engineered in Selangor', textBM: 'Direka di Selangor' },
            { text: 'Shibuya Japan distributor', textBM: 'Pengedar Shibuya Japan' },
            { text: 'WhatsApp tech support', textBM: 'Sokongan teknikal WhatsApp' },
            { text: 'Trade pricing for contractors', textBM: 'Harga dagangan untuk kontraktor' },
            { text: 'Dispatch within 2 business days', textBM: 'Penghantaran dalam 2 hari bekerja' },
          ],
          fields: [
            { name: 'text', type: 'text', required: true },
            { name: 'textBM', type: 'text', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
          ],
        },
      ],
    },

    // ── WHY COOLMAN ───────────────────────────────────────────────────────
    {
      name: 'why',
      type: 'group',
      fields: bilingualTabs([
        { name: 'eyebrow', type: 'text', defaultValue: 'Why Coolman' },
        { name: 'eyebrowBM', type: 'text', defaultValue: 'Kenapa Coolman', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'heading', type: 'text', defaultValue: 'Built for the Malaysian job site' },
        { name: 'headingBM', type: 'text', defaultValue: 'Dibina untuk tapak kerja Malaysia', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        {
          name: 'cards',
          type: 'array',
          admin: { description: 'The three numbered reasons.' },
          defaultValue: [
            { num: '01', title: 'Engineered for the rock here', titleBM: 'Direka untuk batuan di sini', body: 'Tested on Malaysian aggregate, rebar and tropical concrete — not a European catalogue. If it cuts here, it cuts anywhere.', bodyBM: 'Diuji pada agregat, rebar dan konkrit tropika Malaysia — bukan katalog Eropah. Kalau ia memotong di sini, ia memotong di mana-mana.' },
            { num: '02', title: 'The engineering desk answers', titleBM: 'Meja kejuruteraan menjawab', body: "Send the cut on WhatsApp. Alan's desk replies with the right spec — direct, with no salesman in between.", bodyBM: 'Hantar potongan itu di WhatsApp. Meja Alan balas dengan spesifikasi yang betul — terus, tanpa jurujual di tengah.' },
            { num: '03', title: 'Order direct, see the price', titleBM: 'Pesan terus, lihat harga', body: 'Trade accounts get tier pricing and reorder history. The effective price shows before you submit — never a surprise invoice.', bodyBM: 'Akaun dagangan dapat harga berperingkat dan sejarah pesanan. Harga efektif ditunjukkan sebelum anda hantar — tiada invois mengejut.' },
          ],
          fields: [
            { name: 'num', type: 'text', required: true, admin: { description: 'e.g. 01, 02, 03.' } },
            { name: 'title', type: 'text', required: true },
            { name: 'titleBM', type: 'text', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
            { name: 'body', type: 'textarea', required: true },
            { name: 'bodyBM', type: 'textarea', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
          ],
        },
      ]),
    },

    // ── PRODUCTS HEADER ───────────────────────────────────────────────────
    {
      name: 'products',
      type: 'group',
      admin: { description: 'The heading above the products grid. The grid itself is driven by the catalogue.' },
      fields: bilingualTabs([
        { name: 'eyebrow', type: 'text', defaultValue: 'Product range' },
        { name: 'eyebrowBM', type: 'text', defaultValue: 'Rangkaian produk', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'heading', type: 'text', defaultValue: 'Tools for every cut' },
        { name: 'headingBM', type: 'text', defaultValue: 'Alat untuk setiap potongan', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
      ]),
    },

    // ── SHIBUYA BAND ──────────────────────────────────────────────────────
    {
      name: 'shibuya',
      type: 'group',
      fields: bilingualTabs([
        { name: 'badge', type: 'text', defaultValue: 'Official Malaysia distributor · since 2014' },
        { name: 'badgeBM', type: 'text', defaultValue: 'Pengedar rasmi Malaysia · sejak 2014', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'headlineLineOne', type: 'text', defaultValue: 'Shibuya core', admin: { description: 'First line of the Shibuya heading.' } },
        { name: 'headlineLineOneBM', type: 'text', defaultValue: 'Mesin gerudi', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'headlineLineTwo', type: 'text', defaultValue: 'drilling machines', admin: { description: 'Second line of the Shibuya heading.' } },
        { name: 'headlineLineTwoBM', type: 'text', defaultValue: 'teras Shibuya', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'lede', type: 'textarea', defaultValue: "Japan's most trusted core-drilling technology, backed by Coolman's training, service and spare-part stock here in Malaysia." },
        { name: 'ledeBM', type: 'textarea', defaultValue: 'Teknologi penggerudian teras paling dipercayai dari Jepun, disokong latihan, servis dan stok alat ganti Coolman di Malaysia.', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'cta', type: 'text', defaultValue: 'Request a demo' },
        { name: 'ctaBM', type: 'text', defaultValue: 'Minta demo', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        {
          name: 'bullets',
          type: 'array',
          admin: { description: 'The bullet list of Shibuya capabilities.' },
          defaultValue: [
            { text: 'Rated 52mm to 600mm core diameters', textBM: 'Dinilai untuk diameter teras 52mm hingga 600mm' },
            { text: 'Reinforced concrete & post-tension rated', textBM: 'Konkrit bertetulang & post-tension' },
            { text: 'Operator training & on-site demo', textBM: 'Latihan operator & demo di tapak' },
            { text: 'Spare parts stocked locally', textBM: 'Alat ganti distok tempatan' },
          ],
          fields: [
            { name: 'text', type: 'text', required: true },
            { name: 'textBM', type: 'text', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
          ],
        },
        {
          name: 'stats',
          type: 'array',
          admin: { description: 'The four Shibuya stat tiles. Value shown as-is; label is bilingual.' },
          defaultValue: [
            { value: '600mm', label: 'Max core size', labelBM: 'Saiz teras maks' },
            { value: '52mm', label: 'Min core size', labelBM: 'Saiz teras min' },
            { value: '2014', label: 'Distributor since', labelBM: 'Pengedar sejak' },
            { value: 'MY', label: 'Local service', labelBM: 'Servis tempatan' },
          ],
          fields: [
            { name: 'value', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
            { name: 'labelBM', type: 'text', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
          ],
        },
        {
          name: 'tags',
          type: 'array',
          admin: { description: 'The small sector tags under the Shibuya stats.' },
          defaultValue: [
            { text: 'High-rise', textBM: 'Bangunan tinggi' },
            { text: 'Infrastructure', textBM: 'Infrastruktur' },
            { text: 'MEP services', textBM: 'Perkhidmatan MEP' },
            { text: 'Renovation', textBM: 'Pengubahsuaian' },
          ],
          fields: [
            { name: 'text', type: 'text', required: true },
            { name: 'textBM', type: 'text', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
          ],
        },
      ]),
    },

    // ── CONTACT ───────────────────────────────────────────────────────────
    {
      name: 'contact',
      type: 'group',
      admin: { description: 'The contact section heading and details. The form field labels stay fixed in code.' },
      fields: bilingualTabs([
        { name: 'eyebrow', type: 'text', defaultValue: 'Get in touch' },
        { name: 'eyebrowBM', type: 'text', defaultValue: 'Hubungi kami', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'heading', type: 'text', defaultValue: 'Request a quote or the right spec' },
        { name: 'headingBM', type: 'text', defaultValue: 'Minta sebut harga atau spesifikasi yang betul', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'whatsappCta', type: 'text', defaultValue: 'WhatsApp us now' },
        { name: 'whatsappCtaBM', type: 'text', defaultValue: 'WhatsApp kami sekarang', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'workshopValue', type: 'textarea', defaultValue: 'Selangor, Malaysia', admin: { description: 'Workshop / address line.' } },
        { name: 'workshopValueBM', type: 'textarea', defaultValue: 'Selangor, Malaysia', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'emailValue', type: 'text', defaultValue: 'info@coolman.com.my', admin: { description: 'Contact email shown on the page (not translated).' } },
        { name: 'hoursValue', type: 'text', defaultValue: 'Mon–Fri 8:30–17:30 · Sat 8:30–13:00' },
        { name: 'hoursValueBM', type: 'text', defaultValue: 'Isn–Jum 8:30–17:30 · Sab 8:30–13:00', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
      ]),
    },
  ],
}
