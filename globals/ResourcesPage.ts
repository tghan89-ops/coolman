import type { GlobalConfig } from 'payload'

export const ResourcesPage: GlobalConfig = {
  slug: 'resources-page',
  access: { read: () => true },
  admin: {
    livePreview: {
      url: () => `${process.env.NEXT_PUBLIC_SERVER_URL}/resources`,
    },
  },
  fields: [
    { name: 'heroTitle', type: 'text', defaultValue: 'Resources' },
    { name: 'heroSubtitle', type: 'textarea', defaultValue: 'Technical guides, datasheets, and videos to help you get the most from Coolman tools.' },
    {
      name: 'downloads',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'file', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'videos',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'youtubeUrl', type: 'text', required: true },
        { name: 'description', type: 'text' },
      ],
    },
  ],
}
