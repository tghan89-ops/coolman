# UI Review — Phase B+C+D Frontend Port

**Audited:** 2026-05-17
**Auditor mode:** Code-only (no dev server reachable on 3000/5173/8080; screenshots unavailable)
**Baselines:** `DESIGN.md` (tokens, type families, motion ceiling), `BRAND-VOICE.md` (em-dash ban, vocabulary), Open-Design Variant C HTML at project root (visual posture)

---

## Pillar legend

| Score | Meaning |
|---|---|
| 5 | Exceeds spec, no notes |
| 4 | Spec-compliant; minor polish only |
| 3 | Mostly aligned; recurring small drift |
| 2 | Notable rule break(s) that read on screen |
| 1 | Posture-breaking violation, must fix before launch |

Pillars: **Typo** = Typography discipline · **Color** = Color discipline · **Space** = Spacing rhythm · **Motion** = 150ms ceiling · **Posture** = Visual posture vs Open-Design HTML · **Voice** = Brand voice surfacing

---

## Per-page scorecard

| # | Surface | Typo | Color | Space | Motion | Posture | Voice | Avg |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | Home | 4 | 3 | 4 | 4 | 4 | 4 | **3.8** |
| 2 | Header (global) | 4 | **2** | 4 | **2** | 3 | 4 | **3.2** |
| 3 | Footer (global) | 5 | 5 | 5 | 5 | 5 | 5 | **5.0** |
| 4 | Heritage | 5 | 5 | 5 | 5 | 5 | 5 | **5.0** |
| 5 | Why Coolman | 4 | 3 | 4 | 4 | 4 | 4 | **3.8** |
| 6 | Brotherhood | 5 | 4 | 5 | 5 | 4 | 5 | **4.7** |
| 7 | Field Notes (index) | 5 | 5 | 5 | 4 | 4 | 5 | **4.7** |
| 8 | Shibuya | **1** | **2** | 4 | 4 | **1** | 4 | **2.7** |
| 9 | Products (catalogue) | 4 | 4 | 4 | 4 | 4 | 4 | **4.0** |
| 10 | Product detail | 3 | **2** | 4 | **2** | 3 | 4 | **2.7** |
| 11 | Contact | 3 | **1** | 4 | 4 | 3 | 4 | **3.2** |
| 12 | Trade | 4 | 3 | 4 | 4 | 4 | 4 | **3.8** |
| 13 | About / Legal | 5 | 5 | 5 | 5 | 5 | 5 | **5.0** |
| 14 | Resources | 3 | **2** | 4 | 4 | 3 | 4 | **3.2** |
| 15 | Applications | 3 | **2** | 4 | 4 | 3 | 4 | **3.2** |

**Section total: 64 / 90** (avg 4.27 across 15 surfaces)

> Headline issue: `bg-accent-dark` (`#2563eb`) has been adopted as the de-facto CTA fill across nine surfaces. `DESIGN.md §2` declares a single CTA accent: `--accent: #3B82F6`. Every page that uses these buttons is technically running two accent blues — the design hierarchy is no longer "single accent."

---

## Critical fixes (any pillar scored 1 or 2)

### F1 — Token drift: `bg-accent-dark` used as primary CTA fill site-wide

**Rule:** `DESIGN.md §2` — single accent `--accent: #3B82F6`. `--accent-dark` is not authorised as a fill colour anywhere in DESIGN.md; in `globals.css:15` it exists, and at `globals.css:211` it is used only for the focus-visible outline (which is its sanctioned job — better AA contrast on the focus ring).

**Where it's been adopted as a button fill:**
- `components/layout/header.tsx:189` — desktop "Register" CTA
- `components/layout/header.tsx:308` — mobile "Register" CTA
- `components/pages/ContactClient.tsx:229` — WhatsApp channel CTA
- `components/pages/ContactClient.tsx:396` — Open in Maps CTA
- `components/pages/ContactClient.tsx:641` — Contact form submit
- `components/pages/ShibuyaClient.tsx:328` — Shibuya hero CTA
- `components/pages/ShibuyaClient.tsx:445` — Shibuya machine CTA
- `components/products/ProductDetailClient.tsx:500` — "Open product" hover label
- `components/cart/AddToCartButton.tsx:44, 66` — primary cart CTA (both states)
- `components/pages/ResourcesClient.tsx:178` — Resources page CTA
- `components/pages/ApplicationsClient.tsx:137` — Applications page CTA
- `components/industrial/DealerCard.tsx:148` — DealerCard primary action (renders 6× on Brotherhood)

