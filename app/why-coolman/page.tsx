"use client"

import Link from 'next/link'
import { ArrowRight, Zap, Shield, Clock, Users, Award, Truck, Headphones, BarChart3 } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'

const advantages = [
  {
    icon: Zap,
    title: 'Superior Cutting Performance',
    description: 'Our diamond segments are formulated for 40% faster cutting speeds while maintaining precision. Less time cutting means more projects completed.'
  },
  {
    icon: Shield,
    title: 'Extended Blade Life',
    description: 'Proprietary bonding technology and premium diamond crystals deliver up to 3x longer operational life compared to standard blades.'
  },
  {
    icon: Award,
    title: '25+ Years of Excellence',
    description: 'Since 1998, we have been engineering cutting solutions for Malaysian contractors. Our expertise is built into every blade we produce.'
  },
  {
    icon: Truck,
    title: 'Rapid Fulfillment',
    description: 'Same-day dispatch for orders placed before 2pm. Our logistics network ensures fast delivery across Peninsular Malaysia.'
  },
  {
    icon: Headphones,
    title: 'Technical Partnership',
    description: 'Dedicated engineering support to help you select the right tools, optimize cutting parameters, and solve technical challenges.'
  },
  {
    icon: BarChart3,
    title: 'B2B Pricing Advantage',
    description: 'Registered contractors enjoy exclusive pricing tiers based on volume, with additional discounts on bulk orders.'
  },
]

const stats = [
  { value: '500+', label: 'Active Contractors' },
  { value: '50,000+', label: 'Projects Completed' },
  { value: '99.2%', label: 'On-Time Delivery' },
  { value: '4.9/5', label: 'Customer Rating' },
]

const testimonials = [
  {
    quote: "Coolman blades consistently outperform other brands we have tried. The cutting speed and blade life are exceptional.",
    author: "Ahmad Razak",
    role: "Director, ABC Construction",
  },
  {
    quote: "Their technical support team helped us select the right blade for a challenging granite project. The results exceeded expectations.",
    author: "Lee Wei Ming",
    role: "Senior Engineer, XYZ Contractors",
  },
  {
    quote: "Fast delivery and consistent quality. Coolman has been our trusted supplier for over 10 years.",
    author: "Siti Aminah",
    role: "Procurement Manager, DEF Builders",
  },
]

export default function WhyCoolmanPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-[#0a1628] pb-16 pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#3b82f6]">Why Coolman</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white lg:text-5xl">
              The Coolman Advantage
            </h1>
            <p className="mt-6 text-lg text-white/60">
              More than just tools - we provide complete cutting solutions and ongoing partnership 
              for contractors who demand excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Advantages Grid */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {advantages.map((advantage, index) => (
              <div 
                key={index}
                className="hover-card group rounded-2xl border border-[#e2e8f0] bg-white p-8"
              >
                <div className="inline-flex rounded-xl bg-[#3b82f6]/10 p-3 transition-colors group-hover:bg-[#3b82f6]">
                  <advantage.icon className="h-6 w-6 text-[#3b82f6] transition-colors group-hover:text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-[#0a1628]">{advantage.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#64748b]">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#0a1628] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Trusted by Professionals</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Our track record speaks for itself. Join hundreds of contractors who rely on Coolman.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-[#3b82f6] lg:text-5xl">{stat.value}</div>
                <div className="mt-2 text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#f8fafc] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#3b82f6]">Testimonials</p>
            <h2 className="mt-3 text-3xl font-bold text-[#0a1628]">What Our Partners Say</h2>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="rounded-2xl bg-white p-8 shadow-sm">
                <p className="text-[#475569]">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="mt-6">
                  <p className="font-semibold text-[#0a1628]">{testimonial.author}</p>
                  <p className="text-sm text-[#64748b]">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-[#0a1628]">Ready to Experience the Difference?</h2>
          <p className="mx-auto mt-4 max-w-xl text-[#64748b]">
            Join 500+ professional contractors who trust Coolman for their diamond cutting needs.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button 
              size="lg"
              className="h-14 rounded-xl bg-[#3b82f6] px-8 text-white hover:bg-[#2563eb]"
              asChild
            >
              <Link href="/auth/register">
                Become a Partner
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="h-14 rounded-xl border-[#e2e8f0] px-8"
              asChild
            >
              <Link href="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
