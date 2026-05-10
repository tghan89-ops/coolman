import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isTokenExpired } from '@/lib/auth/verify-email'

// GET /api/auth/verify-email?token=<uuid>
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 })

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'contractors',
    where: { email_verification_token: { equals: token } },
    limit: 1,
    overrideAccess: true,
  })

  if (!result.docs.length) {
    return NextResponse.json({ error: 'Invalid or expired link' }, { status: 400 })
  }

  const contractor = result.docs[0]

  if (contractor.email_verified_at) {
    return NextResponse.json({ message: 'Already verified' })
  }

  if (isTokenExpired(contractor.email_verification_sent_at as string)) {
    return NextResponse.json(
      { error: 'Link expired. Request a new verification email from your account page.' },
      { status: 400 },
    )
  }

  await payload.update({
    collection: 'contractors',
    id: contractor.id as unknown as string,
    data: {
      email_verified_at: new Date().toISOString(),
      email_verification_token: null,
      email_verification_sent_at: null,
    },
    overrideAccess: true,
  })

  return NextResponse.json({ message: 'Email verified successfully' })
}
