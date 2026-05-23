'use client'

import { useLanguage } from '@/lib/i18n/context'

export function EngineeringSection() {
  const { t } = useLanguage()
  const e = t.homeNarrative.engineering

  return (
    <section className="bg-paper border-t border-rule">
      <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">

        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
          {e.eyebrow}
        </p>

        <p className="mt-8 mb-20 font-fraunces font-normal text-[clamp(32px,3.8vw,52px)] leading-[1.08] tracking-[-0.02em] max-w-[22ch] text-navy">
          {e.pullPrefix}
          <em className="italic text-accent font-light">{e.pullEmphasis}</em>
          {e.pullSuffix}
        </p>

        <div className="grid gap-20 lg:grid-cols-[1.3fr_1fr] lg:items-start">

          {/* Two-column thesis text */}
          <div className="[column-count:1] lg:[column-count:2] [column-gap:40px] text-[15px] leading-[1.7] text-navy">
            {e.body.map((para, i) => (
              <p key={i} className={`m-0 mb-[1em] [break-inside:avoid]${i === 0 ? ' font-medium' : ''}`}>
                {para}
              </p>
            ))}
          </div>

          {/* Callout stats */}
          <div className="flex flex-col gap-8">
            {e.callouts.map((c, i) => (
              <div
                key={i}
                className={`py-6 border-t border-rule${i === e.callouts.length - 1 ? ' border-b' : ''}`}
              >
                <span className="block font-mono font-medium text-[44px] tracking-[-0.02em] text-navy leading-none mb-2.5">
                  {c.num}<sup className="text-[22px] text-accent">{c.sup}</sup>
                </span>
                <p className="m-0 text-[13px] leading-[1.5] text-ink-muted max-w-[36ch]">
                  {c.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Blueprint */}
        <figure
          className="mt-20 bg-navy text-paper p-8 lg:p-14 relative overflow-hidden"
          aria-label="Coolman sandwich cobalt segment, cross-section"
        >
          <div className="flex flex-col gap-1 lg:flex-row lg:justify-between lg:items-baseline mb-8 font-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint">
            <span className="text-paper">{e.blueprint.drawingNumber}</span>
            <span>{e.blueprint.scaleNote}</span>
          </div>

          <svg
            viewBox="0 0 900 320"
            xmlns="http://www.w3.org/2000/svg"
            className="block w-full h-auto max-h-[360px]"
            role="img"
            aria-label="Cross-section of a diamond segment showing steel core, sandwich cobalt matrix layers, and diamond grit distribution."
          >
            <defs>
              <pattern id="eng-hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke="#94A3B8" strokeWidth="0.6" />
              </pattern>
              <pattern id="eng-hatch2" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(-45)">
                <line x1="0" y1="0" x2="0" y2="5" stroke="#60A5FA" strokeWidth="0.5" opacity="0.6" />
              </pattern>
              <marker id="eng-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill="#60A5FA" />
              </marker>
              <marker id="eng-arrBack" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                <path d="M10,0 L0,5 L10,10 z" fill="#60A5FA" />
              </marker>
            </defs>

            {/* Steel core */}
            <rect x="180" y="240" width="540" height="40" fill="url(#eng-hatch)" stroke="#E5E2DA" strokeWidth="1" />
            <line x1="180" y1="240" x2="720" y2="240" stroke="#60A5FA" strokeWidth="0.8" strokeDasharray="3 2" />

            {/* Sandwich segment: three layers */}
            <rect x="200" y="120" width="500" height="38" fill="#1A2D47" stroke="#60A5FA" strokeWidth="0.8" />
            <rect x="200" y="158" width="500" height="32" fill="url(#eng-hatch2)" stroke="#60A5FA" strokeWidth="0.8" />
            <rect x="200" y="190" width="500" height="38" fill="#1A2D47" stroke="#60A5FA" strokeWidth="0.8" />

            {/* Diamond grit dots */}
            <g fill="#FAFAF7">
              <circle cx="230" cy="135" r="1.6" /><circle cx="260" cy="145" r="1.4" /><circle cx="295" cy="128" r="1.8" />
              <circle cx="325" cy="150" r="1.5" /><circle cx="360" cy="132" r="1.6" /><circle cx="395" cy="148" r="1.4" />
              <circle cx="430" cy="130" r="1.7" /><circle cx="465" cy="146" r="1.5" /><circle cx="500" cy="134" r="1.6" />
              <circle cx="540" cy="148" r="1.4" /><circle cx="575" cy="130" r="1.7" /><circle cx="610" cy="145" r="1.5" />
              <circle cx="645" cy="135" r="1.6" /><circle cx="680" cy="148" r="1.4" />
              <circle cx="220" cy="200" r="1.6" /><circle cx="255" cy="215" r="1.5" /><circle cx="290" cy="205" r="1.7" />
              <circle cx="325" cy="218" r="1.4" /><circle cx="360" cy="202" r="1.6" /><circle cx="395" cy="216" r="1.5" />
              <circle cx="430" cy="204" r="1.8" /><circle cx="465" cy="214" r="1.4" /><circle cx="500" cy="200" r="1.6" />
              <circle cx="540" cy="218" r="1.5" /><circle cx="575" cy="204" r="1.7" /><circle cx="610" cy="216" r="1.5" />
              <circle cx="645" cy="200" r="1.6" /><circle cx="680" cy="215" r="1.5" />
            </g>

            {/* Gullet */}
            <path d="M700,120 L720,120 L720,228 L700,228 Z" fill="#0A1628" stroke="#60A5FA" strokeWidth="0.6" />

            {/* Dimension: segment height (left) */}
            <line x1="170" y1="120" x2="170" y2="228" stroke="#60A5FA" strokeWidth="0.6" markerStart="url(#eng-arrBack)" markerEnd="url(#eng-arr)" />
            <line x1="166" y1="120" x2="200" y2="120" stroke="#60A5FA" strokeWidth="0.4" strokeDasharray="2 2" />
            <line x1="166" y1="228" x2="200" y2="228" stroke="#60A5FA" strokeWidth="0.4" strokeDasharray="2 2" />
            <text x="150" y="178" fontFamily="JetBrains Mono, monospace" fontSize="13" fill="#60A5FA" textAnchor="end">12.0</text>

            {/* Dimension: outer layer */}
            <line x1="755" y1="120" x2="755" y2="158" stroke="#60A5FA" strokeWidth="0.6" markerStart="url(#eng-arrBack)" markerEnd="url(#eng-arr)" />
            <line x1="700" y1="120" x2="760" y2="120" stroke="#60A5FA" strokeWidth="0.4" strokeDasharray="2 2" />
            <line x1="700" y1="158" x2="760" y2="158" stroke="#60A5FA" strokeWidth="0.4" strokeDasharray="2 2" />
            <text x="770" y="143" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#60A5FA">3.8 outer</text>

            {/* Dimension: middle layer */}
            <line x1="755" y1="158" x2="755" y2="190" stroke="#60A5FA" strokeWidth="0.6" markerStart="url(#eng-arrBack)" markerEnd="url(#eng-arr)" />
            <line x1="700" y1="190" x2="760" y2="190" stroke="#60A5FA" strokeWidth="0.4" strokeDasharray="2 2" />
            <text x="770" y="178" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#60A5FA">3.2 soft co.</text>

            {/* Dimension: bottom layer */}
            <line x1="755" y1="190" x2="755" y2="228" stroke="#60A5FA" strokeWidth="0.6" markerStart="url(#eng-arrBack)" markerEnd="url(#eng-arr)" />
            <text x="770" y="213" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#60A5FA">3.8 outer</text>

            {/* Dimension: core thickness */}
            <line x1="170" y1="240" x2="170" y2="280" stroke="#60A5FA" strokeWidth="0.6" markerStart="url(#eng-arrBack)" markerEnd="url(#eng-arr)" />
            <line x1="166" y1="280" x2="200" y2="280" stroke="#60A5FA" strokeWidth="0.4" strokeDasharray="2 2" />
            <text x="150" y="265" fontFamily="JetBrains Mono, monospace" fontSize="13" fill="#60A5FA" textAnchor="end">2.4</text>

            {/* Layer callouts */}
            <line x1="380" y1="120" x2="380" y2="80" stroke="#94A3B8" strokeWidth="0.6" />
            <line x1="380" y1="80" x2="500" y2="80" stroke="#94A3B8" strokeWidth="0.6" />
            <text x="510" y="84" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#FAFAF7">[A] OUTER MATRIX — hard cobalt, 88 HRB</text>

            <line x1="500" y1="174" x2="500" y2="60" stroke="#94A3B8" strokeWidth="0.6" />
            <text x="510" y="64" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#FAFAF7">[B] CENTRE — soft cobalt, releases diamond</text>

            <line x1="450" y1="260" x2="450" y2="298" stroke="#94A3B8" strokeWidth="0.6" />
            <text x="460" y="302" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#FAFAF7">[C] TENSIONED STEEL CORE — laser-welded joint</text>

            <line x1="260" y1="145" x2="260" y2="100" stroke="#94A3B8" strokeWidth="0.6" />
            <line x1="260" y1="100" x2="180" y2="100" stroke="#94A3B8" strokeWidth="0.6" />
            <text x="178" y="92" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#FAFAF7" textAnchor="end">[D] DIAMOND GRIT 40/50 US MESH</text>
          </svg>

          <p className="mt-6 text-[13px] text-ink-faint leading-[1.6] max-w-[70ch] m-0">
            {e.blueprint.caption}
          </p>
        </figure>

        {/* Workshop photo */}
        <div className="mt-20 grid gap-20 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <img
            src="https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1200&q=80&auto=format&fit=crop"
            alt="Coolman workshop floor — segment press and laser-weld station"
            className="block w-full aspect-[4/3] object-cover"
            style={{ filter: 'grayscale(0.4) contrast(1.04) brightness(0.96)' }}
          />
          <div className="text-[14px] leading-[1.7] text-ink-muted">
            <h4 className="font-fraunces font-normal text-[22px] leading-[1.2] tracking-[-0.01em] text-navy m-0 mb-4">
              {e.workshopPhoto.heading}
            </h4>
            <p className="m-0">{e.workshopPhoto.body}</p>
          </div>
        </div>

      </div>
    </section>
  )
}
