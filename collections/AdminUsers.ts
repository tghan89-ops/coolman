import type { CollectionConfig } from 'payload'

export const AdminUsers: CollectionConfig = {
  slug: 'adminUsers',
  hooks: {
    afterLogin: [
      async ({ user, req }) => {
        const ip =
          req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
          req.headers.get('x-real-ip') ??
          ''
        const userAgent = req.headers.get('user-agent') ?? ''
        await req.payload
          .create({
            collection: 'loginAttempts',
            data: {
              user_email: (user as any).email ?? '',
              attempted_at: new Date().toISOString(),
              success: true,
              ip_address: ip,
              user_agent: userAgent,
            },
            overrideAccess: true,
          })
          .catch(() => {
            // Non-fatal — never block login because the audit write failed.
          })
      },
    ],
  },
  auth: {
    tokenExpiration: 7200,
    maxLoginAttempts: 5,
    lockTime: 600 * 1000,
    cookies: {
      sameSite: 'Lax',
      // Secure cookies require HTTPS. Set COOKIE_INSECURE=true to test over a
      // plain-http IP before the domain + SSL is wired up; remove it once on HTTPS.
      secure: process.env.NODE_ENV === 'production' && process.env.COOKIE_INSECURE !== 'true',
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
  },
  versions: true,
  access: {
    read: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
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
      access: {
        update: ({ req: { user } }) =>
          (user as any)?.collection === 'adminUsers' && (user as any)?.role === 'admin',
      },
      admin: {
        description: 'Admin = full access. Marketing = content upload only.',
      },
    },
  ],
}
