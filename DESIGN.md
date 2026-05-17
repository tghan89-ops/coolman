# Coolman — Design System

**Status:** Locked V1. Date: 2026-05-09. Authored via `/design-consultation`.

This file is the single source of truth for visual language, typography, spacing, motion, copy voice, and component posture. Any UI work that contradicts this file is a bug. Update this file *before* the code, never after.

> Copy authority lives in [`BRAND-VOICE.md`](BRAND-VOICE.md). DESIGN.md governs tokens; BRAND-VOICE.md governs words.

Canonical preview: [`design-preview-b.html`](../design-preview-b.html) (Industrial Premium — Hilti × Husqvarna).

---

## 1. Posture

**Industrial Premium.** Reference set: Hilti, Husqvarna Construction, Linear, McMaster-Carr, Stripe.

The site has to read as "comparable to international industrial-tool suppliers" — not Malaysian SME, not e-commerce-cute, not crypto-startup-flashy. Professional and trustworthy, like Alan himself: knows the trade, doesn't oversell, doesn't waste your time.

**Three rules that decide every styling call:**
1. **Trust before delight.** A boring page that loads fast and reads clearly beats a clever page that wobbles or pulses.
2. **Density is OK when it earns its keep.** A spec table is denser than a hero. A hero is more spacious than a spec table. Don't apply one rhythm to both.
3. **Brand-forward, not brand-loud.** Navy + accent blue carry the brand. We don't need decorative shapes, gradients-for-gradients-sake, or tagline overlays.

---

## 2. Color tokens

All colors are defined as CSS custom properties in [`app/globals.css`](app/globals.css). Never hex-literal in components.

### Light (default)

| Token | Hex | Usage |
|---|---|---|
| `--navy` | `#0A1628` | Primary brand. Top nav, headlines, CTAs, footer. |
| `--navy-light` | `#122036` | Hover states on navy surfaces. |
| `--navy-surface` | `#1A2D47` | Card surfaces inside navy regions. |
| `--accent` | `#3B82F6` | Single accent. Links, active filters, brand mark accent, all CTA fills. Hover on accent fills is `hover:opacity-90` — never swap to a darker accent token. |
| `--accent-dark` | `#2563eb` | **Focus-ring only.** Used exclusively by the `:focus-visible` outline (see [`app/globals.css`](app/globals.css) line 211) and the `.post-body` link styles. Banned as a fill, banned as a hover, banned as a text color. If a CTA needs a hover, use `opacity-90`. |
| `--accent-light` | `#60A5FA` | One allowed use: italic `<em>` inside a Fraunces hero headline. Never on UI accents, links, focus rings, or buttons. |
| `--paper` | `#FAFAF7` | Page background. Warmer than pure white — reads less screen-glare under workshop lighting. |
| `--rule` | `#E5E2DA` | Hairline borders, table rules, divider lines. |
| `--ink` | `#0A1628` | Body text (= `--navy`). |
| `--ink-muted` | `#475569` | Secondary text, helper copy, captions. |
| `--ink-faint` | `#94A3B8` | Disabled text, placeholders. |
| `--success` | `#0F8A4F` | Order acknowledged, in stock, fulfilment confirmed. **Desaturated** — never `#10B981`. |
| `--warn` | `#D97706` | Low stock, response-overdue alerts. **Desaturated** — never `#F59E0B`. |
| `--danger` | `#B91C1C` | Validation errors, kill-switch banner, destructive confirms. **Desaturated** — never `#DC2626`. |
| `--shibuya-ink` | `#030508` | Shibuya marketing page only. Blacker than `--navy` for cinematic posture. Do not use elsewhere. |
| `--shibuya-paper` | `#F8F7F4` | Shibuya marketing page only. Slightly warmer than `--paper`. Do not use elsewhere. |

### Dark mode (admin dashboards by default; site dark mode is V2)

| Token | Hex |
|---|---|
| `--background` | `#0A1628` |
| `--surface` | `#122036` |
| `--surface-raised` | `#1A2D47` |
| `--ink` | `#FFFFFF` |
| `--ink-muted` | `#94A3B8` |
| `--rule` | `#1A2D47` |
| Accent / semantic | unchanged from light |

**Banned:** any other accent color (no green CTAs, no orange CTAs, no red CTAs unless destructive). Single-accent rule. If you need to differentiate two CTAs in the same view, one is `--navy` (primary) and one is outlined `--navy` border with paper fill (secondary). Never two accent-blue buttons in the same view.

---

## 3. Typography

### Families

