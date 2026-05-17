import { NextResponse } from 'next/server'
import { getPublishedPostCount } from '@/lib/payload'

// Tiny availability probe used by the public Header to decide whether to show
// the Field Notes nav link. The link only surfaces once at least three notes
// are published — so the header doesn't ship to an empty section. Same ISR
// cadence as the public pages.
export const revalidate = 60

export async function GET() {
  const count = await getPublishedPostCount()
  return NextResponse.json(
    { count },
    {
      // Allow CDN caching with the same window as the public pages. A short
      // stale-while-revalidate lets the link appear within seconds of a
      // publish without the editor needing to nudge anything.
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    },
  )
}
