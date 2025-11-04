import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { inquiryCreateSchema } from '@/lib/validations/inquiry'
import { sendInquiryNotification } from '@/lib/services/resend'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    const validatedData = inquiryCreateSchema.parse({
      ...body,
      user_id: user?.id || null,
    })

    // Calculate total value
    const productIds = validatedData.products.map(p => p.product_id)
    const { data: products } = await supabase
      .from('products')
      .select('id, base_price, name, vendor:vendors(id, company_name, user_id)')
      .in('id', productIds)

    let totalValue = 0
    if (products) {
      products.forEach(product => {
        const inquiryProduct = validatedData.products.find(p => p.product_id === product.id)
        if (inquiryProduct) {
          totalValue += Number(product.base_price) * inquiryProduct.quantity
        }
      })
    }

    const { data: inquiry, error } = await supabase
      .from('inquiries')
      .insert({
        ...validatedData,
        total_value: totalValue,
      })
      .select()
      .single()

    if (error) throw error

    // Send email notifications to vendors (async, don't wait)
    // Email sending is handled in the background
    if (products) {
      products.forEach(async (product: any) => {
        if (product.vendor?.user_id) {
          // Get vendor email
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', product.vendor.user_id)
            .single()

          if (profile?.email) {
            sendInquiryNotification({
              to: profile.email,
              inquiryId: inquiry.id,
              customerName: validatedData.full_name,
              products: validatedData.products.map(p => ({
                name: product.name,
                quantity: p.quantity,
              })),
            }).catch(console.error)
          }
        }
      })
    }

    return NextResponse.json({ inquiry }, { status: 201 })
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to create inquiry' },
      { status: 500 }
    )
  }
}
