import type { GlobalConfig } from 'payload'

const ICON_OPTIONS = [
  { label: 'Zap (speed)', value: 'zap' },
  { label: 'Shield (durability)', value: 'shield' },
  { label: 'Clock (time)', value: 'clock' },
  { label: 'Users (team)', value: 'users' },
  { label: 'Award (quality)', value: 'award' },
  { label: 'Truck (delivery)', value: 'truck' },
  { label: 'Headphones (support)', value: 'headphones' },
  { label: 'BarChart3 (analytics)', value: 'barChart3' },
]

export const WhyCoolmanPage: GlobalConfig = {
  slug: 'why-coolman-page',
  access: { read: () => true },
  admin: {
    livePreview: {
      url: () => `${process.env.NEXT_PUBLIC_SERVER_URL}/why-coolman`,
    },
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Why Coolman' },
        { name: 'title', type: 'text', defaultValue: 'The Coolman Advantage' },
        {
          name: 'lede',
          type: 'textarea',
          defaultValue:
            'More than just tools - we provide complete cutting solutions and ongoing partnership for contractors who demand excellence.',
        },
      ],
    },
    {
      name: 'advantages',
      type: 'array',
      admin: { description: 'Cards in the "Coolman advantage" grid.' },
      defaultValue: [
        { iconKey: 'zap', title: 'Superior Cutting Performance', body: 'Our diamond segments are formulated for 40% faster cutting speeds while maintaining precision. Less time cutting means more projects completed.' },
        { iconKey: 'shield', title: 'Extended Blade Life', body: 'Proprietary bonding technology and premium diamond crystals deliver up to 3x longer operational life compared to standard blades.' },
        { iconKey: 'award', title: '25+ Years of Excellence', body: 'Since 1998, we have been engineering cutting solutions for Malaysian contractors. Our expertise is built into every blade we produce.' },
        { iconKey: 'truck', title: 'Rapid Fulfillment', body: 'Same-day dispatch for orders placed before 2pm. Our logistics network ensures fast delivery across Peninsular Malaysia.' },
        { iconKey: 'headphones', title: 'Technical Partnership', body: 'Dedicated engineering support to help you select the right tools, optimize cutting parameters, and solve technical challenges.' },
        { iconKey: 'barChart3', title: 'B2B Pricing Advantage', body: 'Registered contractors enjoy exclusive pricing tiers based on volume, with additional discounts on bulk orders.' },
      ],
      fields: [
        { name: 'iconKey', type: 'select', required: true, options: ICON_OPTIONS, defaultValue: 'zap' },
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
    {
      name: 'statsSection',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Trusted by Professionals' },
        { name: 'subtitle', type: 'textarea', defaultValue: 'Our track record speaks for itself. Join hundreds of contractors who rely on Coolman.' },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      defaultValue: [
        { value: '500+', label: 'Active Contractors' },
        { value: '50,000+', label: 'Projects Completed' },
        { value: '99.2%', label: 'On-Time Delivery' },
        { value: '4.9/5', label: 'Customer Rating' },
      ],
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'testimonialsSection',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Testimonials' },
        { name: 'title', type: 'text', defaultValue: 'What Our Partners Say' },
      ],
    },
    {
      name: 'testimonials',
      type: 'array',
      defaultValue: [
        { quote: 'Coolman blades consistently outperform other brands we have tried. The cutting speed and blade life are exceptional.', author: 'Ahmad Razak', role: 'Director, ABC Construction' },
        { quote: 'Their technical support team helped us select the right blade for a challenging granite project. The results exceeded expectations.', author: 'Lee Wei Ming', role: 'Senior Engineer, XYZ Contractors' },
        { quote: 'Fast delivery and consistent quality. Coolman has been our trusted supplier for over 10 years.', author: 'Siti Aminah', role: 'Procurement Manager, DEF Builders' },
      ],
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'author', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Ready to Experience the Difference?' },
        { name: 'body', type: 'textarea', defaultValue: 'Join 500+ professional contractors who trust Coolman for their diamond cutting needs.' },
        { name: 'primaryLabel', type: 'text', defaultValue: 'Become a Partner' },
        { name: 'primaryHref', type: 'text', defaultValue: '/auth/register' },
        { name: 'secondaryLabel', type: 'text', defaultValue: 'Contact Sales' },
        { name: 'secondaryHref', type: 'text', defaultValue: '/contact' },
      ],
    },
  ],
}
