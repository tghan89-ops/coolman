'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Clock,
  Wrench,
  Repeat2,
  UserX,
  type LucideIcon,
} from 'lucide-react'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { useLanguage } from '@/lib/i18n/context'
import { FearCard } from '@/components/industrial/FearCard'
import { InventoryStat } from '@/components/industrial/InventoryStat'
import { HeroFeatureCard } from '@/components/home/HeroFeatureCard'
import { EngineeringSection } from '@/components/home/EngineeringSection'
import { ChinesePullquote } from '@/components/editorial/Pullquote'
import { DropCap } from '@/components/editorial/DropCap'
import type { Setting } from '@/payload-types'

export type RawHomePage = {
  opening?: {
    eyebrow?: string | null; eyebrowBM?: string | null
    headlinePrefix?: string | null; headlinePrefixBM?: string | null
    headlineEmphasis?: string | null; headlineEmphasisBM?: string | null
    lede?: string | null; ledeBM?: string | null
    ctaPrimary?: string | null; ctaPrimaryBM?: string | null
    ctaSecondary?: string | null; ctaSecondaryBM?: string | null
  } | null
  fearGrid?: {
    eyebrow?: string | null; eyebrowBM?: string | null
    headline?: string | null; headlineBM?: string | null
    cards?: Array<{ key?: string | null; title?: string | null; titleBM?: string | null; body?: string | null; bodyBM?: string | null }> | null
  } | null
  threeMythsIntro?: {
    eyebrow?: string | null; eyebrowBM?: string | null
    headline?: string | null; headlineBM?: string | null
    lede?: string | null; ledeBM?: string | null
    ctaLabel?: string | null; ctaLabelBM?: string | null
  } | null
  brotherhoodIntro?: {
    eyebrow?: string | null; eyebrowBM?: string | null
    headline?: string | null; headlineBM?: string | null
    lede?: string | null; ledeBM?: string | null
    ctaLabel?: string | null; ctaLabelBM?: string | null
  } | null
  alansLetter?: {
    eyebrow?: string | null; eyebrowBM?: string | null
    paragraphs?: Array<{ paragraph?: string | null; paragraphBM?: string | null }> | null
    signature?: string | null
    signatureLine2?: string | null; signatureLine2BM?: string | null
  } | null
  quietDoor?: {
    eyebrow?: string | null; eyebrowBM?: string | null
    headline?: string | null; headlineBM?: string | null
    lede?: string | null; ledeBM?: string | null
    ctaPrimary?: string | null; ctaPrimaryBM?: string | null
    ctaSecondary?: string | null; ctaSecondaryBM?: string | null
  } | null
  conversation?: {
    eyebrow?: string | null; eyebrowBM?: string | null
    headline?: string | null; headlineBM?: string | null
    lede?: string | null; ledeBM?: string | null
    channels?: Array<{
      tag?: string | null; tagBM?: string | null
      title?: string | null; titleBM?: string | null
      body?: string | null; bodyBM?: string | null
      ctaLabel?: string | null; ctaLabelBM?: string | null
    }> | null
  } | null
}

interface HomePageClientProps {
  settings: Partial<Setting>
  publishedPostsCount: number
  initialData: RawHomePage | null
}

