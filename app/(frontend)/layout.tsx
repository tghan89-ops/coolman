import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans, JetBrains_Mono, Fraunces } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/i18n/context'
import { AuthProvider } from '@/lib/auth/context'
import { CartProvider } from '@/lib/cart/context'
import { SettingsProvider, type PublicSettings } from '@/lib/settings/context'
import { getGlobal } from '@/lib/payload'
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

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600'],
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
  const settingsRaw = await getGlobal('settings', { overrideAccess: true }).catch(
    () => null,
  )
  const initialSettings: Partial<PublicSettings> | null = settingsRaw
    ? {
        legal_entity_name: (settingsRaw as { legal_entity_name?: string | null })
          .legal_entity_name ?? undefined,
        whatsapp_number: (settingsRaw as { whatsapp_number?: string | null })
          .whatsapp_number ?? undefined,
        inventory_on_time_pct: (settingsRaw as { inventory_on_time_pct?: number | null })
          .inventory_on_time_pct ?? undefined,
        inventory_dispatch_cutoff: (settingsRaw as { inventory_dispatch_cutoff?: string | null })
          .inventory_dispatch_cutoff ?? undefined,
      }
    : null

  return (
    <html lang="en" className="bg-background" data-scroll-behavior="smooth">
      <body className={`${plexSans.variable} ${plexMono.variable} ${fraunces.variable} font-sans antialiased`}>
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
