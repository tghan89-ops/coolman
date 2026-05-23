"use client"

import { createContext, useContext, type ReactNode } from 'react'

// Minimal honest contract — these are the settings fields the public site
// reads. The Payload global has more fields (orders_paused, rate limits, etc.)
// that stay server-only. If a new client surface needs another field, add it
// here and to the server-side fetch in app/(frontend)/layout.tsx.
export interface PublicSettings {
  legal_entity_name: string
  legal_entity_reg_no: string
  legal_entity_address: string
  whatsapp_number: string
  inventory_on_time_pct: number
  inventory_dispatch_cutoff: string
  opening_hours_mon_fri: string
  opening_hours_sat: string
  opening_hours_sun: string
  contact_email_sales: string
  contact_email_parts: string
  contact_email_training: string
  contact_email_careers: string
}

const SETTINGS_FALLBACK: PublicSettings = {
  legal_entity_name: 'Coolman Malaysia Sdn Bhd',
  legal_entity_reg_no: '',
  legal_entity_address: '',
  whatsapp_number: '+60126363156',
  inventory_on_time_pct: 96,
  inventory_dispatch_cutoff: '14:00',
  opening_hours_mon_fri: '09:00–18:00',
  opening_hours_sat: '09:00–13:00',
  opening_hours_sun: 'Closed',
  contact_email_sales: 'sales@coolman.com.my',
  contact_email_parts: 'parts@coolman.com.my',
  contact_email_training: 'training@coolman.com.my',
  contact_email_careers: 'careers@coolman.com.my',
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
  // settings global never blanks out the footer or WhatsApp button. Strip
  // undefined keys before spreading so a not-yet-set Payload field doesn't
  // overwrite the SETTINGS_FALLBACK with `undefined`.
  const cleaned: Partial<PublicSettings> = Object.fromEntries(
    Object.entries(initialSettings ?? {}).filter(([, v]) => v !== undefined),
  ) as Partial<PublicSettings>
  const value: PublicSettings = {
    ...SETTINGS_FALLBACK,
    ...cleaned,
  }
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): PublicSettings {
  return useContext(SettingsContext)
}
