'use client'

import { useLanguage } from '@/lib/i18n/context'
import { useSettings } from '@/lib/settings/context'
import { PublicLayout } from '@/components/layout/public-layout'
import { CAREER } from '@/lib/i18n/career'

export function CareerClient() {
  const { language } = useLanguage()
  const c = CAREER[language]
  const { whatsapp_number, contact_email_careers } = useSettings()

  const whatsappDigits = (whatsapp_number || '').replace(/\D/g, '')
  const whatsappHref =
    whatsappDigits.length >= 8 ? `https://wa.me/${whatsappDigits}` : '#'
  const careersEmail = contact_email_careers || 'careers@coolman.com.my'

  return (
    <PublicLayout headerVariant="default">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1280px] px-6 pt-16 pb-4 lg:px-12 lg:pt-24">
          <div className="mb-6 flex items-center gap-3">
            <span className="block h-0.5 w-7 bg-accent" />
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
              {c.eyebrow}
            </span>
          </div>
          <h1 className="max-w-[16ch] text-[clamp(40px,6vw,68px)] font-bold uppercase leading-[0.98] tracking-[-0.025em] text-navy">
            {c.heading}
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg leading-[1.55] text-ink-muted">
            {c.lede}
          </p>
        </div>
      </section>

      {/* ── ROLE AREAS ────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <h2 className="mb-10 text-[clamp(26px,3vw,36px)] font-bold uppercase leading-[1.04] tracking-[-0.02em] text-navy">
            {c.rolesHeading}
          </h2>
          <div className="grid gap-7 md:grid-cols-3">
            {c.roles.map((role) => (
              <div key={role.num} className="border-t-[3px] border-accent pt-6">
                <div className="font-mono text-[13px] font-semibold tracking-[0.1em] text-accent">
                  {role.num}
                </div>
                <h3 className="mb-2.5 mt-3.5 text-[22px] font-semibold tracking-[-0.01em] text-navy">
                  {role.title}
                </h3>
                <p className="text-[15px] leading-[1.65] text-ink-muted">{role.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLY (navy band) ─────────────────────────────────────────────── */}
      <section className="bg-navy py-16 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <h2 className="text-[clamp(26px,3vw,36px)] font-bold uppercase leading-[1.04] tracking-[-0.02em] text-white">
            {c.applyHeading}
          </h2>
          <p className="mt-4 max-w-[52ch] text-[16px] leading-[1.6] text-ink-faint">
            {c.applyBody}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={`mailto:${careersEmail}`}
              className="inline-flex items-center gap-2.5 rounded-[5px] bg-accent px-6 py-4 font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-opacity duration-150 ease-out hover:opacity-90"
            >
              {c.emailCta} →
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-[5px] border border-white/25 px-6 py-4 font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors duration-150 ease-out hover:border-white"
            >
              {c.whatsappCta}
            </a>
          </div>
          <p className="mt-6 font-mono text-[12px] text-ink-faint">{careersEmail}</p>
        </div>
      </section>
    </PublicLayout>
  )
}
