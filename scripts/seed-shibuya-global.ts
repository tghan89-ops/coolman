/**
 * Seed the shibuya-page global with corrected factual values.
 *
 * Safe to re-run — overwrites only the fields listed below.
 *
 *   npx tsx --env-file=.env.local scripts/seed-shibuya-global.ts
 */

import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    slug: 'shibuya-page',
    data: {
      hero: {
        badgeSince: 'Sole MY Partner Since 2014',
        subheadline:
          'Shibuya Tools, Hiroshima, has built precision core drilling machines since 1952. Coolman has built diamond segments calibrated for Malaysian aggregate since 1998. The partnership matches the machine to the ground — and the ground to the machine.',
        subheadlineBM:
          'Shibuya Tools, Hiroshima, telah membina mesin penggerudi teras berketepatan sejak 1952. Coolman telah membina segmen berlian yang dikalibrasi untuk agregat Malaysia sejak 1998.',
      },
      machineStory: {
        col1Tag: 'Shibuya · Since 1952',
        col1TagBM: 'Shibuya · Sejak 1952',
        col1Body:
          'Shibuya core drilling machines are precision instruments. Hand-built in Hiroshima. Servo-controlled feed rate, hydraulic counterbalance, magnetic-anchor and vacuum-anchor base systems, hole-runout tolerances measured in the tens of microns.\n\nWhat has not changed across decades of Shibuya engineering: the machine is not the wear part. The blade is.',
      },
      serviceSection: {
        eyebrow: 'In-house service · Since 2014',
        eyebrowBM: 'Servis dalaman · Sejak 2014',
      },
      cta: {
        body: 'Whether you are buying a new Shibuya rig, sending one in for annual calibration, or wondering which line fits a job — the engineering desk handles all of it. Same number.',
      },
    } as any,
  })

  console.log('✓ shibuya-page global updated')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
