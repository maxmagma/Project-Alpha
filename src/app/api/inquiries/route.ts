import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendVendorLeadNotification, sendCustomerInquiryConfirmation } from '@/lib/services/resend'
import { z } from 'zod'

const inquirySchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string(),
  event_date: z.string().optional(),
  venue_name: z.string().optional(),
  venue_location: z.string().optional(),
  guest_count: z.number().nullable().optional(),
  customer_notes: z.string().optional(),
  rental_products: z.array(z.object({
    product_id: z.string(),
    product_name: z.string(),
    vendor_id: z.string().optional(),
    vendor_name: z.string().optional(),
    quantity: z.number(),
    base_price: z.string(),
    notes: z.string().optional(),
    primary_image: z.string().optional().nullable(),
  })),
  purchasable_products: z.array(z.object({
    product_id: z.string(),
    product_name: z.string(),
    affiliate_url: z.string().optional().nullable(),
    quantity: z.number(),
    base_price: z.string(),
  })),
  total_estimated_rental_value: z.number(),
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    const validatedData = inquirySchema.parse(body)

    // Extract unique vendor IDs from rental products
    const vendorIds = Array.from(
      new Set(
        validatedData.rental_products
          .map(p => p.vendor_id)
          .filter((id): id is string => Boolean(id))
      )
    )

    // Calculate quality score (basic scoring based on completeness)
    let qualityScore = 0
    if (validatedData.event_date) qualityScore += 20
    if (validatedData.venue_name) qualityScore += 15
    if (validatedData.venue_location) qualityScore += 15
    if (validatedData.guest_count) qualityScore += 20
    if (validatedData.phone) qualityScore += 15
    if (validatedData.customer_notes) qualityScore += 15

    // Calculate total lead fees (assuming $15 per lead, can be customized per vendor)
    const leadFeePerVendor = 15.00
    const totalLeadFees = vendorIds.length * leadFeePerVendor

    // Create inquiry
    const { data: inquiry, error: inquiryError } = await supabase
      .from('inquiries')
      .insert({
        user_id: user?.id || null,
        full_name: validatedData.full_name,
        email: validatedData.email,
        phone: validatedData.phone,
        event_date: validatedData.event_date || null,
        venue_name: validatedData.venue_name || null,
        venue_location: validatedData.venue_location || null,
        guest_count: validatedData.guest_count || null,
        customer_notes: validatedData.customer_notes || null,
        rental_products: validatedData.rental_products,
        purchasable_products: validatedData.purchasable_products,
        total_estimated_rental_value: validatedData.total_estimated_rental_value,
        vendor_ids: vendorIds,
        quality_score: qualityScore,
        total_lead_fees: totalLeadFees,
        status: 'pending',
      })
      .select()
      .single()

    if (inquiryError) {
      console.error('Error creating inquiry:', inquiryError)
      throw new Error('Failed to create inquiry')
    }

    // Deduct lead credits from vendors and send emails
    const vendorEmailPromises = vendorIds.map(async (vendorId) => {
      try {
        // Get vendor details including email
        const { data: vendor } = await supabase
          .from('vendors')
          .select('id, company_name, email, lead_fee')
          .eq('id', vendorId)
          .single()

        if (!vendor) return

        // Deduct lead credit using the stored procedure
        await supabase.rpc('deduct_vendor_lead_credit', {
          vendor_id: vendorId,
          inquiry_id: inquiry.id,
          amount: vendor.lead_fee || leadFeePerVendor,
        })

        // Get vendor's products for this inquiry
        const vendorProducts = validatedData.rental_products
          .filter(p => p.vendor_id === vendorId)
          .map(p => ({
            name: p.product_name,
            quantity: p.quantity,
            price: Number(p.base_price),
            notes: p.notes,
          }))

        // Send email to vendor
        await sendVendorLeadNotification({
          to: vendor.email,
          vendorName: vendor.company_name,
          inquiryId: inquiry.id,
          customerName: validatedData.full_name,
          customerEmail: validatedData.email,
          customerPhone: validatedData.phone,
          eventDate: validatedData.event_date,
          venueName: validatedData.venue_name,
          venueLocation: validatedData.venue_location,
          guestCount: validatedData.guest_count || undefined,
          products: vendorProducts,
          customerNotes: validatedData.customer_notes,
        })
      } catch (error) {
        console.error(`Error processing vendor ${vendorId}:`, error)
      }
    })

    // Send confirmation email to customer
    const vendorNames = validatedData.rental_products
      .map(p => p.vendor_name)
      .filter((name, index, self) => name && self.indexOf(name) === index) as string[]

    const customerEmailPromise = sendCustomerInquiryConfirmation({
      to: validatedData.email,
      customerName: validatedData.full_name,
      inquiryId: inquiry.id,
      rentalProducts: validatedData.rental_products.map(p => ({
        name: p.product_name,
        quantity: p.quantity,
        price: Number(p.base_price),
      })),
      purchasableProducts: validatedData.purchasable_products.map(p => ({
        name: p.product_name,
        quantity: p.quantity,
        affiliate_url: p.affiliate_url || undefined,
      })),
      eventDate: validatedData.event_date,
      vendorNames,
    })

    // Wait for all emails to send (but don't block the response)
    Promise.all([...vendorEmailPromises, customerEmailPromise]).catch(console.error)

    return NextResponse.json({
      inquiry,
      message: 'Quote request submitted successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating inquiry:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create inquiry' },
      { status: 500 }
    )
  }
}
