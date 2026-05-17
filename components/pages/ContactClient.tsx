'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Check, ArrowRight, Clock, MessageSquare } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/lib/i18n/context'
import { useLivePreview } from '@payloadcms/live-preview-react'

export function ContactClient({ initialData }: { initialData: any }) {
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const heroTitle = pick(data?.heroTitle, data?.heroTitleBM) || t.nav.contact
  const heroSubtitle = pick(data?.heroSubtitle, data?.heroSubtitleBM) || t.pages.contact.fallbackHeroSubtitle
  const phone = data?.phone ?? '+60 3-1234 5678'
  const email = data?.email ?? 'sales@coolman.com.my'
  const address = pick(data?.address, data?.addressBM) || 'No. 123, Jalan Industri 1, Kawasan Perindustrian Batu Caves, 68100 Selangor'
  const whatsappNumber = data?.whatsappNumber ?? ''
  const responseTime = data?.responseTime || '< 4 hours'

  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`
    : 'https://wa.me/60312345678'

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
        setSubmitError(respData?.error || t.pages.contact.formError)
      } else {
        setSubmitted(true)
      }
    } catch {
      setSubmitError(t.pages.contact.networkError)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-navy py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {t.pages.contact.heroEyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-[40px]">
            {heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-faint">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="bg-navy py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
            {/* Contact Form */}
            <div className="rounded-2xl border border-white/10 bg-navy-surface p-8 lg:p-10">
              {submitted ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 ring-4 ring-success/20">
                    <Check className="h-10 w-10 text-success" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-white">{t.pages.contact.successTitle}</h3>
                  <p className="mt-3 text-ink-muted">
                    {t.pages.contact.successMessage}
                  </p>
                  <Button
                    variant="outline-dark"
                    className="mt-8"
                    onClick={() => setSubmitted(false)}
                  >
                    {t.pages.contact.sendAnother}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white">{t.pages.contact.formTitle}</h2>
                    <p className="mt-2 text-ink-muted">
                      {t.pages.contact.formSubtitle}
                    </p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Honeypot — hidden from humans, visible to bots. */}
                    <div aria-hidden="true" className="absolute -left-[9999px]">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                    </div>
                    {submitError && (
                      <div role="alert" className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                        {submitError}
                      </div>
                    )}
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="group space-y-2">
                        <Label htmlFor="name" className={`text-sm transition-colors ${focusedField === 'name' ? 'text-accent-light' : 'text-ink-muted'}`}>
                          {t.pages.contact.formNameLabel}
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder={t.pages.contact.formNamePlaceholder}
                          required
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className="border-white/10 bg-white/5 text-white placeholder:text-ink-muted focus:border-accent focus:ring-accent/20"
                        />
                      </div>
                      <div className="group space-y-2">
                        <Label htmlFor="company" className={`text-sm transition-colors ${focusedField === 'company' ? 'text-accent-light' : 'text-ink-muted'}`}>
                          {t.pages.contact.formCompanyLabel}
                        </Label>
                        <Input
                          id="company"
                          name="company"
                          placeholder={t.pages.contact.formCompanyPlaceholder}
                          onFocus={() => setFocusedField('company')}
                          onBlur={() => setFocusedField(null)}
                          className="border-white/10 bg-white/5 text-white placeholder:text-ink-muted focus:border-accent focus:ring-accent/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className={`text-sm transition-colors ${focusedField === 'email' ? 'text-accent-light' : 'text-ink-muted'}`}>
                        {t.pages.contact.formEmailLabel}
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t.pages.contact.formEmailPlaceholder}
                        required
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className="border-white/10 bg-white/5 text-white placeholder:text-ink-muted focus:border-accent focus:ring-accent/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className={`text-sm transition-colors ${focusedField === 'phone' ? 'text-accent-light' : 'text-ink-muted'}`}>
                        {t.pages.contact.formPhoneLabel}
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder={t.pages.contact.formPhonePlaceholder}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        className="border-white/10 bg-white/5 text-white placeholder:text-ink-muted focus:border-accent focus:ring-accent/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className={`text-sm transition-colors ${focusedField === 'message' ? 'text-accent-light' : 'text-ink-muted'}`}>
                        {t.pages.contact.formMessageLabel}
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder={t.pages.contact.formMessagePlaceholder}
                        rows={5}
                        required
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        className="resize-none border-white/10 bg-white/5 text-white placeholder:text-ink-muted focus:border-accent focus:ring-accent/20"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="group w-full bg-accent-dark text-white hover:bg-accent"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          {t.pages.contact.formSubmitting}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          {t.pages.contact.formSubmit}
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {[
                {
                  icon: Phone,
                  title: t.pages.contact.phoneTitle,
                  content: phone,
                  subtitle: t.pages.contact.phoneSubtitle,
                  color: 'blue',
                },
                {
                  icon: Mail,
                  title: t.pages.contact.emailTitle,
                  content: email,
                  subtitle: t.pages.contact.emailSubtitle,
                  color: 'emerald',
                },
                {
                  icon: MapPin,
                  title: t.pages.contact.officeTitle,
                  content: address.split(',')[0] ?? address,
                  subtitle: address.split(',').slice(1).join(',').trim() || undefined,
                  color: 'amber',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      item.color === 'blue' ? 'bg-accent/10 text-accent-light' :
                      item.color === 'emerald' ? 'bg-success/10 text-success' :
                      'bg-warn/10 text-warn'
                    }`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-white">{item.content}</p>
                      {item.subtitle && (
                        <p className="mt-0.5 text-sm text-ink-muted">{item.subtitle}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Response Time Card */}
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-accent-light" />
                  <span className="text-sm font-medium text-accent-light">{t.pages.contact.responseTimeLabel}</span>
                </div>
                <p className="mt-2 text-3xl font-bold text-white">{responseTime}</p>
                <p className="mt-1 text-sm text-ink-muted">{t.pages.contact.responseTimeSubtitle}</p>
              </div>

              {/* Live Chat Card */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-ink-muted" />
                  <span className="text-sm font-medium text-white">{t.pages.contact.liveChatLabel}</span>
                </div>
                <p className="mt-2 text-sm text-ink-muted">
                  {t.pages.contact.liveChatMessage}
                </p>
                <Button
                  variant="outline-dark"
                  className="mt-4 w-full"
                  asChild
                >
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    {t.pages.contact.openWhatsapp}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