Three type families maximum: **IBM Plex Sans** (UI), **Fraunces** (editorial h1/h2 hero blocks and Field Notes article headers only — never UI labels, buttons, navigation, or body copy), **JetBrains Mono** (numbers, prices, SKUs, dates, IDs). Inter is banned.

- **Sans (UI body + headings):** IBM Plex Sans. Loaded via `next/font/google` in `app/(frontend)/layout.tsx`. Tailwind class: `font-sans`.
- **Editorial serif (hero h1/h2 + Field Notes article headers):** Fraunces, 400 regular + 400 italic + 600 semibold. Same loader. Tailwind class: `font-fraunces`. Editorial-only — never on UI labels, buttons, navigation, body copy, or admin UI.
- **Mono (prices, SKUs, quantities, dates, codes):** JetBrains Mono. Same loader. Tailwind class: `font-mono`.
- **Banned:** Inter (overused, reads as generic SaaS). System fallback for sans is `ui-sans-serif, system-ui, sans-serif` — never Helvetica or Arial alone.

### `--accent-light` usage

`--accent-light` (`#60A5FA`) has exactly one allowed use: italic `<em>` inside Fraunces hero headlines, e.g. the editorial split treatment on the homepage and Field Notes article headers. Never use it for body copy, UI accents, links, focus rings, or buttons — those all use `--accent`. If you find yourself reaching for `--accent-light` outside a Fraunces italic, you are using the wrong token.

`--accent-dark` (`#2563eb`) is **focus-ring only**. It exists for one purpose: the `:focus-visible` outline defined in [`app/globals.css`](app/globals.css) line 211, plus the `.post-body` link styles. It is never authorized as a fill, a hover, or a text color. CTA hovers do `hover:opacity-90` against the `--accent` fill — never swap accent tokens for hover. Burned 2026-05-17: the V1 build had `bg-accent-dark` smeared across 18+ component-classes as a "darker primary CTA"; this was a token-drift violation of the single-accent rule and was swept back to `bg-accent + hover:opacity-90` in a single fix bundle.

### Scale (rem at 16px base)

| Role | Size | Weight | Line | Tracking | Use |
|---|---|---|---|---|---|
| Display | 4rem (64px) | 600 | 1.05 | -0.02em | Hero h1 only. One per page. |
| H1 | 2.5rem (40px) | 600 | 1.15 | -0.015em | Section openers (Catalogue, Order Request). |
| H2 | 1.75rem (28px) | 600 | 1.25 | -0.01em | Card titles, product names. |
| H3 | 1.25rem (20px) | 600 | 1.3 | 0 | Sub-section headings. |
| Body | 1rem (16px) | 400 | 1.55 | 0 | Default paragraph. |
| Body-strong | 1rem (16px) | 500 | 1.55 | 0 | Inline emphasis. |
| Small | 0.875rem (14px) | 400 | 1.5 | 0 | Helper text, captions. |
| Micro | 0.75rem (12px) | 500 | 1.4 | 0.04em | Labels, eyebrow, badge text — uppercase. |
| Mono-lg | 1.5rem (24px) | 500 | 1.2 | 0 | Featured prices on product cards. |
| Mono | 1rem (16px) | 500 | 1.5 | 0 | Inline prices, SKUs, order IDs. |

### Rules

- **Headings:** always `tracking-tight` from H1 down to H3 — never default tracking on a heading.
- **Mono goes on numbers, never on prose.** A price is mono; a sentence about pricing is sans.
- **Three type families maximum, ever.** IBM Plex Sans, Fraunces (editorial only), JetBrains Mono. No script, no slab, no fourth display face.
- **Fraunces is editorial, not UI.** Allowed: hero h1/h2 on home, heritage, why-coolman; Field Notes article headers; mid-page pull-quote blocks. Banned: buttons, navigation, form labels, body copy, admin UI, card titles, status pills.

---

## 4. Spacing & layout

- **Base unit: 4px.** Every gap, padding, margin must be a multiple. Tailwind's default scale (`p-1` = 4px) maps cleanly.
- **CTA height: 48px.** Always. Buttons inside dense forms can shrink to 40px (`size="sm"`); never below.
- **Tap target floor: 44px.** Any interactive surface (icon button, checkbox row, filter chip) must clear this in both dimensions on mobile.
- **Container max-width: 1280px.** Centered. Outer page padding: 24px (mobile) → 48px (desktop).
- **Section vertical rhythm: 96px** between major sections on desktop, 64px on mobile.
- **Grid:** 12-column on desktop, 4-column on mobile. Gutter: 24px desktop, 16px mobile.
- **Card radius: 8px** (`--radius`). Hard-edged inputs (4px, `--radius-sm`) feel more industrial — use on form fields. Pills/chips: 9999px (fully rounded).

