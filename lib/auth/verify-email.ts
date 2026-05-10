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

/**
 * Writes a fresh verification token to the contractor record and sends the email.
 * Call this directly from server code — never via an internal HTTP fetch, which
 * would be blocked by the session gate on the send-verification route.
 */
export async function sendVerificationEmail(
  contractorId: string | number,
  contractorEmail: string,
  companyName: string,
): Promise<void> {
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const { sendEmail } = await import('@/lib/email/send')

  const payload = await getPayload({ config })
  const token = generateVerificationToken()
  const now = new Date().toISOString()

  await payload.update({
    collection: 'contractors',
    id: contractorId as number,
    data: {
      email_verification_token: token,
      email_verification_sent_at: now,
    },
    overrideAccess: true,
  })

  const verifyUrl = `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'}/auth/verify-email?token=${token}`

  await sendEmail({
    to: contractorEmail,
    subject: 'Verify your Coolman account email',
    html: `
      <p>Welcome to Coolman, ${companyName}.</p>
      <p>Click the link below to verify your email address and unlock your contract pricing:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>This link expires in 24 hours.</p>
      <p>If you did not register, ignore this email.</p>
    `,
  })
}
