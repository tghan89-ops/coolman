// One-off: delete Search Log rows whose `query` is blank. These rows were
// produced by an earlier bug where landing on /products (no filters active)
// would still write a log entry. Safe to re-run — only matches empty queries.
//
// Run with: pnpm cleanup-empty-search-logs
import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  const payload = await getPayload({ config })

  const empty = await payload.find({
    collection: 'searchLogs',
    where: { query: { equals: '' } },
    limit: 1000,
    overrideAccess: true,
  })

  console.log(`Found ${empty.totalDocs} empty-query rows.`)
  if (empty.totalDocs === 0) {
    process.exit(0)
  }

  let deleted = 0
  for (const doc of empty.docs) {
    await payload.delete({
      collection: 'searchLogs',
      id: doc.id,
      overrideAccess: true,
    })
    deleted++
  }
  console.log(`Deleted ${deleted} empty-query rows.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
