import { getGlobal } from '@/lib/payload'
import { COPY } from '@/lib/i18n/copy'
import { ApplicationsClient } from '@/components/pages/ApplicationsClient'

export const revalidate = 60

export async function generateMetadata() {
  // No dedicated `seo.applications` block in copy.ts — applications is the
  // catalogue surface for "what to cut," so we lean on the catalogue SEO meta.
  const meta = COPY.EN.seo.catalogue
  return {
    title: meta.title,
    description: meta.description,
  }
}

export default async function ApplicationsPage() {
  const data = await getGlobal('applications-page')
  return <ApplicationsClient initialData={data} />
}
