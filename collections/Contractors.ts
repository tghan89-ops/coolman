import type { CollectionConfig } from 'payload'

export const Contractors: CollectionConfig = {
  slug: 'contractors',
  auth: {
    tokenExpiration: 7200,
    maxLoginAttempts: 5,
    lockTime: 600 * 1000,
  },
  admin: {
    useAsTitle: 'companyName',
    defaultColumns: ['companyName', 'email', 'tier_discount_pct', 'deactivated_at'],
  },
  versions: true,
  access: {
    create: () => true,
    read: ({ req: { user } }) => {
      if (!user) return false
      if ((user as any).collection === 'adminUsers') return true
      return { id: { equals: (user as any).id } }
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if ((user as any).collection === 'adminUsers') return true
      return { id: { equals: (user as any).id } }
    },
    delete: () => false,
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'deliveryAddress',
      type: 'text',
    },
    {
      name: 'tier_discount_pct',
      type: 'number',
      min: 0,
      max: 1,
      defaultValue: 0,
      admin: {
        description: 'Permanent tier discount. 0.05 = 5%. Admin-only.',
      },
    },
    {
      name: 'email_verified_at',
      type: 'date',
      admin: {
        description: 'Set when contractor verifies their email. Null = unverified.',
        readOnly: true,
      },
    },
    {
      name: 'deactivated_at',
      type: 'date',
      admin: {
        description: 'Soft delete timestamp. Set to deactivate. Never hard-delete contractors.',
      },
    },
  ],
}
