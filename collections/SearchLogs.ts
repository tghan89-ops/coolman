import type { CollectionConfig } from 'payload'

export const SearchLogs: CollectionConfig = {
  slug: 'searchLogs',
  admin: {
    useAsTitle: 'query',
    defaultColumns: ['query', 'result_count', 'contractor', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'query',
      type: 'text',
      admin: { description: 'Raw query string as entered by the user' },
    },
    {
      name: 'query_normalized',
      type: 'text',
      admin: {
        description:
          'Lowercased, unaccented version. Used for trend aggregation via LOWER(unaccent(query)).',
      },
    },
    {
      name: 'material',
      type: 'relationship',
      relationTo: 'materials',
      admin: { description: 'Material filter active at search time, if any' },
    },
    {
      name: 'application',
      type: 'relationship',
      relationTo: 'applications',
    },
    {
      name: 'machineTier',
      type: 'relationship',
      relationTo: 'machineTiers',
    },
    {
      name: 'contractor',
      type: 'relationship',
      relationTo: 'contractors',
      admin: { description: 'Null for public (unauthenticated) searches' },
    },
    {
      name: 'result_count',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'viewed_product_ids',
      type: 'array',
      admin: { description: 'Product IDs clicked after this search' },
      fields: [
        {
          name: 'productId',
          type: 'text',
        },
      ],
    },
    {
      name: 'submitted_order_id',
      type: 'relationship',
      relationTo: 'orders',
      admin: { description: 'Order if this search led to an order submission' },
    },
  ],
}
