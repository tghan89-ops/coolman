# Product Families (size variants) — pilot design

**Date:** 2026-06-14
**Status:** Design approved (mockup signed off). Pending: real pilot SKUs from the in-progress SKU update.
**Scope:** Pilot on **one family only**. Opt-in per product. Reversible.

## Summary

Combine SKUs that are the same blade in different sizes (e.g. HS230P / HS300P / HS350P)
into a single product page with a size switcher. Tapping a size swaps the photo, price,
and specs with no page reload, and updates the address to `?size=NNN` so a size is shareable.
On the catalogue grid the family shows as **one card** with a "from RM X" price instead of
three near-identical cards.

## The one decision that shapes everything: cheap path

Whatever size the customer picks, the order must still resolve to **one concrete SKU at one
concrete price**. We satisfy that by keeping each size as its own `Products` record exactly as
today, and only **grouping siblings for display**. The size switcher swaps presentation; the
order action submits the selected size's existing SKU.

Consequence: **cart, orders, price snapshots, duplicate detection, admin order tables, and
analytics are untouched.** Confirmed against `collections/Carts.ts` and `collections/Orders.ts`
— both reference a single `product` relationship and snapshot its price at submit. Nothing in
that path changes.

Rejected alternative — true parent/child variant records — would force cart and orders to store
`(product + variant)`, touching checkout, price snapshots, duplicate logic, admin, analytics, and
a data migration. Not pilot-safe, not easily reversible. Out of scope.

## Opt-in & safety (the spine of the pilot)

The feature is **opt-in per product** via a new `family` tag:

- A product with **no** `family` value behaves exactly as it does today — single card, single
  product page, no switcher. ~224 existing products are unaffected.
- Tag exactly the sizes of **one** family with the same `family` value → only those become a
  grouped family.
- **Rollback** = clear the `family` tags. Every size reverts to a standalone product. No
  migration, no data loss, no code revert.

## Data model change

One new field on `collections/Products.ts`. No new collection.

- `family` — text (a short shared code, e.g. `HS-P`) **or** a self-relationship to a designated
  "primary" sibling. **Decision: short text code**, simplest for Alan to set and to group on.
  Indexed for grouping queries.
- The **primary (default) size** = the smallest `diameterMm` within a family. No extra field
  needed for the pilot. (A future "mark as default size" field is a later refinement, not now.)

### Shared vs per-size fields

When a family is displayed, these come from the family and **do not change** when switching size:

- `name` (the family/series name — the stem, e.g. "High-Speed Pro")
- `description` / `descriptionBM`
- `materials`, `applications`
- `bondType`, `machineTier`
- **videos** — *family-level, and may be multiple per family.* Current schema has a single
  `youtubeUrl` text field. **Add `familyVideos` (array of { url, titleEN, titleBM })**, read from
  the primary sibling. `youtubeUrl` stays for ungrouped products.
- `documents`

These are **per-size** and swap when the customer taps a size:

- `image` (the photo)
- `listPrice` → and the derived contractor effective price
- `sku` (this is what the order submits)
- `diameter` / `diameterMm`
- `maxRPM`, `segmentHeight`, `arborSize`

> Shared-field source of truth: read from the family's **primary (smallest) sibling**. If two
> siblings disagree on a shared field, the primary wins (and that's a content error for Alan to
> fix, not a code branch).

## Catalogue behaviour (`/products`)

- A tagged family **collapses to one card**: image + "from RM {min listPrice}" using the smallest
  size. Badge shows the size count. Ungrouped products render exactly as now.
- **Diameter filter:** a family card appears if **any** of its sizes matches the active diameter
  bucket, and the click opens the product page **pre-selected to the matched size** (`?size=`).
- **Filter counts** (materials / applications / diameter chips in the sidebar): count a family
  **once** per matching attribute, not once per size, so the counts match the collapsed grid.
  (Today `app/(frontend)/products/page.tsx` counts per-SKU; grouping must dedupe by family.)

## Product page behaviour (`/products/[id]`)

- Server also loads the family's siblings (by `family` tag) alongside the requested product.
- Lands on the **smallest** size by default; if arrived via a diameter filter / `?size=NNN`,
  lands on that size.
- **Size pills** (confirmed UI): a horizontal row, thumb-friendly for field use, all sizes visible.
- Tapping a size, **client-side, no reload**: swaps photo (scaled to look its physical size),
  price + contractor price, SKU, and the per-size spec rows; updates the address to `?size=NNN`.
- **Order / add-to-cart submits the selected size's existing SKU** — the order plumbing is
  unaware anything was grouped.
- Every existing per-SKU URL keeps working (each size record still has its own `/products/[id]`);
  visiting one renders the family page pre-selected to that size.

## Files touched (all additive)

| # | File | Change |
|---|------|--------|
| 1 | `collections/Products.ts` | Add `family` (indexed text) + `familyVideos` array |
| 2 | `lib/payload.ts` (`getProducts`, `getProductById`) | Group siblings into families; load siblings for a product |
| 3 | `app/(frontend)/products/page.tsx` | Collapse families to one card; dedupe filter counts by family |
| 4 | `components/products/ProductsClient.tsx` | Render one card per family ("from RM X", size-count badge) |
| 5 | `app/(frontend)/products/[id]/page.tsx` | Pass family siblings to the client |
| 6 | `components/products/ProductDetailClient.tsx` | Size-pill switcher; swap photo/price/specs/SKU; `?size=` sync |

## Out of scope (pilot)

- No parent/child variant records, no `(product+variant)` in cart/orders, no migration.
- No change to ordering, pricing, discount, duplicate-detection, admin order tables, analytics.
- No grouping of any product not explicitly tagged.
- More than one pilot family (expand only after the first family is proven live).

## Open item (the only blank)

- **Which real family** is the pilot, and its real SKUs / prices / photos. Filled in after the
  in-progress SKU update lands; candidate to be picked by scanning the live catalogue for the
  cleanest "same blade, multiple diameters, separate SKUs" group.

## Verification plan (when built)

1. Tag one real family; confirm its card collapses to "from RM X" and ungrouped products are
   visually unchanged.
2. On the family page, switch sizes — photo/price/specs/SKU update, address shows `?size=`, no reload.
3. Place a test order on a non-smallest size → the order row records **that** size's SKU and price
   snapshot (prove the order plumbing is untouched).
4. Diameter-filter to a mid size → family card appears, opens pre-selected to that size.
5. Clear the `family` tags → the three sizes revert to standalone cards/pages (rollback proof).
