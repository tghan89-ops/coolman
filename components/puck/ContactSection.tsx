'use client'

/**
 * Client-side interactive layer for the locked Puck ContactPage block.
 *
 * Reproduces the exact form from components/pages/ContactClient.tsx
 * (site-visit form section) — same 5 fields (name, company, email, phone,
 * message), same honeypot, same POST to /api/contact/submit. Stateful copy
 * strings (labels, placeholders, success/error text) are injected as props so
 * the block render (server-safe) can pass editable field values through.
 *
 * This component intentionally avoids useSettings() and useLanguage() —
 * contact values come from the block's editable fields or puck.metadata.settings
 * so the Puck editor + <Render> path work without the app's providers.
 */

import { useState } from 'react'

// ─── Copy prop shapes ─────────────────────────────────────────────────────────

export type ContactFormCopy = {
  formEyebrow: string
  formTitle: string
  formSubtitle: string
  formNameLabel: string
  formNamePlaceholder: string
  formCompanyLabel: string
  formCompanyPlaceholder: string
  formEmailLabel: string
  formEmailPlaceholder: string
  formPhoneLabel: string
  formPhonePlaceholder: string
  formMessageLabel: string
  formMessagePlaceholder: string
  formSubmit: string
  formSubmitting: string
  formError: string
  networkError: string
  successTitle: string
  successMessage: string
  sendAnother: string
}

export type ContactInfoCopy = {
  whatsappPrefillText: string
  channel1Badge: string
  channel1Title: string
  channel1Body: string
  channel1NumberLabel: string
  channel1HoursLabel: string
  channel1ResponseLabel: string
  channel1LanguagesLabel: string
  channel1Hours: string
  channel1Response: string
  channel1Languages: string
  channel1Cta: string
  channel2Badge: string
  channel2Title: string
  channel2Body: string
  channel2NumberLabel: string
  channel2HoursLabel: string
  channel2ResponseLabel: string
  channel2Hours: string
  channel2Response: string
  channel2Cta: string
  channel3Badge: string
  channel3Title: string
  channel3Body: string
  channel3FormatLabel: string
  channel3ResponseLabel: string
  channel3OutputLabel: string
  channel3Format: string
  channel3Response: string
  channel3Output: string
  channel3Cta: string
}

export type DirectLine = {
  label: string
  email: string
  note: string
}

// ─── Channels section (3-card grid) ──────────────────────────────────────────

