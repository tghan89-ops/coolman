import { LOCAL_STORAGE_KEY, type CartItemInput } from './types'

export function readLocalCart(): CartItemInput[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(
        (it): it is CartItemInput =>
          it &&
          typeof it === 'object' &&
          typeof it.productId === 'string' &&
          typeof it.quantity === 'number' &&
          it.quantity >= 1,
      )
      .map((it) => ({ productId: it.productId, quantity: Math.floor(it.quantity) }))
  } catch {
    return []
  }
}

export function writeLocalCart(items: CartItemInput[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* ignore quota errors */
  }
}

export function clearLocalCart(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function mergeLocalIntoServer(
  local: CartItemInput[],
  server: CartItemInput[],
): CartItemInput[] {
  const map = new Map<string, number>()
  for (const it of server) {
    map.set(it.productId, (map.get(it.productId) ?? 0) + Math.max(1, Math.floor(it.quantity)))
  }
  for (const it of local) {
    map.set(it.productId, (map.get(it.productId) ?? 0) + Math.max(1, Math.floor(it.quantity)))
  }
  return Array.from(map.entries()).map(([productId, quantity]) => ({ productId, quantity }))
}
