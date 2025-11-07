/**
 * DISABLED: Stripe Checkout Route
 *
 * This route is currently disabled as the platform has transitioned to an
 * affiliate + lead generation model. No payment processing happens through
 * the platform - users either:
 * 1. Click through to purchase via affiliate links (purchasable products)
 * 2. Submit inquiry forms to get quotes from vendors (rental products)
 *
 * This code is preserved for potential future use if direct e-commerce
 * functionality is needed again.
 *
 * Date disabled: 2025-11-05
 */

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  return NextResponse.json(
    { error: 'Checkout is currently disabled. Please use the vision board to request quotes or click through to purchase products directly.' },
    { status: 501 }
  )
}

/* ORIGINAL CODE - Preserved for future use

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/services/stripe'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Get cart items
    let query = supabase
      .from('cart_items')
      .select('*, product:products(*)')

    if (user) {
      query = query.eq('user_id', user.id)
    } else {
      const { sessionId } = await request.json()
      if (!sessionId) {
        return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
      }
      query = query.eq('session_id', sessionId)
    }

    const { data: cartItems } = await query

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Create Stripe line items
    const line_items = cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          description: item.product.category,
          images: item.product.primary_image ? [item.product.primary_image] : [],
        },
        unit_amount: Math.round(Number(item.product.base_price) * 100),
      },
      quantity: item.quantity,
    }))

    const session = await createCheckoutSession({
      line_items,
      customer_email: user?.email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: {
        user_id: user?.id || '',
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

*/
