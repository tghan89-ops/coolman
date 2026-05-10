import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { AdminUsers } from './collections/AdminUsers'
import { Contractors } from './collections/Contractors'
import { Materials } from './collections/Materials'
import { Applications } from './collections/Applications'
import { Categories } from './collections/Categories'
import { MachineTiers } from './collections/MachineTiers'
import { Products } from './collections/Products'
import { PromoCodes } from './collections/PromoCodes'
import { Orders } from './collections/Orders'
import { SearchLogs } from './collections/SearchLogs'
import { EmailDeliveries } from './collections/EmailDeliveries'
import { CronRuns } from './collections/CronRuns'
import { Media } from './collections/Media'

import { HomePage } from './globals/HomePage'
import { ApplicationsPage } from './globals/ApplicationsPage'
import { ResourcesPage } from './globals/ResourcesPage'
import { ContactPage } from './globals/ContactPage'
import { ShibuyaPage } from './globals/ShibuyaPage'
import { Settings } from './globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  cookiePrefix: 'coolman',
  admin: {
    user: AdminUsers.slug,
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
    SearchLogs,
    EmailDeliveries,
    CronRuns,
    Media,
  ],
  globals: [HomePage, ApplicationsPage, ResourcesPage, ContactPage, ShibuyaPage, Settings],
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    push: false,
  }),
  editor: lexicalEditor({}),
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
