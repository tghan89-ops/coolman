# TODOS

## Visual page builder (Puck two-tier)
- [x] **Convert all editorial pages to locked-editable Puck blocks.** *(Verified 2026-06-21: 11 bespoke locked blocks built — Career, About, Applications, Resources, Trade, Contact, Brotherhood, Shibuya, Heritage, Why-Coolman, Legal. Wired into `puck/blocks/pages.tsx`, seeded to scratch at `<slug>-puck` (14 pages incl. 4 legal), all return HTTP 200 with content markers present; tsc clean on touched files; visual-editor safety suite 14/14.)*
  - **Locked-editable model:** layout frozen (no drag/duplicate/delete/insert), copy + lists editable inline; live data (settings/WhatsApp) injected via Puck `metadata`. Interactive bits (contact/shibuya/trade/brotherhood/why-coolman) extracted into `components/puck/*Section.tsx` client islands.
  - **Preview slugs (scratch DB only, live routes untouched):** about-puck, applications-puck, resources-puck, trade-puck, contact-puck, brotherhood-puck, shibuya-puck, heritage-puck, why-coolman-puck, cookies-puck, terms-puck, privacy-puck, returns-warranty-puck (+ career-puck).
  - [ ] **Decide heritage + why-coolman:** both were slated to retire — built per GH "all pages" but confirm keep-or-drop before cutover.
  - [ ] **Semantic divergences to confirm before cutover:**
    - Brotherhood: live page pulls dealers dynamically from CMS; the Puck block makes the dealer list an editable static array (seeded with 3 placeholders). If the directory must stay DB-driven, keep brotherhood in code.
    - Shibuya: machine/service images render as placeholder SVGs (a locked text block can't host media uploads — needs a Puck media field later); BM toggle dropped (EN-only, consistent with v1 plan); demo section reuses `storyHeadline`/`heroSub` (2-field add if they must be independent).
    - Legal pages are currently just placeholder "draft notice" pages — block is content-generic (title + lede + draft notice), ready for real legal text when counsel delivers it.
  - [ ] **Cutover (GH gate):** Pages/Navigation migration (`push:false`), route cutover for each page, commit + deploy. Not started — live routes stay as-is until GH approves.
- [ ] **Add Bahasa Malaysia (BM) support to visual (Puck) page bodies.**
  - **What:** Puck-built marketing pages are English-only in v1. Add BM versions of page body content.
  - **Why:** The rest of the site is bilingual (EN/BM via the language file); Puck page bodies are the one EN-only gap. A contractor switching to BM on a Puck page sees English body content.
  - **Current state:** Nav labels already support optional BM with EN fallback. Only page bodies are EN-only.
  - **Where to start:** wire Payload localization for the `Pages` collection `puckData` field, or store an EN/BM pair. Revisit after v1 ships and is validated.
  - **Depends on:** Puck two-tier build shipped first.
