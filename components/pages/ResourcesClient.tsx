'use client'

import Link from 'next/link'
import { FileText, Download, Play, BookOpen, ArrowRight } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { useLanguage } from '@/lib/i18n/context'

const defaultDownloads = [
  { title: 'Product Catalog 2024', description: 'Complete catalog with specifications, pricing, and application guides for all our diamond cutting tools.', file: null },
  { title: 'Blade Selection Guide', description: 'Technical guide to help you choose the right blade for your specific material and cutting conditions.', file: null },
  { title: 'Safety Guidelines', description: 'Comprehensive safety guidelines for diamond blade operation and maintenance.', file: null },
  { title: 'Technical Specifications', description: 'Detailed technical specifications including segment configurations, RPM ratings, and compatibility.', file: null },
]

const defaultVideos = [
  { title: 'Cutting Best Practices', description: 'Video series covering optimal cutting techniques, machine setup, and safety procedures.', youtubeUrl: '' },
  { title: 'Product Demonstrations', description: 'See our diamond blades in action across various applications and materials.', youtubeUrl: '' },
]

const defaultFaqs = [
  { question: 'How do I select the right blade for my application?', answer: 'Consider the material you are cutting, the hardness, whether it is reinforced, and the type of cut (wet or dry). Our Blade Selection Guide provides detailed recommendations, or contact our technical team for personalized advice.' },
  { question: 'What is the difference between segmented and continuous rim blades?', answer: 'Segmented blades have gaps between segments for aggressive cutting and cooling, ideal for concrete and masonry. Continuous rim blades provide smoother cuts with less chipping, perfect for tile and stone.' },
  { question: 'How do I maximize blade life?', answer: 'Use the correct blade for your material, maintain proper RPM and feed rates, ensure adequate water flow for wet cutting, and allow the blade to cut rather than forcing it.' },
  { question: 'Do you offer bulk pricing for contractors?', answer: 'Yes, registered contractors receive tiered pricing based on volume. Create a contractor account to view your pricing tier and available discounts.' },
]

function getDownloadIcon(title: string) {
  if (title.toLowerCase().includes('catalog') || title.toLowerCase().includes('specification')) {
    return FileText
  }
  return BookOpen
}

export function ResourcesClient({ initialData }: { initialData: any }) {
  const { language, t } = useLanguage()
  const pick = (en?: string | null, bm?: string | null): string => {
    if (language === 'BM' && bm && bm.trim()) return bm
    return en ?? ''
  }
  const { data } = useLivePreview({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 2,
  })

  const heroTitle = pick(data?.heroTitle, data?.heroTitleBM) || t.pages.resources.fallbackHeroTitle
  const heroSubtitle = pick(data?.heroSubtitle, data?.heroSubtitleBM) || t.pages.resources.fallbackHeroSubtitle
  const downloads: any[] = data?.downloads?.length ? data.downloads : defaultDownloads
  const videos: any[] = data?.videos?.length ? data.videos : defaultVideos
  const faqs: any[] = data?.faqs?.length ? data.faqs : defaultFaqs

  function fileUrl(file: any): string | null {
    if (!file) return null
    if (typeof file === 'string') return file
    if (typeof file === 'object' && typeof file.url === 'string' && file.url) return file.url
    return null
  }

  const allResources = [
    ...downloads
      .map((d: any) => ({
        type: 'download' as const,
        title: pick(d.title, d.titleBM),
        description: pick(d.description, d.descriptionBM),
        href: fileUrl(d.file),
      }))
      .filter((d) => d.href),
    ...videos
      .map((v: any) => ({
        type: 'video' as const,
        title: pick(v.title, v.titleBM),
        description: pick(v.description, v.descriptionBM),
        href: (v.youtubeUrl || '').trim() || null,
      }))
      .filter((v) => v.href),
  ]

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-navy pb-16 pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">{t.pages.resources.heroEyebrow}</p>
            <h1 className="mt-3 font-fraunces text-[clamp(40px,6vw,84px)] font-normal leading-[1.02] tracking-[-0.025em] text-white">
              {heroTitle}
            </h1>
            <p className="mt-6 text-lg text-white/60">
              {heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Downloads + Videos Grid */}
      <section className="border-t border-rule bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {allResources.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-sm border border-rule bg-white p-10 text-center">
              <div className="mx-auto inline-flex rounded-sm bg-secondary p-3">
                <FileText className="h-6 w-6 text-ink-muted" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-navy">{t.pages.resources.emptyTitle}</h3>
              <p className="mt-3 text-sm text-ink-muted">
                {t.pages.resources.emptyMessage}
              </p>
              <Button size="sm" variant="outline" className="mt-6 border-rule" asChild>
                <Link href="/contact">{t.pages.resources.emptyButton}</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allResources.map((resource: any, index: number) => {
                const isVideo = resource.type === 'video'
                const Icon = isVideo ? Play : getDownloadIcon(resource.title ?? '')
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
                        <Icon className="h-6 w-6 text-accent" />
                      </div>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-navy">{resource.title ?? ''}</h3>
                    <p className="mt-2 flex-1 text-sm text-ink-muted">{resource.description ?? ''}</p>

                    <span className="mt-6 flex items-center gap-2 text-sm font-medium text-accent transition-opacity group-hover:opacity-80">
                      {isVideo ? <Play className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                      {isVideo ? t.pages.resources.playVideo : t.pages.resources.openPdf}
                    </span>
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">{t.pages.resources.faqEyebrow}</p>
            <h2 className="mt-3 font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">{t.pages.resources.faqHeading}</h2>
          </div>

          <div className="mx-auto mt-16 max-w-3xl divide-y divide-rule">
            {faqs.map((faq, index) => {
              const q = pick(faq.question, faq.questionBM) || ''
              const a = pick(faq.answer, faq.answerBM) || ''
              return (
                <div key={index} className="py-6">
                  <h3 className="text-lg font-semibold text-navy">{q}</h3>
                  <p className="mt-3 text-ink-muted">{a}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">{t.pages.resources.ctaTitle}</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-muted">
            {t.pages.resources.ctaMessage}
          </p>
          <Button size="lg" className="mt-8 h-14 rounded-sm bg-accent px-8 text-white hover:opacity-90" asChild>
            <Link href="/contact">
              {t.pages.resources.ctaButton}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  )
}
