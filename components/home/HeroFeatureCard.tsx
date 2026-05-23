'use client'

import { useLanguage } from '@/lib/i18n/context'

export function HeroFeatureCard() {
  const { t } = useLanguage()
  const card = t.homeNarrative.heroCard

  return (
    <aside
      className="w-full bg-navy-surface border border-[rgba(96,165,250,0.18)] p-8"
      aria-label="Featured field note"
    >
      {/* Bleed photo — placeholder until Alan supplies job-site photography */}
      <img
        src="https://images.unsplash.com/photo-1590725140246-20acdee442be?w=1400&q=80&auto=format&fit=crop"
        alt="Concrete cutting on a Kuala Lumpur podium slab"
        className="-mx-8 -mt-8 mb-6 block w-[calc(100%+4rem)] aspect-video object-cover"
        style={{ filter: 'grayscale(0.5) contrast(1.05) brightness(0.85)' }}
      />
      <span className="block font-mono text-[10px] tracking-[0.16em] text-accent-light mb-3">
        {card.corner}
      </span>
      <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint mb-6">
        {card.eyebrow}
      </p>
      <h2 className="font-fraunces text-[28px] font-normal leading-[1.15] tracking-[-0.015em] text-paper mb-5">
        {card.title}
      </h2>
      {card.rows.map((row, i) => (
        <div
          key={i}
          className="grid grid-cols-[80px_1fr] gap-3 py-3 border-t border-[rgba(229,226,218,0.12)] text-[14px] leading-[1.45] last:border-b last:border-b-[rgba(229,226,218,0.12)]"
        >
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-faint pt-0.5">
            {row.key}
          </span>
          <span className="text-paper">{row.value}</span>
        </div>
      ))}
      <span className="inline-block mt-6 text-[14px] text-accent-light transition-colors duration-150 ease-out hover:text-paper cursor-default">
        {card.readLabel}
      </span>
    </aside>
  )
}
