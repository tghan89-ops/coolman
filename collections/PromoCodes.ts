import type { CollectionConfig } from 'payload'

export const PromoCodes: CollectionConfig = {
  slug: 'promoCodes',
  versions: true,
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'promo_discount_pct', 'valid_from', 'valid_until', 'active'],
  },
  access: {
    read: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
    create: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
    update: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
    delete: ({ req: { user } }) =>
      (user as any)?.collection === 'adminUsers' && (user as any)?.role === 'admin',
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Promo code string e.g. LAUNCH5' },
    },
    {
      name: 'promo_discount_pct',
      type: 'number',
      required: true,
      min: 0,
      max: 1,
      admin: { description: '0.10 = 10% discount. Stacks with tier discount.' },
    },
    {
      name: 'valid_from',
      type: 'date',
      required: true,
    },
    {
      name: 'valid_until',
      type: 'date',
      required: true,
    },
    {
      name: 'usage_cap',
      type: 'number',
      required: true,
      min: 1,
      admin: { description: 'Maximum total redemptions allowed' },
    },
    {
      name: 'usage_count',
      type: 'number',
      defaultValue: 0,
      access: {
        update: () => false,
      },
      admin: {
        description: 'Current redemption count. Incremented server-side only via atomic SQL.',
        readOnly: true,
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
