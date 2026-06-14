// Free-text catalogue search matching. Kept pure and separate from the
// ProductsClient component so the match rule can be unit-tested in isolation.
//
// Rule (revised 2026-06-14): a query matches against a single per-product
// "haystack" built from NAME + SKU + CATEGORY + every MATERIAL name + every
// APPLICATION name, lowercased and joined. B2B buyers search by material
// ("granite"), application ("core drilling") and category ("core bits") as
// readily as by name or SKU/code — all of which returned zero hits before.
//
// WHY token-AND, not phrase: the query is split into whitespace tokens and
// EVERY token must be found somewhere in the haystack (order-independent). So
// "granite core" matches a product whose category is "Core Bits" and whose
// material is "Granite", even though that exact phrase appears nowhere.
//
// WHY description is excluded: description is deliberately NOT part of the
// haystack — it is not passed to the client (it would blow the ~2MB slim-cache
// budget). Any `description` property that slips through is ignored on purpose.
//
// WHY synonyms, not fuzzy: each token is expanded through a curated trade-
// language map (rebar -> reinforced concrete, simen -> concrete, etc.). A token
// matches if ANY of its alternatives is a haystack substring. There is NO
// fuzzy/Levenshtein matching — misspellings do not match unless mapped.

import { expandToken } from './search-synonyms'

export interface SearchableProduct {
  name?: string | null
  sku?: string | null
  category?: string | null
  // Element union includes `undefined` so the catalogue's ProductRelation[]
  // (which can hold undefined) is assignable at the call site without a cast.
  materials?: Array<{ name?: string | null } | string | number | null | undefined>
  applications?: Array<{ name?: string | null } | string | number | null | undefined>
}

// A populated relationship is an object with a `name`; an unpopulated one is a
// bare string/number; either may be null. Mirror lib/payload.ts relationName.
function relName(r: { name?: string | null } | string | number | null | undefined): string {
  if (r == null) return ''
  if (typeof r === 'object') return r.name ?? ''
  return String(r)
}

/**
 * Returns true when the product matches the free-text query.
 * An empty/whitespace query matches everything — the caller decides whether to
 * apply the filter at all.
 */
export function productMatchesQuery(p: SearchableProduct, rawQuery: string): boolean {
  const tokens = rawQuery.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return true

  const materials = Array.isArray(p.materials) ? p.materials : []
  const applications = Array.isArray(p.applications) ? p.applications : []

  // Single haystack per product. Double-space separator keeps adjacent field
  // values from accidentally fusing into a spurious substring.
  const haystack = [
    p.name ?? '',
    p.sku ?? '',
    p.category ?? '',
    ...materials.map(relName),
    ...applications.map(relName),
  ]
    .join('  ')
    .toLowerCase()

  // Token-AND: every token must match. A token matches if itself OR any of its
  // synonym alternatives is a substring of the haystack.
  return tokens.every((token) =>
    expandToken(token).some((alt) => haystack.includes(alt)),
  )
}
