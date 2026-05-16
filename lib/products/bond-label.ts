// Bond-type values are stored as raw select keys ('soft' | 'medium' | 'hard' |
// 'extraHard'). Anywhere we show them to a contractor we want the proper label
// (matches the labels defined in collections/Products.ts).
const BOND_LABELS: Record<string, string> = {
  soft: 'Soft',
  medium: 'Medium',
  hard: 'Hard',
  extraHard: 'Extra Hard',
}

export function bondLabel(value: unknown): string {
  if (value == null) return ''
  const key = typeof value === 'object' ? ((value as any).name ?? '') : String(value)
  return BOND_LABELS[key] ?? key
}
