import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function PUT(req: NextRequest) {
  const payload = await getPayload({ config })
  const session = await payload.auth({ headers: req.headers as any })
  const user = (session as any)?.user
  if (!user || user.collection !== 'contractors')
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: { deliveryAddress?: string } = {}
  try { body = await req.json() } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }) }

  const next: Record<string, unknown> = {}
  if (typeof body.deliveryAddress === 'string') {
    const trimmed = body.deliveryAddress.trim()
    if (trimmed.length > 500) return NextResponse.json({ error: 'address_too_long' }, { status: 400 })
    next.deliveryAddress = trimmed
  }
  if (Object.keys(next).length === 0)
    return NextResponse.json({ error: 'no_fields' }, { status: 400 })

  const updated = await payload.update({
    collection: 'contractors',
    id: user.id,
    data: next,
    overrideAccess: false,
    user,
  })

  return NextResponse.json({
    id: updated.id,
    deliveryAddress: (updated as any).deliveryAddress ?? '',
  })
}
