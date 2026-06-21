import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Allow the dev server's internal /_next assets + HMR when opened by LAN IP
  // (GH previews from his phone). Without this, Next 16 returns 403 on fonts and
  // the HMR websocket over a non-localhost origin. Dev-only; no prod effect.
  allowedDevOrigins: ['192.168.0.102', '100.124.99.65'],
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
