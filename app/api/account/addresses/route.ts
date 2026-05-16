import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const MAX = 5

async function getSession(req: NextRequest) {
  const payload = await getPayload({ config })
  const session = await payload.auth({ headers: req.headers as any })
  const user = (session as any)?.user
  return { payload, user }
}

export async function GET(req: NextRequest) {
  const { payload, user } = await getSession(req)
  if (!user || user.collection !== 'contractors')
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const result = await payload.find({
    collection: 'addresses',
    where: { contractor: { equals: user.id } },
    sort: '-isDefault,-updatedAt',
    limit: MAX,
    overrideAccess: false,
    user,
  })

  return NextResponse.json({
    addresses: result.docs.map((a: any) => ({
      id: a.id,
      label: a.label,
      addressText: a.addressText,
      isDefault: Boolean(a.isDefault),
      updatedAt: a.updatedAt,
    })),
    cap: MAX,
  })
}

export async function POST(req: NextRequest) {
  const { payload, user } = await getSession(req)
  if (!user || user.collection !== 'contractors')
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: { label?: string; addressText?: string; isDefault?: boolean } = {}
  try { body = await req.json() } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }) }

  const label = (body.label ?? '').trim()
  const addressText = (body.addressText ?? '').trim()
  if (!label) return NextResponse.json({ error: 'label_required' }, { status: 400 })
  if (label.length > 40) return NextResponse.json({ error: 'label_too_long' }, { status: 400 })
  if (!addressText) return NextResponse.json({ error: 'address_required' }, { status: 400 })
  if (addressText.length > 500) return NextResponse.json({ error: 'address_too_long' }, { status: 400 })

  try {
    const created = await payload.create({
      collection: 'addresses',
      data: {
        contractor: user.id,
        label,
        addressText,
        isDefault: Boolean(body.isDefault),
      } as any,
      overrideAccess: false,
      user,
    })
    return NextResponse.json({
      id: (created as any).id,
      label: (created as any).label,
      addressText: (created as any).addressText,
      isDefault: Boolean((created as any).isDefault),
    })
  } catch (e: any) {
    const msg = String(e?.message ?? '')
    if (msg.includes('address_cap_reached'))
      return NextResponse.json({ error: 'address_cap_reached', cap: MAX }, { status: 409 })
    return NextResponse.json({ error: 'create_failed' }, { status: 500 })
  }
}
