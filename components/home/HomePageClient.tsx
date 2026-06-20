'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { useLanguage } from '@/lib/i18n/context'
import { PublicLayout } from '@/components/layout/public-layout'
import { resolveHomeLanding, type RawHomePage } from '@/lib/i18n/home-landing'
import type { Setting } from '@/payload-types'
import type { SlimProduct } from '@/lib/payload'

interface HomePageClientProps {
  settings: Partial<Setting>
  products: SlimProduct[]
  initialData?: RawHomePage | null
}

const ALL = '__all__'

// WhatsApp brand green — intentionally NOT the desaturated --success token.
// This is the platform's own mark colour, used only on WhatsApp affordances.
const WA_GREEN = '#22A45D'
const WA_GREEN_HOVER = '#1c8c4f'

function WhatsAppGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.139.561 4.14 1.543 5.873L.057 23.998l6.304-1.654A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.644-.52-5.148-1.422l-.369-.218-3.822 1.002.883-3.667-.237-.378A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  )
}

// Abstract concentric-ring mark for catalogue cards with no product image —
// keeps the grid visually even without faking a photo.
function ProductGlyph() {
  return (
    <svg width="120" height="120" viewBox="0 0 130 130" fill="none" aria-hidden>
      <circle cx="65" cy="65" r="48" stroke="#2d3a50" strokeWidth="2" />
      <circle cx="65" cy="65" r="34" stroke="#3B82F6" strokeWidth="2" />
      <circle cx="65" cy="65" r="14" stroke="#2d3a50" strokeWidth="2" />
      <circle cx="65" cy="65" r="5" fill="#3B82F6" />
    </svg>
  )
}

