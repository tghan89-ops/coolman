'use client'
// Redirects the bare /admin dashboard to /admin/collections/orders so Alan
// lands directly on the orders list after logging in.
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminLoginRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/admin') {
      router.replace('/admin/collections/orders')
    }
  }, [pathname, router])

  return null
}
