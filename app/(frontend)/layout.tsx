import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans, JetBrains_Mono, Cormorant_Garamond, Ma_Shan_Zheng } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/i18n/context'
import { AuthProvider } from '@/lib/auth/context'
import { CartProvider } from '@/lib/cart/context'
import { SettingsProvider, type PublicSettings } from '@/lib/settings/context'
import { getCachedSettings } from '@/lib/payload'
import '../globals.css'

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
})

const plexMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

const maShanZheng = Ma_Shan_Zheng({
  weight: '400',
  subsets: ['chinese-simplified'],
  variable: '--font-chinese',
  display: 'swap',
})

const fraunces = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Coolman | Precision Diamond Tools',
  description: 'Industrial-grade diamond cutting tools engineered for Malaysian contractors. Precision meets durability.',
  keywords: ['diamond tools', 'cutting blades', 'Malaysia', 'B2B', 'industrial tools', 'contractor supplies'],
}

export const viewport: Viewport = {
  themeColor: '#0a1628',
  width: 'device-width',
  initialScale: 1,
}

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Fetch settings once at the layout boundary so every client surface
  // (footer, WhatsApp buttons, kill-switch banners) reads the same source of
  // truth without each page re-fetching. `overrideAccess: true` because
  // Settings is admin-restricted by access control (see globals/Settings.ts).
  const settingsRaw = await getCachedSettings().catch(() => null)
  const initialSettings: Partial<PublicSettings> | null = settingsRaw
    ? (() => {
        const s = settingsRaw as {
          legal_entity_name?: string | null
          legal_entity_reg_no?: string | null
          legal_entity_address?: string | null
          whatsapp_number?: string | null
          inventory_on_time_pct?: number | null
          inventory_dispatch_cutoff?: string | null
          opening_hours?: {
            mon_fri?: string | null
            sat?: string | null
            sun?: string | null
          } | null
          contact_email_sales?: string | null
          contact_email_parts?: string | null
          contact_email_training?: string | null
          contact_email_careers?: string | null
        }
        return {
          legal_entity_name: s.legal_entity_name ?? undefined,
          legal_entity_reg_no: s.legal_entity_reg_no ?? undefined,
          legal_entity_address: s.legal_entity_address ?? undefined,
          whatsapp_number: s.whatsapp_number ?? undefined,
          inventory_on_time_pct: s.inventory_on_time_pct ?? undefined,
          inventory_dispatch_cutoff: s.inventory_dispatch_cutoff ?? undefined,
          opening_hours_mon_fri: s.opening_hours?.mon_fri ?? undefined,
          opening_hours_sat: s.opening_hours?.sat ?? undefined,
          opening_hours_sun: s.opening_hours?.sun ?? undefined,
          contact_email_sales: s.contact_email_sales ?? undefined,
          contact_email_parts: s.contact_email_parts ?? undefined,
          contact_email_training: s.contact_email_training ?? undefined,
          contact_email_careers: s.contact_email_careers ?? undefined,
        }
      })()
    : null

  return (
    <html lang="en" className="bg-background" data-scroll-behavior="smooth">
      <body className={`${plexSans.variable} ${plexMono.variable} ${fraunces.variable} ${maShanZheng.variable} overflow-x-hidden font-sans antialiased`}>
        <SettingsProvider initialSettings={initialSettings}>
          <LanguageProvider>
            <AuthProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </AuthProvider>
          </LanguageProvider>
        </SettingsProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

