import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendEmail } from '@/lib/email/send'

// POST /api/auth/forgot-password
// Body: { email: string }
// Always returns 200 with a neutral message so attackers can't probe which
// emails exist. Generates a reset token via Payload's local API and emails it.
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'email required' }, { status: 400 })
    }

    const normalisedEmail = email.toLowerCase().trim()
    const payload = await getPayload({ config })

    // Confirm the contractor exists before invoking forgotPassword so we can
    // log a clear reason when no email is sent. We still return a neutral
    // response to the client either way.
    const lookup = await payload.find({
      collection: 'contractors',
      where: { email: { equals: normalisedEmail } },
      limit: 1,
      overrideAccess: true,
    })

    if (lookup.docs.length === 0) {
      console.warn('[forgot-password] no contractor found for email:', normalisedEmail)
      return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' })
    }

    let token: string | null = null
    try {
      const result = await payload.forgotPassword({
        collection: 'contractors',
        data: { email: normalisedEmail },
        disableEmail: true,
      })
      token = (result as unknown as { token?: string })?.token ?? null
      if (!token) {
        console.error('[forgot-password] Payload forgotPassword returned no token for:', normalisedEmail, result)
      }
    } catch (err) {
      console.error('[forgot-password] payload.forgotPassword threw for', normalisedEmail, err)
      token = null
    }

    if (token) {
      const baseUrl =
        process.env.NEXT_PUBLIC_SERVER_URL ??
        process.env.NEXT_PUBLIC_SITE_URL ??
        new URL(req.url).origin
      const link = `${baseUrl}/auth/reset-password?token=${encodeURIComponent(token)}`
      const result = await sendEmail({
        to: normalisedEmail,
        subject: 'Reset your Coolman password',
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 560px; padding: 24px;">
            <h1 style="font-size: 20px; color: #0F172A;">Reset your password</h1>
            <p>You asked to reset your Coolman password. Click below to choose a new one. This link expires in 1 hour.</p>
            <p style="margin: 24px 0;">
              <a href="${link}" style="background:#3B82F6;color:#fff;padding:12px 20px;text-decoration:none;font-weight:600;border-radius:6px;">Reset password</a>
            </p>
            <p style="font-size: 13px; color: #475569; word-break: break-all;">Or copy this link: ${link}</p>
            <p style="font-size: 13px; color: #64748B;">If you didn't ask for this, you can safely ignore this email — your password won't change.</p>
          </div>
        `,
      })
      if (!result.success) {
        console.error('[forgot-password] sendEmail failed for', normalisedEmail, result.error)
      } else {
        console.log('[forgot-password] reset email sent to', normalisedEmail, 'messageId:', result.messageId)
      }
    }

    return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' })
  } catch (err) {
    console.error('[forgot-password]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
