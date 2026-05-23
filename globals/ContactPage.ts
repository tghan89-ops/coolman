import type { GlobalConfig } from 'payload'
import { bilingualTabs } from '@/lib/admin/bilingualTabs'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  access: { read: () => true },
  admin: {
    livePreview: {
      url: () => `${process.env.NEXT_PUBLIC_SERVER_URL}/contact`,
    },
  },
  fields: bilingualTabs([
    { name: 'heroTitle', type: 'text', defaultValue: 'Contact Us' },
    { name: 'heroTitleBM', type: 'text' },
    { name: 'heroSubtitle', type: 'textarea' },
    { name: 'heroSubtitleBM', type: 'textarea' },
    { name: 'phone', type: 'text', admin: { description: 'Phone number — not translated.' } },
    { name: 'email', type: 'email', admin: { description: 'Email address — not translated.' } },
    { name: 'address', type: 'textarea' },
    { name: 'addressBM', type: 'textarea' },
    { name: 'mapEmbedUrl', type: 'text', admin: { description: 'Google Maps embed URL — not translated.' } },
    { name: 'whatsappNumber', type: 'text', admin: { description: 'Full number with country code e.g. 601XXXXXXXX — not translated.' } },
    { name: 'responseTime', type: 'text', defaultValue: '< 4 hours', admin: { description: 'Average response time value (numeric/short text — not translated).' } },
  ]),
}
