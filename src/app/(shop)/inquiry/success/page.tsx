'use client'

import { Header } from '@/components/shared/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { CheckCircleIcon, EnvelopeIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function InquirySuccessPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto">
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-black text-white flex items-center justify-center">
                <CheckCircleIcon className="h-12 w-12" />
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Quote Request Sent!</h1>
              <p className="text-lg text-muted-foreground">
                Your quote request has been sent to vendors. You'll receive responses within 24-48
                hours.
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              <Card className="border-2 border-black p-6">
                <EnvelopeIcon className="h-8 w-8 mb-4" />
                <h3 className="font-bold mb-2">Check Your Email</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a confirmation with your request details and links to purchase items.
                </p>
              </Card>

              <Card className="border-2 border-black p-6">
                <ClockIcon className="h-8 w-8 mb-4" />
                <h3 className="font-bold mb-2">Vendors Respond</h3>
                <p className="text-sm text-muted-foreground">
                  Vendors will review your request and send personalized quotes within 1-2 days.
                </p>
              </Card>
            </div>

            {/* Next Steps */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">What's Next?</h2>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-black text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Wait for Vendor Quotes</p>
                    <p className="text-sm text-muted-foreground">
                      Vendors will email you directly with pricing and availability
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-black text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Compare Quotes</p>
                    <p className="text-sm text-muted-foreground">
                      Review pricing, terms, and vendor ratings
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-black text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Book Direct</p>
                    <p className="text-sm text-muted-foreground">
                      Work directly with vendors to finalize your booking
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/marketplace" className="flex-1">
                <Button variant="outline" size="lg" className="w-full border-2">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/visualizer" className="flex-1">
                <Button size="lg" className="w-full border-2">
                  <SparklesIcon className="mr-2 h-5 w-5" />
                  Visualize My Venue
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
