'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ImageManager } from './image-manager'
import { StyleTagSelector } from './style-tag-selector'
import { toast } from 'sonner'
import Link from 'next/link'

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  vendor_name: z.string().min(1, 'Vendor name is required'),
  vendor_url: z.string().url().optional().or(z.literal('')),
  base_price: z.number().positive('Price must be positive'),
  currency: z.string().default('USD'),
  suggested_category: z.string(),
  suggested_subcategory: z.string().optional(),
  suggested_fulfillment_type: z.enum(['purchasable', 'rental', 'service']),
  suggested_style_tags: z.array(z.string()),
  suggested_color_palette: z.array(z.string()),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  affiliate_url: z.string().optional(),
})

type ProductForm = z.infer<typeof productSchema>

export function ProductEditor({ product }: { product: any }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      description: product.description || '',
      vendor_name: product.vendor_name,
      vendor_url: product.vendor_url || '',
      base_price: product.base_price,
      currency: product.currency || 'USD',
      suggested_category: product.suggested_category || 'decor',
      suggested_subcategory: product.suggested_subcategory || '',
      suggested_fulfillment_type: product.suggested_fulfillment_type || 'purchasable',
      suggested_style_tags: product.suggested_style_tags || [],
      suggested_color_palette: product.suggested_color_palette || [],
      images: product.images || [],
      affiliate_url: product.affiliate_url || '',
    },
  })

  const images = watch('images')
  const styleTags = watch('suggested_style_tags')

  async function onSubmit(data: ProductForm) {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/inventory/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update product')

      toast.success('Product updated successfully')
      router.push('/admin/inventory')
      router.refresh()
    } catch (error) {
      toast.error('Failed to update product')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleApprove() {
    if (!confirm('Approve this product and publish to marketplace?')) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/inventory/${product.id}/approve`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to approve product')

      toast.success('Product approved and published!')
      router.push('/admin/inventory')
      router.refresh()
    } catch (error) {
      toast.error('Failed to approve product')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleReject() {
    const reason = prompt('Rejection reason (optional):')
    if (reason === null) return // User cancelled

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/inventory/${product.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })

      if (!response.ok) throw new Error('Failed to reject product')

      toast.success('Product rejected')
      router.push('/admin/inventory')
      router.refresh()
    } catch (error) {
      toast.error('Failed to reject product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Product Info */}
      <section className="bg-white border-2 border-black p-6">
        <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider">
          Product Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
              Product Name *
            </label>
            <Input {...register('name')} className="border-2 border-black" />
            {errors.name && (
              <p className="text-sm mt-1 text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
              Description *
            </label>
            <Textarea
              {...register('description')}
              rows={5}
              className="border-2 border-black"
            />
            {errors.description && (
              <p className="text-sm mt-1 text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                Price *
              </label>
              <Input
                type="number"
                step="0.01"
                {...register('base_price', { valueAsNumber: true })}
                className="border-2 border-black"
              />
              {errors.base_price && (
                <p className="text-sm mt-1 text-red-600">{errors.base_price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                Currency
              </label>
              <Input {...register('currency')} className="border-2 border-black" />
            </div>
          </div>
        </div>
      </section>

      {/* Categorization */}
      <section className="bg-white border-2 border-black p-6">
        <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider">
          Categorization
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                Category *
              </label>
              <select
                {...register('suggested_category')}
                className="w-full border-2 border-black p-2 bg-white"
              >
                <option value="centerpieces">Centerpieces</option>
                <option value="linens">Linens</option>
                <option value="chairs">Chairs</option>
                <option value="lighting">Lighting</option>
                <option value="placeSettings">Place Settings</option>
                <option value="decor">Decor</option>
                <option value="florals">Florals</option>
                <option value="furniture">Furniture</option>
                <option value="tableware">Tableware</option>
                <option value="signage">Signage</option>
                <option value="favors">Favors</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                Fulfillment Type *
              </label>
              <select
                {...register('suggested_fulfillment_type')}
                className="w-full border-2 border-black p-2 bg-white"
              >
                <option value="purchasable">Purchasable</option>
                <option value="rental">Rental</option>
                <option value="service">Service</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
              Subcategory (Optional)
            </label>
            <Input
              {...register('suggested_subcategory')}
              className="border-2 border-black"
              placeholder="e.g., 'Rustic Wood', 'Crystal Glass'"
            />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
              Style Tags
            </label>
            <StyleTagSelector
              selected={styleTags}
              onChange={(tags) => setValue('suggested_style_tags', tags)}
            />
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="bg-white border-2 border-black p-6">
        <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider">Images</h2>
        <ImageManager
          images={images}
          onImagesChange={(newImages) => setValue('images', newImages)}
        />
        {errors.images && (
          <p className="text-sm mt-2 text-red-600">{errors.images.message}</p>
        )}
      </section>

      {/* Vendor Info */}
      <section className="bg-white border-2 border-black p-6">
        <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider">
          Vendor Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
              Vendor Name *
            </label>
            <Input {...register('vendor_name')} className="border-2 border-black" />
            {errors.vendor_name && (
              <p className="text-sm mt-1 text-red-600">{errors.vendor_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
              Vendor Website
            </label>
            <Input
              type="url"
              {...register('vendor_url')}
              className="border-2 border-black"
              placeholder="https://example.com"
            />
            {errors.vendor_url && (
              <p className="text-sm mt-1 text-red-600">{errors.vendor_url.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
              Affiliate URL
            </label>
            <Input
              type="url"
              {...register('affiliate_url')}
              className="border-2 border-black"
              placeholder="https://affiliate-link.com"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Used for tracking affiliate commissions
            </p>
          </div>
        </div>
      </section>

      {/* Source Info (Read-only) */}
      <section className="bg-secondary border-2 border-black p-6">
        <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider">
          Import Details
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-bold uppercase tracking-wider mb-1">Source</p>
            <p className="text-muted-foreground">{product.import_source}</p>
          </div>

          <div>
            <p className="font-bold uppercase tracking-wider mb-1">External ID</p>
            <p className="text-muted-foreground">{product.external_id || 'N/A'}</p>
          </div>

          <div>
            <p className="font-bold uppercase tracking-wider mb-1">AI Confidence</p>
            <p className="text-muted-foreground">
              {((product.ai_confidence || 0.5) * 100).toFixed(0)}%
            </p>
          </div>

          <div>
            <p className="font-bold uppercase tracking-wider mb-1">Imported</p>
            <p className="text-muted-foreground">
              {new Date(product.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="col-span-2">
            <p className="font-bold uppercase tracking-wider mb-1">Source URL</p>
            <a
              href={product.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {product.source_url}
            </a>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-3 justify-between">
        <Button
          type="button"
          variant="outline"
          asChild
          className="border-2 border-black"
        >
          <Link href="/admin/inventory">Cancel</Link>
        </Button>

        <div className="flex gap-3">
          {product.review_status !== 'rejected' && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReject}
              disabled={isSubmitting}
              className="border-2 border-black"
            >
              Reject
            </Button>
          )}

          <Button
            type="submit"
            variant="outline"
            disabled={isSubmitting}
            className="border-2 border-black"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>

          {product.review_status !== 'approved' && (
            <Button
              type="button"
              onClick={handleApprove}
              disabled={isSubmitting}
              className="border-2"
            >
              {isSubmitting ? 'Approving...' : 'Approve & Publish'}
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
