import { describe, it, expect } from 'vitest'
import { products } from '../../lib/data/products'

describe('Product Seed Mapping', () => {
  it('should have 13 products', () => {
    expect(products.length).toBe(13)
  })

  it('should have price field on all products', () => {
    for (const product of products) {
      expect(product.price).toBeDefined()
      expect(typeof product.price).toBe('number')
      expect(product.price).toBeGreaterThan(0)
    }
  })

  it('should map price to listPrice correctly', () => {
    const product = products[0]
    const mapped = {
      sku: product.sku,
      name: product.name,
      description: product.description,
      category: product.category,
      diameter: product.diameter,
      arborSize: product.arborSize,
      segmentHeight: product.segmentHeight,
      bondType: product.bondType,
      recommendedMaterials: product.recommendedMaterials,
      applications: product.applications,
      recommendedMachinePower: product.recommendedMachinePower,
      recommendedCuttingVolume: product.recommendedCuttingVolume,
      listPrice: product.price,
    }

    expect(mapped.listPrice).toBe(product.price)
    expect(mapped).not.toHaveProperty('price')
  })

  it('should include all required fields in mapping', () => {
    const product = products[0]
    const mapped = {
      sku: product.sku,
      name: product.name,
      description: product.description,
      category: product.category,
      diameter: product.diameter,
      arborSize: product.arborSize,
      segmentHeight: product.segmentHeight,
      bondType: product.bondType,
      recommendedMaterials: product.recommendedMaterials,
      applications: product.applications,
      recommendedMachinePower: product.recommendedMachinePower,
      recommendedCuttingVolume: product.recommendedCuttingVolume,
      listPrice: product.price,
    }

    expect(mapped).toHaveProperty('sku')
    expect(mapped).toHaveProperty('name')
    expect(mapped).toHaveProperty('description')
    expect(mapped).toHaveProperty('category')
    expect(mapped).toHaveProperty('listPrice')
  })

  it('should verify all products have valid data types', () => {
    for (const product of products) {
      expect(typeof product.sku).toBe('string')
      expect(typeof product.name).toBe('string')
      expect(typeof product.description).toBe('string')
      expect(typeof product.category).toBe('string')
      expect(typeof product.diameter).toBe('string')
      expect(typeof product.arborSize).toBe('string')
      expect(typeof product.segmentHeight).toBe('string')
      expect(typeof product.bondType).toBe('string')
      expect(Array.isArray(product.recommendedMaterials)).toBe(true)
      expect(Array.isArray(product.applications)).toBe(true)
      expect(['low', 'medium', 'high']).toContain(
        product.recommendedMachinePower
      )
      expect(typeof product.recommendedCuttingVolume).toBe('string')
      expect(typeof product.price).toBe('number')
    }
  })
})
