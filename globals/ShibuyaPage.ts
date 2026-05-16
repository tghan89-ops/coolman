import type { GlobalConfig } from 'payload'

const bmDesc = { description: 'Bahasa Malaysia. Leave blank to fall back to English.' }
const notTranslated = { description: 'Not translated — numeric/spec value shown in both languages.' }

export const ShibuyaPage: GlobalConfig = {
  slug: 'shibuya-page',
  access: { read: () => true },
  admin: {
    livePreview: {
      url: () => `${process.env.NEXT_PUBLIC_SERVER_URL}/shibuya`,
    },
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'badge', type: 'text', defaultValue: 'ENGINEERED IN JAPAN' },
        { name: 'badgeBM', type: 'text', admin: bmDesc },
        { name: 'headlineLine1', type: 'text', defaultValue: 'Precision Without' },
        { name: 'headlineLine1BM', type: 'text', admin: bmDesc },
        { name: 'headlineLine2', type: 'text', defaultValue: 'Compromise' },
        { name: 'headlineLine2BM', type: 'text', admin: bmDesc },
        { name: 'subheadline', type: 'textarea', defaultValue: 'Shibuya core drilling machines represent five decades of Japanese engineering excellence.' },
        { name: 'subheadlineBM', type: 'textarea', admin: bmDesc },
        { name: 'heroImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'heritage',
      type: 'group',
      fields: [
        { name: 'since', type: 'text', defaultValue: '1973', admin: { description: 'Year only e.g. 1973 — the SINCE prefix is added automatically.' } },
        { name: 'statement', type: 'textarea', defaultValue: 'Five decades of relentless pursuit of perfection. Every Shibuya machine is a testament to Japanese craftsmanship.' },
        { name: 'statementBM', type: 'textarea', admin: bmDesc },
      ],
    },
    {
      name: 'craftsmanship',
      type: 'group',
      fields: [
        { name: 'sectionLabel', type: 'text', defaultValue: 'CRAFTSMANSHIP' },
        { name: 'sectionLabelBM', type: 'text', admin: bmDesc },
        { name: 'title', type: 'text', defaultValue: 'Built to Last Generations' },
        { name: 'titleBM', type: 'text', admin: bmDesc },
        { name: 'body', type: 'textarea', defaultValue: 'Every Shibuya machine begins its life in our Osaka manufacturing facility.' },
        { name: 'bodyBM', type: 'textarea', admin: bmDesc },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'points',
          type: 'array',
          defaultValue: [
            { number: '01', title: 'Precision Manufacturing', description: 'Every component machined to tolerances of 0.01mm in our Osaka facility.' },
            { number: '02', title: 'Quality Materials', description: 'Aircraft-grade aluminum housings and hardened steel gearing throughout.' },
            { number: '03', title: 'Rigorous Testing', description: '72-hour continuous operation test before any machine leaves the factory.' },
            { number: '04', title: 'Hand Assembly', description: 'Final assembly by master technicians with decades of experience.' },
          ],
          fields: [
            { name: 'number', type: 'text', required: true, admin: notTranslated },
            { name: 'title', type: 'text', required: true },
            { name: 'titleBM', type: 'text', admin: bmDesc },
            { name: 'description', type: 'textarea', required: true },
            { name: 'descriptionBM', type: 'textarea', admin: bmDesc },
          ],
        },
      ],
    },
    {
      name: 'machines',
      type: 'array',
      admin: { description: 'Machine models shown in the product range section. Order determines tab order on page.' },
      defaultValue: [
        { modelId: 'ts-132', name: 'TS-132', tagline: 'Precision Handheld', description: 'Engineered for precision...', motorPower: '1,500W', maxDiameter: '132mm', weight: '8.5kg', rpmRange: '580-2,100', price: 'RM 4,500', features: [{ feature: 'Ergonomic handheld design' }, { feature: 'Wet and dry drilling modes' }, { feature: 'Variable speed control' }, { feature: 'Quick-release chuck' }] },
        { modelId: 'ts-162', name: 'TS-162', tagline: 'Professional Standard', description: 'The benchmark for professional core drilling...', motorPower: '2,200W', maxDiameter: '162mm', weight: '12kg', rpmRange: '480-1,800', price: 'RM 7,800', features: [{ feature: 'Rig-mounted stability' }, { feature: 'Auto-feed capability' }, { feature: 'High-torque brushless motor' }, { feature: 'Integrated water supply' }] },
        { modelId: 'ts-252', name: 'TS-252', tagline: 'Industrial Powerhouse', description: 'Uncompromising power meets Japanese precision...', motorPower: '3,200W', maxDiameter: '252mm', weight: '18kg', rpmRange: '320-1,200', price: 'RM 12,500', features: [{ feature: 'Industrial-grade construction' }, { feature: '3-speed gearbox' }, { feature: 'Intelligent overload protection' }, { feature: 'Reinforced anchor system' }] },
        { modelId: 'ts-402', name: 'TS-402', tagline: 'Maximum Performance', description: 'The pinnacle of core drilling technology...', motorPower: '4,800W', maxDiameter: '402mm', weight: '28kg', rpmRange: '180-720', price: 'RM 22,000', features: [{ feature: 'Maximum drilling capacity' }, { feature: 'Hydraulic feed system' }, { feature: 'Remote operation capable' }, { feature: 'Continuous duty rated' }] },
      ],
      fields: [
        { name: 'modelId', type: 'text', required: true, admin: { description: 'Internal ID e.g. ts-132 — not translated.' } },
        { name: 'name', type: 'text', required: true, admin: { description: 'Model name e.g. TS-132 — not translated.' } },
        { name: 'tagline', type: 'text', required: true },
        { name: 'taglineBM', type: 'text', admin: bmDesc },
        { name: 'description', type: 'textarea', required: true },
        { name: 'descriptionBM', type: 'textarea', admin: bmDesc },
        { name: 'motorPower', type: 'text', required: true, admin: { description: 'e.g. 1,500W — not translated.' } },
        { name: 'maxDiameter', type: 'text', required: true, admin: { description: 'e.g. 132mm — not translated.' } },
        { name: 'weight', type: 'text', required: true, admin: { description: 'e.g. 8.5kg — not translated.' } },
        { name: 'rpmRange', type: 'text', required: true, admin: { description: 'e.g. 580-2,100 — not translated.' } },
        { name: 'price', type: 'text', required: true, admin: { description: 'Display price string e.g. RM 4,500 — not translated.' } },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'features',
          type: 'array',
          fields: [
            { name: 'feature', type: 'text', required: true },
            { name: 'featureBM', type: 'text', admin: bmDesc },
          ],
        },
      ],
    },
    {
      name: 'inAction',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Built for Real Work' },
        { name: 'titleBM', type: 'text', admin: bmDesc },
        { name: 'body', type: 'textarea', defaultValue: 'From high-rise construction to infrastructure projects, Shibuya machines perform flawlessly.' },
        { name: 'bodyBM', type: 'textarea', admin: bmDesc },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'support',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'We Stand Behind Every Machine' },
        { name: 'titleBM', type: 'text', admin: bmDesc },
        {
          name: 'items',
          type: 'array',
          defaultValue: [
            { title: '2-Year Warranty', description: 'Comprehensive manufacturer warranty with full parts and labor coverage.' },
            { title: 'Local Service Center', description: 'Dedicated service facility in Kuala Lumpur staffed by factory-trained technicians.' },
            { title: 'Spare Parts Stock', description: 'Full inventory of genuine Shibuya parts for rapid repairs and maintenance.' },
            { title: 'Operator Training', description: 'Complimentary training program included with every machine purchase.' },
          ],
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'titleBM', type: 'text', admin: bmDesc },
            { name: 'description', type: 'textarea', required: true },
            { name: 'descriptionBM', type: 'textarea', admin: bmDesc },
          ],
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'headline', type: 'text', defaultValue: 'Experience the Difference' },
        { name: 'headlineBM', type: 'text', admin: bmDesc },
        { name: 'subheadline', type: 'textarea', defaultValue: 'Schedule a demonstration at your site or visit our showroom.' },
        { name: 'subheadlineBM', type: 'textarea', admin: bmDesc },
        { name: 'primaryCtaLabel', type: 'text', defaultValue: 'Request a demo' },
        { name: 'primaryCtaLabelBM', type: 'text', admin: bmDesc },
        { name: 'secondaryCtaLabel', type: 'text', defaultValue: 'Download Brochure' },
        { name: 'secondaryCtaLabelBM', type: 'text', admin: bmDesc },
      ],
    },
  ],
}
