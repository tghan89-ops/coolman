# Coolman — Standing Orders

Read this first. Full system detail in `BRIEF.md`. Read that too before touching schema, auth, pricing logic, or anything that has broken before.

---

## Standards sync — every session start (run silently)

```bash
cd /tmp/gh-standards && git pull || git clone https://github.com/tghan89-ops/standards.git /tmp/gh-standards
```

Read `MY-STANDARDS.md`. If this project's `LEARNINGS.md` has new universal entries, promote them and push. Tell GH in one line what was promoted. If nothing, say nothing.

**First time only:**
```bash
git clone https://github.com/tghan89-ops/standards.git /tmp/gh-standards
```
Copy full contents of `MY-STANDARDS.md` into this project's `LEARNINGS.md` under `## Universal standards`.

---

## What this project is

B2B diamond tool platform for Coolman (Alan's business). Malaysian construction subcontractors browse a product catalogue, find the right blade, and submit order requests without calling Alan. Alan manages everything via Payload CMS.

**Full detail:** `BRIEF.md` — read it. It contains the V1 scope, auth model, pricing logic, data questions, open questions, and deployment notes. Do not rely on memory for any of these.

**Stack:** Next.js + Payload CMS, self-hosted on a **DigitalOcean droplet**. Email via Resend. Analytics via Google Analytics. No payment gateway in V1.

**Hosting — DigitalOcean droplet (NOT Vercel anymore; migrated off Vercel 2026-06-14):**
- Droplet "coolman": DigitalOcean, **Singapore (SGP1)**, Ubuntu 24.04, 2GB/1CPU, $12/mo. Public IP `167.71.204.168`.
- SSH: `ssh -i ~/.ssh/coolman_do root@167.71.204.168`. App dir `/opt/coolman`, prod env `/opt/coolman/.env`.
- Process: pm2 app `coolman` runs `node node_modules/next/dist/bin/next start -p 3000` (NEVER point pm2 at `.bin/next` — pnpm shell shim crashes under node). nginx `:80/:443` → `127.0.0.1:3000`.
- **Database:** local Postgres 16 on the droplet (db `coolman`, pw in `/root/.coolman_dbpass`). Adapter is `postgresAdapter` (`@payloadcms/db-postgres`), NOT the vercel one.
- **Files/photos:** local disk `/opt/coolman/media` (Vercel Blob disabled — no `BLOB_READ_WRITE_TOKEN`).
- **Live URL:** https://demo.coolman.com.my (Let's Encrypt SSL, auto-renew). Production domain `coolman.com.my` cuts over ~July 2026 on GH's say-so (DNS is in Exabytes cPanel Zone Editor).
- **Cron:** root crontab hits `/api/cron/unresponded-alert` hourly (replaced Vercel Cron).
- The old Vercel project + Neon DB still exist as a frozen fallback until cutover — do NOT edit content there; all CMS edits go to the droplet.

---

## Working style

**If even 1% unsure — stop and clarify.** State what you understand the task to be. Wait for confirmation.

**When you change one thing, chase everything linked to it.** Field rename → update all references. Schema change → update queries, types, migrations, UI. One incomplete change is worse than no change.

**Plain English in every reply.** GH is the MD, not a developer. Symptom first, cause second, fix third. Describe pages and buttons by what GH sees on screen.

**Every change ends with three sections:**
- **What changed** — one line per file. Name the behaviour shift, not the syntactic edit.
- **What to expect** — where to click, what appears, how to tell it's working.
- **Verification steps** — 1–5 actions, each = one action + expected result.

---

## Before planning any new feature — ask these first

Walk the cross-cutting checklist in `BRIEF.md` (rows 1–22). For any row that might apply, ask GH before writing the plan. If GH says "just do it," still confirm the three highest-risk rows: kill switch check, pricing logic, auth/permission gate.

---

## Hard rules — never break

- Never hardcode any option list. All lists (materials, applications, machine tiers, volume brackets, categories) live in Payload CMS. Admin-editable.
- Every order submission goes through the server-side API route. No direct frontend inserts.
- Every order write path checks the `orders_paused` kill switch before firing. No exceptions.
- Effective price shown to contractor = `list_price × (1 − tier_discount_pct) × (1 − promo_discount_pct)`. Always show this before submission. Never show list price only when discounts apply.
- Price visibility is gated by login and tier. Logged-out visitors see no prices anywhere — surface a "Sign in to see pricing" CTA in place of the price. Logged-in contractors with `tier_discount_pct = 0` see list price only. Logged-in contractors with `tier_discount_pct > 0` see the full list → tier → promo → effective stack-up. All price rendering goes through `PriceStackCard.tsx`; no page or card may read price fields directly.
- All display strings go through the language file. EN and BM files updated simultaneously — never one without the other. Exception: Three fixed Chinese pull-quotes (`不要只卖产品，解决问题` / `生意不是比谁跑得久，而是谁撑得久` / `工地会告诉你真相`) appear inline on the home, heritage, and why-coolman pages respectively as fixed design elements. They are intentionally not translated, not toggled, and not in `copy.ts`. They live as literal strings in the `Pullquote.tsx` `ChinesePullquote` variant. Do not "fix" this by adding BM translations — it is by design. Full Chinese language version is V2.
- Search query logging fires on every catalogue search. Never skip it to simplify a feature.
- Duplicate order window (10 min) lives in settings table. Never hardcode it.

---

## Critical field names

| Field | Correct name | Notes |
|---|---|---|
| Contractor permanent discount | `tier_discount_pct` | Decimal: 0.05 = 5%. Never integer. |
| Promo code discount | `promo_discount_pct` | Same format. Stacks with tier — never replaces. |
| Effective price | `effective_price` | Always derived. Never stored raw. |
| Order status | `order_status` | Enum: pending / acknowledged / fulfilled / cancelled. Never free text. |
| Unresponded alert threshold | `alert_threshold_hours` | Settings table. Default: 24. |
| Kill switch | `orders_paused` | Boolean. Global settings. Checked before every order write. |

---

## Before marking any task done

1. Write and run automated tests for the changed code. Critical path only — not just compilation.
2. Run `/review` (gstack) on changed files.
3. Run `/browse` (gstack) when UI behaviour needs confirming.
4. **Update `UAT.md`** — see the UAT section below.
5. **Update `TODOS.md`** — tick the line(s) this change closes, with a `*(Verified YYYY-MM-DD: <one-line evidence>)*` note. If the change spawns new follow-ups, add them as new lines under the right Group. **Never** leave a finished item unticked — the next session will waste time re-checking. **Never** tick something that isn't wired up end-to-end. If partially done, leave the parent unticked and add a child sub-task with what's still open. Drift between TODOS.md and the codebase is a recurring failure mode — treat closing TODOS.md lines as part of "done."
6. End every response with a plain-English verification checklist for GH.

---

## UAT.md — how it works

`UAT.md` is the single UAT punch list for the whole project. It uses a numbered-section + Who-tag format.

**Who tags:**
- 🤖 **Me, fully** — automated tests or code-level checks; no browser or human eyes needed.
- 🤝 **Me first, you confirm** — the underlying logic has a passing automated test; GH does the final "looks right on screen" pass.
- 👤 **Only you** — needs the live site, real admin area, a login, a file upload, or GH's own eyes.

**Rules for updating UAT.md as part of every task:**

- For every new behaviour shipped, add a new numbered line (or lines) under the right section.
- If there is an automated test or code check covering it → tag it 🤖, tick it `[x]`, and write what was confirmed.
- If the logic is tested but the screen still needs a look → tag it 🤝, leave it `[ ]`, add a note saying what the automated test covers.
- If it needs the live site, a login, an upload, or GH's eyes → tag it 👤, leave it `[ ]`.
- Never delete a line without GH's go-ahead — instead tick it `[x]` once confirmed.
- A ⚠️ note on a ticked line = it works but there is a small thing worth a look.
- One file covers everything — do not split into per-feature files.

---

## Capture errors as learnings

Fix the error. Then immediately append to `LEARNINGS.md`: symptom, cause, corrective rule, date (`burned YYYY-MM-DD`). Two sentences max.

---

## Commit, push, deploy — after every code change

```bash
git add <changed files>
git commit -m "concise message

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

---
**Deploy to the droplet — copy paste** (repo may be private, so ship a git-archive snapshot rather than `git pull` on the box):
```bash
# 1. From local repo (b_hEdh3FcwxmZ) after committing + pushing:
git archive --format=tar.gz -o /tmp/coolman.tgz HEAD
scp -i ~/.ssh/coolman_do /tmp/coolman.tgz root@167.71.204.168:/root/coolman.tgz

# 2. On the droplet (.env + node_modules survive the extract):
ssh -i ~/.ssh/coolman_do root@167.71.204.168
cd /opt/coolman
tar -xzf /root/coolman.tgz -C /opt/coolman
pnpm install --no-frozen-lockfile        # only if deps changed
NODE_OPTIONS="--max-old-space-size=2048" ./node_modules/.bin/next build
pm2 restart coolman
pm2 logs coolman --lines 20
```
Notes: pnpm v11 needs the native-build allowlist in `pnpm-workspace.yaml` (sharp/esbuild/swc) and `.npmrc` has `verify-deps-before-run=false` — both committed. Run the build via the `next` binary directly (not `pnpm build`) to dodge pnpm's pre-run deps check.
---

## Open questions — resolve before building the relevant feature

See `BRIEF.md` → Open Questions section. Do not build any feature that depends on an unresolved question without flagging it to GH first.

---

## Content sources — where Alan's drafts live

Alan's content drafts (Sessions 1–4) live at the project root in [`content-drafts/`](../content-drafts/). See [`content-drafts/README.md`](../content-drafts/README.md) for filename conventions and which session covers which surface.

Authority chain when porting copy to a page:

1. **Content draft** (in `content-drafts/`) wins on copy + section flow.
2. **Open-Design HTML** (project-root `*.html` files) wins on visual posture only.
3. **`BRAND-VOICE.md`** governs words across everything — when it contradicts a content draft, the content draft wins for that surface AND `BRAND-VOICE.md` is updated in the same commit to absorb the new authority. Never leave drift in place.

Before touching a page, check `content-drafts/` for the relevant session file. If it isn't there yet, stop and flag — do not fabricate Alan's voice.

Phase gating:
- Phase B (home, /heritage, Field Notes, etc.) needs Sessions 1 + 2.
- `/why-coolman` Engineering Folio needs Session 3.
- Catalogue intro, product page template, contact / trade pages, SEO meta need Session 4.

---

## Design System — read before any UI work

Single source of truth: [`b_hEdh3FcwxmZ/DESIGN.md`](b_hEdh3FcwxmZ/DESIGN.md). Posture is **Industrial Premium** (Hilti × Husqvarna anchors). Tokens live in [`b_hEdh3FcwxmZ/app/globals.css`](b_hEdh3FcwxmZ/app/globals.css). Canonical preview: [`design-preview-b.html`](design-preview-b.html).

**Hard design rules — never break:**
- Three type families maximum: **IBM Plex Sans** (UI), **Fraunces** (editorial h1/h2 hero blocks and Field Notes article headers only — never UI labels, buttons, navigation, or body copy), **JetBrains Mono** (numbers, prices, SKUs, dates, IDs). Inter is banned.
- Single accent: `--accent: #3B82F6`. Never two accent-blue CTAs in the same view.
- Mono on numbers (prices, SKUs, dates, IDs), never on prose.
- Motion ceiling: **150ms ease-out**, opacity + box-shadow only, hover/focus/active only. No fade-up, no stagger, no parallax, no Y-translate hover, no auto-play, no scroll-reveal, no counter animation.
- 4px spacing base. 48px CTA height. 44px tap-target floor.
- Semantic colors are desaturated: `--success: #0F8A4F`, `--warn: #D97706`, `--danger: #B91C1C`. Never the saturated counterparts.
- Effective price stack-up (list → tier → promo → effective) shows on every contractor-facing price surface. Never collapse to a single number.

When you change a token in `globals.css`, update DESIGN.md the same commit. When DESIGN.md and the code disagree, DESIGN.md wins — fix the code.

Copy authority: `b_hEdh3FcwxmZ/BRAND-VOICE.md`. Four principles, vocabulary use/avoid list, sentence rhythm rules, three-question pre-publish test. When BRAND-VOICE.md and any copy file disagree, BRAND-VOICE.md wins — fix the copy. DESIGN.md governs tokens; BRAND-VOICE.md governs words.

Database note (post-Vercel): production data lives in the droplet's local Postgres only. There are no Vercel preview deployments anymore. If a staging/test DB is ever needed, stand up a separate Postgres database on the droplet — never point a test environment at the production database.