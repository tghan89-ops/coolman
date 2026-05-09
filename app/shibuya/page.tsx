"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowDown, Play, Check } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'

const shibuyaModels = [
  {
    id: 'ts-132',
    name: 'TS-132',
    tagline: 'Precision Handheld',
    description: 'Engineered for precision. The TS-132 delivers exceptional performance in a compact form factor, perfect for detailed work where accuracy matters most.',
    power: '1,500W',
    maxDiameter: '132mm',
    weight: '8.5kg',
    rpm: '580-2,100',
    features: ['Ergonomic handheld design', 'Wet and dry drilling modes', 'Variable speed control', 'Quick-release chuck'],
    price: 'RM 4,500',
    image: '/images/shibuya-hero.jpg',
  },
  {
    id: 'ts-162',
    name: 'TS-162',
    tagline: 'Professional Standard',
    description: 'The benchmark for professional core drilling. Combines power and precision with legendary Shibuya reliability for demanding daily use.',
    power: '2,200W',
    maxDiameter: '162mm',
    weight: '12kg',
    rpm: '480-1,800',
    features: ['Rig-mounted stability', 'Auto-feed capability', 'High-torque brushless motor', 'Integrated water supply'],
    price: 'RM 7,800',
    image: '/images/shibuya-hero.jpg',
  },
  {
    id: 'ts-252',
    name: 'TS-252',
    tagline: 'Industrial Powerhouse',
    description: 'Uncompromising power meets Japanese precision. Built for the most demanding industrial applications where failure is not an option.',
    power: '3,200W',
    maxDiameter: '252mm',
    weight: '18kg',
    rpm: '320-1,200',
    features: ['Industrial-grade construction', '3-speed gearbox', 'Intelligent overload protection', 'Reinforced anchor system'],
    price: 'RM 12,500',
    image: '/images/shibuya-hero.jpg',
  },
  {
    id: 'ts-402',
    name: 'TS-402',
    tagline: 'Maximum Performance',
    description: 'The pinnacle of core drilling technology. When the job demands absolute maximum capacity, the TS-402 delivers without compromise.',
    power: '4,800W',
    maxDiameter: '402mm',
    weight: '28kg',
    rpm: '180-720',
    features: ['Maximum drilling capacity', 'Hydraulic feed system', 'Remote operation capable', 'Continuous duty rated'],
    price: 'RM 22,000',
    image: '/images/shibuya-hero.jpg',
  },
]

const craftsmanshipPoints = [
  {
    number: '01',
    title: 'Precision Manufacturing',
    description: 'Every component machined to tolerances of 0.01mm in our Osaka facility.',
  },
  {
    number: '02',
    title: 'Quality Materials',
    description: 'Aircraft-grade aluminum housings and hardened steel gearing throughout.',
  },
  {
    number: '03',
    title: 'Rigorous Testing',
    description: '72-hour continuous operation test before any machine leaves the factory.',
  },
  {
    number: '04',
    title: 'Hand Assembly',
    description: 'Final assembly by master technicians with decades of experience.',
  },
]

