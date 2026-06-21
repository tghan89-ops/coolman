import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { templateOptions, templates, isPuckDataEmpty, type TemplateValue } from '@/puck/templates'

/**
 * Pages — visual (Puck) marketing pages. Two-tier model: this is the FREE-FORM
 * tier. The catalogue (products/families/filters/prices) stays structured and is
 * NOT editable here. No price/product block is ever exposed in Puck (CLAUDE.md).
 *
 * `puckData` holds the Puck `Data` JSON blob; content lives in our own Postgres,
 * versioned by Payload. Pages are English-only in v1 (nav labels carry optional BM).
 *
 * Hooks enforce two design decisions:
 *  - Template-first: on create, an empty page is seeded from the chosen template.
 *  - Empty-publish guard: a page with no content blocks cannot be published, so a
 *    visitor never lands on a blank screen. Malformed-block safety is handled at
 *    render time (the catch-all route skips bad blocks).
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    description:
      'Visual drag-and-drop marketing pages built with the page editor. Drafts are admin-only; only "Published" pages appear on the public site at /<slug>. Catalogue pages are NOT edited here.',
  },
  versions: {
    drafts: false, // status field is the publish gate; versions give rollback history
    maxPerDoc: 50,
  },
  access: {
    // Public read filtered to published at the query layer (lib/payload.ts), so
    // drafts remain fetchable in admin / preview but never on the public site.
    read: () => true,
    create: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
    update: ({ req: { user } }) => (user as any)?.collection === 'adminUsers',
    delete: ({ req: { user } }) =>
      (user as any)?.collection === 'adminUsers' && (user as any)?.role === 'admin',
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (!data) return data
        // Template-first seeding: on create, seed puckData from the chosen
        // template when the editor hasn't drawn anything yet.
        if (operation === 'create' && isPuckDataEmpty(data.puckData)) {
          const tpl = (data.template as TemplateValue) || 'simple'
          data.puckData = templates[tpl] ?? templates.simple
        }
        return data
      },
    ],
    beforeChange: [
      ({ data }) => {
        // Empty-publish guard: never let a content-less page go live.
        if (data?.status === 'published' && isPuckDataEmpty(data.puckData)) {
          throw new APIError(
            'This page has no content yet. Add at least one block before publishing.',
            400,
          )
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Internal/admin title and default <title> for the page.' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL path after the domain, e.g. "promo-2026" → /promo-2026. Lowercase, hyphens.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Only "Published" pages appear on the public site.',
      },
    },
    {
      name: 'template',
      type: 'select',
      defaultValue: 'simple',
      options: templateOptions,
      admin: {
        position: 'sidebar',
        description:
          'Starting layout (applied once, when the page is first created). Editing afterwards is free-form.',
      },
    },
    {
      name: 'openEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/OpenPuckEditor#OpenPuckEditor',
        },
      },
    },
    {
      name: 'puckData',
      type: 'json',
      admin: {
        description:
          'Visual page layout (managed by the visual editor). Edit via "Open visual editor", not by hand.',
        readOnly: true,
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: { description: 'Optional override for <title>. Falls back to the page title.' },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: { description: 'Meta description for search engines / social previews.' },
        },
      ],
    },
  ],
}
