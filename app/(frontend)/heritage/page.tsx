'use client'

import { PublicLayout } from '@/components/layout/public-layout'
import { useLanguage } from '@/lib/i18n/context'
import { DropCap } from '@/components/editorial/DropCap'
import { ChinesePullquote } from '@/components/editorial/Pullquote'
import { HeritageTimelineEntry } from '@/components/industrial/HeritageTimelineEntry'
import { cn } from '@/lib/utils'

// The 2007 founding event is the central year on the timeline; everything
// before it is the run-up, everything after is the build-out. Highlight by
// stable year string rather than array index so reorders are safe.
const HIGHLIGHT_YEAR = '2007'

// Heritage is a story-driven page powered entirely by copy.ts — no server data
// fetching. A single client component is the cleanest expression of that.
export default function HeritagePage() {
  const { t } = useLanguage()
  const h = t.heritage

  return (
    <PublicLayout headerVariant="transparent">

      {/* ── 1. HERO ──────────────────────────────────────────────── */}
      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-[1280px] px-6 pt-32 pb-24 lg:px-8 lg:pt-40 lg:pb-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
            {h.hero.eyebrow}
          </p>
          <h1 className="mt-6 max-w-[22ch] font-fraunces text-[clamp(40px,6vw,84px)] font-normal leading-[1.02] tracking-[-0.025em] text-paper">
            {h.hero.headline}
          </h1>
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-ink-faint">
            {h.hero.lede}
          </p>
        </div>
      </section>

      {/* ── 2. PJ, 2007 ──────────────────────────────────────────── */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {h.pj2007.eyebrow}
          </p>
          <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
            {h.pj2007.headline}
          </h2>
          <div className="mt-10 max-w-[680px]">
            {/* Drop cap appears only on the first narrative section — one per page is the editorial norm. */}
            {h.pj2007.body.map((para, i) =>
              i === 0 ? (
                <DropCap key={i} className="text-[16px] leading-[1.75] text-navy">
                  {para}
                </DropCap>
              ) : (
                <p
                  key={i}
                  className="mt-6 text-[16px] leading-[1.75] text-navy"
                >
                  {para}
                </p>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── 3. THE FOUNDING DECISION ─────────────────────────────── */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {h.founding.eyebrow}
          </p>
          <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
            {h.founding.headline}
          </h2>
          <div className="mt-10 max-w-[680px]">
            {h.founding.body.map((para, i) => (
              <p
                key={i}
                className={cn('text-[16px] leading-[1.75] text-navy', i !== 0 && 'mt-6')}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. THE DAY IT STOPPED BEING A WORKSHOP ───────────────── */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {h.workshopDay.eyebrow}
          </p>
          <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
            {h.workshopDay.headline}
          </h2>
          {h.workshopDay.note ? (
            <p className="mt-4 font-fraunces italic text-[15px] text-ink-faint">
              {h.workshopDay.note}
            </p>
          ) : null}
          <div className="mt-10 max-w-[680px]">
            {h.workshopDay.body.map((para, i) => (
              <p
                key={i}
                className={cn('text-[16px] leading-[1.75] text-navy', i !== 0 && 'mt-6')}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. TWELVE YEARS WITH SHIBUYA ─────────────────────────── */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {h.shibuyaYears.eyebrow}
          </p>
          <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
            {h.shibuyaYears.headline}
          </h2>
          <div className="mt-10 max-w-[680px]">
            {h.shibuyaYears.body.map((para, i) => (
              <p
                key={i}
                className={cn('text-[16px] leading-[1.75] text-navy', i !== 0 && 'mt-6')}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CHINESE PULLQUOTE ─────────────────────────────────── */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-8 lg:py-24">
          <ChinesePullquote quote="heritage" />
        </div>
      </section>

      {/* ── 7. THE HARDEST YEAR ──────────────────────────────────── */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {h.hardestYear.eyebrow}
          </p>
          <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
            {h.hardestYear.headline}
          </h2>
          <div className="mt-10 max-w-[680px]">
            {h.hardestYear.body.map((para, i) => (
              <p
                key={i}
                className={cn('text-[16px] leading-[1.75] text-navy', i !== 0 && 'mt-6')}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. TWENTY YEARS FROM NOW ─────────────────────────────── */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {h.twentyYears.eyebrow}
          </p>
          <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
            {h.twentyYears.headline}
          </h2>
          <div className="mt-10 max-w-[680px]">
            {h.twentyYears.body.map((para, i) => (
              <p
                key={i}
                className={cn('text-[16px] leading-[1.75] text-navy', i !== 0 && 'mt-6')}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. THE TIMELINE ──────────────────────────────────────── */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {h.timeline.eyebrow}
          </p>
          <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
            {h.timeline.headline}
          </h2>
          <div className="mt-12 max-w-3xl">
            {h.timeline.events.map((evt, i) => (
              <HeritageTimelineEntry
                key={`${evt.year}-${i}`}
                year={evt.year}
                event={evt.title}
                body={evt.body}
                note={evt.note}
                isHighlight={evt.year === HIGHLIGHT_YEAR}
              />
            ))}
          </div>
        </div>
      </section>

    </PublicLayout>
  )
}
