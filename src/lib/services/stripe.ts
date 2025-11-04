import Stripe from 'stripe'

// Allow build to succeed without Stripe key
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not defined - payment processing will not work')
}

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export async function createPaymentIntent(
  amount: number,
  metadata?: Record<string, string>
) {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata,
  })
}

export async function createCheckoutSession({
  line_items,
  customer_email,
  success_url,
  cancel_url,
  metadata,
}: {
  line_items: Stripe.Checkout.SessionCreateParams.LineItem[]
  customer_email?: string
  success_url: string
  cancel_url: string
  metadata?: Record<string, string>
}) {
  return await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items,
    customer_email,
    success_url,
    cancel_url,
    metadata,
    shipping_address_collection: {
      allowed_countries: ['US', 'CA'],
    },
  })
}

export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined')
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}
