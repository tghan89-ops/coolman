import type { GlobalConfig } from 'payload'
import { bilingualTabs } from '@/lib/admin/bilingualTabs'

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
      name: 'opening',
      type: 'group',
      fields: bilingualTabs([
        { name: 'eyebrow',           type: 'text',     defaultValue: 'Coolman · Manufacturer of cutting tools · Petaling Jaya, 2007' },
        { name: 'eyebrowBM',         type: 'text',     defaultValue: 'Coolman · Pengeluar alat pemotong · Petaling Jaya, 2007',  admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'headlinePrefix',    type: 'text',     defaultValue: 'Right Job ' },
        { name: 'headlinePrefixBM',  type: 'text',     defaultValue: 'Kerja yang Betul ',                                        admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'headlineEmphasis',  type: 'text',     defaultValue: 'Matched with the Right Blade.' },
        { name: 'headlineEmphasisBM', type: 'text',    defaultValue: 'Dipadankan dengan Bilah yang Betul.',                      admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        {
          name: 'lede',
          type: 'textarea',
          defaultValue: 'Coolman has built diamond blades, core bits and cutting systems in Malaysia since 2007. Our founder, Alan, has been in the cutting trade since 1998. Every blade we make is engineered for the rock, the rebar and the schedule Malaysian contractors face.',
        },
        {
          name: 'ledeBM',
          type: 'textarea',
          defaultValue: 'Coolman telah membina bilah berlian, mata teras dan sistem pemotongan di Malaysia sejak 2007. Pengasas kami, Alan, telah berada dalam bidang pemotongan sejak 1998. Setiap bilah yang kami hasilkan direka untuk batu, besi tetulang dan jadual yang dihadapi kontraktor Malaysia.',
          admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' },
        },
        { name: 'ctaPrimary',     type: 'text', defaultValue: 'Speak to engineering' },
        { name: 'ctaPrimaryBM',   type: 'text', defaultValue: 'Berbual dengan kejuruteraan', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'ctaSecondary',   type: 'text', defaultValue: 'Browse the tools' },
        { name: 'ctaSecondaryBM', type: 'text', defaultValue: 'Lihat alat',                 admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
      ]),
    },

    {
      name: 'fearGrid',
      type: 'group',
      fields: bilingualTabs([
        { name: 'eyebrow',    type: 'text', defaultValue: 'What contractors live with' },
        { name: 'eyebrowBM',  type: 'text', defaultValue: 'Apa yang kontraktor tanggung',                                         admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'headline',   type: 'text', defaultValue: "Four things keep the boss up at night. We've watched all four on site." },
        { name: 'headlineBM', type: 'text', defaultValue: 'Empat perkara yang menjadikan bos sukar tidur. Kami sudah menyaksi keempat-empatnya di tapak.', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        {
          name: 'cards',
          type: 'array',
          defaultValue: [
            { key: 'delay',          title: 'A delay you cannot explain to the developer',              titleBM: 'Kelewatan yang anda tidak boleh jelaskan kepada pemaju',                  body: 'The blade is slow. The schedule delays. The customer is already calling. We have watched this happen more times than we wish.',                                                                                            bodyBM: 'Bilah perlahan. Jadual tertunda. Pelanggan sudah pun menelefon. Kami sudah lihat ini berlaku lebih kerap daripada yang kami mahu.' },
            { key: 'equipment',      title: 'Equipment that fails at 11pm on a road closure',           titleBM: 'Peralatan yang gagal pada 11 malam semasa penutupan jalan',                body: "When the cut has to be done tonight and the blade gives out at the wrong moment, the cost isn't the blade. It's the closure, the police, the developer phoning at 6am.",                                                      bodyBM: 'Apabila potongan mesti siap malam ini dan bilah putus pada saat yang salah, kos itu bukan bilah. Ia adalah penutupan, polis, dan pemaju yang menelefon pada jam 6 pagi.' },
            { key: 'inconsistency',  title: 'Inconsistency between blades that should be identical',    titleBM: 'Ketidakkonsistenan antara bilah yang sepatutnya serupa',                  body: 'One blade cuts. The next one of the same SKU lasts half as long. The crew loses faith. The supplier loses the account.',                                                                                                     bodyBM: 'Satu bilah memotong. Bilah seterusnya dengan SKU yang sama tahan separuh sahaja. Krew hilang keyakinan. Pembekal hilang akaun.' },
            { key: 'alone',          title: "Being left alone with a cut nobody else has seen",         titleBM: 'Ditinggalkan keseorangan dengan potongan yang belum pernah dilihat orang lain', body: 'A new aggregate. An unusual depth. A spec the supplier has never tested. The crew gets it. The supplier ducks the call.',                                                                                                  bodyBM: 'Agregat baru. Kedalaman luar biasa. Spesifikasi yang pembekal tidak pernah uji. Krew faham. Pembekal mengelak panggilan.' },
          ],
          fields: bilingualTabs([
            { name: 'key',     type: 'text',     required: true, admin: { description: 'Stable key matching the fear icon in the UI — do not change: delay, equipment, inconsistency, alone.' } },
            { name: 'title',   type: 'text',     required: true },
            { name: 'titleBM', type: 'text',     admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
            { name: 'body',    type: 'textarea', required: true },
            { name: 'bodyBM',  type: 'textarea', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
          ]),
        },
      ]),
    },

    {
      name: 'threeMythsIntro',
      type: 'group',
      fields: bilingualTabs([
        { name: 'eyebrow',    type: 'text',     defaultValue: 'Three myths' },
        { name: 'eyebrowBM',  type: 'text',     defaultValue: 'Tiga mitos',                                                                                                                                                  admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'headline',   type: 'text',     defaultValue: 'Three things the cutting trade keeps getting wrong.' },
        { name: 'headlineBM', type: 'text',     defaultValue: 'Tiga perkara yang industri pemotongan terus salah faham.',                                                                                                      admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        {
          name: 'lede',
          type: 'textarea',
          defaultValue: "The cheap blade costs more by the end of the job. The dealer who's never been on site can't tell you why your blade glazed. And 'Made in Japan' doesn't mean it was made for cutting Malaysian concrete.",
        },
        {
          name: 'ledeBM',
          type: 'textarea',
          defaultValue: "Bilah yang murah sebenarnya lebih mahal pada akhir kerja. Pengedar yang tidak pernah ke tapak tidak dapat beritahu anda kenapa bilah anda mengaca. Dan 'Buatan Jepun' tidak bermakna ia dibuat untuk memotong konkrit Malaysia.",
          admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' },
        },
        { name: 'ctaLabel',   type: 'text', defaultValue: 'Read the folio' },
        { name: 'ctaLabelBM', type: 'text', defaultValue: 'Baca folio',      admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
      ]),
    },

    {
      name: 'brotherhoodIntro',
      type: 'group',
      fields: bilingualTabs([
        { name: 'eyebrow',    type: 'text',     defaultValue: 'The Brotherhood System' },
        { name: 'eyebrowBM',  type: 'text',     defaultValue: 'Sistem Brotherhood',                                                                                                                                        admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'headline',   type: 'text',     defaultValue: 'How we work with the people who buy from us.' },
        { name: 'headlineBM', type: 'text',     defaultValue: 'Bagaimana kami bekerja dengan orang yang membeli daripada kami.',                                                                                            admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        {
          name: 'lede',
          type: 'textarea',
          defaultValue: 'Dealers and contractors who work with Coolman get direct access to engineering, not a points system. If you carry our blades, we treat you like a partner — not a customer number.',
        },
        {
          name: 'ledeBM',
          type: 'textarea',
          defaultValue: 'Pengedar dan kontraktor yang bekerja dengan Coolman mendapat akses terus ke kejuruteraan, bukan sistem mata. Jika anda membawa bilah kami, kami layani anda seperti rakan kongsi — bukan nombor pelanggan.',
          admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' },
        },
        { name: 'ctaLabel',   type: 'text', defaultValue: 'See the five principles' },
        { name: 'ctaLabelBM', type: 'text', defaultValue: 'Lihat lima prinsip',       admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
      ]),
    },

    {
      name: 'alansLetter',
      type: 'group',
      fields: bilingualTabs([
        { name: 'eyebrow',        type: 'text', defaultValue: 'A letter from Alan' },
        { name: 'eyebrowBM',      type: 'text', defaultValue: 'Surat daripada Alan',  admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        {
          name: 'paragraphs',
          type: 'array',
          defaultValue: [
            {
              paragraph: 'When I started in the cutting trade in 1998, I thought I knew what a good blade was. Nine years later, when I founded Coolman in 2007, I knew I had been wrong. A good blade is not the one with the best segment formulation on paper. It is the one that finishes the cut on the night the contractor cannot afford to fail.',
              paragraphBM: 'Apabila saya memulakan kerjaya dalam bidang pemotongan pada 1998, saya fikir saya tahu apa itu bilah yang baik. Sembilan tahun kemudian, ketika saya mengasaskan Coolman pada 2007, saya sedar saya silap. Bilah yang baik bukan yang mempunyai formulasi segmen terbaik di atas kertas. Ia adalah yang menyiapkan potongan pada malam kontraktor tidak mampu untuk gagal.',
            },
            {
              paragraph: 'Coolman is built around that single sentence. Every blade we ship is engineered for the kind of cut that breaks weaker blades: Malaysian aggregate, hard rebar, long pours, monsoon damp, a foreman with three jobs running and no time to nurse a slow tool.',
              paragraphBM: 'Coolman dibina di sekitar satu ayat itu. Setiap bilah yang kami hantar direka untuk jenis potongan yang memecahkan bilah yang lebih lemah: agregat Malaysia, besi tetulang keras, tuangan panjang, lembap monsun, mandor dengan tiga kerja berjalan dan tiada masa untuk menjaga alat yang perlahan.',
            },
            {
              paragraph: 'I started Coolman because I had watched too many contractors get sold a blade by someone who had never been on site at 2am. That has not happened to a Coolman customer in 19 years and it never will. If your cut goes wrong, you call me. Not a hotline. Me.',
              paragraphBM: 'Saya mengasaskan Coolman kerana saya telah menyaksi terlalu ramai kontraktor dijual bilah oleh orang yang tidak pernah berada di tapak pada jam 2 pagi. Itu tidak pernah berlaku kepada pelanggan Coolman selama 19 tahun dan ia tidak akan berlaku. Jika potongan anda gagal, anda telefon saya. Bukan talian hotline. Saya.',
            },
            {
              paragraph: 'The next pages are not marketing. They are how we work, what we have learned, and the jobs that taught us. If you read them and we still feel right for your worksite, we should talk.',
              paragraphBM: 'Halaman seterusnya bukan pemasaran. Itu adalah cara kami bekerja, apa yang kami telah pelajari, dan kerja yang mengajar kami. Jika anda membaca dan kami masih dirasakan sesuai untuk tapak anda, mari kita berbual.',
            },
          ],
          fields: bilingualTabs([
            { name: 'paragraph',   type: 'textarea', required: true },
            { name: 'paragraphBM', type: 'textarea', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
          ]),
        },
        { name: 'signature',      type: 'text', defaultValue: 'Alan',             admin: { description: 'Signature name — not translated.' } },
        { name: 'signatureLine2',   type: 'text', defaultValue: 'Founder, Coolman' },
        { name: 'signatureLine2BM', type: 'text', defaultValue: 'Pengasas, Coolman', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
      ]),
    },

    {
      name: 'quietDoor',
      type: 'group',
      fields: bilingualTabs([
        { name: 'eyebrow',      type: 'text',     defaultValue: 'The quiet door' },
        { name: 'eyebrowBM',    type: 'text',     defaultValue: 'Pintu yang senyap',                                                             admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'headline',     type: 'text',     defaultValue: 'The full range, in stock and ready to ship from Petaling Jaya.' },
        { name: 'headlineBM',   type: 'text',     defaultValue: 'Rangkaian penuh, dalam stok dan sedia untuk dihantar dari Petaling Jaya.',       admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'lede',         type: 'textarea', defaultValue: 'No catalogue front. No PDF download chase. Just the inventory, the spec, and a phone call away if the blade you need is not the one we list.' },
        { name: 'ledeBM',       type: 'textarea', defaultValue: 'Tiada muka katalog. Tiada perlu memburu PDF. Hanya inventori, spesifikasi, dan satu panggilan telefon jika bilah yang anda perlukan bukan yang kami senaraikan.', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'ctaPrimary',   type: 'text',     defaultValue: 'Open the catalogue' },
        { name: 'ctaPrimaryBM', type: 'text',     defaultValue: 'Buka katalog',                                                                  admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'ctaSecondary',   type: 'text',   defaultValue: 'Speak to engineering' },
        { name: 'ctaSecondaryBM', type: 'text',   defaultValue: 'Hubungi kejuruteraan',                                                          admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
      ]),
    },

    {
      name: 'conversation',
      type: 'group',
      fields: bilingualTabs([
        { name: 'eyebrow',    type: 'text',     defaultValue: 'How to start the conversation' },
        { name: 'eyebrowBM',  type: 'text',     defaultValue: 'Bagaimana memulakan perbualan',                      admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'headline',   type: 'text',     defaultValue: 'Three ways in. WhatsApp is the fastest.' },
        { name: 'headlineBM', type: 'text',     defaultValue: 'Tiga cara masuk. WhatsApp paling cepat.',            admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'lede',       type: 'textarea', defaultValue: "Most cuts begin with a phone call. We don't hide ours." },
        { name: 'ledeBM',     type: 'textarea', defaultValue: 'Kebanyakan potongan bermula dengan satu panggilan telefon. Kami tidak sembunyikan kami punya.', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        {
          name: 'channels',
          type: 'array',
          defaultValue: [
            { tag: 'Primary',  tagBM: 'Utama',     title: 'Engineering desk on WhatsApp',    titleBM: 'Meja kejuruteraan di WhatsApp',    body: 'Send a photo of the cut, the aggregate, the blade. We will tell you what we think before we tell you what we sell.', bodyBM: 'Hantar gambar potongan, agregat, bilah. Kami akan beritahu apa kami fikir sebelum kami beritahu apa kami jual.', ctaLabel: 'Open WhatsApp',        ctaLabelBM: 'Buka WhatsApp' },
            { tag: 'Office',   tagBM: 'Pejabat',   title: 'Petaling Jaya office line',       titleBM: 'Talian pejabat Petaling Jaya',    body: 'Speak to the team about an order, a dispatch, a returns question. Mon to Sat, 8:30am to 5:30pm.',                    bodyBM: 'Berbual dengan pasukan tentang pesanan, penghantaran, soalan pemulangan. Isnin hingga Sabtu, 8:30 pagi hingga 5:30 petang.', ctaLabel: 'Call the office', ctaLabelBM: 'Telefon pejabat' },
            { tag: 'On site',  tagBM: 'Di tapak',  title: 'Site visit form',                 titleBM: 'Borang lawatan tapak',            body: "If the cut is unusual, we'd rather come and see it than guess. Tell us where and when.",                               bodyBM: 'Jika potongan luar biasa, kami lebih rela datang melihat daripada meneka. Beritahu kami di mana dan bila.', ctaLabel: 'Request a site visit', ctaLabelBM: 'Minta lawatan tapak' },
          ],
          fields: bilingualTabs([
            { name: 'tag',        type: 'text',     required: true },
            { name: 'tagBM',      type: 'text',     admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
            { name: 'title',      type: 'text',     required: true },
            { name: 'titleBM',    type: 'text',     admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
            { name: 'body',       type: 'textarea', required: true },
            { name: 'bodyBM',     type: 'textarea', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
            { name: 'ctaLabel',   type: 'text',     required: true },
            { name: 'ctaLabelBM', type: 'text',     admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
          ]),
        },
      ]),
    },
  ],
}
