import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { productCreateSchema } from '@/lib/validations/product'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get vendor ID
    const { data: vendor } = await supabase
      .from('vendors')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = productCreateSchema.parse({
      ...body,
      vendor_id: vendor.id,
    })

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        ...validatedData,
        status: 'pending', // All new products start as pending
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
