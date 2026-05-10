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
  ],
}
