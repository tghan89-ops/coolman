---
phase: phase-b-c-d-port
reviewed: 2026-05-17
depth: deep
scope: commits 4701843..21abf04 on main
files_reviewed: 28
findings:
  blocker: 0
  high: 2
  medium: 2
  low: 3
  nit: 2
  total: 9
status: issues_found
---

# Coolman V1 — Phase B+C+D Port: Code Review Report

**Reviewed:** 2026-05-17
**Scope:** commits `4701843` → `21abf04` on `main`
**Status:** issues_found (no blockers — site is not public yet, all findings are pre-launch fixes)

This REVIEW.md supersedes the prior 2026-05-10 review (Live Preview wiring), which has been resolved by intervening commits.

## Summary

Port of Open-Design Variant C visual posture + Sessions 1-4 content drafts is structurally sound. The Settings boundary, PriceStackCard four-branch gate, kill-switch banner with proper a11y, sanitize-html allowlist for Field Notes article bodies, and typed `RawXxx` server→client narrow pattern at page.tsx are all in good shape. Two HIGH findings violate project hard rules: one page hardcodes the WhatsApp number, one client component types its Payload payload as `any`. The remaining issues are duplicated fallbacks, redundant settings re-fetches across page wrappers, and two cleanup nits. No banned CTAs, no banned brand strings, no em-dashes in user-facing copy strings.

---

## HIGH

### HI-01: Hardcoded WhatsApp number in WhyCoolmanClient

**File:** `components/pages/WhyCoolmanClient.tsx:200`
**Rule violated:** "Design for frontend-editability" — `whatsapp_number` lives in Settings (admin-editable). Every WhatsApp link must read from Settings, never hardcode digits. AboutClient and TradeClient already follow this; this page diverged.
**Issue:** Line 200 renders `href="https://wa.me/60126363156"` literally. A rename in Settings would not propagate here.
**Fix:**
1. Add `whatsappNumber: string` prop to `WhyCoolmanClient`.
2. Strip non-digits: `const waDigits = whatsappNumber.replace(/[^\d]/g, '')` and use `href={\`https://wa.me/${waDigits}\`}`.
3. Create `app/(frontend)/why-coolman/page.tsx` server wrapper that fetches `getGlobal('settings', { overrideAccess: true })` and passes `whatsapp_number` down — mirror the AboutClient/TradeClient pattern. Or, since `WhyCoolmanClient.tsx` is already `"use client"`, read via `useSettings()` directly and avoid the server fetch entirely.

### HI-02: ProductDetailClient types its full payload as `any`

**File:** `components/products/ProductDetailClient.tsx:24` (prop type `initialData: any`, plus dependent reads on `materials`, `applications`, `photos`, `relatedProducts`, `labelOf`, `keyOf`)
**Rule violated:** Type-narrow at the server→client boundary. Commit `bb1e76e` established `ProductCardData` for the catalogue grid; the detail page must follow the same discipline so renames and shape changes do not silently break the UI.
**Issue:** Whole-payload `any` lets Payload schema drift through unchecked. Compile-time refactor signal is lost on the detail page (the most price-sensitive screen).
**Fix:** Define `ProductDetailData` interface in `ProductDetailClient.tsx` listing only the fields actually read (id, name, sku, diameterMm, materials: Array<{name: string}>, applications: Array<{name: string}>, photos: Array<{url: string; alt?: string}>, price fields, relatedProducts: ProductCardData[], etc.). Change prop to `initialData: ProductDetailData`. Narrow at `app/(frontend)/products/[id]/page.tsx` boundary with one cast.

---

## MEDIUM

### ME-01: ContactClient duplicates SETTINGS_FALLBACK chain

**File:** `components/pages/ContactClient.tsx:76-83`
**Rule violated:** Single source of truth — `SETTINGS_FALLBACK` in `lib/settings/context.tsx` already covers `legal_entity_name`, `whatsapp_number`, `inventory_dispatch_cutoff`. Re-declaring fallback strings inline forks the safety net and makes a Settings rename a two-place edit.
**Issue:** Lines 79-83 inline `'+60126363156'`, `'Coolman Malaysia Sdn Bhd'`, `'09:00–18:00'`, `'09:00–13:00'`, `'Closed'`, `'14:00'`. These shadow the provider fallback.
**Fix:** Read via `useSettings()` (already a client component) and rely on `SettingsProvider`'s merge over `SETTINGS_FALLBACK`. For `opening_hours` (not in `PublicSettings` yet), extend the `PublicSettings` interface + the server narrow in `app/(frontend)/layout.tsx`, then move the fallback strings into `SETTINGS_FALLBACK`.

### ME-02: Direct-line emails hardcoded in ContactClient

**File:** `components/pages/ContactClient.tsx:141-152`
**Rule violated:** "Design for frontend-editability" — staff direct emails (`sales@`, `parts@`, `training@`, `careers@coolman.com.my`) are tunable values that change when staff move or domains rebrand. They should live in Settings, not in a JSX template.
**Issue:** Four email addresses baked into the contact page. A domain change forces a code deploy.
**Fix:** Add `contact_email_sales`, `contact_email_parts`, `contact_email_training`, `contact_email_careers` fields to the Payload `settings` global. Read in the page.tsx server wrapper, pass into `ContactClient` via the `settings` prop. Update the `RawSettings` contract.

---

## LOW

### LO-01: Redundant per-request settings fetches in 7 page wrappers

