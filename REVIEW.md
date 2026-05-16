# Code Review — Payload CMS Live Preview

**Reviewed:** 2026-05-10
**Depth:** Standard (all files read in full)

---

## Critical

### CR-01: Seed script maps `product.price` to `listPrice` — field name mismatch in source data

**File:** `scripts/seed.ts:27`

The seed script does `listPrice: product.price` because the source data type (`lib/data/products.ts`) uses `price` as the field name, not `listPrice`. This is intentional bridging code, but it means the source of truth for product data still uses the old `price` field name. If the seed script is ever modified to spread the product object directly (e.g., `data: { ...product }`), the `listPrice` field will be silently missing and `price` will be ignored by Payload — every product will fail to create (field is `required: true`).

**Fix:** Rename the field in `lib/data/products.ts` from `price` to `listPrice` so the source type and the Payload schema agree. Update the `Product` interface, all 13 product objects, the `push` call on line 301, and the seed test. This eliminates the silent mismatch.

```typescript
// lib/data/products.ts — rename in Product interface
export interface Product {
  // ...
  listPrice: number  // was: price
  // ...
}

// seed.ts then becomes clean:
data: {
  // ...
  listPrice: product.listPrice,
}
```

---

### CR-02: `ProductsClient` does not use `useLivePreview` — products list will not update in Live Preview

**File:** `components/products/ProductsClient.tsx:14-15`

Every other client component calls `useLivePreview`. `ProductsClient` instead uses `useState(initialProducts)` and never subscribes to Live Preview messages. When an admin edits a product in the Payload admin panel and opens Live Preview for the products listing page, the iframe will show stale data. This breaks the core requirement of the feature.

**Fix:**

```typescript
// Add the import
import { useLivePreview } from '@payloadcms/live-preview-react'

// Replace useState with useLivePreview
export function ProductsClient({ initialProducts }: { initialProducts: any[] }) {
  const { data: products } = useLivePreview({
    initialData: initialProducts,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL!,
    depth: 1,
  })
  // Remove: const [products] = useState(initialProducts)
```

---

### CR-03: `payload.config.ts` — `serverURL` will be `undefined` in production if env var is missing, silently breaking Live Preview

**File:** `payload.config.ts:51`

```typescript
serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
```

Payload's `buildConfig` types `serverURL` as `string | undefined`. If `NEXT_PUBLIC_SERVER_URL` is not set (e.g., during a Vercel preview deployment where the env var name differs), `serverURL` will be `undefined`. Payload will not error — it will silently operate without a server URL. The Live Preview `url` callbacks in every global and collection depend on `process.env.NEXT_PUBLIC_SERVER_URL` constructing correct URLs. If it resolves to `undefined`, Live Preview iframe URLs will be `undefined/products/123`, which is a broken URL.

**Fix:**

```typescript
serverURL: process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000',
```

And confirm `NEXT_PUBLIC_SERVER_URL` is set in Vercel project settings.

---

## Important

### WR-01: `ShibuyaClient` — field name mismatches between the global schema and the client component

**Files:** `globals/ShibuyaPage.ts` vs `components/pages/ShibuyaClient.tsx`

The `ShibuyaPage` global defines these field names:
- `craftsmanship.sectionLabel` (line 35)
- `craftsmanship.title` (line 36)
- `craftsmanship.body` (line 37)
- `inAction.title` (line 87)
- `inAction.body` (line 89)
- No `eyebrow`, `headline`, `ctaLabel`, `ctaHref` fields in `inAction` or `support`
- No `primaryCtaHref` / `secondaryCtaHref` fields in `cta`

But `ShibuyaClient.tsx` reads:
- `data.craftsmanship?.eyebrow` (line 48) — field is actually `sectionLabel`
- `data.craftsmanship?.headline` (line 49) — field is actually `title`
- `data.inAction?.eyebrow` (line 81) — not in schema
- `data.inAction?.headline` (line 82) — field is actually `title`
- `data.inAction?.ctaLabel` / `ctaHref` (lines 86-87) — not in schema
- `data.support?.eyebrow` / `headline` (lines 91-92) — not in schema (schema has `title` directly)
- `data.cta?.primaryCtaHref` / `secondaryCtaHref` (lines 118-120) — not in schema

