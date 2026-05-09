export type ContractorStatus = 'Active' | 'Gone Quiet'

export interface Contractor {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string
  deliveryAddress: string
  accountDiscount: number // percentage, e.g., 0.10 for 10%
  status: ContractorStatus
  registeredAt: string
  lastOrderAt: string | null
  totalOrders: number
}

export const contractors: Contractor[] = [
  {
    id: 'con-001',
    companyName: 'ABC Construction Sdn Bhd',
    contactName: 'Ahmad bin Hassan',
    email: 'ahmad@abcconstruction.com.my',
    phone: '+60 12-345 6789',
    deliveryAddress: '123 Jalan Industri, Shah Alam, Selangor 40150',
    accountDiscount: 0.10,
    status: 'Active',
    registeredAt: '2023-03-15',
    lastOrderAt: '2024-01-20',
    totalOrders: 24,
  },
  {
    id: 'con-002',
    companyName: 'Mega Tile Works',
    contactName: 'Lee Wei Ming',
    email: 'weiming@megatile.com.my',
    phone: '+60 16-789 0123',
    deliveryAddress: '45 Lorong Perusahaan, Petaling Jaya, Selangor 46000',
    accountDiscount: 0.15,
    status: 'Active',
    registeredAt: '2022-08-01',
    lastOrderAt: '2024-01-22',
    totalOrders: 56,
  },
  {
    id: 'con-003',
    companyName: 'Precision Cutting Co',
    contactName: 'Raj Kumar',
    email: 'raj@precisioncut.com.my',
    phone: '+60 19-456 7890',
    deliveryAddress: '78 Jalan Pembangunan, Johor Bahru, Johor 81100',
    accountDiscount: 0.05,
    status: 'Active',
    registeredAt: '2023-11-10',
    lastOrderAt: '2024-01-18',
    totalOrders: 8,
  },
  {
    id: 'con-004',
    companyName: 'KL Road Works',
    contactName: 'Mohd Azmi',
    email: 'azmi@klroadworks.com.my',
    phone: '+60 13-234 5678',
    deliveryAddress: '200 Jalan Pembinaan, Kuala Lumpur 51200',
    accountDiscount: 0.12,
    status: 'Active',
    registeredAt: '2022-01-20',
    lastOrderAt: '2024-01-21',
    totalOrders: 89,
  },
  {
    id: 'con-005',
    companyName: 'Stone Masters Enterprise',
    contactName: 'Tan Chee Keong',
    email: 'ck@stonemasters.com.my',
    phone: '+60 17-890 1234',
    deliveryAddress: '15 Kawasan Perindustrian, Penang 13600',
    accountDiscount: 0.08,
    status: 'Gone Quiet',
    registeredAt: '2022-05-15',
    lastOrderAt: '2023-09-05',
    totalOrders: 31,
  },
  {
    id: 'con-006',
    companyName: 'Diamond Edge Contractors',
    contactName: 'Farah binti Ibrahim',
    email: 'farah@diamondedge.com.my',
    phone: '+60 14-567 8901',
    deliveryAddress: '88 Jalan Perusahaan Baru, Klang, Selangor 41000',
    accountDiscount: 0.10,
    status: 'Active',
    registeredAt: '2023-07-01',
    lastOrderAt: '2024-01-19',
    totalOrders: 15,
  },
  {
    id: 'con-007',
    companyName: 'Borneo Builders',
    contactName: 'James Wong',
    email: 'james@borneobuilders.com.my',
    phone: '+60 82-123 4567',
    deliveryAddress: '25 Jalan Industri, Kuching, Sarawak 93350',
    accountDiscount: 0.07,
    status: 'Active',
    registeredAt: '2023-09-20',
    lastOrderAt: '2024-01-15',
    totalOrders: 12,
  },
  {
    id: 'con-008',
    companyName: 'Quality Floors Sdn Bhd',
    contactName: 'Siti Aminah',
    email: 'siti@qualityfloors.com.my',
    phone: '+60 11-234 5678',
    deliveryAddress: '50 Kawasan Perindustrian Senai, Johor 81400',
    accountDiscount: 0.05,
    status: 'Gone Quiet',
    registeredAt: '2023-02-10',
    lastOrderAt: '2023-08-20',
    totalOrders: 6,
  },
]

export function getContractorById(id: string): Contractor | undefined {
  return contractors.find(c => c.id === id)
}

export function getContractorByEmail(email: string): Contractor | undefined {
  return contractors.find(c => c.email.toLowerCase() === email.toLowerCase())
}

export function getActiveContractors(): Contractor[] {
  return contractors.filter(c => c.status === 'Active')
}

export function getQuietContractors(): Contractor[] {
  return contractors.filter(c => c.status === 'Gone Quiet')
}