---

## 5. Layout posture (variation B)

Every page composed from these primitives:

### Top navigation
- Transparent over hero; flips to solid `--navy` once the page scrolls past 20px. No `backdrop-filter` blur — the impeccable audit found the frosted state decorative and inconsistent with Industrial Premium posture (Hilti and Husqvarna both ship solid headers). The mobile drawer is also solid `--navy`.
- Sticky. 80px tall. Brand mark left, primary nav center, account/CTA right.
- Brand mark: `Cool` in white + `man` in `--accent`. IBM Plex Sans 600. JetBrains Mono is never used for the wordmark.
- Active link underlined with 2px `--accent` rule on hover, no background fill.

### Hero (homepage only)
- 70vh, full-bleed.
- Background: `linear-gradient(135deg, #1A2D47 0%, #0A1628 60%, #050C18 100%)` overlaid with the SVG concentric-circle diamond mark (see preview B).
- **V1 imagery: SVG-rendered diamond shape** (no real photos). Alan has no production photography yet.
- **V2 imagery: real product photography** — full-bleed shot of a blade cutting concrete. Triggered when Alan delivers a photoshoot.
- Display type 64px, max 12 words. Sub-copy 18px, max 24 words.
- Single primary CTA (`--accent` fill) + single ghost CTA (white outline). No third CTA.

### Trust bar
- Sits directly under hero. Strip of 4 stats: SKU count, average response time, fulfilment rate, years in business. Mono numbers, micro-uppercase labels. Hairline rule above and below.

### Product cards (catalogue)
- White surface, 1px `--rule` border, 8px radius.
- Photo top (16:9 ratio), padding 24px below.
- Title H2, sub-title small `--ink-muted`, mono-lg price, badge top-right (`Best seller` / `Low stock`).
- Hover: shadow `0 4px 12px rgba(10,22,40,0.06)` + 1px `--accent` border. **No translation, no scale.** 150ms ease-out.

### Order form
- Split layout on desktop: 6-col image / 6-col form card. Stacks on mobile.
- Form card: white surface, 1px `--rule`, 32px padding.
- Discount stack box: navy-tinted background `rgba(10,22,40,0.04)`, dotted top border before the final price line. Always shows: list price → tier discount line → promo discount line → effective price (mono-lg, navy).

### Why-Coolman pillars
- 3 columns. Each pillar: 3px solid `--accent` top border, then 24px gap, then numbered eyebrow (`01`, `02`, `03`), title H2, body.

### CTA panel (full-bleed navy)
- Full-bleed `--navy` background. White text. 96px vertical padding. Single CTA accent-fill. Used at most once per page, near the bottom.

### Admin tables
- White surface inside paper page. Header row: `--navy` background, white micro-uppercase text. Body rows: 1px `--rule` bottom border, hover `--paper`. Mono for IDs/prices/timestamps. Status pills inline.

### Status pills
- Pending: navy outline, navy text, white fill.
- Acknowledged: `--success` outline + text, white fill.
- Fulfilled: `--success` fill, white text.
- Cancelled: `--ink-muted` outline + text, white fill.
- Overdue: `--warn` outline + text, white fill.

---

## 6. Motion budget

**Total animation surface area allowed: 150ms ease-out, opacity and box-shadow only, on hover/focus/active states.**

### Allowed
- Color transitions on links, buttons, form fields. 150ms ease-out.
- Box-shadow change on card hover. 150ms ease-out.
- Border-color change on input focus. Instant (no transition needed).
- Skeleton pulse on initial data load. **Single 1.4s loop, opacity 0.4 → 0.8 → 0.4.** Stops the moment data arrives.

### Banned (do not implement, do not import a library that does)
- `animate-pulse` on anything that isn't a skeleton loader.
- `animate-bounce`, `animate-ping`, `animate-spin` (except a 16px loading icon inside a button — capped at one per page).
- Fade-up / slide-up entrance animations. No `animate-fade-up`, no `stagger-*`.
- Parallax backgrounds.
- Card lift / Y-translate on hover. Shadow change only.
- Page transitions. Hard-cut between routes.
- Counter animations on the trust bar. Numbers render at final value immediately.
- Auto-playing carousels. If a carousel exists at all, it requires explicit user action.
- Hero ken burns / zoom-on-load.
- Scroll-triggered reveal. All content renders in final state on first paint.

