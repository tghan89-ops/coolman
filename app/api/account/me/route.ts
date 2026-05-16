import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config })
  const session = await payload.auth({ headers: req.headers as any })
  const user = (session as any)?.user
  if (!user || user.collection !== 'contractors')
    return NextResponse.json({ user: null }, { status: 401 })

  // Coerce id (see /api/account/profile for rationale — string/number mismatch
  // on Postgres IDs makes access-controlled reads silently miss the row).
  const contractorId: string | number =
    typeof user.id === 'string' && /^\d+$/.test(user.id) ? Number(user.id) : user.id

  const full = await payload.findByID({
    collection: 'contractors',
    id: contractorId,
    overrideAccess: true,
    depth: 0,
  })

  return NextResponse.json({ user: full })
}
