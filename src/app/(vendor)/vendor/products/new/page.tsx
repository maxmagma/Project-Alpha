'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { productSchema, type ProductFormData } from '@/lib/validations/product'
import { PRODUCT_CATEGORIES, STYLE_TAGS } from '@/lib/constants'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      price_type: 'rental',
      fulfillment_type: 'rental',
      style_tags: [],
    },
  })

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)
    try {
      // Generate slug from name
      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

      const response = await fetch('/api/vendor/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, slug }),
      })

      if (!response.ok) {
        throw new Error('Failed to create product')
      }

      toast.success('Product created successfully')
      router.push('/vendor/products')
    } catch (error) {
      toast.error('Failed to create product')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/vendor/products"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">Create a new product listing</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" {...register('name')} />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  {...register('description')}
                  className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Describe your product..."
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    {...register('category')}
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select category</option>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Input id="subcategory" {...register('subcategory')} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Fulfillment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="base_price">Price *</Label>
                  <Input
                    id="base_price"
                    type="number"
                    step="0.01"
                    {...register('base_price', { valueAsNumber: true })}
                  />
                  {errors.base_price && (
                    <p className="text-sm text-red-600 mt-1">{errors.base_price.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="price_type">Price Type *</Label>
                  <select
                    id="price_type"
                    {...register('price_type')}
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                  >
                    <option value="rental">Rental</option>
                    <option value="purchase">Purchase</option>
                    <option value="quote">Quote Only</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="fulfillment_type">Fulfillment *</Label>
                  <select
                    id="fulfillment_type"
                    {...register('fulfillment_type')}
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                  >
                    <option value="rental">Rental</option>
                    <option value="shippable">Shippable</option>
                    <option value="service">Service</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="quantity_available">Quantity Available</Label>
                <Input
                  id="quantity_available"
                  type="number"
                  {...register('quantity_available', { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </Button>
            <Link href="/vendor/products">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
