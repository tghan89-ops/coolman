import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

async function getSession(req: NextRequest) {
  const payload = await getPayload({ config })
  const session = await payload.auth({ headers: req.headers as any })
  const user = (session as any)?.user
  return { payload, user }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { payload, user } = await getSession(req)
  if (!user || user.collection !== 'contractors')
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: { label?: string; addressText?: string; isDefault?: boolean } = {}
  try { body = await req.json() } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }) }

  const next: Record<string, unknown> = {}
  if (typeof body.label === 'string') {
    const trimmed = body.label.trim()
    if (!trimmed) return NextResponse.json({ error: 'label_required' }, { status: 400 })
    if (trimmed.length > 40) return NextResponse.json({ error: 'label_too_long' }, { status: 400 })
    next.label = trimmed
  }
  if (typeof body.addressText === 'string') {
    const trimmed = body.addressText.trim()
    if (!trimmed) return NextResponse.json({ error: 'address_required' }, { status: 400 })
    if (trimmed.length > 500) return NextResponse.json({ error: 'address_too_long' }, { status: 400 })
    next.addressText = trimmed
  }
  if (typeof body.isDefault === 'boolean') next.isDefault = body.isDefault

  if (Object.keys(next).length === 0)
    return NextResponse.json({ error: 'no_fields' }, { status: 400 })

  try {
    const updated = await payload.update({
      collection: 'addresses',
      id,
      data: next,
      overrideAccess: false,
      user,
    })
    return NextResponse.json({
      id: (updated as any).id,
      label: (updated as any).label,
      addressText: (updated as any).addressText,
      isDefault: Boolean((updated as any).isDefault),
    })
  } catch {
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { payload, user } = await getSession(req)
  if (!user || user.collection !== 'contractors')
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  try {
    await payload.delete({ collection: 'addresses', id, overrideAccess: false, user })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'delete_failed' }, { status: 500 })
  }
}