export function ContactChannelsSection({
  c,
  whatsappNumber,
  officePhone,
}: {
  c: ContactInfoCopy
  whatsappNumber: string
  officePhone: string
}) {
  const whatsappDigits = (whatsappNumber || '').replace(/\D/g, '')
  const whatsappHref =
    whatsappDigits.length >= 8
      ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(c.whatsappPrefillText)}`
      : '#'

  const officePhoneDisplay = officePhone || whatsappNumber
  const officePhoneTel = officePhoneDisplay
    ? `tel:+${officePhoneDisplay.replace(/\D/g, '')}`
    : null

  const monoLabel =
    'pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint'

  return (
    <div className="mx-auto max-w-7xl px-0 lg:px-8">
      <div className="grid grid-cols-1 gap-px border-y border-rule bg-rule lg:grid-cols-3">
        {/* Channel 01 — WhatsApp */}
        <article className="flex flex-col bg-paper p-8 transition-colors duration-150 hover:bg-white lg:p-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {c.channel1Badge}
          </div>
          <h3 className="mt-6 max-w-[20ch] font-fraunces text-[24px] font-normal leading-[1.18] tracking-tight text-navy lg:text-[26px]">
            {c.channel1Title}
          </h3>
          <p className="mt-4 text-sm leading-[1.7] text-ink-muted">{c.channel1Body}</p>
          <dl className="mt-6 border-t border-rule pt-4">
            <div className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[13px]">
              <dt className={monoLabel}>{c.channel1NumberLabel}</dt>
              <dd className="font-mono text-navy">{whatsappNumber}</dd>
            </div>
            <div className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[13px]">
              <dt className={monoLabel}>{c.channel1HoursLabel}</dt>
              <dd className="text-navy">{c.channel1Hours}</dd>
            </div>
            <div className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[13px]">
              <dt className={monoLabel}>{c.channel1ResponseLabel}</dt>
              <dd className="text-navy">{c.channel1Response}</dd>
            </div>
            <div className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[13px]">
              <dt className={monoLabel}>{c.channel1LanguagesLabel}</dt>
              <dd className="text-navy">{c.channel1Languages}</dd>
            </div>
          </dl>
          <div className="mt-auto pt-6">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-accent px-6 font-mono text-[13px] font-semibold uppercase tracking-[0.06em] text-white transition-opacity duration-150 hover:opacity-90"
            >
              {c.channel1Cta}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </article>

        {/* Channel 02 — Office line */}
        <article className="flex flex-col bg-paper p-8 transition-colors duration-150 hover:bg-white lg:p-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {c.channel2Badge}
          </div>
          <h3 className="mt-6 max-w-[20ch] font-fraunces text-[24px] font-normal leading-[1.18] tracking-tight text-navy lg:text-[26px]">
            {c.channel2Title}
          </h3>
          <p className="mt-4 text-sm leading-[1.7] text-ink-muted">{c.channel2Body}</p>
          <dl className="mt-6 border-t border-rule pt-4">
            <div className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[13px]">
              <dt className={monoLabel}>{c.channel2NumberLabel}</dt>
              <dd className="font-mono text-navy">{officePhoneDisplay}</dd>
            </div>
            <div className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[13px]">
              <dt className={monoLabel}>{c.channel2HoursLabel}</dt>
              <dd className="text-navy">{c.channel2Hours}</dd>
            </div>
            <div className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[13px]">
              <dt className={monoLabel}>{c.channel2ResponseLabel}</dt>
              <dd className="text-navy">{c.channel2Response}</dd>
            </div>
          </dl>
          <div className="mt-auto pt-6">
            <a
              href={officePhoneTel ?? '#'}
              aria-disabled={!officePhoneTel}
              className="inline-flex h-12 items-center gap-2 rounded-md border border-navy px-6 font-mono text-[13px] font-semibold uppercase tracking-[0.06em] text-navy transition-colors duration-150 hover:bg-navy hover:text-white"
            >
              {c.channel2Cta}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </article>

        {/* Channel 03 — Site visit */}
        <article className="flex flex-col bg-paper p-8 transition-colors duration-150 hover:bg-white lg:p-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {c.channel3Badge}
          </div>
          <h3 className="mt-6 max-w-[20ch] font-fraunces text-[24px] font-normal leading-[1.18] tracking-tight text-navy lg:text-[26px]">
            {c.channel3Title}
          </h3>
          <p className="mt-4 text-sm leading-[1.7] text-ink-muted">{c.channel3Body}</p>
          <dl className="mt-6 border-t border-rule pt-4">
            <div className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[13px]">
              <dt className={monoLabel}>{c.channel3FormatLabel}</dt>
              <dd className="text-navy">{c.channel3Format}</dd>
            </div>
            <div className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[13px]">
              <dt className={monoLabel}>{c.channel3ResponseLabel}</dt>
              <dd className="text-navy">{c.channel3Response}</dd>
            </div>
            <div className="grid grid-cols-[96px_1fr] gap-3 py-2 text-[13px]">
              <dt className={monoLabel}>{c.channel3OutputLabel}</dt>
              <dd className="text-navy">{c.channel3Output}</dd>
            </div>
          </dl>
          <div className="mt-auto pt-6">
            <a
              href="#site-visit-form"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-navy px-6 font-mono text-[13px] font-semibold uppercase tracking-[0.06em] text-navy transition-colors duration-150 hover:bg-navy hover:text-white"
            >
              {c.channel3Cta}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </article>
      </div>
    </div>
  )
}

// ─── Site visit form ──────────────────────────────────────────────────────────

export function ContactFormSection({ c }: { c: ContactFormCopy }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const inputClass =
    'w-full rounded-md border border-rule bg-white px-3.5 py-2.5 text-sm text-navy outline-none transition-colors duration-150 focus:border-accent focus:ring-1 focus:ring-accent placeholder:text-ink-faint'

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

  return (
    <section id="site-visit-form" className="bg-paper py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mb-8 lg:mb-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-success"
                  aria-hidden
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 className="mt-6 font-fraunces text-2xl font-normal text-navy">
                {c.successTitle}
              </h3>
              <p className="mt-3 text-ink-muted">{c.successMessage}</p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-8 inline-flex h-10 items-center rounded-md border border-rule px-5 text-sm text-navy transition-colors duration-150 hover:bg-navy hover:text-white"
              >
                {c.sendAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot — hidden from humans, visible to bots. Field name
                  `website` must stay in sync with /api/contact/submit. */}
              <div aria-hidden="true" className="absolute -left-[9999px]">
                <label htmlFor="puck-contact-website">Website</label>
                <input
                  id="puck-contact-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
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
                <div className="space-y-2">
                  <label
                    htmlFor="puck-contact-name"
                    className="text-sm text-ink-muted"
                  >
                    {c.formNameLabel}
                  </label>
                  <input
                    id="puck-contact-name"
                    name="name"
                    className={inputClass}
                    placeholder={c.formNamePlaceholder}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="puck-contact-company"
                    className="text-sm text-ink-muted"
                  >
                    {c.formCompanyLabel}
                  </label>
                  <input
                    id="puck-contact-company"
                    name="company"
                    className={inputClass}
                    placeholder={c.formCompanyPlaceholder}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="puck-contact-email"
                  className="text-sm text-ink-muted"
                >
                  {c.formEmailLabel}
                </label>
                <input
                  id="puck-contact-email"
                  name="email"
                  type="email"
                  className={inputClass}
                  placeholder={c.formEmailPlaceholder}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="puck-contact-phone"
                  className="text-sm text-ink-muted"
                >
                  {c.formPhoneLabel}
                </label>
                <input
                  id="puck-contact-phone"
                  name="phone"
                  type="tel"
                  className={inputClass}
                  placeholder={c.formPhonePlaceholder}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="puck-contact-message"
                  className="text-sm text-ink-muted"
                >
                  {c.formMessageLabel}
                </label>
                <textarea
                  id="puck-contact-message"
                  name="message"
                  className={`${inputClass} min-h-[120px] resize-none`}
                  placeholder={c.formMessagePlaceholder}
                  rows={5}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-accent font-mono text-[13px] font-semibold uppercase tracking-[0.06em] text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {c.formSubmitting}
                  </>
                ) : (
                  <>
                    {c.formSubmit}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
