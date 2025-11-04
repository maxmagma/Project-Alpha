import { z } from 'zod'

export const vendorSchema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters').max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000).optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  phone: z.string().regex(/^[\d\s\-\+\(\)]+$/, 'Must be a valid phone number').optional().or(z.literal('')),
  service_areas: z.array(z.string()).default([]),
  years_in_business: z.number().int().min(0).max(100).optional().nullable(),
})

export const vendorCreateSchema = vendorSchema.extend({
  user_id: z.string().uuid(),
})

export const vendorUpdateSchema = vendorSchema.partial().extend({
  id: z.string().uuid(),
})

export const vendorStatusUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['pending', 'approved', 'rejected', 'suspended']),
  approved_at: z.string().datetime().optional().nullable(),
})

export type VendorFormData = z.infer<typeof vendorSchema>
export type VendorCreateData = z.infer<typeof vendorCreateSchema>
export type VendorUpdateData = z.infer<typeof vendorUpdateSchema>
export type VendorStatusUpdateData = z.infer<typeof vendorStatusUpdateSchema>
