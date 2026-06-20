-- Home Page global rewire — transactional landing (June 2026)
-- Rewires the `home-page` global schema from the old editorial structure
-- (opening / fearGrid / threeMythsIntro / brotherhoodIntro / alansLetter /
-- quietDoor / conversation) to the new transactional landing structure
-- (hero / trustBar / why / products / shibuya / contact) defined in
-- globals/HomePage.ts.
--
-- The DB adapter runs with push:false and Payload does NOT diff the schema at
-- runtime — it only queries. So this DDL must match globals/HomePage.ts exactly.
-- Idempotent and safe to re-run. Take a backup first.
--
--   psql "$DATABASE_URI" -f scripts/sql/2026-06-20-home-landing-rewire.sql
--
-- After running, reseed the global so admin shows the current copy:
--   tsx --env-file=.env scripts/seed-rewired-globals.ts

BEGIN;

-- ── 1. DROP old array tables ──────────────────────────────────────────────
DROP TABLE IF EXISTS home_page_fear_grid_cards;
DROP TABLE IF EXISTS home_page_alans_letter_paragraphs;
DROP TABLE IF EXISTS home_page_conversation_channels;

-- ── 2. DROP old flat columns ──────────────────────────────────────────────
ALTER TABLE home_page
  DROP COLUMN IF EXISTS opening_eyebrow,
  DROP COLUMN IF EXISTS opening_eyebrow_b_m,
  DROP COLUMN IF EXISTS opening_headline_prefix,
  DROP COLUMN IF EXISTS opening_headline_prefix_b_m,
  DROP COLUMN IF EXISTS opening_headline_emphasis,
  DROP COLUMN IF EXISTS opening_headline_emphasis_b_m,
  DROP COLUMN IF EXISTS opening_lede,
  DROP COLUMN IF EXISTS opening_lede_b_m,
  DROP COLUMN IF EXISTS opening_cta_primary,
  DROP COLUMN IF EXISTS opening_cta_primary_b_m,
  DROP COLUMN IF EXISTS opening_cta_secondary,
  DROP COLUMN IF EXISTS opening_cta_secondary_b_m,
  DROP COLUMN IF EXISTS fear_grid_eyebrow,
  DROP COLUMN IF EXISTS fear_grid_eyebrow_b_m,
  DROP COLUMN IF EXISTS fear_grid_headline,
  DROP COLUMN IF EXISTS fear_grid_headline_b_m,
  DROP COLUMN IF EXISTS three_myths_intro_eyebrow,
  DROP COLUMN IF EXISTS three_myths_intro_eyebrow_b_m,
  DROP COLUMN IF EXISTS three_myths_intro_headline,
  DROP COLUMN IF EXISTS three_myths_intro_headline_b_m,
  DROP COLUMN IF EXISTS three_myths_intro_lede,
  DROP COLUMN IF EXISTS three_myths_intro_lede_b_m,
  DROP COLUMN IF EXISTS three_myths_intro_cta_label,
  DROP COLUMN IF EXISTS three_myths_intro_cta_label_b_m,
  DROP COLUMN IF EXISTS brotherhood_intro_eyebrow,
  DROP COLUMN IF EXISTS brotherhood_intro_eyebrow_b_m,
  DROP COLUMN IF EXISTS brotherhood_intro_headline,
  DROP COLUMN IF EXISTS brotherhood_intro_headline_b_m,
  DROP COLUMN IF EXISTS brotherhood_intro_lede,
  DROP COLUMN IF EXISTS brotherhood_intro_lede_b_m,
  DROP COLUMN IF EXISTS brotherhood_intro_cta_label,
  DROP COLUMN IF EXISTS brotherhood_intro_cta_label_b_m,
  DROP COLUMN IF EXISTS alans_letter_eyebrow,
  DROP COLUMN IF EXISTS alans_letter_eyebrow_b_m,
  DROP COLUMN IF EXISTS alans_letter_signature,
  DROP COLUMN IF EXISTS alans_letter_signature_line2,
  DROP COLUMN IF EXISTS alans_letter_signature_line2_b_m,
  DROP COLUMN IF EXISTS quiet_door_eyebrow,
  DROP COLUMN IF EXISTS quiet_door_eyebrow_b_m,
  DROP COLUMN IF EXISTS quiet_door_headline,
  DROP COLUMN IF EXISTS quiet_door_headline_b_m,
  DROP COLUMN IF EXISTS quiet_door_lede,
  DROP COLUMN IF EXISTS quiet_door_lede_b_m,
  DROP COLUMN IF EXISTS quiet_door_cta_primary,
  DROP COLUMN IF EXISTS quiet_door_cta_primary_b_m,
  DROP COLUMN IF EXISTS quiet_door_cta_secondary,
  DROP COLUMN IF EXISTS quiet_door_cta_secondary_b_m,
  DROP COLUMN IF EXISTS conversation_eyebrow,
  DROP COLUMN IF EXISTS conversation_eyebrow_b_m,
  DROP COLUMN IF EXISTS conversation_headline,
  DROP COLUMN IF EXISTS conversation_headline_b_m,
  DROP COLUMN IF EXISTS conversation_lede,
  DROP COLUMN IF EXISTS conversation_lede_b_m;

