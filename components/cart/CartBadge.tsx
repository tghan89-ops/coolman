'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart/context'
import { useAuth } from '@/lib/auth/context'

export function CartBadge() {
  const { lineCount } = useCart()
  const { isAdmin } = useAuth()
  if (isAdmin) return null
  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${lineCount} item${lineCount === 1 ? '' : 's'}`}
      className="relative flex h-11 w-11 items-center justify-center rounded-md text-white/80 transition-colors hover:bg-white/10 hover:text-white"
    >
      <ShoppingCart className="h-5 w-5" />
      {lineCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1 font-mono text-[10px] font-bold leading-none text-white">
          {lineCount}
        </span>
      )}
    </Link>
  )
}
