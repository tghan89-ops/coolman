import type { CollectionConfig } from 'payload'

export const LoginAttempts: CollectionConfig = {
  slug: 'loginAttempts',
  admin: {
    useAsTitle: 'user_email',
    defaultColumns: ['user_email', 'success', 'attempted_at', 'ip_address'],
    description: 'Read-only audit log of admin login events. Written by the system only.',
  },
  access: {
    create: () => false,
    read: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'user_email',
      type: 'text',
      required: true,
    },
    {
      name: 'attempted_at',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'success',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'ip_address',
      type: 'text',
    },
    {
      name: 'user_agent',
      type: 'text',
    },
  ],
}
