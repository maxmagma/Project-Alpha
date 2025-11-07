'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpRightIcon, CheckCircleIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { formatPrice } from '@/lib/utils/format'
import { Product } from '@/types/vision-board'
import { useVisionBoard } from '@/components/providers/vision-board-provider'
import { useState } from 'react'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useVisionBoard()
  const [isAdding, setIsAdding] = useState(false)

  // Get vendor name from product
  const vendorName = product.vendor?.company_name || 'Vendor'

  // Determine fulfillment type
  const isPurchasable = product.fulfillment_type === 'purchasable'
  const isRental = product.fulfillment_type === 'rental' || product.fulfillment_type === 'service'

  async function handleAffiliateClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    try {
      // Track the click
      await fetch('/api/tracking/affiliate-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      })

      // Open affiliate link in new tab
      const url = product.affiliate_url || product.external_url
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      console.error('Error tracking affiliate click:', error)
      // Still open the link even if tracking fails
      const url = product.affiliate_url || product.external_url
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    }
  }

  async function handleAddToVision(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    setIsAdding(true)
    try {
      await addItem(product)
      toast.success('Added to vision board!')
    } catch (error) {
      console.error('Error adding to vision board:', error)
      toast.error('Failed to add to vision board')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="group">
      <Card className="overflow-hidden hover:shadow-lg transition-all border-0">
        {/* Product Image */}
        <Link href={`/marketplace/${product.id}`}>
          <div className="aspect-square bg-white relative border border-black/10">
            {product.primary_image ? (
              <Image
                src={product.primary_image}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No image
              </div>
            )}

            {/* Hover Arrow */}
            <div className="absolute top-3 right-3 w-8 h-8 bg-white border border-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRightIcon className="h-4 w-4" />
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {/* Staff Pick Badge */}
              {product.featured && (
                <div className="flex items-center gap-1 px-2 py-1 bg-white border border-black text-xs">
                  <CheckCircleIcon className="h-3 w-3" />
                  <span className="font-medium">Staff Pick</span>
                </div>
              )}

              {/* Fulfillment Type Badge */}
              {isPurchasable && (
                <div className="px-2 py-1 bg-black text-white text-xs font-medium">
                  Buy Online
                </div>
              )}
              {isRental && (
                <div className="px-2 py-1 bg-white border border-black text-xs font-medium">
                  Rental
                </div>
              )}
            </div>
          </div>
        </Link>

        <div className="p-4 bg-white">
          {/* Vendor • Category */}
          <Link href={`/marketplace/${product.id}`}>
            <p className="text-xs text-muted-foreground mb-1">
              {vendorName} • {product.category}
            </p>

            {/* Product Name */}
            <h3 className="font-medium mb-2 line-clamp-1 group-hover:underline">{product.name}</h3>
          </Link>

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-base font-semibold">{formatPrice(Number(product.base_price))}</p>
            {isRental && (
              <p className="text-xs text-muted-foreground">per event</p>
            )}
          </div>

          {/* CTAs - Conditional based on fulfillment type */}
          <div className="flex gap-2">
            {isPurchasable && (
              <>
                <Button
                  onClick={handleAffiliateClick}
                  size="sm"
                  className="flex-1 border-2"
                >
                  Buy Now
                  <ArrowUpRightIcon className="ml-1 h-3 w-3" />
                </Button>
                <Button
                  onClick={handleAddToVision}
                  variant="outline"
                  size="sm"
                  disabled={isAdding}
                  className="border-2"
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </>
            )}

            {isRental && (
              <Button
                onClick={handleAddToVision}
                size="sm"
                className="flex-1 border-2"
                disabled={isAdding}
              >
                <ShoppingBagIcon className="mr-1 h-4 w-4" />
                {isAdding ? 'Adding...' : 'Add to Vision'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
