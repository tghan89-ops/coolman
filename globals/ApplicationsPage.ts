import type { GlobalConfig } from 'payload'

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
    { name: 'heroTitleBM', type: 'text', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
    { name: 'heroSubtitle', type: 'textarea', defaultValue: 'Find the right Coolman blade for your specific material and application.' },
    { name: 'heroSubtitleBM', type: 'textarea', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
    {
      name: 'sections',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'titleBM', type: 'text', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
        { name: 'description', type: 'textarea' },
        { name: 'descriptionBM', type: 'textarea', admin: { description: 'Bahasa Malaysia. Leave blank to fall back to English.' } },
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
