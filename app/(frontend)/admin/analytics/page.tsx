// Retired: the analytics mockup is superseded by the dashboard widgets on the
// real Payload admin home (/admin) and the Excel exports. Redirect there.
import { redirect } from 'next/navigation'

export default function LegacyAdminAnalytics() {
  redirect('/admin')
}
