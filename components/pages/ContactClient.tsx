'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/lib/i18n/context'
import { useLivePreview } from '@payloadcms/live-preview-react'

interface ContactClientProps {
  initialData: any
  // Settings is admin-restricted at the global level but the public contact
  // page needs its values (WhatsApp number, legal entity, address, opening
  // hours, dispatch cut-off). The server page reads it with `overrideAccess`
  // and hands it down here. Fields are best-effort optional; every render path
  // tolerates a missing or partial `settings` object.
  settings: any
}

export function ContactClient({ initialData, settings }: ContactClientProps) {
  const { data } = useLivePreview({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 1,
  })

  const { language, t } = useLanguage()
  const pick = (en?: string | null, bm?: string | null): string => {
    if (language === 'BM' && bm && bm.trim()) return bm
    return en ?? ''
  }
  const c = t.pages.contact

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  // ContactPage global drives the office phone + map embed; copy lede + form
  // strings come from the i18n COPY table. Live preview re-renders this client
  // when an admin edits the ContactPage global.
  const officePhone = (data?.phone as string | undefined) ?? ''
  const officeEmail = (data?.email as string | undefined) ?? 'sales@coolman.com.my'

  // Settings is read-only here. Defaults below mirror the schema defaults in
  // globals/Settings.ts so the page renders sensibly even if the global has
  // never been visited in /admin.
  const legalEntityName: string =
    (settings?.legal_entity_name as string | undefined)?.trim() || 'Coolman Malaysia Sdn Bhd'
  const legalEntityRegNo: string =
    (settings?.legal_entity_reg_no as string | undefined)?.trim() || ''
  const legalEntityAddress: string =
    (settings?.legal_entity_address as string | undefined)?.trim() || ''
  const whatsappNumber: string =
    (settings?.whatsapp_number as string | undefined)?.trim() || '+60126363156'
  const openingMonFri: string =
    (settings?.opening_hours?.mon_fri as string | undefined)?.trim() || '09:00–18:00'
  const openingSat: string =
    (settings?.opening_hours?.sat as string | undefined)?.trim() || '09:00–13:00'
  const openingSun: string =
    (settings?.opening_hours?.sun as string | undefined)?.trim() || 'Closed'
  const dispatchCutoff: string =
    (settings?.inventory_dispatch_cutoff as string | undefined)?.trim() || '14:00'

  // wa.me deep-link wants digits only. Strip "+" and any spaces just in case.
  const whatsappDigits = whatsappNumber.replace(/\D/g, '')
  const whatsappHref = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
    c.whatsappPrefillText,
  )}`

  // Display format for the WhatsApp / office numbers: keep what Alan typed in
  // Settings/ContactPage. Numbers render in mono.
  const whatsappDisplay = whatsappNumber
  const officePhoneDisplay = officePhone || whatsappNumber

  // Google Maps deep-link: only render the "Open in maps" button if we have
  // an address. Otherwise the button has nowhere to send the visitor.
  const mapsHref = legalEntityAddress
    ? `https://www.google.com/maps/?q=${encodeURIComponent(legalEntityAddress)}`
    : null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)
    const fd = new FormData(e.currentTarget)
    const payload = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      company: String(fd.get('company') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      message: String(fd.get('message') ?? ''),
      website: String(fd.get('website') ?? ''),
    }
    try {
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const respData = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSubmitError(respData?.error || c.formError)
      } else {
        setSubmitted(true)
      }
    } catch {
      setSubmitError(c.networkError)
    } finally {
      setIsSubmitting(false)
    }
  }

  const directLines: Array<{ label: string; email: string; note: string }> = [
    { label: c.directLineSalesLabel, email: 'sales@coolman.com.my', note: c.directLineSalesNote },
    { label: c.directLinePartsLabel, email: 'parts@coolman.com.my', note: c.directLinePartsNote },
    {
      label: c.directLineTrainingLabel,
      email: 'training@coolman.com.my',
      note: c.directLineTrainingNote,
    },
    {
      label: c.directLineCareersLabel,
      email: 'careers@coolman.com.my',
      note: c.directLineCareersNote,
    },
  ]

  return (
    <PublicLayout>
      {/* Hero — paper background, Fraunces h1 with italic emphasis. */}
      <header className="bg-paper pb-12 pt-28 lg:pb-20 lg:pt-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-dark">
            {c.heroEyebrow}
          </div>
          <h1 className="mt-6 max-w-[22ch] font-fraunces text-[44px] font-normal leading-[1.08] tracking-tight text-navy md:text-[56px] lg:text-[64px]">
            {pick(data?.heroTitle, data?.heroTitleBM) || c.heroTitle}{' '}
            <em className="font-fraunces italic text-navy">{c.heroTitleEmphasis}</em>
          </h1>
          <p className="mt-6 max-w-[58ch] text-base leading-[1.7] text-ink-muted lg:text-lg">
            {pick(data?.heroSubtitle, data?.heroSubtitleBM) || c.heroLede}
          </p>
        </div>
      </header>

      {/* Channels — 3-column grid on desktop, single column on mobile. */}
      <section className="bg-paper py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 lg:mb-14">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-dark">
              {c.channelsEyebrow}
            </div>
            <h2 className="mt-4 max-w-[24ch] font-fraunces text-[28px] font-normal leading-[1.18] tracking-tight text-navy lg:text-[34px]">
              {c.channelsHeadline}
            </h2>
            <p className="mt-4 max-w-[58ch] text-sm leading-[1.7] text-ink-muted lg:text-base">
              {c.channelsLede}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-0 lg:px-8">
          <div className="grid grid-cols-1 gap-px border-y border-rule bg-rule lg:grid-cols-3">
            {/* Channel 01 — WhatsApp */}
            <article className="flex flex-col bg-paper p-8 transition-colors duration-150 hover:bg-white lg:p-12">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-dark">
                {c.channel1Badge}
              </div>
              <h3 className="mt-6 max-w-[20ch] font-fraunces text-[24px] font-normal leading-[1.18] tracking-tight text-navy lg:text-[26px]">
                {c.channel1Title}
              </h3>
              <p className="mt-4 text-sm leading-[1.7] text-ink-muted">{c.channel1Body}</p>
              <dl className="mt-6 border-t border-rule pt-4">
                <div className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[13px]">
                  <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {c.channel1NumberLabel}
                  </dt>
                  <dd className="font-mono text-navy">{whatsappDisplay}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[13px]">
                  <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {c.channel1HoursLabel}
                  </dt>
                  <dd className="text-navy">{c.channel1Hours}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[13px]">
                  <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {c.channel1ResponseLabel}
                  </dt>
                  <dd className="text-navy">{c.channel1Response}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[13px]">
                  <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {c.channel1LanguagesLabel}
                  </dt>
                  <dd className="text-navy">{c.channel1Languages}</dd>
                </div>
              </dl>
              <div className="mt-auto pt-6">
                <Button
                  asChild
                  className="h-12 bg-accent-dark text-white hover:bg-accent"
                >
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    {c.channel1Cta}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </article>

            {/* Channel 02 — Office line */}
            <article className="flex flex-col bg-paper p-8 transition-colors duration-150 hover:bg-white lg:p-12">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-dark">
                {c.channel2Badge}
              </div>
              <h3 className="mt-6 max-w-[20ch] font-fraunces text-[24px] font-normal leading-[1.18] tracking-tight text-navy lg:text-[26px]">
                {c.channel2Title}
              </h3>
              <p className="mt-4 text-sm leading-[1.7] text-ink-muted">{c.channel2Body}</p>
              <dl className="mt-6 border-t border-rule pt-4">
                <div className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[13px]">
                  <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {c.channel2NumberLabel}
                  </dt>
                  <dd className="font-mono text-navy">{officePhoneDisplay}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[13px]">
                  <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {c.channel2HoursLabel}
                  </dt>
                  <dd className="text-navy">{c.channel2Hours}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[13px]">
                  <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {c.channel2ResponseLabel}
                  </dt>
                  <dd className="text-navy">{c.channel2Response}</dd>
                </div>
              </dl>
              <div className="mt-auto pt-6">
                <Button
                  asChild
                  variant="outline"
                  className="h-12 border-navy text-navy hover:bg-navy hover:text-white"
                >
                  <a href={`tel:${officePhoneDisplay.replace(/\s+/g, '')}`}>
                    {c.channel2Cta}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </article>

            {/* Channel 03 — Site visit form (anchor scrolls to the form below). */}
            <article className="flex flex-col bg-paper p-8 transition-colors duration-150 hover:bg-white lg:p-12">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-dark">
                {c.channel3Badge}
              </div>
              <h3 className="mt-6 max-w-[20ch] font-fraunces text-[24px] font-normal leading-[1.18] tracking-tight text-navy lg:text-[26px]">
                {c.channel3Title}
              </h3>
              <p className="mt-4 text-sm leading-[1.7] text-ink-muted">{c.channel3Body}</p>
              <dl className="mt-6 border-t border-rule pt-4">
                <div className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[13px]">
                  <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {c.channel3FormatLabel}
                  </dt>
                  <dd className="text-navy">{c.channel3Format}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[13px]">
                  <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {c.channel3ResponseLabel}
                  </dt>
                  <dd className="text-navy">{c.channel3Response}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[13px]">
                  <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {c.channel3OutputLabel}
                  </dt>
                  <dd className="text-navy">{c.channel3Output}</dd>
                </div>
              </dl>
              <div className="mt-auto pt-6">
                <Button
                  asChild
                  variant="outline"
                  className="h-12 border-navy text-navy hover:bg-navy hover:text-white"
                >
                  <a href="#site-visit-form">
                    {c.channel3Cta}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Location — navy background, 2-column. */}
      <section className="bg-navy py-16 text-paper lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 lg:mb-14">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-light">
              {c.locationEyebrow}
            </div>
            <h2 className="mt-4 max-w-[24ch] font-fraunces text-[28px] font-normal leading-[1.18] tracking-tight text-paper lg:text-[34px]">
              {c.locationHeadline}
            </h2>
            <p className="mt-4 max-w-[58ch] text-sm leading-[1.7] text-ink-faint lg:text-base">
              {c.locationLede}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
            <div className="pt-2">
              <h3 className="mb-6 max-w-[22ch] font-fraunces text-[24px] font-normal leading-[1.2] tracking-tight text-paper lg:text-[26px]">
                {legalEntityName}
              </h3>
              <div className="mb-8 max-w-[38ch] text-[15px] leading-[1.7] text-paper">
                {legalEntityAddress ? (
                  <p style={{ whiteSpace: 'pre-line' }}>{legalEntityAddress}</p>
                ) : (
                  <>
                    <p>{c.locationAddressFallback}</p>
                    <p className="mt-2 text-ink-faint">{c.locationAddressNote}</p>
                  </>
                )}
                {legalEntityRegNo ? (
                  <p className="mt-2 text-ink-faint">
                    {c.locationRegPrefix} {legalEntityRegNo}
                  </p>
                ) : null}
              </div>

              <dl className="mb-6 grid grid-cols-1 gap-5 border-y border-paper/20 py-5 sm:grid-cols-3">
                <div>
                  <dt className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {c.locationLabelMonFri}
                  </dt>
                  <dd className="font-mono text-[14px] text-paper">{openingMonFri}</dd>
                </div>
                <div>
                  <dt className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {c.locationLabelSat}
                  </dt>
                  <dd className="font-mono text-[14px] text-paper">{openingSat}</dd>
                </div>
                <div>
                  <dt className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {c.locationLabelSun}
                  </dt>
                  <dd className="font-mono text-[14px] text-paper">{openingSun}</dd>
                </div>
              </dl>

              <p className="mb-6 text-[13px] text-ink-faint">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                  {c.locationDispatchLabel}:
                </span>{' '}
                <span className="font-mono text-paper">{dispatchCutoff}</span>{' '}
                <span className="text-ink-faint">{c.locationDispatchSuffix}</span>
              </p>

              {mapsHref ? (
                <Button
                  asChild
                  className="h-12 bg-accent-dark text-white hover:bg-accent"
                >
                  <a href={mapsHref} target="_blank" rel="noopener noreferrer">
                    {c.locationOpenInMaps}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              ) : null}
            </div>

            {/* Schematic SVG map — ported from contact.html. "SINCE 2007" not 1998. */}
            <div
              className="relative aspect-[4/3] overflow-hidden border border-accent/20 bg-navy-light"
              aria-label="Workshop location, Petaling Jaya"
            >
              <svg
                viewBox="0 0 600 450"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Schematic of the workshop location within Petaling Jaya"
                className="block h-full w-full"
              >
                <defs>
                  <pattern id="contact-map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(96,165,250,0.12)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="600" height="450" fill="#122036" />
                <rect width="600" height="450" fill="url(#contact-map-grid)" />

                {/* Roads */}
                <path d="M 0 280 L 600 240" stroke="#1A2D47" strokeWidth="22" fill="none" />
                <path d="M 240 0 L 280 450" stroke="#1A2D47" strokeWidth="14" fill="none" />
                <path d="M 0 120 L 600 100" stroke="#1A2D47" strokeWidth="6" fill="none" />
                <path d="M 100 0 L 130 450" stroke="#1A2D47" strokeWidth="6" fill="none" />
                <path d="M 420 0 L 450 450" stroke="#1A2D47" strokeWidth="6" fill="none" />

                {/* Road labels */}
                <text x="20" y="270" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#94A3B8" letterSpacing="0.1em">FEDERAL HIGHWAY</text>
                <text x="290" y="20" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#94A3B8" letterSpacing="0.1em">JLN PJS 1</text>
                <text x="20" y="115" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#94A3B8" letterSpacing="0.1em">JLN TEMPLER</text>
                <text x="445" y="40" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#94A3B8" letterSpacing="0.1em">JLN PJS 1/46</text>

                {/* Workshop block */}
                <rect x="330" y="170" width="80" height="50" fill="#3B82F6" opacity="0.18" stroke="#3B82F6" strokeWidth="1" />
                <rect x="340" y="180" width="60" height="30" fill="#3B82F6" opacity="0.4" />

                {/* Pin */}
                <circle cx="370" cy="195" r="8" fill="#60A5FA" />
                <circle cx="370" cy="195" r="14" fill="none" stroke="#60A5FA" strokeWidth="1" opacity="0.5" />
                <circle cx="370" cy="195" r="22" fill="none" stroke="#60A5FA" strokeWidth="0.5" opacity="0.3" />

                {/* Pin connector */}
                <line x1="370" y1="195" x2="370" y2="120" stroke="#60A5FA" strokeWidth="0.6" strokeDasharray="3 2" />
                <text x="380" y="118" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#FAFAF7" letterSpacing="0.1em">
                  {c.locationMapWorkshop}
                </text>
                <text x="380" y="132" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#94A3B8" letterSpacing="0.1em">
                  {c.locationMapSince}
                </text>

                {/* Coordinates — placeholder until Alan supplies real coords. */}
                <text x="20" y="430" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#475569" letterSpacing="0.1em">3.0840° N · 101.6336° E</text>
                <text x="580" y="430" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#475569" letterSpacing="0.1em" textAnchor="end">PETALING JAYA</text>
              </svg>
              <div className="absolute bottom-6 left-6 max-w-[220px] border border-accent/24 bg-navy/90 px-[18px] py-[14px] font-mono text-[11px] uppercase tracking-[0.12em] text-paper">
                <span className="mb-1 block text-accent-light">Coolman</span>
                {legalEntityAddress
                  ? legalEntityAddress.split('\n')[0]
                  : c.locationAddressFallback}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct lines — paper background, 4-column. */}
      <section className="bg-paper py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 lg:mb-14">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-dark">
              {c.directLinesEyebrow}
            </div>
            <h2 className="mt-4 max-w-[24ch] font-fraunces text-[28px] font-normal leading-[1.18] tracking-tight text-navy lg:text-[34px]">
              {c.directLinesHeadline}
            </h2>
            <p className="mt-4 max-w-[58ch] text-sm leading-[1.7] text-ink-muted lg:text-base">
              {c.directLinesLede}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-0 lg:px-8">
          <div className="grid grid-cols-1 gap-px border-y border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
            {directLines.map((line) => (
              <div key={line.email} className="bg-paper px-7 py-8">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                  {line.label}
                </div>
                <div className="mb-2.5 font-mono text-[15px] leading-[1.4] text-navy">
                  <a
                    href={`mailto:${line.email}`}
                    className="text-accent-dark transition-colors duration-150 hover:text-accent-light"
                  >
                    {line.email}
                  </a>
                </div>
                <div className="text-xs leading-[1.5] text-ink-muted">{line.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Site visit form — channel 3 anchor target. Paper background. */}
      <section id="site-visit-form" className="bg-paper py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="mb-8 lg:mb-12">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-dark">
              {c.formEyebrow}
            </div>
            <h2 className="mt-4 max-w-[24ch] font-fraunces text-[28px] font-normal leading-[1.18] tracking-tight text-navy lg:text-[34px]">
              {c.formTitle}
            </h2>
            <p className="mt-4 max-w-[58ch] text-sm leading-[1.7] text-ink-muted lg:text-base">
              {c.formSubtitle}
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-white p-8 lg:p-10">
            {submitted ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 ring-4 ring-success/20">
                  <Check className="h-10 w-10 text-success" />
                </div>
                <h3 className="mt-6 font-fraunces text-2xl font-normal text-navy">
                  {c.successTitle}
                </h3>
                <p className="mt-3 text-ink-muted">{c.successMessage}</p>
                <Button variant="outline" className="mt-8" onClick={() => setSubmitted(false)}>
                  {c.sendAnother}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot — hidden from humans, visible to bots. Field name
                    `website` must stay in sync with /api/contact/submit. */}
                <div aria-hidden="true" className="absolute -left-[9999px]">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                {submitError && (
                  <div
                    role="alert"
                    className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
                  >
                    {submitError}
                  </div>
                )}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="group space-y-2">
                    <Label
                      htmlFor="name"
                      className={`text-sm transition-colors ${
                        focusedField === 'name' ? 'text-accent-dark' : 'text-ink-muted'
                      }`}
                    >
                      {c.formNameLabel}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder={c.formNamePlaceholder}
                      required
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                  <div className="group space-y-2">
                    <Label
                      htmlFor="company"
                      className={`text-sm transition-colors ${
                        focusedField === 'company' ? 'text-accent-dark' : 'text-ink-muted'
                      }`}
                    >
                      {c.formCompanyLabel}
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      placeholder={c.formCompanyPlaceholder}
                      onFocus={() => setFocusedField('company')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className={`text-sm transition-colors ${
                      focusedField === 'email' ? 'text-accent-dark' : 'text-ink-muted'
                    }`}
                  >
                    {c.formEmailLabel}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={c.formEmailPlaceholder}
                    required
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className={`text-sm transition-colors ${
                      focusedField === 'phone' ? 'text-accent-dark' : 'text-ink-muted'
                    }`}
                  >
                    {c.formPhoneLabel}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder={c.formPhonePlaceholder}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className={`text-sm transition-colors ${
                      focusedField === 'message' ? 'text-accent-dark' : 'text-ink-muted'
                    }`}
                  >
                    {c.formMessageLabel}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={c.formMessagePlaceholder}
                    rows={5}
                    required
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    className="resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="group h-12 w-full bg-accent-dark text-white hover:bg-accent"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      {c.formSubmitting}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {c.formSubmit}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
