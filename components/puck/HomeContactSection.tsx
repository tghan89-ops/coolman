'use client'

/**
 * Contact section for the locked-layout Puck home — a faithful extract of the
 * live home's contact block (components/home/HomePageClient.tsx lines 434–573).
 * The real form posts to /api/contact/submit exactly like the live home. The
 * WhatsApp number is injected (via Puck `metadata.settings`) with the same
 * fallback as the live home. Heading/eyebrow + the contact detail values are
 * editable props; field labels/placeholders carry the live defaults.
 */
import { useState } from 'react'

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

export type ContactCopy = {
  eyebrow: string
  heading: string
  labels: { fullName: string; company: string; phone: string; email: string; interest: string; job: string }
  placeholders: { fullName: string; company: string; phone: string; email: string; job: string }
  interestOptions: string[]
  submit: string
  sending: string
  success: string
  error: string
  requiredError: string
  whatsappCta: string
  workshopLabel: string
  workshopValue: string
  emailLabel: string
  emailValue: string
  hoursLabel: string
  hoursValue: string
}

export function HomeContactSection({ whatsappNumber, c }: { whatsappNumber: string; c: ContactCopy }) {
  const whatsappDigits = (whatsappNumber || '').replace(/\D/g, '')
  const whatsappHref = whatsappDigits.length >= 8 ? `https://wa.me/${whatsappDigits}` : '#'

  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', interest: c.interestOptions[0], job: '', website: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const setField = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.job.trim()) {
      setStatus('error')
      setErrorMsg(c.requiredError)
      return
    }
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, company: form.company, phone: form.phone, website: form.website, message: `Interested in: ${form.interest}\n\n${form.job}` }),
      })
      if (!res.ok) throw new Error('submit failed')
      setStatus('ok')
    } catch {
      setStatus('error')
      setErrorMsg(c.error)
    }
  }

  const inputClass = 'font-sans text-sm text-navy bg-[#F5F7FA] border border-[#E6E9EE] rounded-sm px-3.5 py-3 outline-none transition-colors duration-150 ease-out focus:border-accent focus:bg-white placeholder:text-ink-faint'
  const fieldLabelClass = 'font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint'

  return (
    <section id="contact" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <div className="mb-3.5 flex items-center gap-3">
          <span className="block h-0.5 w-[22px] bg-accent" />
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent">{c.eyebrow}</span>
        </div>
        <h2 className="mb-12 text-[clamp(30px,3.6vw,42px)] font-bold uppercase leading-[1.02] tracking-[-0.02em] text-navy">{c.heading}</h2>

        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          {status === 'ok' ? (
            <div className="flex flex-col items-start justify-center rounded-md border border-[#9bd3b0] bg-[#EAF6EE] p-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#0F6B38]">✓ {c.submit}</div>
              <p className="mt-3 text-[15px] leading-[1.6] text-[#0F6B38]">{c.success}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
              <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={form.website} onChange={(e) => setField('website', e.target.value)} />
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className={fieldLabelClass}>{c.labels.fullName}</span>
                  <input className={inputClass} placeholder={c.placeholders.fullName} value={form.name} onChange={(e) => setField('name', e.target.value)} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className={fieldLabelClass}>{c.labels.company}</span>
                  <input className={inputClass} placeholder={c.placeholders.company} value={form.company} onChange={(e) => setField('company', e.target.value)} />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className={fieldLabelClass}>{c.labels.phone}</span>
                  <input type="tel" className={inputClass} placeholder={c.placeholders.phone} value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className={fieldLabelClass}>{c.labels.email}</span>
                  <input type="email" className={inputClass} placeholder={c.placeholders.email} value={form.email} onChange={(e) => setField('email', e.target.value)} />
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className={fieldLabelClass}>{c.labels.interest}</span>
                <select className={`${inputClass} cursor-pointer`} value={form.interest} onChange={(e) => setField('interest', e.target.value)}>
                  {c.interestOptions.map((opt) => (<option key={opt}>{opt}</option>))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={fieldLabelClass}>{c.labels.job}</span>
                <textarea className={`${inputClass} min-h-[104px] resize-y`} placeholder={c.placeholders.job} value={form.job} onChange={(e) => setField('job', e.target.value)} />
              </label>
              {status === 'error' && errorMsg && <p className="text-[13px] text-danger">{errorMsg}</p>}
              <button type="submit" disabled={status === 'sending'} className="rounded-[5px] bg-accent px-6 py-4 font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-opacity duration-150 ease-out hover:opacity-90 disabled:opacity-60">
                {status === 'sending' ? c.sending : `${c.submit} →`}
              </button>
            </form>
          )}

          <div className="flex flex-col gap-3.5">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mb-2 flex items-center justify-center gap-2.5 rounded-[5px] px-6 py-4 font-mono text-[13px] font-semibold uppercase tracking-[0.06em] text-white transition-colors duration-150 ease-out" style={{ backgroundColor: WA_GREEN }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = WA_GREEN_HOVER)} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = WA_GREEN)}>
              <WhatsAppGlyph />
              {c.whatsappCta}
            </a>
            <div className="border-t border-[#E6E9EE] py-5">
              <div className={fieldLabelClass}>{c.workshopLabel}</div>
              <div className="mt-1 text-[15px] text-[#1c2533]">{c.workshopValue}</div>
            </div>
            <div className="border-t border-[#E6E9EE] py-5">
              <div className={fieldLabelClass}>{c.emailLabel}</div>
              <div className="mt-1 text-[15px] text-[#1c2533]">{c.emailValue}</div>
            </div>
            <div className="border-t border-[#E6E9EE] py-5">
              <div className={fieldLabelClass}>{c.hoursLabel}</div>
              <div className="mt-1 text-[15px] text-[#1c2533]">{c.hoursValue}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
