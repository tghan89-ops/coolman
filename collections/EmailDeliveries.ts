import type { CollectionConfig } from 'payload'

export const EmailDeliveries: CollectionConfig = {
  slug: 'emailDeliveries',
  admin: {
    useAsTitle: 'recipient',
    defaultColumns: ['recipient', 'status', 'sent_at', 'order'],
  },
  access: {
    create: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
    read: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
    update: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
    delete: () => false,
  },
  fields: [
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      admin: { description: 'Order this email relates to, if any' },
    },
    {
      name: 'recipient',
      type: 'email',
      required: true,
    },
    {
      name: 'resend_message_id',
      type: 'text',
      admin: { description: 'Message ID returned by Resend on send' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Queued', value: 'queued' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
        { label: 'Bounced', value: 'bounced' },
      ],
      defaultValue: 'queued',
    },
    {
      name: 'retry_count',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'last_error',
      type: 'text',
      admin: { description: 'Last error message from Resend, if any' },
    },
    {
      name: 'sent_at',
      type: 'date',
    },
  ],
}