export default function ShibuyaPage() {
  const [selectedModel, setSelectedModel] = useState(shibuyaModels[2])
  return (
    <PublicLayout>

      {/* Hero - Cinematic reveal */}
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#030508]">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030508]" />
        
        {/* Background image */}
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/images/shibuya-hero.jpg"
            alt="Shibuya Core Drill"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 lg:px-8">
          <div className="max-w-3xl">
            {/* Origin badge */}
            <div className="mb-8">
              <span className="inline-block border border-white/20 px-4 py-2 text-xs font-medium tracking-[0.3em] text-white/60">
                ENGINEERED IN JAPAN
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
              Precision Without
              <span className="block text-white/40">Compromise</span>
            </h1>

            {/* Subheading */}
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/50">
              Shibuya core drilling machines represent five decades of Japanese engineering excellence. Trusted by professionals who demand nothing less than perfection.
            </p>

            {/* CTA */}
            <div className="mt-12 flex flex-wrap gap-6">
              <Link 
                href="#models" 
                className="inline-flex items-center gap-3 bg-white px-8 py-4 text-sm font-semibold text-[#030508] transition-colors hover:bg-white/90"
              >
                Explore Models
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button className="inline-flex items-center gap-3 border border-white/20 px-8 py-4 text-sm font-semibold text-white transition-[border-color,background-color] hover:border-white/40 hover:bg-white/5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30">
                  <Play className="h-3 w-3 fill-white" />
                </div>
                Watch Film
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-3 text-white/30">
            <span className="text-xs tracking-[0.2em]">SCROLL</span>
            <ArrowDown className="h-4 w-4" />
          </div>
        </div>
      </section>

      {/* Heritage Statement */}
      <section className="bg-[#f8f7f4] py-32">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <p className="text-sm font-medium tracking-[0.2em] text-navy/40">SINCE 1973</p>
          <h2 className="mt-8 text-3xl font-bold leading-snug tracking-tight text-navy md:text-4xl lg:text-5xl">
            Five decades of relentless pursuit of perfection. Every Shibuya machine is a testament to Japanese craftsmanship.
          </h2>
          <div className="mx-auto mt-12 h-px w-16 bg-navy/20" />
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Image */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[#f8f7f4]">
              <Image
                src="/images/shibuya-detail.jpg"
                alt="Shibuya precision engineering"
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium tracking-[0.2em] text-navy/40">CRAFTSMANSHIP</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-navy md:text-4xl">
                Built to Last Generations
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-ink-muted">
                Every Shibuya machine begins its life in our Osaka manufacturing facility, where traditional Japanese craftsmanship meets modern precision engineering.
              </p>

              <div className="mt-12 space-y-8">
                {craftsmanshipPoints.map((point) => (
                  <div key={point.number} className="flex gap-6">
                    <span className="text-sm font-medium text-navy/20">{point.number}</span>
                    <div>
                      <h3 className="font-semibold text-navy">{point.title}</h3>
                      <p className="mt-1 text-sm text-ink-muted">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Models - Premium showcase */}
      <section id="models" className="bg-[#030508] py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-20 text-center">
            <p className="text-sm font-medium tracking-[0.2em] text-white/40">THE RANGE</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Choose Your Machine
            </h2>
          </div>

          {/* Model tabs */}
          <div className="mb-16 flex flex-wrap justify-center gap-2 border-b border-white/10 pb-8">
            {shibuyaModels.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  selectedModel.id === model.id
                    ? 'bg-white text-[#030508]'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {model.name}
              </button>
            ))}
          </div>

          {/* Selected model */}
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
              <Image
                src={selectedModel.image}
                alt={selectedModel.name}
                fill
                className="object-contain p-8"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium tracking-[0.2em] text-accent">{selectedModel.tagline}</p>
              <h3 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
                Shibuya {selectedModel.name}
              </h3>
              <p className="mt-6 text-lg leading-relaxed text-white/50">
                {selectedModel.description}
              </p>

              {/* Specs grid */}
              <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                <div>
                  <p className="text-3xl font-bold text-white">{selectedModel.power}</p>
                  <p className="mt-1 text-sm text-white/40">Motor Power</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{selectedModel.maxDiameter}</p>
                  <p className="mt-1 text-sm text-white/40">Max Diameter</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{selectedModel.weight}</p>
                  <p className="mt-1 text-sm text-white/40">Weight</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{selectedModel.rpm}</p>
                  <p className="mt-1 text-sm text-white/40">RPM Range</p>
                </div>
              </div>

              {/* Features */}
              <div className="mt-12">
                <p className="mb-4 text-sm font-medium text-white/40">KEY FEATURES</p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {selectedModel.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-white/70">
                      <Check className="h-4 w-4 flex-shrink-0 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price and CTA */}
              <div className="mt-12 flex flex-wrap items-center gap-8">
                <div>
                  <p className="text-sm text-white/40">Starting from</p>
                  <p className="text-3xl font-bold text-white">{selectedModel.price}</p>
                </div>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 bg-accent px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
                >
                  Request Quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* In Action */}
      <section className="relative h-[80vh] overflow-hidden">
        <Image
          src="/images/shibuya-action.jpg"
          alt="Shibuya in action"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030508]/90 via-[#030508]/50 to-transparent" />
        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-xl">
              <p className="text-sm font-medium tracking-[0.2em] text-white/40">IN THE FIELD</p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
                Built for Real Work
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/60">
                From high-rise construction to infrastructure projects, Shibuya machines perform flawlessly in the most demanding conditions.
              </p>
              <Link 
                href="/applications" 
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white"
              >
                View Applications
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="bg-[#f8f7f4] py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-3">
            <div>
              <p className="text-sm font-medium tracking-[0.2em] text-navy/40">SUPPORT</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-navy">
                We Stand Behind Every Machine
              </h2>
            </div>
            <div className="lg:col-span-2">
              <div className="grid gap-12 sm:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold text-navy">2-Year Warranty</h3>
                  <p className="mt-2 text-ink-muted">
                    Comprehensive manufacturer warranty with full parts and labor coverage.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy">Local Service Center</h3>
                  <p className="mt-2 text-ink-muted">
                    Dedicated service facility in Kuala Lumpur staffed by factory-trained technicians.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy">Spare Parts Stock</h3>
                  <p className="mt-2 text-ink-muted">
                    Full inventory of genuine Shibuya parts for rapid repairs and maintenance.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy">Operator Training</h3>
                  <p className="mt-2 text-ink-muted">
                    Complimentary training program included with every machine purchase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#030508] py-32">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Experience the Difference
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/50">
            Schedule a demonstration at your site or visit our showroom to see Shibuya performance firsthand.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 bg-white px-8 py-4 text-sm font-semibold text-[#030508] transition-colors hover:bg-white/90"
            >
              Schedule Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 border border-white/20 px-8 py-4 text-sm font-semibold text-white transition-[border-color,background-color] hover:border-white/40 hover:bg-white/5"
            >
              Download Brochure
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  )
}
