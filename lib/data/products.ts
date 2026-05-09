export type Material = 
  | 'Granite' 
  | 'Concrete' 
  | 'Tile' 
  | 'Brick' 
  | 'Marble' 
  | 'Homogeneous Tile' 
  | 'Sandstone' 
  | 'Asphalt'

export type Application = 
  | 'Floor Cutting' 
  | 'Wall Cutting' 
  | 'Coring' 
  | 'Grinding'

export type MachinePower = 'low' | 'medium' | 'high'

export type BondType = 'Soft' | 'Medium' | 'Hard' | 'Extra Hard'

export type ProductCategory = 
  | 'Diamond Blades'
  | 'Diamond Core Bits'
  | 'Diamond Cartwheel'
  | 'Diamond Polishing Pad'

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Diamond Blades',
  'Diamond Core Bits',
  'Diamond Cartwheel',
  'Diamond Polishing Pad',
]

export interface Product {
  id: string
  sku: string
  name: string
  description: string
  category: ProductCategory
  diameter: string
  arborSize: string
  segmentHeight: string
  bondType: BondType
  recommendedMaterials: Material[]
  applications: Application[]
  recommendedMachinePower: MachinePower
  recommendedCuttingVolume: string
  price: number
  imagePlaceholder: string
  videoPlaceholder?: string
  maxRPM?: string | number
  relatedProductIds: string[]
}

export const MATERIALS: Material[] = [
  'Granite',
  'Concrete',
  'Tile',
  'Brick',
  'Marble',
  'Homogeneous Tile',
  'Sandstone',
  'Asphalt',
]

export const APPLICATIONS: Application[] = [
  'Floor Cutting',
  'Wall Cutting',
  'Coring',
  'Grinding',
]

export const MACHINE_POWERS: { value: MachinePower; label: string }[] = [
  { value: 'low', label: 'Low (< 2kW)' },
  { value: 'medium', label: 'Medium (2-4kW)' },
  { value: 'high', label: 'High (> 4kW)' },
]

