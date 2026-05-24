export function diameterBucket(diameterMm: unknown): string {
  if (typeof diameterMm !== 'number' || !Number.isFinite(diameterMm)) return 'other'
  if (diameterMm < 100 || diameterMm >= 900) return 'other'
  const start = Math.floor(diameterMm / 100) * 100
  return `${start}-${start + 100}`
}
