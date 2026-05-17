import type { CollectionConfig } from 'payload'

const bmDesc = { description: 'Bahasa Malaysia. Leave blank to fall back to English.' }

// Shibuya machine roster as its own top-level collection. Lifted from the
// `machines` array previously embedded inside the ShibuyaPage global so each
// machine becomes addressable and can later relate to compatible blades.
//
// The legacy ShibuyaPage.machines array stays in place until /shibuya is
// rewired to read from this collection (next commit). Once the page swap
// lands, the global's array becomes dead config and is removed.
export const ShibuyaMachines: CollectionConfig = {
  slug: 'shibuya-machines',
  admin: {
    group: 'Catalogue',
    useAsTitle: 'model_name',
    defaultColumns: ['model_name', 'tagline', 'display_order', 'is_active'],
    defaultSort: 'display_order',
    livePreview: {
      url: ({ data }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL}/shibuya#${data.model_id ?? ''}`,
    },
    description:
      'Shibuya core-drilling machine roster shown on /shibuya. Add a new entry here and it appears on the page without redeploy.',
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
      name: 'model_id',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL-safe slug e.g. ts-162. Used as anchor link target.' },
    },
    {
      name: 'model_name',
      type: 'text',
      required: true,
      admin: { description: 'Model name e.g. TS-162 — not translated.' },
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      admin: { description: 'English short tagline e.g. "Professional Standard".' },
    },
    {
      name: 'taglineBM',
      type: 'text',
      admin: bmDesc,
    },
    {
      name: 'bond_match',
      type: 'text',
      admin: {
        description:
          'Optional short note on which Coolman bond family pairs best with this machine e.g. "Best with soft–medium bonds". Surfaces under the machine spec block.',
      },
    },
    {
      name: 'bond_matchBM',
      type: 'text',
      admin: bmDesc,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: { description: 'English body copy shown on the machine card.' },
    },
    {
      name: 'descriptionBM',
      type: 'textarea',
      admin: bmDesc,
    },
    {
      name: 'motor_power',
      type: 'text',
      admin: { description: 'e.g. 2,200W. Numeric/spec value shown in both languages — not translated.' },
    },
    {
      name: 'max_diameter',
      type: 'text',
      admin: { description: 'e.g. 162mm. Numeric/spec value shown in both languages — not translated.' },
    },
    {
      name: 'weight',
      type: 'text',
      admin: { description: 'e.g. 12kg. Numeric/spec value shown in both languages — not translated.' },
    },
    {
      name: 'rpm_range',
      type: 'text',
      admin: { description: 'e.g. 480-1,800. Numeric/spec value shown in both languages — not translated.' },
    },
    {
      name: 'price',
      type: 'text',
      admin: {
        description: 'Display price string e.g. "RM 7,800" — not translated. Leave blank to hide the price line.',
      },
    },
    {
      name: 'hero_image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'features',
      type: 'array',
      admin: { description: 'Bullet-pointed feature list shown under the machine spec block.' },
      fields: [
        { name: 'feature', type: 'text', required: true },
        { name: 'featureBM', type: 'text', admin: bmDesc },
      ],
    },
    {
      name: 'display_order',
      type: 'number',
      defaultValue: 100,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first on the page.',
      },
    },
    {
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Uncheck to hide this machine from the public page without deleting it.',
      },
    },
  ],
}
