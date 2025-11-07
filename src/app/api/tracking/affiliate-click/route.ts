import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const affiliateClickSchema = z.object({
  productId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { productId } = affiliateClickSchema.parse(body)

    // Get user ID if authenticated (optional)
    const { data: { user } } = await supabase.auth.getUser()

    // Create affiliate click record
    const { error: clickError } = await supabase
      .from('affiliate_clicks')
      .insert({
        product_id: productId,
        user_id: user?.id || null,
        clicked_at: new Date().toISOString(),
      })

    if (clickError) {
      console.error('Error creating affiliate click record:', clickError)
      // Don't fail the request if tracking fails
    }

    // Increment the affiliate_clicks counter on the product
    const { error: incrementError } = await supabase.rpc('increment_affiliate_clicks', {
      product_id: productId,
    })

    if (incrementError) {
      console.error('Error incrementing affiliate clicks:', incrementError)
      // Don't fail the request if increment fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking affiliate click:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    // Return success even if tracking fails - don't block the user
    return NextResponse.json({ success: true })
  }
}
