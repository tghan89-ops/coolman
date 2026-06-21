/**
 * Whole-page starter layouts for the Puck visual editor.
 *
 * Design decision (plan-design-review Pass 3): creating a page ALWAYS starts
 * from one of these templates so an editor never faces a blank canvas. "Blank"
 * is offered as one explicit choice, not the default.
 *
 * Each value is a Puck `Data` object: { root, content[], zones }. The component
 * names here MUST match keys registered in puck/config.tsx. Keep these minimal
 * and on-brand; richer presets live in puck/sections.ts (insertable sections).
 *
 * Type-only import of `Data` — no runtime dependency on the Puck client bundle
 * from this server-importable module.
 */
import type { Data } from '@puckeditor/core'

export const TEMPLATE_VALUES = ['landing', 'simple', 'campaign', 'blank'] as const
export type TemplateValue = (typeof TEMPLATE_VALUES)[number]

/** Options for the Pages.template select field (admin UI). */
export const templateOptions: { label: string; value: TemplateValue }[] = [
  { label: 'Landing page', value: 'landing' },
  { label: 'Simple content page', value: 'simple' },
  { label: 'Campaign page', value: 'campaign' },
  { label: 'Blank (build from scratch)', value: 'blank' },
]

const emptyRoot = { props: {} }

export const templates: Record<TemplateValue, Data> = {
  blank: {
    root: emptyRoot,
    content: [],
    zones: {},
  },
  simple: {
    root: emptyRoot,
    content: [
      { type: 'Heading', props: { id: 'tpl-simple-h', text: 'Page title', size: 'xl' } },
      {
        type: 'Text',
        props: {
          id: 'tpl-simple-t',
          text: 'Introduce this page in a sentence or two. Replace this copy.',
          size: 'md',
        },
      },
    ],
    zones: {},
  },
  landing: {
    root: emptyRoot,
    content: [
      { type: 'Hero', props: { id: 'tpl-landing-hero', heading: 'Headline goes here', sub: 'One supporting sentence.', ctaLabel: 'Get in touch', ctaHref: '/contact', surface: 'navy' } },
      { type: 'ImageText', props: { id: 'tpl-landing-it', heading: 'What we do', body: 'A paragraph that sits beside an image. Replace this copy.', ctaLabel: '', ctaHref: '/contact', imageSide: 'left', surface: 'none' } },
      { type: 'Steps', props: { id: 'tpl-landing-steps' } },
      { type: 'CTABanner', props: { id: 'tpl-landing-cta', heading: 'Ready to start?', ctaLabel: 'Contact us', ctaHref: '/contact' } },
    ],
    zones: {},
  },
  campaign: {
    root: emptyRoot,
    content: [
      { type: 'Hero', props: { id: 'tpl-campaign-hero', heading: 'Campaign headline', sub: 'What this campaign offers.', ctaLabel: 'Learn more', ctaHref: '/contact', surface: 'navy' } },
      { type: 'Stats', props: { id: 'tpl-campaign-stats' } },
      { type: 'Accordion', props: { id: 'tpl-campaign-faq' } },
      { type: 'CTABanner', props: { id: 'tpl-campaign-cta', heading: 'Take the next step', ctaLabel: 'Contact us', ctaHref: '/contact' } },
    ],
    zones: {},
  },
}

/** True when a Puck Data object has no renderable content (used by the empty-publish guard). */
export function isPuckDataEmpty(data: unknown): boolean {
  if (!data || typeof data !== 'object') return true
  const content = (data as Partial<Data>).content
  return !Array.isArray(content) || content.length === 0
}
