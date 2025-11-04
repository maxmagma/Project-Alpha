import { createClient } from '@/lib/supabase/server'
import { StatsCard } from '@/components/admin/stats-card'
import { Package, Users, MessageSquare, ShoppingBag, TrendingUp, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

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
          icon={AlertCircle}
          href="/admin/products"
          description="Awaiting approval"
        />
        <StatsCard
          title="Active Products"
          value={activeProducts || 0}
          icon={Package}
        />
        <StatsCard
          title="Vendors"
          value={totalVendors || 0}
          icon={Users}
          href="/admin/vendors"
          description={`${pendingVendors || 0} pending`}
        />
        <StatsCard
          title="Inquiries"
          value={totalInquiries || 0}
          icon={MessageSquare}
          href="/admin/inquiries"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Total Orders"
          value={totalOrders || 0}
          icon={ShoppingBag}
        />
        <StatsCard
          title="Growth"
          value="+12.5%"
          icon={TrendingUp}
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
              <Package className="h-8 w-8 mb-2" />
              <h3 className="font-semibold">Review Products</h3>
              <p className="text-sm text-muted-foreground">
                {pendingProducts || 0} pending approval
              </p>
            </a>
            <a
              href="/admin/vendors"
              className="p-4 border rounded-lg hover:bg-secondary transition-colors"
            >
              <Users className="h-8 w-8 mb-2" />
              <h3 className="font-semibold">Manage Vendors</h3>
              <p className="text-sm text-muted-foreground">
                {pendingVendors || 0} pending approval
              </p>
            </a>
            <a
              href="/admin/presets"
              className="p-4 border rounded-lg hover:bg-secondary transition-colors"
            >
              <TrendingUp className="h-8 w-8 mb-2" />
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
