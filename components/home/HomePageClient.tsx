'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Clock,
  Wrench,
  Repeat2,
  UserX,
  MessageCircle,
  Phone,
  MapPin,
  type LucideIcon,
} from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { useLanguage } from '@/lib/i18n/context'
import { FearCard } from '@/components/industrial/FearCard'
import { InventoryStat } from '@/components/industrial/InventoryStat'
import { ChannelCard } from '@/components/industrial/ChannelCard'
import { HeritageBadge } from '@/components/industrial/HeritageBadge'
import { ChinesePullquote } from '@/components/editorial/Pullquote'
import { DropCap } from '@/components/editorial/DropCap'
import type { Setting } from '@/payload-types'

interface HomePageClientProps {
  settings: Partial<Setting>
  publishedPostsCount: number
}

export function HomePageClient({ settings, publishedPostsCount }: HomePageClientProps) {
  const { t } = useLanguage()
  const n = t.homeNarrative

  const whatsappNumber = settings?.whatsapp_number || '+60126363156'
  const whatsappDigits = whatsappNumber.replace(/\D/g, '')
  const onTimePct = typeof settings?.inventory_on_time_pct === 'number'
    ? settings.inventory_on_time_pct
    : 96
  const dispatchCutoff = settings?.inventory_dispatch_cutoff || '14:00'

  // Guard against admin-entered non-numeric or short values for the WhatsApp/tel
  // fields in Payload Settings. Malaysian mobile numbers are 9–10 digits
  // including the leading 60 country code; require ≥ 8 to consider valid.
  const whatsappHref =
    whatsappDigits.length >= 8 ? `https://wa.me/${whatsappDigits}` : '#'
  const telHref = whatsappDigits.length >= 8 ? `tel:+${whatsappDigits}` : '#'

  // Pair fear icons by stable key, not by array index. If copy.ts ever
  // reorders or adds/removes a fear card, the icon-to-card pairing still
  // holds because each card declares its own `key`.
  const fearIconMap: Record<string, LucideIcon> = {
    delay: Clock,
    equipment: Wrench,
    inconsistency: Repeat2,
    alone: UserX,
  }

  const channelIcons = [
    <MessageCircle key="wa" className="h-6 w-6" />,
    <Phone key="phone" className="h-6 w-6" />,
    <MapPin key="map" className="h-6 w-6" />,
  ]

  const channelHrefs = [whatsappHref, telHref, '/contact#site-visit']

  // Overlay live Settings values onto the quietDoor stats by stable key, not
  // by magic array index.
  const quietDoorStats = n.quietDoor.stats.map((s) => {
    if (s.key === 'onTimePct') return { ...s, value: `${onTimePct}%` }
    if (s.key === 'dispatchCutoff') return { ...s, value: dispatchCutoff }
    return s
  })

  return (
    <PublicLayout headerVariant="transparent">

      {/* ── 1. OPENING SURFACE ───────────────────────────────────── */}
      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-[1280px] px-6 pt-32 pb-24 lg:px-8 lg:pt-40 lg:pb-32">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
                {n.opening.eyebrow}
              </p>
              <h1 className="mt-6 font-fraunces text-[clamp(40px,6vw,84px)] font-normal leading-[1.02] tracking-[-0.025em] text-paper">
                {n.opening.headline}
              </h1>
              <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-ink-faint">
                {n.opening.lede}
              </p>
            </div>
            <div className="flex lg:items-start lg:justify-end">
              <HeritageBadge />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FEAR GRID ─────────────────────────────────────────── */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:gap-20 lg:items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                {n.fearGrid.eyebrow}
              </p>
              <h2 className="mt-4 max-w-[18ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
                {n.fearGrid.headline}
              </h2>
            </div>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {n.fearGrid.cards.map((card) => {
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
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20 lg:items-start">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                {n.threeMythsIntro.eyebrow}
              </p>
              <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
                {n.threeMythsIntro.headline}
              </h2>
            </div>
            <div className="lg:pt-2">
              <p className="text-base leading-[1.7] text-ink-muted">
                {n.threeMythsIntro.lede}
              </p>
              <Link
                href="/why-coolman"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors duration-150 ease-out hover:text-accent-light min-h-[44px]"
              >
                {n.threeMythsIntro.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. BROTHERHOOD INTRO ─────────────────────────────────── */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20 lg:items-start">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                {n.brotherhoodIntro.eyebrow}
              </p>
              <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
                {n.brotherhoodIntro.headline}
              </h2>
            </div>
            <div className="lg:pt-2">
              <p className="text-base leading-[1.7] text-ink-muted">
                {n.brotherhoodIntro.lede}
              </p>
              <Link
                href="/why-coolman"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors duration-150 ease-out hover:text-accent-light min-h-[44px]"
              >
                {n.brotherhoodIntro.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CHINESE PULLQUOTE ─────────────────────────────────── */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-8 lg:py-24">
          <ChinesePullquote quote="home" />
        </div>
      </section>

      {/* ── 6. FIELD NOTES PREVIEW (gated) ───────────────────────── */}
      {publishedPostsCount >= 3 && (
        <section className="bg-paper border-t border-rule">
          <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
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

      {/* ── 7. ALAN'S LETTER ─────────────────────────────────────── */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {n.alansLetter.eyebrow}
          </p>
          <div className="mt-10 max-w-[680px]">
            {n.alansLetter.paragraphs.map((para, i) => (
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
              {n.alansLetter.signature}
            </p>
            <p className="mt-1 font-fraunces italic text-[15px] text-ink-muted">
              {n.alansLetter.signatureLine2}
            </p>
          </div>
        </div>
      </section>

      {/* ── 8. THE QUIET DOOR ────────────────────────────────────── */}
      <section className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[2fr_1fr] lg:gap-20 lg:items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                {n.quietDoor.eyebrow}
              </p>
              <h2 className="mt-4 max-w-[22ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
                {n.quietDoor.headline}
              </h2>
            </div>
            <p className="max-w-[36ch] text-[15px] leading-[1.6] text-ink-muted">
              {n.quietDoor.lede}
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
              {n.quietDoor.ctaPrimary}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center border border-navy bg-transparent px-6 text-sm font-medium text-navy rounded-sm transition-[background-color,color] duration-150 ease-out hover:bg-navy hover:text-paper"
            >
              {n.quietDoor.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* ── 9. THE CONVERSATION ──────────────────────────────────── */}
      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:gap-20 lg:items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
                {n.conversation.eyebrow}
              </p>
              <h2 className="mt-4 max-w-[18ch] font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-paper">
                {n.conversation.headline}
              </h2>
            </div>
            <p className="max-w-[36ch] text-[15px] leading-[1.6] text-ink-faint">
              {n.conversation.lede}
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {n.conversation.channels.map((ch, i) => (
              <ChannelCard
                key={i}
                icon={channelIcons[i]}
                label={ch.tag}
                value={ch.title}
                href={channelHrefs[i]}
                ariaLabel={`${ch.tag}: ${ch.title}`}
              />
            ))}
          </div>
        </div>
      </section>

    </PublicLayout>
  )
}
