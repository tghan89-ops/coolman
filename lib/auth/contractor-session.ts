// lib/auth/contractor-session.ts
//
// Server-side guard for contractor-only data. Verifies the Payload session
// belongs to a `contractors` account and returns the tier_discount_pct
// needed to compute per-contractor pricing.

import { getPayload } from 'payload'
import config from '@payload-config'

export interface ContractorSession {
  id: string
  email: string
  companyName: string
  status: string
  email_verified_at: string | null
  tier_discount_pct: number
}

/**
 * Returns the authenticated contractor, or null if no valid `contractors`
 * session is on the request. Never throws. The `tier_discount_pct` defaults
 * to 0 when missing so callers can always do the math without null checks.
 */
export async function getContractorSession(headers: Headers): Promise<ContractorSession | null> {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers })
    if (!user || (user as { collection?: string }).collection !== 'contractors') return null
    const u = user as any
    return {
      id: String(u.id),
      email: u.email,
      companyName: u.companyName ?? '',
      status: u.status ?? 'Active',
      email_verified_at: u.email_verified_at ?? null,
      tier_discount_pct: typeof u.tier_discount_pct === 'number' ? u.tier_discount_pct : 0,
    }
  } catch {
    return null
  }
}

/**
 * Returns true if this contractor is fully approved to see contract pricing.
 * Status must be Active AND email must be verified AND tier must be > 0.
 * (A zero-tier verified contractor is treated as public — there's no contract
 * price to show.)
 */
export function hasContractPricing(session: ContractorSession | null): boolean {
  if (!session) return false
  if (session.status !== 'Active') return false
  if (!session.email_verified_at) return false
  if (session.tier_discount_pct <= 0) return false
  return true
}
