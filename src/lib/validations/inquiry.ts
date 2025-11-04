import { z } from 'zod'

export const inquirySchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  event_date: z.string().optional(),
  venue_name: z.string().max(200).optional(),
  venue_location: z.string().max(500).optional(),
  guest_count: z.number().int().min(1).max(10000).optional().nullable(),
  products: z.array(z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().min(1).default(1),
    notes: z.string().optional(),
  })).min(1, 'At least one product is required'),
  customer_notes: z.string().max(2000).optional(),
})

export const inquiryCreateSchema = inquirySchema.extend({
  user_id: z.string().uuid().optional().nullable(),
})

export const inquiryUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['pending', 'quoted', 'booked', 'cancelled']),
  admin_notes: z.string().max(2000).optional(),
})

export const inquiryResponseSchema = z.object({
  inquiry_id: z.string().uuid(),
  vendor_id: z.string().uuid(),
  message: z.string().min(10).max(2000),
  quoted_price: z.number().positive().optional(),
})

export type InquiryFormData = z.infer<typeof inquirySchema>
export type InquiryCreateData = z.infer<typeof inquiryCreateSchema>
export type InquiryUpdateData = z.infer<typeof inquiryUpdateSchema>
export type InquiryResponseData = z.infer<typeof inquiryResponseSchema>