If a designer or library wants to add motion outside this list, the answer is no. The motion budget is a hard ceiling, not a starting point.

---

## 7. Copy voice

**Voice: tradesman first, marketer never.**

- Short sentences. 12–18 words is the sweet spot for body. 6–10 for headlines.
- Concrete nouns over abstract benefits. "Cuts reinforced concrete" beats "industry-leading cutting performance."
- Numbers over adjectives. "12mm segment height" beats "thick segment."
- No exclamation marks. Ever.
- No "we"-positioning paragraphs. "Coolman supplies blades to..." — third person is fine. First-person plural reads like a brochure.
- Calls to action are verbs. "Request quote", "View specs", "Submit order". Never "Get started", "Learn more", "Click here".
- Error messages name the thing and the fix. "Phone number must include country code (+60)" — not "Invalid input".

### Localization

- EN and BM strings live in the language file in Payload CMS. Never hardcode display copy in components.
- **EN and BM update simultaneously.** A PR that adds an EN string without the BM pair is a bug. If the BM translation isn't ready, ship the EN as the BM placeholder and tag it `pending-translation: true` in the language file — the admin UI will surface untranslated keys.
- BM number formatting: same as EN (1,234.56). RM prefix, never MYR.

---

## 8. Hard-rule UX (cross-cutting)

These exist in CLAUDE.md as code-level rules. The design surfaces of those rules:

- **Kill switch (`orders_paused = true`):** site-wide red banner at top of every page, full-width, `--danger` background, white text. Copy: "Order intake paused — Alan will resume shortly. Browse and save items to a wishlist." Submit buttons across the site disable. The banner pre-empts the top nav (sits above it).
- **Server-side write paths:** every form that submits shows a button-internal spinner during the network round-trip. Spinner is a 16px `border-2 border-white border-t-transparent` ring, single rotation, 700ms. Button text swaps to "Submitting…" — never disappears.
- **Effective-price stack-up:** every page that shows a price for a logged-in contractor shows the four-line discount stack (list → tier → promo → effective) before the submit CTA. Never collapse into a single number.
- **Search query logging:** every catalogue search fires a logging event. UX-invisible — the user sees nothing. If logging fails, the search still completes (logging is fire-and-forget).
- **Duplicate-order window (10 min):** if a contractor submits the same SKU within the window, a modal interrupts: "You submitted this 4 minutes ago. Submit again anyway?" Two buttons: "View previous order" (primary) / "Submit again" (ghost danger).

---

## 9. References

Anchor designs to scrutinize when in doubt. If a component drifts away from what these would do, it's drifting away from the brief.

| Site | What to learn from it |
|---|---|
| [hilti.com](https://www.hilti.com) | Top-of-funnel posture. Hero, product cards, trust signals, navy + accent treatment. |
| [husqvarnacp.com](https://www.husqvarnacp.com) | Industrial product photography rhythm. Spec-density without crowding. |
| [linear.app](https://linear.app) | Motion budget. Type tightening. Single-accent discipline. |
| [mcmaster.com](https://www.mcmaster.com) | Catalogue density. Spec-table readability. Search-first navigation. |
| [stripe.com](https://stripe.com) | Form clarity. Discount stack-up readability. Mono-for-numbers convention. |

---

## 10. V1 → V2 deltas

V1 ships with imagery limitations. These are knowingly accepted, not bugs:

| Surface | V1 | V2 trigger |
|---|---|---|
| Hero imagery | SVG-rendered diamond gradient | Real photo of blade cutting concrete (Alan delivers shoot) |
| Product card images | Whatever Alan uploads via Payload (mixed quality acceptable) | Standardized photoshoot, white background, consistent lighting |
| Site dark mode | Admin only | Public site dark mode follows OS preference |
| Carousel on PDP | None — single hero image per product | Multi-image gallery with thumbnail strip |
| Application case studies | Stub page | Full case-study layout with Alan's project photography |

When a V2 trigger fires, this file gets a new row noting the delta and the date it shipped. V1 limitations are not "tech debt" — they're the V1 spec.

---

## 11. Where things live

| What | Where |
|---|---|
| Color/font/spacing tokens | [`app/globals.css`](app/globals.css) |
| Component primitives | [`components/ui/`](components/ui/) (shadcn/ui — minimal overrides) |
| Display strings (EN + BM) | Payload CMS language collection (V1 build pending) |
| Photography assets | Vercel Blob (V1 build pending) |
| Tunable thresholds (alert hours, dup window) | Payload CMS settings collection |
| Color references for new components | This file. Don't sample from existing pages — they may be stale. |
