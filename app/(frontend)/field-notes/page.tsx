import { getPublishedPosts } from '@/lib/payload'
import { COPY } from '@/lib/i18n/copy'
import { FieldNotesClient, type FieldNoteRow } from './FieldNotesClient'

// Match the public ISR cadence used by Brotherhood / Resources. Editors should
// see a publish surface within ~1 minute without manual revalidation.
export const revalidate = 60

export async function generateMetadata() {
  // Match the existing /heritage convention: pick canonical EN copy on the
  // server, let the on-page language toggle handle BM.
  const meta = COPY.EN.seo.fieldNotes
  return {
    title: meta.title,
    description: meta.description,
  }
}

// Trim the Payload row to the honest contract the client consumes. Anything
// not on this list never leaves the server boundary, so we never accidentally
// ship unexpected fields to the browser.
function normalisePost(d: any): FieldNoteRow | null {
  if (!d || typeof d.slug !== 'string' || typeof d.title !== 'string') return null
  return {
    id: String(d.id ?? d.slug),
    slug: d.slug,
    title: d.title,
    titleBM: typeof d.titleBM === 'string' ? d.titleBM : null,
    excerpt: typeof d.excerpt === 'string' ? d.excerpt : null,
    excerptBM: typeof d.excerptBM === 'string' ? d.excerptBM : null,
    application: typeof d.application === 'string' ? d.application : null,
    applicationBM: typeof d.applicationBM === 'string' ? d.applicationBM : null,
    noteNumber: typeof d.noteNumber === 'string' ? d.noteNumber : null,
    readTimeMin: typeof d.readTimeMin === 'number' ? d.readTimeMin : null,
    publishedAt:
      typeof d.publishedAt === 'string'
        ? d.publishedAt
        : d.publishedAt instanceof Date
          ? d.publishedAt.toISOString()
          : null,
    heroImageUrl:
      d?.heroImage && typeof d.heroImage === 'object' && typeof d.heroImage.url === 'string'
        ? d.heroImage.url
        : null,
    heroImageAlt:
      d?.heroImage && typeof d.heroImage === 'object' && typeof d.heroImage.alt === 'string'
        ? d.heroImage.alt
        : null,
  }
}

export default async function FieldNotesIndexPage() {
  const docs = await getPublishedPosts(48)
  const posts: FieldNoteRow[] = docs
    .map(normalisePost)
    .filter((p): p is FieldNoteRow => p !== null)

  return <FieldNotesClient posts={posts} />
}
