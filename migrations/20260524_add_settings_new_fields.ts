import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "settings"
      ADD COLUMN IF NOT EXISTS "demo_request_email"      varchar;
    ALTER TABLE "settings"
      ADD COLUMN IF NOT EXISTS "inventory_on_time_pct"   numeric(10,2);
    ALTER TABLE "settings"
      ADD COLUMN IF NOT EXISTS "inventory_dispatch_cutoff" varchar;

    ALTER TABLE "_settings_v"
      ADD COLUMN IF NOT EXISTS "version_demo_request_email"        varchar;
    ALTER TABLE "_settings_v"
      ADD COLUMN IF NOT EXISTS "version_inventory_on_time_pct"     numeric(10,2);
    ALTER TABLE "_settings_v"
      ADD COLUMN IF NOT EXISTS "version_inventory_dispatch_cutoff" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "demo_request_email";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "inventory_on_time_pct";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "inventory_dispatch_cutoff";

    ALTER TABLE "_settings_v" DROP COLUMN IF EXISTS "version_demo_request_email";
    ALTER TABLE "_settings_v" DROP COLUMN IF EXISTS "version_inventory_on_time_pct";
    ALTER TABLE "_settings_v" DROP COLUMN IF EXISTS "version_inventory_dispatch_cutoff";
  `)
}
