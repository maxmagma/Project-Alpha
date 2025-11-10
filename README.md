# Wedding Marketplace

A modern, full-stack e-commerce marketplace platform for wedding products and services. Built with Next.js 15, featuring vendor management, AI-powered venue visualization, automated inventory management, integrated payments, and a brutalist design aesthetic.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-purple)](https://stripe.com/)
[![Anthropic](https://img.shields.io/badge/Anthropic-Claude-orange)](https://www.anthropic.com/)

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Routes](#api-routes)
- [User Roles & Permissions](#user-roles--permissions)
- [Design System](#design-system)
- [Key Routes](#key-routes)
- [Automated Inventory System](#automated-inventory-system)
- [Vision Board Feature](#vision-board-feature)
- [Inquiry System](#inquiry-system)
- [Development](#development)
- [Deployment](#deployment)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)

## Overview

Wedding Marketplace is a comprehensive e-commerce platform that connects wedding vendors with customers. The platform supports three distinct user roles (customers, vendors, and admins), each with specialized dashboards and functionality.

**Project Status**: ✅ Production Ready - All phases 1-5 complete

**Key Highlights:**
- 🛍️ Full-featured marketplace with advanced filtering and search
- 🤖 **Automated Product Inventory** - Scrape from Amazon/Etsy with AI categorization
- 🎨 **AI-powered venue visualization** using Stable Diffusion XL
- 🛒 **Vision Board** - Customers build collections and request quotes
- 💳 Stripe checkout integration with webhook handling
- 👥 Multi-role authentication system (customer, vendor, admin)
- 📧 Automated email notifications via Resend
- 🛒 Persistent cart for both authenticated and guest users
- 📱 Fully responsive, mobile-first design
- 🎯 Brutalist black & white aesthetic with sharp edges
- 📊 Performance optimizations with database indexes and React optimizations

## Key Features

### For Customers
- **Browse & Search**: Explore curated wedding products with advanced filtering by category, style tags, and price range
- **Shopping Cart**: Server-side cart that persists across sessions for both authenticated and guest users
- **Vision Board**: Build a collection of favorite products and request quotes from vendors all at once
- **Secure Checkout**: Stripe-powered payment processing with email confirmations
- **AI Venue Visualizer**: Upload venue photos and generate AI-styled previews with selected products
- **Request Quotes**: Submit inquiries for specific products with event details (date, venue, guest count)
- **Guest Support**: Shop without creating an account using session-based cart

### For Vendors
- **Vendor Dashboard**: Monitor performance metrics, product views, and inquiry statistics
- **Product Management**: Create, edit, and manage product listings with multiple images
- **Inquiry Management**: Receive and respond to customer inquiries and vision board requests with quotes
- **Multi-pricing Support**: Rental, purchase, or quote-based pricing models
- **Product Categorization**: Tag products with styles, colors, and categories
- **Approval Workflow**: Products reviewed by admins before going live
- **Lead Notifications**: Automatic email alerts for new inquiries

### For Admins
- **Admin Dashboard**: System-wide metrics and oversight of all platform activity
- **Product Approval**: Review and approve/reject pending product listings
- **Vendor Management**: Approve vendor applications and manage vendor status
- **Style Preset Management**: Configure AI visualizer style presets with product associations
- **Order Monitoring**: Track all platform orders, inquiries, and analytics
- **Automated Inventory**: Scrape products from Amazon/Etsy, AI-categorize with Claude, bulk approve/reject
- **Scraper Configuration**: Manage API keys and scraping settings

## Tech Stack

### Core Framework
- **Next.js 15** - React framework with App Router and Turbopack for fast builds
- **React 19 RC** - Latest React with concurrent features
- **TypeScript 5.3** - Type-safe development with strict mode

### Database & Authentication
- **Supabase** - PostgreSQL database with Row Level Security (RLS)
- **Supabase Auth** - JWT-based authentication with session management
- **Supabase SSR** - Server-side rendering and session handling
- **Custom Database Indexes** - Performance optimizations for common queries

### Payments & AI
- **Stripe v14** - Payment processing, checkout sessions, and webhooks
- **Replicate v0.25** - AI image generation (Stable Diffusion XL)
- **Anthropic Claude** - AI-powered product categorization and tagging
- **Resend v3** - Transactional email service for notifications
- **Sharp v0.33** - High-performance image optimization

### UI & Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled headless components
  - Checkbox, Dialog, Dropdown Menu, Label, Select, Slider, Toast
- **Heroicons 2.2** - Beautiful hand-crafted SVG icons
- **Lucide React** - Additional icon library
- **Sonner** - Toast notifications with elegant animations

### Form Handling & Validation
- **React Hook Form v7.49** - Performant form state management
- **Zod v3.22** - TypeScript-first schema validation
- **@hookform/resolvers** - Integration between React Hook Form and Zod

### Product Scraping & Import
- **Etsy API** - Official Etsy Open API v3 (FREE)
- **Scrapingdog / Rainforest API** - Amazon product scraping
- **Papa Parse** - CSV parsing for manual imports
- **Anthropic SDK** - Claude API for AI categorization

### Other Tools
- **nanoid v5.0** - Secure unique ID generation
- **nuqs v1.17** - Type-safe URL query string state management
- **Class Variance Authority** - Component variant management
- **clsx & tailwind-merge** - Conditional CSS classes

## Project Structure

```
/
├── src/
│   ├── app/                                    # Next.js App Router
│   │   ├── (marketing)/                        # Homepage and landing pages
│   │   │   └── page.tsx                        # Homepage with hero & features
│   │   ├── (shop)/                             # E-commerce flows
│   │   │   ├── marketplace/                    # Product listing & details
│   │   │   │   ├── page.tsx                    # Product grid with filters
│   │   │   │   └── [productId]/page.tsx        # Product detail page
│   │   │   ├── cart/page.tsx                   # Shopping cart
│   │   │   ├── checkout/page.tsx               # Checkout page
│   │   │   ├── inquiry/                        # Quote request flows
│   │   │   │   ├── page.tsx                    # Inquiry form
│   │   │   │   └── success/page.tsx            # Confirmation page
│   │   │   └── vision-board/page.tsx           # Vision board collection
│   │   ├── (vendor)/                           # Vendor-only routes
│   │   │   └── vendor/
│   │   │       ├── dashboard/page.tsx          # Vendor dashboard
│   │   │       ├── products/                   # Product management
│   │   │       │   ├── page.tsx                # Product list
│   │   │       │   ├── new/page.tsx            # Create product
│   │   │       │   └── [id]/edit/page.tsx      # Edit product
│   │   │       └── inquiries/page.tsx          # Inquiry management
│   │   ├── (admin)/                            # Admin-only routes
│   │   │   └── admin/
│   │   │       ├── page.tsx                    # Admin dashboard
│   │   │       ├── products/page.tsx           # Product approvals
│   │   │       ├── vendors/page.tsx            # Vendor management
│   │   │       ├── presets/page.tsx            # Style preset management
│   │   │       └── inventory/                  # Automated inventory system
│   │   │           ├── page.tsx                # Scraped products list
│   │   │           ├── [id]/edit/page.tsx      # Edit scraped product
│   │   │           ├── batches/page.tsx        # Import history
│   │   │           └── config/page.tsx         # Scraper configuration
│   │   ├── (visualizer)/                       # AI venue visualization
│   │   │   └── visualizer/page.tsx             # Visualizer tool
│   │   ├── auth/                               # Authentication pages
│   │   │   ├── login/page.tsx                  # Login page
│   │   │   ├── signup/page.tsx                 # Sign up page
│   │   │   └── callback/route.ts               # OAuth callback
│   │   ├── api/                                # API routes
│   │   │   ├── vendor/products/                # Vendor product API
│   │   │   ├── admin/                          # Admin APIs
│   │   │   │   ├── products/approve/route.ts   # Approve products
│   │   │   │   └── inventory/                  # Inventory APIs
│   │   │   │       ├── [id]/                   # Edit/approve/reject
│   │   │   │       ├── bulk/route.ts           # Bulk operations
│   │   │   │       └── config/route.ts         # Scraper config
│   │   │   ├── inquiries/route.ts              # Inquiry submission
│   │   │   ├── visualizer/generate/route.ts    # AI generation
│   │   │   ├── tracking/affiliate-click/       # Affiliate tracking
│   │   │   └── checkout/                       # Stripe integration
│   │   │       ├── route.ts                    # Create checkout
│   │   │       └── webhook/route.ts            # Stripe webhooks
│   │   ├── error.tsx                           # Global error boundary
│   │   ├── layout.tsx                          # Root layout
│   │   └── globals.css                         # Global styles
│   ├── components/
│   │   ├── ui/                                 # Base UI components (Radix)
│   │   │   ├── button.tsx                      # Button component
│   │   │   ├── card.tsx                        # Card component
│   │   │   ├── input.tsx                       # Input component
│   │   │   ├── dialog.tsx                      # Dialog/modal
│   │   │   ├── select.tsx                      # Select dropdown
│   │   │   ├── slider.tsx                      # Range slider
│   │   │   └── ...                             # Other Radix components
│   │   ├── shared/                             # Shared components
│   │   │   ├── header.tsx                      # Navigation header
│   │   │   ├── footer.tsx                      # Footer
│   │   │   └── loading-spinner.tsx             # Loading state
│   │   ├── marketplace/                        # Marketplace components
│   │   │   ├── product-card.tsx                # Product grid item
│   │   │   ├── product-grid.tsx                # Responsive grid
│   │   │   ├── product-filters.tsx             # Filter sidebar
│   │   │   └── search-bar.tsx                  # Search interface
│   │   ├── cart/                               # Cart UI components
│   │   │   ├── cart-item.tsx                   # Cart line item
│   │   │   └── add-to-cart-button.tsx          # Add button
│   │   ├── admin/                              # Admin components
│   │   │   ├── stats-card.tsx                  # Metric cards
│   │   │   ├── sidebar-nav.tsx                 # Admin navigation
│   │   │   └── inventory/                      # Inventory management
│   │   │       ├── inventory-table.tsx         # Scraped products table
│   │   │       ├── product-editor.tsx          # Edit scraped product
│   │   │       ├── bulk-actions.tsx            # Bulk approve/reject
│   │   │       ├── image-manager.tsx           # Image selection
│   │   │       ├── style-tag-selector.tsx      # Tag selector
│   │   │       ├── inventory-filters.tsx       # Filter controls
│   │   │       └── scraper-config-form.tsx     # Scraper settings
│   │   └── providers/                          # Context providers
│   │       ├── cart-provider.tsx               # Cart state (optimized)
│   │       └── vision-board-provider.tsx       # Vision board state
│   ├── lib/
│   │   ├── supabase/                           # Database clients
│   │   │   ├── client.ts                       # Browser client
│   │   │   ├── server.ts                       # Server client
│   │   │   └── middleware.ts                   # Session middleware
│   │   ├── services/                           # External API services
│   │   │   ├── stripe.ts                       # Stripe integration
│   │   │   ├── replicate.ts                    # AI image generation
│   │   │   └── resend.ts                       # Email service
│   │   ├── validations/                        # Zod validation schemas
│   │   │   ├── product.ts                      # Product validation
│   │   │   ├── vendor.ts                       # Vendor validation
│   │   │   ├── inquiry.ts                      # Inquiry validation
│   │   │   ├── checkout.ts                     # Checkout validation
│   │   │   └── preset.ts                       # Style preset validation
│   │   ├── utils/                              # Helper functions
│   │   │   └── cn.ts                           # Class name utilities
│   │   ├── constants.ts                        # App-wide constants
│   │   └── seo.ts                              # SEO utilities
│   └── types/
│       ├── database.types.ts                   # Auto-generated Supabase types
│       └── vision-board.ts                     # Vision board types
├── scripts/                                    # CLI tools
│   ├── scrape.ts                               # Main scraper CLI
│   ├── import.ts                               # Import pipeline CLI
│   ├── import/
│   │   └── import-pipeline.ts                  # AI categorization logic
│   └── scrapers/                               # Scraper implementations
│       ├── base-scraper.ts                     # Base scraper class
│       ├── amazon-scraper.ts                   # Amazon scraper
│       ├── etsy-scraper.ts                     # Etsy API scraper
│       └── manual-import.ts                    # CSV/JSON importer
├── supabase/
│   └── migrations/                             # Database migrations
│       ├── 001_initial_schema.sql              # Initial schema
│       ├── 002_add_performance_indexes.sql     # Performance indexes
│       ├── 20251104000001_add_inventory_system.sql  # Inventory tables
│       └── 20251105000001_vision_board_transformation.sql  # Vision board tables
├── docs/
│   ├── design/                                 # Design system docs
│   │   ├── README.md                           # Design philosophy
│   │   ├── COLORS.md                           # Color palette
│   │   ├── COMPONENTS.md                       # Component library
│   │   └── EXAMPLES.md                         # Code examples
│   └── setup-instructions.md                   # API key setup guide
├── public/                                     # Static assets
│   └── images/                                 # Public images
├── .env.example                                # Environment template
├── next.config.js                              # Next.js configuration
├── tailwind.config.ts                          # Tailwind configuration
├── tsconfig.json                               # TypeScript configuration
├── postcss.config.js                           # PostCSS configuration
├── .npmrc                                      # pnpm configuration
├── .claude/
│   ├── CLAUDE.md                               # Development guide for AI
│   └── commands/
│       └── prime.md                            # Project context loader
├── INVENTORY_SYSTEM.md                         # Inventory system docs
└── package.json                                # Dependencies and scripts
```

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **pnpm** (recommended) or npm
- **Supabase account** - [Create one here](https://supabase.com)
- **Stripe account** - [Sign up here](https://stripe.com)
- **Replicate account** - [Get API key](https://replicate.com)
- **Resend account** - [Get API key](https://resend.com)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd wedding-marketplace
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys (see [Environment Variables](#environment-variables) section).

4. **Run database migrations**

Open your Supabase project → SQL Editor, then run each migration file in order:
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_add_performance_indexes.sql`
- `supabase/migrations/20251104000001_add_inventory_system.sql` (optional)
- `supabase/migrations/20251105000001_vision_board_transformation.sql` (optional)

5. **Generate TypeScript types**
```bash
# Set your Supabase project ID
export SUPABASE_PROJECT_ID=your-project-id
pnpm supabase:gen-types
```

6. **Start the development server**
```bash
pnpm dev
```

Visit http://localhost:3000

## Environment Variables

### Core Application (Required)

```env
# Supabase - Database and Authentication
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # ⚠️ Server-side only!
SUPABASE_PROJECT_ID=your-project-id  # For type generation

# Stripe - Payments
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend - Email Notifications
RESEND_API_KEY=re_...

# Replicate - AI Venue Visualization
REPLICATE_API_TOKEN=r8_...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Product Scraping (Optional)

See `docs/setup-instructions.md` for detailed API key setup.

```env
# Anthropic Claude - AI Product Categorization
ANTHROPIC_API_KEY=sk-ant-...

# Etsy - Official API (FREE)
ETSY_API_KEY=your-etsy-keystring

# Amazon - Choose one scraping service
AMAZON_API_KEY=your-scrapingdog-or-rainforest-key

# Affiliate Links (Optional - Add later for passive income)
AMAZON_AFFILIATE_ID=yoursite-20
ETSY_AFFILIATE_ID=your-awin-id
```

**Note:** Product scraping is completely optional. The core marketplace works without it.

## Database Schema

### Core Tables

#### `profiles` (User Metadata)
Extends Supabase `auth.users` with application-specific data.

```typescript
{
  id: UUID (PK, FK → auth.users)
  email: string
  full_name: string | null
  role: 'customer' | 'vendor' | 'admin'
  avatar_url: string | null
  created_at: timestamp
  updated_at: timestamp
}
```

**RLS Policies**: Public read, users can update own profile

#### `vendors` (Vendor Business Info)
```typescript
{
  id: UUID (PK)
  user_id: UUID (FK → profiles.id)
  company_name: string
  business_email: string
  phone: string
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  website: string | null
  description: text | null
  specialties: string[]
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason: string | null
  created_at: timestamp
  updated_at: timestamp
}
```

**RLS Policies**: Vendors can read/update own, admins can manage all

#### `products` (Product Listings)
```typescript
{
  id: UUID (PK)
  vendor_id: UUID (FK → vendors.id)
  name: string
  description: text
  category: enum (ceremony, reception, decor, ...)
  base_price: decimal
  pricing_type: 'rental' | 'purchase' | 'quote'
  is_active: boolean
  status: 'pending' | 'approved' | 'rejected'
  style_tags: string[]  # bohemian, modern, rustic, etc.
  color_palette: string[]  # white, gold, greenery, etc.
  min_order_quantity: integer | null
  max_order_quantity: integer | null
  lead_time_days: integer | null
  primary_image_url: string | null
  is_featured: boolean
  view_count: integer
  created_at: timestamp
  updated_at: timestamp
}
```

**Indexes**:
- `idx_products_status_active` - Status and active filtering (50-80% faster queries)
- `idx_products_category_created` - Category filtering with sorting
- `idx_products_style_tags_gin` - Array contains queries for styles
- `idx_products_color_palette_gin` - Array contains queries for colors

**RLS Policies**: Public read (approved only), vendors manage own, admins manage all

#### `product_images` (Product Image Gallery)
```typescript
{
  id: UUID (PK)
  product_id: UUID (FK → products.id)
  image_url: string
  alt_text: string | null
  sort_order: integer
  created_at: timestamp
}
```

**Index**: `idx_product_images_product_id` - Fast image lookups

#### `cart_items` (Server-side Shopping Cart)
```typescript
{
  id: UUID (PK)
  user_id: UUID | null (FK → profiles.id)
  session_id: string | null  # For guest users
  product_id: UUID (FK → products.id)
  quantity: integer
  price_snapshot: decimal  # Price at time of add
  created_at: timestamp
  updated_at: timestamp
}
```

**Unique Constraint**: `(user_id, product_id)` OR `(session_id, product_id)`

#### `orders` (Purchase History)
```typescript
{
  id: UUID (PK)
  user_id: UUID | null (FK → profiles.id)
  stripe_payment_intent_id: string
  stripe_checkout_session_id: string
  total_amount: decimal
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  customer_email: string
  customer_name: string
  shipping_address: jsonb
  order_items: jsonb  # Snapshot of cart items
  created_at: timestamp
  updated_at: timestamp
}
```

**Indexes**:
- `idx_orders_payment_intent` - Webhook idempotency checks
- `idx_orders_user_created` - User order history

#### `inquiries` (Quote Requests & Vision Board Submissions)
```typescript
{
  id: UUID (PK)
  user_id: UUID | null (FK → profiles.id)
  full_name: string
  email: string
  phone: string
  event_date: date | null
  venue_name: string | null
  venue_location: string | null
  guest_count: integer | null
  customer_notes: text | null
  rental_products: jsonb  # Products from vision board
  purchasable_products: jsonb
  vendor_ids: UUID[]  # Vendors to notify
  total_estimated_rental_value: decimal
  quality_score: integer  # Completeness score
  total_lead_fees: decimal
  status: 'pending' | 'contacted' | 'quoted' | 'closed'
  created_at: timestamp
  updated_at: timestamp
}
```

### AI & Visualization Tables

#### `style_presets` (AI Visualizer Styles)
```typescript
{
  id: UUID (PK)
  name: string  # "Bohemian Garden", "Modern Minimalist"
  description: text
  prompt: text  # SDXL prompt template
  negative_prompt: text
  style_tags: string[]
  thumbnail_url: string | null
  is_active: boolean
  sort_order: integer
  created_at: timestamp
  updated_at: timestamp
}
```

#### `style_preset_products` (Suggested Products per Style)
```typescript
{
  id: UUID (PK)
  style_preset_id: UUID (FK → style_presets.id)
  product_id: UUID (FK → products.id)
  sort_order: integer
  created_at: timestamp
}
```

#### `visualizations` (Generated AI Images)
```typescript
{
  id: UUID (PK)
  user_id: UUID | null (FK → profiles.id)
  session_id: string | null
  style_preset_id: UUID (FK → style_presets.id)
  original_image_url: string
  generated_image_url: string
  replicate_prediction_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error_message: text | null
  created_at: timestamp
  updated_at: timestamp
}
```

### Inventory System Tables (Optional)

#### `scraped_products` (Staging Database)
```typescript
{
  id: UUID (PK)
  batch_id: UUID (FK → import_batches.id)
  source: 'amazon' | 'etsy' | 'manual'
  external_id: string  # ASIN or listing ID
  raw_data: jsonb  # Original scraped data

  # Normalized fields
  name: string
  description: text
  price: decimal
  currency: string
  images: string[]
  affiliate_url: string | null
  vendor_name: string | null

  # AI-categorized fields
  category: enum | null
  style_tags: string[]
  color_palette: string[]
  ai_confidence_score: decimal | null

  # Review status
  status: 'pending' | 'approved' | 'rejected' | 'duplicate'
  admin_notes: text | null
  matched_vendor_id: UUID | null
  created_product_id: UUID | null  # After approval

  created_at: timestamp
  updated_at: timestamp
}
```

#### `import_batches` (Import History)
```typescript
{
  id: UUID (PK)
  source: 'amazon' | 'etsy' | 'manual'
  search_query: string | null
  total_scraped: integer
  total_imported: integer
  total_approved: integer
  total_rejected: integer
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error_message: text | null
  created_by: UUID (FK → profiles.id)
  created_at: timestamp
  completed_at: timestamp | null
}
```

#### `scraper_configs` (API Configuration)
```typescript
{
  id: UUID (PK)
  name: string  # "Amazon Scrapingdog", "Etsy Official"
  source: 'amazon' | 'etsy'
  api_key: string  # Encrypted
  api_url: string
  is_active: boolean
  rate_limit: integer | null
  created_at: timestamp
  updated_at: timestamp
}
```

### Vision Board Tables

#### `vision_board_items` (Customer Collections)
```typescript
{
  id: UUID (PK)
  user_id: UUID | null (FK → profiles.id)
  session_id: string | null  # Guest support
  product_id: UUID (FK → products.id)
  quantity: integer
  notes: text | null
  created_at: timestamp
}
```

## API Routes

### Public APIs

#### `POST /api/inquiries`
Submit quote request or vision board inquiry.

**Request:**
```json
{
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "555-1234",
  "event_date": "2025-06-15",
  "venue_name": "Garden Estate",
  "venue_location": "Austin, TX",
  "guest_count": 150,
  "customer_notes": "Looking for bohemian style decor",
  "rental_products": [
    {
      "product_id": "uuid",
      "product_name": "Boho Arch",
      "vendor_id": "uuid",
      "vendor_name": "Boho Rentals",
      "quantity": 1,
      "base_price": "250.00"
    }
  ]
}
```

**Response:**
```json
{
  "inquiry": { "id": "uuid", ... },
  "message": "Quote request submitted successfully"
}
```

#### `POST /api/checkout`
Create Stripe checkout session.

**Request:**
```json
{
  "line_items": [
    {
      "product_id": "uuid",
      "quantity": 2
    }
  ]
}
```

**Response:**
```json
{
  "sessionId": "cs_test_..."
}
```

### Vendor APIs

#### `POST /api/vendor/products`
Create new product listing.

**Auth**: Vendor role required

**Request:**
```json
{
  "name": "Vintage Table Runner",
  "description": "Beautiful lace runner...",
  "category": "reception_decor",
  "base_price": 35.00,
  "pricing_type": "rental",
  "style_tags": ["vintage", "romantic"],
  "color_palette": ["white", "cream"]
}
```

**Response:**
```json
{
  "product": { "id": "uuid", "status": "pending", ... }
}
```

### Admin APIs

#### `POST /api/admin/products/approve`
Approve pending product.

**Auth**: Admin role required

**Request:**
```json
{
  "productId": "uuid"
}
```

#### `POST /api/admin/inventory/[id]/approve`
Approve scraped product and publish to marketplace.

**Auth**: Admin role required

**Response:**
```json
{
  "product": { "id": "uuid", ... },
  "message": "Product approved and published"
}
```

#### `POST /api/admin/inventory/bulk`
Bulk approve/reject scraped products.

**Auth**: Admin role required

**Request:**
```json
{
  "action": "approve" | "reject",
  "productIds": ["uuid1", "uuid2", ...]
}
```

### AI APIs

#### `POST /api/visualizer/generate`
Generate AI venue visualization.

**Request:**
```json
{
  "imageUrl": "https://...",
  "stylePresetId": "uuid"
}
```

**Response:**
```json
{
  "visualization": {
    "id": "uuid",
    "status": "processing",
    "replicate_prediction_id": "..."
  }
}
```

### Webhook Endpoints

#### `POST /api/checkout/webhook`
Stripe webhook handler (signature verification).

**Events handled:**
- `checkout.session.completed` - Create order, send emails
- `payment_intent.succeeded` - Update order status
- `payment_intent.payment_failed` - Mark order failed

## User Roles & Permissions

### Customer
**Access:**
- Browse all approved products
- Add to cart (guest or authenticated)
- Create vision board
- Submit inquiries
- Complete checkout
- View own order history

**Protected Routes:** None (can browse as guest)

### Vendor
**Access:**
- All customer permissions
- Vendor dashboard
- Create/edit own products
- View own product analytics
- Receive & respond to inquiries
- View own inquiry history

**Protected Routes:** `/vendor/*`

**Onboarding:**
1. Sign up as customer
2. Apply to become vendor (provide business info)
3. Admin reviews and approves
4. Role changed to `vendor` in database

### Admin
**Access:**
- All vendor permissions
- Admin dashboard with system-wide metrics
- Approve/reject products
- Approve/reject vendor applications
- Manage style presets
- Access inventory system
- Configure scrapers
- View all orders and inquiries

**Protected Routes:** `/admin/*`

## Design System

WeddingHub follows a **Brutalist Design Philosophy** with strict design standards. All UI work MUST follow these guidelines.

### Core Principles
1. **Monochromatic Palette**: Black (#000000), white (#FFFFFF), and grays only - NO colors allowed
2. **Sharp Geometry**: Zero border radius on all elements - NO rounded corners
3. **Bold Typography**: Strong hierarchy with uppercase labels and wide tracking
4. **High Contrast**: Maximum readability with black on white
5. **2px Borders**: Use `border-2 border-black` for emphasis
6. **Clean Aesthetics**: Inspired by minimal e-commerce (Curated Supply style)

### Design Documentation
**CRITICAL:** Before creating, editing, or modifying ANY UI component, page, or layout, you MUST consult:

- **Philosophy & Overview**: `/docs/design/README.md`
- **Color Guidelines**: `/docs/design/COLORS.md` - Complete color palette and usage rules
- **Component Patterns**: `/docs/design/COMPONENTS.md` - Component library standards
- **Code Examples**: `/docs/design/EXAMPLES.md` - Real-world implementation examples

### Key Design Rules

```tsx
// ✅ CORRECT - Sharp corners, black borders, high contrast
<Button className="border-2 border-black bg-black text-white">
  Primary Action
</Button>

<Button className="border-2 border-black bg-white text-black hover:bg-secondary">
  Secondary Action
</Button>

<Card className="border-2 border-black hover:shadow-lg transition-shadow">
  <div className="aspect-square bg-secondary relative">
    <Image src={img} alt={name} fill />
  </div>
  <div className="p-4">
    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
      CATEGORY
    </p>
    <h3 className="font-semibold mb-2">{name}</h3>
    <p className="text-lg font-bold">{price}</p>
  </div>
</Card>

// ❌ WRONG - Never use colors or rounded corners
<Button className="bg-blue-500 rounded-lg">❌ WRONG</Button>
<Card className="rounded-xl shadow-md">❌ WRONG</Card>
```

### Color Palette

```tsx
// Primary colors
'bg-black'           // #000000 - Primary actions, text
'bg-white'           // #FFFFFF - Backgrounds, secondary actions
'bg-secondary'       // #F5F5F5 - Subtle backgrounds

// Text colors
'text-foreground'    // #000000 - Primary text
'text-muted-foreground'  // #737373 - Secondary text

// Borders
'border-black'       // #000000 - All borders

// Focus states
'ring-black'         // #000000 - Focus rings
```

### Typography Scale

```tsx
// Headings
'text-5xl md:text-7xl font-bold'           // Hero titles
'text-3xl md:text-4xl font-bold'           // Section titles
'text-2xl font-bold'                       // Page titles
'text-xl font-semibold'                    // Card titles

// Body text
'text-base'                                // Primary body
'text-sm'                                  // Secondary text

// Labels & buttons
'text-xs uppercase tracking-wider font-bold'  // Category labels, button text
```

### Component Patterns

See `/docs/design/COMPONENTS.md` for complete component library documentation and `/docs/design/EXAMPLES.md` for copy-paste code examples.

## Key Routes

### Public Routes
- **Homepage**: http://localhost:3000
- **Marketplace**: http://localhost:3000/marketplace
- **Product Detail**: http://localhost:3000/marketplace/[id]
- **Cart**: http://localhost:3000/cart
- **Checkout**: http://localhost:3000/checkout
- **Vision Board**: http://localhost:3000/vision-board
- **Submit Inquiry**: http://localhost:3000/inquiry
- **AI Visualizer**: http://localhost:3000/visualizer

### Vendor Dashboard
- **Dashboard**: http://localhost:3000/vendor/dashboard
- **My Products**: http://localhost:3000/vendor/products
- **Add New Product**: http://localhost:3000/vendor/products/new ⭐
- **Edit Product**: http://localhost:3000/vendor/products/[id]/edit
- **Inquiries**: http://localhost:3000/vendor/inquiries

### Admin Dashboard
- **Dashboard**: http://localhost:3000/admin
- **Product Approvals**: http://localhost:3000/admin/products
- **Vendor Management**: http://localhost:3000/admin/vendors
- **Style Presets**: http://localhost:3000/admin/presets

### Admin Inventory System
- **Inventory Dashboard**: http://localhost:3000/admin/inventory ⭐
- **Edit Scraped Product**: http://localhost:3000/admin/inventory/[id]/edit
- **Import History**: http://localhost:3000/admin/inventory/batches
- **Scraper Configuration**: http://localhost:3000/admin/inventory/config

### Auth Routes
- **Login**: http://localhost:3000/auth/login
- **Signup**: http://localhost:3000/auth/signup
- **OAuth Callback**: http://localhost:3000/auth/callback

## Automated Inventory System

Scrape and import products from external marketplaces automatically with AI-powered categorization.

### Quick Start

```bash
# 1. Configure API keys (see docs/setup-instructions.md)
# Add to .env.local:
#   ANTHROPIC_API_KEY=sk-ant-...
#   ETSY_API_KEY=...
#   AMAZON_API_KEY=... (optional)

# 2. Scrape products
pnpm scrape:etsy "wedding centerpieces"
pnpm scrape:amazon "table linens rental"
pnpm scrape:all "boho arch"  # Scrape all sources

# 3. Import to staging database (with AI categorization)
pnpm import data/etsy-wedding-centerpieces.json
pnpm import data/amazon-table-linens-rental.json

# 4. Review in admin UI
# Go to http://localhost:3000/admin/inventory

# 5. Approve products to publish on marketplace
# Use bulk approve or edit individual products
```

### Features

- ✅ **Multi-source Scraping**: Amazon, Etsy, manual CSV/JSON imports
- ✅ **AI Categorization**: Claude automatically categorizes, tags, and analyzes pricing
- ✅ **Staging Database**: Review all products before publishing
- ✅ **Bulk Operations**: Approve/reject/edit multiple products at once
- ✅ **Duplicate Detection**: Prevents re-importing same products
- ✅ **Affiliate Tracking**: Optional commission links (Amazon Associates, Awin)
- ✅ **Vendor Auto-Creation**: Automatically creates or matches vendors
- ✅ **Image Management**: Select primary image from scraped images
- ✅ **Quality Scoring**: AI confidence scores for categorization

### Workflow

1. **Scrape** → External API calls fetch product data
2. **Import** → CLI tool calls Claude to categorize and normalize
3. **Stage** → Products saved to `scraped_products` table (status: pending)
4. **Review** → Admin reviews in `/admin/inventory` dashboard
5. **Edit** → Admin can override AI suggestions, adjust pricing, select images
6. **Approve** → Publish to `products` table, visible on marketplace
7. **Track** → Optional affiliate links for passive income

### CLI Commands

```bash
# Scraping
pnpm scrape                           # Interactive prompt
pnpm scrape:amazon "query"            # Amazon only
pnpm scrape:etsy "query"              # Etsy only
pnpm scrape:all "query"               # All sources
pnpm scrape:template                  # Generate CSV template

# Importing
pnpm import <file>                    # Import scraped JSON/CSV
pnpm import:manual <file>             # Manual import without AI
```

### Documentation

- **Setup Guide**: `docs/setup-instructions.md` - Get API keys, configure scrapers
- **System Architecture**: `INVENTORY_SYSTEM.md` - Complete technical documentation
- **Cost Estimates**: `INVENTORY_SYSTEM.md` - Pricing for APIs

### Cost Estimate (Optional Feature)

- **Minimal Start**: ~$2 (Anthropic + Etsy API)
- **Production Scale**: ~$45/month (includes Amazon scraping)
- **Affiliate Links**: Optional - add later for passive income

## Vision Board Feature

Customers can build a collection of favorite products and request quotes from multiple vendors at once.

### How It Works

1. **Browse Products**: Customers explore the marketplace
2. **Add to Vision Board**: Click "Add to Vision Board" button on product cards
3. **Build Collection**: Items persist across sessions (like Pinterest)
4. **Request Quotes**: Submit inquiry form with event details
5. **Vendor Notification**: All vendors with products in board receive email notifications
6. **Centralized Response**: Customers receive quotes from multiple vendors

### Features

- ✅ **Guest Support**: Works without authentication (session-based)
- ✅ **Persistent Storage**: Saved in database, survives page refreshes
- ✅ **Multi-vendor Quotes**: Request quotes from multiple vendors at once
- ✅ **Event Details**: Include date, venue, guest count with inquiry
- ✅ **Email Notifications**: Vendors receive detailed inquiries via email
- ✅ **Product Snapshots**: Inquiry includes product details and images

### Usage

```typescript
// Add to vision board
const { addItem } = useVisionBoard()
await addItem(product)

// View vision board
<Link href="/vision-board">
  <ShoppingBagIcon />
  <span>{totalItems} items</span>
</Link>

// Submit inquiry
POST /api/inquiries
{
  full_name, email, phone,
  event_date, venue_name, guest_count,
  rental_products: [{ product_id, vendor_id, quantity }]
}
```

### Database Tables

- `vision_board_items` - Customer collections
- `inquiries` - Quote requests with vision board data

## Inquiry System

Complete quote request and lead management system for vendors.

### Features

- ✅ **Quote Requests**: Customers submit inquiries for specific products
- ✅ **Vision Board Integration**: Submit entire collection for quotes
- ✅ **Email Notifications**: Vendors receive immediate email alerts
- ✅ **Customer Confirmations**: Customers receive confirmation emails
- ✅ **Lead Management**: Vendors manage inquiries in dashboard
- ✅ **Quality Scoring**: Inquiries scored by completeness (0-100)
- ✅ **Lead Fees**: Optional lead credit system for vendors
- ✅ **Multi-vendor Support**: One inquiry can notify multiple vendors

### Inquiry Flow

1. **Customer Submits**: Via `/inquiry` form or vision board
2. **AI Scoring**: System calculates quality score based on completeness
3. **Vendor Notification**: Email sent to all relevant vendors with:
   - Customer contact details
   - Event information (date, venue, guest count)
   - Requested products with quantities
   - Customer notes
4. **Customer Confirmation**: Email with inquiry summary and vendor list
5. **Vendor Dashboard**: Inquiry appears in `/vendor/inquiries`
6. **Response**: Vendors respond with quotes via email or phone

### Email Templates

- **Vendor Lead Notification**: Detailed inquiry with customer info
- **Customer Confirmation**: Summary with expected response time

## Development

### Development Commands

```bash
# Development server
pnpm dev                    # Start with Turbopack (fast)

# Build & production
pnpm build                  # Build for production
pnpm start                  # Start production server
pnpm lint                   # Run ESLint

# Database
pnpm supabase:gen-types     # Generate TypeScript types from schema

# Product scraping (optional)
pnpm scrape:amazon "query"  # Scrape Amazon
pnpm scrape:etsy "query"    # Scrape Etsy
pnpm scrape:all "query"     # Scrape all sources
pnpm import <file>          # Import with AI categorization
```

### Git Workflow

**CRITICAL RULES:**

1. **NEVER commit `/docs` folder** - Design docs excluded from repo
2. **NEVER mention "Claude" or "AI" in commit messages**
3. **Keep commit messages SHORT and human-like**
4. **Use imperative mood** - "Add feature" not "Added feature"

**Good commits:**
```bash
git commit -m "Fix product card layout on mobile"
git commit -m "Add vendor dashboard filtering"
git commit -m "Update checkout validation logic"
```

**Bad commits:**
```bash
# ❌ Too verbose
git commit -m "Updated the product card component to fix responsive layout issues"

# ❌ Mentions AI
git commit -m "Add vendor dashboard - Generated with Claude Code"

# ❌ Too long
git commit -m "Implement comprehensive product filtering system with..."
```

### Database Migrations

**NEVER run migration commands directly!** User must manually execute SQL in Supabase Dashboard.

```bash
# After creating migration SQL file:
# 1. Open Supabase Dashboard → SQL Editor
# 2. Copy contents of migration file
# 3. Execute SQL manually
# 4. Run type generation
pnpm supabase:gen-types
```

## Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Select Next.js framework preset

3. **Configure Environment Variables**

Add all variables from `.env.local` to Vercel:
- Project Settings → Environment Variables
- Add each variable (NEXT_PUBLIC_* and server-side keys)
- ⚠️ **Never commit `.env.local` to git!**

4. **Set Framework Overrides (Optional)**
- Build Command: `pnpm build`
- Output Directory: `.next`
- Install Command: `pnpm install`

5. **Configure External Services**

**Supabase:**
- Add Vercel domain to Supabase Auth redirect URLs
- Example: `https://yourapp.vercel.app/auth/callback`

**Stripe:**
- Add production webhook endpoint
- URL: `https://yourapp.vercel.app/api/checkout/webhook`
- Events: `checkout.session.completed`, `payment_intent.succeeded`
- Copy webhook secret to Vercel env vars

6. **Deploy**
- Vercel deploys automatically on push to main
- Preview deployments for pull requests
- Production deployment: `git push origin main`

### Custom Domain (Optional)

1. Add domain in Vercel project settings
2. Configure DNS records (A/CNAME)
3. Update `NEXT_PUBLIC_APP_URL` environment variable
4. Update Supabase callback URL
5. Update Stripe webhook URL

### Performance Optimizations

- ✅ **Database Indexes**: `002_add_performance_indexes.sql` (50-80% faster queries)
- ✅ **React Optimizations**: useMemo, useCallback in cart provider
- ✅ **Turbopack**: Fast development builds
- ✅ **Image Optimization**: Sharp for automatic resizing
- ✅ **Static Generation**: Where possible (marketing pages)
- ✅ **API Caching**: Supabase query caching

## Testing

### Test Accounts

**Admin:**
- Email: admin@example.com
- Create via SQL: `UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com'`

**Vendor:**
- Sign up normally
- Apply to become vendor via UI
- Admin approves via dashboard

**Customer:**
- Sign up normally (default role)

### Test Payment

**Stripe Test Cards:**
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
```
- Any future expiry date
- Any 3-digit CVC
- Any ZIP code

### Test AI Features

**Replicate:**
- Upload any venue photo
- Generation takes 30-60 seconds
- Check for sufficient credits

**Product Scraping:**
```bash
# Test Etsy scraping (FREE)
pnpm scrape:etsy "test"

# Test import with AI categorization
pnpm import data/etsy-test.json

# Check admin inventory dashboard
```

## Troubleshooting

### Build Failures

**Issue:** Build fails with environment variable errors

**Solution:**
```bash
# Ensure all required env vars are set
cat .env.local

# Required variables:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - STRIPE_SECRET_KEY
# - All other core variables
```

**Issue:** TypeScript errors for database types

**Solution:**
```bash
# Regenerate types from Supabase
pnpm supabase:gen-types
```

### Authentication Issues

**Issue:** Auth callback not working

**Solution:**
1. Check Supabase Auth callback URL:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
2. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
3. Check browser console for errors

**Issue:** RLS policies blocking queries

**Solution:**
```sql
-- Check if user has correct role
SELECT id, email, role FROM profiles WHERE email = 'your-email';

-- Update role if needed
UPDATE profiles SET role = 'admin' WHERE email = 'your-email';
```

### Payment Issues

**Issue:** Stripe checkout not loading

**Solution:**
1. Verify `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
2. Check Stripe API keys are for correct environment (test vs live)
3. Ensure webhook secret is configured if testing webhooks locally

**Issue:** Order not created after payment

**Solution:**
1. Check Stripe webhook is configured correctly
2. Verify webhook secret matches `.env.local`
3. Test webhook locally:
   ```bash
   # Install Stripe CLI
   stripe listen --forward-to localhost:3000/api/checkout/webhook

   # Trigger test event
   stripe trigger checkout.session.completed
   ```

### AI Feature Issues

**Issue:** Replicate generation fails

**Solution:**
1. Verify `REPLICATE_API_TOKEN` is correct
2. Check Replicate account has credits
3. Check error in visualization record:
   ```sql
   SELECT * FROM visualizations ORDER BY created_at DESC LIMIT 1;
   ```

**Issue:** Product categorization not working

**Solution:**
1. Verify `ANTHROPIC_API_KEY` is set
2. Check API key has credits
3. Run import with verbose logging:
   ```bash
   pnpm import data/test.json --verbose
   ```

### Database Issues

**Issue:** Migration already exists

**Solution:**
- Migrations should be run manually in Supabase Dashboard
- Never run migration commands via CLI
- If migration already applied, skip to next migration

**Issue:** Slow queries

**Solution:**
1. Ensure performance indexes are applied:
   - Run `002_add_performance_indexes.sql` in Supabase Dashboard
2. Check query performance in Supabase Dashboard → SQL Editor
3. Use `EXPLAIN ANALYZE` for slow queries

### Email Issues

**Issue:** Emails not sending

**Solution:**
1. Verify `RESEND_API_KEY` is correct
2. Check Resend dashboard for errors
3. Verify sender email is verified in Resend
4. Check email service implementation in `src/lib/services/resend.ts`

## Documentation

### Project Documentation

- **Design System**: `/docs/design/` - Complete UI/UX design standards ⭐
  - `README.md` - Design philosophy and overview
  - `COLORS.md` - Color palette and usage rules
  - `COMPONENTS.md` - Component library and patterns
  - `EXAMPLES.md` - Real-world code examples
- **Inventory System**: `INVENTORY_SYSTEM.md` - Complete scraping & import guide
- **Setup Guide**: `docs/setup-instructions.md` - API key setup step-by-step
- **Development Guide**: `.claude/CLAUDE.md` - Architecture and development patterns

### External Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Replicate Documentation](https://replicate.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com)
- [Resend Documentation](https://resend.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/docs)

## License

MIT

---

**Status**: ✅ Production Ready - All 5 phases complete!

**Latest Updates:**
- Performance optimizations (database indexes, React optimizations)
- Error boundaries for better error handling
- Automated product inventory with AI-powered categorization
- Vision board feature for customer collections
- Complete inquiry system with email notifications
- Scraping from Amazon/Etsy with affiliate tracking

Built with Next.js 15, Supabase, Stripe, Anthropic Claude, Replicate, and modern web technologies.
