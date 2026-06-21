'use client'

/**
 * Interactive sections for the locked-layout Puck Shibuya page — a faithful
 * extract of the live Shibuya page (components/pages/ShibuyaClient.tsx).
 *
 * Two interactive regions live here:
 *  1. ShibuyaLineupSection — the machine tab nav + spec table + features pane
 *     (useState for the active tab). The machine roster is editorial content
 *     passed in as a prop (editable array on the block), NOT the live catalogue.
 *  2. ShibuyaDemoSection   — the demo-request form (useState for form status).
 *     Posts to /api/demo-request exactly like the live page.
 *
 * NO PRICE is rendered anywhere — Shibuya machines are brand/editorial content,
 * not the priced catalogue. The block's render stays pure and feeds these
 * components their editable copy + arrays.
 */
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

// ── Shared editable shapes ────────────────────────────────────────────────────

export type SpecLabels = {
  maxDiameter: string
  anchor: string
  motorPower: string
  voltage: string
  feedSystem: string
  maxDepth: string
  holeRunout: string
  weight: string
  bitPairing: string
  rpmRange: string
}

export type LineupMachine = {
  modelId: string
  modelName: string
  tagline: string
  description: string
  maxDiameter: string
  anchor: string
  motorPower: string
  voltage: string
  feedSystem: string
  maxDepth: string
  holeRunout: string
  weight: string
  bitPairing: string
  rpmRange: string
  stockNote: string
  features: Array<{ feature: string }>
}

function MachinePlaceholder({ modelId }: { modelId: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-navy/20">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="6" y="12" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="26" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" />
      </svg>
      <span className="font-mono text-[11px] uppercase tracking-[0.12em]">{modelId}</span>
    </div>
  )
}

// ── 1. Machine lineup (tabs + spec table) ─────────────────────────────────────

export function ShibuyaLineupSection({
  eyebrow,
  headline,
  machines,
  specLabels,
  keyFeaturesLabel,
  demoLabel,
  downloadSpecSheetLabel,
}: {
  eyebrow: string
  headline: string
  machines: LineupMachine[]
  specLabels: SpecLabels
  keyFeaturesLabel: string
  demoLabel: string
  downloadSpecSheetLabel: string
}) {
  const defaultModelId = machines.length > 0 ? machines[0].modelId : null
  const [userSelectedModelId, setUserSelectedModelId] = useState<string | null>(null)
  const effectiveModelId =
    userSelectedModelId && machines.some((m) => m.modelId === userSelectedModelId)
      ? userSelectedModelId
      : defaultModelId

  const selectedMachine = useMemo(
    () => machines.find((m) => m.modelId === effectiveModelId) ?? null,
    [machines, effectiveModelId],
  )

  const specRows: Array<[string, string]> = selectedMachine
    ? ([
        [specLabels.maxDiameter, selectedMachine.maxDiameter],
        [specLabels.anchor, selectedMachine.anchor],
        [specLabels.motorPower, selectedMachine.motorPower],
        [specLabels.voltage, selectedMachine.voltage],
        [specLabels.feedSystem, selectedMachine.feedSystem],
        [specLabels.maxDepth, selectedMachine.maxDepth],
        [specLabels.holeRunout, selectedMachine.holeRunout],
        [specLabels.weight, selectedMachine.weight],
        [specLabels.bitPairing, selectedMachine.bitPairing],
        [specLabels.rpmRange, selectedMachine.rpmRange],
      ].filter(([, v]) => v && String(v).trim() !== '') as Array<[string, string]>)
    : []

  return (
    <section id="lineup" className="border-t border-rule bg-paper py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{eyebrow}</p>
        <h2 className="mt-4 font-fraunces text-[clamp(28px,3.2vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
          {headline}
        </h2>

        {machines.length > 0 && (
          <>
            {/* Border tab nav */}
            <div className="mt-10 flex flex-wrap border-b border-rule" role="tablist" aria-label={headline}>
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
                  <MachinePlaceholder modelId={selectedMachine.modelId} />
                </div>

                {/* Details */}
                <div>
                  {selectedMachine.tagline && (
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                      {selectedMachine.tagline}
                    </p>
                  )}
                  <h3 className="mt-2 font-fraunces text-[clamp(24px,2.4vw,32px)] font-normal text-navy">
                    {selectedMachine.modelName}
                  </h3>
                  {selectedMachine.description && (
                    <p className="mt-4 text-base leading-relaxed text-ink-muted">
                      {selectedMachine.description}
                    </p>
                  )}

                  {/* Spec table — row only rendered when field has a value */}
                  {specRows.length > 0 && (
                    <table className="mt-8 w-full border-collapse text-sm">
                      <tbody>
                        {specRows.map(([label, value], idx) => (
                          <tr key={idx} className="border-b border-rule">
                            <td className="w-[140px] py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.10em] text-ink-faint">
                              {label}
                            </td>
                            <td className="py-2 font-mono text-sm text-navy">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href="#demo"
                      className="inline-flex min-h-[44px] items-center gap-2 bg-navy px-6 py-2.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
                    >
                      {demoLabel}
                    </a>
                    <button
                      type="button"
                      className="inline-flex min-h-[44px] items-center gap-2 border border-rule px-6 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-navy hover:text-navy"
                    >
                      {downloadSpecSheetLabel}
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
                        {keyFeaturesLabel}
                      </p>
                      <ul className="mt-3 space-y-1.5">
                        {selectedMachine.features.map((f, idx) => (
                          <li
                            key={`${selectedMachine.modelId}-f-${idx}`}
                            className="flex items-start gap-2 text-sm text-ink-muted"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                            {f.feature}
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
  )
}

// ── 2. Demo request form ──────────────────────────────────────────────────────

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export type DemoFormLabels = {
  title: string
  name: string
  company: string
  phone: string
  model: string
  modelPlaceholder: string
  project: string
  notes: string
  submit: string
  successTitle: string
  successBody: string
  error: string
}

export function ShibuyaDemoSection({
  headline,
  body,
  machines,
  labels,
}: {
  headline: string
  body: string
  machines: Array<{ modelId: string; modelName: string }>
  labels: DemoFormLabels
}) {
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
        setFormError(json.error || labels.error)
        setFormState('error')
        return
      }
      setFormState('success')
    } catch {
      setFormError(labels.error)
      setFormState('error')
    }
  }

  return (
    <section id="demo" className="border-t border-rule bg-paper py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: text */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{labels.title}</p>
            <h2 className="mt-4 font-fraunces text-[clamp(28px,3.2vw,40px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
              {headline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">{body}</p>
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
                <h3 className="font-fraunces text-xl font-normal text-navy">{labels.successTitle}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{labels.successBody}</p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="demo-name"
                      className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted"
                    >
                      {labels.name} *
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
                      {labels.company}
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
                    {labels.phone} *
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
                    {labels.model} *
                  </label>
                  <select
                    id="demo-model"
                    name="model"
                    required
                    defaultValue=""
                    className="w-full border border-rule bg-white px-3 py-2.5 text-sm text-navy focus:border-navy focus:outline-none"
                  >
                    <option value="" disabled>
                      {labels.modelPlaceholder}
                    </option>
                    {machines.map((m) => (
                      <option key={m.modelId} value={m.modelId}>
                        {m.modelName}
                      </option>
                    ))}
                    {machines.length === 0 && <option value="general">General enquiry</option>}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="demo-project"
                    className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted"
                  >
                    {labels.project}
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
                    {labels.notes}
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
                  {formState === 'submitting' ? '…' : labels.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
