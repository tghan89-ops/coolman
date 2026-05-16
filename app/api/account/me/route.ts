import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config })
  const session = await payload.auth({ headers: req.headers as any })
  const user = (session as any)?.user
  if (!user || user.collection !== 'contractors')
    return NextResponse.json({ user: null }, { status: 401 })

  const full = await payload.findByID({
    collection: 'contractors',
    id: user.id,
    overrideAccess: false,
    user,
    depth: 0,
  })

  return NextResponse.json({ user: full })
}
