// Parse the ?qty=N URL param. Anything missing, non-numeric, ≤0, or non-integer
// falls back to 1 so we never seed the form with garbage.
export function parseInitialQuantity(raw: string | undefined): number {
  if (!raw) return 1
  const n = Number(raw)
  if (!Number.isFinite(n)) return 1
  const i = Math.floor(n)
  return i >= 1 ? i : 1
}
