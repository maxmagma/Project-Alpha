import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/marketplace/product-grid'
import { ProductFilters } from '@/components/marketplace/product-filters'
import { SearchBar } from '@/components/marketplace/search-bar'
import { Skeleton } from '@/components/ui/skeleton'
import { ITEMS_PER_PAGE } from '@/lib/constants'

export const revalidate = 3600 // Revalidate every hour

interface PageProps {
  searchParams: {
    category?: string
    style?: string
    price?: string
    search?: string
    page?: string
  }
}

async function getProducts(filters: PageProps['searchParams']) {
  const supabase = await createClient()

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
  const { products, totalCount } = await getProducts(searchParams)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 text-center">
            Wedding Marketplace
          </h1>
          <p className="text-xl text-gray-300 mb-8 text-center">
            Curated products and rentals for your perfect day
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters />
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                {totalCount} {totalCount === 1 ? 'product' : 'products'}
              </p>
            </div>

            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid products={products} />
            </Suspense>

            {/* Pagination would go here */}
          </main>
        </div>
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
