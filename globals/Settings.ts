import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  versions: true,
  admin: {
    group: 'System',
  },
  access: {
    read: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
    update: ({ req: { user } }) =>
      (user as any)?.collection === 'adminUsers' && (user as any)?.role === 'admin',
  },
  fields: [
    {
      name: 'orders_paused',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Kill switch. When checked, all order submissions return a friendly "paused" message. No orders can be placed.',
      },
    },
    {
      name: 'alert_threshold_hours',
      type: 'number',
      defaultValue: 24,
      min: 1,
      admin: {
        description:
          'Hours before an unacknowledged pending order triggers an alert email to Alan and Pushpa.',
      },
    },
    {
      name: 'duplicate_window_minutes',
      type: 'number',
      defaultValue: 10,
      min: 1,
      admin: {
        description:
          'Same contractor + same product within this many minutes = duplicate flag on the order.',
      },
    },
    {
      name: 'tier_discount_warn_above',
      type: 'number',
      defaultValue: 0.3,
      min: 0,
      max: 1,
      admin: {
        description:
          '0.30 = show confirm dialog when Alan sets a contractor tier discount above 30%.',
      },
    },
    {
      name: 'order_rate_limit_per_hour',
      type: 'number',
      defaultValue: 20,
      min: 1,
      admin: { description: 'Max order submissions per contractor per hour.' },
    },
    {
      name: 'search_log_debounce_ms',
      type: 'number',
      defaultValue: 800,
      min: 100,
      admin: {
        description:
          'Milliseconds of typing inactivity before a search query is logged. Prevents noise on every keystroke.',
      },
    },
    {
      name: 'max_combined_discount_pct',
      type: 'number',
      defaultValue: 0.4,
      min: 0,
      max: 1,
      admin: {
        description:
          '0.40 = hard cap on combined tier + promo discount. Server rejects any promo that would push a contractor past this threshold.',
      },
    },
    {
      name: 'registration_rate_limit_per_ip_per_day',
      type: 'number',
      defaultValue: 5,
      min: 1,
      admin: {
        description:
          'Max contractor registrations from one IP per day. Prevents fake account flooding to scrape prices.',
      },
    },
    {
      name: 'order_notify_emails',
      type: 'text',
      admin: {
        description:
          'Comma-separated email addresses that receive the "new order received" notification when a contractor places an order. Example: alan@coolman.com.my, sales@coolman.com.my. Leave blank to fall back to the ALAN_EMAIL environment variable.',
      },
    },
    {
      name: 'whatsapp_number',
      type: 'text',
      defaultValue: '+60126363156',
      admin: {
        description:
          'Single source of truth for the WhatsApp button across the whole site (home, product detail, contact, kill-switch banner, dealer cards). International format, digits only with leading + e.g. +60126363156. wa.me deep-links are built from this.',
      },
    },
    {
      name: 'legal_entity_name',
      type: 'text',
      defaultValue: 'Coolman Malaysia Sdn Bhd',
      admin: {
        description:
          'Full legal company name shown on footer copyright, contact page, order confirmation emails, invoice templates, and any "Registered company" surface. The conversational trade name stays "Coolman" everywhere else.',
      },
    },
    {
      name: 'legal_entity_reg_no',
      type: 'text',
      admin: {
        description:
          'SSM company registration number. Leave blank until Alan supplies it. Surfaces on footer and contact page once filled.',
      },
    },
    {
      name: 'legal_entity_address',
      type: 'textarea',
      admin: {
        description:
          'Registered office address. Leave blank until Alan supplies it. Surfaces on contact page and order confirmation emails.',
      },
    },
    {
      name: 'opening_hours',
      type: 'group',
      admin: {
        description: 'Showroom / office opening hours displayed on the contact page.',
      },
      fields: [
        {
          name: 'mon_fri',
          type: 'text',
          defaultValue: '09:00–18:00',
          admin: { description: 'Monday–Friday e.g. 09:00–18:00 or "Closed".' },
        },
        {
          name: 'sat',
          type: 'text',
          defaultValue: '09:00–13:00',
          admin: { description: 'Saturday e.g. 09:00–13:00 or "Closed".' },
        },
        {
          name: 'sun',
          type: 'text',
          defaultValue: 'Closed',
          admin: { description: 'Sunday e.g. "Closed" or 09:00–13:00.' },
        },
      ],
    },
    {
      name: 'contact_email_sales',
      type: 'text',
      defaultValue: 'sales@coolman.com.my',
      admin: {
        description:
          'Direct email address for the Sales team. Shown on the Contact page as a mailto link.',
      },
    },
    {
      name: 'contact_email_parts',
      type: 'text',
      defaultValue: 'parts@coolman.com.my',
      admin: {
        description:
          'Direct email address for the Parts & Technical team. Shown on the Contact page as a mailto link.',
      },
    },
    {
      name: 'contact_email_training',
      type: 'text',
      defaultValue: 'training@coolman.com.my',
      admin: {
        description:
          'Direct email address for the Training team. Shown on the Contact page as a mailto link.',
      },
    },
    {
      name: 'contact_email_careers',
      type: 'text',
      defaultValue: 'careers@coolman.com.my',
      admin: {
        description:
          'Direct email address for Careers / HR enquiries. Shown on the Contact page as a mailto link.',
      },
    },
    {
      name: 'inventory_on_time_pct',
      type: 'number',
      defaultValue: 96,
      min: 0,
      max: 100,
      admin: {
        description:
          'On-time fulfilment % shown on the home "quiet door" section. Whole-number percent e.g. 96 = 96%. Alan-typed; not computed live (fulfilment data lives outside the app at V1).',
      },
    },
    {
      name: 'inventory_dispatch_cutoff',
      type: 'text',
      defaultValue: '14:00',
      admin: {
        description:
          'Same-day dispatch cut-off time shown on the home "quiet door" section. 24-hour format e.g. "14:00". Alan-confirmed.',
      },
    },
  ],
}
