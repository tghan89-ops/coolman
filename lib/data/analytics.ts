export interface MaterialSearchData {
  material: string
  searches: number
}

export interface ApplicationSearchData {
  application: string
  searches: number
}

export interface ProductAnalytics {
  productId: string
  productName: string
  views: number
  orders: number
}

export interface ContractorActivity {
  contractorId: string
  contractorName: string
  companyName: string
  lastOrderDate: string | null
  totalOrders: number
  status: 'Active' | 'Gone Quiet'
}

// Mock analytics data
export const materialSearches: MaterialSearchData[] = [
  { material: 'Granite', searches: 245 },
  { material: 'Concrete', searches: 198 },
  { material: 'Tile', searches: 167 },
  { material: 'Marble', searches: 134 },
  { material: 'Brick', searches: 112 },
  { material: 'Asphalt', searches: 89 },
  { material: 'Sandstone', searches: 56 },
  { material: 'Homogeneous Tile', searches: 45 },
]

export const applicationSearches: ApplicationSearchData[] = [
  { application: 'Floor Cutting', searches: 312 },
  { application: 'Wall Cutting', searches: 198 },
  { application: 'Coring', searches: 145 },
  { application: 'Grinding', searches: 87 },
]

export const productAnalytics: ProductAnalytics[] = [
  { productId: 'prod-001', productName: 'Granite Pro 230', views: 456, orders: 89 },
  { productId: 'prod-003', productName: 'Concrete Master 350', views: 398, orders: 76 },
  { productId: 'prod-005', productName: 'Tile Precision 115', views: 345, orders: 112 },
  { productId: 'prod-004', productName: 'Concrete Master 230', views: 312, orders: 65 },
  { productId: 'prod-006', productName: 'Tile Precision 180', views: 287, orders: 54 },
  { productId: 'prod-008', productName: 'Core Drill 102', views: 234, orders: 43 },
  { productId: 'prod-007', productName: 'Brick Cutter 230', views: 198, orders: 38 },
  { productId: 'prod-010', productName: 'Grinding Cup 125', views: 176, orders: 32 },
  { productId: 'prod-012', productName: 'Marble Elite 230', views: 156, orders: 28 },
  { productId: 'prod-011', productName: 'Asphalt Pro 400', views: 123, orders: 21 },
]

export const contractorActivityData: ContractorActivity[] = [
  {
    contractorId: 'con-004',
    contractorName: 'Mohd Azmi',
    companyName: 'KL Road Works',
    lastOrderDate: '2024-01-21',
    totalOrders: 89,
    status: 'Active',
  },
  {
    contractorId: 'con-002',
    contractorName: 'Lee Wei Ming',
    companyName: 'Mega Tile Works',
    lastOrderDate: '2024-01-22',
    totalOrders: 56,
    status: 'Active',
  },
  {
    contractorId: 'con-001',
    contractorName: 'Ahmad bin Hassan',
    companyName: 'ABC Construction Sdn Bhd',
    lastOrderDate: '2024-01-20',
    totalOrders: 24,
    status: 'Active',
  },
  {
    contractorId: 'con-006',
    contractorName: 'Farah binti Ibrahim',
    companyName: 'Diamond Edge Contractors',
    lastOrderDate: '2024-01-19',
    totalOrders: 15,
    status: 'Active',
  },
  {
    contractorId: 'con-007',
    contractorName: 'James Wong',
    companyName: 'Borneo Builders',
    lastOrderDate: '2024-01-15',
    totalOrders: 12,
    status: 'Active',
  },
  {
    contractorId: 'con-003',
    contractorName: 'Raj Kumar',
    companyName: 'Precision Cutting Co',
    lastOrderDate: '2024-01-18',
    totalOrders: 8,
    status: 'Active',
  },
  {
    contractorId: 'con-005',
    contractorName: 'Tan Chee Keong',
    companyName: 'Stone Masters Enterprise',
    lastOrderDate: '2023-09-05',
    totalOrders: 31,
    status: 'Gone Quiet',
  },
  {
    contractorId: 'con-008',
    contractorName: 'Siti Aminah',
    companyName: 'Quality Floors Sdn Bhd',
    lastOrderDate: '2023-08-20',
    totalOrders: 6,
    status: 'Gone Quiet',
  },
]

// Summary stats for dashboard
export interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  avgResponseTimeHours: number
  fulfilledToday: number
}

export function getDashboardStats(): DashboardStats {
  return {
    totalOrders: 156,
    pendingOrders: 4,
    avgResponseTimeHours: 3.2,
    fulfilledToday: 8,
  }
}

// Filter analytics by date range
export type DateRange = '7d' | '30d' | '90d'

export function getFilteredAnalytics(range: DateRange) {
  // In a real app, this would filter data by date
  // For mock data, we just return different multipliers
  const multipliers: Record<DateRange, number> = {
    '7d': 0.25,
    '30d': 0.5,
    '90d': 1,
  }
  
  const multiplier = multipliers[range]
  
  return {
    materialSearches: materialSearches.map(m => ({
      ...m,
      searches: Math.round(m.searches * multiplier),
    })),
    applicationSearches: applicationSearches.map(a => ({
      ...a,
      searches: Math.round(a.searches * multiplier),
    })),
    productAnalytics: productAnalytics.map(p => ({
      ...p,
      views: Math.round(p.views * multiplier),
      orders: Math.round(p.orders * multiplier),
    })),
  }
}
