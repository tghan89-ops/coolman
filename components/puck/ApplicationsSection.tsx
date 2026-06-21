'use client'

/**
 * Client shell for the locked Applications page Puck block.
 * Mirrors the alternating image/text grid in ApplicationsClient.tsx.
 * No hooks beyond rendering — just a 'use client' boundary so the
 * <img> + ArrowRight icon don't crash the server Render path.
 *
 * All copy arrives as props from the parent block (editable Puck fields).
 * Image URLs per section arrive as optional strings (set via Puck array
 * sub-field or left blank — blank shows a solid placeholder swatch).
 */

import { ArrowRight, Check } from 'lucide-react'

export type ApplicationSectionItem = {
  id: string
  title: string
  description: string
  features: string[]
  imageUrl?: string
  linkLabel: string
}

export type ApplicationsPageCopy = {
  eyebrow: string
  heroTitle: string
  heroSubtitle: string
  sections: ApplicationSectionItem[]
  ctaTitle: string
  ctaMessage: string
  ctaButton: string
  ctaHref: string
}

export function ApplicationsPageSection({ c }: { c: ApplicationsPageCopy }) {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy pb-16 pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">{c.eyebrow}</p>
            <h1 className="mt-3 font-fraunces text-[clamp(40px,6vw,84px)] font-normal leading-[1.02] tracking-[-0.025em] text-white">
              {c.heroTitle}
            </h1>
            <p className="mt-6 text-lg text-white/60">{c.heroSubtitle}</p>
          </div>
        </div>
      </section>

      {/* Applications Grid */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16">
            {c.sections.map((section, index) => {
              const imgSrc =
                section.imageUrl ||
                `https://placehold.co/800x600/0a1628/3b82f6?text=${encodeURIComponent(section.title.toUpperCase())}`

              return (
                <div
                  key={section.id || index}
                  className={`grid items-center gap-12 lg:grid-cols-2 ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-secondary">
                      {/* plain <img> — safe for both server Render and client */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgSrc}
                        alt={section.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <h2 className="font-fraunces text-[clamp(28px,3vw,40px)] font-normal leading-[1.1] tracking-[-0.02em] text-navy">
                      {section.title}
                    </h2>
                    <p className="mt-4 text-ink-muted">{section.description}</p>

                    {section.features.length > 0 && (
                      <ul className="mt-6 grid grid-cols-2 gap-3">
                        {section.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10">
                              <Check className="h-3 w-3 text-accent" />
                            </div>
                            <span className="text-sm text-ink-muted">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <a
                      href={`/products?material=${encodeURIComponent(section.id)}`}
                      className="mt-8 inline-flex items-center gap-2 rounded-sm bg-navy px-5 py-3 text-sm font-semibold text-white transition-opacity duration-150 ease-out hover:opacity-90"
                    >
                      {section.linkLabel}
                      <ArrowRight className="h-4 w-4" />
                    </a>
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
          <h2 className="font-fraunces text-[clamp(32px,3.4vw,44px)] font-normal leading-[1.08] tracking-[-0.02em] text-navy">
            {c.ctaTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-muted">{c.ctaMessage}</p>
          <a
            href={c.ctaHref}
            className="mt-8 inline-flex h-14 items-center gap-2 rounded-sm bg-accent px-8 text-sm font-semibold text-white transition-opacity duration-150 ease-out hover:opacity-90"
          >
            {c.ctaButton}
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>
    </>
  )
}
