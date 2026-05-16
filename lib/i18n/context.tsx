"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { COPY, type Language, type CopyStructure } from './copy'
import { auditCopyKeys } from './missing-keys'

const LANG_COOKIE = 'coolman-lang'
const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

function readLangCookie(): Language | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)coolman-lang=(EN|BM)(?:;|$)/)
  return (match?.[1] as Language) ?? null
}

function writeLangCookie(lang: Language) {
  if (typeof document === 'undefined') return
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=${LANG_COOKIE_MAX_AGE}; samesite=lax`
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: CopyStructure
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('EN')

  // Hydrate from the persisted cookie on first client render.
  useEffect(() => {
    auditCopyKeys()
    const stored = readLangCookie()
    if (stored && stored !== language) setLanguageState(stored)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    writeLangCookie(lang)
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next = prev === 'EN' ? 'BM' : 'EN'
      writeLangCookie(next)
      return next
    })
  }, [])

  const t = COPY[language]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
