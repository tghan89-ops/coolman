# Coolman — Brand Voice

**Status:** V1 sensible-default. Date: 2026-05-17.

This file is the single source of truth for copy on the Coolman site. DESIGN.md governs tokens; BRAND-VOICE.md governs words. CLAUDE.md governs everything that crosses both.

The buyer is a Malaysian construction subcontractor on a deadline. Alan is the seller — twenty years in the trade, talks to contractors on WhatsApp every day. The site has to sound like Alan, not like a marketing department.

---

## 1. Four principles

### 1. Plain. The buyer is a contractor, not a marketer.
Write the way Alan talks to his customers on WhatsApp. Short sentences. Specific nouns. No copywriter padding. If a sentence could appear in a Hilti brochure and a fintech landing page interchangeably, it is the wrong sentence.

### 2. Specific over abstract.
"RM 247 saved per cut" beats "great value." "Klang Valley showroom, ground floor" beats "easy to find." "230mm wall saw blade, ships from KL" beats "premium cutting solution." A number, a place, a name — beats an adjective every time.

### 3. Symptom first, cause second, fix third.
Mirrors the CLAUDE.md working style. The contractor is on a deadline; lead with what they want to know. "Blade overheating on rebar cuts? Segment height too low for the material. Use a 12mm segment." Not: "We are pleased to introduce our new segment-height advisor."

### 4. Confident, not promotional.
State the fact. Skip the superlatives. "Coolman has been selling diamond blades since 2007" is enough. "Malaysia's leading premium provider of best-in-class diamond cutting solutions" is exactly what we never write. Confidence sounds like a tradesman who knows his trade; promotion sounds like he is trying too hard.

---

## 2. Vocabulary — use / avoid

### Use

- **Tool names — be specific.** "Diamond blade", "core bit", "wall saw blade", "segment", "bond", "12mm segment height". Name the tool the way the contractor names it on site.
- **Buyer names.** "Contractor", "site team", "your team", "site supervisor". Never "customer", never "user", never "client" except in the admin tier-pricing context.
- **Pricing terms — canonical.** "List price", "contract price" (the tier-discounted price), "effective price" (after tier and promo). Mirrors the CLAUDE.md hard rules. Never invent synonyms.
- **Action verbs.** "Submit an order request", "view specs", "request a quote", "WhatsApp us", "call sales". Never "Get started", "Learn more", "View details".
- **Confirmation pattern.** "We'll confirm by WhatsApp within the next two hours."
- **Numbers in arabic, with units.** "230mm", "RM 89", "14:00", "96%", "since 2007". Never spell out "two hundred thirty millimetres".

### Avoid (banned outright)

- **Generic CTAs.** "Get Started", "Watch Demo", "Learn More", "View Details", "Get Advice" — already banned by the hard rules. Replace with a verb that names the next action: "Submit order request", "View segment specs", "WhatsApp Alan", "Browse the catalogue".
- **Promotional padding.** "Premium", "best-in-class", "world-class", "industry-leading", "cutting-edge", "state-of-the-art", "next-generation", "world's first". None of these tell the contractor anything he can use.
- **SaaS cover-alls.** "Solutions" (as a noun-cover-all), "platform", "ecosystem", "experience", "journey", "vertical". Coolman sells diamond blades, not "cutting solutions."
- **Corporate boilerplate.** "We pride ourselves on...", "It is our pleasure to...", "Welcome to...", "At Coolman, we believe...". Strip these on sight.
- **Vague invites.** "Reach out", "get in touch", "feel free to". Use the concrete channel: "WhatsApp us at +6012-6363156" or "call sales on +60..." or "submit an order request here".
- **Em dashes in user-facing copy** (`—`). Use commas, semicolons, or full stops. Em dashes are fine in this file and other internal docs; the rule applies to copy that ships on the live site, where they read as marketing typesetting.

---

## 3. Sentence rhythm

- **Default sentence length: 8–14 words.** Run a long one when you mean it. Never two long sentences back-to-back; the reader stalls.
- **One idea per sentence.** Two ideas means two sentences. Two ideas in one sentence means one is buried.
- **Bury qualifiers, lead with the fact.** "Coolman has been in the trade since 2007" beats "Since 2007, Coolman has been in the trade." The fact (Coolman, trade) comes first; the qualifier (when) comes second.
- **Avoid passive voice.** "We ship from Klang Valley" beats "Orders are shipped from Klang Valley." The actor names itself.
- **Numbers as numerals.** "5 days", "230mm", "RM 89", "96%". Spelling out numbers in copy is a brochure tell.
- **Mono for numbers is a design rule, not a copy rule.** In the copy file, just write the number. The component decides the typeface.

---

## 4. Three-question pre-publish test

Before any copy ships — landing-page hero, product-card subtitle, error message, email confirmation, button label — run it past these three:

### 1. Would Alan say this to a contractor at the showroom?
If not, rewrite in plain spoken Malaysian English. The litmus test is: read the line aloud. If it sounds like a brochure or a press release, it fails.

### 2. What concrete fact is in this sentence?
A number, a place, a name, a date, a tool, a price, an action. If the answer is "none" — cut the sentence. Decorative sentences are the cost the contractor pays for our laziness.

### 3. Does this sound like a brochure?
If yes, strip the adjectives. "Premium diamond blades for industry-leading performance" → "230mm diamond blade, 12mm segment, ships from KL." The adjectives carry no information; the second sentence does.

---

## 5. Chinese pull-quotes appendix

The site uses three fixed Chinese pull-quotes as inline design elements. They are intentionally not translated, not toggled, and not part of `lib/i18n/copy.ts`. They live as literal strings in `components/editorial/Pullquote.tsx` as the `ChinesePullquote` variant. Placement is fixed:

| Page | Placement | Chinese | English meaning (internal note only — never rendered) |
|---|---|---|---|
| Home (`/`) | Between the fear grid and the Field Notes preview | **不要只卖产品，解决问题** | "Don't just sell products, solve problems" |
| Heritage (`/heritage`) | Mid-page | **生意不是比谁跑得久，而是谁撑得久** | "Business isn't about who runs fastest, it's about who lasts longest" |
| Why Coolman (`/why-coolman`) | Engineering Folio section | **工地会告诉你真相** | "The worksite will tell you the truth" |

**Do not "fix" these by adding BM translations.** They are intentional, by design. Full Chinese language version is V2. The English meanings above exist for our reference only and must never appear on the rendered page.

---

## 6. Versioning

When BRAND-VOICE.md and any copy file disagree, BRAND-VOICE.md wins — fix the copy in the same commit.

When BRAND-VOICE.md and a Coolman content drop disagree (Sessions 1–4 from Alan, stored at [`../content-drafts/`](../content-drafts/)), the content drop wins for that surface — and BRAND-VOICE.md is updated in the same commit to absorb the new authority. Never leave a drift in place.

Before porting any page copy, check `content-drafts/` for the relevant session file. Filename conventions and which session covers which surface are documented in that folder's README.

DESIGN.md governs tokens. BRAND-VOICE.md governs words. CLAUDE.md governs everything that crosses both.
