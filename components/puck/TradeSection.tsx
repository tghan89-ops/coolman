'use client'

/**
 * CTA buttons for the Trade page locked Puck block.
 * Extracts the interactive part (WhatsApp pre-filled link + contact link)
 * from TradeClient so the parent block render can stay pure / server-safe.
 * Props are the editable copy strings injected from Puck fields.
 */

import { ArrowRight, MessageCircle } from 'lucide-react'

export type TradeSectionCopy = {
  ctaLabel: string
  contactLabel: string
  whatsappNumber: string
}

export function TradeSection({ ctaLabel, contactLabel, whatsappNumber }: TradeSectionCopy) {
  const waDigits = (whatsappNumber || '').replace(/[^\d]/g, '')
  const waPrefilled = encodeURIComponent(ctaLabel)
  const waHref =
    waDigits.length >= 8
      ? `https://wa.me/${waDigits}?text=${waPrefilled}`
      : '#'

  return (
    <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-accent px-6 text-sm font-medium text-paper transition-colors duration-150 ease-out hover:bg-accent-light"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        {ctaLabel}
      </a>
      <a
        href="/contact"
        className="inline-flex min-h-[48px] items-center gap-2 text-sm font-medium text-navy transition-colors duration-150 ease-out hover:text-accent"
      >
        {contactLabel}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  )
}
