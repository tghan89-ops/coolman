// Backfill products.diameterMm by parsing size from `diameter` text + product name.
// Run with:  pnpm tsx --env-file=.env.local scripts/migration/backfill-diameter.mjs
//
// Parsing rules (first match wins):
//   1. "<N>mm" in diameter or name  -> N
//   2. "<N>″" or "<N>\"" in name    -> N * 25.4
//   3. "<N>in" / "<N> inch" in name -> N * 25.4
//   else null (machines, accessories with no nominal size)

const { getPayload } = await import('payload')
const { default: config } = await import('@payload-config')
const payload = await getPayload({ config })

function parseMm(diameterText, name) {
  const sources = [diameterText, name].filter(Boolean)
  for (const s of sources) {
    const mm = s.match(/(\d+(?:\.\d+)?)\s*mm\b/i)
    if (mm) return Math.round(parseFloat(mm[1]))
  }
  for (const s of sources) {
    const inch = s.match(/(\d+(?:\.\d+)?)\s*[″"]/)
    if (inch) return Math.round(parseFloat(inch[1]) * 25.4)
  }
  for (const s of sources) {
    const inch2 = s.match(/(\d+(?:\.\d+)?)\s*(?:in|inch)\b/i)
    if (inch2) return Math.round(parseFloat(inch2[1]) * 25.4)
  }
  return null
}

const all = await payload.find({ collection: 'products', limit: 1000, depth: 0 })
console.log(`scanning ${all.docs.length} products...`)

let filled = 0
let nulled = 0
for (const p of all.docs) {
  const mm = parseMm(p.diameter, p.name)
  await payload.update({
    collection: 'products',
    id: p.id,
    data: { diameterMm: mm },
  })
  if (mm == null) nulled++
  else filled++
}

console.log(`done. with size: ${filled}, no size: ${nulled}`)
process.exit(0)
