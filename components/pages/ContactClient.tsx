'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Check, ArrowRight, Clock, MessageSquare } from 'lucide-react'
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

  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const heroTitle = data?.heroTitle ?? t.nav.contact
  const heroSubtitle = data?.heroSubtitle ?? 'Have questions about our products or need a custom quote? Our team is ready to help you find the perfect solution.'
  const phone = data?.phone ?? '+60 3-1234 5678'
  const email = data?.email ?? 'sales@coolman.com.my'
  const address = data?.address ?? 'No. 123, Jalan Industri 1, Kawasan Perindustrian Batu Caves, 68100 Selangor'
  const whatsappNumber = data?.whatsappNumber ?? ''

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
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSubmitError(data?.error || 'Something went wrong. Please try again.')
      } else {
        setSubmitted(true)
      }
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
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
            Get in touch
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
                  <h3 className="mt-6 text-2xl font-bold text-white">Message Sent!</h3>
                  <p className="mt-3 text-ink-muted">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-8 border-white/20 text-white hover:bg-white/10"
                    onClick={() => setSubmitted(false)}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white">Send us a message</h2>
                    <p className="mt-2 text-ink-muted">
                      Fill out the form below and we&apos;ll respond within 24 hours.
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
                          Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          required
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className="border-white/10 bg-white/5 text-white placeholder:text-ink-muted focus:border-accent focus:ring-accent/20"
                        />
                      </div>
                      <div className="group space-y-2">
                        <Label htmlFor="company" className={`text-sm transition-colors ${focusedField === 'company' ? 'text-accent-light' : 'text-ink-muted'}`}>
                          Company
                        </Label>
                        <Input
                          id="company"
                          name="company"
                          placeholder="Company name"
                          onFocus={() => setFocusedField('company')}
                          onBlur={() => setFocusedField(null)}
                          className="border-white/10 bg-white/5 text-white placeholder:text-ink-muted focus:border-accent focus:ring-accent/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className={`text-sm transition-colors ${focusedField === 'email' ? 'text-accent-light' : 'text-ink-muted'}`}>
                        Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@company.com"
                        required
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className="border-white/10 bg-white/5 text-white placeholder:text-ink-muted focus:border-accent focus:ring-accent/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className={`text-sm transition-colors ${focusedField === 'phone' ? 'text-accent-light' : 'text-ink-muted'}`}>
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+60 12-345 6789"
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        className="border-white/10 bg-white/5 text-white placeholder:text-ink-muted focus:border-accent focus:ring-accent/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className={`text-sm transition-colors ${focusedField === 'message' ? 'text-accent-light' : 'text-ink-muted'}`}>
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us about your requirements..."
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
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Send Message
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
              {/* Info Cards */}
              {[
                {
                  icon: Phone,
                  title: 'Phone',
                  content: phone,
                  subtitle: 'Mon-Fri 9am-6pm MYT',
                  color: 'blue'
                },
                {
                  icon: Mail,
                  title: 'Email',
                  content: email,
                  subtitle: 'We reply within 24 hours',
                  color: 'emerald'
                },
                {
                  icon: MapPin,
                  title: 'Office',
                  content: address.split(',')[0] ?? address,
                  subtitle: address.split(',').slice(1).join(',').trim() || undefined,
                  color: 'amber'
                }
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
                  <span className="text-sm font-medium text-accent-light">Average Response Time</span>
                </div>
                <p className="mt-2 text-3xl font-bold text-white">{"< 4 hours"}</p>
                <p className="mt-1 text-sm text-ink-muted">During business hours</p>
              </div>

              {/* Live Chat Card */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-ink-muted" />
                  <span className="text-sm font-medium text-white">Prefer live chat?</span>
                </div>
                <p className="mt-2 text-sm text-ink-muted">
                  Chat with our support team in real-time via WhatsApp.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 w-full border-white/20 text-white hover:bg-white/10"
                  asChild
                >
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    Open WhatsApp
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
