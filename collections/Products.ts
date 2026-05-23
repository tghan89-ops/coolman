import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sku', 'category', 'diameter', 'machineTier', 'listPrice'],
    defaultSort: 'category,diameterMm,name',
    livePreview: {
      url: ({ data }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL}/products/${data.id}`,
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
    update: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
    delete: ({ req: { user } }) =>
      (user as any)?.collection === 'adminUsers' && (user as any)?.role === 'admin',
  },
  fields: [
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Unique product code e.g. CM-GRN-230' },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'English product name' },
    },
    {
      name: 'nameBM',
      type: 'text',
      required: true,
      admin: { description: 'Bahasa Melayu product name' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: { description: 'English description' },
    },
    {
      name: 'descriptionBM',
      type: 'textarea',
      required: true,
      admin: { description: 'Bahasa Melayu description' },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'materials',
      type: 'relationship',
      relationTo: 'materials',
      hasMany: true,
      admin: { description: 'Materials this blade is recommended for' },
    },
    {
      name: 'applications',
      type: 'relationship',
      relationTo: 'applications',
      hasMany: true,
    },
    {
      name: 'machineTier',
      type: 'relationship',
      relationTo: 'machineTiers',
      required: true,
    },
    {
      name: 'listPrice',
      type: 'number',
      required: true,
      admin: { description: 'Base list price in MYR before any discounts' },
    },
    {
      name: 'diameter',
      type: 'text',
      admin: { description: 'e.g. 230mm' },
    },
    {
      name: 'diameterMm',
      type: 'number',
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Diameter in millimetres — used only for sorting the catalogue from small to large. Auto-filled from the diameter field; leave blank if not a sized tool.',
      },
    },
    {
      name: 'arborSize',
      type: 'text',
      admin: { description: 'e.g. 22.23mm or M14' },
    },
    {
      name: 'segmentHeight',
      type: 'text',
      admin: { description: 'e.g. 10mm' },
    },
    {
      name: 'bondType',
      type: 'select',
      options: [
        { label: 'Soft', value: 'soft' },
        { label: 'Medium', value: 'medium' },
        { label: 'Hard', value: 'hard' },
        { label: 'Extra Hard', value: 'extraHard' },
      ],
    },
    {
      name: 'maxRPM',
      type: 'text',
      admin: { description: 'Maximum safe RPM e.g. 6650 RPM' },
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      admin: { description: 'Full YouTube URL e.g. https://youtube.com/watch?v=...' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Hero / thumbnail image shown on catalogue cards' },
    },
    {
      name: 'photos',
      type: 'array',
      admin: { description: 'Additional gallery photos' },
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    {
      name: 'documents',
      type: 'array',
      admin: {
        description: 'Product datasheets, safety guides, certificates — customers can download directly from the product page.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { description: 'Document title in English e.g. "Product Datasheet"' },
        },
        {
          name: 'titleBM',
          type: 'text',
          admin: { description: 'Document title in Bahasa Malaysia e.g. "Helaian Data Produk"' },
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { description: 'Upload a PDF, image, or Word document' },
        },
      ],
    },
  ],
}
