# QA Report — Coolman V1 Phase B+C+D Port

**Date:** 2026-05-17
**Scope:** Audit-only pass (no code changes) across `c:\Users\Tan Guan Han\Apps\Coolman\b_hEdh3FcwxmZ`.
**Stack covered:** Next.js 16 App Router + Payload CMS v3 + Vercel Postgres + Vercel Blob + Resend.

---

## Section 1 — Copy parity (EN vs BM in `lib/i18n/copy.ts`)

**Method:** Walked the EN and BM trees against the `CopyStructure` interface and built keypath Sets.

**Result:** PASS — exact parity.

- EN keypaths: **1,010**
- BM keypaths: **1,010**
- Missing in EN: **0**
- Missing in BM: **0**
- Structural drift: **none**

**Findings:** None.

---

## Section 2 — Em dash (U+2014) audit on user-facing copy

**Rule:** No em dashes in any user-facing copy (CLAUDE.md hard rule). Comments and admin-only surfaces are excluded.

**Findings (12 user-facing violations):**

| # | File:Line | Rule | Suggested action |
|---|-----------|------|------------------|
| 2.1 | `app/(frontend)/account/AccountClient.tsx:106` | Visible JSX text: "…inbox `— and your junk / spam folder` — for a link from Coolman." | Replace both em dashes with a comma or full stop; reword to single-clause sentences. |
| 2.2 | `app/(frontend)/auth/reset-password/page.tsx:46` | Error string shown on form: "Reset failed. Your link may have expired — please request a new one." | Split into two sentences: "Reset failed. Your link may have expired. Please request a new one." |
| 2.3 | `app/(frontend)/cart/page.tsx:8` | `metadata.title: 'Your Cart — Coolman'` (renders in browser tab). | Use a vertical bar pipe or simply "Your Cart \| Coolman" / "Coolman — Your Cart" replaced with "Coolman: Your Cart" or "Your Cart". |
| 2.4 | `app/api/auth/forgot-password/route.ts:70` | Reset email body: "…safely ignore this email — your password won't change." | Replace with full stop. |
| 2.5 | `app/api/orders/submit/route.ts:57` | Admin email subject template: ``New order request — ${companyName} — ${lineCount} item(s) — ${grandFmt}`` | Use `·` (middle dot) or `\|` between segments. |
| 2.6 | `app/api/orders/submit/route.ts:58` | Contractor email subject template: ``Order received — ${lineCount} item(s) — ${grandFmt}`` | Same as 2.5. |
| 2.7 | `app/api/orders/submit/route.ts:89` | Email HTML title: ``<h2>${escapeHtml(subject.split(' — ')[0])}</h2>`` (depends on subject still containing the dash). | Update once 2.5/2.6 land; switch split delimiter. |
| 2.8 | `app/api/orders/submit/route.ts:107` | Contractor email signature: `<p>— Coolman</p>` | Drop the dash; just `Coolman` or `The Coolman team`. |
| 2.9 | `app/api/cron/unresponded-alert/route.ts:105` | Admin alert email subject: ``[Coolman] Unresponded order ${order.id} — over ${thresholdHours}h old`` | Replace with comma. |
| 2.10 | `lib/auth/context.tsx:148` | Login network error shown to users: `'Network error — please try again'` | Split into two sentences. |
| 2.11 | `lib/auth/verify-email.ts:47` | Email subject: `'Welcome to Coolman — confirm your email to see your contract prices'` | Replace with colon: "Welcome to Coolman: confirm your email…". |
| 2.12 | `lib/auth/verify-email.ts:55` | Email signature: `<p>— The Coolman team</p>` | Drop the dash. |

All other em-dash hits are inside `//`, `/*`, `{/*` comments, JSX comments, admin field labels, test files, or admin-only React tree (`components/admin/*`) — not user-facing and not in scope.

---

## Section 3 — Banned strings audit