**And as inline text / eyebrows / link colour:**
- `components/pages/ContactClient.tsx:160, 177, 193, 241, 284, 332, 479, 501, 517` — 9 eyebrow + inline text uses on a single page
- `components/pages/ResourcesClient.tsx:136` — card "Open PDF" label
- `components/account/AddressList.tsx:108, 303` — primary `bg-accent` with `hover:bg-accent-dark` (inverted of the rest)
- `components/catalogue/PriceStackCard.tsx:94, 125` — "Sign in to see pricing" link
- `components/catalogue/FilterSidebar.tsx:121` — "Clear all" link
- `components/products/filter-bar.tsx:171` — "Clear filters" link
- `components/cart/AddressSelector.tsx:60` — "Manage in account" link
- `components/industrial/MachineCard.tsx:101` — Shibuya bond-match readout
- `components/catalogue/QuantityStepper.tsx:88` — hover state on stepper buttons

**Why it matters:** the home page (which is correct — uses `bg-navy` + outline) sits next to nearly every other page (which uses `bg-accent-dark`). On the Contact page alone there are three `bg-accent-dark` buttons + nine `text-accent-dark` eyebrows in a single scroll — that is a 12-element accent count when the spec calls for one CTA accent per view.

**Fix (one-line decision required from GH):**
- **Option A** (faithful to DESIGN.md): global find-replace `accent-dark` → `accent`, change hover states from `hover:bg-accent` → `hover:bg-accent-light` (and verify text-on-accent-light contrast — `accent-light: #93C5FD` may fail AA on white text).
- **Option B** (absorb the drift): update `DESIGN.md §2` to formally declare `--accent` for default CTA fill and `--accent-dark` for the resting state, with `--accent` as the *hover-up* state — the inverse of what is shipped. Then global find-replace to invert the current pattern.
- **Option C** (cleanest, recommended): keep `bg-accent` as the only CTA fill; use `hover:opacity-90` (already the pattern in `BrotherhoodDirectoryClient:95` and `TradeClient:90`) — drop `accent-dark` from component classes entirely, leaving it as a focus-ring-only token. Updates DESIGN.md by addition, not subtraction.

This is the single highest-leverage fix in the audit — closes one critical finding across nine pages.

---

### F2 — Shibuya hero abandons Fraunces; uses sans-bold display headings

**Rule:** `DESIGN.md §1` — three type families: IBM Plex Sans (UI), Fraunces (editorial h1/h2 hero blocks), JetBrains Mono (numbers). Shibuya is a cinematic marketing page. The Open-Design reference (`shibuya.html` at project root) uses Fraunces via `--serif: 'Fraunces'`.

**Evidence — every display heading on Shibuya is sans-bold, zero Fraunces:**
- `components/pages/ShibuyaClient.tsx:206` — `h1 className="text-4xl font-bold ... sm:text-5xl md:text-6xl lg:text-7xl"`
- `components/pages/ShibuyaClient.tsx:257` — `h2 className="text-3xl font-bold ... md:text-4xl lg:text-5xl"`
- `components/pages/ShibuyaClient.tsx:281, 309, 393, 479, 503, 524` — same pattern, all `font-bold` IBM Plex Sans

Grep `font-fraunces` in `ShibuyaClient.tsx` → **zero matches**.

**Why it matters:** Shibuya is the page that's most supposed to *feel* like the Husqvarna anchor. Stripping Fraunces and going all-sans-bold drops the page from editorial-premium to dashboard-bold. Posture: 1.

**Fix:** convert h1/h2 on Shibuya to Fraunces with the same clamp scale used on `/heritage` and `/field-notes` indices, e.g.
```tsx
className="font-fraunces text-[clamp(40px,6vw,84px)] font-normal leading-[1.02] tracking-[-0.025em]"
```
The `font-bold` weight is also incorrect — Fraunces ships at `font-normal` per `globals.css` and the rest of the editorial surfaces (`HomePageClient`, `WhyCoolmanClient`, `LegalPageClient`).

---

### F3 — Motion ceiling broken: `group-hover:translate-x-1` on arrows

**Rule:** `DESIGN.md §6` — "150ms ease-out, opacity + box-shadow only, hover/focus/active only. No Y-translate hover."

