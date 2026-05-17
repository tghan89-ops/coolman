'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { useLanguage } from '@/lib/i18n/context'

export function ApplicationsClient({ initialData }: { initialData: any }) {
  const { language, t } = useLanguage()
  const pickL = (en: string | null | undefined, bm: string | null | undefined, copyFallback: string): string => {
    if (language === 'BM') {
      if (bm && bm.trim()) return bm
      return copyFallback
    }
    if (en && en.trim()) return en
    return copyFallback
  }
  const { data } = useLivePreview({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 2,
  })

  const heroTitle = pickL(data?.heroTitle, data?.heroTitleBM, t.pages.applications.fallbackHeroTitle)
  const heroSubtitle = pickL(data?.heroSubtitle, data?.heroSubtitleBM, t.pages.applications.fallbackHeroSubtitle)
  // Merge: copy.ts defaults are language-correct; CMS sections override per-index when filled.
  // CMS schema has no `features` field, so features always come from copy.ts.
  const cmsSections: any[] = data?.sections?.length ? data.sections : []
  const sections = t.pages.applications.defaultSections.map((copyItem, i) => {
    const cms = cmsSections[i] ?? {}
    return {
      id: copyItem.id,
      title: pickL(cms.title, cms.titleBM, copyItem.title),
      description: pickL(cms.description, cms.descriptionBM, copyItem.description),
      features: copyItem.features,
      image: cms.image,
    }
  })

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-navy pb-16 pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">{t.pages.applications.heroEyebrow}</p>
            <h1 className="mt-3 font-fraunces text-[clamp(40px,6vw,84px)] font-normal leading-[1.02] tracking-[-0.025em] text-white">
              {heroTitle}
            </h1>
            <p className="mt-6 text-lg text-white/60">
              {heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Applications Grid */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16">
            {sections.map((section: any, index: number) => {
              const sectionId = section.id ?? `section-${index}`
              const sectionTitle = section.title
              const sectionDescription = section.description
              const sectionFeatures: string[] = section.features ?? []
              const sectionImage =
                typeof section.image === 'object' && section.image?.url
                  ? section.image.url
                  : typeof section.image === 'string'
                  ? section.image
                  : `https://placehold.co/800x600/0a1628/3b82f6?text=${encodeURIComponent(sectionTitle.toUpperCase())}`

              return (
                <div
                  key={sectionId}
                  className={`grid items-center gap-12 lg:grid-cols-2 ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-secondary">
                      <Image
                        src={sectionImage}
                        alt={sectionTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <h2 className="font-fraunces text-[clamp(28px,3vw,40px)] font-normal leading-[1.1] tracking-[-0.02em] text-navy">{sectionTitle}</h2>
                    <p className="mt-4 text-ink-muted">{sectionDescription}</p>

                    {sectionFeatures.length > 0 && (
                      <ul className="mt-6 grid grid-cols-2 gap-3">
                        {sectionFeatures.map((feature: string, i: number) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10">
                              <Check className="h-3 w-3 text-accent" />
                            </div>
                            <span className="text-sm text-ink-muted">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <Button
                      className="mt-8 rounded-sm bg-navy text-white hover:bg-navy-light"
                      asChild
                    >
                      <Link href={`/products?material=${sectionId}`}>
                        {`${t.pages.applications.viewBladesPrefix} ${sectionTitle}${t.pages.applications.viewBladesSuffix ? ' ' + t.pages.applications.viewBladesSuffix : ''}`}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">{t.pages.applications.ctaTitle}</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-muted">
            {t.pages.applications.ctaMessage}
          </p>
          <Button
            size="lg"
            className="mt-8 h-14 rounded-sm bg-accent px-8 text-white hover:opacity-90"
            asChild
          >
            <Link href="/contact">
              {t.pages.applications.contactSupport}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  )
}
