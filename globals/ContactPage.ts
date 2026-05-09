import type { GlobalConfig } from 'payload'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  access: { read: () => true },
  admin: {
    livePreview: {
      url: () => `${process.env.NEXT_PUBLIC_SERVER_URL}/contact`,
    },
  },
  fields: [
    { name: 'heroTitle', type: 'text', defaultValue: 'Contact Us' },
    { name: 'heroSubtitle', type: 'textarea' },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'address', type: 'textarea' },
    { name: 'mapEmbedUrl', type: 'text', admin: { description: 'Google Maps embed URL' } },
    { name: 'whatsappNumber', type: 'text', admin: { description: 'Full number with country code e.g. 601XXXXXXXX' } },
  ],
}
