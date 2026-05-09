import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/i18n/context'
import { AuthProvider } from '@/lib/auth/context'
import './globals.css'

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background" data-scroll-behavior="smooth">
      <body className={`${plexSans.variable} ${plexMono.variable} font-sans antialiased`}>
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
