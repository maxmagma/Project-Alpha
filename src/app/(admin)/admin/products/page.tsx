'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { formatPrice } from '@/lib/utils/format'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  category: string
  base_price: number
  primary_image: string | null
  status: string
  vendor: {
    company_name: string
  }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    // In a real app, this would be a server component or use an API route
    setLoading(false)
  }

  async function handleApprove(productId: string) {
    try {
      const response = await fetch('/api/admin/products/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })

      if (!response.ok) throw new Error()

      toast.success('Product approved')
      setProducts(products.filter(p => p.id !== productId))
    } catch (error) {
      toast.error('Failed to approve product')
    }
  }

  async function handleReject(productId: string) {
    try {
      const response = await fetch('/api/admin/products/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })

      if (!response.ok) throw new Error()

      toast.success('Product rejected')
      setProducts(products.filter(p => p.id !== productId))
    } catch (error) {
      toast.error('Failed to reject product')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Product Approvals</h1>
        <p className="text-muted-foreground">Review and approve vendor products</p>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No pending products</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <div className="aspect-square bg-secondary relative">
                {product.primary_image && (
                  <Image
                    src={product.primary_image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <CardContent className="p-4">
                <Badge variant="warning" className="mb-2">Pending</Badge>
                <h3 className="font-semibold mb-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {product.vendor.company_name} • {product.category}
                </p>
                <p className="text-lg font-bold mb-4">
                  {formatPrice(product.base_price)}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(product.id)}
                    size="sm"
                    className="flex-1"
                  >
                    <CheckIcon className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(product.id)}
                    variant="outline"
                    size="sm"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
