import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "login_attempts" (
      "id"           uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "user_email"   varchar                                    NOT NULL,
      "attempted_at" timestamp(3) with time zone               NOT NULL,
      "success"      boolean                        DEFAULT false,
      "ip_address"   varchar,
      "user_agent"   varchar,
      "updated_at"   timestamp(3) with time zone               NOT NULL,
      "created_at"   timestamp(3) with time zone               NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "login_attempts_user_email_idx" ON "login_attempts" ("user_email");
    CREATE INDEX IF NOT EXISTS "login_attempts_attempted_at_idx" ON "login_attempts" ("attempted_at");
    CREATE INDEX IF NOT EXISTS "login_attempts_created_at_idx"   ON "login_attempts" ("created_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "login_attempts";
  `)
}
