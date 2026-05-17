import { getActiveDealers } from '@/lib/payload'
import { COPY } from '@/lib/i18n/copy'
import {
  BrotherhoodDirectoryClient,
  type DealerRow,
} from './BrotherhoodDirectoryClient'

// Match the home page revalidate cadence — dealers change rarely but admins
// should not have to wait long for a publish to surface on the public page.
export const revalidate = 60

// Server-side metadata uses EN by default. The language toggle on the
// rendered page is client-only, so we pick a single canonical SEO copy here
// (mirrors how /heritage and other static surfaces handle metadata).
export async function generateMetadata() {
  const meta = COPY.EN.seo.brotherhood
  return {
    title: meta.title,
    description: meta.description,
  }
}

export default async function BrotherhoodPage() {
  const docs = await getActiveDealers()

  // Normalise the Payload row shape to the client component's expected
  // contract. Defensive: if any required string is missing on a row, drop it.
  const dealers: DealerRow[] = docs
    .filter(
      (d: any) =>
        typeof d?.name === 'string' &&
        typeof d?.area === 'string' &&
        typeof d?.address === 'string' &&
        typeof d?.whatsapp_number === 'string' &&
        typeof d?.google_maps_query === 'string',
    )
    .map((d: any) => ({
      id: d.id,
      name: d.name,
      area: d.area,
      address: d.address,
      whatsapp_number: d.whatsapp_number,
      google_maps_query: d.google_maps_query,
      operating_hours: d.operating_hours ?? undefined,
      languages: d.languages ?? undefined,
      specialisations: d.specialisations ?? undefined,
    }))

  return <BrotherhoodDirectoryClient dealers={dealers} />
}
