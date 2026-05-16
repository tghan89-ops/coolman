import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "orders"
      ADD COLUMN IF NOT EXISTS "alerted_at" timestamp(3) with time zone;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_email_deliveries_email_type" AS ENUM('order_confirmation', 'unresponded_alert');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    ALTER TABLE "email_deliveries"
      ADD COLUMN IF NOT EXISTS "email_type" "public"."enum_email_deliveries_email_type";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "alerted_at";
    ALTER TABLE "email_deliveries" DROP COLUMN IF EXISTS "email_type";
    DROP TYPE IF EXISTS "public"."enum_email_deliveries_email_type";
  `)
}
