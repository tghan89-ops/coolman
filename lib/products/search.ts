// Free-text catalogue search matching. Kept pure and separate from the
// ProductsClient component so the match rule can be unit-tested in isolation.
//
// Rule (locked with GH 2026-05-30): a query matches on product NAME or
// SKU/model code, case-insensitive and trimmed. B2B buyers often search by the
// code (e.g. "PDA") as readily as by the descriptive name.

export interface SearchableProduct {
  name?: string | null
  sku?: string | null
}

/**
 * Returns true when the product matches the free-text query.
 * An empty/whitespace query matches everything — the caller decides whether to
 * apply the filter at all.
 */
export function productMatchesQuery(p: SearchableProduct, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase()
  if (!q) return true
  const name = (p.name ?? '').toLowerCase()
  const sku = (p.sku ?? '').toLowerCase()
  return name.includes(q) || sku.includes(q)
}
