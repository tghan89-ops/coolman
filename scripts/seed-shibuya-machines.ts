/**
 * Idempotent seed for the `shibuya-machines` collection.
 *
 * Coolman-stocked machines: TS-405, TS-605. TS-1000 seeded but is_active=false
 * (model unconfirmed per fact-check; Alan to verify before activating).
 * This seed lands the three records
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
    model_id: 'ts-405',
    model_name: 'TS-405',
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
    model_id: 'ts-605',
    model_name: 'TS-605',
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
    model_id: 'ts-255',
    model_name: 'TS-255',
    tagline: 'Mid-range rig · general cores.',
    taglineBM: 'Rig pertengahan · teras am.',
    description:
      'Mid-range core drill for cores up to 255 mm. Suitable for general construction penetrations, slab openings, and service cores. Versatile anchor options.',
    descriptionBM:
      'Penggerudi teras pertengahan untuk teras sehingga 255 mm. Sesuai untuk penembusan pembinaan am, bukaan papak, dan teras perkhidmatan. Pilihan sauh yang serba boleh.',
    max_diameter: 'Up to 255 mm',
    anchor: 'Vacuum or stud',
    anchorBM: 'Vakum atau stud',
    weight: '',
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
          // Payload's generated type is internal; cast at the boundary, runtime shape is guaranteed by SeedMachine.
          data: m as unknown as never,
        })
        console.log(`~ Updated: ${m.model_id} — ${m.model_name}`)
      } else {
        await payload.create({
          collection: 'shibuya-machines',
          // Payload's generated type is internal; cast at the boundary, runtime shape is guaranteed by SeedMachine.
          data: m as unknown as never,
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
