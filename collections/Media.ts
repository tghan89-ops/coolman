import type { CollectionConfig } from 'payload'

// Photo/image uploads only. Anything outside this list is rejected before it ever
// touches blob storage — keeps the upload surface from being used to host arbitrary files.
// JPEG/PNG/WebP only. SVG is excluded because it can carry embedded <script>
// (stored XSS in admin previews and public pages). GIF is excluded because it
// isn't part of the product photography brief and sharp won't generate the
// responsive variants we ship to cards.
const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ALLOWED_IMAGE_MIME_TYPES,
    // Cap the master image at 2000px on the long edge. Payload pipes uploads
    // through sharp, so this happens before the blob hits storage — phone
    // uploads at 4000+px get scaled down to a sane web size. Smaller images
    // are left untouched (`withoutEnlargement: true`).
    // The auto-resize is the user-facing "size limit" — we deliberately do not
    // reject oversized originals. The global 25 MB cap in payload.config.ts is
    // the abuse stop; everything under that gets shrunk in-place by sharp.
    resizeOptions: {
      width: 2000,
      height: 2000,
      fit: 'inside',
      withoutEnlargement: true,
    },
    // Pre-baked responsive variants so the front-end can pick a small thumb
    // for cards instead of always downloading the master.
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 400, fit: 'inside', withoutEnlargement: true },
      { name: 'card', width: 800, height: 800, fit: 'inside', withoutEnlargement: true },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