**Rules checked:**
- "Coolman Pro" — never use the Pro suffix (MEMORY: feedback_project_name.md).
- "Coolman Sdn Bhd" without "Malaysia" — must be "Coolman Malaysia Sdn Bhd".
- Banned CTAs: "Get Started", "Watch Demo", "Learn More", "View Details", "Get Advice" (BRAND-VOICE.md vocabulary).
- Hardcoded `wa.me/` digits — must come from Settings.whatsapp_number.
- Hardcoded `mailto:` emails — should come from Settings.
- Chinese pull-quotes outside `components/editorial/Pullquote.tsx`.

**Findings:**

| # | File:Line | Rule | Suggested action |
|---|-----------|------|------------------|
| 3.1 | `components/pages/WhyCoolmanClient.tsx:200` | Hardcoded `href="https://wa.me/60126363156"` instead of consuming `useSettings().whatsapp_number`. | Read whatsapp_number from Settings, strip non-digits, build wa.me URL inline. Match the pattern used in `ContactClient.tsx`. |
| 3.2 | `app/(frontend)/brotherhood/BrotherhoodDirectoryClient.tsx:30` | Module-level constant `SALES_WHATSAPP_DIGITS = '60126363156'`. Self-comment acknowledges it should come from Settings ("Long-term, source from Settings"). | Replace with `useSettings().whatsapp_number` (strip non-digits) so a single Settings edit propagates here too. |
| 3.3 | `components/pages/ContactClient.tsx:141–152` | Four hardcoded mailto addresses (`sales@`, `parts@`, `training@`, `careers@coolman.com.my`) embedded in JSX. | Promote to a Settings group `direct_lines` (label / email / note) — Alan needs to be able to swap addresses without code, especially during the launch phase when `sales@` is being routed to a test inbox (per TODOS Group 6). |

**Clean checks (no violations found):**
- `"Coolman Pro"` — 0 hits anywhere in `app/`, `components/`, `lib/`, `globals/`, `collections/`, copy.ts.
- `"Coolman Sdn Bhd"` without preceding "Malaysia" — 0 hits. Every occurrence of the legal name appears as "Coolman Malaysia Sdn Bhd" or is derived from `useSettings().legal_entity_name` (default `'Coolman Malaysia Sdn Bhd'` at `globals/Settings.ts:113`).
- Banned CTA labels — 0 hits in copy.ts or any client component.
- Chinese pull-quotes (`不要只卖产品`, `生意不是比谁跑得久`, `工地会告诉你真相`) — appear **only** at `components/editorial/Pullquote.tsx:44–46`, exactly as the hard rule prescribes. They are not present in copy.ts.

---

## Section 4 — Broken link audit

**Method:** Used `.qa-scan-hrefs.cjs` to harvest every `href="/…"` literal from `app/`, `components/`, `lib/` and reconciled against the file tree under `app/(frontend)`.

**Result:** PASS — 0 broken internal routes.

Verified routes (each maps to a `page.tsx` under `app/(frontend)`):

- `/` — home (`app/(frontend)/page.tsx`)
- `/about` (`app/(frontend)/about/page.tsx`)
- `/heritage` (`app/(frontend)/heritage/page.tsx`)
- `/why-coolman` (`app/(frontend)/why-coolman/page.tsx`)
- `/field-notes`, `/field-notes/[slug]` (`app/(frontend)/field-notes/...`)
- `/brotherhood` (`app/(frontend)/brotherhood/page.tsx`)
- `/products`, `/products/[id]` (`app/(frontend)/products/...`)
- `/applications` (`app/(frontend)/applications/page.tsx`)
- `/shibuya` (`app/(frontend)/shibuya/page.tsx`)
- `/cart`, `/order-request`, `/order-confirmation/[id]`
- `/contact` (`app/(frontend)/contact/page.tsx`)
- `/trade` (`app/(frontend)/trade/page.tsx`)
- `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify-email`
- `/account`, `/account/orders/[id]`
- `/privacy`, `/terms`, `/returns-warranty`, `/cookies` (all four footer legal links resolve to page files).

