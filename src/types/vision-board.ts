// Vision Board Types for Affiliate + Lead Generation Model

import { Database } from './database.types'

export type FulfillmentType = 'purchasable' | 'rental' | 'service'
export type AffiliateNetwork = 'amazon' | 'etsy' | 'direct' | 'sharesale' | 'awin'

// Base product type from database
type ProductRow = Database['public']['Tables']['products']['Row']

// Extended product with affiliate/rental fields
export interface Product extends ProductRow {
  // Fulfillment determines the user flow
  fulfillment_type: FulfillmentType

  // For purchasable items (affiliate model)
  external_url?: string | null
  affiliate_url?: string | null
  affiliate_network?: AffiliateNetwork | null
  commission_rate?: number | null

  // For rental items (lead generation)
  requires_quote: boolean
  lead_fee?: number | null

  // Metrics
  affiliate_clicks: number
  inquiry_clicks: number

  // Relations
  vendor?: {
    id: string
    company_name: string
    email: string
    lead_fee?: number
  }
}

// Vision Board Item (replaces cart item)
export interface VisionBoardItem {
  id: string
  user_id?: string
  session_id?: string
  product_id: string
  quantity: number
  notes?: string
  created_at: string

  // Populated product data
  product: Product
}

// Vision Board (saved collection)
export interface VisionBoard {
  id: string
  user_id?: string
  session_id?: string
  name: string
  description?: string
  visualization_id?: string | null
  is_public: boolean
  share_token?: string | null
  converted_to_inquiry: boolean
  created_at: string
  updated_at: string
}

// Affiliate Click Tracking
export interface AffiliateClick {
  id: string
  product_id: string
  user_id?: string | null
  session_id?: string | null
  clicked_at: string
  converted: boolean
  conversion_value?: number | null
  commission_earned?: number | null
  referrer?: string | null
  user_agent?: string | null
  ip_address?: string | null
}

// Inquiry Product (embedded in inquiry)
export interface InquiryProduct {
  product_id: string
  product_name: string
  vendor_id: string
  quantity: number
  price: number
  notes?: string
}

export interface PurchasableProduct {
  product_id: string
  product_name: string
  price: number
  affiliate_url?: string
  external_url?: string
}

// Inquiry (updated structure)
export interface Inquiry {
  id: string
  user_id?: string | null

  // Contact info
  email: string
  phone?: string
  full_name: string

  // Event details
  event_date?: string | null
  venue_name?: string | null
  venue_location?: string | null
  guest_count?: number | null
  notes?: string | null

  // Products - SPLIT by type
  rental_products: InquiryProduct[]
  purchasable_products: PurchasableProduct[]

  // Rental specifics
  total_estimated_rental_value?: number | null
  vendor_ids?: string[]
  vendor_responses?: any[]

  // Lead tracking
  quality_score?: number
  total_lead_fees?: number

  // Status
  status: 'pending' | 'quoted' | 'booked' | 'lost'

  created_at: string
  updated_at: string
}

// Vendor Lead Credits
export interface VendorLeadCredits {
  id: string
  vendor_id: string
  credits_remaining: number
  credits_purchased: number
  credits_used: number
  price_per_lead: number
  last_purchase_at?: string | null
  updated_at: string
}

// Form types for inquiry submission
export interface InquiryFormData {
  full_name: string
  email: string
  phone: string
  event_date?: string
  venue_name?: string
  venue_location?: string
  guest_count?: number
  notes?: string
}

// Vision Board Context Type
export interface VisionBoardContextType {
  items: VisionBoardItem[]
  addItem: (product: Product, quantity?: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  updateNotes: (itemId: string, notes: string) => Promise<void>
  clearBoard: () => Promise<void>

  // Computed values
  totalItems: number
  rentalItems: VisionBoardItem[]      // Items needing quotes
  purchasableItems: VisionBoardItem[] // Items to buy via affiliate
  totalRentalValue: number
  totalPurchaseValue: number

  // Loading state
  isLoading: boolean
}

// API Response types
export interface CreateInquiryRequest {
  full_name: string
  email: string
  phone: string
  event_date?: string
  venue_name?: string
  venue_location?: string
  guest_count?: number
  notes?: string
  rental_products: InquiryProduct[]
  purchasable_products: PurchasableProduct[]
  total_estimated_rental_value: number
}

export interface CreateInquiryResponse {
  success: boolean
  inquiryId: string
  vendorCount?: number
}

export interface TrackAffiliateClickRequest {
  productId: string
  referrer?: string
}

export interface TrackAffiliateClickResponse {
  success: boolean
}
