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
      className="group relative flex flex-col overflow-hidden border border-rule bg-white transition-[border-color,box-shadow] hover:border-accent/30 hover:shadow-lg"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Image
          src={product.imagePlaceholder}
          alt={product.name}
          width={400}
          height={400}
          className="h-full w-full object-cover"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-navy/0 transition-[background-color] group-hover:bg-navy/60">
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex items-center gap-2 bg-accent px-6 py-3 font-sans text-sm font-semibold text-white">
              View Details
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Category */}
        <p className="font-sans text-xs font-semibold tracking-wider text-accent">
          {product.recommendedMaterials?.[0] || 'Universal'}
        </p>

        {/* Product Name */}
        <h3 className="mt-2 font-sans text-lg font-bold text-navy transition-colors group-hover:text-accent">
          {product.name}
        </h3>

        {/* Key specs */}
        <p className="mt-1 text-sm text-ink-muted">
          {product.diameter} | {product.bondType} Bond
        </p>

        {/* Price */}
        <div className="mt-4 flex items-center justify-between border-t border-rule pt-4">
          <p className="font-sans text-lg font-bold text-navy">
            {formatPrice(product.price)}
          </p>
          <ArrowRight className="h-5 w-5 text-ink-faint transition-colors group-hover:text-accent" />
        </div>
      </div>
    </Link>
  )
}
