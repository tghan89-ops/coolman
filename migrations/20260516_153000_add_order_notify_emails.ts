import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "settings"
      ADD COLUMN IF NOT EXISTS "order_notify_emails" varchar;
    ALTER TABLE "_settings_v"
      ADD COLUMN IF NOT EXISTS "version_order_notify_emails" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "order_notify_emails";
    ALTER TABLE "_settings_v" DROP COLUMN IF EXISTS "version_order_notify_emails";
  `)
}
