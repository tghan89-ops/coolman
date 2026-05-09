import { products } from './products'
import { contractors } from './contractors'

export type OrderStatus = 'Pending' | 'Acknowledged' | 'Fulfilled' | 'Cancelled'

export interface Order {
  id: string
  contractorId: string
  productId: string
  quantity: number
  deliveryAddress: string
  notes: string
  listPricePerUnit: number
  discountPercentage: number
  promoCode: string | null
  promoDiscount: number
  effectivePrice: number
  status: OrderStatus
  submittedAt: string
  acknowledgedAt: string | null
  fulfilledAt: string | null
}

// Promo codes with their discount percentages
export const PROMO_CODES: Record<string, number> = {
  'BULK10': 0.10,
  'NEW5': 0.05,
  'WELCOME15': 0.15,
  'TRADE20': 0.20,
}

export function validatePromoCode(code: string): number | null {
  const normalizedCode = code.toUpperCase().trim()
  return PROMO_CODES[normalizedCode] ?? null
}

// Helper to generate timestamps relative to now
function hoursAgo(hours: number): string {
  const date = new Date()
  date.setHours(date.getHours() - hours)
  return date.toISOString()
}

function daysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

export const orders: Order[] = [
  {
    id: 'ord-001',
    contractorId: 'con-001',
    productId: 'prod-001',
    quantity: 5,
    deliveryAddress: '123 Jalan Industri, Shah Alam, Selangor 40150',
    notes: 'Please deliver before 10am',
    listPricePerUnit: 185.00,
    discountPercentage: 0.10,
    promoCode: null,
    promoDiscount: 0,
    effectivePrice: 832.50, // 5 * 185 * 0.90
    status: 'Pending',
    submittedAt: hoursAgo(2),
    acknowledgedAt: null,
    fulfilledAt: null,
  },
  {
    id: 'ord-002',
    contractorId: 'con-002',
    productId: 'prod-005',
    quantity: 20,
    deliveryAddress: '45 Lorong Perusahaan, Petaling Jaya, Selangor 46000',
    notes: 'Urgent order for ongoing project',
    listPricePerUnit: 85.00,
    discountPercentage: 0.15,
    promoCode: 'BULK10',
    promoDiscount: 0.10,
    effectivePrice: 1275.00, // 20 * 85 * 0.85 * 0.90
    status: 'Acknowledged',
    submittedAt: hoursAgo(8),
    acknowledgedAt: hoursAgo(6),
    fulfilledAt: null,
  },
  {
    id: 'ord-003',
    contractorId: 'con-004',
    productId: 'prod-003',
    quantity: 3,
    deliveryAddress: '200 Jalan Pembinaan, Kuala Lumpur 51200',
    notes: '',
    listPricePerUnit: 320.00,
    discountPercentage: 0.12,
    promoCode: null,
    promoDiscount: 0,
    effectivePrice: 844.80, // 3 * 320 * 0.88
    status: 'Fulfilled',
    submittedAt: daysAgo(3),
    acknowledgedAt: daysAgo(3),
    fulfilledAt: daysAgo(1),
  },
  {
    id: 'ord-004',
    contractorId: 'con-003',
    productId: 'prod-008',
    quantity: 2,
    deliveryAddress: '78 Jalan Pembangunan, Johor Bahru, Johor 81100',
    notes: 'Call before delivery',
    listPricePerUnit: 210.00,
    discountPercentage: 0.05,
    promoCode: 'NEW5',
    promoDiscount: 0.05,
    effectivePrice: 378.00, // 2 * 210 * 0.95 * 0.95
    status: 'Pending',
    submittedAt: hoursAgo(26), // Over 24 hours - urgent!
    acknowledgedAt: null,
    fulfilledAt: null,
  },
  {
    id: 'ord-005',
    contractorId: 'con-006',
    productId: 'prod-006',
    quantity: 10,
    deliveryAddress: '88 Jalan Perusahaan Baru, Klang, Selangor 41000',
    notes: 'Please include invoice',
    listPricePerUnit: 125.00,
    discountPercentage: 0.10,
    promoCode: null,
    promoDiscount: 0,
    effectivePrice: 1125.00, // 10 * 125 * 0.90
    status: 'Acknowledged',
    submittedAt: hoursAgo(12),
    acknowledgedAt: hoursAgo(10),
    fulfilledAt: null,
  },
  {
    id: 'ord-006',
    contractorId: 'con-007',
    productId: 'prod-011',
    quantity: 2,
    deliveryAddress: '25 Jalan Industri, Kuching, Sarawak 93350',
    notes: 'Shipping to East Malaysia',
    listPricePerUnit: 385.00,
    discountPercentage: 0.07,
    promoCode: null,
    promoDiscount: 0,
    effectivePrice: 716.10, // 2 * 385 * 0.93
    status: 'Fulfilled',
    submittedAt: daysAgo(5),
    acknowledgedAt: daysAgo(5),
    fulfilledAt: daysAgo(2),
  },
  {
    id: 'ord-007',
    contractorId: 'con-001',
    productId: 'prod-004',
    quantity: 8,
    deliveryAddress: '123 Jalan Industri, Shah Alam, Selangor 40150',
    notes: '',
    listPricePerUnit: 165.00,
    discountPercentage: 0.10,
    promoCode: 'TRADE20',
    promoDiscount: 0.20,
    effectivePrice: 950.40, // 8 * 165 * 0.90 * 0.80
    status: 'Fulfilled',
    submittedAt: daysAgo(7),
    acknowledgedAt: daysAgo(7),
    fulfilledAt: daysAgo(5),
  },
  {
    id: 'ord-008',
    contractorId: 'con-002',
    productId: 'prod-010',
    quantity: 4,
    deliveryAddress: '45 Lorong Perusahaan, Petaling Jaya, Selangor 46000',
    notes: 'Need for grinding project',
    listPricePerUnit: 155.00,
    discountPercentage: 0.15,
    promoCode: null,
    promoDiscount: 0,
    effectivePrice: 527.00, // 4 * 155 * 0.85
    status: 'Pending',
    submittedAt: hoursAgo(4),
    acknowledgedAt: null,
    fulfilledAt: null,
  },
  {
    id: 'ord-009',
    contractorId: 'con-004',
    productId: 'prod-012',
    quantity: 6,
    deliveryAddress: '200 Jalan Pembinaan, Kuala Lumpur 51200',
    notes: 'Marble cutting project',
    listPricePerUnit: 195.00,
    discountPercentage: 0.12,
    promoCode: null,
    promoDiscount: 0,
    effectivePrice: 1029.60, // 6 * 195 * 0.88
    status: 'Cancelled',
    submittedAt: daysAgo(10),
    acknowledgedAt: daysAgo(10),
    fulfilledAt: null,
  },
  {
    id: 'ord-010',
    contractorId: 'con-006',
    productId: 'prod-007',
    quantity: 12,
    deliveryAddress: '88 Jalan Perusahaan Baru, Klang, Selangor 41000',
    notes: 'Brick work project',
    listPricePerUnit: 135.00,
    discountPercentage: 0.10,
    promoCode: 'BULK10',
    promoDiscount: 0.10,
    effectivePrice: 1312.20, // 12 * 135 * 0.90 * 0.90
    status: 'Fulfilled',
    submittedAt: daysAgo(4),
    acknowledgedAt: daysAgo(4),
    fulfilledAt: daysAgo(1),
  },
]

