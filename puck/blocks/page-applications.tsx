/**
 * Bespoke locked PAGE block — Applications page.
 * Pattern: identical to CareerPage in puck/blocks/pages.tsx.
 *
 * Render is pure (no hooks). Interactive client needs (image tags,
 * lucide icons) are isolated in components/puck/ApplicationsSection.tsx
 * which carries 'use client'. The block passes all editable copy as
 * typed props to that component.
 *
 * Settings deps: none — the Applications page has no whatsapp/email links.
 * Two-tier rule: sections link to /products?material={id} (category filter
 * URLs), not to any product card or price. No price/SKU/cart rendered here.
 */
import type { ComponentConfig } from '@puckeditor/core'
import { ApplicationsPageSection } from '@/components/puck/ApplicationsSection'
import type { ApplicationSectionItem } from '@/components/puck/ApplicationsSection'

const LOCKED = { drag: false, duplicate: false, delete: false } as const

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT sections — real copy from COPY.EN.pages.applications.defaultSections
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_SECTIONS: ApplicationSectionItem[] = [
  {
    id: 'concrete',
    title: 'Concrete Cutting',
    description: 'Heavy-duty diamond blades engineered for reinforced concrete, cured slabs, and structural elements.',
    features: ['Reinforced concrete', 'Cured concrete slabs', 'Concrete blocks', 'Precast elements'],
    imageUrl: '',
    linkLabel: 'View Concrete Cutting Blades',
  },
  {
    id: 'granite',
    title: 'Granite & Natural Stone',
    description: 'Precision blades for cutting granite countertops, natural stone, and hard rock materials.',
    features: ['Granite slabs', 'Natural stone', 'Hard rock', 'Quartz surfaces'],
    imageUrl: '',
    linkLabel: 'View Granite & Natural Stone Blades',
  },
  {
    id: 'marble',
    title: 'Marble & Soft Stone',
    description: 'Specialized segments for clean, chip-free cuts in marble, limestone, and soft stone.',
    features: ['Marble slabs', 'Limestone', 'Travertine', 'Soft stone'],
    imageUrl: '',
    linkLabel: 'View Marble & Soft Stone Blades',
  },
  {
    id: 'tile',
    title: 'Tile & Ceramics',
    description: 'Fine-grit diamond blades for precise cuts in porcelain, ceramic tiles, and glass.',
    features: ['Porcelain tiles', 'Ceramic tiles', 'Glass tiles', 'Mosaic work'],
    imageUrl: '',
    linkLabel: 'View Tile & Ceramics Blades',
  },
  {
    id: 'asphalt',
    title: 'Asphalt Cutting',
    description: 'Durable blades designed for roadwork, asphalt overlays, and pavement cutting.',
    features: ['Road repairs', 'Pavement cutting', 'Asphalt overlays', 'Utility trenching'],
    imageUrl: '',
    linkLabel: 'View Asphalt Cutting Blades',
  },
  {
    id: 'brick',
    title: 'Brick & Masonry',
    description: 'All-purpose blades for cutting brick, block, and general masonry materials.',
    features: ['Clay brick', 'Concrete blocks', 'Pavers', 'Masonry walls'],
    imageUrl: '',
    linkLabel: 'View Brick & Masonry Blades',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATIONS PAGE BLOCK
// ─────────────────────────────────────────────────────────────────────────────
export const ApplicationsPage: ComponentConfig = {
  label: 'Page · Applications',
  permissions: LOCKED,
  fields: {
    eyebrow: { type: 'text', label: 'Hero eyebrow', contentEditable: true },
    heroTitle: { type: 'text', label: 'Hero title', contentEditable: true },
    heroSubtitle: { type: 'textarea', label: 'Hero subtitle', contentEditable: true },
    sections: {
      type: 'array',
      label: 'Application sections',
      arrayFields: {
        id: { type: 'text', label: 'Material ID (used in /products?material= URL)' },
        title: { type: 'text', label: 'Section title', contentEditable: true },
        description: { type: 'textarea', label: 'Section description', contentEditable: true },
        features: {
          type: 'array',
          label: 'Feature bullets',
          arrayFields: {
            text: { type: 'text', label: 'Feature', contentEditable: true },
          },
          defaultItemProps: { text: 'Feature' },
        },
        imageUrl: { type: 'text', label: 'Image URL (leave blank for placeholder)' },
        linkLabel: { type: 'text', label: 'CTA button label', contentEditable: true },
      },
      defaultItemProps: {
        id: 'concrete',
        title: 'Concrete Cutting',
        description: 'Heavy-duty diamond blades engineered for reinforced concrete, cured slabs, and structural elements.',
        features: [
          { text: 'Reinforced concrete' },
          { text: 'Cured concrete slabs' },
          { text: 'Concrete blocks' },
          { text: 'Precast elements' },
        ],
        imageUrl: '',
        linkLabel: 'View Concrete Cutting Blades',
      },
    },
    ctaTitle: { type: 'text', label: 'CTA heading', contentEditable: true },
    ctaMessage: { type: 'textarea', label: 'CTA message', contentEditable: true },
    ctaButton: { type: 'text', label: 'CTA button label', contentEditable: true },
    ctaHref: { type: 'text', label: 'CTA button href' },
  },
  defaultProps: {
    eyebrow: 'Applications',
    heroTitle: 'Solutions for Every Material',
    heroSubtitle:
      'Our comprehensive range of diamond cutting tools is engineered to deliver optimal performance across all common construction materials.',
    sections: DEFAULT_SECTIONS.map((s) => ({
      ...s,
      features: s.features.map((f) => ({ text: f })),
    })),
    ctaTitle: 'Need Help Selecting the Right Blade?',
    ctaMessage:
      'Our technical team can help you choose the optimal blade for your specific application and cutting conditions.',
    ctaButton: 'Contact Technical Support',
    ctaHref: '/contact',
  },
  render: ({ eyebrow, heroTitle, heroSubtitle, sections, ctaTitle, ctaMessage, ctaButton, ctaHref }) => {
    // Normalise sections: the Puck array stores features as {text: string}[]
    // to allow per-item contentEditable; we flatten back to string[] for the
    // client component.
    const normalisedSections: ApplicationSectionItem[] = (
      (sections as Array<{
        id: string
        title: string
        description: string
        features: Array<{ text: string } | string>
        imageUrl?: string
        linkLabel: string
      }>) || []
    ).map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      features: (s.features || []).map((f) => (typeof f === 'string' ? f : f.text)),
      imageUrl: s.imageUrl || '',
      linkLabel: s.linkLabel,
    }))

    return (
      <ApplicationsPageSection
        c={{
          eyebrow,
          heroTitle,
          heroSubtitle,
          sections: normalisedSections,
          ctaTitle,
          ctaMessage,
          ctaButton,
          ctaHref,
        }}
      />
    )
  },
}
