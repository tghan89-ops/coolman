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

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // 5 MB

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
  hooks: {
    // Second line of defence behind the global busboy fileSize limit — gives a
    // clean validation error instead of a stream abort, and survives any future
    // change to the global config.
    beforeValidate: [
      ({ req }) => {
        const file = (req as any).file
        if (file && typeof file.size === 'number' && file.size > MAX_UPLOAD_BYTES) {
          throw new Error(
            `Image is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed is 5 MB.`,
          )
        }
      },
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
