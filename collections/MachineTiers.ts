import type { CollectionConfig } from 'payload'

export const MachineTiers: CollectionConfig = {
  slug: 'machineTiers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'nameBM', 'powerRange'],
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
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'English name e.g. Low Power' },
    },
    {
      name: 'nameBM',
      type: 'text',
      required: true,
      admin: { description: 'Bahasa Melayu name e.g. Kuasa Rendah' },
    },
    {
      name: 'powerRange',
      type: 'text',
      admin: { description: 'e.g. < 2kW' },
    },
  ],
}
