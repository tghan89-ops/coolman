"use client"

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'

const applications = [
  {
    id: 'concrete',
    title: 'Concrete Cutting',
    description: 'Heavy-duty diamond blades engineered for reinforced concrete, cured slabs, and structural elements.',
    features: ['Reinforced concrete', 'Cured concrete slabs', 'Concrete blocks', 'Precast elements'],
    image: 'https://placehold.co/800x600/0a1628/3b82f6?text=CONCRETE'
  },
  {
    id: 'granite',
    title: 'Granite & Natural Stone',
    description: 'Precision blades for cutting granite countertops, natural stone, and hard rock materials.',
    features: ['Granite slabs', 'Natural stone', 'Hard rock', 'Quartz surfaces'],
    image: 'https://placehold.co/800x600/0a1628/3b82f6?text=GRANITE'
  },
  {
    id: 'marble',
    title: 'Marble & Soft Stone',
    description: 'Specialized segments for clean, chip-free cuts in marble, limestone, and soft stone.',
    features: ['Marble slabs', 'Limestone', 'Travertine', 'Soft stone'],
    image: 'https://placehold.co/800x600/0a1628/3b82f6?text=MARBLE'
  },
  {
    id: 'tile',
    title: 'Tile & Ceramics',
    description: 'Fine-grit diamond blades for precise cuts in porcelain, ceramic tiles, and glass.',
    features: ['Porcelain tiles', 'Ceramic tiles', 'Glass tiles', 'Mosaic work'],
    image: 'https://placehold.co/800x600/0a1628/3b82f6?text=TILE'
  },
  {
    id: 'asphalt',
    title: 'Asphalt Cutting',
    description: 'Durable blades designed for roadwork, asphalt overlays, and pavement cutting.',
    features: ['Road repairs', 'Pavement cutting', 'Asphalt overlays', 'Utility trenching'],
    image: 'https://placehold.co/800x600/0a1628/3b82f6?text=ASPHALT'
  },
  {
    id: 'brick',
    title: 'Brick & Masonry',
    description: 'All-purpose blades for cutting brick, block, and general masonry materials.',
    features: ['Clay brick', 'Concrete blocks', 'Pavers', 'Masonry walls'],
    image: 'https://placehold.co/800x600/0a1628/3b82f6?text=BRICK'
  },
]

export default function ApplicationsPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-navy pb-16 pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Applications</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white lg:text-5xl">
              Solutions for Every Material
            </h1>
            <p className="mt-6 text-lg text-white/60">
              Our comprehensive range of diamond cutting tools is engineered to deliver optimal
              performance across all common construction materials.
            </p>
          </div>
        </div>
      </section>

      {/* Applications Grid */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16">
            {applications.map((app, index) => (
              <div
                key={app.id}
                className={`grid items-center gap-12 lg:grid-cols-2 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
                    <Image
                      src={app.image}
                      alt={app.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <h2 className="text-2xl font-bold text-navy lg:text-3xl">{app.title}</h2>
                  <p className="mt-4 text-ink-muted">{app.description}</p>

                  <ul className="mt-6 grid grid-cols-2 gap-3">
                    {app.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10">
                          <Check className="h-3 w-3 text-accent" />
                        </div>
                        <span className="text-sm text-ink-muted">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="mt-8 rounded-xl bg-navy text-white hover:bg-navy-light"
                    asChild
                  >
                    <Link href={`/products?material=${app.id}`}>
                      View {app.title} Blades
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-navy">Need Help Selecting the Right Blade?</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-muted">
            Our technical team can help you choose the optimal blade for your specific application and cutting conditions.
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
