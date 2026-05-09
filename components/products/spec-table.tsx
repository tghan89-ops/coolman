"use client"

import { useLanguage } from '@/lib/i18n/context'
import type { Product } from '@/lib/data/products'

interface SpecTableProps {
  product: Product
}

export function SpecTable({ product }: SpecTableProps) {
  const { t } = useLanguage()

  const specs = [
    { label: t.product.diameter, value: product.diameter },
    { label: t.product.arborSize, value: product.arborSize },
    { label: t.product.segmentHeight, value: product.segmentHeight },
    { label: t.product.bondType, value: product.bondType },
    { label: t.product.recommendedMaterial, value: product.recommendedMaterials.join(', ') },
    { label: t.product.recommendedMachine, value: getMachinePowerLabel(product.recommendedMachinePower) },
    { label: t.product.recommendedVolume, value: product.recommendedCuttingVolume },
  ]

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full">
        <tbody>
          {specs.map((spec, index) => (
            <tr 
              key={spec.label}
              className={index % 2 === 0 ? 'bg-muted/50' : 'bg-background'}
            >
              <td className="px-4 py-3 text-sm font-medium text-muted-foreground">
                {spec.label}
              </td>
              <td className="px-4 py-3 text-sm text-foreground">
                {spec.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function getMachinePowerLabel(power: string): string {
  const labels: Record<string, string> = {
    low: 'Low (< 2kW)',
    medium: 'Medium (2-4kW)',
    high: 'High (> 4kW)',
  }
  return labels[power] || power
}
