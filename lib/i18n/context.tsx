"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { COPY, type Language, type CopyStructure } from './copy'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: CopyStructure
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('EN')

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'EN' ? 'BM' : 'EN'))
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
