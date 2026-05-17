# Coolman — Roadmap

**Last updated:** May 2026

---

## V1 — Foundation (Current Build)

**Goal:** Replace Alan's WhatsApp as the primary reorder channel for existing contractors. Establish Coolman's professional presence online.

**Launch gate:** 100+ SKUs loaded in Payload CMS (EN + BM) with photos and YouTube links. Alan accountable.

### V1 priority block — Open-Design Variant C port + content launch (do these first)

**Why first:** GH approved Open-Design Variant C as the visual posture and Sessions 1–2 of the Coolman content draft (with Sessions 3–4 inbound). The site is not live to public yet. Locking the visual + content shell before the remaining feature work means every later feature lands on the final design rather than getting re-skinned twice.

- [ ] Backend additions: Settings fields (opening_hours, whatsapp_number, legal_entity_name + reg_no + address), Posts fields (related_products, is_published), new ShibuyaMachines collection (seeded), new Dealers collection
- [ ] Inventory stats endpoint (SKU count, diameter range, on-time %, active accounts)
- [ ] Design tokens — Fraunces serif loaded, --accent-light token, DESIGN.md amended, BRAND-VOICE.md created
- [ ] Official Coolman logo lifted from www.coolman.com.my, wired into header/footer/favicon/og
- [ ] Shared component library — editorial/, industrial/, catalogue/ folders
- [ ] PriceStackCard.tsx with three-state visibility gate (logged-out / logged-in no-tier / logged-in with tier)
- [ ] Home page port — 8-section flow from Session 1 (opening surface → fear grid → three myths → Brotherhood System → Field Notes preview → note from Alan → quiet door → conversation)
- [ ] /heritage page (Session 1 heritage section + timeline with Alan-supplied TBC years)
- [ ] /brotherhood dealer directory + DealerCard with WhatsApp + Google Maps deep-links
- [ ] Field Notes index + article template; load Session 2 three drafts as unpublished
- [ ] Shibuya page using ShibuyaMachines collection
- [ ] Products catalogue + product detail port (with price gate)
- [ ] Contact page port
- [ ] /why-coolman placeholder (Engineering Folio — awaiting Session 3)
- [ ] Bilingual copy extracted to copy.ts (EN + BM same commit); Chinese pull-quotes hardcoded inline
- [ ] Email mailboxes live: sales@/parts@/training@/careers@coolman.com.my
- [ ] WhatsApp number +6012-6363156 seeded in Settings, rendered everywhere
- [ ] Legal entity name "Coolman Malaysia Sdn Bhd" seeded in Settings, surfaced in footer + contact + legal pages + order emails
- [ ] Real numbers wired (247 SKUs, 100–900mm, 96% on-time, ~500 accounts, ≤14:00 cut-off)
- [ ] Field Notes nav link gate (hidden until ≥3 published; Alan resolves TBCs)
- [ ] CLAUDE.md amended (typography count, price-gate hard rule, Chinese pull-quote bilingual carve-out, BRAND-VOICE.md authority)

**Gated on inbound content:**
- [ ] /why-coolman Engineering Folio — gated on Session 3 (three myths long-form, Brotherhood philosophy, technical thesis)
- [ ] Applications + Catalogue intro + Product page template + Contact/trade copy + SEO meta — gated on Session 4

### Core features
- [ ] Product catalogue — 100+ SKUs, EN + BM, photos, YouTube embeds, specs, application guidance
- [ ] Contractor self-registration and login (browse free, login to order)
- [ ] Order request submission flow — logged-in contractors only, no payment
- [ ] Two-layer additive pricing — tier discount per account + promotional codes
- [ ] Email notifications — Alan + Pushpa on every order submission (Resend)
- [ ] Proactive unresponded-order alert — configurable threshold (default 24h)
- [ ] Admin dashboard — order management, customer accounts
- [ ] Export — order requests and customer list to Excel and PDF
- [ ] Mobile-optimised admin view for Alan
- [ ] Search query logging — every catalogue search and product view
- [ ] Weekly search trend aggregation job — dashboard + email to Alan
- [ ] Kill switch — admin toggle to pause all order submissions
- [ ] Duplicate order detection and flagging
- [ ] Bulk product data import (CSV)
- [ ] Payload CMS — manual photo upload and YouTube link embed per SKU

