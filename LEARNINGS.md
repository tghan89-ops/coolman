
## — Payload schema changes: apply DDL directly, never `payload migrate:create`
- **Symptom:** `payload migrate:create` went interactive AND pulled in unrelated schema drift (email_deliveries enum, why_coolman advantages enum) — dangerous to answer blind; hung the terminal.
- **Cause:** This project runs the postgres adapter with `push:false` and keeps NO committed `migrations/` dir. Payload does NOT diff the schema at runtime with push off — it only queries. So `migrate:create` is the only thing that diffs, and it diffs the WHOLE DB, surfacing every pre-existing drift, not just your change.
- **Rule:** For a global/collection schema change, hand-write idempotent DDL (`scripts/sql/*.sql`, `ADD/DROP COLUMN IF [NOT] EXISTS`, `CREATE TABLE IF NOT EXISTS`) that matches Payload's exact naming, apply with `psql -f`, then reseed via a `tsx` script calling `payload.updateGlobal`. Group sub-fields → `group_field` columns (tabs add no prefix); BM field `xBM` → `x_b_m` (nullable); arrays → table `parent_group_array` with `_order int NN, _parent_id int NN FK→parent(id) ON DELETE CASCADE, id varchar PK`, required fields NOT NULL, `_order`/`_parent_id` btree indexes. Copy an existing array table's `pg_dump --schema-only` as the template. burned 2026-06-20

##  — local dev 500: Cannot resolve @payloadcms/db-postgres
- **Symptom:** `next dev` 500 on every page; `Module not found: @payloadcms/db-postgres` (payload.config.ts).
- **Cause:** local node_modules stale after the Vercel→Postgres migration — `@payloadcms/db-postgres` was declared in package.json but never installed locally (only the old db-vercel-postgres present).
- **Rule:** after pulling or when the payload DB adapter changes, run `pnpm install --no-frozen-lockfile` before `next dev`. Droplet already has it (prod adapter), so this is a local-only trap. burned 2026-06-20