**Evidence:**
- `components/cart/AddToCartButton.tsx:57` — `transition-transform group-hover:translate-x-1` on primary "Add to cart" button arrow
- `components/cart/AddToCartButton.tsx:94` — same pattern, second variant
- `components/products/ProductDetailClient.tsx:471` — translate-x on cross-link arrow

**Also transform-based:** `components/layout/header.tsx:109, 129` — animated underline using `scale-x-0 group-hover:scale-x-100` (technically a transform, not opacity/box-shadow). The motion is small and tasteful, but the *letter* of the rule allows opacity + box-shadow only. Header nav underline is fine in spirit; flagging only for explicit GH decision.

**Fix:** replace `group-hover:translate-x-1` with `group-hover:opacity-80` on the arrow, or remove the arrow animation entirely (most disciplined). For the header underline, either (a) update DESIGN.md to allow `scale-x` on a 2px decorative line under hover only, or (b) replace with opacity fade.

---

### F4 — Contact page reads as four blue buttons in one scroll

**Rule:** `DESIGN.md §3` — never two accent-blue CTAs in the same view.

**Evidence:**
- `components/pages/ContactClient.tsx:229` — WhatsApp card CTA, `bg-accent-dark`
- `components/pages/ContactClient.tsx:274` — second card CTA (assumed accent — needs visual confirm)
- `components/pages/ContactClient.tsx:317` — third card CTA
- `components/pages/ContactClient.tsx:396` — "Open in Maps" card CTA, `bg-accent-dark`
- `components/pages/ContactClient.tsx:641` — submit, `bg-accent-dark`

Five accent-dark blue buttons render on `/contact` before the user scrolls past the form. The channel-card pattern in `DESIGN.md §5.6` calls for one primary + one outline per card, with a global single-accent budget across the whole page.

**Fix:** keep one accent CTA (the form submit, or the lead channel — WhatsApp), demote the other two channel cards to outline-on-navy or text-link with arrow (the `Link` pattern used in `LegalPageClient.tsx:47-52`). Will simultaneously close F1 on this page.

---

### F5 — Resources & Applications pages have shadcn-default rounded-2xl + sans-bold headings

**Rule:** `DESIGN.md §1, §5.2` — Fraunces on h2 hero block; rounded corners 2-4px.

**Evidence:**
- `components/pages/ResourcesClient.tsx:87` — `h1 className="... text-4xl font-bold ... lg:text-5xl"` (sans-bold, no Fraunces)
- `components/pages/ResourcesClient.tsx:101, 125` — `rounded-2xl` on empty-state + card containers (DESIGN.md uses `rounded-sm` / `rounded-md` everywhere else)
- `components/pages/ResourcesClient.tsx:153, 174` — `h2` and CTA heading, sans-bold
- `components/pages/ApplicationsClient.tsx:50` — `h1 ... text-4xl font-bold` (sans-bold)
- `components/pages/ApplicationsClient.tsx:95, 131` — `h2` sans-bold; `Button rounded-xl` (DESIGN.md `--radius: 2px`)

These pages were ported with shadcn defaults intact — they predate the Fraunces discipline. Visually they read as a different design system from `/heritage`, `/field-notes`, `/about`.

**Fix:** convert h1/h2 to Fraunces clamp scale (same as F2); drop `rounded-2xl` and `rounded-xl` to `rounded-sm`. Drop `font-bold` to `font-normal` for Fraunces.

---

## Polish backlog (anything scored 3 that could lift to 4)

### P1 — `WhyCoolmanClient.tsx:203` uses `hover:bg-accent-light` on a CTA
`DESIGN.md §3` says `--accent-light` is Fraunces italic editorial em ONLY. Using it as a button hover state spreads the editorial-light blue into a CTA context. Fix: `hover:opacity-90` or `hover:bg-navy`.

### P2 — `WhyCoolmanClient.tsx:200` hardcodes `https://wa.me/60126363156`
Violates `CLAUDE.md` frontend-editability rule. Number should come from `settings.whatsapp_number`. (Also: same hardcoded number lives in `BrotherhoodDirectoryClient.tsx:30` — both should pull from settings.)

### P3 — `HomePageClient.tsx:298` uses `rounded-[2px]` (arbitrary value)
DESIGN.md ships `--radius: 2px` mapped to `rounded-sm`. Use the named class so a future radius bump from 2px → 3px propagates without a sweep.

