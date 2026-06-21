/**
 * Locked PAGE block — Contact page.
 *
 * Reproduces the exact markup of the live Contact page
 * (components/pages/ContactClient.tsx). All visible copy is in editable
 * fields; layout is locked (no drag / duplicate / delete). The interactive
 * form + channels section are extracted into a 'use client' component
 * (components/puck/ContactSection.tsx) so this render stays server-safe.
 *
 * Settings-derived values arrive via puck.metadata.settings:
 *   - whatsapp_number → passed to channels + form
 *
 * Contact emails (sales / parts / training / careers), office phone, and all
 * other dynamic values from useSettings() are editable block fields here
 * because the Puck editor + <Render> path run outside the app's
 * SettingsProvider context.
 *
 * The schematic SVG map uses hardcoded road labels (FEDERAL HIGHWAY, JLN PJS 1,
 * JLN TEMPLER, JLN PJS 1/46) — these are proper-noun decorative signage, not
 * translateable copy, per the Frontend-editability exception in LEARNINGS.md.
 */
import type { ComponentConfig } from '@puckeditor/core'
import {
  ContactChannelsSection,
  ContactFormSection,
  type ContactInfoCopy,
  type ContactFormCopy,
  type DirectLine,
} from '@/components/puck/ContactSection'

// ─── Local constants (mirrored from pages.tsx — never imported to avoid coupling) ─

const LOCKED = { drag: false, duplicate: false, delete: false } as const

type Settings = { whatsapp_number?: string }

const waHref = (n?: string) => {
  const d = (n || '').replace(/\D/g, '')
  return d.length >= 8 ? `https://wa.me/${d}` : '#'
}

// ─── Block ────────────────────────────────────────────────────────────────────