Because the client has hardcoded fallback strings for all of these, the page will render correctly using fallbacks — but Payload-managed content for these fields will never appear. The admin can edit `craftsmanship.sectionLabel` in Payload all day; the page will always show the hardcoded fallback "CRAFTSMANSHIP".

**Fix:** Either update `ShibuyaClient.tsx` to use the correct field paths from the schema, or rename the schema fields to match the client. The schema is the source of truth, so fix the client:

```typescript
// Craftsmanship
const craftEyebrow = data.craftsmanship?.sectionLabel ?? 'CRAFTSMANSHIP'
const craftHeadline = data.craftsmanship?.title ?? 'Built to Last Generations'
const craftBody = data.craftsmanship?.body ?? '...'

// InAction — these fields don't exist in the schema at all.
// Add them to ShibuyaPage.ts, or remove the Payload reads and keep static values.

// Support — schema has support.title directly, not support.headline
const supportHeadline = data.support?.title ?? 'We Stand Behind Every Machine'
```

---

### WR-02: `next.config.mjs` — `typescript.ignoreBuildErrors: true` masks type errors at build time

**File:** `next.config.mjs:6`

This setting means TypeScript errors will not fail the Vercel build. This is common during scaffolding, but it means a future refactor that introduces a type mismatch (e.g., reading `product.price` instead of `product.listPrice`) will deploy without a compile-time catch. Given that the `price` vs `listPrice` mismatch in CR-01 already exists, this flag is actively suppressing a signal.

**Fix:** Once `payload-types.ts` is generated and the `price`→`listPrice` rename in CR-01 is complete, remove this flag:

```javascript
// next.config.mjs — remove this block
typescript: {
  ignoreBuildErrors: true,
},
```

---

### WR-03: `ContactClient` — form submit handler is a no-op stub

