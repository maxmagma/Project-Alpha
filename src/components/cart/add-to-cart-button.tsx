'use client'

import { useState } from 'react'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/providers/cart-provider'
import { toast } from 'sonner'
import { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row']

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      await addItem(product)
      toast.success('Added to cart')
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading}
      className="w-full"
      size="lg"
    >
      <ShoppingCartIcon className="mr-2 h-5 w-5" />
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </Button>
  )
}