export const products: Product[] = [
  {
    id: 'prod-001',
    sku: 'CM-GRN-230',
    name: 'Granite Pro 230',
    description: 'Professional-grade diamond blade designed for precision cutting of granite and hard stone. Features advanced segment technology for extended blade life.',
    category: 'Diamond Blades',
    diameter: '230mm',
    arborSize: '22.23mm',
    segmentHeight: '10mm',
    bondType: 'Hard',
    recommendedMaterials: ['Granite', 'Marble'],
    applications: ['Floor Cutting', 'Wall Cutting'],
    recommendedMachinePower: 'high',
    recommendedCuttingVolume: '500+ sqm',
    price: 185.00,
    imagePlaceholder: '/images/blade-granite.jpg',
    videoPlaceholder: '/placeholder-video.mp4',
    relatedProductIds: ['prod-002', 'prod-003'],
  },
  {
    id: 'prod-002',
    sku: 'CM-GRN-180',
    name: 'Granite Pro 180',
    description: 'Compact diamond blade for smaller cutting jobs. Perfect for detailed granite work and finishing cuts.',
    category: 'Diamond Blades',
    diameter: '180mm',
    arborSize: '22.23mm',
    segmentHeight: '8mm',
    bondType: 'Hard',
    recommendedMaterials: ['Granite', 'Marble'],
    applications: ['Floor Cutting', 'Wall Cutting'],
    recommendedMachinePower: 'medium',
    recommendedCuttingVolume: '200-500 sqm',
    price: 145.00,
    imagePlaceholder: '/images/blade-granite.jpg',
    relatedProductIds: ['prod-001', 'prod-003'],
  },
  {
    id: 'prod-003',
    sku: 'CM-CON-350',
    name: 'Concrete Master 350',
    description: 'Heavy-duty blade for cutting reinforced concrete. Designed for road cutting and large-scale construction projects.',
    category: 'Diamond Blades',
    diameter: '350mm',
    arborSize: '25.4mm',
    segmentHeight: '12mm',
    bondType: 'Medium',
    recommendedMaterials: ['Concrete', 'Asphalt'],
    applications: ['Floor Cutting'],
    recommendedMachinePower: 'high',
    recommendedCuttingVolume: '1000+ sqm',
    price: 320.00,
    imagePlaceholder: '/images/blade-concrete.jpg',
    videoPlaceholder: '/placeholder-video.mp4',
    relatedProductIds: ['prod-004', 'prod-005'],
  },
  {
    id: 'prod-004',
    sku: 'CM-CON-230',
    name: 'Concrete Master 230',
    description: 'Versatile concrete cutting blade suitable for general construction work. Excellent balance of speed and blade life.',
    category: 'Diamond Blades',
    diameter: '230mm',
    arborSize: '22.23mm',
    segmentHeight: '10mm',
    bondType: 'Medium',
    recommendedMaterials: ['Concrete', 'Brick'],
    applications: ['Floor Cutting', 'Wall Cutting'],
    recommendedMachinePower: 'medium',
    recommendedCuttingVolume: '300-600 sqm',
    price: 165.00,
    imagePlaceholder: '/images/blade-concrete.jpg',
    relatedProductIds: ['prod-003', 'prod-005'],
  },
  {
    id: 'prod-005',
    sku: 'CM-TIL-115',
    name: 'Tile Precision 115',
    description: 'Ultra-thin blade for clean, chip-free tile cutting. Ideal for porcelain, ceramic, and homogeneous tiles.',
    category: 'Diamond Blades',
    diameter: '115mm',
    arborSize: '22.23mm',
    segmentHeight: '5mm',
    bondType: 'Soft',
    recommendedMaterials: ['Tile', 'Homogeneous Tile'],
    applications: ['Floor Cutting', 'Wall Cutting'],
    recommendedMachinePower: 'low',
    recommendedCuttingVolume: '100-200 sqm',
    price: 85.00,
    imagePlaceholder: '/images/blade-tile.jpg',
    relatedProductIds: ['prod-006', 'prod-007'],
  },
  {
    id: 'prod-006',
    sku: 'CM-TIL-180',
    name: 'Tile Precision 180',
    description: 'Larger tile cutting blade for faster coverage. Maintains precision cutting for professional tile installations.',
    category: 'Diamond Blades',
    diameter: '180mm',
    arborSize: '22.23mm',
    segmentHeight: '7mm',
    bondType: 'Soft',
    recommendedMaterials: ['Tile', 'Homogeneous Tile', 'Marble'],
    applications: ['Floor Cutting', 'Wall Cutting'],
    recommendedMachinePower: 'medium',
    recommendedCuttingVolume: '200-400 sqm',
    price: 125.00,
    imagePlaceholder: '/images/blade-tile.jpg',
    relatedProductIds: ['prod-005', 'prod-007'],
  },
  {
    id: 'prod-007',
    sku: 'CM-BRK-230',
    name: 'Brick Cutter 230',
    description: 'Durable blade optimized for brick and block cutting. Fast cutting speed with minimal dust generation.',
    category: 'Diamond Blades',
    diameter: '230mm',
    arborSize: '22.23mm',
    segmentHeight: '10mm',
    bondType: 'Medium',
    recommendedMaterials: ['Brick', 'Sandstone'],
    applications: ['Floor Cutting', 'Wall Cutting'],
    recommendedMachinePower: 'medium',
    recommendedCuttingVolume: '400-800 sqm',
    price: 135.00,
    imagePlaceholder: '/images/blade-granite.jpg',
    relatedProductIds: ['prod-004', 'prod-008'],
  },
  {
    id: 'prod-008',
    sku: 'CM-COR-102',
    name: 'Core Drill 102',
    description: 'Diamond core drill for precise hole cutting. Perfect for plumbing and electrical installations.',
    category: 'Diamond Core Bits',
    diameter: '102mm',
    arborSize: '1/2" BSP',
    segmentHeight: '8mm',
    bondType: 'Hard',
    recommendedMaterials: ['Concrete', 'Brick'],
    applications: ['Coring'],
    recommendedMachinePower: 'high',
    recommendedCuttingVolume: '50+ holes',
    price: 210.00,
    imagePlaceholder: '/images/blade-granite.jpg',
    relatedProductIds: ['prod-009', 'prod-010'],
  },
  {
    id: 'prod-009',
    sku: 'CM-COR-152',
    name: 'Core Drill 152',
    description: 'Large diameter core drill for HVAC and drainage installations. Heavy-duty construction for demanding applications.',
    category: 'Diamond Core Bits',
    diameter: '152mm',
    arborSize: '1/2" BSP',
    segmentHeight: '10mm',
    bondType: 'Hard',
    recommendedMaterials: ['Concrete', 'Brick'],
    applications: ['Coring'],
    recommendedMachinePower: 'high',
    recommendedCuttingVolume: '30+ holes',
    price: 285.00,
    imagePlaceholder: '/images/blade-granite.jpg',
    relatedProductIds: ['prod-008', 'prod-010'],
  },
  {
    id: 'prod-010',
    sku: 'CM-GRD-125',
    name: 'Grinding Cup 125',
    description: 'Diamond grinding cup for surface preparation and leveling. Double-row segment design for aggressive material removal.',
    category: 'Diamond Cartwheel',
    diameter: '125mm',
    arborSize: 'M14',
    segmentHeight: '6mm',
    bondType: 'Extra Hard',
    recommendedMaterials: ['Concrete', 'Granite'],
    applications: ['Grinding'],
    recommendedMachinePower: 'medium',
    recommendedCuttingVolume: '100+ sqm',
    price: 155.00,
    imagePlaceholder: '/images/blade-granite.jpg',
    relatedProductIds: ['prod-008', 'prod-003'],
  },
  {
    id: 'prod-011',
    sku: 'CM-ASP-400',
    name: 'Asphalt Pro 400',
    description: 'Specialized blade for asphalt cutting. Designed for road maintenance and repair work with superior heat dissipation.',
    category: 'Diamond Blades',
    diameter: '400mm',
    arborSize: '25.4mm',
    segmentHeight: '12mm',
    bondType: 'Soft',
    recommendedMaterials: ['Asphalt', 'Concrete'],
    applications: ['Floor Cutting'],
    recommendedMachinePower: 'high',
    recommendedCuttingVolume: '2000+ linear meters',
    price: 385.00,
    imagePlaceholder: '/images/blade-granite.jpg',
    relatedProductIds: ['prod-003', 'prod-004'],
  },
  {
    id: 'prod-012',
    sku: 'CM-MRB-230',
    name: 'Marble Elite 230',
    description: 'Premium blade for cutting marble and soft natural stone. Delivers polished edge finish with minimal chipping.',
    category: 'Diamond Blades',
    diameter: '230mm',
    arborSize: '22.23mm',
    segmentHeight: '8mm',
    bondType: 'Soft',
    recommendedMaterials: ['Marble', 'Sandstone'],
    applications: ['Floor Cutting', 'Wall Cutting'],
    recommendedMachinePower: 'medium',
    recommendedCuttingVolume: '200-400 sqm',
    price: 195.00,
    imagePlaceholder: '/images/blade-granite.jpg',
    relatedProductIds: ['prod-001', 'prod-006'],
  },
]

