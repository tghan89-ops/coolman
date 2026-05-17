import { getPayload } from 'payload'
import config from '@payload-config'

async function run() {
  const payload = await getPayload({ config })
  const posts = await payload.find({ collection: 'posts', limit: 20, depth: 0 })
  console.log('TOTAL:', posts.totalDocs)
  for (const p of posts.docs as any[]) {
    console.log(
      `${p.slug} | hero:${p.heroImage ? 'Y(' + p.heroImage + ')' : 'no'} | status:${p.status} | contentLen:${(p.content || '').length}`,
    )
  }
  process.exit(0)
}
run().catch((e) => {
  console.error(e)
  process.exit(1)
})
