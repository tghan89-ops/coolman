'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '@/lib/auth/context'
import { EMPTY_CART, type CartState, type CartItemInput, type CartItemDetail } from './types'
import { clearLocalCart, readLocalCart, writeLocalCart } from './storage'

interface CartContextValue {
  state: CartState
  isLoading: boolean
  add(productId: string, quantity: number): Promise<void>
  setLineQuantity(productId: string, quantity: number): Promise<void>
  removeLine(productId: string): Promise<void>
  refresh(): Promise<void>
  lineCount: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const [state, setState] = useState<CartState>(EMPTY_CART)
  const [isLoading, setIsLoading] = useState(false)
  const lastUserIdRef = useRef<string | number | null>(null)

  const persistToLocal = useCallback((items: CartItemInput[]) => {
    writeLocalCart(items)
  }, [])

  const loadFromServer = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/cart', { credentials: 'include' })
      if (!res.ok) throw new Error('load failed')
      const data = await res.json()
      setState({
        items: data.items ?? [],
        tierDiscountPct: data.tierDiscountPct ?? 0,
        subtotalList: data.subtotalList ?? 0,
        subtotalEffective: data.subtotalEffective ?? 0,
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const hydrateAnonymous = useCallback(() => {
    const local = readLocalCart()
    setState({
      items: local.map<CartItemDetail>((it) => ({
        productId: it.productId,
        quantity: it.quantity,
        name: '',
        sku: '',
        imageUrl: null,
        listPrice: 0,
        addedAt: new Date().toISOString(),
      })),
      tierDiscountPct: 0,
      subtotalList: 0,
      subtotalEffective: 0,
    })
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      hydrateAnonymous()
      lastUserIdRef.current = null
      return
    }
    const userId = (user as any)?.id ?? null
    if (lastUserIdRef.current === userId) return
    lastUserIdRef.current = userId
    ;(async () => {
      const local = readLocalCart()
      if (local.length > 0) {
        try {
          await fetch('/api/cart/sync', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: local }),
          })
          clearLocalCart()
        } catch {
          /* keep local for next try */
        }
      }
      await loadFromServer()
    })()
  }, [isAuthenticated, user, loadFromServer, hydrateAnonymous])

  const writeServer = useCallback(async (items: CartItemInput[]) => {
    const res = await fetch('/api/cart', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
    if (!res.ok) throw new Error('cart write failed')
    const data = await res.json()
    setState({
      items: data.items ?? [],
      tierDiscountPct: data.tierDiscountPct ?? 0,
      subtotalList: data.subtotalList ?? 0,
      subtotalEffective: data.subtotalEffective ?? 0,
    })
  }, [])

  const add = useCallback(
    async (productId: string, quantity: number) => {
      setIsLoading(true)
      try {
        if (isAuthenticated) {
          const current = state.items.map((it) => ({ productId: it.productId, quantity: it.quantity }))
          const existing = current.find((it) => it.productId === productId)
          const next = existing
            ? current.map((it) =>
                it.productId === productId ? { ...it, quantity: it.quantity + quantity } : it,
              )
            : [...current, { productId, quantity }]
          await writeServer(next)
        } else {
          const current = readLocalCart()
          const existing = current.find((it) => it.productId === productId)
          const next = existing
            ? current.map((it) =>
                it.productId === productId ? { ...it, quantity: it.quantity + quantity } : it,
              )
            : [...current, { productId, quantity }]
          persistToLocal(next)
          hydrateAnonymous()
        }
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, state.items, writeServer, persistToLocal, hydrateAnonymous],
  )

  const setLineQuantity = useCallback(
    async (productId: string, quantity: number) => {
      const qty = Math.max(1, Math.floor(quantity))
      if (isAuthenticated) {
        const next = state.items.map((it) =>
          it.productId === productId
            ? { productId: it.productId, quantity: qty }
            : { productId: it.productId, quantity: it.quantity },
        )
        await writeServer(next)
      } else {
        const current = readLocalCart()
        const next = current.map((it) => (it.productId === productId ? { ...it, quantity: qty } : it))
        persistToLocal(next)
        hydrateAnonymous()
      }
    },
    [isAuthenticated, state.items, writeServer, persistToLocal, hydrateAnonymous],
  )

  const removeLine = useCallback(
    async (productId: string) => {
      if (isAuthenticated) {
        const next = state.items
          .filter((it) => it.productId !== productId)
          .map((it) => ({ productId: it.productId, quantity: it.quantity }))
        await writeServer(next)
      } else {
        const current = readLocalCart()
        persistToLocal(current.filter((it) => it.productId !== productId))
        hydrateAnonymous()
      }
    },
    [isAuthenticated, state.items, writeServer, persistToLocal, hydrateAnonymous],
  )

  const value = useMemo<CartContextValue>(
    () => ({
      state,
      isLoading,
      add,
      setLineQuantity,
      removeLine,
      refresh: loadFromServer,
      lineCount: state.items.length,
    }),
    [state, isLoading, add, setLineQuantity, removeLine, loadFromServer],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
