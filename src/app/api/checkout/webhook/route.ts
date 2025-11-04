import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { constructWebhookEvent } from '@/lib/services/stripe'
import { createClient } from '@/lib/supabase/server'
import { sendOrderConfirmation } from '@/lib/services/resend'
import { nanoid } from 'nanoid'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    const event = await constructWebhookEvent(body, signature)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object

      const supabase = await createClient()

      // Get user cart items
      const userId = session.metadata?.user_id
      if (!userId) {
        console.log('No user ID in session metadata')
        return NextResponse.json({ received: true })
      }

      const { data: cartItems } = await supabase
        .from('cart_items')
        .select('*, product:products(*)')
        .eq('user_id', userId)

      if (!cartItems || cartItems.length === 0) {
        console.log('No cart items found')
        return NextResponse.json({ received: true })
      }

      // Create order
      const orderNumber = `WH-${nanoid(10).toUpperCase()}`
      const subtotal = cartItems.reduce((sum, item) =>
        sum + (Number(item.product.base_price) * item.quantity), 0
      )

      await supabase.from('orders').insert({
        user_id: userId,
        order_number: orderNumber,
        stripe_payment_intent_id: session.payment_intent as string,
        subtotal,
        total: Number(session.amount_total) / 100,
        items: cartItems.map(item => ({
          product_id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: Number(item.product.base_price),
        })),
        status: 'paid',
      })

      // Clear cart
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)

      // Send confirmation email
      if (session.customer_email) {
        await sendOrderConfirmation({
          to: session.customer_email,
          orderNumber,
          total: Number(session.amount_total) / 100,
          items: cartItems.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: Number(item.product.base_price),
          })),
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
