export interface CartItemInput {
  productId: string
  quantity: number
}

export interface CartItemDetail extends CartItemInput {
  name: string
  sku: string
  imageUrl: string | null
  listPrice: number
  addedAt: string
}

export interface CartState {
  items: CartItemDetail[]
  tierDiscountPct: number
  subtotalList: number
  subtotalEffective: number
}

export const EMPTY_CART: CartState = {
  items: [],
  tierDiscountPct: 0,
  subtotalList: 0,
  subtotalEffective: 0,
}

export const LOCAL_STORAGE_KEY = 'coolman_cart_v1'
