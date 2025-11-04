import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000).optional(),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  base_price: z.number().min(0, 'Price must be positive'),
  price_type: z.enum(['rental', 'purchase', 'quote']),
  fulfillment_type: z.enum(['shippable', 'rental', 'service']),
  style_tags: z.array(z.string()).default([]),
  color_palette: z.array(z.string()).default([]),
  quantity_available: z.number().int().min(0).optional().nullable(),
  dimensions: z.object({
    length: z.number().positive().optional(),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
    weight: z.number().positive().optional(),
    unit: z.enum(['in', 'cm', 'ft', 'm']).optional(),
  }).optional().nullable(),
  meta_title: z.string().max(60).optional(),
  meta_description: z.string().max(160).optional(),
})

export const productCreateSchema = productSchema.extend({
  vendor_id: z.string().uuid(),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
})

export const productUpdateSchema = productSchema.partial().extend({
  id: z.string().uuid(),
})

export const productImageSchema = z.object({
  url: z.string().url(),
  alt_text: z.string().max(200).optional(),
  sort_order: z.number().int().min(0).default(0),
})

export type ProductFormData = z.infer<typeof productSchema>
export type ProductCreateData = z.infer<typeof productCreateSchema>
export type ProductUpdateData = z.infer<typeof productUpdateSchema>
export type ProductImageData = z.infer<typeof productImageSchema>
