import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendVerificationEmail } from '@/lib/auth/verify-email'

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return 'unknown'
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { companyName, email, phone, deliveryAddress, password } = body

    if (!companyName || !email || !password) {
      return NextResponse.json({ error: 'companyName, email, and password are required' }, { status: 400 })
    }

    const ip = getClientIp(req)
    const payload = await getPayload({ config })

    // Read rate-limit setting
    const settings = await payload.findGlobal({ slug: 'settings', overrideAccess: true })
    const rateLimit = (settings as any)?.registration_rate_limit_per_ip_per_day ?? 5

    // Count recent registrations from this IP
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const recent = await payload.find({
      collection: 'contractors',
      where: {
        registration_ip: { equals: ip },
        createdAt: { greater_than: cutoff },
      },
      limit: 0,
      overrideAccess: true,
    })

    if (recent.totalDocs >= rateLimit) {
      return NextResponse.json(
        { error: 'Too many registrations from this network. Please try again tomorrow.' },
        { status: 429 },
      )
    }

    // Create contractor
    const contractor = await payload.create({
      collection: 'contractors',
      data: {
        companyName,
        email,
        phone: phone ?? '',
        deliveryAddress: deliveryAddress ?? '',
        password,
        registration_ip: ip,
      },
      overrideAccess: true,
    })

    // Trigger verification email (fire-and-forget)
    sendVerificationEmail(
      contractor.id,
      contractor.email as string,
      (contractor as any).companyName ?? '',
    ).catch(err => console.error('[register] verification email failed:', err))

    return NextResponse.json({ id: contractor.id, email: contractor.email }, { status: 201 })
  } catch (err: any) {
    console.error('[register]', err)
    if (err?.message?.toLowerCase().includes('duplicate') || err?.status === 409) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}
