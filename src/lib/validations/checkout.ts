import { z } from 'zod'

export const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  phone: z.string().regex(/^[\d\s\-\+\(\)]+$/, 'Must be a valid phone number').optional(),
  shipping_address: z.object({
    line1: z.string().min(5, 'Address line 1 is required').max(200),
    line2: z.string().max(200).optional(),
    city: z.string().min(2, 'City is required').max(100),
    state: z.string().min(2, 'State is required').max(100),
    postal_code: z.string().min(3, 'Postal code is required').max(20),
    country: z.string().length(2, 'Country code must be 2 characters'),
  }).optional(),
  event_date: z.string().optional(),
  delivery_notes: z.string().max(500).optional(),
})

export const paymentIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3).default('usd'),
  metadata: z.record(z.string()).optional(),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
export type PaymentIntentData = z.infer<typeof paymentIntentSchema>
