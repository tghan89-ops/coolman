import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  // Legacy /resources/[slug] post URLs now live under /field-notes/[slug].
  // 308 permanent so search engines and any inbound links migrate cleanly.
  async redirects() {
    return [
      {
        source: '/resources/:slug',
        destination: '/field-notes/:slug',
        permanent: true,
      },
    ]
  },
}

export default withPayload(nextConfig)
