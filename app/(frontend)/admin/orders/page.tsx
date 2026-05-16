// Retired: order management now lives inside the real Payload admin at
// /admin/collections/orders (with the dashboard widgets and one-tap
// Acknowledge). This stub keeps the old URL working by redirecting there.
import { redirect } from 'next/navigation'

export default function LegacyAdminOrders() {
  redirect('/admin/collections/orders')
}
