import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  access: { read: () => true },
  admin: {
    livePreview: {
      url: () => `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    },
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'badge', type: 'text', defaultValue: 'Trusted by 500+ Malaysian Contractors' },
        { name: 'headlineLine1', type: 'text', defaultValue: 'Industrial' },
        { name: 'headlineLine2', type: 'text', defaultValue: 'Diamond Tools' },
        { name: 'headlineLine3', type: 'text', defaultValue: 'Built for Performance' },
        { name: 'subheadline', type: 'textarea', defaultValue: 'Industrial-grade cutting solutions engineered for concrete, granite, marble, and more.' },
        { name: 'primaryCtaLabel', type: 'text', defaultValue: 'Explore Products' },
        { name: 'secondaryCtaLabel', type: 'text', defaultValue: 'See applications' },
        { name: 'heroImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      defaultValue: [
        { value: '25+', label: 'Years' },
        { value: '500+', label: 'Contractors' },
        { value: '50K+', label: 'Projects' },
        { value: '99%', label: 'On-Time' },
      ],
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'features',
      type: 'array',
      admin: { description: 'Feature cards shown in the "Why Coolman" section.' },
      defaultValue: [
        { title: 'Superior Cutting Speed', description: '40% faster cutting compared to standard blades.', stat: '40%', statLabel: 'Faster' },
        { title: 'Extended Blade Life', description: 'Proprietary bonding technology ensures longer life.', stat: '3×', statLabel: 'Longer' },
        { title: 'Rapid Fulfillment', description: 'Same-day dispatch for orders placed before 2pm.', stat: '24h', statLabel: 'Delivery' },
        { title: 'Technical Support', description: 'Dedicated team to help optimise your operations.', stat: '24/7', statLabel: 'Support' },
      ],
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'stat', type: 'text', required: true, admin: { description: 'e.g. 40% or 3×' } },
        { name: 'statLabel', type: 'text', required: true, admin: { description: 'e.g. Faster, Longer' } },
      ],
    },
    {
      name: 'applicationList',
      type: 'array',
      admin: { description: 'Application categories shown in the homepage selector.' },
      defaultValue: [
        { id: 'concrete', label: 'Concrete', image: '/images/blade-concrete.jpg' },
        { id: 'granite', label: 'Granite', image: '/images/blade-granite.jpg' },
        { id: 'marble', label: 'Marble', image: '/images/blade-granite.jpg' },
        { id: 'tile', label: 'Tile & Ceramic', image: '/images/blade-tile.jpg' },
      ],
      fields: [
        { name: 'id', type: 'text', required: true, admin: { description: 'URL-safe slug e.g. concrete' } },
        { name: 'label', type: 'text', required: true },
        { name: 'image', type: 'text', required: true, admin: { description: 'Path or URL to image' } },
      ],
    },
    {
      name: 'ctaSection',
      type: 'group',
      fields: [
        { name: 'headline', type: 'text', defaultValue: "Ready to Elevate Your Operations?" },
        { name: 'subheadline', type: 'textarea', defaultValue: "Join 500+ professional contractors who trust Coolman for their diamond cutting needs." },
        { name: 'primaryCtaLabel', type: 'text', defaultValue: 'Request Consultation' },
        { name: 'secondaryCtaLabel', type: 'text', defaultValue: 'Download Catalog' },
      ],
    },
  ],
}
