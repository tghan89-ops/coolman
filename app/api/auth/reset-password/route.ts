import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// POST /api/auth/reset-password
// Body: { token: string, password: string }
// Wraps Payload's local resetPassword for the contractors collection.
export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'token required' }, { status: 400 })
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    try {
      await payload.resetPassword({
        collection: 'contractors',
        data: { token, password },
        overrideAccess: true,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Reset failed'
      return NextResponse.json({ error: message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Password reset successfully' })
  } catch (err) {
    console.error('[reset-password]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
