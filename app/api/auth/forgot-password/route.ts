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

    const payload = await getPayload({ config })

    let token: string | null = null
    try {
      const result = await payload.forgotPassword({
        collection: 'contractors',
        data: { email: email.toLowerCase().trim() },
        disableEmail: true,
      })
      token = (result as unknown as { token?: string })?.token ?? null
    } catch {
      // unknown email — fall through to the neutral response
      token = null
    }

    if (token) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
      const link = `${baseUrl}/auth/reset-password?token=${encodeURIComponent(token)}`
      await sendEmail({
        to: email,
        subject: 'Reset your Coolman password',
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 560px; padding: 24px;">
            <h1 style="font-size: 20px; color: #0F172A;">Reset your password</h1>
            <p>You asked to reset your Coolman password. Click below to choose a new one. This link expires in 1 hour.</p>
            <p style="margin: 24px 0;">
              <a href="${link}" style="background:#3B82F6;color:#fff;padding:12px 20px;text-decoration:none;font-weight:600;border-radius:6px;">Reset password</a>
            </p>
            <p style="font-size: 13px; color: #64748B;">If you didn't ask for this, you can safely ignore this email — your password won't change.</p>
          </div>
        `,
      })
    }

    return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' })
  } catch (err) {
    console.error('[forgot-password]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
