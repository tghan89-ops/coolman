-- Run once on Vercel Postgres after provisioning (Group 0).
-- Required for BM-language search trend aggregation.
-- Without this, "Granit", "granit", and "gránit" are 3 separate rows in the weekly top-10.
-- Trends query uses: GROUP BY LOWER(unaccent(query_normalized))
CREATE EXTENSION IF NOT EXISTS unaccent;
