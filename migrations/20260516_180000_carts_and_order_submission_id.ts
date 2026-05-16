import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // carts table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "carts" (
      "id" serial PRIMARY KEY,
      "contractor_id" integer NOT NULL UNIQUE REFERENCES "contractors"("id") ON DELETE CASCADE,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "carts_contractor_id_idx" ON "carts"("contractor_id");
  `)

  // carts_items join table (Payload array convention)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "carts_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "carts"("id") ON DELETE CASCADE,
      "id" varchar PRIMARY KEY,
      "product_id" integer NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
      "quantity" numeric NOT NULL,
      "added_at" timestamp with time zone NOT NULL
    );
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "carts_items_parent_id_idx" ON "carts_items"("_parent_id");
    CREATE INDEX IF NOT EXISTS "carts_items_order_idx" ON "carts_items"("_order");
  `)

  // orders.submission_id
  await db.execute(sql`
    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "submission_id" varchar;
  `)
  await db.execute(sql`
    UPDATE "orders" SET "submission_id" = "idempotency_key" WHERE "submission_id" IS NULL;
  `)
  await db.execute(sql`
    ALTER TABLE "orders" ALTER COLUMN "submission_id" SET NOT NULL;
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "orders_submission_id_idx" ON "orders"("submission_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP INDEX IF EXISTS "orders_submission_id_idx";`)
  await db.execute(sql`ALTER TABLE "orders" DROP COLUMN IF EXISTS "submission_id";`)
  await db.execute(sql`DROP TABLE IF EXISTS "carts_items";`)
  await db.execute(sql`DROP TABLE IF EXISTS "carts";`)
}