No 404 targets.

---

## Section 5 — Hard rule spot-checks

### 5.1 Order writes go through `app/api/orders/submit/route.ts` with `orders_paused` check — PASS (with one documented exception)

- Only the submit route calls `payload.create({ collection: 'orders' })` — confirmed at `app/api/orders/submit/route.ts:405`.
- `orders_paused` is read inside the DB transaction at `app/api/orders/submit/route.ts:216` and aborts with a kill-switch error.
- `app/api/admin/orders/[id]/acknowledge/route.ts` uses `payload.update(...)`, not `create` — documented exception in its own header comment (lines 1–6). This is an order *acknowledgement*, not an order write, and is correctly excluded from the kill-switch gate.

### 5.2 Price rendering goes through `components/catalogue/PriceStackCard.tsx` — TWO RULE VIOLATIONS (both auth-gated, so functionally safe but the rule is still violated)

| # | File:Line | Surface | Why it matters | Suggested action |
|---|-----------|---------|----------------|------------------|
| 5.2a | `app/(frontend)/cart/CartPageClient.tsx:208` | Line total per cart row — `{formatPrice(it.listPrice * it.quantity)}` | Bypasses PriceStackCard. The cart page is only reachable when logged in (gate at line 85), but the displayed value is **list price × quantity**, not effective price × quantity. A logged-in contractor with a tier discount will see list totals on the cart line but the proper stack-up only on the right-hand summary card. Inconsistent. | Either render the line total via PriceStackCard's `LineTotal` variant (add one if missing), or compute and display `effective_per_unit × quantity` after pulling tier/promo from `/api/contractors/me`. Same logic that `PriceStackCard.resolveBranch` uses. |
| 5.2b | `app/(frontend)/order-request/OrderRequestForm.tsx:294, 418, 477` | Single-line buy-now product card: per-unit list price (line 294), list-price subtotal row (line 418), final Total fallback when not authenticated to see stack-up (line 477) | Direct `formatPrice(listPrice…)` renders bypass the gating component. Auth gate at line 180 means a logged-out user never reaches this surface, so the logged-out branch is moot — but the contractor-with-no-tier and contractor-with-tier paths render different lines manually instead of through PriceStackCard. Rule violation regardless of functional safety. | Refactor the right-hand summary panel to mount `PriceStackCard` (or extract the per-line `tierDiscount`/`promoDiscount`/`effectivePrice` math into a single shared `usePriceBreakdown(...)` hook so PriceStackCard + this form share one source of truth). |

### 5.3 Three-state pricing gate (logged-out → no price; logged-in no-tier → list only; logged-in with tier → list/tier/promo/effective stack-up) — PASS

`components/catalogue/PriceStackCard.tsx` implements all four branches via `resolveBranch()` at line 34:
- `logged-out` → renders the "Sign in to see pricing" CTA, no number on screen (line 79).
- `unverified` → friendly banner, no price (line 105).
- `list-only` → list price in mono, no labels (line 136).
- `stack-up` → full list → tier → promo → effective ladder (line 175+).

Header comment at top of file explicitly declares: "ONLY component allowed to render product price text." Discovered violators above (5.2a / 5.2b) are the only escape hatches.

### 5.4 Search query logging fires on every catalogue search — PASS

- `components/catalogue/FilterSidebar.tsx:53–87` — debounced `fetch(searchLogEndpoint, ...)` fires on every filter change with `keepalive: true`; failures are intentionally swallowed.
- `components/products/ProductDetailClient.tsx` — fires a `viewedProductId` log on mount.
- `app/api/search-log/route.ts` accepts both anonymous and authenticated rows. No silent-skip code paths.

---

## Section 6 — Locked Settings defaults (verify hardcodes match locked values, and live surfaces read from Settings)