### P4 — Field Notes index featured CTA uses `hover:shadow-lg hover:shadow-navy/20`
`FieldNotesClient.tsx:261` — DESIGN.md §6 specifies `0 4px 12px rgba(10,22,40,0.06)` as the canonical hover shadow. `shadow-lg` is heavier than spec. Replace with `hover:shadow-[0_4px_12px_rgba(10,22,40,0.06)]`.

### P5 — ContactClient inline `text-accent-light` on navy eyebrow
`ContactClient.tsx:332` — accent-light is reserved for Fraunces italic em. Using it on a mono eyebrow on navy is a borderline drift; switch to `text-accent` (works because the surface is navy, not paper).

### P6 — ProductDetailClient full-bleed accent CTA strip
`ProductDetailClient.tsx:540` — `<section className="bg-accent py-12">`. `DESIGN.md §5.7` specifies navy full-bleed for cross-link strips. Change to `bg-navy text-paper`.

### P7 — `ProductDetailClient.tsx:482` `hover:shadow-lg`
Same as P4 — use canonical shadow spec.

### P8 — `BrotherhoodDirectoryClient.tsx:30` hardcoded sales WhatsApp number
Same root cause as P2 — should pull from `settings.whatsapp_number`. Currently used only on empty-state.

### P9 — Empty-state Buttons in Resources/Applications use `rounded-2xl` containers
`ResourcesClient.tsx:101` rounded-2xl on empty state. Down to `rounded-md` to match the rest of the system.

### P10 — Header animated underline uses transform (scale-x)
`header.tsx:109, 129` — Motion ceiling is opacity + box-shadow only. Either ratify scale-x as allowed in DESIGN.md (it's a 2px decorative line, low-risk) or replace with `opacity-0 group-hover:opacity-100`.

---

## What scored 5 — pages that need no work

- **Footer (`components/layout/footer.tsx`)** — Three columns, single accent on hover, mono on `© 2026`, navy field, paper-white text. Posture-perfect.
- **Heritage (`app/(frontend)/heritage/page.tsx`)** — Fraunces on h1/h2, accent eyebrows on paper, accent-light eyebrows on navy hero, drop-cap on first section only, mono on year highlights in timeline. Faithful to `heritage.html`.
- **About (`components/pages/AboutClient.tsx`) + Legal (`LegalPageClient.tsx`)** — Both ship the canonical hero pattern: navy section, mono eyebrow in `accent-light`, Fraunces h1, paper-white lede. Reference implementation for what the rest of the site should look like.

---

## Files audited

```
DESIGN.md
BRAND-VOICE.md
app/globals.css
app/(frontend)/page.tsx
app/(frontend)/heritage/page.tsx
app/(frontend)/brotherhood/page.tsx
app/(frontend)/brotherhood/BrotherhoodDirectoryClient.tsx
app/(frontend)/shibuya/page.tsx
app/(frontend)/field-notes/page.tsx
app/(frontend)/field-notes/FieldNotesClient.tsx
app/(frontend)/field-notes/[slug]/page.tsx
app/(frontend)/products/page.tsx
app/(frontend)/products/[id]/page.tsx
app/(frontend)/why-coolman/page.tsx
app/(frontend)/about/page.tsx
app/(frontend)/contact/page.tsx
app/(frontend)/trade/page.tsx
app/(frontend)/resources/page.tsx
app/(frontend)/applications/page.tsx
app/(frontend)/privacy/page.tsx
app/(frontend)/terms/page.tsx
app/(frontend)/returns-warranty/page.tsx
app/(frontend)/cookies/page.tsx
components/layout/header.tsx
components/layout/footer.tsx
components/home/HomePageClient.tsx
components/pages/WhyCoolmanClient.tsx
components/pages/ContactClient.tsx
components/pages/AboutClient.tsx
components/pages/LegalPageClient.tsx
components/pages/ShibuyaClient.tsx
components/pages/TradeClient.tsx
components/pages/ResourcesClient.tsx
components/pages/ApplicationsClient.tsx
components/products/ProductsClient.tsx
components/products/ProductDetailClient.tsx
components/cart/AddToCartButton.tsx
components/industrial/HeritageTimelineEntry.tsx
components/industrial/FearCard.tsx
components/industrial/DealerCard.tsx
components/industrial/MachineCard.tsx
components/catalogue/PriceStackCard.tsx
components/catalogue/FilterSidebar.tsx
components/catalogue/QuantityStepper.tsx
components/account/AddressList.tsx
components/account/AddressSelector.tsx
```

Plus Open-Design Variant C HTML at project root for posture cross-reference.