-- ── 3. ADD new flat columns (all nullable varchar; group sub-fields) ───────
ALTER TABLE home_page
  ADD COLUMN IF NOT EXISTS hero_eyebrow varchar,
  ADD COLUMN IF NOT EXISTS hero_eyebrow_b_m varchar,
  ADD COLUMN IF NOT EXISTS hero_headline_line_one varchar,
  ADD COLUMN IF NOT EXISTS hero_headline_line_one_b_m varchar,
  ADD COLUMN IF NOT EXISTS hero_headline_line_two_prefix varchar,
  ADD COLUMN IF NOT EXISTS hero_headline_line_two_prefix_b_m varchar,
  ADD COLUMN IF NOT EXISTS hero_headline_emphasis varchar,
  ADD COLUMN IF NOT EXISTS hero_headline_emphasis_b_m varchar,
  ADD COLUMN IF NOT EXISTS hero_lede varchar,
  ADD COLUMN IF NOT EXISTS hero_lede_b_m varchar,
  ADD COLUMN IF NOT EXISTS hero_cta_primary varchar,
  ADD COLUMN IF NOT EXISTS hero_cta_primary_b_m varchar,
  ADD COLUMN IF NOT EXISTS hero_cta_secondary varchar,
  ADD COLUMN IF NOT EXISTS hero_cta_secondary_b_m varchar,
  ADD COLUMN IF NOT EXISTS hero_badge_tag varchar,
  ADD COLUMN IF NOT EXISTS hero_badge_tag_b_m varchar,
  ADD COLUMN IF NOT EXISTS hero_badge_value varchar,
  ADD COLUMN IF NOT EXISTS hero_badge_value_b_m varchar,
  ADD COLUMN IF NOT EXISTS why_eyebrow varchar,
  ADD COLUMN IF NOT EXISTS why_eyebrow_b_m varchar,
  ADD COLUMN IF NOT EXISTS why_heading varchar,
  ADD COLUMN IF NOT EXISTS why_heading_b_m varchar,
  ADD COLUMN IF NOT EXISTS products_eyebrow varchar,
  ADD COLUMN IF NOT EXISTS products_eyebrow_b_m varchar,
  ADD COLUMN IF NOT EXISTS products_heading varchar,
  ADD COLUMN IF NOT EXISTS products_heading_b_m varchar,
  ADD COLUMN IF NOT EXISTS shibuya_badge varchar,
  ADD COLUMN IF NOT EXISTS shibuya_badge_b_m varchar,
  ADD COLUMN IF NOT EXISTS shibuya_headline_line_one varchar,
  ADD COLUMN IF NOT EXISTS shibuya_headline_line_one_b_m varchar,
  ADD COLUMN IF NOT EXISTS shibuya_headline_line_two varchar,
  ADD COLUMN IF NOT EXISTS shibuya_headline_line_two_b_m varchar,
  ADD COLUMN IF NOT EXISTS shibuya_lede varchar,
  ADD COLUMN IF NOT EXISTS shibuya_lede_b_m varchar,
  ADD COLUMN IF NOT EXISTS shibuya_cta varchar,
  ADD COLUMN IF NOT EXISTS shibuya_cta_b_m varchar,
  ADD COLUMN IF NOT EXISTS contact_eyebrow varchar,
  ADD COLUMN IF NOT EXISTS contact_eyebrow_b_m varchar,
  ADD COLUMN IF NOT EXISTS contact_heading varchar,
  ADD COLUMN IF NOT EXISTS contact_heading_b_m varchar,
  ADD COLUMN IF NOT EXISTS contact_whatsapp_cta varchar,
  ADD COLUMN IF NOT EXISTS contact_whatsapp_cta_b_m varchar,
  ADD COLUMN IF NOT EXISTS contact_workshop_value varchar,
  ADD COLUMN IF NOT EXISTS contact_workshop_value_b_m varchar,
  ADD COLUMN IF NOT EXISTS contact_email_value varchar,
  ADD COLUMN IF NOT EXISTS contact_hours_value varchar,
  ADD COLUMN IF NOT EXISTS contact_hours_value_b_m varchar;