**Settings defaults file:** `globals/Settings.ts`.

| Setting | Locked value | Defined at | Live surface reads from Settings? |
|---------|--------------|------------|-----------------------------------|
| `whatsapp_number` | `+60126363156` | `globals/Settings.ts:104` | YES via `useSettings()` in `ContactClient.tsx` (line 79 fallback) and `HomePageClient.tsx:34–72`. EXCEPTIONS: `components/pages/WhyCoolmanClient.tsx:200` and `app/(frontend)/brotherhood/BrotherhoodDirectoryClient.tsx:30` hardcode the same digits — see findings 3.1, 3.2. |
| `legal_entity_name` | `Coolman Malaysia Sdn Bhd` | `globals/Settings.ts:113` | YES — `components/layout/footer.tsx` pulls it from `useSettings()`, base-bar copyright + distributor line both interpolate it. No hardcoded "Coolman Sdn Bhd" anywhere. |
| `inventory_on_time_pct` | `96` | `globals/Settings.ts:165` | YES — `HomePageClient.tsx:34–72` overlays Settings onto the `quietDoor.stats` by stable key. The literal `'96%'` strings at `lib/i18n/copy.ts:1919, 3316` and `'14:00'` / `'2pm'` strings at lines 2000, 3397 are **static seed fixtures** for timeline events and SEO meta descriptions, not the live dynamic stat tiles. Acceptable. |
| `inventory_dispatch_cutoff` | `14:00` | `globals/Settings.ts:176` | YES — same overlay pattern as above. |

**Findings:** None beyond the WhatsApp number hardcodes already captured in Section 3 (3.1, 3.2).

---

## Section 7 — ContactClient copy-block divergence

**Background:** Session 4 introduced a new top-level `t.contactPage` block in copy.ts. ContactClient was already wired to the older `t.pages.contact` block. The question is which block is actually consumed and whether the other should be removed.

**Findings:**

| # | File:Line | Rule | Suggested action |
|---|-----------|------|------------------|
| 7.1 | `components/pages/ContactClient.tsx:62` | Component reads `const c = t.pages.contact` — the **old** block. | Confirm with GH whether Session 4's `t.contactPage` block was meant to supersede `t.pages.contact`. If yes, port ContactClient to read `t.contactPage` and remove the old `t.pages.contact` block. If no, delete `t.contactPage` from the interface and both EN/BM definitions to remove dead copy. |
| 7.2 | `lib/i18n/copy.ts:894` (interface), `lib/i18n/copy.ts:2289` (EN), `lib/i18n/copy.ts:3686` (BM) | `t.contactPage` block is defined for EN and BM but **not consumed by any component**. Grep across `app/**/*.{ts,tsx}` and `components/**/*.{ts,tsx}` shows only `t.pages.contact` usage; the only other `contactPage` hit in the codebase is `app/(frontend)/contact/page.tsx:23,34` where it is the *local variable name* for the Payload global fetch result — unrelated to the i18n block. | Same as 7.1 — decide which surface is canonical, then prune the other to prevent translation drift. |

Note: copy.ts EN/BM parity still passes (Section 1) because BOTH blocks are mirrored in both languages. The drift risk is future: when GH next asks Alan for a copy tweak on the contact page, the wrong block could get edited.

---

## Counts by category

| Section | Findings |
|---------|----------|
| 1. Copy parity (EN/BM) | **0** |
| 2. Em dashes in user-facing copy | **12** |
| 3. Banned strings / hardcoded contact info | **3** (2× WhatsApp digits, 1× mailto block of 4 addresses) |
| 4. Broken internal links | **0** |
| 5. Hard rule spot-checks | **2** (PriceStackCard bypasses; both auth-gated) |
| 6. Locked Settings defaults | **0** new (2 cross-listed from Section 3) |
| 7. ContactClient block divergence | **2** (1 component, 1 copy.ts) |
| **Total flagged** | **19** |
