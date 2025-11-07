import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { formatPrice } from '@/lib/utils/format'

export const revalidate = 3600

interface PageProps {
  params: Promise<{
    productId: string
  }>
}

async function getProduct(productId: string) {
  const supabase = await createClient()

  // Handle unconfigured Supabase
  if (!supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('products')
    .select('*, vendor:vendors(*), images:product_images(*)')
    .eq('id', productId)
    .single()

  if (error || !data) return null

  return data
}

export async function generateMetadata({ params }: PageProps) {
  const { productId } = await params
  const product = await getProduct(productId)

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
  const { productId } = await params
  const product = await getProduct(productId)

  if (!product) {
    notFound()
  }

  const vendorName = product.vendor?.company_name || 'Vendor'

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {vendorName} • {product.category}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-2xl md:text-3xl font-bold">{formatPrice(Number(product.base_price))}</p>
              <Button size="lg" className="border-2">
                Purchase Link
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Image */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="aspect-square bg-secondary relative mb-12 border border-black/10">
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

          {/* About Section */}
          {product.description && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6">About</h2>
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed text-base">
                  {product.description}
                </p>
              </div>

              {/* Product Details */}
              {product.subcategory && (
                <div className="mt-8 pt-8 border-t">
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm text-muted-foreground mb-1">Category</dt>
                      <dd className="font-medium">{product.category}</dd>
                    </div>
                    {product.subcategory && (
                      <div>
                        <dt className="text-sm text-muted-foreground mb-1">Subcategory</dt>
                        <dd className="font-medium">{product.subcategory}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm text-muted-foreground mb-1">Type</dt>
                      <dd className="font-medium capitalize">{product.price_type}</dd>
                    </div>
                    {product.quantity_available && (
                      <div>
                        <dt className="text-sm text-muted-foreground mb-1">Availability</dt>
                        <dd className="font-medium">{product.quantity_available} available</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </div>
          )}

          {/* Style Tags as Featured In */}
          {product.style_tags.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Featured in</h2>
                <Link href="/marketplace/browse" className="text-sm text-muted-foreground hover:text-foreground">
                  See all
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {product.style_tags.slice(0, 2).map((tag) => (
                  <Link key={tag} href={`/marketplace?style=${tag}`}>
                    <div className="border border-black/10 p-6 hover:shadow-lg transition-shadow">
                      <div className="aspect-square bg-secondary mb-4 flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">Collection</span>
                      </div>
                      <h3 className="font-medium">{tag}</h3>
                      <p className="text-sm text-muted-foreground">View collection</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* More in Category */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">More in {product.category}</h2>
              <Link href={`/marketplace?category=${product.category}`} className="text-sm text-muted-foreground hover:text-foreground">
                See all
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Explore more products in this category
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