// Add a polishing pad product
products.push({
  id: 'prod-013',
  sku: 'CM-POL-100',
  name: 'Polishing Pad 100',
  description: 'Premium diamond polishing pad for achieving mirror-like finish on granite, marble, and concrete surfaces. Multiple grit options available.',
  category: 'Diamond Polishing Pad',
  diameter: '100mm',
  arborSize: 'Velcro Back',
  segmentHeight: '3mm',
  bondType: 'Soft',
  recommendedMaterials: ['Granite', 'Marble', 'Concrete'],
  applications: ['Grinding'],
  recommendedMachinePower: 'low',
  recommendedCuttingVolume: '50+ sqm',
  price: 45.00,
  imagePlaceholder: '/images/blade-granite.jpg',
  relatedProductIds: ['prod-010', 'prod-012'],
})

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

export function filterByCategory(category: ProductCategory | null): Product[] {
  if (!category) return products
  return products.filter(p => p.category === category)
}

export function getRelatedProducts(productId: string): Product[] {
  const product = getProductById(productId)
  if (!product) return []
  return product.relatedProductIds
    .map(id => getProductById(id))
    .filter((p): p is Product => p !== undefined)
}

export function filterProducts(
  selectedMaterials: Material[],
  selectedApplications: Application[],
  selectedMachinePower: MachinePower[]
): Product[] {
  return products.filter(product => {
    if (selectedMaterials.length > 0) {
      const hasMaterial = product.recommendedMaterials.some(m => selectedMaterials.includes(m))
      if (!hasMaterial) return false
    }
    if (selectedApplications.length > 0) {
      const hasApplication = product.applications.some(a => selectedApplications.includes(a))
      if (!hasApplication) return false
    }
    if (selectedMachinePower.length > 0) {
      if (!selectedMachinePower.includes(product.recommendedMachinePower)) return false
    }
    return true
  })
}
