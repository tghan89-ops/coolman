"use client"

import { createContext, useContext, type ReactNode } from 'react'

// Minimal honest contract — these are the settings fields the public site
// reads. The Payload global has more fields (orders_paused, rate limits, etc.)
// that stay server-only. If a new client surface needs another field, add it
// here and to the server-side fetch in app/(frontend)/layout.tsx.
export interface PublicSettings {
  legal_entity_name: string
  whatsapp_number: string
  inventory_on_time_pct: number
  inventory_dispatch_cutoff: string
}

const SETTINGS_FALLBACK: PublicSettings = {
  legal_entity_name: 'Coolman Malaysia Sdn Bhd',
  whatsapp_number: '+60126363156',
  inventory_on_time_pct: 96,
  inventory_dispatch_cutoff: '14:00',
}

const SettingsContext = createContext<PublicSettings>(SETTINGS_FALLBACK)

export function SettingsProvider({
  initialSettings,
  children,
}: {
  initialSettings: Partial<PublicSettings> | null
  children: ReactNode
}) {
  // Merge the server-fetched values over the fallback so a missing or stale
  // settings global never blanks out the footer or WhatsApp button.
  const value: PublicSettings = {
    ...SETTINGS_FALLBACK,
    ...(initialSettings ?? {}),
  }
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): PublicSettings {
  return useContext(SettingsContext)
}
