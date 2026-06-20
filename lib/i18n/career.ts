import type { Language } from './copy'

// ──────────────────────────────────────────────────────────────────────────
// Career page copy — added June 2026 when GH asked for a Career nav item.
// PLACEHOLDER VOICE: this is neutral, factual recruitment copy, NOT Alan's
// editorial voice and NOT a list of real vacancies. GH to refine the wording
// (and we should make it CMS-editable) once the recruitment content is set.
// Verified facts only: since 2007, 2-business-day dispatch. Role areas are
// framed as "where we usually hire", not specific open positions.
// ──────────────────────────────────────────────────────────────────────────

export interface CareerCopy {
  eyebrow: string
  heading: string
  lede: string
  rolesHeading: string
  roles: { num: string; title: string; body: string }[]
  applyHeading: string
  applyBody: string
  emailCta: string
  whatsappCta: string
}

const EN: CareerCopy = {
  eyebrow: 'Careers · Selangor',
  heading: 'Build a career in cutting',
  lede: "Coolman has supplied Malaysian contractors with diamond tools since 2007. We grow by hiring people who respect the job site and want to get the spec right — not just close a sale.",
  rolesHeading: 'Where we usually hire',
  roles: [
    {
      num: '01',
      title: 'Technical sales',
      body: 'On the phone and on site with contractors — matching the right blade or rig to the cut, not pushing a price list.',
    },
    {
      num: '02',
      title: 'Workshop & dispatch',
      body: 'Picking, checking and getting stock out the door inside our 2-business-day dispatch promise.',
    },
    {
      num: '03',
      title: 'Engineering desk',
      body: 'Answering the WhatsApp spec questions that keep contractors cutting through the day.',
    },
  ],
  applyHeading: 'How to apply',
  applyBody: 'Send your CV and a line or two about the work you have done. We read every one.',
  emailCta: 'Email your CV',
  whatsappCta: 'WhatsApp us',
}

const BM: CareerCopy = {
  eyebrow: 'Kerjaya · Selangor',
  heading: 'Bina kerjaya dalam pemotongan',
  lede: 'Coolman telah membekalkan alat berlian kepada kontraktor Malaysia sejak 2007. Kami berkembang dengan mengambil orang yang menghormati tapak kerja dan mahu betulkan spesifikasi — bukan sekadar tutup jualan.',
  rolesHeading: 'Di mana kami biasa mengambil pekerja',
  roles: [
    {
      num: '01',
      title: 'Jualan teknikal',
      body: 'Di telefon dan di tapak bersama kontraktor — memadankan bilah atau mesin yang betul dengan potongan, bukan menolak senarai harga.',
    },
    {
      num: '02',
      title: 'Bengkel & penghantaran',
      body: 'Memilih, menyemak dan menghantar stok keluar dalam janji penghantaran 2 hari bekerja kami.',
    },
    {
      num: '03',
      title: 'Meja kejuruteraan',
      body: 'Menjawab soalan spesifikasi WhatsApp yang memastikan kontraktor terus memotong sepanjang hari.',
    },
  ],
  applyHeading: 'Cara memohon',
  applyBody: 'Hantar resume anda dan satu dua baris tentang kerja yang anda pernah buat. Kami baca setiap satu.',
  emailCta: 'E-mel resume anda',
  whatsappCta: 'WhatsApp kami',
}

export const CAREER: Record<Language, CareerCopy> = { EN, BM }
