/**
 * Locked PAGE block — Resources page
 * Reproduces the exact markup of components/pages/ResourcesClient.tsx with all
 * visible copy as editable Puck fields. Layout is locked (one block, can't be
 * moved / duplicated / deleted). Dynamic file/video links from the CMS global
 * become editable array fields here so an editor can manage them without Payload.
 * No prices, product cards, SKUs, or cart data — pure resource/editorial content.
 *
 * No client component needed: downloads are plain <a> tags, FAQs are static,
 * the CTA links to /contact. No state or event handlers required.
 */
import type { ComponentConfig } from '@puckeditor/core'

const LOCKED = { drag: false, duplicate: false, delete: false } as const

// ─────────────────────────────────────────────────────────────────────────────
// RESOURCES  (components/pages/ResourcesClient.tsx)
// ─────────────────────────────────────────────────────────────────────────────
export const ResourcesPage: ComponentConfig = {
  label: 'Page · Resources',
  permissions: LOCKED,
  fields: {
    // ── Hero ──────────────────────────────────────────────────────────────
    heroEyebrow: { type: 'text', label: 'Hero eyebrow', contentEditable: true },
    heroTitle: { type: 'text', label: 'Hero title', contentEditable: true },
    heroSubtitle: { type: 'textarea', label: 'Hero subtitle', contentEditable: true },

    // ── Downloads ─────────────────────────────────────────────────────────
    downloads: {
      type: 'array',
      label: 'Downloads (PDF)',
      arrayFields: {
        title: { type: 'text', label: 'Title', contentEditable: true },
        description: { type: 'textarea', label: 'Description', contentEditable: true },
        href: { type: 'text', label: 'File URL (PDF link)' },
      },
      defaultItemProps: {
        title: 'New document',
        description: 'Description of this document.',
        href: '',
      },
    },

    // ── Videos ────────────────────────────────────────────────────────────
    videos: {
      type: 'array',
      label: 'Videos (YouTube)',
      arrayFields: {
        title: { type: 'text', label: 'Title', contentEditable: true },
        description: { type: 'textarea', label: 'Description', contentEditable: true },
        href: { type: 'text', label: 'YouTube URL' },
      },
      defaultItemProps: {
        title: 'New video',
        description: 'Description of this video.',
        href: '',
      },
    },

    // ── Empty-state copy (shown when both arrays are empty / no href set) ─
    emptyTitle: { type: 'text', label: 'Empty state title', contentEditable: true },
    emptyMessage: { type: 'textarea', label: 'Empty state message', contentEditable: true },
    emptyButton: { type: 'text', label: 'Empty state button label', contentEditable: true },

    // ── Resource card action labels ───────────────────────────────────────
    openPdf: { type: 'text', label: 'Download card CTA label', contentEditable: true },
    playVideo: { type: 'text', label: 'Video card CTA label', contentEditable: true },

    // ── FAQ ───────────────────────────────────────────────────────────────
    faqEyebrow: { type: 'text', label: 'FAQ eyebrow', contentEditable: true },
    faqHeading: { type: 'text', label: 'FAQ heading', contentEditable: true },
    faqs: {
      type: 'array',
      label: 'FAQ items',
      arrayFields: {
        question: { type: 'text', label: 'Question', contentEditable: true },
        answer: { type: 'textarea', label: 'Answer', contentEditable: true },
      },
      defaultItemProps: {
        question: 'New question?',
        answer: 'Answer here.',
      },
    },

    // ── CTA ───────────────────────────────────────────────────────────────
    ctaTitle: { type: 'text', label: 'CTA title', contentEditable: true },
    ctaMessage: { type: 'textarea', label: 'CTA message', contentEditable: true },
    ctaButton: { type: 'text', label: 'CTA button label', contentEditable: true },
    ctaHref: { type: 'text', label: 'CTA button link' },
  },

  defaultProps: {
    heroEyebrow: 'Resources',
    heroTitle: 'Technical Resources & Downloads',
    heroSubtitle:
      'Access product catalogs, technical guides, and educational content to help you get the most from your diamond cutting tools.',

    downloads: [
      {
        title: 'Product Catalog 2024',
        description:
          'Complete catalog with specifications, pricing, and application guides for all our diamond cutting tools.',
        href: '',
      },
      {
        title: 'Blade Selection Guide',
        description:
          'Technical guide to help you choose the right blade for your specific material and cutting conditions.',
        href: '',
      },
      {
        title: 'Safety Guidelines',
        description: 'Comprehensive safety guidelines for diamond blade operation and maintenance.',
        href: '',
      },
      {
        title: 'Technical Specifications',
        description:
          'Detailed technical specifications including segment configurations, RPM ratings, and compatibility.',
        href: '',
      },
    ],

    videos: [
      {
        title: 'Cutting Best Practices',
        description:
          'Video series covering optimal cutting techniques, machine setup, and safety procedures.',
        href: '',
      },
      {
        title: 'Product Demonstrations',
        description: 'See our diamond blades in action across various applications and materials.',
        href: '',
      },
    ],

    emptyTitle: 'Catalogue arriving soon',
    emptyMessage:
      "We're finalising the latest PDFs and video guides. In the meantime, ask our team for the file you need.",
    emptyButton: 'Request a copy',

    openPdf: 'Open PDF',
    playVideo: 'Play video',

    faqEyebrow: 'FAQ',
    faqHeading: 'Frequently Asked Questions',
    faqs: [
      {
        question: 'How do I select the right blade for my application?',
        answer:
          'Consider the material you are cutting, the hardness, whether it is reinforced, and the type of cut (wet or dry). Our Blade Selection Guide provides detailed recommendations, or contact our technical team for personalized advice.',
      },
      {
        question: 'What is the difference between segmented and continuous rim blades?',
        answer:
          'Segmented blades have gaps between segments for aggressive cutting and cooling, ideal for concrete and masonry. Continuous rim blades provide smoother cuts with less chipping, perfect for tile and stone.',
      },
      {
        question: 'How do I maximize blade life?',
        answer:
          'Use the correct blade for your material, maintain proper RPM and feed rates, ensure adequate water flow for wet cutting, and allow the blade to cut rather than forcing it.',
      },
      {
        question: 'Do you offer bulk pricing for contractors?',
        answer:
          'Yes, registered contractors receive tiered pricing based on volume. Create a contractor account to view your pricing tier and available discounts.',
      },
    ],

    ctaTitle: 'Need Technical Assistance?',
    ctaMessage:
      'Our engineering team is ready to help with blade selection, technical questions, and application support.',
    ctaButton: 'Contact Technical Support',
    ctaHref: '/contact',
  },

  render: ({
    heroEyebrow,
    heroTitle,
    heroSubtitle,
    downloads,
    videos,
    emptyTitle,
    emptyMessage,
    emptyButton,
    openPdf,
    playVideo,
    faqs,
    faqEyebrow,
    faqHeading,
    ctaTitle,
    ctaMessage,
    ctaButton,
    ctaHref,
  }) => {
    type ResourceItem = { type: 'download' | 'video'; title: React.ReactNode; description: React.ReactNode; href: string }

    const dlRows = (downloads as { title: React.ReactNode; description: React.ReactNode; href: string }[]) || []
    const vidRows = (videos as { title: React.ReactNode; description: React.ReactNode; href: string }[]) || []
    const faqRows = (faqs as { question: React.ReactNode; answer: React.ReactNode }[]) || []

    const allResources: ResourceItem[] = [
      ...dlRows.filter((d) => d.href).map((d) => ({ type: 'download' as const, title: d.title, description: d.description, href: d.href })),
      ...vidRows.filter((v) => v.href).map((v) => ({ type: 'video' as const, title: v.title, description: v.description, href: v.href })),
    ]

    const hasResources = allResources.length > 0

    return (
      <>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="bg-navy pb-16 pt-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">{heroEyebrow}</p>
              <h1 className="mt-3 font-fraunces text-[clamp(40px,6vw,84px)] font-normal leading-[1.02] tracking-[-0.025em] text-white">
                {heroTitle}
              </h1>
              <p className="mt-6 text-lg text-white/60">{heroSubtitle}</p>
            </div>
          </div>
        </section>

        {/* ── Downloads + Videos Grid ──────────────────────────────────── */}
        <section className="border-t border-rule bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {!hasResources ? (
              <div className="mx-auto max-w-xl rounded-sm border border-rule bg-white p-10 text-center">
                <div className="mx-auto inline-flex rounded-sm bg-secondary p-3">
                  {/* FileText glyph — inline SVG avoids a lucide import in a pure render */}
                  <svg className="h-6 w-6 text-ink-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline strokeLinecap="round" strokeLinejoin="round" points="14 2 14 8 20 8" />
                    <line strokeLinecap="round" strokeLinejoin="round" x1="16" y1="13" x2="8" y2="13" />
                    <line strokeLinecap="round" strokeLinejoin="round" x1="16" y1="17" x2="8" y2="17" />
                    <polyline strokeLinecap="round" strokeLinejoin="round" points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-navy">{emptyTitle}</h3>
                <p className="mt-3 text-sm text-ink-muted">{emptyMessage}</p>
                <a
                  href="/contact"
                  className="mt-6 inline-flex items-center rounded-sm border border-rule px-4 py-2 text-sm font-medium text-navy transition-colors duration-150 ease-out hover:border-accent hover:text-accent"
                >
                  {emptyButton}
                </a>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {allResources.map((resource, index) => {
                  const isVideo = resource.type === 'video'
                  return (
                    <a
                      key={index}
                      href={resource.href}
                      target={isVideo ? '_blank' : undefined}
                      rel={isVideo ? 'noopener noreferrer' : undefined}
                      download={!isVideo ? '' : undefined}
                      className="group flex flex-col rounded-sm border border-rule bg-white p-6 transition-[border-color,box-shadow] hover:border-accent/50 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="inline-flex rounded-sm bg-secondary p-3">
                          {isVideo ? (
                            /* Play icon */
                            <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                              <polygon strokeLinecap="round" strokeLinejoin="round" points="5 3 19 12 5 21 5 3" />
                            </svg>
                          ) : (
                            /* BookOpen / FileText icon */
                            <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                              <polyline strokeLinecap="round" strokeLinejoin="round" points="14 2 14 8 20 8" />
                              <line strokeLinecap="round" strokeLinejoin="round" x1="16" y1="13" x2="8" y2="13" />
                              <line strokeLinecap="round" strokeLinejoin="round" x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                          )}
                        </div>
                      </div>

                      <h3 className="mt-4 text-lg font-semibold text-navy">{resource.title}</h3>
                      <p className="mt-2 flex-1 text-sm text-ink-muted">{resource.description}</p>

                      <span className="mt-6 flex items-center gap-2 text-sm font-medium text-accent transition-opacity group-hover:opacity-80">
                        {isVideo ? (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                            <polygon strokeLinecap="round" strokeLinejoin="round" points="5 3 19 12 5 21 5 3" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                          </svg>
                        )}
                        {isVideo ? playVideo : openPdf}
                      </span>
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <section className="bg-secondary py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">{faqEyebrow}</p>
              <h2 className="mt-3 font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
                {faqHeading}
              </h2>
            </div>

            <div className="mx-auto mt-16 max-w-3xl divide-y divide-rule">
              {faqRows.map((faq, index) => (
                <div key={index} className="py-6">
                  <h3 className="text-lg font-semibold text-navy">{faq.question}</h3>
                  <p className="mt-3 text-ink-muted">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
            <h2 className="font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
              {ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-muted">{ctaMessage}</p>
            <a
              href={(ctaHref as string) || '/contact'}
              className="mt-8 inline-flex h-14 items-center rounded-sm bg-accent px-8 text-white transition-opacity duration-150 ease-out hover:opacity-90"
            >
              {ctaButton}
              {/* ArrowRight inline */}
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <line strokeLinecap="round" strokeLinejoin="round" x1="5" y1="12" x2="19" y2="12" />
                <polyline strokeLinecap="round" strokeLinejoin="round" points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </section>
      </>
    )
  },
}