export const ContactPage: ComponentConfig = {
  label: 'Page · Contact',
  permissions: LOCKED,

  fields: {
    // ── Hero ──────────────────────────────────────────────────────────────────
    heroEyebrow: { type: 'text', label: 'Hero eyebrow', contentEditable: true },
    heroTitle: { type: 'text', label: 'Hero title', contentEditable: true },
    heroTitleEmphasis: { type: 'text', label: 'Hero title emphasis (italic)', contentEditable: true },
    heroLede: { type: 'textarea', label: 'Hero lede', contentEditable: true },

    // ── Channels section ──────────────────────────────────────────────────────
    channelsEyebrow: { type: 'text', label: 'Channels eyebrow', contentEditable: true },
    channelsHeadline: { type: 'text', label: 'Channels headline', contentEditable: true },
    channelsLede: { type: 'textarea', label: 'Channels lede', contentEditable: true },

    // Channel 01 — WhatsApp
    channel1Badge: { type: 'text', label: 'Ch.1 badge', contentEditable: true },
    channel1Title: { type: 'text', label: 'Ch.1 title', contentEditable: true },
    channel1Body: { type: 'textarea', label: 'Ch.1 body', contentEditable: true },
    channel1NumberLabel: { type: 'text', label: 'Ch.1 number label', contentEditable: true },
    channel1HoursLabel: { type: 'text', label: 'Ch.1 hours label', contentEditable: true },
    channel1ResponseLabel: { type: 'text', label: 'Ch.1 response label', contentEditable: true },
    channel1LanguagesLabel: { type: 'text', label: 'Ch.1 languages label', contentEditable: true },
    channel1Hours: { type: 'text', label: 'Ch.1 hours value', contentEditable: true },
    channel1Response: { type: 'text', label: 'Ch.1 response value', contentEditable: true },
    channel1Languages: { type: 'text', label: 'Ch.1 languages value', contentEditable: true },
    channel1Cta: { type: 'text', label: 'Ch.1 CTA label', contentEditable: true },
    whatsappPrefillText: { type: 'text', label: 'WhatsApp prefill message', contentEditable: true },

    // Channel 02 — Office line
    channel2Badge: { type: 'text', label: 'Ch.2 badge', contentEditable: true },
    channel2Title: { type: 'text', label: 'Ch.2 title', contentEditable: true },
    channel2Body: { type: 'textarea', label: 'Ch.2 body', contentEditable: true },
    channel2NumberLabel: { type: 'text', label: 'Ch.2 number label', contentEditable: true },
    channel2HoursLabel: { type: 'text', label: 'Ch.2 hours label', contentEditable: true },
    channel2ResponseLabel: { type: 'text', label: 'Ch.2 routes label', contentEditable: true },
    channel2Hours: { type: 'text', label: 'Ch.2 hours value', contentEditable: true },
    channel2Response: { type: 'text', label: 'Ch.2 routes value', contentEditable: true },
    channel2Cta: { type: 'text', label: 'Ch.2 CTA label', contentEditable: true },
    officePhone: { type: 'text', label: 'Office phone number', contentEditable: true },

    // Channel 03 — Site visit
    channel3Badge: { type: 'text', label: 'Ch.3 badge', contentEditable: true },
    channel3Title: { type: 'text', label: 'Ch.3 title', contentEditable: true },
    channel3Body: { type: 'textarea', label: 'Ch.3 body', contentEditable: true },
    channel3FormatLabel: { type: 'text', label: 'Ch.3 format label', contentEditable: true },
    channel3ResponseLabel: { type: 'text', label: 'Ch.3 reply label', contentEditable: true },
    channel3OutputLabel: { type: 'text', label: 'Ch.3 output label', contentEditable: true },
    channel3Format: { type: 'text', label: 'Ch.3 format value', contentEditable: true },
    channel3Response: { type: 'text', label: 'Ch.3 reply value', contentEditable: true },
    channel3Output: { type: 'text', label: 'Ch.3 output value', contentEditable: true },
    channel3Cta: { type: 'text', label: 'Ch.3 CTA label', contentEditable: true },

    // ── Location section ──────────────────────────────────────────────────────
    locationEyebrow: { type: 'text', label: 'Location eyebrow', contentEditable: true },
    locationHeadline: { type: 'text', label: 'Location headline', contentEditable: true },
    locationLede: { type: 'textarea', label: 'Location lede', contentEditable: true },
    legalEntityName: { type: 'text', label: 'Legal entity name', contentEditable: true },
    legalEntityAddress: { type: 'textarea', label: 'Address (one line per \\n)', contentEditable: true },
    legalEntityRegNo: { type: 'text', label: 'Reg. number (leave empty to hide)', contentEditable: true },
    locationRegPrefix: { type: 'text', label: 'Reg. prefix', contentEditable: true },
    locationAddressFallback: { type: 'text', label: 'Address fallback', contentEditable: true },
    locationAddressNote: { type: 'text', label: 'Address note', contentEditable: true },
    locationLabelMonFri: { type: 'text', label: 'Hours Mon–Fri label', contentEditable: true },
    locationLabelSat: { type: 'text', label: 'Hours Saturday label', contentEditable: true },
    locationLabelSun: { type: 'text', label: 'Hours Sunday label', contentEditable: true },
    openingMonFri: { type: 'text', label: 'Hours Mon–Fri value', contentEditable: true },
    openingSat: { type: 'text', label: 'Hours Saturday value', contentEditable: true },
    openingSun: { type: 'text', label: 'Hours Sunday value', contentEditable: true },
    locationDispatchLabel: { type: 'text', label: 'Dispatch label', contentEditable: true },
    locationDispatchSuffix: { type: 'text', label: 'Dispatch suffix', contentEditable: true },
    dispatchCutoff: { type: 'text', label: 'Dispatch cutoff time', contentEditable: true },
    locationOpenInMaps: { type: 'text', label: 'Open in maps label', contentEditable: true },
    locationMapWorkshop: { type: 'text', label: 'Map workshop name', contentEditable: true },
    locationMapSince: { type: 'text', label: 'Map since label', contentEditable: true },
    locationMapCoords: { type: 'text', label: 'Map coordinates', contentEditable: true },
    locationMapCity: { type: 'text', label: 'Map city label', contentEditable: true },
    locationOverlayBrand: { type: 'text', label: 'Map overlay brand name', contentEditable: true },

    // ── Direct lines section ──────────────────────────────────────────────────
    directLinesEyebrow: { type: 'text', label: 'Direct lines eyebrow', contentEditable: true },
    directLinesHeadline: { type: 'text', label: 'Direct lines headline', contentEditable: true },
    directLinesLede: { type: 'textarea', label: 'Direct lines lede', contentEditable: true },
    directLines: {
      type: 'array',
      label: 'Direct lines',
      arrayFields: {
        label: { type: 'text', label: 'Label', contentEditable: true },
        email: { type: 'text', label: 'Email address', contentEditable: true },
        note: { type: 'text', label: 'Note', contentEditable: true },
      },
      defaultItemProps: { label: 'Sales', email: 'sales@coolman.com.my', note: 'General enquiries.' },
    },

    // ── Site visit form copy ──────────────────────────────────────────────────
    formEyebrow: { type: 'text', label: 'Form eyebrow', contentEditable: true },
    formTitle: { type: 'text', label: 'Form title', contentEditable: true },
    formSubtitle: { type: 'textarea', label: 'Form subtitle', contentEditable: true },
    formNameLabel: { type: 'text', label: 'Form: name label', contentEditable: true },
    formNamePlaceholder: { type: 'text', label: 'Form: name placeholder', contentEditable: true },
    formCompanyLabel: { type: 'text', label: 'Form: company label', contentEditable: true },
    formCompanyPlaceholder: { type: 'text', label: 'Form: company placeholder', contentEditable: true },
    formEmailLabel: { type: 'text', label: 'Form: email label', contentEditable: true },
    formEmailPlaceholder: { type: 'text', label: 'Form: email placeholder', contentEditable: true },
    formPhoneLabel: { type: 'text', label: 'Form: phone label', contentEditable: true },
    formPhonePlaceholder: { type: 'text', label: 'Form: phone placeholder', contentEditable: true },
    formMessageLabel: { type: 'text', label: 'Form: message label', contentEditable: true },
    formMessagePlaceholder: { type: 'textarea', label: 'Form: message placeholder', contentEditable: true },
    formSubmit: { type: 'text', label: 'Form: submit button', contentEditable: true },
    formSubmitting: { type: 'text', label: 'Form: submitting label', contentEditable: true },
    formError: { type: 'text', label: 'Form: server error', contentEditable: true },
    networkError: { type: 'text', label: 'Form: network error', contentEditable: true },
    successTitle: { type: 'text', label: 'Form: success title', contentEditable: true },
    successMessage: { type: 'textarea', label: 'Form: success message', contentEditable: true },
    sendAnother: { type: 'text', label: 'Form: send another label', contentEditable: true },
  },

  defaultProps: {
    // Hero
    heroEyebrow: 'Contact · Engineering desk',
    heroTitle: 'Most cuts begin with',
    heroTitleEmphasis: 'a phone call.',
    heroLede: 'The fastest way to reach Coolman is the engineering desk on WhatsApp. For general enquiries, the office line works. For site visits, the form helps us prepare.',

    // Channels
    channelsEyebrow: 'Three channels · pick what fits',
    channelsHeadline: 'Each channel maps to a kind of conversation.',
    channelsLede: 'WhatsApp for fast technical answers and photos. The office line for general enquiries and trade accounts. The site visit form when you need an engineer on site.',

    channel1Badge: 'Channel 01 · WhatsApp',
    channel1Title: 'The engineering desk.',
    channel1Body: 'Send a photo of the job, the aggregate, the existing blade. Alan or the technical team replies the same working day. The fastest path from question to bond recommendation.',
    channel1NumberLabel: 'Number',
    channel1HoursLabel: 'Hours',
    channel1ResponseLabel: 'Response',
    channel1LanguagesLabel: 'Language',
    channel1Hours: 'Mon to Fri, 9:00am to 6:00pm · Saturday 9:00am to 1:00pm',
    channel1Response: 'Usually within an hour',
    channel1Languages: 'EN · BM',
    channel1Cta: 'Open WhatsApp',
    whatsappPrefillText: 'Hi, I have a question about your blades.',

    channel2Badge: 'Channel 02 · Office line',
    channel2Title: 'Call the office.',
    channel2Body: 'For general enquiries, account questions, and trade applications. Monday to Saturday, office hours. Picks up at the front desk and routes you to the right person.',
    channel2NumberLabel: 'Number',
    channel2HoursLabel: 'Hours',
    channel2ResponseLabel: 'Routes to',
    channel2Hours: 'Mon to Fri, 9:00am to 6:00pm · Saturday 9:00am to 1:00pm',
    channel2Response: 'Sales, accounts, or trade',
    channel2Cta: 'Call the office',
    officePhone: '',

    channel3Badge: 'Channel 03 · Site visit',
    channel3Title: 'Request a site visit.',
    channel3Body: 'For project-specific consultations. Tell us about your project, your site conditions, and your timeline. An engineer responds with a proposed visit slot.',
    channel3FormatLabel: 'Best for',
    channel3ResponseLabel: 'Reply',
    channel3OutputLabel: 'Output',
    channel3Format: 'New projects, unusual aggregate, tender prep',
    channel3Response: 'Within 2 working days',
    channel3Output: 'Proposed visit slot · engineer assigned',
    channel3Cta: 'Request a visit',

    // Location
    locationEyebrow: 'The workshop · Selangor',
    locationHeadline: 'The press, the kiln, the laser-weld.',
    locationLede: 'Visitors welcome by appointment. The technical team can walk you through the press, the segment kiln, and the laser-weld station. The three machines every blade we ship passes through.',
    legalEntityName: 'Coolman Malaysia Sdn Bhd',
    legalEntityAddress: '',
    legalEntityRegNo: '',
    locationRegPrefix: 'Reg.',
    locationAddressFallback: 'Selangor · Malaysia',
    locationAddressNote: 'Full address available on request.',
    locationLabelMonFri: 'Mon to Fri',
    locationLabelSat: 'Saturday',
    locationLabelSun: 'Sunday',
    openingMonFri: '09:00–18:00',
    openingSat: '09:00–13:00',
    openingSun: 'Closed',
    locationDispatchLabel: 'Dispatch',
    locationDispatchSuffix: 'within 2 business days from PJ stock',
    dispatchCutoff: '14:00',
    locationOpenInMaps: 'Open in maps',
    locationMapWorkshop: 'COOLMAN',
    locationMapSince: 'NO. 14 · SINCE 2007',
    locationMapCoords: '3.0840° N · 101.6336° E',
    locationMapCity: 'Selangor',
    locationOverlayBrand: 'Coolman',

    // Direct lines
    directLinesEyebrow: 'Direct lines',
    directLinesHeadline: 'If you already know who you need.',
    directLinesLede: 'Direct contact points for the four most common reasons people reach the company. Each one goes to a named team, not a queue.',
    directLines: [
      { label: 'Sales', email: 'sales@coolman.com.my', note: 'Quotes, account questions, general enquiries.' },
      { label: 'Parts and orders', email: 'parts@coolman.com.my', note: 'Re-orders, dispatch, invoices for trade accounts.' },
      { label: 'Training and service', email: 'training@coolman.com.my', note: 'Operator training, certifications, Shibuya service.' },
      { label: 'Careers', email: 'careers@coolman.com.my', note: 'Job applications. Goes direct to Alan.' },
    ],

    // Form
    formEyebrow: 'Site visit form',
    formTitle: 'Tell us about the project.',
    formSubtitle: 'Project type, site conditions, timeline. An engineer responds with a proposed visit slot.',
    formNameLabel: 'Name *',
    formNamePlaceholder: 'Your name',
    formCompanyLabel: 'Company',
    formCompanyPlaceholder: 'Company name',
    formEmailLabel: 'Email *',
    formEmailPlaceholder: 'name@company.com',
    formPhoneLabel: 'Phone',
    formPhonePlaceholder: '+60 12-345 6789',
    formMessageLabel: 'Project details *',
    formMessagePlaceholder: 'Project type, site conditions, aggregate if known, target timeline.',
    formSubmit: 'Request a visit',
    formSubmitting: 'Sending...',
    formError: 'Something went wrong. Please try again.',
    networkError: 'Network error. Please check your connection and try again.',
    successTitle: 'Request received.',
    successMessage: 'An engineer will respond with a proposed visit slot within two working days.',
    sendAnother: 'Send another request',
  },

  render: ({
    heroEyebrow, heroTitle, heroTitleEmphasis, heroLede,
    channelsEyebrow, channelsHeadline, channelsLede,
    channel1Badge, channel1Title, channel1Body,
    channel1NumberLabel, channel1HoursLabel, channel1ResponseLabel, channel1LanguagesLabel,
    channel1Hours, channel1Response, channel1Languages, channel1Cta, whatsappPrefillText,
    channel2Badge, channel2Title, channel2Body,
    channel2NumberLabel, channel2HoursLabel, channel2ResponseLabel,
    channel2Hours, channel2Response, channel2Cta, officePhone,
    channel3Badge, channel3Title, channel3Body,
    channel3FormatLabel, channel3ResponseLabel, channel3OutputLabel,
    channel3Format, channel3Response, channel3Output, channel3Cta,
    locationEyebrow, locationHeadline, locationLede,
    legalEntityName, legalEntityAddress, legalEntityRegNo, locationRegPrefix,
    locationAddressFallback, locationAddressNote,
    locationLabelMonFri, locationLabelSat, locationLabelSun,
    openingMonFri, openingSat, openingSun,
    locationDispatchLabel, locationDispatchSuffix, dispatchCutoff,
    locationOpenInMaps,
    locationMapWorkshop, locationMapSince, locationMapCoords, locationMapCity, locationOverlayBrand,
    directLinesEyebrow, directLinesHeadline, directLinesLede,
    directLines,
    formEyebrow, formTitle, formSubtitle,
    formNameLabel, formNamePlaceholder, formCompanyLabel, formCompanyPlaceholder,
    formEmailLabel, formEmailPlaceholder, formPhoneLabel, formPhonePlaceholder,
    formMessageLabel, formMessagePlaceholder,
    formSubmit, formSubmitting, formError, networkError,
    successTitle, successMessage, sendAnother,
    puck,
  }) => {
    const s = (puck?.metadata?.settings as Settings) || {}
    const whatsappNumber = s.whatsapp_number || '+60126363156'

    const mapsHref = legalEntityAddress
      ? `https://www.google.com/maps/?q=${encodeURIComponent(legalEntityAddress as string)}`
      : null

    const infoCopy: ContactInfoCopy = {
      whatsappPrefillText: whatsappPrefillText as string,
      channel1Badge: channel1Badge as string, channel1Title: channel1Title as string, channel1Body: channel1Body as string,
      channel1NumberLabel: channel1NumberLabel as string, channel1HoursLabel: channel1HoursLabel as string,
      channel1ResponseLabel: channel1ResponseLabel as string, channel1LanguagesLabel: channel1LanguagesLabel as string,
      channel1Hours: channel1Hours as string, channel1Response: channel1Response as string,
      channel1Languages: channel1Languages as string, channel1Cta: channel1Cta as string,
      channel2Badge: channel2Badge as string, channel2Title: channel2Title as string, channel2Body: channel2Body as string,
      channel2NumberLabel: channel2NumberLabel as string, channel2HoursLabel: channel2HoursLabel as string,
      channel2ResponseLabel: channel2ResponseLabel as string,
      channel2Hours: channel2Hours as string, channel2Response: channel2Response as string, channel2Cta: channel2Cta as string,
      channel3Badge: channel3Badge as string, channel3Title: channel3Title as string, channel3Body: channel3Body as string,
      channel3FormatLabel: channel3FormatLabel as string, channel3ResponseLabel: channel3ResponseLabel as string,
      channel3OutputLabel: channel3OutputLabel as string,
      channel3Format: channel3Format as string, channel3Response: channel3Response as string,
      channel3Output: channel3Output as string, channel3Cta: channel3Cta as string,
    }

    const formCopy: ContactFormCopy = {
      formEyebrow: formEyebrow as string, formTitle: formTitle as string, formSubtitle: formSubtitle as string,
      formNameLabel: formNameLabel as string, formNamePlaceholder: formNamePlaceholder as string,
      formCompanyLabel: formCompanyLabel as string, formCompanyPlaceholder: formCompanyPlaceholder as string,
      formEmailLabel: formEmailLabel as string, formEmailPlaceholder: formEmailPlaceholder as string,
      formPhoneLabel: formPhoneLabel as string, formPhonePlaceholder: formPhonePlaceholder as string,
      formMessageLabel: formMessageLabel as string, formMessagePlaceholder: formMessagePlaceholder as string,
      formSubmit: formSubmit as string, formSubmitting: formSubmitting as string,
      formError: formError as string, networkError: networkError as string,
      successTitle: successTitle as string, successMessage: successMessage as string,
      sendAnother: sendAnother as string,
    }

    const lines = (directLines as DirectLine[]) || []

    return (
      <>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <header className="bg-paper pb-12 pt-28 lg:pb-20 lg:pt-36">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              {heroEyebrow}
            </div>
            <h1 className="mt-6 max-w-[22ch] font-fraunces text-[44px] font-normal leading-[1.08] tracking-tight text-navy md:text-[56px] lg:text-[64px]">
              {heroTitle}{' '}
              <em className="font-fraunces italic text-navy">{heroTitleEmphasis}</em>
            </h1>
            <p className="mt-6 max-w-[58ch] text-base leading-[1.7] text-ink-muted lg:text-lg">
              {heroLede}
            </p>
          </div>
        </header>

        {/* ── Channels ─────────────────────────────────────────────────────── */}
        <section className="bg-paper py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-10 lg:mb-14">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                {channelsEyebrow}
              </div>
              <h2 className="mt-4 max-w-[24ch] font-fraunces text-[28px] font-normal leading-[1.18] tracking-tight text-navy lg:text-[34px]">
                {channelsHeadline}
              </h2>
              <p className="mt-4 max-w-[58ch] text-sm leading-[1.7] text-ink-muted lg:text-base">
                {channelsLede}
              </p>
            </div>
          </div>
          <ContactChannelsSection
            c={infoCopy}
            whatsappNumber={whatsappNumber}
            officePhone={(officePhone as string) || whatsappNumber}
          />
        </section>

        {/* ── Location ─────────────────────────────────────────────────────── */}
        <section className="bg-navy py-16 text-paper lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-10 lg:mb-14">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                {locationEyebrow}
              </div>
              <h2 className="mt-4 max-w-[24ch] font-fraunces text-[28px] font-normal leading-[1.18] tracking-tight text-paper lg:text-[34px]">
                {locationHeadline}
              </h2>
              <p className="mt-4 max-w-[58ch] text-sm leading-[1.7] text-ink-faint lg:text-base">
                {locationLede}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
              <div className="pt-2">
                <h3 className="mb-6 max-w-[22ch] font-fraunces text-[24px] font-normal leading-[1.2] tracking-tight text-paper lg:text-[26px]">
                  {legalEntityName}
                </h3>
                <div className="mb-8 max-w-[38ch] text-[15px] leading-[1.7] text-paper">
                  {legalEntityAddress ? (
                    <p style={{ whiteSpace: 'pre-line' }}>{legalEntityAddress as string}</p>
                  ) : (
                    <>
                      <p>{locationAddressFallback}</p>
                      <p className="mt-2 text-ink-faint">{locationAddressNote}</p>
                    </>
                  )}
                  {legalEntityRegNo ? (
                    <p className="mt-2 text-ink-faint">
                      {locationRegPrefix} {legalEntityRegNo}
                    </p>
                  ) : null}
                </div>

                <dl className="mb-6 grid grid-cols-1 gap-5 border-y border-paper/20 py-5 sm:grid-cols-3">
                  <div>
                    <dt className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                      {locationLabelMonFri}
                    </dt>
                    <dd className="font-mono text-[14px] text-paper">{openingMonFri}</dd>
                  </div>
                  <div>
                    <dt className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                      {locationLabelSat}
                    </dt>
                    <dd className="font-mono text-[14px] text-paper">{openingSat}</dd>
                  </div>
                  <div>
                    <dt className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                      {locationLabelSun}
                    </dt>
                    <dd className="font-mono text-[14px] text-paper">{openingSun}</dd>
                  </div>
                </dl>

                <p className="mb-6 text-[13px] text-ink-faint">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {locationDispatchLabel}:
                  </span>{' '}
                  <span className="font-mono text-paper">{dispatchCutoff}</span>{' '}
                  <span className="text-ink-faint">{locationDispatchSuffix}</span>
                </p>

                {mapsHref ? (
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-md border border-paper/40 px-6 font-mono text-[13px] font-semibold uppercase tracking-[0.06em] text-paper transition-colors duration-150 hover:bg-paper hover:text-navy"
                  >
                    {locationOpenInMaps}
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
                ) : null}
              </div>

              {/* Schematic SVG map — road labels are decorative proper-noun signage,
                  hardcoded per the Frontend-editability exception in LEARNINGS.md. */}
              <div className="relative aspect-[4/3] overflow-hidden border border-accent/20 bg-navy-light">
                <svg
                  viewBox="0 0 600 450"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Schematic of the workshop location within Selangor"
                  className="block h-full w-full"
                >
                  <defs>
                    <pattern id="puck-contact-map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(96,165,250,0.12)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="600" height="450" fill="#122036" />
                  <rect width="600" height="450" fill="url(#puck-contact-map-grid)" />

                  {/* Roads */}
                  <path d="M 0 280 L 600 240" stroke="#1A2D47" strokeWidth="22" fill="none" />
                  <path d="M 240 0 L 280 450" stroke="#1A2D47" strokeWidth="14" fill="none" />
                  <path d="M 0 120 L 600 100" stroke="#1A2D47" strokeWidth="6" fill="none" />
                  <path d="M 100 0 L 130 450" stroke="#1A2D47" strokeWidth="6" fill="none" />
                  <path d="M 420 0 L 450 450" stroke="#1A2D47" strokeWidth="6" fill="none" />

                  {/* Road labels — proper-noun decorative signage, not translateable */}
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
                    {locationMapWorkshop}
                  </text>
                  <text x="380" y="132" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#94A3B8" letterSpacing="0.1em">
                    {locationMapSince}
                  </text>

                  {/* Coordinates */}
                  <text x="20" y="430" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#475569" letterSpacing="0.1em">{locationMapCoords}</text>
                  <text x="580" y="430" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#475569" letterSpacing="0.1em" textAnchor="end">{locationMapCity}</text>
                </svg>
                <div className="absolute bottom-6 left-6 max-w-[220px] border border-accent/24 bg-navy/90 px-[18px] py-[14px] font-mono text-[11px] uppercase tracking-[0.12em] text-paper">
                  <span className="mb-1 block text-accent">{locationOverlayBrand}</span>
                  {legalEntityAddress
                    ? (legalEntityAddress as string).split('\n')[0]
                    : locationAddressFallback}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Direct lines ─────────────────────────────────────────────────── */}
        <section className="bg-paper py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-10 lg:mb-14">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                {directLinesEyebrow}
              </div>
              <h2 className="mt-4 max-w-[24ch] font-fraunces text-[28px] font-normal leading-[1.18] tracking-tight text-navy lg:text-[34px]">
                {directLinesHeadline}
              </h2>
              <p className="mt-4 max-w-[58ch] text-sm leading-[1.7] text-ink-muted lg:text-base">
                {directLinesLede}
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-0 lg:px-8">
            <div className="grid grid-cols-1 gap-px border-y border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
              {lines.map((line, i) => (
                <div key={i} className="bg-paper px-7 py-8">
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                    {line.label}
                  </div>
                  <div className="mb-2.5 font-mono text-[15px] leading-[1.4] text-navy">
                    <a
                      href={`mailto:${line.email}`}
                      className="text-accent transition-opacity duration-150 hover:opacity-80"
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

        {/* ── Site visit form ───────────────────────────────────────────────── */}
        <ContactFormSection c={formCopy} />
      </>
    )
  },
}