**Files:**
- `app/(frontend)/about/page.tsx`
- `app/(frontend)/trade/page.tsx`
- `app/(frontend)/contact/page.tsx`
- `app/(frontend)/privacy/page.tsx`
- `app/(frontend)/terms/page.tsx`
- `app/(frontend)/returns-warranty/page.tsx`
- `app/(frontend)/cookies/page.tsx`
- `app/(frontend)/products/[id]/page.tsx`

**Issue:** `app/(frontend)/layout.tsx` already fetches `getGlobal('settings', { overrideAccess: true })` once per request. These 8 page wrappers each re-fetch the same global. Eight extra DB roundtrips per page render on cold-cache routes.
**Fix:** Two options:
- (preferred) For routes where the client component can use `useSettings()` (contact, why-coolman, legal pages), drop the page-level fetch entirely.
- For routes that must SSR with settings (product detail, where `orders_paused` must be known server-side before passing to ProductDetailClient), keep the fetch but consider promoting Payload's request-level memoisation via a wrapper that dedupes within a single request.

### LO-02: Inconsistent WhatsApp number format in fallbacks

**Files:**
- `app/(frontend)/about/page.tsx:19` — `'+6012-6363156'`
- `app/(frontend)/trade/page.tsx:19` — `'+6012-6363156'`
- `components/pages/ContactClient.tsx:79` — `'+60126363156'`
- `lib/settings/context.tsx:18` — `'+60126363156'`

**Issue:** Two formats for the same number. `replace(/[^\d]/g, '')` normalises both before the `wa.me/` URL, so functionally identical — but inconsistent literals make a future grep-and-replace miss occurrences.
**Fix:** Use `'+60126363156'` everywhere (matches `SETTINGS_FALLBACK`). Better: delete the page-level fallbacks per LO-01 and rely on SETTINGS_FALLBACK only.

### LO-03: `as any[]` casts on products in catalogue page

**File:** `app/(frontend)/products/page.tsx:69, 83, 97`
**Issue:** Three `as any[]` casts when iterating products to compute filter counts. The catalogue is the entry point to the whole purchase funnel — type safety here pays for itself.
**Fix:** Define a `ProductFilterRow` interface (subset of Product with `materials`, `applications`, `diameterMm`). Cast once at the top: `const productList = products as ProductFilterRow[]`. Remove the three inline casts.

---

## NIT

### NI-01: Legacy `lib/pricing/display-mode.ts` flagged for deletion

**File:** `lib/pricing/display-mode.ts`
**Issue:** File's own header comment says "Delete this file and its test in a follow-up once we confirm no indirect imports remain." Superseded by `PriceStackCard.tsx`'s `resolveBranch`.
**Fix:** Run a project-wide search for `display-mode` to confirm no live imports. If clean, delete the file + its test in the next housekeeping pass. Reinforces the project hard rule that PriceStackCard is the single price-rendering choke point.

### NI-02: "Draft" label hardcoded in LegalPageClient

**File:** `components/pages/LegalPageClient.tsx:41`
**Issue:** The "Draft" status badge label renders an English literal. EN+BM parity convention is to source from `t.*`.
**Fix:** Add `t.legal.draftBadge` (EN: "Draft", BM: "Deraf") in `lib/i18n/copy.ts` and reference via `t.legal.draftBadge` instead of the inline string.

---

## Confirmed Clean (no findings)

- **Em-dash scan of `lib/i18n/copy.ts`** — only one `—` match, inside a code comment (`// Session 4 Part 3 — three-column footer`), not user-facing copy.
- **Banned CTAs** — no "Get Started" / "Watch Demo" / "Learn More" / "View Details" / "Get Advice" in changed-files scope. (Pre-existing "Watch Demo" default in migration `20260516` is out of scope and would be overwritten by a Payload seed.)
- **Banned brand strings** — no "Coolman Pro", no truncated "Coolman Sdn Bhd" (always "Coolman Malaysia Sdn Bhd").
- **`Footer`** (`components/layout/footer.tsx`) — reads `legal_entity_name` from `useSettings()`, three-column shape clean, no decoration creep.
- **`SettingsProvider`** (`lib/settings/context.tsx`) — `SETTINGS_FALLBACK` is the only acceptable hardcoded fallback (its docstring justifies it — single-source safety net).
- **`PriceStackCard`** — four-branch resolver with NaN-safe `Number.isFinite` guards. Single price-rendering choke point.
- **`KillSwitchBanner`** — `role="alert"`, stable `id="kill-switch-banner"` for aria-describedby. AddToCartButton gates on `disabled` plus a defensive early-return in onClick.
- **Field Notes** (`FieldNotesClient.tsx`, `FieldNoteArticleClient.tsx`, `api/field-notes-count/route.ts`) — typed `FieldNoteRow` boundary, sanitize-html allowlist, BM→EN fallback, ISR-cached count probe.
- **`AboutClient` / `TradeClient`** — take `whatsappNumber` prop, strip to digits — correct pattern (HI-01 should follow this).
- **`app/(frontend)/layout.tsx`** — fetches settings once at the layout boundary, narrows to `Partial<PublicSettings>`, wraps tree in SettingsProvider. Correct pattern.

## Deferred Checks (not exhaustively performed)

- **EN+BM structural parity in `lib/i18n/copy.ts`** — file is 3758 lines / +1237/-198 in diff, exceeded read budget. Recommend a parity script that walks both EN and BM trees and reports missing keys, run as part of CI.
- **`as any` audit across `collections/*` and `app/api/*`** — many pre-existing instances; most are legitimate Payload user-type casts and transactionID req casts. Not in this change's scope.

---

_Reviewed: 2026-05-17_
_Reviewer: gsd-code-reviewer (Claude Opus 4.7)_
_Depth: deep_
