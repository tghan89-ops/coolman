import {
  getGlobal,
  getActiveShibuyaMachines,
  type RawShibuyaMachineRow,
} from '@/lib/payload'
import { ShibuyaClient, type ShibuyaMachine } from '@/components/pages/ShibuyaClient'

// Match the home page revalidate cadence — machines change rarely but admins
// should not have to wait long for a publish to surface on the public page.
// (Live-preview against the global keeps editorial copy instant; the machine
// roster comes from a collection and is cached for `revalidate` seconds.)
export const revalidate = 60

export default async function ShibuyaPage() {
  const [shibuyaData, rawMachines] = await Promise.all([
    getGlobal('shibuya-page'),
    getActiveShibuyaMachines(),
  ])

  // Normalise the Payload row shape to the client component's expected
  // contract. Defensive: drop any row missing the required identity strings
  // so the tab list and detail pane always have stable keys + labels.
  const machines: ShibuyaMachine[] = rawMachines
    .filter(
      (m: RawShibuyaMachineRow) =>
        typeof m?.model_id === 'string' && m.model_id.trim() !== '' &&
        typeof m?.model_name === 'string' && m.model_name.trim() !== '',
    )
    .map((m: RawShibuyaMachineRow) => ({
      id: m.id,
      modelId: m.model_id as string,
      modelName: m.model_name as string,
      tagline: m.tagline ?? null,
      taglineBM: m.taglineBM ?? null,
      bondMatch: m.bond_match ?? null,
      bondMatchBM: m.bond_matchBM ?? null,
      description: m.description ?? null,
      descriptionBM: m.descriptionBM ?? null,
      motorPower: m.motor_power ?? null,
      maxDiameter: m.max_diameter ?? null,
      weight: m.weight ?? null,
      anchor: m.anchor ?? null,
      anchorBM: m.anchorBM ?? null,
      rpmRange: m.rpm_range ?? null,
      price: m.price ?? null,
      heroImageUrl:
        typeof m.hero_image === 'object' && m.hero_image !== null && 'url' in m.hero_image
          ? (m.hero_image.url ?? null)
          : null,
      heroImageAlt:
        typeof m.hero_image === 'object' && m.hero_image !== null && 'alt' in m.hero_image
          ? (m.hero_image.alt ?? null)
          : null,
      features: (m.features ?? [])
        .filter((f) => typeof f?.feature === 'string' && f.feature.trim() !== '')
        .map((f) => ({
          feature: f.feature as string,
          featureBM: f.featureBM ?? null,
        })),
    }))

  return <ShibuyaClient initialData={shibuyaData} machines={machines} />
}
