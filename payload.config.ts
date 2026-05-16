import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
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
import { SearchLogs } from './collections/SearchLogs'
import { EmailDeliveries } from './collections/EmailDeliveries'
import { CronRuns } from './collections/CronRuns'
import { Media } from './collections/Media'

import { HomePage } from './globals/HomePage'
import { ApplicationsPage } from './globals/ApplicationsPage'
import { ResourcesPage } from './globals/ResourcesPage'
import { ContactPage } from './globals/ContactPage'
import { ShibuyaPage } from './globals/ShibuyaPage'
import { WhyCoolmanPage } from './globals/WhyCoolmanPage'
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
    SearchLogs,
    EmailDeliveries,
    CronRuns,
    Media,
  ],
  globals: [HomePage, ApplicationsPage, ResourcesPage, ContactPage, ShibuyaPage, WhyCoolmanPage, Settings],
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.POSTGRES_URL || '',
    },
    push: true,
  }),
  upload: {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB hard cap on any uploaded file
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
            collections: { media: true },
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