**File:** `components/pages/ContactClient.tsx:36-42`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)
  await new Promise(resolve => setTimeout(resolve, 1000))
  setSubmitted(true)
  setIsSubmitting(false)
}
```

The form collects name, company, email, phone, and message but does not send any data anywhere. It simulates a 1-second delay then shows a success screen. If this page goes live, customers will think their message was sent when nothing was received.

**Fix:** Wire the form to an actual API route (e.g., `/api/contact`) that sends the form data via Resend before this page goes live. At minimum, add a visible "coming soon" or "call us directly" note so users aren't misled.

---

### WR-04: `ResourcesClient` — download and video buttons are non-functional stubs

**File:** `components/pages/ResourcesClient.tsx:127-134`

The "Download PDF" and "Watch Video" buttons are `<button>` elements with no `onClick` handler and no `href`. Clicking them does nothing. Like the contact form, this creates a misleading UI — users will attempt to click and nothing will happen.

**Fix:** Gate these buttons on whether a real file/URL exists, or replace with a "Coming soon" state:

```typescript
// Only render the action button if the resource has an actual file/URL
{resource.type === 'download' && resource.file?.url ? (
  <a href={resource.file.url} download className="...">Download PDF</a>
) : resource.type === 'video' && resource.youtubeUrl ? (
  <a href={resource.youtubeUrl} target="_blank" rel="noopener noreferrer" className="...">Watch Video</a>
) : (
  <span className="text-sm text-ink-muted">Coming soon</span>
)}
```

---

## Minor

### IN-01: `Products.ts` collection — `category` options list is hardcoded, violates project rule

**File:** `collections/Products.ts:38-43`

The CLAUDE.md hard rule states: "Never hardcode any option list. All lists (materials, applications, machine tiers, volume brackets, categories) live in Payload CMS. Admin-editable."

The `category`, `bondType`, `recommendedMaterials`, `applications`, and `recommendedMachinePower` fields all use hardcoded `options` arrays in the Payload schema. In Payload v3 there is no built-in dynamic options feature (options come from a separate collection), so this is a known v1 constraint. However, if the list ever needs to change, it requires a code deploy.

**Note:** This is acceptable for V1, but log it in LEARNINGS.md under "Frontend-editability exceptions" as required by CLAUDE.md.

---

### IN-02: `HomePageClient` — product showcase section uses hardcoded static data, not Payload products

**File:** `components/home/HomePageClient.tsx:293-314`

The "Our Products" section on the home page renders three hardcoded products (`Granite Blade`, `Concrete Blade`, `Tile Blade`) with hardcoded prices (`From RM 89`, etc.) rather than fetching the first 3 products from Payload. These prices will be out of sync with the actual `listPrice` values in Payload.

**Fix:** Either pass the first few products from the server component as an additional prop, or remove the price strings and link directly to the catalogue.

---

### IN-03: `ShibuyaPage.ts` — Shibuya machine `price` field is a display string, not a number

**File:** `globals/ShibuyaPage.ts:75`

The machine model `price` field is typed as `text` (e.g., `"RM 4,500"`). This is a display string, not a numeric value. If any future logic needs to compare or compute from this, it will require string parsing. Consider using `number` type and formatting on render, consistent with how `listPrice` is handled in the Products collection.

This is minor for V1 since Shibuya machines are not orderable through the system, but worth flagging.

---

### IN-04: `lib/payload.ts` — `getGlobal` accepts any string slug without validation

**File:** `lib/payload.ts:58-61`

```typescript
export async function getGlobal(slug: string): Promise<any> {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: slug as any })
}
```

The `slug as any` cast bypasses Payload's type-safe global slug union. If a caller passes a typo (e.g., `'home_page'` instead of `'home-page'`), it will fail at runtime with no compile-time warning. This is intentional for now since `payload-types.ts` is not yet generated, but worth fixing once types are available:

```typescript
// After payload-types.ts is generated:
import type { GlobalSlug } from '@/payload-types'
export async function getGlobal(slug: GlobalSlug): Promise<any> {
```

---

### IN-05: `scripts/seed.ts` — `process.exit(0)` inside the `seed()` function prevents clean shutdown

**File:** `scripts/seed.ts:37`

Calling `process.exit(0)` directly inside an async function prevents any cleanup (Payload connection teardown, pending async operations). This can cause "connection terminated" errors in Postgres logs. Prefer letting the function return and exiting from the top-level caller.

```typescript
// seed.ts
async function seed() {
  // ... seed logic, remove process.exit(0) here
}

seed()
  .then(() => { console.log('Done.'); process.exit(0) })
  .catch((err) => { console.error(err); process.exit(1) })
```

---

## Approved

Files with no issues found:

- `collections/Users.ts`
- `collections/Media.ts`
- `globals/HomePage.ts`
- `globals/ApplicationsPage.ts`
- `globals/ResourcesPage.ts`
- `globals/ContactPage.ts`
- `app/page.tsx`
- `app/products/page.tsx`
- `app/products/[id]/page.tsx`
- `app/applications/page.tsx`
- `app/resources/page.tsx`
- `app/contact/page.tsx`
- `app/shibuya/page.tsx`
- `components/home/HomePageClient.tsx` (aside from IN-02)
- `components/products/ProductDetailClient.tsx`
- `components/pages/ApplicationsClient.tsx`
- `app/(payload)/admin/[[...segments]]/page.tsx`
- `app/(payload)/admin/[[...segments]]/not-found.tsx`
- `app/(payload)/admin/importMap.ts`
- `app/(payload)/api/[...slug]/route.ts`
- `lib/__tests__/payload.test.ts`
- `scripts/__tests__/seed.test.ts`
- `lib/payload.ts` (aside from IN-04)
- `lib/utils/formatting.ts`
- `.gitignore`
- `tsconfig.json`
- `next.config.mjs` (aside from WR-02)
