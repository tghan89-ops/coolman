"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, User, LogOut, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLanguage } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'
import { CartBadge } from '@/components/cart/CartBadge'

export function Header({ variant = 'default' }: { variant?: 'default' | 'transparent' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()

  const navItems = [
    { label: t.nav.applications, href: '/applications' },
    { label: t.nav.whyCoolman, href: '/why-coolman' },
    { label: t.nav.resources, href: '/resources' },
    { label: t.nav.contact, href: '/contact' },
  ]

  const productDropdownItems = [
    { label: t.nav.diamondTools, href: '/products' },
    { label: t.nav.shibuyaCoreDrills, href: '/shibuya' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const bgClass = variant === 'transparent'
    ? (scrolled ? 'bg-navy shadow-lg shadow-navy/10' : 'bg-transparent')
    : 'bg-navy'

  return (
    <header className={`fixed top-0 z-50 w-full transition-[background-color,box-shadow] ${bgClass}`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center bg-accent">
            <span className="font-sans text-2xl font-bold text-white">C</span>
          </div>
          <span className="font-sans text-2xl font-bold tracking-wider text-white">
            Cool<span className="text-accent">man</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {/* Products Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="group relative flex items-center gap-1.5 px-4 py-2 font-sans text-sm font-semibold tracking-wide text-white/70 transition-colors hover:text-white">
                {t.nav.products}
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                <span className="absolute bottom-0 left-4 right-4 h-0.5 scale-x-0 bg-accent transition-transform group-hover:scale-x-100" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 border-navy-surface bg-navy">
              {productDropdownItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild className="text-white/80 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Regular nav items */}
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="group relative px-4 py-2 font-sans text-sm font-semibold tracking-wide text-white/70 transition-colors hover:text-white"
            >
              {item.label}
              <span className="absolute bottom-0 left-4 right-4 h-0.5 scale-x-0 bg-accent transition-transform group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <CartBadge />
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white sm:block"
          >
            {language}
          </button>

          {/* Auth buttons / User menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20 lg:flex">
                  <User className="h-4 w-4" />
                  <span className="max-w-[100px] truncate">
                    {user?.contractor?.companyName || t.nav.account}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 border-navy-surface bg-navy">
                {isAdmin ? (
                  <>
                    <DropdownMenuItem asChild className="text-white/80 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">
                      <Link href="/admin/orders">{t.admin.orders.title}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="text-white/80 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">
                      <Link href="/admin/analytics">{t.nav.adminAnalytics}</Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild className="text-white/80 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">
                    <Link href="/account">{t.nav.myAccount}</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={logout} className="text-red-400 hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t.nav.signOut}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="/auth/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                {t.nav.signIn}
              </Link>
              <Button
                size="sm"
                className="group h-10 rounded-lg bg-accent-dark px-5 text-sm font-medium text-white transition-[background-color,box-shadow] hover:bg-accent hover:shadow-lg hover:shadow-accent/25"
                asChild
              >
                <Link href="/auth/register">
                  {t.nav.createAccount}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="rounded-lg p-2 text-white transition-colors hover:bg-white/10 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`lg:hidden overflow-hidden transition-[max-height,opacity] ${
        mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="border-t border-white/10 bg-navy">
          <nav className="flex flex-col px-6 py-4">
            {/* Products Mobile */}
            <details className="border-b border-white/5 py-4">
              <summary className="cursor-pointer text-base font-medium text-white transition-colors hover:text-accent">
                {t.nav.products}
              </summary>
              <div className="mt-3 flex flex-col gap-2 pl-4">
                {productDropdownItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className="text-sm text-white/70 transition-colors hover:text-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>

            {/* Regular nav items */}
            {navItems.map((item, index) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="border-b border-white/5 py-4 text-base font-medium text-white transition-colors hover:text-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="mt-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  toggleLanguage()
                  setMobileMenuOpen(false)
                }}
                className="py-2 text-left text-sm text-white/60"
              >
                {language === 'EN' ? t.nav.switchToBM : t.nav.switchToEN}
              </button>

              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <>
                      <Link
                        href="/admin/orders"
                        className="py-2 text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t.admin.orders.title}
                      </Link>
                      <Link
                        href="/admin/analytics"
                        className="py-2 text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t.nav.adminAnalytics}
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/account"
                      className="py-2 text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t.nav.myAccount}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="py-2 text-left text-red-400"
                  >
                    {t.nav.signOut}
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-4">
                  <Button
                    variant="outline-dark"
                    className="h-12"
                    asChild
                  >
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      {t.nav.signIn}
                    </Link>
                  </Button>
                  <Button
                    className="h-12 bg-accent-dark text-white hover:bg-accent"
                    asChild
                  >
                    <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                      {t.nav.createAccount}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
