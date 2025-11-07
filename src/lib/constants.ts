export const PRODUCT_CATEGORIES = [
  'Decor',
  'Furniture',
  'Tableware',
  'Lighting',
  'Floral',
  'Signage',
  'Linens',
  'Backdrops',
  'Other',
] as const

export const STYLE_TAGS = [
  'Modern',
  'Rustic',
  'Elegant',
  'Bohemian',
  'Minimalist',
  'Vintage',
  'Industrial',
  'Garden',
  'Beach',
  'Classic',
] as const

export const COLOR_PALETTE = [
  'White',
  'Black',
  'Gold',
  'Silver',
  'Blush',
  'Sage',
  'Navy',
  'Burgundy',
  'Champagne',
  'Clear',
] as const

export const PRICE_RANGES = [
  { label: 'Under $100', min: 0, max: 100 },
  { label: '$100 - $500', min: 100, max: 500 },
  { label: '$500 - $1,000', min: 500, max: 1000 },
  { label: '$1,000 - $2,500', min: 1000, max: 2500 },
  { label: 'Over $2,500', min: 2500, max: Infinity },
] as const

export const ITEMS_PER_PAGE = 24
