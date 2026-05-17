/**
 * Idempotent seed for the `shibuya-machines` collection.
 *
 * Source of truth: project-root `shibuya.html` (TS-403 / TS-602 / TS-1000).
 * The legacy global had the wrong roster (TS-132/162/252/402) — that array
 * has been dropped. This seed lands the three real Coolman-stocked machines
 * with EN + BM copy, leaving spec values that shibuya.html does not supply
 * (motor_power, rpm_range, price, bond_match) blank for Alan to fill in
 * later via the admin UI. Hero images stay unset for now — Alan supplies
 * those post-launch.
 *
 * Idempotency: keyed off `model_id`. Re-running updates existing rows
 * in-place instead of duplicating. Safe to run after every deploy.
 *
 *   npx tsx --env-file=.env.local scripts/seed-shibuya-machines.ts
 */

import { getPayload } from 'payload'
import config from '@payload-config'

type SeedMachine = {
  model_id: string
  model_name: string
  tagline: string
  taglineBM: string
  description: string
  descriptionBM: string
  max_diameter: string
  anchor: string
  anchorBM: string
  weight: string
  display_order: number
  is_active: boolean
}

const machines: SeedMachine[] = [
  {
    model_id: 'ts-403',
    model_name: 'TS-403',
    tagline: 'Compact rig · MEP cores.',
    taglineBM: 'Rig padat · teras MEP.',
    description:
      'Hand-portable core drill for service penetrations up to 152 mm. Vacuum-anchor base, single-speed motor. The rig that pairs with most renovation and fit-out work.',
    descriptionBM:
      'Penggerudi teras mudah alih untuk penembusan perkhidmatan sehingga 152 mm. Tapak sauh vakum, motor satu kelajuan. Rig yang sepadan dengan kebanyakan kerja pengubahsuaian dan kemasan dalaman.',
    max_diameter: '25–152 mm',
    anchor: 'Vacuum or stud',
    anchorBM: 'Vakum atau stud',
    weight: '14.2 kg',
    display_order: 10,
    is_active: true,
  },
  {
    model_id: 'ts-602',
    model_name: 'TS-602',
    tagline: 'Structural rig · podium cores.',
    taglineBM: 'Rig struktur · teras podium.',
    description:
      'Three-speed motor, servo feed, hydraulic counterbalance. For cores 152–400 mm through reinforced podium and basement slabs. The MRT3 contractor standard.',
    descriptionBM:
      'Motor tiga kelajuan, suapan servo, pengimbang hidraulik. Untuk teras 152–400 mm menembusi papak podium dan ruang bawah tanah bertetulang. Standard kontraktor MRT3.',
    max_diameter: '152–400 mm',
    anchor: 'Stud or magnetic',
    anchorBM: 'Stud atau magnet',
    weight: '38.6 kg',
    display_order: 20,
    is_active: true,
  },
  {
    model_id: 'ts-1000',
    model_name: 'TS-1000',
    tagline: 'Heavy rig · deep cores.',
    taglineBM: 'Rig berat · teras dalam.',
    description:
      'The largest Shibuya. 600 mm cores through full-depth structural elements. Servo-controlled feed, dual hydraulic columns, sub-millimetre hole runout over 1.2 m of depth.',
    descriptionBM:
      'Shibuya terbesar. Teras 600 mm menembusi elemen struktur sepenuh kedalaman. Suapan kawalan servo, dua tiang hidraulik, lariannya kurang daripada satu milimeter pada kedalaman 1.2 m.',
    max_diameter: '300–600 mm',
    anchor: 'Dual-stud rail',
    anchorBM: 'Rel stud kembar',
    weight: '112 kg',
    display_order: 30,
    is_active: true,
  },
]

async function seed() {
  const payload = await getPayload({ config })

  console.log(`Seeding ${machines.length} Shibuya machines...`)

  for (const m of machines) {
    try {
      // Check by model_id (unique key per collection schema).
      const existing = await payload.find({
        collection: 'shibuya-machines',
        where: { model_id: { equals: m.model_id } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        const id = existing.docs[0].id
        await payload.update({
          collection: 'shibuya-machines',
          id,
          data: m as any,
        })
        console.log(`~ Updated: ${m.model_id} — ${m.model_name}`)
      } else {
        await payload.create({
          collection: 'shibuya-machines',
          data: m as any,
        })
        console.log(`+ Created: ${m.model_id} — ${m.model_name}`)
      }
    } catch (err) {
      console.error(`x Failed: ${m.model_id}`, err)
    }
  }

  console.log('Done.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
