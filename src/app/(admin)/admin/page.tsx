import { createClient } from '@/lib/supabase/server'
import { StatsCard } from '@/components/admin/stats-card'
import { CubeIcon, UsersIcon, ChatBubbleLeftRightIcon, ShoppingBagIcon, ArrowTrendingUpIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Handle unconfigured Supabase
  if (!supabase) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Configuration Required</h2>
        <p className="text-muted-foreground">
          Please configure Supabase environment variables in .env.local
        </p>
      </div>
    )
  }

  const [
    { count: pendingProducts },
    { count: activeProducts },
    { count: pendingVendors },
    { count: totalVendors },
    { count: totalInquiries },
    { count: totalOrders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('vendors').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('vendors').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your marketplace
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Pending Products"
          value={pendingProducts || 0}
          icon={ExclamationCircleIcon}
          href="/admin/products"
          description="Awaiting approval"
        />
        <StatsCard
          title="Active Products"
          value={activeProducts || 0}
          icon={CubeIcon}
        />
        <StatsCard
          title="Vendors"
          value={totalVendors || 0}
          icon={UsersIcon}
          href="/admin/vendors"
          description={`${pendingVendors || 0} pending`}
        />
        <StatsCard
          title="Inquiries"
          value={totalInquiries || 0}
          icon={ChatBubbleLeftRightIcon}
          href="/admin/inquiries"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Total Orders"
          value={totalOrders || 0}
          icon={ShoppingBagIcon}
        />
        <StatsCard
          title="Growth"
          value="+12.5%"
          icon={ArrowTrendingUpIcon}
          description="vs last month"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/products"
              className="p-4 border rounded-lg hover:bg-secondary transition-colors"
            >
              <CubeIcon className="h-8 w-8 mb-2" />
              <h3 className="font-semibold">Review Products</h3>
              <p className="text-sm text-muted-foreground">
                {pendingProducts || 0} pending approval
              </p>
            </a>
            <a
              href="/admin/vendors"
              className="p-4 border rounded-lg hover:bg-secondary transition-colors"
            >
              <UsersIcon className="h-8 w-8 mb-2" />
              <h3 className="font-semibold">Manage Vendors</h3>
              <p className="text-sm text-muted-foreground">
                {pendingVendors || 0} pending approval
              </p>
            </a>
            <a
              href="/admin/presets"
              className="p-4 border rounded-lg hover:bg-secondary transition-colors"
            >
              <ArrowTrendingUpIcon className="h-8 w-8 mb-2" />
              <h3 className="font-semibold">Style Presets</h3>
              <p className="text-sm text-muted-foreground">
                Manage AI visualizer presets
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
