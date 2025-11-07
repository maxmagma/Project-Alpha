import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { InventoryTable } from '@/components/admin/inventory/inventory-table'
import { InventoryFilters } from '@/components/admin/inventory/inventory-filters'
import { Button } from '@/components/ui/button'

interface PageProps {
  searchParams: Promise<{
    status?: string
    source?: string
    category?: string
    search?: string
    batch?: string
  }>
}

export default async function AdminInventoryPage({ searchParams }: PageProps) {
  const supabase = await createClient()

  if (!supabase) {
    redirect('/')
  }

  // Check admin access
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  // Await search params
  const params = await searchParams

  // Build query
  let query = supabase
    .from('scraped_products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  // Apply filters
  if (params.status) {
    query = query.eq('review_status', params.status)
  }
  if (params.source) {
    query = query.eq('import_source', params.source)
  }
  if (params.category) {
    query = query.eq('suggested_category', params.category)
  }
  if (params.batch) {
    query = query.eq('import_batch_id', params.batch)
  }
  if (params.search) {
    query = query.ilike('name', `%${params.search}%`)
  }

  const { data: products, count } = await query.limit(100)

  // Get stats
  const { count: pendingCount } = await supabase
    .from('scraped_products')
    .select('*', { count: 'exact', head: true })
    .eq('review_status', 'pending')

  const { count: reviewedCount } = await supabase
    .from('scraped_products')
    .select('*', { count: 'exact', head: true })
    .eq('review_status', 'reviewed')

  const { count: approvedCount } = await supabase
    .from('scraped_products')
    .select('*', { count: 'exact', head: true })
    .eq('review_status', 'approved')

  const { count: rejectedCount } = await supabase
    .from('scraped_products')
    .select('*', { count: 'exact', head: true })
    .eq('review_status', 'rejected')

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Product Inventory</h1>
            <p className="text-muted-foreground">
              Review and manage scraped products before publishing
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild className="border-2 border-black">
              <Link href="/admin/inventory/batches">Import History</Link>
            </Button>
            <Button variant="outline" asChild className="border-2 border-black">
              <Link href="/admin/inventory/config">Configuration</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Pending Review"
            count={pendingCount || 0}
            href="/admin/inventory?status=pending"
          />
          <StatCard
            label="Reviewed"
            count={reviewedCount || 0}
            href="/admin/inventory?status=reviewed"
          />
          <StatCard
            label="Approved"
            count={approvedCount || 0}
            href="/admin/inventory?status=approved"
          />
          <StatCard
            label="Rejected"
            count={rejectedCount || 0}
            href="/admin/inventory?status=rejected"
          />
        </div>
      </div>

      {/* Filters */}
      <InventoryFilters />

      {/* Table */}
      <div className="bg-white border-2 border-black">
        {products && products.length > 0 ? (
          <>
            <InventoryTable products={products} />
            <div className="p-4 border-t-2 border-black">
              <p className="text-sm text-muted-foreground">
                Showing {products.length} of {count} products
              </p>
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <p className="text-lg font-semibold mb-2">No products found</p>
            <p className="text-muted-foreground mb-6">
              {params.search || params.status || params.source
                ? 'Try adjusting your filters'
                : 'Import products to get started'}
            </p>
            <Button asChild className="border-2">
              <Link href="/admin/inventory/config">Configure Scrapers</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label,
  count,
  href,
}: {
  label: string
  count: number
  href: string
}) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white border-2 border-black p-6 hover:shadow-[8px_8px_0_0_#000] transition-shadow">
        <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
          {label}
        </p>
        <p className="text-4xl font-bold">{count}</p>
      </div>
    </Link>
  )
}
