import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/marketplace/product-grid'
import { Skeleton } from '@/components/ui/skeleton'
import { ITEMS_PER_PAGE } from '@/lib/constants'

export const revalidate = 3600 // Revalidate every hour

interface PageProps {
  searchParams: Promise<{
    category?: string
    style?: string
    price?: string
    search?: string
    page?: string
  }>
}

type SearchParamsType = {
  category?: string
  style?: string
  price?: string
  search?: string
  page?: string
}

async function getProducts(filters: SearchParamsType) {
  const supabase = await createClient()

  // Handle unconfigured Supabase
  if (!supabase) {
    console.error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
    return { products: [], totalCount: 0 }
  }

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('status', 'approved')
    .eq('is_active', true)

  // Apply filters
  if (filters.category) {
    query = query.eq('category', filters.category)
  }

  if (filters.style) {
    query = query.contains('style_tags', [filters.style])
  }

  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  // Pagination
  const page = parseInt(filters.page || '1')
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  query = query
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return { products: [], totalCount: 0 }
  }

  return { products: data || [], totalCount: count || 0 }
}

export default async function MarketplacePage({ searchParams }: PageProps) {
  const filters = await searchParams
  const { products, totalCount } = await getProducts(filters)

  const categories = [
    { id: 'all', label: 'All', count: totalCount },
    { id: 'decor', label: 'Decor', count: 0 },
    { id: 'furniture', label: 'Furniture', count: 0 },
    { id: 'lighting', label: 'Lighting', count: 0 },
    { id: 'tableware', label: 'Tableware', count: 0 },
    { id: 'linens', label: 'Linens', count: 0 },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover well-designed, carefully curated products
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Subscribe for weekly emails featuring timeless, design-led products across home, work, and life.
            </p>
            <div className="flex max-w-md mx-auto gap-2">
              <input
                type="email"
                placeholder="name@email.com"
                className="flex-1 h-11 px-4 border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
              <button className="px-6 h-11 bg-black text-white font-medium border-2 border-black hover:bg-white hover:text-black transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="border-y bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.id === 'all' ? '/marketplace' : `/marketplace?category=${category.id}`}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap hover:bg-secondary transition-colors
                  ${filters.category === category.id || (category.id === 'all' && !filters.category) ? 'bg-secondary' : ''}
                `}
              >
                <span>{category.label}</span>
                <span className="text-xs text-muted-foreground">{category.count}</span>
              </Link>
            ))}
            <Link
              href="/marketplace/browse"
              className="ml-auto px-4 py-2 text-sm text-muted-foreground hover:text-foreground whitespace-nowrap"
            >
              See More
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid products={products} />
        </Suspense>
      </div>
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}
