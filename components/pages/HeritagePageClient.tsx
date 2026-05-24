'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { DropCap } from '@/components/editorial/DropCap'
import { ChinesePullquote } from '@/components/editorial/Pullquote'
import { HeritageTimelineEntry } from '@/components/industrial/HeritageTimelineEntry'
import { useLanguage } from '@/lib/i18n/context'
import { cn } from '@/lib/utils'

// The 2007 founding event is the central year on the timeline; everything
// before it is the run-up, everything after is the build-out.
const HIGHLIGHT_YEAR = '2007'

// ── CMS types ─────────────────────────────────────────────────────────────

type RawParagraph = { paragraph?: string | null; paragraphBM?: string | null }
type RawSection = {
  eyebrow?: string | null; eyebrowBM?: string | null
  headline?: string | null; headlineBM?: string | null
  note?: string | null; noteBM?: string | null
  paragraphs?: RawParagraph[] | null
}
type RawTimelineEvent = {
  year?: string | null
  title?: string | null; titleBM?: string | null
  body?: string | null; bodyBM?: string | null
  note?: string | null; noteBM?: string | null
}

export type RawHeritagePage = {
  hero?: {
    eyebrow?: string | null; eyebrowBM?: string | null
    headline?: string | null; headlineBM?: string | null
    lede?: string | null; ledeBM?: string | null
  } | null
  pj2007?:      RawSection | null
  founding?:    RawSection | null
  workshopDay?: RawSection | null
  shibuyaYears?: RawSection | null
  hardestYear?: RawSection | null
  twentyYears?: RawSection | null
  timeline?: {
    eyebrow?: string | null; eyebrowBM?: string | null
    headline?: string | null; headlineBM?: string | null
    events?: RawTimelineEvent[] | null
  } | null
}

type Props = { initialData: RawHeritagePage | null }

// ── Component ──────────────────────────────────────────────────────────────

