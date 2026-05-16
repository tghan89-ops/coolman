import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendVerificationEmail } from '@/lib/auth/verify-email'
import { getContractorSession } from '@/lib/auth/contractor-session'

// POST /api/auth/send-verification
// Body: { contractorId: string }
// Requires: valid session cookie belonging to the contractorId (prevents email flooding)
export async function POST(req: NextRequest) {
  try {
    const { contractorId } = await req.json()
    if (!contractorId) return NextResponse.json({ error: 'contractorId required' }, { status: 400 })

    // Only allow the contractor themselves to trigger a resend for their own account
    const session = await getContractorSession(req.headers)
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (String(session.id) !== String(contractorId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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
