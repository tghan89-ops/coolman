import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export interface MachineCardProps {
  modelId: string
  modelName: string
  tagline: string
  description: string
  motorPower?: string
  maxDiameter?: string
  weight?: string
  rpmRange?: string
  price?: string
  heroImageUrl?: string
  bondMatch?: string
  features?: string[]
  className?: string
}

interface SpecTile {
  label: string
  value: string
}

export function MachineCard({
  modelId,
  modelName,
  tagline,
  description,
  motorPower,
  maxDiameter,
  weight,
  rpmRange,
  price,
  heroImageUrl,
  bondMatch,
  features,
  className,
}: MachineCardProps) {
  const specs: SpecTile[] = [
    motorPower ? { label: 'Motor', value: motorPower } : null,
    maxDiameter ? { label: 'Max diameter', value: maxDiameter } : null,
    weight ? { label: 'Weight', value: weight } : null,
    rpmRange ? { label: 'RPM range', value: rpmRange } : null,
  ].filter(Boolean) as SpecTile[]

  return (
    <article
      id={modelId}
      className={cn(
        'bg-white border border-rule rounded-lg overflow-hidden',
        'flex flex-col scroll-mt-24',
        className,
      )}
    >
      <div className="relative aspect-[16/9] bg-paper border-b border-rule">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={modelName}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="p-6 sm:p-8 flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h2 className="text-2xl sm:text-[1.75rem] font-semibold text-navy tracking-tight leading-tight">
            {modelName}
          </h2>
          <p className="font-fraunces italic text-lg text-ink-muted leading-snug">
            {tagline}
          </p>
        </header>

        <p className="text-ink leading-[1.6] text-base">{description}</p>

        {specs.length > 0 ? (
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {specs.map((spec) => (
              <li
                key={spec.label}
                className="bg-paper border border-rule rounded-md p-3 flex flex-col gap-1"
              >
                <span className="text-[11px] uppercase tracking-[0.08em] text-ink-muted font-medium">
                  {spec.label}
                </span>
                <span className="font-mono text-navy text-base leading-tight">
                  {spec.value}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        {bondMatch ? (
          <div className="border-l-[3px] border-accent bg-paper px-4 py-3">
            <p className="text-sm text-accent-dark leading-snug">{bondMatch}</p>
          </div>
        ) : null}

        {features && features.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {features.map((feature, i) => (
              <li
                key={i}
                className="flex gap-3 text-base text-ink leading-relaxed"
              >
                <span aria-hidden className="text-accent select-none">
                  •
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {price ? (
          <div className="flex items-baseline justify-between pt-4 border-t border-rule">
            <span className="text-xs uppercase tracking-[0.08em] text-ink-muted font-medium">
              Price
            </span>
            <span className="font-mono text-[1.5rem] text-navy">{price}</span>
          </div>
        ) : null}
      </div>
    </article>
  )
}
