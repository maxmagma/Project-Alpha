import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, formatDate } from '@/lib/utils/format'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function VendorInquiriesPage() {
  const supabase = await createClient()

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
          Complete your profile to start receiving inquiries
        </p>
      </div>
    )
  }

  // Get lead credit balance
  const { data: leadCredits } = await supabase
    .from('vendor_lead_credits')
    .select('*')
    .eq('vendor_id', vendor.id)
    .single()

  // Get inquiries that include this vendor's products
  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*')
    .contains('vendor_ids', [vendor.id])
    .order('created_at', { ascending: false })

  // Filter rental products for this vendor
  const inquiriesWithVendorProducts = inquiries?.map((inquiry) => {
    const vendorProducts = (inquiry.rental_products as any[])?.filter(
      (p: any) => p.vendor_id === vendor.id
    ) || []

    return {
      ...inquiry,
      vendorProducts,
      leadFee: vendor.lead_fee || 15.00,
    }
  }) || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quote Requests</h1>
          <p className="text-muted-foreground">
            Qualified leads from customers looking for your products
          </p>
        </div>
      </div>

      {/* Credit Balance Card */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CurrencyDollarIcon className="h-5 w-5" />
            Lead Credit Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">
                {formatPrice(leadCredits?.balance || 0)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Each lead costs {formatPrice(vendor.lead_fee || 15.00)}
              </p>
            </div>
            <Button variant="outline" className="border-2" asChild>
              <Link href="/vendor/credits">Add Credits</Link>
            </Button>
          </div>

          {leadCredits && leadCredits.balance < 50 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Low balance:</strong> Add more credits to continue receiving leads
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inquiries List */}
      {inquiriesWithVendorProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <EnvelopeIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No inquiries yet</h3>
            <p className="text-muted-foreground">
              When customers request quotes for your products, they'll appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {inquiriesWithVendorProducts.map((inquiry) => (
            <Card key={inquiry.id} className="border-2 border-black">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">
                      {inquiry.full_name}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatDate(inquiry.created_at)}</span>
                      <Badge
                        variant={
                          inquiry.status === 'pending' ? 'warning' :
                          inquiry.status === 'quoted' ? 'default' :
                          inquiry.status === 'booked' ? 'success' :
                          'danger'
                        }
                      >
                        {inquiry.status}
                      </Badge>
                      {inquiry.quality_score && inquiry.quality_score >= 80 && (
                        <Badge variant="success">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          High Quality Lead
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Lead Cost
                    </p>
                    <p className="text-lg font-bold">
                      {formatPrice(inquiry.leadFee)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column - Customer & Event Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider mb-3">
                        Contact Information
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <EnvelopeIcon className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`mailto:${inquiry.email}`}
                            className="hover:underline"
                          >
                            {inquiry.email}
                          </a>
                        </div>
                        {inquiry.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={`tel:${inquiry.phone}`}
                              className="hover:underline"
                            >
                              {inquiry.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider mb-3">
                        Event Details
                      </h3>
                      <div className="space-y-2">
                        {inquiry.event_date && (
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(inquiry.event_date)}</span>
                          </div>
                        )}
                        {inquiry.venue_name && (
                          <div className="flex items-start gap-2 text-sm">
                            <MapPinIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="font-medium">{inquiry.venue_name}</p>
                              {inquiry.venue_location && (
                                <p className="text-muted-foreground">
                                  {inquiry.venue_location}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        {inquiry.guest_count && (
                          <div className="flex items-center gap-2 text-sm">
                            <UsersIcon className="h-4 w-4 text-muted-foreground" />
                            <span>{inquiry.guest_count} guests</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {inquiry.customer_notes && (
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-2">
                          Customer Notes
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {inquiry.customer_notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Requested Products */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-3">
                      Requested Items
                    </h3>
                    <div className="space-y-3">
                      {inquiry.vendorProducts.map((product: any, index: number) => (
                        <div
                          key={index}
                          className="p-3 border border-black/10 bg-secondary"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-medium">{product.product_name}</p>
                            <p className="text-sm font-bold">
                              Qty: {product.quantity}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(Number(product.base_price))} per event
                          </p>
                          {product.notes && (
                            <p className="text-sm text-muted-foreground mt-2">
                              <em>Note: {product.notes}</em>
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t-2 border-black">
                      <div className="flex justify-between items-center">
                        <span className="text-sm uppercase tracking-wider text-muted-foreground">
                          Estimated Total
                        </span>
                        <span className="text-xl font-bold">
                          {formatPrice(
                            inquiry.vendorProducts.reduce(
                              (sum: number, p: any) =>
                                sum + Number(p.base_price) * p.quantity,
                              0
                            )
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-6 border-t-2 border-black flex gap-3">
                  <Button asChild className="border-2">
                    <a href={`mailto:${inquiry.email}?subject=Quote for ${inquiry.full_name}'s Event`}>
                      <EnvelopeIcon className="mr-2 h-4 w-4" />
                      Send Quote via Email
                    </a>
                  </Button>
                  {inquiry.phone && (
                    <Button variant="outline" asChild className="border-2">
                      <a href={`tel:${inquiry.phone}`}>
                        <PhoneIcon className="mr-2 h-4 w-4" />
                        Call Customer
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
