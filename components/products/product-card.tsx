"use client"

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils/formatting'
import type { Product } from '@/lib/data/products'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link 
      href={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden border border-[#e2e8f0] bg-white transition-all duration-300 hover:border-[#3b82f6]/30 hover:shadow-lg"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-[#f1f5f9]">
        <Image
          src={product.imagePlaceholder}
          alt={product.name}
          width={400}
          height={400}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#0a1628]/0 transition-all duration-500 group-hover:bg-[#0a1628]/60">
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100">
            <div className="flex items-center gap-2 bg-[#3b82f6] px-6 py-3 font-sans text-sm font-semibold text-white">
              View Details
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Category */}
        <p className="font-sans text-xs font-semibold tracking-wider text-[#3b82f6]">
          {product.recommendedMaterials?.[0] || 'Universal'}
        </p>

        {/* Product Name */}
        <h3 className="mt-2 font-sans text-lg font-bold text-[#0a1628] transition-colors group-hover:text-[#3b82f6]">
          {product.name}
        </h3>

        {/* Key specs */}
        <p className="mt-1 text-sm text-[#64748b]">
          {product.diameter} | {product.bondType} Bond
        </p>

        {/* Price */}
        <div className="mt-4 flex items-center justify-between border-t border-[#e2e8f0] pt-4">
          <p className="font-sans text-lg font-bold text-[#0a1628]">
            {formatPrice(product.price)}
          </p>
          <ArrowRight className="h-5 w-5 text-[#94a3b8] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#3b82f6]" />
        </div>
      </div>
    </Link>
  )
}