-- ── 4. CREATE new array tables ────────────────────────────────────────────
-- Structure matches Payload's convention (see home_page_fear_grid_cards):
--   _order integer NOT NULL, _parent_id integer NOT NULL, id varchar PK,
--   field columns (required = NOT NULL, *_b_m = nullable),
--   PK on id, FK _parent_id -> home_page(id) ON DELETE CASCADE,
--   btree indexes on _order and _parent_id.

CREATE TABLE IF NOT EXISTS home_page_hero_stats (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  id varchar NOT NULL,
  value varchar NOT NULL,
  label varchar NOT NULL,
  label_b_m varchar,
  CONSTRAINT home_page_hero_stats_pkey PRIMARY KEY (id),
  CONSTRAINT home_page_hero_stats_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES home_page(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS home_page_hero_stats_order_idx ON home_page_hero_stats USING btree (_order);
CREATE INDEX IF NOT EXISTS home_page_hero_stats_parent_id_idx ON home_page_hero_stats USING btree (_parent_id);

CREATE TABLE IF NOT EXISTS home_page_trust_bar_items (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  id varchar NOT NULL,
  text varchar NOT NULL,
  text_b_m varchar,
  CONSTRAINT home_page_trust_bar_items_pkey PRIMARY KEY (id),
  CONSTRAINT home_page_trust_bar_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES home_page(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS home_page_trust_bar_items_order_idx ON home_page_trust_bar_items USING btree (_order);
CREATE INDEX IF NOT EXISTS home_page_trust_bar_items_parent_id_idx ON home_page_trust_bar_items USING btree (_parent_id);

CREATE TABLE IF NOT EXISTS home_page_why_cards (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  id varchar NOT NULL,
  num varchar NOT NULL,
  title varchar NOT NULL,
  title_b_m varchar,
  body varchar NOT NULL,
  body_b_m varchar,
  CONSTRAINT home_page_why_cards_pkey PRIMARY KEY (id),
  CONSTRAINT home_page_why_cards_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES home_page(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS home_page_why_cards_order_idx ON home_page_why_cards USING btree (_order);
CREATE INDEX IF NOT EXISTS home_page_why_cards_parent_id_idx ON home_page_why_cards USING btree (_parent_id);

CREATE TABLE IF NOT EXISTS home_page_shibuya_bullets (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  id varchar NOT NULL,
  text varchar NOT NULL,
  text_b_m varchar,
  CONSTRAINT home_page_shibuya_bullets_pkey PRIMARY KEY (id),
  CONSTRAINT home_page_shibuya_bullets_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES home_page(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS home_page_shibuya_bullets_order_idx ON home_page_shibuya_bullets USING btree (_order);
CREATE INDEX IF NOT EXISTS home_page_shibuya_bullets_parent_id_idx ON home_page_shibuya_bullets USING btree (_parent_id);

CREATE TABLE IF NOT EXISTS home_page_shibuya_stats (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  id varchar NOT NULL,
  value varchar NOT NULL,
  label varchar NOT NULL,
  label_b_m varchar,
  CONSTRAINT home_page_shibuya_stats_pkey PRIMARY KEY (id),
  CONSTRAINT home_page_shibuya_stats_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES home_page(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS home_page_shibuya_stats_order_idx ON home_page_shibuya_stats USING btree (_order);
CREATE INDEX IF NOT EXISTS home_page_shibuya_stats_parent_id_idx ON home_page_shibuya_stats USING btree (_parent_id);

CREATE TABLE IF NOT EXISTS home_page_shibuya_tags (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  id varchar NOT NULL,
  text varchar NOT NULL,
  text_b_m varchar,
  CONSTRAINT home_page_shibuya_tags_pkey PRIMARY KEY (id),
  CONSTRAINT home_page_shibuya_tags_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES home_page(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS home_page_shibuya_tags_order_idx ON home_page_shibuya_tags USING btree (_order);
CREATE INDEX IF NOT EXISTS home_page_shibuya_tags_parent_id_idx ON home_page_shibuya_tags USING btree (_parent_id);

COMMIT;
