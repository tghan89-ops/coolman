import type { GlobalConfig } from 'payload'

/**
 * Navigation — the editable top menu. Replaces the previously hardcoded nav in
 * components/layout/header.tsx. Order in this array = order in the header
 * (drag-to-reorder in admin).
 *
 * SAFETY (plan-eng-review P1): the header falls back to a built-in default menu
 * if this global is empty or fails to load, so the top menu can never vanish
 * site-wide. This global is read on every page, so the header reads it through a
 * cached loader (lib/navigation/context).
 *
 * Entry types:
 *  - link          → a normal menu item pointing at a Page, an internal route, or an external URL.
 *  - mega-products → the existing category-driven Products mega-menu, kept as a reorderable item.
 *
 * Labels: `label` (EN) is shown by default; `labelBM` is used when the site is in
 * BM and it's set, otherwise it falls back to `label`.
 */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  versions: true,
  admin: {
    group: 'System',
    description:
      'The top navigation menu. Drag items to reorder. Keep it to about 6–7 items so it stays tidy across the bar on laptops — more may crowd or wrap.',
  },
  access: {
    // Public read: the header is rendered for every visitor.
    read: () => true,
    update: ({ req: { user } }) =>
      (user as any)?.collection === 'adminUsers' && (user as any)?.role === 'admin',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Menu items',
      admin: {
        description:
          'Each row is one top-menu entry. ~6–7 recommended. "Products mega-menu" renders the category dropdown.',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'link',
          options: [
            { label: 'Link', value: 'link' },
            { label: 'Products mega-menu', value: 'mega-products' },
          ],
          admin: { width: '40%' },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { width: '60%', description: 'English label shown in the menu.' },
        },
        {
          name: 'labelBM',
          type: 'text',
          admin: { description: 'Bahasa Malaysia label. Leave blank to fall back to English.' },
        },
        {
          name: 'linkType',
          type: 'select',
          defaultValue: 'page',
          options: [
            { label: 'A page (built here)', value: 'page' },
            { label: 'An internal route', value: 'internal' },
            { label: 'An external URL', value: 'external' },
          ],
          admin: {
            condition: (_, sibling) => sibling?.type === 'link',
            description: 'Where this item links to.',
          },
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          admin: {
            condition: (_, sibling) => sibling?.type === 'link' && sibling?.linkType === 'page',
            description: 'Pick a published page.',
          },
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            condition: (_, sibling) =>
              sibling?.type === 'link' && (sibling?.linkType === 'internal' || sibling?.linkType === 'external'),
            description: 'e.g. /products (internal) or https://… (external).',
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            condition: (_, sibling) => sibling?.type === 'link' && sibling?.linkType === 'external',
            description: 'Open in a new browser tab.',
          },
        },
      ],
    },
  ],
}
