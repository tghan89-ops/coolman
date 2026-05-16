import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'idempotency_key',
    defaultColumns: ['contractor', 'product', 'order_status', 'duplicate_flag', 'submitted_at'],
  },
  access: {
    create: ({ req: { user } }) => (user as any)?.collection === 'contractors',
    read: ({ req: { user } }) => {
      if (!user) return false
      if ((user as any).collection === 'adminUsers') return true
      return { contractor: { equals: (user as any).id } }
    },
    update: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
    delete: () => false,
  },
  fields: [
    {
      name: '_acknowledge',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/admin/AcknowledgeButton#AcknowledgeButton',
        },
      },
    },
    {
      name: '_priceStackUp',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/OrderPriceStackUp#OrderPriceStackUp',
        },
      },
    },
    {
      name: 'contractor',
      type: 'relationship',
      relationTo: 'contractors',
      required: true,
    },
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
      name: 'delivery_address',
      type: 'text',
      required: true,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'list_price_at_submit',
      type: 'number',
      required: true,
      admin: { description: 'Snapshot of product list price at time of submit' },
    },
    {
      name: 'tier_discount_pct_at_submit',
      type: 'number',
      required: true,
      admin: { description: 'Snapshot of contractor tier discount at submit' },
    },
    {
      name: 'promo_discount_pct_at_submit',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Snapshot of promo discount at submit. 0 if no promo used.' },
    },
    {
      name: 'effective_price_at_submit',
      type: 'number',
      required: true,
      admin: { description: 'Final price shown to contractor. Never re-derived after submit.' },
    },
    {
      name: 'order_status',
      type: 'select',
      required: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Acknowledged', value: 'acknowledged' },
        { label: 'Fulfilled', value: 'fulfilled' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'submitted_at',
      type: 'date',
      required: true,
    },
    {
      name: 'acknowledged_at',
      type: 'date',
    },
    {
      name: 'duplicate_flag',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Set if same contractor + product within duplicate_window_minutes' },
    },
    {
      name: 'idempotency_key',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Client-generated UUID. Scoped to contractor for uniqueness.' },
    },
    {
      name: 'promo_code',
      type: 'relationship',
      relationTo: 'promoCodes',
      admin: { description: 'Promo code used, if any' },
    },
  ],
}
