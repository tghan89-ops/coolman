"use client"

import { Header } from './header'
import { Footer } from './footer'

interface PublicLayoutProps {
  children: React.ReactNode
  headerVariant?: 'default' | 'transparent'
}

export function PublicLayout({ children, headerVariant = 'default' }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header variant={headerVariant} />
      <main className={`flex-1${headerVariant === 'default' ? ' pt-20' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