// Helper functions
export function getOrderById(id: string): Order | undefined {
  return orders.find(o => o.id === id)
}

export function getOrdersByContractor(contractorId: string): Order[] {
  return orders.filter(o => o.contractorId === contractorId)
}

export function getOrdersByStatus(status: OrderStatus): Order[] {
  return orders.filter(o => o.status === status)
}

export function getPendingOrders(): Order[] {
  return orders.filter(o => o.status === 'Pending')
}

export function getUrgentOrders(): Order[] {
  const now = new Date()
  return orders.filter(o => {
    if (o.status !== 'Pending') return false
    const submitted = new Date(o.submittedAt)
    const hoursSinceSubmission = (now.getTime() - submitted.getTime()) / (1000 * 60 * 60)
    return hoursSinceSubmission > 24
  })
}

export function calculateResponseTime(order: Order): number | null {
  if (!order.acknowledgedAt) {
    // If not acknowledged, calculate hours since submission
    const now = new Date()
    const submitted = new Date(order.submittedAt)
    return Math.round((now.getTime() - submitted.getTime()) / (1000 * 60 * 60))
  }
  // If acknowledged, calculate time between submission and acknowledgement
  const submitted = new Date(order.submittedAt)
  const acknowledged = new Date(order.acknowledgedAt)
  return Math.round((acknowledged.getTime() - submitted.getTime()) / (1000 * 60 * 60))
}

// Pricing calculation
export function calculateOrderPrice(
  quantity: number,
  unitPrice: number,
  tierDiscountPct: number,
  promoDiscount: number
): {
  subtotal: number
  tierDiscountAmount: number
  promoDiscountAmount: number
  total: number
} {
  const subtotal = quantity * unitPrice
  const afterTierDiscount = subtotal * (1 - tierDiscountPct)
  const tierDiscountAmount = subtotal - afterTierDiscount
  const total = afterTierDiscount * (1 - promoDiscount)
  const promoDiscountAmount = afterTierDiscount - total

  return {
    subtotal,
    tierDiscountAmount,
    promoDiscountAmount,
    total,
  }
}

// Enriched order with product and contractor details
export interface EnrichedOrder extends Order {
  product: typeof products[0]
  contractor: typeof contractors[0]
  responseTimeHours: number | null
  isUrgent: boolean
}

export function getEnrichedOrders(): EnrichedOrder[] {
  return orders.map(order => {
    const product = products.find(p => p.id === order.productId)!
    const contractor = contractors.find(c => c.id === order.contractorId)!
    const responseTimeHours = calculateResponseTime(order)
    const isUrgent = order.status === 'Pending' && responseTimeHours !== null && responseTimeHours > 24

    return {
      ...order,
      product,
      contractor,
      responseTimeHours,
      isUrgent,
    }
  })
}