export function HomePageClient({ settings, products, initialData }: HomePageClientProps) {
  const { language } = useLanguage()
  // Live-preview lets the Payload admin's preview pane update as the editor
  // types. On the public site this just returns initialData (the fetched
  // global). resolveHomeLanding overlays CMS values on the code defaults.
  const { data } = useLivePreview<RawHomePage>({
    initialData: (initialData ?? {}) as RawHomePage,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 1,
  })
  const c = resolveHomeLanding(data, language)

  const whatsappNumber = settings?.whatsapp_number || '+60126363156'
  const whatsappDigits = whatsappNumber.replace(/\D/g, '')
  const whatsappHref =
    whatsappDigits.length >= 8 ? `https://wa.me/${whatsappDigits}` : '#'

  // ── Products: real catalogue, tabs derived from distinct categories ───────
  const categories = useMemo(() => {
    const seen: string[] = []
    for (const p of products) {
      if (p.category && !seen.includes(p.category)) seen.push(p.category)
    }
    return seen.slice(0, 4)
  }, [products])

  const [activeTab, setActiveTab] = useState<string>(ALL)

  const visibleProducts = useMemo(() => {
    const pool =
      activeTab === ALL ? products : products.filter((p) => p.category === activeTab)
    return pool.slice(0, 9)
  }, [products, activeTab])

  const tabBtn = (key: string, label: string) => {
    const active = key === activeTab
    return (
      <button
        key={key}
        type="button"
        onClick={() => setActiveTab(key)}
        className={`font-mono text-xs font-semibold uppercase tracking-[0.06em] rounded px-4 py-2.5 transition-colors duration-150 ease-out ${
          active ? 'bg-accent text-white' : 'bg-transparent text-ink-muted hover:text-navy'
        }`}
      >
        {label}
      </button>
    )
  }

  // ── Contact form ──────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    interest: c.contact.interestOptions[0],
    job: '',
    website: '', // honeypot
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const setField = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.job.trim()) {
      setStatus('error')
      setErrorMsg(c.contact.requiredError)
      return
    }
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          phone: form.phone,
          website: form.website,
          message: `Interested in: ${form.interest}\n\n${form.job}`,
        }),
      })
      if (!res.ok) throw new Error('submit failed')
      setStatus('ok')
    } catch {
      setStatus('error')
      setErrorMsg(c.contact.error)
    }
  }

  const inputClass =
    'font-sans text-sm text-navy bg-[#F5F7FA] border border-[#E6E9EE] rounded-sm px-3.5 py-3 outline-none transition-colors duration-150 ease-out focus:border-accent focus:bg-white placeholder:text-ink-faint'
  const fieldLabelClass =
    'font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint'

  return (
    <PublicLayout headerVariant="default">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1280px] px-6 pt-14 lg:px-12 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="block h-0.5 w-7 bg-accent" />
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                  {c.hero.eyebrow}
                </span>
              </div>
              <h1 className="text-[clamp(40px,6vw,68px)] font-bold uppercase leading-[0.98] tracking-[-0.025em] text-navy">
                {c.hero.headlineLine1}
                <br />
                {c.hero.headlineLine2Prefix}
                <span className="text-accent">{c.hero.headlineEmphasis}</span>
              </h1>
              <p className="mt-6 max-w-[440px] text-lg leading-[1.55] text-ink-muted">
                {c.hero.lede}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2.5 rounded-[5px] bg-accent px-6 py-4 font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-opacity duration-150 ease-out hover:opacity-90"
                >
                  {c.hero.ctaPrimary} <span className="text-[15px]">→</span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2.5 rounded-[5px] border border-[#cbd0d8] bg-white px-6 py-4 font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-navy transition-colors duration-150 ease-out hover:border-navy"
                >
                  {c.hero.ctaSecondary}
                </Link>
              </div>
              {/* Verified-fact stat block */}
              <div className="mt-12 grid grid-cols-2 overflow-hidden rounded-lg border border-[#E6E9EE] sm:grid-cols-4">
                {c.hero.stats.map((s, i) => (
                  <div
                    key={s.label}
                    className={`px-5 py-5 ${i > 0 ? 'border-[#E6E9EE] sm:border-l' : ''} ${
                      i === 2 ? 'border-t sm:border-t-0' : ''
                    } ${i === 3 ? 'border-t border-l sm:border-t-0' : ''}`}
                  >
                    <div className="font-mono text-[28px] font-semibold text-navy">
                      {s.value}
                    </div>
                    <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-xl shadow-[0_18px_50px_rgba(10,22,40,0.18)] aspect-[4/5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-blade.jpg"
                  alt="Diamond blade cutting concrete"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -left-4 bottom-9 rounded-lg bg-navy px-5 py-4 shadow-[0_10px_30px_rgba(10,22,40,0.3)]">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent-light">
                  {c.hero.badgeTag}
                </div>
                <div className="mt-1 font-mono text-[15px] font-semibold text-white">
                  {c.hero.badgeValue}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────────────── */}
      <div className="mx-auto mt-16 max-w-[1280px] px-6 lg:px-12">
        <div className="flex flex-wrap border-y border-[#E6E9EE]">
          {c.trustBar.map((item, i) => (
            <div
              key={item}
              className={`flex min-w-[200px] flex-1 items-center gap-2.5 px-6 py-5 ${
                i < c.trustBar.length - 1 ? 'border-[#E6E9EE] md:border-r' : ''
              }`}
            >
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-accent" />
              <span className="text-[13px] font-semibold text-navy">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHY COOLMAN ───────────────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="mb-3.5 flex items-center gap-3">
            <span className="block h-0.5 w-[22px] bg-accent" />
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
              {c.why.eyebrow}
            </span>
          </div>
          <h2 className="mb-12 max-w-[20ch] text-[clamp(30px,3.6vw,42px)] font-bold uppercase leading-[1.02] tracking-[-0.02em] text-navy">
            {c.why.heading}
          </h2>
          <div className="grid gap-7 md:grid-cols-3">
            {c.why.cards.map((card) => (
              <div key={card.num} className="border-t-[3px] border-accent pt-6">
                <div className="font-mono text-[13px] font-semibold tracking-[0.1em] text-accent">
                  {card.num}
                </div>
                <h3 className="mb-2.5 mt-3.5 text-[22px] font-semibold tracking-[-0.01em] text-navy">
                  {card.title}
                </h3>
                <p className="text-[15px] leading-[1.65] text-ink-muted">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ──────────────────────────────────────────────────────── */}
      <section id="products" className="border-t border-[#E6E9EE] bg-[#F5F7FA] py-20 lg:py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="mb-3.5 flex items-center gap-3">
                <span className="block h-0.5 w-[22px] bg-accent" />
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                  {c.products.eyebrow}
                </span>
              </div>
              <h2 className="text-[clamp(30px,3.6vw,42px)] font-bold uppercase leading-[1.02] tracking-[-0.02em] text-navy">
                {c.products.heading}
              </h2>
            </div>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-1 rounded-md border border-[#E6E9EE] bg-white p-1">
                {tabBtn(ALL, c.products.tabAll)}
                {categories.map((cat) => tabBtn(cat, cat))}
              </div>
            )}
          </div>

          {visibleProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((p) => {
                const chips = [
                  p.diameter,
                  p.materials[0]?.name ?? p.bondType ?? null,
                ].filter(Boolean) as string[]
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="group overflow-hidden rounded-lg border border-[#E6E9EE] bg-white text-navy transition-[box-shadow,border-color] duration-150 ease-out hover:border-accent hover:shadow-[0_6px_18px_rgba(10,22,40,0.08)]"
                  >
                    <div className="flex aspect-[4/3] items-center justify-center bg-[#F4F4F0]">
                      {p.image?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image.url}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-navy">
                          <ProductGlyph />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      {p.category && (
                        <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent">
                          {p.category}
                        </div>
                      )}
                      <div className="mt-1.5 text-[21px] font-semibold tracking-[-0.01em] text-navy">
                        {p.name}
                      </div>
                      {chips.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {chips.map((chip) => (
                            <span
                              key={chip}
                              className="rounded-sm border border-[#E6E9EE] px-2.5 py-1 font-mono text-[11px] text-ink-muted"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-5 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-accent">
                        {c.products.enquire} →
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-[#E6E9EE] bg-white p-10 text-center">
              <h3 className="text-[22px] font-semibold text-navy">
                {c.products.emptyHeading}
              </h3>
              <p className="mx-auto mt-2 max-w-[44ch] text-[15px] leading-[1.6] text-ink-muted">
                {c.products.emptyBody}
              </p>
            </div>
          )}

          <div className="mt-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-accent transition-opacity duration-150 ease-out hover:opacity-80"
            >
              {c.products.viewAll} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SHIBUYA BAND ──────────────────────────────────────────────────── */}
      <section id="shibuya" className="overflow-hidden bg-navy py-20 lg:py-24">
        <div className="mx-auto grid max-w-[1280px] items-center gap-14 px-6 lg:grid-cols-2 lg:gap-16 lg:px-12">
          <div>
            <div className="mb-6 inline-flex items-center gap-2.5 rounded border border-white/15 bg-white/5 px-3.5 py-2">
              <span className="inline-flex h-3 w-[18px] items-center justify-center rounded-[1px] bg-white">
                <span className="h-[7px] w-[7px] rounded-full bg-[#bc002d]" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/80">
                {c.shibuya.badge}
              </span>
            </div>
            <h2 className="text-[clamp(32px,4vw,46px)] font-bold uppercase leading-[1.0] tracking-[-0.02em] text-white">
              {c.shibuya.headingLine1}
              <br />
              {c.shibuya.headingLine2}
            </h2>
            <p className="mb-7 mt-5 max-w-[440px] text-[16px] leading-[1.65] text-ink-faint">
              {c.shibuya.lede}
            </p>
            <div className="mb-9 flex flex-col gap-3">
              {c.shibuya.bullets.map((b) => (
                <div key={b} className="flex items-center gap-2.5 text-[15px] text-white/80">
                  <span className="h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                  {b}
                </div>
              ))}
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 rounded-[5px] bg-accent px-6 py-4 font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-opacity duration-150 ease-out hover:opacity-90"
            >
              {c.shibuya.cta} →
            </Link>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-white/10 bg-white/10">
              {c.shibuya.stats.map((s) => (
                <div key={s.label} className="bg-[#0E1A30] p-7">
                  <div className="font-mono text-[36px] font-semibold text-white">
                    {s.value}
                  </div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {c.shibuya.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm border border-white/15 px-3 py-1.5 font-mono text-[11px] text-ink-faint"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────────────── */}
      <section id="contact" className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="mb-3.5 flex items-center gap-3">
            <span className="block h-0.5 w-[22px] bg-accent" />
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
              {c.contact.eyebrow}
            </span>
          </div>
          <h2 className="mb-12 text-[clamp(30px,3.6vw,42px)] font-bold uppercase leading-[1.02] tracking-[-0.02em] text-navy">
            {c.contact.heading}
          </h2>

          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
            {status === 'ok' ? (
              <div className="flex flex-col items-start justify-center rounded-md border border-[#9bd3b0] bg-[#EAF6EE] p-8">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#0F6B38]">
                  ✓ {c.contact.submit}
                </div>
                <p className="mt-3 text-[15px] leading-[1.6] text-[#0F6B38]">
                  {c.contact.success}
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
                {/* Honeypot — hidden from humans, catches bots. */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  className="hidden"
                  value={form.website}
                  onChange={(e) => setField('website', e.target.value)}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className={fieldLabelClass}>{c.contact.labels.fullName}</span>
                    <input
                      className={inputClass}
                      placeholder={c.contact.placeholders.fullName}
                      value={form.name}
                      onChange={(e) => setField('name', e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className={fieldLabelClass}>{c.contact.labels.company}</span>
                    <input
                      className={inputClass}
                      placeholder={c.contact.placeholders.company}
                      value={form.company}
                      onChange={(e) => setField('company', e.target.value)}
                    />
                  </label>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className={fieldLabelClass}>{c.contact.labels.phone}</span>
                    <input
                      type="tel"
                      className={inputClass}
                      placeholder={c.contact.placeholders.phone}
                      value={form.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className={fieldLabelClass}>{c.contact.labels.email}</span>
                    <input
                      type="email"
                      className={inputClass}
                      placeholder={c.contact.placeholders.email}
                      value={form.email}
                      onChange={(e) => setField('email', e.target.value)}
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className={fieldLabelClass}>{c.contact.labels.interest}</span>
                  <select
                    className={`${inputClass} cursor-pointer`}
                    value={form.interest}
                    onChange={(e) => setField('interest', e.target.value)}
                  >
                    {c.contact.interestOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className={fieldLabelClass}>{c.contact.labels.job}</span>
                  <textarea
                    className={`${inputClass} min-h-[104px] resize-y`}
                    placeholder={c.contact.placeholders.job}
                    value={form.job}
                    onChange={(e) => setField('job', e.target.value)}
                  />
                </label>
                {status === 'error' && errorMsg && (
                  <p className="text-[13px] text-danger">{errorMsg}</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="rounded-[5px] bg-accent px-6 py-4 font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-opacity duration-150 ease-out hover:opacity-90 disabled:opacity-60"
                >
                  {status === 'sending' ? c.contact.sending : `${c.contact.submit} →`}
                </button>
              </form>
            )}

            <div className="flex flex-col gap-3.5">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-2 flex items-center justify-center gap-2.5 rounded-[5px] px-6 py-4 font-mono text-[13px] font-semibold uppercase tracking-[0.06em] text-white transition-colors duration-150 ease-out"
                style={{ backgroundColor: WA_GREEN }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = WA_GREEN_HOVER)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = WA_GREEN)}
              >
                <WhatsAppGlyph />
                {c.contact.whatsappCta}
              </a>
              <div className="border-t border-[#E6E9EE] py-5">
                <div className={fieldLabelClass}>{c.contact.workshopLabel}</div>
                <div className="mt-1 text-[15px] text-[#1c2533]">{c.contact.workshopValue}</div>
              </div>
              <div className="border-t border-[#E6E9EE] py-5">
                <div className={fieldLabelClass}>{c.contact.emailLabel}</div>
                <div className="mt-1 text-[15px] text-[#1c2533]">{c.contact.emailValue}</div>
              </div>
              <div className="border-t border-[#E6E9EE] py-5">
                <div className={fieldLabelClass}>{c.contact.hoursLabel}</div>
                <div className="mt-1 text-[15px] text-[#1c2533]">{c.contact.hoursValue}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FLOATING WHATSAPP ─────────────────────────────────────────────── */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Coolman"
        className="fixed bottom-7 right-7 z-[200] flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_6px_20px_rgba(34,164,93,0.4)] transition-transform duration-150 ease-out hover:scale-105"
        style={{ backgroundColor: WA_GREEN }}
      >
        <WhatsAppGlyph size={28} />
      </a>
    </PublicLayout>
  )
}
