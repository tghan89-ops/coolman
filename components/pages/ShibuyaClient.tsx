'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PublicLayout } from '@/components/layout/public-layout'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { useLanguage } from '@/lib/i18n/context'
import { useSettings } from '@/lib/settings/context'
import { cn } from '@/lib/utils'

export interface ShibuyaMachineFeature {
  feature: string
  featureBM: string | null
}

export interface ShibuyaMachine {
  id: string | number
  modelId: string
  modelName: string
  tagline: string | null
  taglineBM: string | null
  bondMatch: string | null
  bondMatchBM: string | null
  description: string | null
  descriptionBM: string | null
  motorPower: string | null
  maxDiameter: string | null
  weight: string | null
  anchor: string | null
  anchorBM: string | null
  rpmRange: string | null
  voltage: string | null
  maxDepth: string | null
  feedSystem: string | null
  holeRunout: string | null
  bitPairing: string | null
  stockNote: string | null
  price: string | null
  heroImageUrl: string | null
  heroImageAlt: string | null
  features: ShibuyaMachineFeature[]
}

interface ShibuyaClientProps {
  initialData: any
  machines: ShibuyaMachine[]
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

function CameraPlaceholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-navy/20">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <rect x="4" y="9" width="28" height="21" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="18" cy="19" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 9V7a2 2 0 012-2h8a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

export function ShibuyaClient({ initialData, machines }: ShibuyaClientProps) {
  const { language, t } = useLanguage()
  const settings = useSettings()

  const pick = (en?: string | null, bm?: string | null): string => {
    if (language === 'BM' && bm && bm.trim()) return bm
    return en ?? ''
  }

  const { data: liveData } = useLivePreview({
    initialData: initialData ?? {},
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 2,
  })
  const data: any = liveData ?? initialData ?? {}

  // Default to first machine in roster
  const defaultMachineId = useMemo(() => {
    if (machines.length === 0) return null
    return machines[0].modelId
  }, [machines])

  const [userSelectedModelId, setUserSelectedModelId] = useState<string | null>(null)
  const effectiveModelId =
    userSelectedModelId && machines.some((m) => m.modelId === userSelectedModelId)
      ? userSelectedModelId
      : defaultMachineId

  const selectedMachine = useMemo(
    () => machines.find((m) => m.modelId === effectiveModelId) ?? null,
    [machines, effectiveModelId],
  )

  // Demo form
  const [formState, setFormState] = useState<FormState>('idle')
  const [formError, setFormError] = useState('')

  async function handleDemoSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormState('submitting')
    setFormError('')
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          company: fd.get('company'),
          phone: fd.get('phone'),
          model: fd.get('model'),
          project: fd.get('project'),
          notes: fd.get('notes'),
        }),
      })
      const json = await res.json()
      if (!res.ok || json.error) {
        setFormError(json.error || t.pages.shibuya.demoFormError)
        setFormState('error')
        return
      }
      setFormState('success')
    } catch {
      setFormError(t.pages.shibuya.demoFormError)
      setFormState('error')
    }
  }

  // ── Hero ──────────────────────────────────────────────────────────────────
  const heroBadge =
    pick(data.hero?.badge, data.hero?.badgeBM) || 'Coolman × Shibuya Tools · Hiroshima'
  const heroBadgeSince = data.hero?.badgeSince || 'Sole MY Partner Since 2014'
  const heroLine1 =
    pick(data.hero?.headlineLine1, data.hero?.headlineLine1BM) || 'The best machine in the world.'
  const heroEmphasis =
    pick(data.hero?.headlineEmphasis, data.hero?.headlineEmphasisBM) || 'The bond built for here.'
  const heroSub =
    pick(data.hero?.subheadline, data.hero?.subheadlineBM) ||
    'Shibuya Tools, Hiroshima, has built precision core drilling machines since 1952. Coolman has built diamond segments calibrated for Malaysian aggregate since 1998. The partnership matches the machine to the ground — and the ground to the machine.'

  // ── Trust Bar ─────────────────────────────────────────────────────────────
  const trustStats: Array<{ number: string; label: string; labelBM: string }> =
    data.trustBar?.stats ?? [
      { number: '300+', label: 'Shibuya machines\nin Malaysia', labelBM: 'Mesin Shibuya\ndi Malaysia' },
      { number: '2014', label: 'Sole authorised\nMalaysian partner', labelBM: 'Rakan kongsi Malaysia\nsah tunggal' },
      { number: '3 yr', label: 'Full mechanical\nwarranty', labelBM: 'Waranti mekanikal\npenuh' },
      { number: '48 h', label: 'Replacement parts\nfrom PJ workshop', labelBM: 'Alat ganti\ndari bengkel PJ' },
    ]

  // ── Machine Story ─────────────────────────────────────────────────────────
  const storyEyebrow =
    pick(data.machineStory?.eyebrow, data.machineStory?.eyebrowBM) || 'Two workshops, one cut'
  const storyHeadline =
    pick(data.machineStory?.headline, data.machineStory?.headlineBM) ||
    'The machine is Japanese. The bond is Malaysian.'
  const storyIntro = pick(data.machineStory?.intro, data.machineStory?.introBM) || ''
  const col1Tag =
    pick(data.machineStory?.col1Tag, data.machineStory?.col1TagBM) || 'Shibuya · Since 1952'
  const col1Title =
    pick(data.machineStory?.col1Title, data.machineStory?.col1TitleBM) || 'The machine.'
  const col1Body = pick(data.machineStory?.col1Body, data.machineStory?.col1BodyBM) || ''
  const col1Country = data.machineStory?.col1Country || 'Hiroshima, Japan'
  const col2Tag =
    pick(data.machineStory?.col2Tag, data.machineStory?.col2TagBM) || 'Coolman · Since 1998'
  const col2Title =
    pick(data.machineStory?.col2Title, data.machineStory?.col2TitleBM) || 'The bond.'
  const col2Body = pick(data.machineStory?.col2Body, data.machineStory?.col2BodyBM) || ''
  const col2Country = data.machineStory?.col2Country || 'Selangor, Malaysia'
  const sitePhotoUrl =
    typeof data.machineStory?.sitePhoto === 'object' &&
    data.machineStory?.sitePhoto !== null &&
    'url' in data.machineStory.sitePhoto
      ? (data.machineStory.sitePhoto.url ?? null)
      : null
  const sitePhotoAlt = data.machineStory?.sitePhotoAlt ?? ''

  // ── Service Section ───────────────────────────────────────────────────────
  const serviceEyebrow =
    pick(data.serviceSection?.eyebrow, data.serviceSection?.eyebrowBM) ||
    'In-house service · Since 2014'
  const serviceHeadline =
    pick(data.serviceSection?.headline, data.serviceSection?.headlineBM) ||
    'Two trained Shibuya technicians. Same workshop, same building.'
  const serviceBody = pick(data.serviceSection?.body, data.serviceSection?.bodyBM) || ''
  const serviceStats: Array<{ number: string; label: string; labelBM: string }> =
    data.serviceSection?.stats ?? [
      {
        number: '3 yr',
        label: 'Full mechanical warranty\nmotor, gearbox, feed assembly',
        labelBM: 'Waranti mekanikal penuh\nmotor, kotak gear, pemasangan suap',
      },
      {
        number: '48 h',
        label: 'Parts turnaround\nfrom PJ workshop stock',
        labelBM: 'Pusing ganti alat ganti\ndari stok bengkel PJ',
      },
      {
        number: '2',
        label: 'Factory-trained Shibuya\ntechnicians on staff',
        labelBM: 'Juruteknik Shibuya\nterlatih kilang dalam kakitangan',
      },
    ]
  const servicePhotos: Array<{
    photo: any
    caption?: string | null
    captionBM?: string | null
  }> = data.serviceSection?.photos ?? []
  const servicePoints: Array<{
    number: string
    label: string
    labelBM?: string | null
    title: string
    titleBM?: string | null
    body: string
    bodyBM?: string | null
  }> = data.serviceSection?.servicePoints ?? []

  // ── CTA ───────────────────────────────────────────────────────────────────
  const ctaEyebrow = pick(data.cta?.eyebrow, data.cta?.eyebrowBM) || 'Order, service, or training'
  const ctaHeadline =
    pick(data.cta?.headline, data.cta?.headlineBM) ||
    'One conversation for the machine, the bit, and the cut.'
  const ctaBody = pick(data.cta?.body, data.cta?.bodyBM) || ''
  const ctaPrimaryLabel =
    pick(data.cta?.primaryCtaLabel, data.cta?.primaryCtaLabelBM) || t.pages.shibuya.ctaWhatsApp
  const ctaSecondaryLabel =
    pick(data.cta?.secondaryCtaLabel, data.cta?.secondaryCtaLabelBM) ||
    t.pages.shibuya.ctaAllChannels
  const waNumber = settings.whatsapp_number.replace(/\D/g, '')
  const waHref = `https://wa.me/${waNumber}`

  return (
    <PublicLayout>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="bg-paper py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Partnership badge */}
          <div className="mb-10 inline-flex items-center gap-3 border border-rule px-4 py-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-navy">
              {heroBadge}
            </span>
            <span className="h-3 w-px bg-rule" />
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
              {heroBadgeSince}
            </span>
          </div>

          <h1 className="font-fraunces text-[clamp(36px,5vw,68px)] font-normal leading-[1.04] tracking-[-0.025em] text-navy">
            {heroLine1}
            <br />
            <em className="not-italic text-accent">{heroEmphasis}</em>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">{heroSub}</p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#lineup"
              className="inline-flex min-h-[48px] items-center gap-2 bg-navy px-8 py-3 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
            >
              {t.pages.shibuya.modelsEyebrow || 'See Machines'}
            </a>
            <a
              href="#demo"
              className="inline-flex min-h-[48px] items-center gap-2 border border-rule px-8 py-3 text-sm font-semibold text-navy transition-colors hover:border-navy"
            >
              {t.pages.shibuya.demoFormTitle}
            </a>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────────────── */}
      <section className="border-y border-rule bg-paper">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-rule lg:grid-cols-4">
            {trustStats.map((stat, i) => (
              <div key={i} className="px-6 py-8 text-center lg:py-10">
                <p className="font-mono text-[26px] font-bold leading-none text-navy tabular-nums">
                  {stat.number}
                </p>
                <p className="mt-2 whitespace-pre-line font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                  {pick(stat.label, stat.labelBM)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MACHINE STORY ─────────────────────────────────────────────────── */}
      <section className="bg-paper py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {storyEyebrow}
          </p>
          <h2 className="mt-4 max-w-2xl font-fraunces text-[clamp(28px,3.2vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
            {storyHeadline}
          </h2>
          {storyIntro && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">{storyIntro}</p>
          )}

          {/* Story pair */}
          <div className="mt-12 grid gap-px border border-rule bg-rule lg:grid-cols-2">
            <div className="bg-paper p-8 lg:p-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                {col1Tag}
              </p>
              <h3 className="mt-3 font-fraunces text-2xl font-normal text-navy">{col1Title}</h3>
              {col1Body && (
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-muted">
                  {col1Body}
                </p>
              )}
              {col1Country && (
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                  {col1Country}
                </p>
              )}
            </div>
            <div className="bg-paper p-8 lg:p-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                {col2Tag}
              </p>
              <h3 className="mt-3 font-fraunces text-2xl font-normal text-navy">{col2Title}</h3>
              {col2Body && (
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-muted">
                  {col2Body}
                </p>
              )}
              {col2Country && (
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                  {col2Country}
                </p>
              )}
            </div>
          </div>

          {sitePhotoUrl && (
            <div className="relative mt-12 aspect-[16/7] overflow-hidden">
              <Image src={sitePhotoUrl} alt={sitePhotoAlt} fill className="object-cover" />
            </div>
          )}
        </div>
      </section>

      {/* ── MACHINE LINEUP ────────────────────────────────────────────────── */}
      <section id="lineup" className="border-t border-rule bg-paper py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {t.pages.shibuya.modelsEyebrow}
          </p>
          <h2 className="mt-4 font-fraunces text-[clamp(28px,3.2vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
            {t.pages.shibuya.modelsHeadline}
          </h2>

          {machines.length === 0 ? (
            <div className="mt-12 flex max-w-[55ch] flex-col gap-4">
              <p className="text-base text-ink-muted">{t.pages.shibuya.emptyStateBody}</p>
              <Link
                href="/contact"
                className="inline-flex min-h-[48px] w-fit items-center gap-2 bg-navy px-8 py-3 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
              >
                {t.pages.shibuya.requestQuote}
              </Link>
            </div>
          ) : (
            <>
              {/* Border tab nav */}
              <div
                className="mt-10 flex flex-wrap border-b border-rule"
                role="tablist"
                aria-label={t.pages.shibuya.modelsHeadline}
              >
                {machines.map((machine) => {
                  const isActive = effectiveModelId === machine.modelId
                  return (
                    <button
                      key={machine.modelId}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setUserSelectedModelId(machine.modelId)}
                      className={cn(
                        '-mb-px min-h-[44px] border-b-[3px] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.10em] transition-colors',
                        isActive
                          ? 'border-b-accent text-navy'
                          : 'border-b-transparent text-ink-muted hover:text-navy',
                      )}
                    >
                      {machine.modelName}
                    </button>
                  )
                })}
              </div>

              {selectedMachine && (
                <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
                  {/* Photo / placeholder */}
                  <div className="relative aspect-square overflow-hidden bg-[#EFF4FB]">
                    {selectedMachine.heroImageUrl ? (
                      <Image
                        src={selectedMachine.heroImageUrl}
                        alt={selectedMachine.heroImageAlt ?? selectedMachine.modelName}
                        fill
                        className="object-contain p-8"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-navy/20">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                          <rect x="6" y="12" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
                          <circle cx="24" cy="26" r="7" stroke="currentColor" strokeWidth="2" />
                          <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span className="font-mono text-[11px] uppercase tracking-[0.12em]">
                          {selectedMachine.modelId}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    {pick(selectedMachine.tagline, selectedMachine.taglineBM) && (
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                        {pick(selectedMachine.tagline, selectedMachine.taglineBM)}
                      </p>
                    )}
                    <h3 className="mt-2 font-fraunces text-[clamp(24px,2.4vw,32px)] font-normal text-navy">
                      {selectedMachine.modelName}
                    </h3>
                    {pick(selectedMachine.description, selectedMachine.descriptionBM) && (
                      <p className="mt-4 text-base leading-relaxed text-ink-muted">
                        {pick(selectedMachine.description, selectedMachine.descriptionBM)}
                      </p>
                    )}

                    {/* Spec table — row only rendered when field has a value */}
                    <table className="mt-8 w-full border-collapse text-sm">
                      <tbody>
                        {selectedMachine.maxDiameter && (
                          <tr className="border-b border-rule">
                            <td className="w-[140px] py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.10em] text-ink-faint">
                              {t.pages.shibuya.maxDiameterLabel}
                            </td>
                            <td className="py-2 font-mono text-sm text-navy">
                              {selectedMachine.maxDiameter}
                            </td>
                          </tr>
                        )}
                        {pick(selectedMachine.anchor, selectedMachine.anchorBM) && (
                          <tr className="border-b border-rule">
                            <td className="w-[140px] py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.10em] text-ink-faint">
                              {t.pages.shibuya.anchorLabel}
                            </td>
                            <td className="py-2 font-mono text-sm text-navy">
                              {pick(selectedMachine.anchor, selectedMachine.anchorBM)}
                            </td>
                          </tr>
                        )}
                        {selectedMachine.motorPower && (
                          <tr className="border-b border-rule">
                            <td className="w-[140px] py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.10em] text-ink-faint">
                              {t.pages.shibuya.motorPowerLabel}
                            </td>
                            <td className="py-2 font-mono text-sm text-navy">
                              {selectedMachine.motorPower}
                            </td>
                          </tr>
                        )}
                        {selectedMachine.voltage && (
                          <tr className="border-b border-rule">
                            <td className="w-[140px] py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.10em] text-ink-faint">
                              {t.pages.shibuya.voltageLabel}
                            </td>
                            <td className="py-2 font-mono text-sm text-navy">
                              {selectedMachine.voltage}
                            </td>
                          </tr>
                        )}
                        {selectedMachine.feedSystem && (
                          <tr className="border-b border-rule">
                            <td className="w-[140px] py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.10em] text-ink-faint">
                              {t.pages.shibuya.feedSystemLabel}
                            </td>
                            <td className="py-2 font-mono text-sm text-navy">
                              {selectedMachine.feedSystem}
                            </td>
                          </tr>
                        )}
                        {selectedMachine.maxDepth && (
                          <tr className="border-b border-rule">
                            <td className="w-[140px] py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.10em] text-ink-faint">
                              {t.pages.shibuya.maxDepthLabel}
                            </td>
                            <td className="py-2 font-mono text-sm text-navy">
                              {selectedMachine.maxDepth}
                            </td>
                          </tr>
                        )}
                        {selectedMachine.holeRunout && (
                          <tr className="border-b border-rule">
                            <td className="w-[140px] py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.10em] text-ink-faint">
                              {t.pages.shibuya.holeRunoutLabel}
                            </td>
                            <td className="py-2 font-mono text-sm text-navy">
                              {selectedMachine.holeRunout}
                            </td>
                          </tr>
                        )}
                        {selectedMachine.weight && (
                          <tr className="border-b border-rule">
                            <td className="w-[140px] py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.10em] text-ink-faint">
                              {t.pages.shibuya.weightLabel}
                            </td>
                            <td className="py-2 font-mono text-sm text-navy">
                              {selectedMachine.weight}
                            </td>
                          </tr>
                        )}
                        {selectedMachine.bitPairing && (
                          <tr className="border-b border-rule">
                            <td className="w-[140px] py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.10em] text-ink-faint">
                              {t.pages.shibuya.bitPairingLabel}
                            </td>
                            <td className="py-2 font-mono text-sm text-navy">
                              {selectedMachine.bitPairing}
                            </td>
                          </tr>
                        )}
                        {selectedMachine.rpmRange && (
                          <tr className="border-b border-rule">
                            <td className="w-[140px] py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.10em] text-ink-faint">
                              {t.pages.shibuya.rpmRangeLabel}
                            </td>
                            <td className="py-2 font-mono text-sm text-navy">
                              {selectedMachine.rpmRange}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href="#demo"
                        className="inline-flex min-h-[44px] items-center gap-2 bg-navy px-6 py-2.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
                      >
                        {t.pages.shibuya.demoFormTitle}
                      </a>
                      <button
                        type="button"
                        className="inline-flex min-h-[44px] items-center gap-2 border border-rule px-6 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-navy hover:text-navy"
                      >
                        {t.pages.shibuya.downloadSpecSheet}
                      </button>
                    </div>

                    {/* Stock / lead-time note */}
                    {selectedMachine.stockNote && (
                      <p className="mt-5 border-t border-dashed border-rule pt-4 font-mono text-[10px] uppercase tracking-[0.10em] text-ink-faint">
                        {selectedMachine.stockNote}
                      </p>
                    )}

                    {/* Features */}
                    {selectedMachine.features.length > 0 && (
                      <div className="mt-8">
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                          {t.pages.shibuya.keyFeaturesLabel}
                        </p>
                        <ul className="mt-3 space-y-1.5">
                          {selectedMachine.features.map((f, idx) => (
                            <li
                              key={`${selectedMachine.modelId}-f-${idx}`}
                              className="flex items-start gap-2 text-sm text-ink-muted"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                              {pick(f.feature, f.featureBM)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── SERVICE ───────────────────────────────────────────────────────── */}
      <section className="border-t border-rule bg-paper py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {serviceEyebrow}
          </p>
          <h2 className="mt-4 max-w-2xl font-fraunces text-[clamp(28px,3.2vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
            {serviceHeadline}
          </h2>
          {serviceBody && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">{serviceBody}</p>
          )}

          {/* Stats bar */}
          <div className="mt-10 grid grid-cols-3 divide-x divide-rule border border-rule">
            {serviceStats.map((stat, i) => (
              <div key={i} className="px-6 py-6 text-center">
                <p className="font-mono text-[26px] font-bold leading-none text-navy tabular-nums">
                  {stat.number}
                </p>
                <p className="mt-2 whitespace-pre-line font-mono text-[10px] uppercase tracking-[0.10em] text-ink-muted">
                  {pick(stat.label, stat.labelBM)}
                </p>
              </div>
            ))}
          </div>

          {/* Photos */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {servicePhotos.length > 0 ? (
              servicePhotos.map((p, i) => {
                const photoUrl =
                  typeof p.photo === 'object' && p.photo !== null && 'url' in p.photo
                    ? p.photo.url
                    : null
                return (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#EFF4FB]">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt={pick(p.caption, p.captionBM) || ''}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <CameraPlaceholder />
                      )}
                    </div>
                    {pick(p.caption, p.captionBM) && (
                      <p className="font-mono text-[10px] uppercase tracking-[0.10em] text-ink-faint">
                        {pick(p.caption, p.captionBM)}
                      </p>
                    )}
                  </div>
                )
              })
            ) : (
              [0, 1, 2].map((i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden bg-[#EFF4FB]">
                  <CameraPlaceholder />
                </div>
              ))
            )}
          </div>

          {/* Numbered service points */}
          {servicePoints.length > 0 && (
            <div className="mt-16 space-y-8">
              {servicePoints.map((sp) => (
                <div key={sp.number} className="grid grid-cols-[140px_1fr] gap-6">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                      {sp.number}
                    </p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                      {pick(sp.label, sp.labelBM)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-fraunces text-lg font-normal text-navy">
                      {pick(sp.title, sp.titleBM)}
                    </h3>
                    {pick(sp.body, sp.bodyBM) && (
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                        {pick(sp.body, sp.bodyBM)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── DEMO FORM ─────────────────────────────────────────────────────── */}
      <section id="demo" className="border-t border-rule bg-paper py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left: text */}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                {t.pages.shibuya.demoFormTitle}
              </p>
              <h2 className="mt-4 font-fraunces text-[clamp(28px,3.2vw,40px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
                {storyHeadline}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">{heroSub}</p>
            </div>

            {/* Right: form card */}
            <div className="border border-navy p-8">
              {formState === 'success' ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="font-fraunces text-xl font-normal text-navy">
                    {t.pages.shibuya.demoFormSuccessTitle}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-muted">
                    {t.pages.shibuya.demoFormSuccessBody}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="demo-name"
                        className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted"
                      >
                        {t.pages.shibuya.demoFormName} *
                      </label>
                      <input
                        id="demo-name"
                        name="name"
                        type="text"
                        required
                        className="w-full border border-rule bg-white px-3 py-2.5 text-sm text-navy focus:border-navy focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="demo-company"
                        className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted"
                      >
                        {t.pages.shibuya.demoFormCompany}
                      </label>
                      <input
                        id="demo-company"
                        name="company"
                        type="text"
                        className="w-full border border-rule bg-white px-3 py-2.5 text-sm text-navy focus:border-navy focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="demo-phone"
                      className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted"
                    >
                      {t.pages.shibuya.demoFormPhone} *
                    </label>
                    <input
                      id="demo-phone"
                      name="phone"
                      type="tel"
                      required
                      className="w-full border border-rule bg-white px-3 py-2.5 text-sm text-navy focus:border-navy focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="demo-model"
                      className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted"
                    >
                      {t.pages.shibuya.demoFormModel} *
                    </label>
                    <select
                      id="demo-model"
                      name="model"
                      required
                      defaultValue=""
                      className="w-full border border-rule bg-white px-3 py-2.5 text-sm text-navy focus:border-navy focus:outline-none"
                    >
                      <option value="" disabled>
                        {t.pages.shibuya.demoFormModelPlaceholder}
                      </option>
                      {machines.map((m) => (
                        <option key={m.modelId} value={m.modelId}>
                          {m.modelName}
                        </option>
                      ))}
                      {machines.length === 0 && (
                        <option value="general">General enquiry</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="demo-project"
                      className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted"
                    >
                      {t.pages.shibuya.demoFormProject}
                    </label>
                    <input
                      id="demo-project"
                      name="project"
                      type="text"
                      className="w-full border border-rule bg-white px-3 py-2.5 text-sm text-navy focus:border-navy focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="demo-notes"
                      className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted"
                    >
                      {t.pages.shibuya.demoFormNotes}
                    </label>
                    <textarea
                      id="demo-notes"
                      name="notes"
                      rows={3}
                      className="w-full resize-none border border-rule bg-white px-3 py-2.5 text-sm text-navy focus:border-navy focus:outline-none"
                    />
                  </div>
                  {formState === 'error' && formError && (
                    <p className="text-sm text-danger">{formError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    className="inline-flex min-h-[48px] w-full items-center justify-center bg-navy px-8 py-3 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {formState === 'submitting' ? '…' : t.pages.shibuya.demoFormSubmit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ─────────────────────────────────────────────────────── */}
      <section className="bg-navy py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Left: text */}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
                {ctaEyebrow}
              </p>
              <h2 className="mt-4 font-fraunces text-[clamp(28px,3.2vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-paper">
                {ctaHeadline}
              </h2>
              {ctaBody && (
                <p className="mt-4 text-base leading-relaxed text-paper/60">{ctaBody}</p>
              )}
            </div>
            {/* Right: stacked buttons */}
            <div className="flex flex-col gap-3 lg:items-end">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 bg-paper px-8 py-3 text-sm font-semibold text-navy transition-opacity hover:opacity-90 lg:w-auto lg:min-w-[220px]"
              >
                {ctaPrimaryLabel}
              </a>
              <Link
                href="/contact"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 border border-paper/30 px-8 py-3 text-sm font-semibold text-paper transition-colors hover:border-paper/60 lg:w-auto lg:min-w-[220px]"
              >
                {ctaSecondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </PublicLayout>
  )
}