export function HeritagePageClient({ initialData }: Props) {
  const { t, language } = useLanguage()
  const n = t.heritage

  const { data } = useLivePreview<RawHeritagePage>({
    initialData: initialData ?? ({} as RawHeritagePage),
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3001',
    depth: 2,
  })

  const pickL = (en: string | null | undefined, bm: string | null | undefined, fallback: string): string => {
    if (language === 'BM' && bm) return bm
    return en ?? fallback
  }

  const mergeParas = (
    raw: RawParagraph[] | null | undefined,
    fallback: string[],
  ): string[] =>
    raw && raw.length > 0
      ? raw.map((p, i) => pickL(p.paragraph, p.paragraphBM, fallback[i] ?? ''))
      : fallback

  // ── Resolved values ────────────────────────────────────────────────────

  const hero = {
    eyebrow: pickL(data?.hero?.eyebrow,   data?.hero?.eyebrowBM,   n.hero.eyebrow),
    headline: pickL(data?.hero?.headline,  data?.hero?.headlineBM,  n.hero.headline),
    lede:    pickL(data?.hero?.lede,      data?.hero?.ledeBM,      n.hero.lede),
  }

  const pj2007 = {
    eyebrow:  pickL(data?.pj2007?.eyebrow,  data?.pj2007?.eyebrowBM,  n.pj2007.eyebrow),
    headline: pickL(data?.pj2007?.headline, data?.pj2007?.headlineBM, n.pj2007.headline),
    body: mergeParas(data?.pj2007?.paragraphs, n.pj2007.body),
  }

  const founding = {
    eyebrow:  pickL(data?.founding?.eyebrow,  data?.founding?.eyebrowBM,  n.founding.eyebrow),
    headline: pickL(data?.founding?.headline, data?.founding?.headlineBM, n.founding.headline),
    body: mergeParas(data?.founding?.paragraphs, n.founding.body),
  }

  const workshopDay = {
    eyebrow:  pickL(data?.workshopDay?.eyebrow,  data?.workshopDay?.eyebrowBM,  n.workshopDay.eyebrow),
    headline: pickL(data?.workshopDay?.headline, data?.workshopDay?.headlineBM, n.workshopDay.headline),
    note:     pickL(data?.workshopDay?.note,     data?.workshopDay?.noteBM,     n.workshopDay.note ?? ''),
    body: mergeParas(data?.workshopDay?.paragraphs, n.workshopDay.body),
  }

  const shibuyaYears = {
    eyebrow:  pickL(data?.shibuyaYears?.eyebrow,  data?.shibuyaYears?.eyebrowBM,  n.shibuyaYears.eyebrow),
    headline: pickL(data?.shibuyaYears?.headline, data?.shibuyaYears?.headlineBM, n.shibuyaYears.headline),
    body: mergeParas(data?.shibuyaYears?.paragraphs, n.shibuyaYears.body),
  }

  const hardestYear = {
    eyebrow:  pickL(data?.hardestYear?.eyebrow,  data?.hardestYear?.eyebrowBM,  n.hardestYear.eyebrow),
    headline: pickL(data?.hardestYear?.headline, data?.hardestYear?.headlineBM, n.hardestYear.headline),
    body: mergeParas(data?.hardestYear?.paragraphs, n.hardestYear.body),
  }

  const twentyYears = {
    eyebrow:  pickL(data?.twentyYears?.eyebrow,  data?.twentyYears?.eyebrowBM,  n.twentyYears.eyebrow),
    headline: pickL(data?.twentyYears?.headline, data?.twentyYears?.headlineBM, n.twentyYears.headline),
    body: mergeParas(data?.twentyYears?.paragraphs, n.twentyYears.body),
  }

  const cmsEvents = data?.timeline?.events
  const timeline = {
    eyebrow:  pickL(data?.timeline?.eyebrow,  data?.timeline?.eyebrowBM,  n.timeline.eyebrow),
    headline: pickL(data?.timeline?.headline, data?.timeline?.headlineBM, n.timeline.headline),
    events:
      cmsEvents && cmsEvents.length > 0
        ? cmsEvents.map((e, i) => ({
            year:  e.year  || n.timeline.events[i]?.year  || '',
            title: pickL(e.title, e.titleBM, n.timeline.events[i]?.title ?? ''),
            body:  pickL(e.body,  e.bodyBM,  n.timeline.events[i]?.body  ?? ''),
            note:
              language === 'BM'
                ? (e.noteBM ?? e.note ?? n.timeline.events[i]?.note)
                : (e.note   ?? n.timeline.events[i]?.note),
          }))
        : n.timeline.events,
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <PublicLayout headerVariant="transparent">

      {/* 1. HERO */}
      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-[1280px] px-6 pt-28 pb-16 lg:px-8 lg:pt-36 lg:pb-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
            {hero.eyebrow}
          </p>
          <h1 className="mt-6 max-w-[22ch] font-fraunces text-[clamp(40px,6vw,84px)] font-normal leading-[1.02] tracking-[-0.025em] text-paper">
            {hero.headline}
          </h1>
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-ink-faint">
            {hero.lede}
          </p>
        </div>
      </section>

      {/* 2. PJ, 2007 */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {pj2007.eyebrow}
          </p>
          <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
            {pj2007.headline}
          </h2>
          <div className="mt-10 max-w-[680px]">
            {pj2007.body.map((para, i) =>
              i === 0 ? (
                <DropCap key={i} className="text-[16px] leading-[1.75] text-navy">
                  {para}
                </DropCap>
              ) : (
                <p key={i} className="mt-6 text-[16px] leading-[1.75] text-navy">
                  {para}
                </p>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 3. THE FOUNDING DECISION */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {founding.eyebrow}
          </p>
          <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
            {founding.headline}
          </h2>
          <div className="mt-10 max-w-[680px]">
            {founding.body.map((para, i) => (
              <p key={i} className={cn('text-[16px] leading-[1.75] text-navy', i !== 0 && 'mt-6')}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE DAY IT STOPPED BEING A WORKSHOP */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {workshopDay.eyebrow}
          </p>
          <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
            {workshopDay.headline}
          </h2>
          {workshopDay.note ? (
            <p className="mt-4 font-fraunces italic text-[15px] text-ink-faint">
              {workshopDay.note}
            </p>
          ) : null}
          <div className="mt-10 max-w-[680px]">
            {workshopDay.body.map((para, i) => (
              <p key={i} className={cn('text-[16px] leading-[1.75] text-navy', i !== 0 && 'mt-6')}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TWELVE YEARS WITH SHIBUYA */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {shibuyaYears.eyebrow}
          </p>
          <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
            {shibuyaYears.headline}
          </h2>
          <div className="mt-10 max-w-[680px]">
            {shibuyaYears.body.map((para, i) => (
              <p key={i} className={cn('text-[16px] leading-[1.75] text-navy', i !== 0 && 'mt-6')}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CHINESE PULLQUOTE */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-8 lg:py-16">
          <ChinesePullquote quote="heritage" />
        </div>
      </section>

      {/* 7. THE HARDEST YEAR */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {hardestYear.eyebrow}
          </p>
          <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
            {hardestYear.headline}
          </h2>
          <div className="mt-10 max-w-[680px]">
            {hardestYear.body.map((para, i) => (
              <p key={i} className={cn('text-[16px] leading-[1.75] text-navy', i !== 0 && 'mt-6')}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 8. TWENTY YEARS FROM NOW */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {twentyYears.eyebrow}
          </p>
          <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
            {twentyYears.headline}
          </h2>
          <div className="mt-10 max-w-[680px]">
            {twentyYears.body.map((para, i) => (
              <p key={i} className={cn('text-[16px] leading-[1.75] text-navy', i !== 0 && 'mt-6')}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 9. THE TIMELINE */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {timeline.eyebrow}
          </p>
          <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
            {timeline.headline}
          </h2>
          <div className="mt-12 max-w-3xl">
            {timeline.events.map((evt, i) => (
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
