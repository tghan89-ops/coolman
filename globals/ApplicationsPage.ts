import type { GlobalConfig } from 'payload'

const bmDesc = { description: 'Bahasa Malaysia. Leave blank to fall back to English.' }

export const ApplicationsPage: GlobalConfig = {
  slug: 'applications-page',
  access: { read: () => true },
  admin: {
    livePreview: {
      url: () => `${process.env.NEXT_PUBLIC_SERVER_URL}/applications`,
    },
  },
  fields: [
    { name: 'heroTitle', type: 'text', defaultValue: 'Applications' },
    { name: 'heroTitleBM', type: 'text', defaultValue: 'Aplikasi', admin: bmDesc },
    { name: 'heroSubtitle', type: 'textarea', defaultValue: 'Find the right Coolman blade for your specific material and application.' },
    { name: 'heroSubtitleBM', type: 'textarea', defaultValue: 'Cari bilah Coolman yang tepat untuk bahan dan aplikasi khusus anda.', admin: bmDesc },
    {
      name: 'sections',
      type: 'array',
      defaultValue: [
        { title: 'Concrete Cutting', titleBM: 'Pemotongan Konkrit', description: 'Heavy-duty diamond blades engineered for reinforced concrete, cured slabs, and structural elements.', descriptionBM: 'Bilah berlian tugas berat yang direka untuk konkrit bertetulang, papak terawat dan elemen struktur.' },
        { title: 'Granite & Natural Stone', titleBM: 'Granit & Batu Asli', description: 'Precision blades for cutting granite countertops, natural stone, and hard rock materials.', descriptionBM: 'Bilah ketepatan untuk memotong meja granit, batu asli dan bahan batu keras.' },
        { title: 'Marble & Soft Stone', titleBM: 'Marmar & Batu Lembut', description: 'Specialized segments for clean, chip-free cuts in marble, limestone, and soft stone.', descriptionBM: 'Segmen khusus untuk pemotongan bersih dan bebas serpihan pada marmar, batu kapur dan batu lembut.' },
        { title: 'Tile & Ceramics', titleBM: 'Jubin & Seramik', description: 'Fine-grit diamond blades for precise cuts in porcelain, ceramic tiles, and glass.', descriptionBM: 'Bilah berlian halus untuk pemotongan tepat pada porselin, jubin seramik dan kaca.' },
        { title: 'Asphalt Cutting', titleBM: 'Pemotongan Asfalt', description: 'Durable blades designed for roadwork, asphalt overlays, and pavement cutting.', descriptionBM: 'Bilah tahan lasak yang direka untuk kerja jalan, lapisan asfalt dan pemotongan turapan.' },
        { title: 'Brick & Masonry', titleBM: 'Bata & Tembok', description: 'All-purpose blades for cutting brick, block, and general masonry materials.', descriptionBM: 'Bilah serba guna untuk memotong bata, blok dan bahan tembok am.' },
      ],
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'titleBM', type: 'text', admin: bmDesc },
        { name: 'description', type: 'textarea' },
        { name: 'descriptionBM', type: 'textarea', admin: bmDesc },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'relatedProducts',
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
        },
      ],
    },
  ],
}
