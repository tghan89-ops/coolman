import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "shibuya_machines"
      RENAME COLUMN "bond_match_b_m" TO "bond_matchbm";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "shibuya_machines"
      RENAME COLUMN "bond_matchbm" TO "bond_match_b_m";
  `)
}
