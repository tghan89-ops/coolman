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
        { name: 'secondaryCtaLabel', type: 'text', defaultValue: 'Watch Demo' },
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
