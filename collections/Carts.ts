import type { CollectionConfig } from 'payload'

export const Carts: CollectionConfig = {
  slug: 'carts',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['contractor', 'updatedAt'],
    description: 'Server-side cart, one row per contractor.',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if ((user as any).collection === 'adminUsers') return true
      return { contractor: { equals: (user as any).id } }
    },
    create: ({ req: { user } }) => (user as any)?.collection === 'contractors',
    update: ({ req: { user } }) => {
      if (!user) return false
      if ((user as any).collection === 'adminUsers') return true
      return { contractor: { equals: (user as any).id } }
    },
    delete: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
  },
  fields: [
    {
      name: 'contractor',
      type: 'relationship',
      relationTo: 'contractors',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'added_at',
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
  ],
}
