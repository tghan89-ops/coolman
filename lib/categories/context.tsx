"use client"

import { createContext, useContext, type ReactNode } from 'react'
import type { MenuCategory } from '@/lib/payload'

export type { MenuCategory }

// Header mega-menu categories, fetched once at the (frontend) layout (like
// SettingsProvider) so every page's header reads the same CMS-sourced list
// without each page re-querying. Empty fallback so a stale/missing fetch just
// hides the dropdown rather than breaking the header.
const CategoriesContext = createContext<MenuCategory[]>([])

export function CategoriesProvider({
  categories,
  children,
}: {
  categories: MenuCategory[]
  children: ReactNode
}) {
  return (
    <CategoriesContext.Provider value={categories}>{children}</CategoriesContext.Provider>
  )
}

export function useMenuCategories(): MenuCategory[] {
  return useContext(CategoriesContext)
}
