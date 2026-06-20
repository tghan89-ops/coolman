import type { Metadata } from 'next'
import { CareerClient } from '@/components/pages/CareerClient'

export const metadata: Metadata = {
  title: 'Careers · Coolman Diamond Tools Malaysia',
  description:
    'Work at Coolman — diamond tools for Malaysian contractors since 2007. Technical sales, workshop & dispatch, and engineering-desk roles in Selangor.',
}

export default function CareerPage() {
  return <CareerClient />
}
