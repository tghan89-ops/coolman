import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

// payload_locked_documents_rels was created by the initial migration with the
// collections that existed at that time. Three collections were added later
// (posts, shibuya-machines, dealers) without a corresponding rels migration,
// so their _id columns are absent — causing the admin dashboard to 500 when
// Payload queries the locked-documents relation table.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "posts_id" integer;
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "shibuya_machines_id" integer;
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "dealers_id" integer;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_posts_fk"
        FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_shibuya_machines_fk"
        FOREIGN KEY ("shibuya_machines_id") REFERENCES "public"."shibuya_machines"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_dealers_fk"
        FOREIGN KEY ("dealers_id") REFERENCES "public"."dealers"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_posts_id_idx"
      ON "payload_locked_documents_rels" USING btree ("posts_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_shibuya_machines_id_idx"
      ON "payload_locked_documents_rels" USING btree ("shibuya_machines_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_dealers_id_idx"
      ON "payload_locked_documents_rels" USING btree ("dealers_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "payload_locked_documents_rels_posts_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_shibuya_machines_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_dealers_id_idx";
  `)
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_posts_fk";
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_shibuya_machines_fk";
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_dealers_fk";
  `)
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "posts_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "shibuya_machines_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "dealers_id";
  `)
}
