import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendVerificationEmail } from '@/lib/auth/verify-email'

// POST /api/auth/send-verification
// Body: { contractorId: string }
// Requires: valid session cookie belonging to the contractorId (prevents email flooding)
export async function POST(req: NextRequest) {
  try {
    const { contractorId } = await req.json()
    if (!contractorId) return NextResponse.json({ error: 'contractorId required' }, { status: 400 })

    // Only allow the contractor themselves to trigger a resend for their own account
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('coolman-token')?.value

    if (!sessionToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

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

    await sendVerificationEmail(
      contractor.id,
      contractor.email as string,
      (contractor as any).companyName ?? '',
    )

    return NextResponse.json({ message: 'Verification email sent' })
  } catch (err) {
    console.error('[send-verification]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
