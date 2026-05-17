import type { CollectionConfig } from 'payload'

// Authorized dealer directory powering /brotherhood. Each card surfaces a
// WhatsApp deep-link (wa.me/<digits>) and a Google Maps deep-link
// (https://www.google.com/maps/?q=<value>). No fixed region enum — admins
// type the area label per dealer; the /brotherhood filter derives the
// available regions live from the saved values.
export const Dealers: CollectionConfig = {
  slug: 'dealers',
  admin: {
    group: 'Brotherhood',
    useAsTitle: 'name',
    defaultColumns: ['name', 'area', 'is_active', 'display_order'],
    defaultSort: 'area,display_order,name',
    description:
      'Authorized Coolman dealers shown on /brotherhood. Add a dealer here and it appears in the directory without redeploy. Empty list shows a placeholder.',
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
      admin: { description: 'Dealer business name as it should appear on the card.' },
    },
    {
      name: 'area',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description:
          'Region / area label e.g. "Klang Valley", "Penang", "Johor Bahru". Free text — the directory filter derives values from this column, so consistent capitalisation matters.',
      },
    },
    {
      name: 'address',
      type: 'textarea',
      required: true,
      admin: { description: 'Full street address. Shown on the card.' },
    },
    {
      name: 'whatsapp_number',
      type: 'text',
      required: true,
      admin: {
        description:
          'International format, digits only with leading + e.g. +60126363156. Used to build the wa.me deep-link — must be reachable on WhatsApp.',
      },
      validate: (value: any) => {
        if (typeof value !== 'string' || !value) return 'WhatsApp number is required.'
        // Allow + and digits only, 8–16 digits total after stripping +.
        const digits = value.replace(/^\+/, '').replace(/\s|-/g, '')
        if (!/^\d{8,16}$/.test(digits)) {
          return 'WhatsApp number must be 8–16 digits, optional leading + (e.g. +60126363156).'
        }
        return true
      },
    },
    {
      name: 'google_maps_query',
      type: 'text',
      required: true,
      admin: {
        description:
          'Either lat,lng (e.g. "3.1390,101.6869") OR a URL-encoded address. Used to build https://www.google.com/maps/?q=<value>. iOS and Android both route this to the native maps app.',
      },
    },
    {
      name: 'operating_hours',
      type: 'text',
      admin: {
        description: 'Optional one-line hours e.g. "Mon–Fri 09:00–18:00".',
      },
    },
    {
      name: 'languages',
      type: 'text',
      admin: {
        description:
          'Optional, comma-separated languages spoken e.g. "EN, BM, 中文".',
      },
    },
    {
      name: 'specialisations',
      type: 'text',
      admin: {
        description:
          'Optional, comma-separated tags e.g. "cutting, coring, training". Free text at V1; promoted to a relation if/when the tag list stabilises.',
      },
    },
    {
      name: 'display_order',
      type: 'number',
      defaultValue: 100,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first within an area.',
      },
    },
    {
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Uncheck to hide this dealer from /brotherhood without deleting them.',
      },
    },
  ],
}
