import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "settings"
      ADD COLUMN IF NOT EXISTS "contact_email_sales"    varchar;
    ALTER TABLE "settings"
      ADD COLUMN IF NOT EXISTS "contact_email_parts"    varchar;
    ALTER TABLE "settings"
      ADD COLUMN IF NOT EXISTS "contact_email_training" varchar;
    ALTER TABLE "settings"
      ADD COLUMN IF NOT EXISTS "contact_email_careers"  varchar;

    ALTER TABLE "_settings_v"
      ADD COLUMN IF NOT EXISTS "version_contact_email_sales"    varchar;
    ALTER TABLE "_settings_v"
      ADD COLUMN IF NOT EXISTS "version_contact_email_parts"    varchar;
    ALTER TABLE "_settings_v"
      ADD COLUMN IF NOT EXISTS "version_contact_email_training" varchar;
    ALTER TABLE "_settings_v"
      ADD COLUMN IF NOT EXISTS "version_contact_email_careers"  varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "contact_email_sales";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "contact_email_parts";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "contact_email_training";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "contact_email_careers";

    ALTER TABLE "_settings_v" DROP COLUMN IF EXISTS "version_contact_email_sales";
    ALTER TABLE "_settings_v" DROP COLUMN IF EXISTS "version_contact_email_parts";
    ALTER TABLE "_settings_v" DROP COLUMN IF EXISTS "version_contact_email_training";
    ALTER TABLE "_settings_v" DROP COLUMN IF EXISTS "version_contact_email_careers";
  `)
}
