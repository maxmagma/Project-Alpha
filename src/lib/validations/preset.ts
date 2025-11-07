import { z } from 'zod'

export const presetSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().min(10).max(1000).optional(),
  thumbnail_url: z.string().url('Must be a valid URL').optional(),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
})

export const presetCreateSchema = presetSchema

export const presetUpdateSchema = presetSchema.partial().extend({
  id: z.string().uuid(),
})

export const presetProductSchema = z.object({
  preset_id: z.string().uuid(),
  product_id: z.string().uuid(),
  sort_order: z.number().int().min(0).default(0),
  is_required: z.boolean().default(true),
})

export type PresetFormData = z.infer<typeof presetSchema>
export type PresetCreateData = z.infer<typeof presetCreateSchema>
export type PresetUpdateData = z.infer<typeof presetUpdateSchema>
export type PresetProductData = z.infer<typeof presetProductSchema>
