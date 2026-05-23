import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "products_documents" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "title_b_m" varchar,
      "file_id" integer
    );

    ALTER TABLE "products_documents"
      ADD CONSTRAINT "products_documents_file_id_media_id_fk"
      FOREIGN KEY ("file_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "products_documents"
      ADD CONSTRAINT "products_documents_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "products_documents_order_idx"
      ON "products_documents" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "products_documents_parent_id_idx"
      ON "products_documents" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "products_documents_file_idx"
      ON "products_documents" USING btree ("file_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "products_documents" CASCADE;
  `)
}
