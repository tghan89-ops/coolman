import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "contractors"
      ADD COLUMN IF NOT EXISTS "email_verification_token" varchar,
      ADD COLUMN IF NOT EXISTS "email_verification_sent_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "registration_ip" varchar;

    ALTER TABLE "_contractors_v"
      ADD COLUMN IF NOT EXISTS "version_email_verification_token" varchar,
      ADD COLUMN IF NOT EXISTS "version_email_verification_sent_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "version_registration_ip" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "contractors"
      DROP COLUMN IF EXISTS "email_verification_token",
      DROP COLUMN IF EXISTS "email_verification_sent_at",
      DROP COLUMN IF EXISTS "registration_ip";

    ALTER TABLE "_contractors_v"
      DROP COLUMN IF EXISTS "version_email_verification_token",
      DROP COLUMN IF EXISTS "version_email_verification_sent_at",
      DROP COLUMN IF EXISTS "version_registration_ip";
  `)
}
