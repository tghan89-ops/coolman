// One-shot: restore the original hero image of "12″/300mm GHOST Series"
// after an accidental admin overwrite. Re-uploads source/media/4aa962152417.png
// (or reuses the existing Media row by filename), then sets product.image to it.
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const { getPayload } = await import('payload')
const { default: config } = await import('@payload-config')
const payload = await getPayload({ config })

const SKU = '12″_300MM_GHOST_SERIES'
const FILENAME = '4aa962152417.png'
const ALT = '12″/300mm GHOST Series'

const found = await payload.find({
  collection: 'products',
  where: { sku: { equals: SKU } },
  limit: 1,
  depth: 0,
})
if (!found.docs.length) { console.error('product not found:', SKU); process.exit(1) }
const product = found.docs[0]
console.log(`product: ${product.name} (id=${product.id}) — current image=${product.image}`)

// Find or upload media by filename
const ex = await payload.find({
  collection: 'media',
  where: { filename: { equals: FILENAME } },
  limit: 1,
  depth: 0,
})
let mediaId
if (ex.docs.length) {
  mediaId = ex.docs[0].id
  console.log(`reusing existing media row id=${mediaId} (filename=${FILENAME})`)
} else {
  const buf = await readFile(path.join(HERE, 'source', 'media', FILENAME))
  const created = await payload.create({
    collection: 'media',
    data: { alt: ALT },
    file: { data: buf, name: FILENAME, mimetype: 'image/png', size: buf.length },
  })
  mediaId = created.id
  console.log(`uploaded new media id=${mediaId} (filename=${FILENAME})`)
}

await payload.update({
  collection: 'products',
  id: product.id,
  data: { image: mediaId },
})
console.log(`product.image set to ${mediaId} — done.`)
process.exit(0)
