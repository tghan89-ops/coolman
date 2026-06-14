import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp'

import { AdminUsers } from './collections/AdminUsers'
import { Contractors } from './collections/Contractors'
import { Materials } from './collections/Materials'
import { Applications } from './collections/Applications'
import { Categories } from './collections/Categories'
import { MachineTiers } from './collections/MachineTiers'
import { Products } from './collections/Products'
import { PromoCodes } from './collections/PromoCodes'
import { Orders } from './collections/Orders'
import { Carts } from './collections/Carts'
import { Addresses } from './collections/Addresses'
import { SearchLogs } from './collections/SearchLogs'
import { EmailDeliveries } from './collections/EmailDeliveries'
import { CronRuns } from './collections/CronRuns'
import { LoginAttempts } from './collections/LoginAttempts'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { ShibuyaMachines } from './collections/ShibuyaMachines'
import { Dealers } from './collections/Dealers'

import { HomePage } from './globals/HomePage'
import { ApplicationsPage } from './globals/ApplicationsPage'
import { ResourcesPage } from './globals/ResourcesPage'
import { ContactPage } from './globals/ContactPage'
import { ShibuyaPage } from './globals/ShibuyaPage'
import { WhyCoolmanPage } from './globals/WhyCoolmanPage'
import { HeritagePage } from './globals/HeritagePage'
import { Settings } from './globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  cookiePrefix: 'coolman',
  // Only accept authenticated mutations originating from our own site.
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'].filter(Boolean),
  admin: {
    user: AdminUsers.slug,
    components: {
      // beforeDashboard: ['@/components/admin/DashboardWidgets#default'], // temporarily disabled to isolate 500 error
      beforeDashboard: ['@/components/admin/KillSwitchToggle#default'],
      // Sidebar link added at the top of the nav so admins can jump straight
      // into the search-analytics view (custom route below).
      beforeNavLinks: [
        '@/components/admin/SearchAnalyticsNavLink#default',
        '@/components/admin/AdminLoginRedirect#default',
      ],
      views: {
        searchAnalytics: {
          Component: '@/components/admin/SearchAnalyticsView#default',
          path: '/search-analytics',
        },
      },
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1280, height: 900 },
      ],
    },
  },
  collections: [
    AdminUsers,
    Contractors,
    Materials,
    Applications,
    Categories,
    MachineTiers,
    Products,
    PromoCodes,
    Orders,
    Carts,
    Addresses,
    SearchLogs,
    EmailDeliveries,
    CronRuns,
    LoginAttempts,
    Media,
    Posts,
    ShibuyaMachines,
    Dealers,
  ],
  globals: [HomePage, ApplicationsPage, ResourcesPage, ContactPage, ShibuyaPage, WhyCoolmanPage, HeritagePage, Settings],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.POSTGRES_URL || '',
    },
    push: false,
  }),
  upload: {
    limits: {
      // Generous outer cap so the friendly 5 MB rule in collections/Media.ts
      // gets to throw a readable error ("Image is too large (X.X MB)…") instead
      // of busboy aborting the stream with a generic failure. Anything beyond
      // this is exceedingly rare and still gets refused, just less prettily.
      fileSize: 25 * 1024 * 1024,
    },
  },
  editor: lexicalEditor({}),
  // Pass sharp explicitly so Media's resizeOptions/imageSizes actually run.
  // Without this, Payload logs "sharp not installed" and ships originals as-is.
  sharp,
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            // `disablePayloadAccessControl` makes image URLs point straight at
            // the Vercel Blob CDN (e.g. *.public.blob.vercel-storage.com)
            // instead of being proxied through Payload's `/api/media/file/`
            // route. That route runs as a serverless function in iad1 (US
            // East); the Blob CDN is globally edge-distributed (sin1/Singapore
            // for our Malaysian users), so photos load far faster and skip the
            // serverless hop entirely. Media is public-read, so there is no
            // access control to lose. Burned 2026-05-30 (slow catalogue photos).
            collections: { media: { disablePayloadAccessControl: true } },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000',
})
