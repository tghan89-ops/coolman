"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, BarChart3, LogOut, Menu, X, Home } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { t } = useLanguage()
  const { logout } = useAuth()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: t.nav.adminOrders, href: '/admin/orders', icon: ShoppingCart },
    { name: t.nav.adminAnalytics, href: '/admin/analytics', icon: BarChart3 },
  ]

  return (
    <div className="flex min-h-screen bg-navy">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-white/10 bg-navy transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
            <Link href="/admin/orders" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <span className="text-sm font-bold text-white">C</span>
              </div>
              <div>
                <span className="text-lg font-bold text-white">Coolman</span>
                <span className="ml-1 text-xs text-accent-light">Admin</span>
              </div>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-ink-muted hover:bg-white/10 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6">
            <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-ink-muted">
              Dashboard
            </div>
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-accent/10 text-accent-light"
                          : "text-ink-muted hover:bg-white/5 hover:text-white"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className={cn("h-5 w-5", isActive && "text-accent-light")} />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div className="mb-2 mt-8 px-3 text-xs font-medium uppercase tracking-wider text-ink-muted">
              Quick Links
            </div>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-white/5 hover:text-white"
                >
                  <Home className="h-5 w-5" />
                  View Website
                </Link>
              </li>
            </ul>
          </nav>

          {/* Logout */}
          <div className="border-t border-white/10 p-3">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-ink-muted hover:bg-white/5 hover:text-white"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
              {t.nav.logout}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-16 items-center gap-4 border-b border-white/10 bg-navy px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-ink-muted hover:bg-white/10 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <span className="text-sm font-bold text-white">C</span>
            </div>
            <span className="font-semibold text-white">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
