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
    defaultColumns: ['companyName', 'email', 'tier_discount_pct', 'email_verified_at', 'deactivated_at'],
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
      access: {
        update: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
      },
      admin: {
        description: 'Permanent tier discount. 0.05 = 5%. Admin-only.',
        components: {
          Field: '@/components/admin/TierDiscountField#TierDiscountField',
        },
      },
    },
    {
      name: 'email_verified_at',
      type: 'date',
      access: {
        update: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
      },
      admin: {
        description: 'Set when contractor verifies their email. Null = unverified.',
        readOnly: true,
      },
    },
    {
      name: 'deactivated_at',
      type: 'date',
      access: {
        update: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
      },
      admin: {
        description: 'Soft delete timestamp. Set to deactivate. Never hard-delete contractors.',
      },
    },
    // Auth support fields — hidden from admin UI
    {
      name: 'email_verification_token',
      type: 'text',
      required: false,
      admin: { hidden: true },
    },
    {
      name: 'email_verification_sent_at',
      type: 'date',
      required: false,
      admin: { hidden: true },
    },
    {
      name: 'registration_ip',
      type: 'text',
      required: false,
      admin: { hidden: true },
    },
  ],
}
