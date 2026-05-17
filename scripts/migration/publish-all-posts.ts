import { getPayload } from 'payload'
import config from '@payload-config'

async function run() {
  const payload = await getPayload({ config })
  const drafts = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'draft' } },
    limit: 100,
    depth: 0,
  })
  console.log(`Found ${drafts.totalDocs} draft posts to publish.`)
  let ok = 0
  for (const p of drafts.docs as any[]) {
    await payload.update({
      collection: 'posts',
      id: p.id,
      data: { status: 'published', publishedAt: p.publishedAt || new Date().toISOString() },
    })
    console.log(`  published: ${p.slug}`)
    ok++
  }
  console.log(`Done. published=${ok}`)
  process.exit(0)
}
run().catch((e) => {
  console.error(e)
  process.exit(1)
})
