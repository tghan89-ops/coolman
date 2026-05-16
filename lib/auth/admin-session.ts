// lib/auth/admin-session.ts
//
// Server-side guard for admin-only surfaces. Verifies the Payload session
// belongs to an `adminUsers` account. Used by custom admin API routes and
// any custom admin page rendered outside the built-in Payload admin shell.

import { getPayload } from 'payload'
import config from '@payload-config'

export interface AdminSession {
  id: string
  email: string
  name?: string
  role?: 'admin' | 'marketing'
}

/**
 * Returns the authenticated admin user, or null if the request has no valid
 * `adminUsers` session. Never throws.
 */
export async function getAdminSession(headers: Headers): Promise<AdminSession | null> {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers })
    if (!user || (user as { collection?: string }).collection !== 'adminUsers') return null
    const u = user as unknown as AdminSession
    return { id: u.id, email: u.email, name: u.name, role: u.role }
  } catch {
    return null
  }
}
