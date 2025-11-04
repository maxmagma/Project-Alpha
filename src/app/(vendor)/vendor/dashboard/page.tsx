import { createClient } from '@/lib/supabase/server'
import { StatsCard } from '@/components/admin/stats-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, MessageSquare, Eye, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils/format'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function VendorDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get vendor profile
  const { data: vendor } = await supabase
    .from('vendors')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!vendor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Set up your vendor profile</h2>
        <p className="text-muted-foreground mb-6">
          Complete your profile to start listing products
        </p>
      </div>
    )
  }

  // Get statistics
  const [
    { count: totalProducts },
    { count: pendingProducts },
    { count: approvedProducts },
    { count: totalInquiries },
    { data: recentProducts },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('vendor_id', vendor.id),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('vendor_id', vendor.id).eq('status', 'pending'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('vendor_id', vendor.id).eq('status', 'approved'),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*').eq('vendor_id', vendor.id).order('created_at', { ascending: false }).limit(5),
  ])

  // Calculate total views
  const totalViews = recentProducts?.reduce((sum, p) => sum + (p.views || 0), 0) || 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {vendor.company_name}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your products
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value={totalProducts || 0}
          icon={Package}
          href="/vendor/products"
        />
        <StatsCard
          title="Approved Products"
          value={approvedProducts || 0}
          icon={TrendingUp}
          description={`${pendingProducts || 0} pending approval`}
        />
        <StatsCard
          title="Total Views"
          value={totalViews}
          icon={Eye}
          description="Last 30 days"
        />
        <StatsCard
          title="Inquiries"
          value={totalInquiries || 0}
          icon={MessageSquare}
          href="/vendor/inquiries"
        />
      </div>

      {/* Vendor Status */}
      {vendor.status === 'pending' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="warning">Pending Approval</Badge>
            </CardTitle>
            <CardDescription>
              Your vendor account is pending admin approval. You can add products, but they won't be visible until your account is approved.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Products</CardTitle>
          <CardDescription>Your most recently added products</CardDescription>
        </CardHeader>
        <CardContent>
          {recentProducts && recentProducts.length > 0 ? (
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {product.category} • Added {formatRelativeTime(product.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      {product.views} views
                    </div>
                    <Badge
                      variant={
                        product.status === 'approved' ? 'success' :
                        product.status === 'pending' ? 'warning' :
                        'danger'
                      }
                    >
                      {product.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No products yet. Start by adding your first product!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
