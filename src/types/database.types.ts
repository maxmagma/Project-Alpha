export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'customer' | 'vendor' | 'admin'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'customer' | 'vendor' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'customer' | 'vendor' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          user_id: string | null
          company_name: string
          slug: string
          description: string | null
          logo_url: string | null
          website: string | null
          phone: string | null
          service_areas: string[] | null
          years_in_business: number | null
          insurance_verified: boolean
          status: 'pending' | 'approved' | 'rejected' | 'suspended'
          approved_at: string | null
          commission_rate: number
          total_products: number
          total_inquiries: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          company_name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          website?: string | null
          phone?: string | null
          service_areas?: string[] | null
          years_in_business?: number | null
          insurance_verified?: boolean
          status?: 'pending' | 'approved' | 'rejected' | 'suspended'
          approved_at?: string | null
          commission_rate?: number
          total_products?: number
          total_inquiries?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          company_name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          website?: string | null
          phone?: string | null
          service_areas?: string[] | null
          years_in_business?: number | null
          insurance_verified?: boolean
          status?: 'pending' | 'approved' | 'rejected' | 'suspended'
          approved_at?: string | null
          commission_rate?: number
          total_products?: number
          total_inquiries?: number
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          vendor_id: string
          name: string
          slug: string
          description: string | null
          category: string
          subcategory: string | null
          base_price: number
          price_type: 'rental' | 'purchase' | 'quote'
          fulfillment_type: 'shippable' | 'rental' | 'service'
          images: string[]
          primary_image: string | null
          style_tags: string[]
          color_palette: string[]
          dimensions: Json | null
          quantity_available: number | null
          status: 'pending' | 'approved' | 'rejected'
          is_active: boolean
          featured: boolean
          meta_title: string | null
          meta_description: string | null
          views: number
          inquiries: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          name: string
          slug: string
          description?: string | null
          category: string
          subcategory?: string | null
          base_price: number
          price_type?: 'rental' | 'purchase' | 'quote'
          fulfillment_type?: 'shippable' | 'rental' | 'service'
          images?: string[]
          primary_image?: string | null
          style_tags?: string[]
          color_palette?: string[]
          dimensions?: Json | null
          quantity_available?: number | null
          status?: 'pending' | 'approved' | 'rejected'
          is_active?: boolean
          featured?: boolean
          meta_title?: string | null
          meta_description?: string | null
          views?: number
          inquiries?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          name?: string
          slug?: string
          description?: string | null
          category?: string
          subcategory?: string | null
          base_price?: number
          price_type?: 'rental' | 'purchase' | 'quote'
          fulfillment_type?: 'shippable' | 'rental' | 'service'
          images?: string[]
          primary_image?: string | null
          style_tags?: string[]
          color_palette?: string[]
          dimensions?: Json | null
          quantity_available?: number | null
          status?: 'pending' | 'approved' | 'rejected'
          is_active?: boolean
          featured?: boolean
          meta_title?: string | null
          meta_description?: string | null
          views?: number
          inquiries?: number
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt_text: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt_text?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          alt_text?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      style_presets: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          thumbnail_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          thumbnail_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          thumbnail_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string | null
          session_id: string | null
          product_id: string
          quantity: number
          price_snapshot: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          product_id: string
          quantity?: number
          price_snapshot?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          product_id?: string
          quantity?: number
          price_snapshot?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          user_id: string | null
          email: string
          phone: string | null
          full_name: string | null
          event_date: string | null
          venue_name: string | null
          venue_location: string | null
          guest_count: number | null
          products: Json
          total_value: number | null
          status: 'pending' | 'quoted' | 'booked' | 'cancelled'
          vendor_responses: Json
          customer_notes: string | null
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          email: string
          phone?: string | null
          full_name?: string | null
          event_date?: string | null
          venue_name?: string | null
          venue_location?: string | null
          guest_count?: number | null
          products: Json
          total_value?: number | null
          status?: 'pending' | 'quoted' | 'booked' | 'cancelled'
          vendor_responses?: Json
          customer_notes?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string
          phone?: string | null
          full_name?: string | null
          event_date?: string | null
          venue_name?: string | null
          venue_location?: string | null
          guest_count?: number | null
          products?: Json
          total_value?: number | null
          status?: 'pending' | 'quoted' | 'booked' | 'cancelled'
          vendor_responses?: Json
          customer_notes?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'customer' | 'vendor' | 'admin'
      product_status: 'pending' | 'approved' | 'rejected'
      fulfillment_type: 'shippable' | 'rental' | 'service'
      inquiry_status: 'pending' | 'quoted' | 'booked' | 'cancelled'
    }
  }
}
