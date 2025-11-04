import { notFound } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils/format'

export const revalidate = 3600

interface PageProps {
  params: {
    productId: string
  }
}

async function getProduct(productId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, vendor:vendors(*), images:product_images(*)')
    .eq('id', productId)
    .single()

  if (error || !data) return null

  return data
}

export async function generateMetadata({ params }: PageProps) {
  const product = await getProduct(params.productId)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} - Wedding Marketplace`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct(params.productId)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square bg-secondary rounded-lg mb-4 relative overflow-hidden">
            {product.primary_image ? (
              <Image
                src={product.primary_image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No image available
              </div>
            )}
          </div>

          {/* Thumbnail Grid */}
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((img: any, index: number) => (
                <div key={index} className="aspect-square bg-secondary rounded overflow-hidden relative">
                  <Image
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-muted-foreground uppercase mb-2">
            {product.category}
          </p>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          <div className="flex gap-2 mb-6">
            {product.style_tags.map((tag: string) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="py-6 border-y mb-6">
            <p className="text-4xl font-bold mb-2">
              {formatPrice(Number(product.base_price))}
            </p>
            <p className="text-muted-foreground">
              {product.price_type === 'rental' ? 'per event rental' :
               product.price_type === 'purchase' ? 'purchase price' :
               'Contact for quote'}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <AddToCartButton product={product} />
            <Button variant="outline" className="w-full" size="lg">
              Request Quote
            </Button>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Product Details */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4">Product Details</h3>
            <dl className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <dt className="text-muted-foreground">Category</dt>
                <dd className="font-medium">{product.category}</dd>
              </div>
              {product.subcategory && (
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-muted-foreground">Subcategory</dt>
                  <dd className="font-medium">{product.subcategory}</dd>
                </div>
              )}
              <div className="flex justify-between py-2 border-b">
                <dt className="text-muted-foreground">Fulfillment</dt>
                <dd className="font-medium capitalize">{product.fulfillment_type}</dd>
              </div>
              {product.quantity_available && (
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-muted-foreground">Availability</dt>
                  <dd className="font-medium">{product.quantity_available} available</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Vendor Info */}
          {product.vendor && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="font-semibold text-lg mb-4">Vendor</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                  {product.vendor.logo_url ? (
                    <Image
                      src={product.vendor.logo_url}
                      alt={product.vendor.company_name}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-2xl font-bold">
                      {product.vendor.company_name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{product.vendor.company_name}</p>
                  {product.vendor.service_areas && product.vendor.service_areas.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Serves: {product.vendor.service_areas.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
