import { randomUUID } from 'crypto'

export function generateVerificationToken(): string {
  return randomUUID()
}

/** Returns true if the token was sent more than 24 hours ago (expired). */
export function isTokenExpired(sentAt: string | null | undefined): boolean {
  if (!sentAt) return true
  const sent = new Date(sentAt)
  const now = new Date()
  return now.getTime() - sent.getTime() > 24 * 60 * 60 * 1000
}
