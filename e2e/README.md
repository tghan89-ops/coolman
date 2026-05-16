# End-to-end browser tests (Group 12)

These are Playwright tests — a real browser drives the real site. They are the automated
version of the "visual" UAT steps in `../../UAT.md`. They are **not** part of `pnpm test`
(that's the fast vitest unit/integration pass); run them separately.

## One-time setup

```bash
pnpm e2e:install   # downloads the browser binaries Playwright needs
```

## Running

You need a running site **and** the seed data from `UAT.md` → "Seed prerequisites"
(at least one Category / Material / Application / Machine Tier / Product, ideally a Contractor).

**Against a local dev server** (Playwright starts `pnpm dev` for you — needs the DB env vars set):

```bash
pnpm e2e
```

**Against a deployed / preview URL** (don't start a local server):

```bash
PLAYWRIGHT_BASE_URL=https://your-preview-url.vercel.app pnpm e2e
```

## What's covered

| Spec | What it checks | UAT step it mirrors |
|---|---|---|
| `catalogue.spec.ts` | `/products` loads, shows product cards, the stat strip renders, a filter chip narrows the grid and "Clear" resets it | Group 10 steps 1–3 |
| `product-detail.spec.ts` | clicking a card opens `/products/<id>`; a non-existent id shows the 404 page, not a crash | Group 10 step 4 |
| `language-toggle.spec.ts` | flipping EN ⇄ BM sets the `coolman-lang` cookie and the choice survives a reload | Group 9 step 1 |

These are **starter** specs — deliberately resilient (they assert "something product-like is
on the page", not exact copy) so they survive content edits. As features harden, add specs for
the order-submission guards (Group 5) and the admin Acknowledge flow (Group 7), which need a
logged-in contractor / admin session — see `auth.fixture.ts` for where that would plug in.

## Notes

- If a spec is skipped with "no products found", that's the seed data missing — not a bug.
- Failures dump a screenshot + trace under `playwright-report/` — open with `pnpm exec playwright show-report`.