### V1 success metrics
- Repeat contractors submitting orders via platform (not WhatsApp) within 60 days of launch
- Alan opening weekly trends email consistently after week 4
- Zero order submission bugs in first 30 days
- Marketing staff managing content independently without GH involvement within 2 weeks of training

---

## V2 — Configurator (After V1 Stable)

**Goal:** Deflect new contractor enquiries away from Alan's WhatsApp by giving them a self-serve blade selection tool.

**Gate:** Alan completes knowledge extraction session with GH — top 10 most common enquiry scenarios mapped into a lookup table. This must be calendared before V1 launches.

### Core features
- [ ] Guided configurator — material → application → machine power tier → volume bracket → blade recommendation
- [ ] Configurator lookup table — managed by Alan's marketing staff in Payload CMS
- [ ] Recommendation output — 2–3 blade options with pros/cons comparison (lifespan, speed, edge quality)
- [ ] Direct add-to-order from configurator output
- [ ] Configurator search query logging — feeds into trends dashboard
- [ ] Pushpa sales staff permission tier — view orders and customer accounts, no CMS access

### V2 success metrics
- Measurable reduction in Alan's daily WhatsApp enquiries after configurator launch
- Configurator completion rate above 60% (users who start it, finish it)
- Alan using configurator search data to make at least one stocking decision within 90 days

---

## V3 — Intelligence + Commerce (After V2 Stable)

**Goal:** Add AI-assisted edge cases for the configurator and move toward direct online transactions when volume justifies it.

**Gate:** Configurator lookup table complete and verified by Alan. Direct order volume from V1/V2 justifies payment integration overhead.

### Candidate features
- [ ] Claude AI edge case handling — when contractor's combination doesn't match any pre-mapped scenario, Claude reads product data and recommends with confidence indicator
- [ ] Payment gateway — direct online payment (Stripe or local Malaysian gateway: iPay88, Billplz)
- [ ] Contractor order history — view past orders, one-tap reorder
- [ ] Contractor photo upload on order request — for machine verification edge cases
- [ ] WhatsApp Business API notifications — as supplement to email when volume warrants
- [ ] Dealer/distributor portal — separate login tier, volume pricing, bulk order submission

### V3 success metrics
- Direct online transaction volume justifying payment gateway fees within 90 days of launch
- AI recommendation acceptance rate (contractors who see AI recommendation and proceed to order)
- Dealer portal active accounts within 60 days

---

## Parking Lot (No Version Assigned)

Ideas that surfaced but need more validation before scheduling:

- **API integration with Alan's inventory system** — when Coolman has a formalised inventory system worth integrating
- **Contractor-facing order tracking** — status updates from Alan's fulfilment process
- **Product comparison tool** — side-by-side spec comparison for 2–3 blades
- **Coolman knowledge base / blog** — application guides, how-to content for SEO and credibility
- **Mobile app (iOS/Android)** — only if web PWA proves insufficient for contractor usage patterns

---

## Pre-Build Dependencies (Blocking V1 Start)

| Dependency | Owner | Status |
|---|---|---|
| Alan + GH agree on post-launch support model | GH to initiate | ⬜ Open |
| Alan walked through additive discount risk with worked example | GH to demonstrate | ⬜ Open |
| Alan confirms three data questions for trends dashboard | GH to consult Alan | ⬜ Open |
| V2 configurator knowledge extraction session calendared | Alan + GH | ⬜ Open |

---

## Pre-Launch Dependencies (Blocking V1 Launch)

| Dependency | Owner | Status |
|---|---|---|
| 100+ SKUs loaded in Payload CMS (EN + BM, photos, YouTube links) | Alan (marketing staff executes) | ⬜ Open |
| Additive discount model demonstrated and signed off by Alan | GH | ⬜ Open |
| Marketing staff trained on Payload CMS | GH | ⬜ Open |
| Alan's existing contractor list notified of platform with onboarding offer (e.g. 5% promo code for first order) | Alan | ⬜ Open |
| Authorized dealer roster supplied (name, area, address, WhatsApp, Google Maps coords per dealer) | Alan | ⬜ Open |
