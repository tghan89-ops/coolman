import type { GlobalConfig } from 'payload'
import { bilingualTabs } from '@/lib/admin/bilingualTabs'

function folioGroup(
  num: '01' | '02' | '03',
  defs: {
    folioLabel: string; folioLabelBM: string
    category: string; categoryBM: string
    title: string; titleBM: string
    titleEmphasis: string; titleEmphasisBM: string
    summary: string; summaryBM: string
    metaAuthor: string
    metaSubject: string; metaSubjectBM: string
    metaRead: string; metaReadBM: string
    paragraphs: Array<{ paragraph: string; paragraphBM: string }>
    pullquote: string; pullquoteBM: string
  }
) {
  return {
    name: `folio${num}`,
    type: 'group' as const,
    fields: bilingualTabs([
      { name: 'folioLabel',       type: 'text' as const,     defaultValue: defs.folioLabel },
      { name: 'folioLabelBM',     type: 'text' as const,     defaultValue: defs.folioLabelBM },
      { name: 'category',         type: 'text' as const,     defaultValue: defs.category },
      { name: 'categoryBM',       type: 'text' as const,     defaultValue: defs.categoryBM },
      { name: 'title',            type: 'text' as const,     defaultValue: defs.title },
      { name: 'titleBM',          type: 'text' as const,     defaultValue: defs.titleBM },
      { name: 'titleEmphasis',    type: 'text' as const,     defaultValue: defs.titleEmphasis },
      { name: 'titleEmphasisBM',  type: 'text' as const,     defaultValue: defs.titleEmphasisBM },
      { name: 'summary',          type: 'textarea' as const, defaultValue: defs.summary },
      { name: 'summaryBM',        type: 'textarea' as const, defaultValue: defs.summaryBM },
      { name: 'metaAuthor',       type: 'text' as const,     defaultValue: defs.metaAuthor,      admin: { description: 'Author name — not translated.' } },
      { name: 'metaSubject',      type: 'text' as const,     defaultValue: defs.metaSubject },
      { name: 'metaSubjectBM',    type: 'text' as const,     defaultValue: defs.metaSubjectBM },
      { name: 'metaRead',         type: 'text' as const,     defaultValue: defs.metaRead },
      { name: 'metaReadBM',       type: 'text' as const,     defaultValue: defs.metaReadBM },
      {
        name: 'paragraphs',
        type: 'array' as const,
        defaultValue: defs.paragraphs,
        fields: bilingualTabs([
          { name: 'paragraph',   type: 'textarea' as const, required: true },
          { name: 'paragraphBM', type: 'textarea' as const },
        ]),
      },
      { name: 'pullquote',   type: 'text' as const, defaultValue: defs.pullquote },
      { name: 'pullquoteBM', type: 'text' as const, defaultValue: defs.pullquoteBM },
    ]),
  }
}

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
      fields: bilingualTabs([
        { name: 'eyebrow',        type: 'text',     defaultValue: 'Engineering Folio' },
        { name: 'eyebrowBM',      type: 'text',     defaultValue: 'Folio Kejuruteraan' },
        { name: 'title',          type: 'text',     defaultValue: 'Three arguments.' },
        { name: 'titleBM',        type: 'text',     defaultValue: 'Tiga hujah.' },
        { name: 'titleEmphasis',  type: 'text',     defaultValue: 'One trade.' },
        { name: 'titleEmphasisBM', type: 'text',    defaultValue: 'Satu industri.' },
        {
          name: 'lede',
          type: 'textarea',
          defaultValue: 'Three arguments that establish where Coolman stands on the cutting trade. The myths the industry still teaches. The case for matching bonds to Malaysian aggregate. The Brotherhood philosophy.',
        },
        {
          name: 'ledeBM',
          type: 'textarea',
          defaultValue: 'Tiga hujah yang menetapkan pendirian Coolman dalam industri pemotongan. Mitos yang masih diajar industri. Hujah untuk memadankan ikatan dengan agregat Malaysia. Falsafah Brotherhood.',
        },
      ]),
    },

    folioGroup('01', {
      folioLabel:     'Engineering Folio №01',
      folioLabelBM:   'Folio Kejuruteraan №01',
      category:       'Industry position',
      categoryBM:     'Pendirian industri',
      title:          'Three things the cutting trade keeps',
      titleBM:        'Tiga perkara yang industri pemotongan terus',
      titleEmphasis:  'getting wrong.',
      titleEmphasisBM: 'tersalah.',
      summary:        'After nearly thirty years in the Malaysian diamond tools industry, three beliefs are repeated so often they sound like wisdom. They are not.',
      summaryBM:      'Selepas hampir tiga puluh tahun dalam industri alat berlian Malaysia, tiga kepercayaan diulang begitu kerap hingga kedengaran seperti kebijaksanaan. Ia tidak.',
      metaAuthor:     'Coolman Engineering',
      metaSubject:    'Industry positioning',
      metaSubjectBM:  'Pendirian industri',
      metaRead:       '1 min read',
      metaReadBM:     'Bacaan 1 minit',
      paragraphs: [
        {
          paragraph: 'Three beliefs dominate sales conversations in the Malaysian cutting trade. Customers only care about price. More dealers means more growth. Made in Japan beats Made in China. Each one is repeated so often it sounds like wisdom. Each one is wrong.',
          paragraphBM: 'Tiga kepercayaan menguasai perbualan jualan dalam industri pemotongan Malaysia. Pelanggan hanya peduli harga. Lebih banyak pengedar bermakna lebih banyak pertumbuhan. Buatan Jepun mengalahkan Buatan China. Setiap satu diulang begitu kerap hingga kedengaran seperti kebijaksanaan. Setiap satu salah.',
        },
        {
          paragraph: 'A blade is RM300. A day\'s delay on a Klang Valley piling project can cost RM10,000 in penalties before you count idle workers. When a contractor pushes on price, they\'re asking whether they can trust the supplier — not whether the blade is cheap. On dealers: by year five of aggressive expansion, margins compress, service hollows out, and the brand is worth less than when it started. On country of origin: the variance inside any country\'s production is now larger than the average gap between countries.',
          paragraphBM: 'Bilah berharga RM300. Sehari kelewatan pada projek cerucuk Lembah Klang boleh kos RM10,000 dalam penalti sebelum mengira pekerja yang terbiar. Apabila kontraktor tolak pada harga, mereka bertanya sama ada boleh percaya pembekal — bukan sama ada bilah murah. Tentang pengedar: menjelang tahun lima pengembangan agresif, margin mampat, perkhidmatan merosot, dan jenama bernilai kurang daripada semasa ia bermula. Tentang negara asal: variasi dalam pengeluaran sesebuah negara kini lebih besar daripada jurang purata antara negara.',
        },
        {
          paragraph: 'The myths survive because they let suppliers avoid harder conversations. The contractors who stay profitable longest have already stopped believing them.',
          paragraphBM: 'Mitos-mitos ini bertahan kerana ia membolehkan pembekal elak perbualan yang lebih sukar. Kontraktor yang kekal menguntungkan paling lama sudah berhenti mempercayainya.',
        },
      ],
      pullquote:   'The conversation was never about the blade.',
      pullquoteBM: 'Perbualan itu tidak pernah tentang bilah.',
    }),

    folioGroup('02', {
      folioLabel:     'Engineering Folio №02',
      folioLabelBM:   'Folio Kejuruteraan №02',
      category:       'Technical',
      categoryBM:     'Teknikal',
      title:          'Malaysian aggregate breaks',
      titleBM:        'Agregat Malaysia memecahkan',
      titleEmphasis:  'European blades.',
      titleEmphasisBM: 'bilah Eropah.',
      summary:        'A technical argument about why blades bonded for European concrete underperform on Malaysian sites, and what to do about it.',
      summaryBM:      'Hujah teknikal tentang kenapa bilah yang direka untuk konkrit Eropah berprestasi rendah di tapak Malaysia, dan apa yang perlu dilakukan.',
      metaAuthor:     'Coolman Engineering',
      metaSubject:    'Bond design · Aggregate composition',
      metaSubjectBM:  'Reka bentuk ikatan · Komposisi agregat',
      metaRead:       '1 min read',
      metaReadBM:     'Bacaan 1 minit',
      paragraphs: [
        {
          paragraph: 'A diamond blade doesn\'t cut — it abrades. Diamonds in the segment scrape away the material; as they dull, the bond around them wears to expose fresh diamonds underneath. Everything depends on matching the bond hardness to how abrasive the material is.',
          paragraphBM: 'Bilah berlian tidak memotong — ia menggosok. Berlian dalam segmen mengikis bahan; apabila ia tumpul, ikatan di sekelilingnya haus untuk mendedahkan berlian segar di bawah. Segalanya bergantung pada memadankan kekerasan ikatan dengan betapa keras bahan yang dipotong.',
        },
        {
          paragraph: 'Malaysian concrete is granite-dominant. Granite has high silica content — noticeably more abrasive than the limestone aggregate that calibrates most European blades. A bond formulation correct for European concrete is, on Malaysian granite, too soft. It wears faster than designed. Segments deteriorate early. Contractors blame the operator or the machine. The actual problem is upstream: the bond was never matched to the material.',
          paragraphBM: 'Konkrit Malaysia didominasi granit. Granit mempunyai kandungan silika tinggi — lebih menggosok daripada agregat batu kapur yang mengkalibrasi kebanyakan bilah Eropah. Formulasi ikatan yang betul untuk konkrit Eropah adalah, pada granit Malaysia, terlalu lembut. Ia haus lebih cepat daripada reka bentuk. Segmen merosot awal. Kontraktor salahkan pengendali atau mesin. Masalah sebenar berada di hulu: ikatan tidak pernah dipadankan dengan bahan.',
        },
        {
          paragraph: 'Coolman\'s CM-X line uses a three-layer cobalt construction — each layer at a different diamond concentration. As the outer layer wears faster than European-bond designs expected, the inner layers keep exposing fresh diamonds. The blade is engineered for the aggregate it will actually cut, not the aggregate on a European spec sheet.',
          paragraphBM: 'Barisan CM-X Coolman menggunakan pembinaan kobalt tiga lapis — setiap lapisan pada kepekatan berlian berbeza. Apabila lapisan luar haus lebih cepat daripada jangkaan reka bentuk Eropah, lapisan dalaman terus mendedahkan berlian segar. Bilah direka untuk agregat yang sebenarnya akan ia potong, bukan agregat pada lembaran spesifikasi Eropah.',
        },
      ],
      pullquote:   'The blade does not care what the spec sheet says. It cares what the rock does.',
      pullquoteBM: 'Bilah tidak peduli apa yang lembaran spesifikasi kata. Ia peduli apa yang batu lakukan.',
    }),

    folioGroup('03', {
      folioLabel:     'Engineering Folio №03',
      folioLabelBM:   'Folio Kejuruteraan №03',
      category:       'Brand philosophy',
      categoryBM:     'Falsafah jenama',
      title:          'The Brotherhood',
      titleBM:        'Sistem',
      titleEmphasis:  'System.',
      titleEmphasisBM: 'Brotherhood.',
      summary:        'Every diamond tools brand in Malaysia has a dealer network. Most are functionally broken by year five. This is the operating philosophy that has kept ours profitable for nearly two decades.',
      summaryBM:      'Setiap jenama alat berlian di Malaysia ada rangkaian pengedar. Kebanyakan sudah tidak berfungsi menjelang tahun lima. Ini falsafah operasi yang mengekalkan rangkaian Coolman menguntungkan selama hampir dua dekad.',
      metaAuthor:     'Coolman Engineering',
      metaSubject:    'Distribution philosophy',
      metaSubjectBM:  'Falsafah pengedaran',
      metaRead:       '1 min read',
      metaReadBM:     'Bacaan 1 minit',
      paragraphs: [
        {
          paragraph: 'Every diamond tools brand in Malaysia has a dealer network. Most are functionally broken by year five. The pattern: aggressive recruitment, maximum discounts, no territorial protection. Dealers compete against each other for the same contractors. Margins compress. Some fold. The survivors cut service to stay alive.',
          paragraphBM: 'Setiap jenama alat berlian di Malaysia ada rangkaian pengedar. Kebanyakan sudah tidak berfungsi menjelang tahun lima. Polanya: pengambilan agresif, diskaun maksimum, tiada perlindungan wilayah. Pengedar bersaing sesama sendiri untuk kontraktor yang sama. Margin mampat. Sesetengah gulung tikar. Yang terselamat potong perkhidmatan untuk terus hidup.',
        },
        {
          paragraph: 'The Brotherhood runs the opposite way. Fewer dealers per region than the industry standard. Each protected from direct competition by other Coolman dealers in their territory. Margins maintained at a level that makes technical investment rational. No direct-sales operation that undercuts our own dealer base.',
          paragraphBM: 'Brotherhood beroperasi secara terbalik. Pengedar lebih sedikit setiap rantau daripada standard industri. Setiap satu dilindungi daripada persaingan langsung pengedar Coolman lain dalam wilayah mereka. Margin dikekalkan pada tahap yang menjadikan pelaburan teknikal rasional. Tiada operasi jualan langsung yang memotong harga asas pengedar kami sendiri.',
        },
        {
          paragraph: 'The cost is real in the short term: foregone volume, foregone margin, the discipline to say no every quarter. The return is a dealer base that has, in most cases, carried Coolman for years. That experience compounds into something a competitor cannot easily copy.',
          paragraphBM: 'Kosnya nyata dalam jangka pendek: volum yang hilang, margin yang hilang, disiplin untuk berkata tidak setiap suku. Imbalannya ialah asas pengedar yang, dalam kebanyakan kes, telah membawa Coolman selama bertahun-tahun. Pengalaman itu bertambah menjadi sesuatu yang pesaing tidak mudah boleh tiru.',
        },
      ],
      pullquote:   'The most stable dealer network wins. Not the largest.',
      pullquoteBM: 'Rangkaian pengedar paling stabil menang. Bukan yang terbesar.',
    }),

    {
      name: 'closingCta',
      type: 'group',
      fields: bilingualTabs([
        { name: 'eyebrow',             type: 'text',     defaultValue: 'A conversation' },
        { name: 'eyebrowBM',           type: 'text',     defaultValue: 'Perbualan' },
        { name: 'title',               type: 'text',     defaultValue: 'Got a cut that the spec' },
        { name: 'titleBM',             type: 'text',     defaultValue: 'Ada pemotongan yang lembaran spesifikasi' },
        { name: 'titleEmphasis',       type: 'text',     defaultValue: 'sheet cannot answer?' },
        { name: 'titleEmphasisBM',     type: 'text',     defaultValue: 'tidak boleh jawab?' },
        {
          name: 'body',
          type: 'textarea',
          defaultValue: 'Send a photo of the job, the aggregate, and the existing blade. The engineering desk replies the same working day. If you want to read more in the same voice, three Field Notes cover specific jobs that taught us what the folio above argues.',
        },
        {
          name: 'bodyBM',
          type: 'textarea',
          defaultValue: 'Hantar gambar kerja, agregat, dan bilah sedia ada. Meja kejuruteraan membalas pada hari kerja yang sama. Jika anda mahu baca lebih lanjut dalam suara yang sama, tiga Field Notes meliputi kerja khusus yang mengajar kami apa yang folio di atas hujahkan.',
        },
        { name: 'whatsappCtaLabel',     type: 'text', defaultValue: 'Open the engineering desk on WhatsApp' },
        { name: 'whatsappCtaLabelBM',   type: 'text', defaultValue: 'Buka meja kejuruteraan di WhatsApp' },
        { name: 'fieldNotesCtaLabel',   type: 'text', defaultValue: 'Read the Field Notes' },
        { name: 'fieldNotesCtaLabelBM', type: 'text', defaultValue: 'Baca Field Notes' },
      ]),
    },
  ],
}
