import type { CollectionConfig } from 'payload'

export const AdminUsers: CollectionConfig = {
  slug: 'adminUsers',
  auth: {
    tokenExpiration: 7200,
    maxLoginAttempts: 5,
    lockTime: 600 * 1000,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
  },
  versions: true,
  access: {
    read: ({ req: { user } }) => !!(user as any),
    create: ({ req: { user } }) =>
      (user as any)?.collection === 'adminUsers' && (user as any)?.role === 'admin',
    update: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
    delete: ({ req: { user } }) =>
      (user as any)?.collection === 'adminUsers' && (user as any)?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Marketing', value: 'marketing' },
      ],
      defaultValue: 'marketing',
      admin: {
        description: 'Admin = full access. Marketing = content upload only.',
      },
    },
  ],
}
