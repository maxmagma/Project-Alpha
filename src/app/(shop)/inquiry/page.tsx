'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useVisionBoard } from '@/components/providers/vision-board-provider'
import { Header } from '@/components/shared/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils/format'
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const inquiryFormSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  event_date: z.string().min(1, 'Event date is required'),
  venue_name: z.string().optional(),
  venue_location: z.string().optional(),
  guest_count: z.string().optional(),
  customer_notes: z.string().optional(),
})

type InquiryFormData = z.infer<typeof inquiryFormSchema>

export default function InquiryPage() {
  const router = useRouter()
  const { rentalItems, purchasableItems, totalRentalValue } = useVisionBoard()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquiryFormSchema),
  })

  // Redirect if no rental items
  if (rentalItems.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">No Rental Items</h1>
              <p className="text-lg text-muted-foreground mb-8">
                You don't have any rental items in your vision board to request quotes for.
              </p>
              <Link href="/vision-board">
                <Button size="lg" className="border-2">
                  <ArrowLeftIcon className="mr-2 h-5 w-5" />
                  Back to Vision Board
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  const onSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true)

    try {
      // Prepare rental products data
      const rentalProducts = rentalItems.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        vendor_id: item.product.vendor?.id,
        vendor_name: item.product.vendor?.company_name,
        quantity: item.quantity,
        base_price: item.product.base_price,
        notes: item.notes,
        primary_image: item.product.primary_image,
      }))

      // Prepare purchasable products data (for reference)
      const purchasableProducts = purchasableItems.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        affiliate_url: item.product.affiliate_url || item.product.external_url,
        quantity: item.quantity,
        base_price: item.product.base_price,
      }))

      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          guest_count: data.guest_count ? parseInt(data.guest_count) : null,
          rental_products: rentalProducts,
          purchasable_products: purchasableProducts,
          total_estimated_rental_value: totalRentalValue,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to submit inquiry')
      }

      const result = await response.json()

      toast.success('Quote request submitted successfully!')

      // Redirect to confirmation page (or vision board)
      router.push('/inquiry/success')
    } catch (error) {
      console.error('Error submitting inquiry:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to submit inquiry')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get unique vendors
  const uniqueVendors = Array.from(
    new Set(rentalItems.map((item) => item.product.vendor?.company_name).filter(Boolean))
  )

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          {/* Back Button */}
          <Link href="/vision-board" className="inline-block mb-8">
            <Button variant="outline" size="sm" className="border-2">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Vision Board
            </Button>
          </Link>

          <div className="grid lg:grid-cols-[1fr_400px] gap-12">
            {/* Left Column - Form */}
            <div>
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Request Quotes</h1>
                <p className="text-lg text-muted-foreground">
                  Fill out your event details and we'll send your request to{' '}
                  {uniqueVendors.length === 1
                    ? uniqueVendors[0]
                    : `${uniqueVendors.length} vendors`}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Full Name <span className="text-red-600">*</span>
                      </label>
                      <Input
                        {...register('full_name')}
                        placeholder="Jane Smith"
                        className={errors.full_name ? 'border-red-600' : 'border-2 border-black'}
                      />
                      {errors.full_name && (
                        <p className="text-sm text-red-600 mt-1">{errors.full_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Email <span className="text-red-600">*</span>
                      </label>
                      <Input
                        {...register('email')}
                        type="email"
                        placeholder="jane@example.com"
                        className={errors.email ? 'border-red-600' : 'border-2 border-black'}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium mb-2 block">
                        Phone <span className="text-red-600">*</span>
                      </label>
                      <Input
                        {...register('phone')}
                        type="tel"
                        placeholder="(555) 123-4567"
                        className={errors.phone ? 'border-red-600' : 'border-2 border-black'}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Event Details</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium mb-2 block">
                        Event Date <span className="text-red-600">*</span>
                      </label>
                      <Input
                        {...register('event_date')}
                        type="date"
                        className={errors.event_date ? 'border-red-600' : 'border-2 border-black'}
                      />
                      {errors.event_date && (
                        <p className="text-sm text-red-600 mt-1">{errors.event_date.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Venue Name</label>
                      <Input
                        {...register('venue_name')}
                        placeholder="The Grand Ballroom"
                        className="border-2 border-black"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Guest Count</label>
                      <Input
                        {...register('guest_count')}
                        type="number"
                        placeholder="150"
                        className="border-2 border-black"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium mb-2 block">Venue Location</label>
                      <Input
                        {...register('venue_location')}
                        placeholder="Los Angeles, CA"
                        className="border-2 border-black"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Additional Notes</h2>
                  <Textarea
                    {...register('customer_notes')}
                    placeholder="Any special requirements, questions, or details vendors should know..."
                    className="border-2 border-black min-h-[120px]"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full border-2"
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <PaperAirplaneIcon className="mr-2 h-5 w-5" />
                      Send Quote Requests
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Right Column - Summary */}
            <div>
              <div className="sticky top-6">
                <Card className="border-2 border-black p-6">
                  <h2 className="text-xl font-bold mb-4">Rental Items Summary</h2>

                  <div className="space-y-4 mb-6">
                    {rentalItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 bg-secondary relative border border-black/10 flex-shrink-0">
                          {item.product.primary_image ? (
                            <Image
                              src={item.product.primary_image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-2 mb-1">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.product.vendor?.company_name}
                          </p>
                          <p className="text-xs font-medium mt-1">
                            Qty: {item.quantity} × {formatPrice(Number(item.product.base_price))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-black pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm uppercase tracking-wider text-muted-foreground">
                        Estimated Total
                      </span>
                      <span className="text-2xl font-bold">{formatPrice(totalRentalValue)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Vendors will provide final quotes
                    </p>
                  </div>

                  {purchasableItems.length > 0 && (
                    <div className="mt-6 pt-6 border-t-2 border-black">
                      <p className="text-sm text-muted-foreground">
                        You also have <strong>{purchasableItems.length} purchasable item
                        {purchasableItems.length !== 1 ? 's' : ''}</strong> in your vision board.
                        Links will be included in your confirmation email.
                      </p>
                    </div>
                  )}
                </Card>

                <div className="mt-6 p-4 bg-secondary">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">What happens next?</strong>
                    <br />
                    • Vendors receive your quote request
                    <br />
                    • They'll respond within 24-48 hours
                    <br />
                    • You'll receive quotes via email
                    <br />• Compare and book directly with vendors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
