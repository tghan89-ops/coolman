"use client"

import Link from 'next/link'
import { FileText, Download, Play, BookOpen, ArrowRight, ExternalLink } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'

const resources = [
  {
    type: 'catalog',
    icon: FileText,
    title: 'Product Catalog 2024',
    description: 'Complete catalog with specifications, pricing, and application guides for all our diamond cutting tools.',
    action: 'Download PDF',
    size: '12.5 MB'
  },
  {
    type: 'guide',
    icon: BookOpen,
    title: 'Blade Selection Guide',
    description: 'Technical guide to help you choose the right blade for your specific material and cutting conditions.',
    action: 'Download PDF',
    size: '3.2 MB'
  },
  {
    type: 'video',
    icon: Play,
    title: 'Cutting Best Practices',
    description: 'Video series covering optimal cutting techniques, machine setup, and safety procedures.',
    action: 'Watch Video',
    duration: '15 min'
  },
  {
    type: 'guide',
    icon: BookOpen,
    title: 'Safety Guidelines',
    description: 'Comprehensive safety guidelines for diamond blade operation and maintenance.',
    action: 'Download PDF',
    size: '1.8 MB'
  },
  {
    type: 'catalog',
    icon: FileText,
    title: 'Technical Specifications',
    description: 'Detailed technical specifications including segment configurations, RPM ratings, and compatibility.',
    action: 'Download PDF',
    size: '5.4 MB'
  },
  {
    type: 'video',
    icon: Play,
    title: 'Product Demonstrations',
    description: 'See our diamond blades in action across various applications and materials.',
    action: 'Watch Video',
    duration: '8 min'
  },
]

const faqs = [
  {
    question: 'How do I select the right blade for my application?',
    answer: 'Consider the material you are cutting, the hardness, whether it is reinforced, and the type of cut (wet or dry). Our Blade Selection Guide provides detailed recommendations, or contact our technical team for personalized advice.'
  },
  {
    question: 'What is the difference between segmented and continuous rim blades?',
    answer: 'Segmented blades have gaps between segments for aggressive cutting and cooling, ideal for concrete and masonry. Continuous rim blades provide smoother cuts with less chipping, perfect for tile and stone.'
  },
  {
    question: 'How do I maximize blade life?',
    answer: 'Use the correct blade for your material, maintain proper RPM and feed rates, ensure adequate water flow for wet cutting, and allow the blade to cut rather than forcing it.'
  },
  {
    question: 'Do you offer bulk pricing for contractors?',
    answer: 'Yes, registered contractors receive tiered pricing based on volume. Create a contractor account to view your pricing tier and available discounts.'
  },
]

export default function ResourcesPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-navy pb-16 pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Resources</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white lg:text-5xl">
              Technical Resources & Downloads
            </h1>
            <p className="mt-6 text-lg text-white/60">
              Access product catalogs, technical guides, and educational content to help you
              get the most from your diamond cutting tools.
            </p>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="group flex flex-col rounded-2xl border border-rule bg-white p-6 transition-[border-color,box-shadow] hover:border-accent/50 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="inline-flex rounded-xl bg-secondary p-3">
                    <resource.icon className="h-6 w-6 text-accent" />
                  </div>
                  <span className="text-xs text-ink-faint">
                    {resource.size || resource.duration}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-navy">{resource.title}</h3>
                <p className="mt-2 flex-1 text-sm text-ink-muted">{resource.description}</p>

                <button className="mt-6 flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-dark">
                  {resource.type === 'video' ? (
                    <Play className="h-4 w-4" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {resource.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold text-navy">Frequently Asked Questions</h2>
          </div>

          <div className="mx-auto mt-16 max-w-3xl divide-y divide-rule">
            {faqs.map((faq, index) => (
              <div key={index} className="py-6">
                <h3 className="text-lg font-semibold text-navy">{faq.question}</h3>
                <p className="mt-3 text-ink-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-navy">Need Technical Assistance?</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-muted">
            Our engineering team is ready to help with blade selection, technical questions, and application support.
          </p>
          <Button
            size="lg"
            className="mt-8 h-14 rounded-xl bg-accent px-8 text-white hover:bg-accent-dark"
            asChild
          >
            <Link href="/contact">
              Contact Technical Support
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  )
}
