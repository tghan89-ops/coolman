import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "settings"
      ADD COLUMN IF NOT EXISTS "whatsapp_number"       varchar;
    ALTER TABLE "settings"
      ADD COLUMN IF NOT EXISTS "legal_entity_name"     varchar;
    ALTER TABLE "settings"
      ADD COLUMN IF NOT EXISTS "legal_entity_reg_no"   varchar;
    ALTER TABLE "settings"
      ADD COLUMN IF NOT EXISTS "legal_entity_address"  varchar;
    ALTER TABLE "settings"
      ADD COLUMN IF NOT EXISTS "opening_hours_mon_fri" varchar;
    ALTER TABLE "settings"
      ADD COLUMN IF NOT EXISTS "opening_hours_sat"     varchar;
    ALTER TABLE "settings"
      ADD COLUMN IF NOT EXISTS "opening_hours_sun"     varchar;

    ALTER TABLE "_settings_v"
      ADD COLUMN IF NOT EXISTS "version_whatsapp_number"       varchar;
    ALTER TABLE "_settings_v"
      ADD COLUMN IF NOT EXISTS "version_legal_entity_name"     varchar;
    ALTER TABLE "_settings_v"
      ADD COLUMN IF NOT EXISTS "version_legal_entity_reg_no"   varchar;
    ALTER TABLE "_settings_v"
      ADD COLUMN IF NOT EXISTS "version_legal_entity_address"  varchar;
    ALTER TABLE "_settings_v"
      ADD COLUMN IF NOT EXISTS "version_opening_hours_mon_fri" varchar;
    ALTER TABLE "_settings_v"
      ADD COLUMN IF NOT EXISTS "version_opening_hours_sat"     varchar;
    ALTER TABLE "_settings_v"
      ADD COLUMN IF NOT EXISTS "version_opening_hours_sun"     varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "whatsapp_number";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "legal_entity_name";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "legal_entity_reg_no";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "legal_entity_address";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "opening_hours_mon_fri";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "opening_hours_sat";
    ALTER TABLE "settings" DROP COLUMN IF EXISTS "opening_hours_sun";

    ALTER TABLE "_settings_v" DROP COLUMN IF EXISTS "version_whatsapp_number";
    ALTER TABLE "_settings_v" DROP COLUMN IF EXISTS "version_legal_entity_name";
    ALTER TABLE "_settings_v" DROP COLUMN IF EXISTS "version_legal_entity_reg_no";
    ALTER TABLE "_settings_v" DROP COLUMN IF EXISTS "version_legal_entity_address";
    ALTER TABLE "_settings_v" DROP COLUMN IF EXISTS "version_opening_hours_mon_fri";
    ALTER TABLE "_settings_v" DROP COLUMN IF EXISTS "version_opening_hours_sat";
    ALTER TABLE "_settings_v" DROP COLUMN IF EXISTS "version_opening_hours_sun";
  `)
}