export function HomePageClient({ settings, publishedPostsCount, initialData }: HomePageClientProps) {
  const { data } = useLivePreview<RawHomePage>({
    initialData: initialData ?? ({} as RawHomePage),
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 1,
  })

  const { t, language } = useLanguage()
  const n = t.homeNarrative

  const pickL = (en: string | null | undefined, bm: string | null | undefined, fallback: string): string => {
    if (language === 'BM' && bm && bm.trim()) return bm
    if (en && en.trim()) return en
    return fallback
  }

  const whatsappNumber = settings?.whatsapp_number || '+60126363156'
  const whatsappDigits = whatsappNumber.replace(/\D/g, '')

  const whatsappHref =
    whatsappDigits.length >= 8 ? `https://wa.me/${whatsappDigits}` : '#'
  const telHref = whatsappDigits.length >= 8 ? `tel:+${whatsappDigits}` : '#'

  const fearIconMap: Record<string, LucideIcon> = {
    delay: Clock,
    equipment: Wrench,
    inconsistency: Repeat2,
    alone: UserX,
  }

  const channelHrefs = [whatsappHref, telHref, '/contact#site-visit']

  // Build fear cards: CMS array takes precedence over copy.ts
  const fearCards = (data?.fearGrid?.cards && data.fearGrid.cards.length > 0)
    ? data.fearGrid.cards.map((c, i) => ({
        key:  c.key  || n.fearGrid.cards[i]?.key  || '',
        title: pickL(c.title, c.titleBM, n.fearGrid.cards[i]?.title ?? ''),
        body:  pickL(c.body,  c.bodyBM,  n.fearGrid.cards[i]?.body  ?? ''),
      }))
    : n.fearGrid.cards

  // Build letter paragraphs: CMS array takes precedence over copy.ts
  const letterParas = (data?.alansLetter?.paragraphs && data.alansLetter.paragraphs.length > 0)
    ? data.alansLetter.paragraphs.map((p, i) =>
        pickL(p.paragraph, p.paragraphBM, n.alansLetter.paragraphs[i] ?? ''))
    : n.alansLetter.paragraphs

  // Build conversation channels: CMS array takes precedence over copy.ts
  const channels = (data?.conversation?.channels && data.conversation.channels.length > 0)
    ? data.conversation.channels.map((ch, i) => ({
        tag:      pickL(ch.tag,      ch.tagBM,      n.conversation.channels[i]?.tag      ?? ''),
        title:    pickL(ch.title,    ch.titleBM,    n.conversation.channels[i]?.title    ?? ''),
        body:     pickL(ch.body,     ch.bodyBM,     n.conversation.channels[i]?.body     ?? ''),
        ctaLabel: pickL(ch.ctaLabel, ch.ctaLabelBM, n.conversation.channels[i]?.ctaLabel ?? ''),
      }))
    : n.conversation.channels

  // Stat values come straight from copy.ts. We no longer surface a live on-time %
  // (GH: drop the percentage) or a same-day cutoff; the dispatch promise is now a
  // flat "within 2 business days", so these are static facts, not Settings-driven.
  const quietDoorStats = n.quietDoor.stats

  return (
    <PublicLayout headerVariant="transparent">

      {/* ── 1. OPENING SURFACE ───────────────────────────────────── */}
      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-[1280px] px-6 pt-28 pb-16 lg:px-8 lg:pt-36 lg:pb-24">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
                {pickL(data?.opening?.eyebrow, data?.opening?.eyebrowBM, n.opening.eyebrow)}
              </p>
              <h1 className="mt-6 font-fraunces text-[clamp(48px,6vw,84px)] font-normal leading-[1.02] tracking-[-0.025em] text-paper max-w-[14ch]">
                {pickL(data?.opening?.headlinePrefix, data?.opening?.headlinePrefixBM, n.opening.headlinePrefix)}
                <em className="italic font-light text-accent-light">
                  {pickL(data?.opening?.headlineEmphasis, data?.opening?.headlineEmphasisBM, n.opening.headlineEmphasis)}
                </em>
              </h1>
              <p className="mt-7 max-w-[52ch] text-lg leading-[1.55] text-ink-faint">
                {pickL(data?.opening?.lede, data?.opening?.ledeBM, n.opening.lede)}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center bg-paper px-6 text-sm font-medium text-navy rounded-sm transition-[box-shadow] duration-150 ease-out hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
                >
                  {pickL(data?.opening?.ctaPrimary, data?.opening?.ctaPrimaryBM, n.opening.ctaPrimary)}
                </a>
                <Link
                  href="/products"
                  className="inline-flex h-12 items-center justify-center border border-[rgba(250,250,247,0.4)] bg-transparent px-6 text-sm font-medium text-paper rounded-sm transition-[border-color] duration-150 ease-out hover:border-paper"
                >
                  {pickL(data?.opening?.ctaSecondary, data?.opening?.ctaSecondaryBM, n.opening.ctaSecondary)}
                </Link>
              </div>
            </div>
            <div className="lg:items-start">
              <HeroFeatureCard />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FEAR GRID ─────────────────────────────────────────── */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:gap-20 lg:items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                {pickL(data?.fearGrid?.eyebrow, data?.fearGrid?.eyebrowBM, n.fearGrid.eyebrow)}
              </p>
              <h2 className="mt-4 max-w-[18ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
                {pickL(data?.fearGrid?.headline, data?.fearGrid?.headlineBM, n.fearGrid.headline)}
              </h2>
            </div>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {fearCards.map((card) => {
              const Icon = fearIconMap[card.key]
              return (
                <FearCard
                  key={card.key}
                  icon={Icon ? <Icon className="h-6 w-6" /> : null}
                  title={card.title}
                  body={card.body}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 3. THREE MYTHS INTRO ─────────────────────────────────── */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20 lg:items-start">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                {pickL(data?.threeMythsIntro?.eyebrow, data?.threeMythsIntro?.eyebrowBM, n.threeMythsIntro.eyebrow)}
              </p>
              <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
                {pickL(data?.threeMythsIntro?.headline, data?.threeMythsIntro?.headlineBM, n.threeMythsIntro.headline)}
              </h2>
            </div>
            <div className="lg:pt-2">
              <p className="text-base leading-[1.7] text-ink-muted">
                {pickL(data?.threeMythsIntro?.lede, data?.threeMythsIntro?.ledeBM, n.threeMythsIntro.lede)}
              </p>
              <Link
                href="/why-coolman"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors duration-150 ease-out hover:text-accent-light min-h-[44px]"
              >
                {pickL(data?.threeMythsIntro?.ctaLabel, data?.threeMythsIntro?.ctaLabelBM, n.threeMythsIntro.ctaLabel)}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. BROTHERHOOD INTRO ─────────────────────────────────── */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20 lg:items-start">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                {pickL(data?.brotherhoodIntro?.eyebrow, data?.brotherhoodIntro?.eyebrowBM, n.brotherhoodIntro.eyebrow)}
              </p>
              <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
                {pickL(data?.brotherhoodIntro?.headline, data?.brotherhoodIntro?.headlineBM, n.brotherhoodIntro.headline)}
              </h2>
            </div>
            <div className="lg:pt-2">
              <p className="text-base leading-[1.7] text-ink-muted">
                {pickL(data?.brotherhoodIntro?.lede, data?.brotherhoodIntro?.ledeBM, n.brotherhoodIntro.lede)}
              </p>
              <Link
                href="/why-coolman"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors duration-150 ease-out hover:text-accent-light min-h-[44px]"
              >
                {pickL(data?.brotherhoodIntro?.ctaLabel, data?.brotherhoodIntro?.ctaLabelBM, n.brotherhoodIntro.ctaLabel)}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CHINESE PULLQUOTE ─────────────────────────────────── */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-8 lg:py-16">
          <ChinesePullquote quote="home" />
        </div>
      </section>

      {/* ── 6. FIELD NOTES PREVIEW (gated) ───────────────────────── */}
      {publishedPostsCount >= 3 && (
        <section className="bg-paper border-t border-rule">
          <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:gap-20 lg:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                  {n.fieldNotesPreview.eyebrow}
                </p>
                <h2 className="mt-4 max-w-[18ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
                  {n.fieldNotesPreview.headline}
                </h2>
              </div>
              <p className="max-w-[36ch] text-[15px] leading-[1.6] text-ink-muted">
                {n.fieldNotesPreview.lede}
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {n.fieldNotesPreview.cards.map((card, i) => (
                <article
                  key={i}
                  className="border border-rule p-8 transition-[border-color,box-shadow] duration-150 ease-out hover:border-accent hover:shadow-[0_4px_12px_rgba(10,22,40,0.06)] flex flex-col"
                >
                  <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted mb-6">
                    {card.meta}
                  </div>
                  <h3 className="font-fraunces text-[22px] font-normal leading-[1.2] tracking-[-0.01em] text-navy">
                    {card.title}
                  </h3>
                  <p className="mt-auto pt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                    {card.readingTime}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-12">
              <Link
                href="/field-notes"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors duration-150 ease-out hover:text-accent-light min-h-[44px]"
              >
                {n.fieldNotesPreview.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 7. ENGINEERING THESIS ────────────────────────────────── */}
      <EngineeringSection />

      {/* ── 8. ALAN'S LETTER ─────────────────────────────────────── */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {pickL(data?.alansLetter?.eyebrow, data?.alansLetter?.eyebrowBM, n.alansLetter.eyebrow)}
          </p>
          <div className="mt-10 max-w-[680px]">
            {letterParas.map((para, i) => (
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
              )
            ))}
            <p className="mt-10 font-fraunces italic text-[18px] text-ink-muted">
              {data?.alansLetter?.signature?.trim() || n.alansLetter.signature}
            </p>
            <p className="mt-1 font-fraunces italic text-[15px] text-ink-muted">
              {pickL(data?.alansLetter?.signatureLine2, data?.alansLetter?.signatureLine2BM, n.alansLetter.signatureLine2)}
            </p>
          </div>
        </div>
      </section>

      {/* ── 9. THE QUIET DOOR ────────────────────────────────────── */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[2fr_1fr] lg:gap-20 lg:items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                {pickL(data?.quietDoor?.eyebrow, data?.quietDoor?.eyebrowBM, n.quietDoor.eyebrow)}
              </p>
              <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
                {pickL(data?.quietDoor?.headline, data?.quietDoor?.headlineBM, n.quietDoor.headline)}
              </h2>
            </div>
            <p className="max-w-[36ch] text-[15px] leading-[1.6] text-ink-muted">
              {pickL(data?.quietDoor?.lede, data?.quietDoor?.ledeBM, n.quietDoor.lede)}
            </p>
          </div>

          <div className="mt-16 border-t border-b border-rule py-10 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {quietDoorStats.map((stat) => (
              <InventoryStat key={stat.key} value={stat.value} label={stat.label} />
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-4 items-center">
            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center bg-navy px-6 text-sm font-medium text-paper rounded-sm transition-[background-color,box-shadow] duration-150 ease-out hover:bg-navy-light hover:shadow-[0_4px_12px_rgba(10,22,40,0.12)]"
            >
              {pickL(data?.quietDoor?.ctaPrimary, data?.quietDoor?.ctaPrimaryBM, n.quietDoor.ctaPrimary)}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center border border-navy bg-transparent px-6 text-sm font-medium text-navy rounded-sm transition-[background-color,color] duration-150 ease-out hover:bg-navy hover:text-paper"
            >
              {pickL(data?.quietDoor?.ctaSecondary, data?.quietDoor?.ctaSecondaryBM, n.quietDoor.ctaSecondary)}
            </Link>
          </div>
        </div>
      </section>

      {/* ── 10. THE CONVERSATION ─────────────────────────────────── */}
      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:gap-20 lg:items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
                {pickL(data?.conversation?.eyebrow, data?.conversation?.eyebrowBM, n.conversation.eyebrow)}
              </p>
              <h2 className="mt-4 max-w-[18ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-paper">
                {pickL(data?.conversation?.headline, data?.conversation?.headlineBM, n.conversation.headline)}
              </h2>
            </div>
            <p className="max-w-[36ch] text-[15px] leading-[1.6] text-ink-faint">
              {pickL(data?.conversation?.lede, data?.conversation?.ledeBM, n.conversation.lede)}
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {channels.map((ch, i) => (
              <article
                key={i}
                className="bg-paper text-navy p-9 flex flex-col min-h-[280px]"
              >
                <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-faint mb-6">
                  {ch.tag}
                </p>
                <h3 className="font-fraunces text-[22px] font-normal leading-[1.2] tracking-[-0.01em] text-navy mb-3.5">
                  {ch.title}
                </h3>
                <p className="text-[14px] leading-[1.55] text-ink-muted flex-1 mb-7">
                  {ch.body}
                </p>
                <a
                  href={channelHrefs[i]}
                  {...(i === 0
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className={
                    i === 0
                      ? 'self-start inline-flex h-12 items-center justify-center bg-navy px-6 text-sm font-medium text-paper rounded-sm transition-[background-color,box-shadow] duration-150 ease-out hover:bg-navy-light hover:shadow-[0_4px_12px_rgba(10,22,40,0.12)]'
                      : 'self-start inline-flex h-12 items-center justify-center border border-navy bg-transparent px-6 text-sm font-medium text-navy rounded-sm transition-[background-color,color] duration-150 ease-out hover:bg-navy hover:text-paper'
                  }
                >
                  {ch.ctaLabel}
                  {i === 0 && <ArrowRight className="ml-2 h-4 w-4" />}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

    </PublicLayout>
  )
}
