"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  ArrowRight,
  Disc2,
  Disc3,
  Drill,
  Wrench,
  Layers,
  type LucideIcon,
} from 'lucide-react'
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
import { useMenuCategories, type MenuCategory } from '@/lib/categories/context'
import { CartBadge } from '@/components/cart/CartBadge'

// Minimum published Field Notes before the nav link surfaces. Below this,
// the section is judged too thin to send users to — the link stays hidden.
// Tuneable here; if we ever move to a Settings table, that justification
// (frontend-editability) belongs in LEARNINGS.md.
const FIELD_NOTES_NAV_THRESHOLD = 3

// Mega-menu grouping for the Products dropdown. The category LIST comes from
// the CMS (useMenuCategories); this only decides which cluster each one sits in
// and the icon. `match` is by category name (case-insensitive). Any CMS
// category not matched here falls into the "More" group, so a newly-added
// category is never silently dropped from the menu. Group titles are i18n
// (t.productMenu.groups.*). If this grouping ever needs to be admin-editable,
// promote it to a field on the Categories collection.
type ProductGroupKey = 'cutting' | 'drilling' | 'grinding' | 'accessories' | 'more'

const PRODUCT_GROUPS: { key: ProductGroupKey; icon: LucideIcon; match: string[] }[] = [
  { key: 'cutting', icon: Disc3, match: ['Diamond Blades', 'TCT Saw Blades', 'Cutting Machines'] },
  { key: 'drilling', icon: Drill, match: ['Core Bits', 'Core Drill Machines', 'Drill Bits', 'Hole Saws'] },
  { key: 'grinding', icon: Disc2, match: ['Grinding Wheels', 'Polishing Pads', 'Floor Equipment'] },
  { key: 'accessories', icon: Wrench, match: ['Accessories & Parts', 'Anchor Removal Tools', 'Anchors & Fixings'] },
]

