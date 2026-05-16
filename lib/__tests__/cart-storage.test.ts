import { describe, expect, it, beforeEach } from 'vitest'
import { readLocalCart, writeLocalCart, clearLocalCart, mergeLocalIntoServer } from '../cart/storage'
import { LOCAL_STORAGE_KEY } from '../cart/types'

beforeEach(() => {
  const store: Record<string, string> = {}
  ;(global as any).window = {
    localStorage: {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => { store[k] = v },
      removeItem: (k: string) => { delete store[k] },
    },
  }
})

describe('cart storage', () => {
  it('returns [] when nothing stored', () => {
    expect(readLocalCart()).toEqual([])
  })

  it('round-trips a cart', () => {
    writeLocalCart([{ productId: '1', quantity: 2 }])
    expect(readLocalCart()).toEqual([{ productId: '1', quantity: 2 }])
  })

  it('drops malformed entries', () => {
    ;(global as any).window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify([{ productId: '1', quantity: 2 }, { bad: 'row' }, null, { productId: 5, quantity: 1 }]),
    )
    expect(readLocalCart()).toEqual([{ productId: '1', quantity: 2 }])
  })

  it('floors fractional quantities', () => {
    writeLocalCart([{ productId: '1', quantity: 2.7 }])
    expect(readLocalCart()).toEqual([{ productId: '1', quantity: 2 }])
  })

  it('clear empties storage', () => {
    writeLocalCart([{ productId: '1', quantity: 2 }])
    clearLocalCart()
    expect(readLocalCart()).toEqual([])
  })
})

describe('mergeLocalIntoServer', () => {
  it('returns server-only when local empty', () => {
    expect(mergeLocalIntoServer([], [{ productId: '1', quantity: 3 }]))
      .toEqual([{ productId: '1', quantity: 3 }])
  })

  it('returns local-only when server empty', () => {
    expect(mergeLocalIntoServer([{ productId: '1', quantity: 2 }], []))
      .toEqual([{ productId: '1', quantity: 2 }])
  })

  it('sums quantities on the same product', () => {
    const out = mergeLocalIntoServer(
      [{ productId: '1', quantity: 2 }],
      [{ productId: '1', quantity: 3 }],
    )
    expect(out).toEqual([{ productId: '1', quantity: 5 }])
  })

  it('keeps distinct products separate', () => {
    const out = mergeLocalIntoServer(
      [{ productId: '1', quantity: 2 }, { productId: '2', quantity: 1 }],
      [{ productId: '2', quantity: 3 }, { productId: '3', quantity: 1 }],
    )
    expect(out.sort((a, b) => a.productId.localeCompare(b.productId))).toEqual([
      { productId: '1', quantity: 2 },
      { productId: '2', quantity: 4 },
      { productId: '3', quantity: 1 },
    ])
  })
})
