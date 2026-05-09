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
    { name: 'heroSubtitle', type: 'textarea', defaultValue: 'Find the right Coolman blade for your specific material and application.' },
    {
      name: 'sections',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
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