export function Header({ variant = 'default' }: { variant?: 'default' | 'transparent' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [fieldNotesCount, setFieldNotesCount] = useState<number>(0)
  const { language, toggleLanguage, t } = useLanguage()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const menuCategories = useMenuCategories()

  // Bucket the CMS categories into the menu groups. Unmatched categories land
  // in "More" so nothing an admin adds disappears. Empty groups are dropped.
  const productGroups = useMemo(() => {
    const norm = (s: string) => s.trim().toLowerCase()
    const buckets = PRODUCT_GROUPS.map((g) => ({
      key: g.key,
      icon: g.icon,
      cats: [] as MenuCategory[],
    }))
    const more: MenuCategory[] = []
    for (const cat of menuCategories) {
      const gi = PRODUCT_GROUPS.findIndex((g) => g.match.some((m) => norm(m) === norm(cat.name)))
      if (gi >= 0) buckets[gi].cats.push(cat)
      else more.push(cat)
    }
    const out = buckets.filter((b) => b.cats.length > 0)
    if (more.length) out.push({ key: 'more' as ProductGroupKey, icon: Layers, cats: more })
    return out
  }, [menuCategories])

  const hasMegaMenu = productGroups.length > 0
  const catLabel = (c: MenuCategory) => (language === 'BM' ? c.nameBM : c.name)
  const catHref = (c: MenuCategory) => `/products?category=${encodeURIComponent(c.name)}`

  // Lightweight client-side probe: ask the route handler how many Field Notes
  // are published. The route is CDN-cached with a 60s window so this is
  // effectively one request per minute per region. Failures stay silent —
  // the link simply doesn't appear, which is the safe default.
  useEffect(() => {
    let cancelled = false
    fetch('/api/field-notes-count', { next: { revalidate: 60 } })
      .then((r) => (r.ok ? r.json() : { count: 0 }))
      .then((data) => {
        if (!cancelled && typeof data?.count === 'number') {
          setFieldNotesCount(data.count)
        }
      })
      .catch(() => {
        // Silent: no link, no broken UI.
      })
    return () => {
      cancelled = true
    }
  }, [])

  const showFieldNotesLink = fieldNotesCount >= FIELD_NOTES_NAV_THRESHOLD

  // Trimmed to the new transactional direction (June 2026): Products / Shibuya /
  // Contact. Heritage and Why-Coolman pages still exist but are retiring, so
  // they're off the primary nav.
  const navItems = [
    { label: t.nav.aboutUs, href: '/about' },
    { label: t.nav.products, href: '/products' },
    { label: 'Shibuya', href: '/shibuya' },
    { label: t.nav.brotherhood, href: '/brotherhood' },
    { label: t.nav.career, href: '/career' },
    { label: t.nav.contact, href: '/contact' },
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
        <Link
          href="/"
          aria-label="Coolman home"
          className="-mx-2 flex h-14 items-center px-2"
        >
          <Image
            src="/brand/coolman-logo-white.svg"
            alt="Coolman"
            width={200}
            height={56}
            priority
            className="h-14 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center lg:flex">
          {navItems.map((item) => {
            // Products gets a Hilti-style mega-panel on hover. The wrapper is
            // full header height (h-20) so the pointer can travel from the link
            // down to the panel without crossing a dead gap (the panel sits
            // flush at top-20). group-hover/group-focus-within drive it — no JS.
            if (item.href === '/products' && hasMegaMenu) {
              return (
                <div key={item.href} className="group relative flex h-20 items-center">
                  <Link
                    href="/products"
                    className="relative flex items-center gap-1 px-4 py-2 font-sans text-sm font-semibold tracking-wide text-white/70 transition-colors hover:text-white group-hover:text-white"
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-150 group-hover:rotate-180" />
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 scale-x-0 bg-accent transition-transform group-hover:scale-x-100" />
                  </Link>

                  <div className="invisible fixed inset-x-0 top-20 z-40 opacity-0 transition-opacity duration-150 ease-out group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="border-b border-rule bg-white shadow-[0_16px_40px_rgba(10,22,40,0.16)]">
                      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                        <div className="grid gap-8 lg:grid-cols-[repeat(4,minmax(0,1fr))_1.15fr]">
                          {productGroups.map((g) => {
                            const Icon = g.icon
                            return (
                              <div key={g.key}>
                                <div className="mb-4 flex items-center gap-2">
                                  <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                                    {t.productMenu.groups[g.key]}
                                  </span>
                                </div>
                                <ul className="space-y-2.5">
                                  {g.cats.map((c) => (
                                    <li key={c.name}>
                                      <Link
                                        href={catHref(c)}
                                        className="flex items-baseline justify-between gap-3 text-sm text-navy transition-colors hover:text-accent"
                                      >
                                        <span>{catLabel(c)}</span>
                                        <span className="font-mono text-[11px] text-ink-faint">{c.count}</span>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )
                          })}

                          <div className="flex flex-col justify-between rounded-lg bg-navy p-6">
                            <div>
                              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
                                {t.productMenu.shopByCategory}
                              </div>
                              <p className="mt-2 text-sm leading-relaxed text-white/70">
                                {t.productMenu.blurb}
                              </p>
                            </div>
                            <Link
                              href="/products"
                              className="mt-5 inline-flex items-center gap-2 self-start rounded-[5px] bg-accent px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90"
                            >
                              {t.productMenu.viewAll} <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative px-4 py-2 font-sans text-sm font-semibold tracking-wide text-white/70 transition-colors hover:text-white"
              >
                {item.label}
                <span className="absolute bottom-0 left-4 right-4 h-0.5 scale-x-0 bg-accent transition-transform group-hover:scale-x-100" />
              </Link>
            )
          })}
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
                className="group h-10 rounded-lg bg-accent px-5 text-sm font-medium text-white transition-[opacity,box-shadow] hover:opacity-90 hover:shadow-lg hover:shadow-accent/25"
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
            {navItems.map((item) => {
              if (item.href === '/products' && hasMegaMenu) {
                return (
                  <div key={item.href} className="border-b border-white/5">
                    <button
                      type="button"
                      onClick={() => setMobileProductsOpen((v) => !v)}
                      aria-expanded={mobileProductsOpen}
                      className="flex w-full items-center justify-between py-4 text-base font-medium text-white transition-colors hover:text-accent"
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-150 ${mobileProductsOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {mobileProductsOpen && (
                      <div className="pb-3">
                        {productGroups.map((g) => (
                          <div key={g.key} className="pb-1">
                            <div className="px-1 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
                              {t.productMenu.groups[g.key]}
                            </div>
                            {g.cats.map((c) => (
                              <Link
                                key={c.name}
                                href={catHref(c)}
                                onClick={() => {
                                  setMobileMenuOpen(false)
                                  setMobileProductsOpen(false)
                                }}
                                className="flex items-center justify-between py-2 pl-3 text-sm text-white/85 transition-colors hover:text-accent"
                              >
                                <span>{catLabel(c)}</span>
                                <span className="font-mono text-[11px] text-white/40">{c.count}</span>
                              </Link>
                            ))}
                          </div>
                        ))}
                        <Link
                          href="/products"
                          onClick={() => {
                            setMobileMenuOpen(false)
                            setMobileProductsOpen(false)
                          }}
                          className="flex items-center gap-2 py-2 pl-3 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-accent"
                        >
                          {t.productMenu.viewAll} <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                )
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-b border-white/5 py-4 text-base font-medium text-white transition-colors hover:text-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}

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
                    className="h-12 bg-accent text-white hover:opacity-90"
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
