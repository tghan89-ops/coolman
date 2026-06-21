'use client'

import { createContext, useContext, type ReactNode } from 'react'

/**
 * CMS-driven top navigation, fetched once at the (frontend) layout (like
 * CategoriesProvider) so every page's header reads the same source without
 * re-querying.
 *
 * SAFETY (plan-eng-review P1): if the CMS nav is empty or failed to load, the
 * header falls back to DEFAULT_NAV — the built-in menu — so the top menu can
 * never vanish site-wide. DEFAULT_NAV keeps i18n labels (via `i18nKey`); CMS
 * items use `label`/`labelBM` with EN fallback.
 */

export type NavItem = {
  type: 'link' | 'mega-products'
  /** Literal English label (CMS items). */
  label?: string
  /** Optional Bahasa label (CMS items); falls back to `label`. */
  labelBM?: string | null
  /** i18n key into t.nav (built-in fallback items only). */
  i18nKey?: string
  /** Resolved destination for link items. */
  href?: string
  newTab?: boolean
}

/** Built-in fallback menu = today's hardcoded nav, kept bilingual via i18n keys. */
export const DEFAULT_NAV: NavItem[] = [
  { type: 'link', i18nKey: 'aboutUs', href: '/about' },
  { type: 'mega-products', i18nKey: 'products', href: '/products' },
  { type: 'link', label: 'Shibuya', href: '/shibuya' },
  { type: 'link', i18nKey: 'brotherhood', href: '/brotherhood' },
  { type: 'link', i18nKey: 'career', href: '/career' },
  { type: 'link', i18nKey: 'contact', href: '/contact' },
]

const NavigationContext = createContext<NavItem[]>(DEFAULT_NAV)

/** Pure fallback decision (unit-tested): empty/invalid → built-in DEFAULT_NAV. */
export function resolveNavItems(items: unknown): NavItem[] {
  return Array.isArray(items) && items.length > 0 ? (items as NavItem[]) : DEFAULT_NAV
}

export function NavigationProvider({ items, children }: { items: NavItem[]; children: ReactNode }) {
  // Empty or missing → built-in fallback. Menu never disappears (plan-eng-review P1).
  return <NavigationContext.Provider value={resolveNavItems(items)}>{children}</NavigationContext.Provider>
}

export function useNavigation(): NavItem[] {
  return useContext(NavigationContext)
}

/** Resolve the visible label for an item given current language + translations. */
export function navLabel(item: NavItem, language: string, tNav: Record<string, string>): string {
  if (item.i18nKey && tNav[item.i18nKey]) return tNav[item.i18nKey]
  if (language === 'BM' && item.labelBM) return item.labelBM
  return item.label || item.i18nKey || ''
}
