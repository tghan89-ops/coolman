import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt'],
    livePreview: {
      url: ({ data }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL}/resources/${data.slug}`,
    },
    description:
      'Technical guides and editorial content rendered at /resources. Drafts are admin-only; only "published" posts appear on the public site.',
  },
  access: {
    // Public read is filtered to published posts at the query layer in lib/payload.ts
    // (so drafts can still be fetched in admin / live preview). Drafts are not
    // exposed through any public-facing list query.
    read: () => true,
    create: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
    update: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
    delete: ({ req: { user } }) =>
      (user as any)?.collection === 'adminUsers' && (user as any)?.role === 'admin',
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'URL slug e.g. what-is-core-drilling-used-for' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Only "Published" posts appear on the public site.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Date shown on the article. Falls back to createdAt if blank.',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'English article title' },
    },
    {
      name: 'titleBM',
      type: 'text',
      admin: { description: 'Bahasa Melayu title. Leave blank to fall back to English.' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: { description: 'English summary shown on cards / SEO description. 1–3 sentences.' },
    },
    {
      name: 'excerptBM',
      type: 'textarea',
      admin: { description: 'Bahasa Melayu summary. Leave blank to fall back to English.' },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Hero image shown at the top of the article and on resource cards.' },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'English article body. HTML allowed — rendered with sanitisation on the public page.',
        rows: 24,
      },
    },
    {
      name: 'contentBM',
      type: 'textarea',
      admin: {
        description:
          'Bahasa Melayu body. Leave blank to fall back to English. HTML allowed.',
        rows: 24,
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: { description: 'Optional override for <title>. Falls back to article title.' },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: { description: 'Optional override for meta description. Falls back to excerpt.' },
        },
      ],
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        description:
          'Products mentioned in this article. Surfaces on the article page as a "Mentioned in this Field Note" strip. Pick 1–6 SKUs.',
      },
    },
    {
      name: 'sourceWpId',
      type: 'number',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'WordPress post ID (set by import script). Used for idempotent re-imports.',
      },
    },
  ],
}
