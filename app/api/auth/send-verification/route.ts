import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generateVerificationToken } from '@/lib/auth/verify-email'
import { sendEmail } from '@/lib/email/send'

// POST /api/auth/send-verification
// Body: { contractorId: string }
export async function POST(req: NextRequest) {
  try {
    const { contractorId } = await req.json()
    if (!contractorId) return NextResponse.json({ error: 'contractorId required' }, { status: 400 })

    // Only allow the contractor themselves to trigger a verification email for their own account
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('coolman-token')?.value

    if (!sessionToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Verify the session belongs to the contractor making the request
    try {
      const meRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'}/api/contractors/me`, {
        headers: { Cookie: `coolman-token=${sessionToken}` },
      })
      if (!meRes.ok) return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
      const meData = await meRes.json()
      if (meData.user?.id !== contractorId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } catch {
      return NextResponse.json({ error: 'Authentication error' }, { status: 401 })
    }

    const payload = await getPayload({ config })
    const contractor = await payload.findByID({
      collection: 'contractors',
      id: contractorId,
      overrideAccess: true,
    })
    if (!contractor) return NextResponse.json({ error: 'Contractor not found' }, { status: 404 })
    if (contractor.email_verified_at) return NextResponse.json({ message: 'Already verified' })

    const token = generateVerificationToken()
    const now = new Date().toISOString()

    await payload.update({
      collection: 'contractors',
      id: contractorId,
      data: {
        email_verification_token: token,
        email_verification_sent_at: now,
      },
      overrideAccess: true,
    })

    const verifyUrl = `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'}/auth/verify-email?token=${token}`

    await sendEmail({
      to: contractor.email as string,
      subject: 'Verify your Coolman account email',
      html: `
        <p>Welcome to Coolman, ${(contractor as any).companyName}.</p>
        <p>Click the link below to verify your email address and unlock your contract pricing:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>This link expires in 24 hours.</p>
        <p>If you did not register, ignore this email.</p>
      `,
    })

    return NextResponse.json({ message: 'Verification email sent' })
  } catch (err) {
    console.error('[send-verification]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
