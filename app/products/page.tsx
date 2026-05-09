"use client"

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Filter, X } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { ProductCard } from '@/components/products/product-card'
import { Button } from '@/components/ui/button'
import { 
  products, 
  filterProducts,
  PRODUCT_CATEGORIES,
  type Material, 
  type Application, 
  type MachinePower,
  type ProductCategory 
} from '@/lib/data/products'

const materials: Material[] = ['Granite', 'Concrete', 'Marble', 'Tile', 'Asphalt', 'Brick', 'Homogeneous Tile']
const applications: Application[] = ['Wall Cutting', 'Floor Cutting', 'Coring', 'Grinding']

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null)
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([])
  const [selectedApplications, setSelectedApplications] = useState<Application[]>([])
  const [selectedMachinePower, setSelectedMachinePower] = useState<MachinePower[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = useMemo(() => {
    let result = products
    
    // Filter by category first
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory)
    }
    
    // Then apply material/application filters
    if (selectedMaterials.length > 0) {
      result = result.filter(p => p.recommendedMaterials.some(m => selectedMaterials.includes(m)))
    }
    if (selectedApplications.length > 0) {
      result = result.filter(p => p.applications.some(a => selectedApplications.includes(a)))
    }
    if (selectedMachinePower.length > 0) {
      result = result.filter(p => selectedMachinePower.includes(p.recommendedMachinePower))
    }
    
    return result
  }, [selectedCategory, selectedMaterials, selectedApplications, selectedMachinePower])

  const toggleMaterial = (material: Material) => {
    setSelectedMaterials(prev =>
      prev.includes(material) ? prev.filter(m => m !== material) : [...prev, material]
    )
  }

  const toggleApplication = (app: Application) => {
    setSelectedApplications(prev =>
      prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]
    )
  }

  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedMaterials([])
    setSelectedApplications([])
    setSelectedMachinePower([])
  }

  const hasFilters = selectedCategory || selectedMaterials.length > 0 || selectedApplications.length > 0 || selectedMachinePower.length > 0

  return (
    <PublicLayout>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a1628] pb-20 pt-32">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-30">
          <Image src="/images/blade-granite.jpg" alt="Diamond blade" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold tracking-wider text-[#3b82f6]">Diamond Tools</p>
            <h1 className="mt-4 text-5xl font-bold text-white lg:text-6xl">
              Industrial Diamond<br />Cutting Tools
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/60">
              Industrial-grade blades engineered for precision cutting across granite, concrete, tile, and more. Built for professionals who demand performance.
            </p>
            <div className="mt-10 flex gap-12 border-t border-white/10 pt-8">
              <div>
                <div className="text-3xl font-bold text-white">{products.length}+</div>
                <div className="text-sm font-semibold text-white/40">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{PRODUCT_CATEGORIES.length}</div>
                <div className="text-sm font-semibold text-white/40">Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{materials.length}</div>
                <div className="text-sm font-semibold text-white/40">Materials</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="border-b border-[#e2e8f0] bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-4 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap px-5 py-2.5 text-sm font-bold transition-all ${
                selectedCategory === null
                  ? 'bg-[#0a1628] text-white'
                  : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0] hover:text-[#0a1628]'
              }`}
            >
              All Products
            </button>
            {PRODUCT_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-5 py-2.5 text-sm font-bold transition-all ${
                  selectedCategory === category
                    ? 'bg-[#0a1628] text-white'
                    : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0] hover:text-[#0a1628]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <section className="sticky top-0 z-30 border-b border-[#e2e8f0] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="hidden items-center gap-2 lg:flex">
              <span className="mr-2 text-sm font-bold text-[#64748b]">Material:</span>
              {materials.slice(0, 5).map((material) => (
                <button
                  key={material}
                  onClick={() => toggleMaterial(material)}
                  className={`px-4 py-2 text-sm font-semibold transition-all ${
                    selectedMaterials.includes(material)
                      ? 'bg-[#0a1628] text-white'
                      : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0] hover:text-[#0a1628]'
                  }`}
                >
                  {material}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-bold text-[#0a1628] lg:hidden"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasFilters && <span className="flex h-5 w-5 items-center justify-center bg-[#3b82f6] text-xs font-bold text-white">{(selectedCategory ? 1 : 0) + selectedMaterials.length + selectedApplications.length}</span>}
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#64748b]">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </span>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-sm font-semibold text-[#3b82f6] hover:text-[#2563eb]">
                  <X className="h-4 w-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="border-t border-[#e2e8f0] py-4 lg:hidden">
              <div className="mb-4">
                <p className="mb-2 text-xs font-bold text-[#64748b]">Category</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1.5 text-xs font-semibold transition-all ${!selectedCategory ? 'bg-[#0a1628] text-white' : 'bg-[#f1f5f9] text-[#64748b]'}`}>
                    All
                  </button>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-semibold transition-all ${selectedCategory === cat ? 'bg-[#0a1628] text-white' : 'bg-[#f1f5f9] text-[#64748b]'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <p className="mb-2 text-xs font-bold text-[#64748b]">Material</p>
                <div className="flex flex-wrap gap-2">
                  {materials.map((material) => (
                    <button key={material} onClick={() => toggleMaterial(material)}
                      className={`px-3 py-1.5 text-xs font-semibold transition-all ${selectedMaterials.includes(material) ? 'bg-[#0a1628] text-white' : 'bg-[#f1f5f9] text-[#64748b]'}`}>
                      {material}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold text-[#64748b]">Application</p>
                <div className="flex flex-wrap gap-2">
                  {applications.map((app) => (
                    <button key={app} onClick={() => toggleApplication(app)}
                      className={`px-3 py-1.5 text-xs font-semibold transition-all ${selectedApplications.includes(app) ? 'bg-[#0a1628] text-white' : 'bg-[#f1f5f9] text-[#64748b]'}`}>
                      {app}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Product Grid */}
      <section className="bg-[#f8fafc] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                <div>
                  <h3 className="mb-4 text-sm font-bold text-[#0a1628]">Application</h3>
                  <div className="space-y-2">
                    {applications.map((app) => (
                      <button key={app} onClick={() => toggleApplication(app)}
                        className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-all ${
                          selectedApplications.includes(app) ? 'bg-[#0a1628] text-white' : 'bg-white text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0a1628]'
                        }`}>
                        {app}
                        {selectedApplications.includes(app) && <X className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 text-sm font-bold text-[#0a1628]">More Materials</h3>
                  <div className="space-y-2">
                    {materials.slice(5).map((material) => (
                      <button key={material} onClick={() => toggleMaterial(material)}
                        className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-all ${
                          selectedMaterials.includes(material) ? 'bg-[#0a1628] text-white' : 'bg-white text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0a1628]'
                        }`}>
                        {material}
                        {selectedMaterials.includes(material) && <X className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="border border-[#e2e8f0] bg-white p-6">
                  <h4 className="text-lg font-bold text-[#0a1628]">Need Help?</h4>
                  <p className="mt-2 text-sm text-[#64748b]">Our engineers can help you select the right tool for your project.</p>
                  <Button className="mt-4 w-full bg-[#3b82f6] font-bold hover:bg-[#2563eb]" asChild>
                    <Link href="/contact">Get Advice <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div>
              {filteredProducts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border border-[#e2e8f0] bg-white py-20">
                  <p className="text-lg font-bold text-[#0a1628]">No Products Found</p>
                  <p className="mt-2 text-sm text-[#64748b]">Try adjusting your filters</p>
                  <Button onClick={clearFilters} className="mt-6 bg-[#0a1628] font-bold hover:bg-[#122036]">
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#0a1628] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-white lg:text-5xl">
            Can&apos;t Find What You Need?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            We offer custom blade configurations for specialised applications. Contact our engineering team.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="h-12 bg-[#3b82f6] px-6 font-bold text-white hover:bg-[#2563eb]" asChild>
              <Link href="/contact">Contact Engineering <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 border-2 border-white/30 bg-transparent px-6 font-bold text-white hover:border-white hover:bg-white hover:text-[#0a1628]" asChild>
              <Link href="/resources">Download Catalog</Link>
            </Button>
          </div>
        </div>
      </section>

    </PublicLayout>
  )
}
