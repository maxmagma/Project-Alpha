# Wedding Marketplace

A modern, full-stack e-commerce marketplace platform for wedding products and services. Built with Next.js 15, featuring vendor management, AI-powered venue visualization, integrated payments, and a brutalist design aesthetic.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-purple)](https://stripe.com/)

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
- [Development](#development)
- [Deployment](#deployment)
- [Features Deep Dive](#features-deep-dive)
- [Troubleshooting](#troubleshooting)

## Overview

Wedding Marketplace is a comprehensive e-commerce platform that connects wedding vendors with customers. The platform supports three distinct user roles (customers, vendors, and admins), each with specialized dashboards and functionality.

**Project Status**: ✅ Production Ready - All phases 1-4 complete

**Key Highlights:**
- 🛍️ Full-featured marketplace with advanced filtering and search
- 🎨 AI-powered venue visualization using Stable Diffusion XL
- 💳 Stripe checkout integration with webhook handling
- 👥 Multi-role authentication system (customer, vendor, admin)
- 📧 Automated email notifications via Resend
- 🛒 Persistent cart for both authenticated and guest users
- 📱 Fully responsive, mobile-first design
- 🎯 Brutalist black & white aesthetic with sharp edges

## Key Features

### For Customers
- **Browse & Search**: Explore curated wedding products with advanced filtering by category, style tags, and price range
- **Shopping Cart**: Server-side cart that persists across sessions for both authenticated and guest users
- **Secure Checkout**: Stripe-powered payment processing with email confirmations
- **AI Venue Visualizer**: Upload venue photos and generate AI-styled previews with selected products
- **Request Quotes**: Submit inquiries for specific products with event details (date, venue, guest count)
- **Guest Support**: Shop without creating an account using session-based cart

### For Vendors
- **Vendor Dashboard**: Monitor performance metrics, product views, and inquiry statistics
- **Product Management**: Create, edit, and manage product listings with multiple images
- **Inquiry Management**: Receive and respond to customer inquiries with quotes
- **Multi-pricing Support**: Rental, purchase, or quote-based pricing models
- **Product Categorization**: Tag products with styles, colors, and categories
- **Approval Workflow**: Products reviewed by admins before going live

### For Admins
- **Admin Dashboard**: System-wide metrics and oversight of all platform activity
- **Product Approval**: Review and approve/reject pending product listings
- **Vendor Management**: Approve vendor applications and manage vendor status
- **Style Preset Management**: Configure AI visualizer style presets with product associations
- **Order Monitoring**: Track all platform orders, inquiries, and analytics

## Tech Stack

### Core Framework
- **Next.js 15** - React framework with App Router and Turbopack for fast builds
- **React 19 RC** - Latest React with concurrent features
- **TypeScript 5.3** - Type-safe development with strict mode

### Database & Authentication
- **Supabase** - PostgreSQL database with Row Level Security (RLS)
- **Supabase Auth** - JWT-based authentication with session management
- **Supabase SSR** - Server-side rendering and session handling

### Payments & Integrations
- **Stripe v14** - Payment processing, checkout sessions, and webhooks
- **Replicate v0.25** - AI image generation (Stable Diffusion XL)
- **Resend v3** - Transactional email service for notifications
- **Sharp v0.33** - High-performance image optimization

### UI & Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled headless components
  - Checkbox, Dialog, Dropdown Menu, Label, Select, Slider, Toast
- **Heroicons 2.2** - Beautiful hand-crafted SVG icons
- **Sonner** - Toast notifications with elegant animations

### Form Handling & Validation
- **React Hook Form v7.49** - Performant form state management
- **Zod v3.22** - TypeScript-first schema validation
- **@hookform/resolvers** - Integration between React Hook Form and Zod

### Other Tools
- **nanoid v5.0** - Secure unique ID generation
- **nuqs v1.17** - Type-safe URL query string state management
- **Class Variance Authority** - Component variant management
- **clsx & tailwind-merge** - Conditional CSS classes

## Project Structure

```
/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (marketing)/              # Homepage and landing pages
│   │   │   └── page.tsx              # Homepage with hero & features
│   │   ├── (shop)/                   # E-commerce flows
│   │   │   ├── marketplace/          # Product listing & details
│   │   │   ├── cart/                 # Shopping cart
│   │   │   └── checkout/             # Checkout page
│   │   ├── (vendor)/                 # Vendor-only routes
│   │   │   ├── dashboard/            # Vendor dashboard
│   │   │   └── products/             # Product management
│   │   ├── (admin)/                  # Admin-only routes
│   │   │   ├── page.tsx              # Admin dashboard
│   │   │   ├── products/             # Product approvals
│   │   │   └── vendors/              # Vendor management
│   │   ├── (visualizer)/             # AI venue visualization
│   │   │   └── page.tsx              # Visualizer tool
│   │   ├── auth/                     # Authentication pages
│   │   │   ├── login/                # Login page
│   │   │   ├── signup/               # Sign up page
│   │   │   └── callback/             # OAuth callback
│   │   ├── api/                      # API routes
│   │   │   ├── vendor/products/      # Vendor product API
│   │   │   ├── admin/products/       # Admin product API
│   │   │   ├── inquiries/            # Inquiry submission
│   │   │   ├── visualizer/           # AI generation
│   │   │   └── checkout/             # Stripe integration
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── ui/                       # Base UI components
│   │   │   ├── button.tsx            # Button component
│   │   │   ├── card.tsx              # Card component
│   │   │   ├── input.tsx             # Input component
│   │   │   ├── dialog.tsx            # Dialog/modal
│   │   │   └── ...                   # Other Radix components
│   │   ├── shared/                   # Shared components
│   │   │   ├── Header.tsx            # Navigation header
│   │   │   ├── Footer.tsx            # Footer
│   │   │   └── LoadingSpinner.tsx    # Loading state
│   │   ├── marketplace/              # Marketplace components
│   │   │   ├── ProductCard.tsx       # Product grid item
│   │   │   ├── ProductGrid.tsx       # Responsive grid
│   │   │   ├── ProductFilters.tsx    # Filter sidebar
│   │   │   └── SearchBar.tsx         # Search interface
│   │   ├── cart/                     # Cart UI components
│   │   │   ├── CartItem.tsx          # Cart line item
│   │   │   └── AddToCartButton.tsx   # Add button
│   │   ├── admin/                    # Admin components
│   │   │   ├── StatsCard.tsx         # Metric cards
│   │   │   └── SidebarNav.tsx        # Admin navigation
│   │   └── providers/                # Context providers
│   │       └── CartProvider.tsx      # Cart state provider
│   ├── lib/
│   │   ├── supabase/                 # Database clients
│   │   │   ├── client.ts             # Browser client
│   │   │   ├── server.ts             # Server client
│   │   │   └── middleware.ts         # Session middleware
│   │   ├── services/                 # External API services
│   │   │   ├── stripe.ts             # Stripe integration
│   │   │   ├── replicate.ts          # AI image generation
│   │   │   └── resend.ts             # Email service
│   │   ├── validations/              # Zod validation schemas
│   │   │   ├── product.ts            # Product validation
│   │   │   ├── inquiry.ts            # Inquiry validation
│   │   │   └── checkout.ts           # Checkout validation
│   │   ├── utils/                    # Helper functions
│   │   │   └── cn.ts                 # Class name utilities
│   │   ├── constants.ts              # App-wide constants
│   │   └── seo.ts                    # SEO utilities
│   └── types/
│       └── database.types.ts         # Auto-generated Supabase types
├── supabase/
│   └── migrations/                   # Database migrations
│       └── 001_initial_schema.sql    # Initial schema
├── public/                           # Static assets
│   └── images/                       # Public images
├── .env.example                      # Environment template
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
├── postcss.config.js                 # PostCSS configuration
├── .npmrc                            # pnpm configuration
└── package.json                      # Dependencies and scripts
```

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **pnpm** (recommended) or npm
- **Supabase account** - [Create one here](https://supabase.com)
- **Stripe account** - [Create one here](https://stripe.com)
- **Replicate API key** - [Get one here](https://replicate.com)
- **Resend API key** - [Get one here](https://resend.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
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
   Fill in all required environment variables (see [Environment Variables](#environment-variables))

4. **Set up Supabase database**
   - Create a new Supabase project at [database.new](https://database.new)
   - Go to SQL Editor in Supabase Dashboard
   - Run the migration from `supabase/migrations/001_initial_schema.sql`
   - Verify all tables are created with RLS policies

5. **Generate TypeScript types from Supabase**
   ```bash
   # Set your Supabase project ID
   export SUPABASE_PROJECT_ID="your-project-id"

   # Generate types
   pnpm supabase:gen-types
   ```

6. **Configure Stripe webhooks**
   - Install Stripe CLI: `brew install stripe/stripe-cli/stripe` (or [download](https://stripe.com/docs/stripe-cli))
   - Login: `stripe login`
   - Forward webhooks to local server:
     ```bash
     stripe listen --forward-to localhost:3000/api/checkout/webhook
     ```
   - Copy the webhook signing secret to `.env.local`

7. **Run development server**
   ```bash
   pnpm dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### First-time Setup

After starting the development server:

1. **Create an admin account**:
   - Sign up at `/auth/signup`
   - Manually update your role in Supabase:
     ```sql
     UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
     ```

2. **Create a vendor account**:
   - Sign up another account
   - Go to `/vendor/dashboard` (will create vendor profile)
   - Admin can approve vendor at `/admin/vendors`

3. **Add test products**:
   - As vendor, go to `/vendor/products/new`
   - Create a product with images
   - As admin, approve at `/admin/products`

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Resend Email Service
RESEND_API_KEY=re_your-api-key

# Replicate AI Service
REPLICATE_API_TOKEN=r8_your-api-token

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Getting API Keys

**Supabase**:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project → Settings → API
3. Copy URL and anon key (public), service_role key (secret)

**Stripe**:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Developers → API keys
3. Copy publishable key and secret key
4. For webhook secret, use Stripe CLI or create webhook in dashboard

**Resend**:
1. Go to [Resend Dashboard](https://resend.com/dashboard)
2. API Keys → Create API Key
3. Copy the key

**Replicate**:
1. Go to [Replicate Dashboard](https://replicate.com/account)
2. API Tokens → Create token
3. Copy the token

> **Security Note**: Never commit `.env.local` to version control. The `.env.example` file serves as a template only.

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

#### `vendors` (Vendor Companies)
Business information for vendor accounts.

```typescript
{
  id: UUID (PK)
  user_id: UUID (FK → profiles)
  company_name: string
  slug: string (unique)
  description: text | null
  logo_url: string | null
  website: string | null
  phone: string | null
  service_areas: string[] | null
  years_in_business: integer | null
  is_insured: boolean
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  commission_rate: decimal (default: 15)
  total_products: integer (default: 0)
  total_inquiries: integer (default: 0)
  created_at: timestamp
  updated_at: timestamp
}
```

**RLS Policies**: Vendors can read/update own, admins can read all

#### `products` (Product Listings)
Wedding products, rentals, and services.

```typescript
{
  id: UUID (PK)
  vendor_id: UUID (FK → vendors)
  name: string
  slug: string (unique)
  description: text
  category: string
  subcategory: string | null
  base_price: decimal
  price_type: 'rental' | 'purchase' | 'quote'
  fulfillment_type: 'shippable' | 'rental' | 'service'
  images: string[]
  primary_image: string
  style_tags: string[]
  color_palette: string[]
  dimensions: JSONB | null  // {length, width, height, weight, unit}
  quantity_available: integer
  status: 'pending' | 'approved' | 'rejected'
  is_active: boolean
  is_featured: boolean
  meta_title: string | null
  meta_description: string | null
  views: integer (default: 0)
  inquiries: integer (default: 0)
  created_at: timestamp
  updated_at: timestamp
}
```

**Indexes**:
- `vendor_id`, `status`, `category`, `is_featured`
- Full-text search on `name` and `description`

**RLS Policies**: Public read (approved + active), vendors manage own

#### `cart_items` (Shopping Cart)
Server-side cart supporting both authenticated and guest users.

```typescript
{
  id: UUID (PK)
  user_id: UUID | null (FK → profiles)
  session_id: string | null
  product_id: UUID (FK → products)
  quantity: integer
  price_snapshot: decimal  // Price at time of addition
  created_at: timestamp
  updated_at: timestamp
}
```

**Unique Constraints**:
- `(user_id, product_id)` for authenticated users
- `(session_id, product_id)` for guest users

**RLS Policies**: Users manage own cart (by user_id or session_id)

#### `orders` (Purchase Orders)
Completed transactions from checkout.

```typescript
{
  id: UUID (PK)
  user_id: UUID | null (FK → profiles)
  order_number: string (unique)
  stripe_payment_intent_id: string
  subtotal: decimal
  tax: decimal
  shipping: decimal
  total: decimal
  items: JSONB  // Array of {product_id, name, quantity, price}
  shipping_address: JSONB
  status: string
  created_at: timestamp
  updated_at: timestamp
}
```

**RLS Policies**: Users read own orders, admins read all

#### `inquiries` (Quote Requests)
Customer inquiries for products/services.

```typescript
{
  id: UUID (PK)
  user_id: UUID | null (FK → profiles)
  email: string
  phone: string | null
  full_name: string
  event_date: date
  venue_name: string | null
  venue_location: string | null
  guest_count: integer | null
  products: JSONB  // Array of product IDs with quantities
  total_value: decimal
  status: 'pending' | 'quoted' | 'booked' | 'cancelled'
  vendor_responses: JSONB | null
  customer_notes: text | null
  admin_notes: text | null
  created_at: timestamp
  updated_at: timestamp
}
```

**RLS Policies**: Custom access based on user role and inquiry ownership

#### `style_presets` (AI Visualizer Presets)
Predefined style templates for AI venue visualization.

```typescript
{
  id: UUID (PK)
  name: string
  slug: string (unique)
  description: text
  thumbnail_url: string | null
  is_active: boolean
  sort_order: integer
  created_at: timestamp
  updated_at: timestamp
}
```

#### `style_preset_products` (Junction Table)
Products associated with style presets.

```typescript
{
  id: UUID (PK)
  preset_id: UUID (FK → style_presets)
  product_id: UUID (FK → products)
  sort_order: integer
  is_required: boolean
  created_at: timestamp
}
```

#### `visualizations` (Saved AI Generations)
User-generated venue visualizations.

```typescript
{
  id: UUID (PK)
  user_id: UUID (FK → profiles)
  venue_photo_url: string
  selected_preset_id: UUID | null (FK → style_presets)
  selected_products: UUID[]
  generated_image_url: string
  generation_prompt: text
  generation_time_ms: integer
  is_public: boolean
  share_token: string | null (unique)
  created_at: timestamp
}
```

### Security Features

All tables implement **Row Level Security (RLS)** with policies:

- **Profiles**: Anyone can read, users update own
- **Vendors**: Vendors read/update own, admins read all
- **Products**: Public read (approved + active), vendors CRUD own
- **Cart Items**: Users manage own (by user_id or session_id)
- **Orders**: Users read own, admins read all
- **Inquiries**: Users read own, vendors read theirs, admins read all

### Database Triggers

- **Updated At**: Automatically updates `updated_at` timestamp
- **Vendor Metrics**: Updates `total_products` and `total_inquiries` counters
- **Product Metrics**: Updates `views` and `inquiries` counters

## API Routes

### `POST /api/vendor/products`
Create new product listing.

**Authentication**: Required (vendor role)

**Request Body**:
```typescript
{
  name: string
  description: string
  category: string
  subcategory?: string
  base_price: number
  price_type: 'rental' | 'purchase' | 'quote'
  fulfillment_type: 'shippable' | 'rental' | 'service'
  images: string[]
  style_tags: string[]
  color_palette: string[]
  dimensions?: {
    length: number
    width: number
    height: number
    weight: number
    unit: string
  }
  quantity_available: number
}
```

**Response**: `201 Created` with product object

**Error Codes**:
- `401`: Unauthorized (not logged in)
- `404`: Vendor profile not found
- `400`: Validation error

---

### `POST /api/admin/products/approve`
Approve pending product.

**Authentication**: Required (admin role)

**Request Body**:
```typescript
{
  productId: string  // UUID
}
```

**Response**: `200 OK` with updated product

**Error Codes**:
- `401`: Unauthorized
- `403`: Forbidden (not admin)
- `404`: Product not found

---

### `POST /api/inquiries`
Create product inquiry/quote request.

**Authentication**: Optional

**Request Body**:
```typescript
{
  email: string
  phone?: string
  full_name: string
  event_date: string  // ISO date
  venue_name?: string
  venue_location?: string
  guest_count?: number
  products: Array<{
    product_id: string
    quantity: number
  }>
  customer_notes?: string
}
```

**Side Effects**: Sends email notification to relevant vendors via Resend

**Response**: `201 Created` with inquiry object

**Error Codes**:
- `400`: Validation error
- `500`: Server error

---

### `POST /api/visualizer/generate`
Generate AI venue visualization.

**Authentication**: Optional (saves to DB if authenticated)

**Request Body**:
```typescript
{
  venueImageUrl: string  // URL or base64
  presetId?: string      // UUID
  style: string          // Style description
}
```

**Process**:
1. Fetches products from preset (if provided)
2. Calls Replicate API with SDXL model
3. Generates styled venue image
4. Saves to DB for authenticated users

**Response**: `200 OK`
```typescript
{
  generatedImageUrl: string
  visualization?: {
    id: string
    share_token: string
  }
}
```

**Error Codes**:
- `400`: Invalid input
- `500`: AI generation failed

---

### `POST /api/checkout`
Create Stripe checkout session.

**Authentication**: Optional

**Process**:
1. Fetches cart items from database
2. Creates Stripe line items with product details
3. Creates checkout session with metadata
4. Returns session ID and URL

**Response**: `200 OK`
```typescript
{
  sessionId: string
  url: string  // Stripe-hosted checkout page
}
```

**Error Codes**:
- `400`: Empty cart
- `500`: Stripe API error

---

### `POST /api/checkout/webhook`
Handle Stripe webhook events.

**Authentication**: Stripe signature verification

**Supported Events**:
- `checkout.session.completed`: Payment successful

**Process**:
1. Verifies webhook signature
2. Creates order record in database
3. Clears user's cart
4. Sends order confirmation email via Resend

**Response**: `200 OK`
```typescript
{
  received: true
}
```

**Error Codes**:
- `400`: Invalid signature
- `500`: Database/email error

## User Roles & Permissions

### Customer (Default Role)

**Permissions**:
- ✅ Browse marketplace and search products
- ✅ View product details
- ✅ Add items to cart (authenticated or guest)
- ✅ Complete checkout and payments
- ✅ Use AI venue visualizer
- ✅ Submit product inquiries
- ✅ View own orders and inquiries
- ❌ Cannot create products
- ❌ Cannot access vendor/admin dashboards

**Sign Up**: `/auth/signup` → Auto-assigned customer role

---

### Vendor

**Includes all customer permissions, plus**:
- ✅ Access vendor dashboard at `/vendor/dashboard`
- ✅ Create and edit products
- ✅ Upload product images
- ✅ View vendor analytics (views, inquiries)
- ✅ Manage product listings
- ✅ Receive inquiry notifications
- ✅ Respond to customer inquiries with quotes
- ⚠️ Products require admin approval before going live
- ❌ Cannot approve own products
- ❌ Cannot access admin features

**Sign Up**:
1. Create account at `/auth/signup`
2. Visit `/vendor/dashboard` to create vendor profile
3. Admin approves vendor at `/admin/vendors`

---

### Admin

**Full platform access**:
- ✅ All customer and vendor permissions
- ✅ Access admin dashboard at `/admin`
- ✅ Approve/reject product listings
- ✅ Approve/reject vendor applications
- ✅ View all orders and inquiries
- ✅ Manage style presets for AI visualizer
- ✅ View system-wide analytics
- ✅ Access to all API routes
- ✅ Override product status and settings

**Assignment**: Manual role update in database
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
```

## Design System

### Brutalist Aesthetic Philosophy

The platform implements a **strict black & white brutalist design** system:

**Core Principles**:
- ⚫ **Colors**: Only `#000000` (black), `#FFFFFF` (white), and grays
- ▪️ **Borders**: `0px` border radius (sharp corners everywhere)
- 📝 **Typography**: System fonts stack (no custom typefaces)
- 📏 **Spacing**: Standard Tailwind scale (4px base unit)
- 🚫 **No** gradients, shadows, or decorative elements
- ⚡ **Focus**: Function over form, clarity over decoration

### Typography

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
             "Helvetica Neue", Arial, sans-serif;
```

**Type Scale**:
- `text-xs` (0.75rem) - Captions, labels
- `text-sm` (0.875rem) - Body small
- `text-base` (1rem) - Body text
- `text-lg` (1.125rem) - Subheadings
- `text-xl` (1.25rem) - Headings
- `text-2xl` (1.5rem) - Page titles
- `text-4xl` (2.25rem) - Hero text

### Color Palette

```typescript
colors: {
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  }
}
```

### Component Library

All UI components built with **Radix UI** + **Tailwind CSS**:

#### Button
```tsx
<Button variant="primary">Add to Cart</Button>
<Button variant="outline">Learn More</Button>
<Button variant="ghost">Cancel</Button>
```

**Variants**: primary, outline, ghost, destructive

#### Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Product Name</CardTitle>
  </CardHeader>
  <CardContent>Description</CardContent>
  <CardFooter>Actions</CardFooter>
</Card>
```

#### Dialog
```tsx
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    <DialogDescription>Content</DialogDescription>
  </DialogContent>
</Dialog>
```

#### Form Elements
```tsx
<Label htmlFor="name">Name</Label>
<Input id="name" placeholder="Enter name" />
<Select>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

### Layout System

**Responsive Grid**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* Products */}
</div>
```

**Container**:
```tsx
<div className="container mx-auto px-4 max-w-7xl">
  {/* Content */}
</div>
```

**Breakpoints**:
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)
- `2xl`: 1536px (extra large)

## Development

### Available Scripts

```bash
# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint

# Generate Supabase TypeScript types
pnpm supabase:gen-types
```

### Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** with TypeScript strict mode
   - All code must pass type checking
   - Use Zod for runtime validation
   - Follow existing patterns and conventions

3. **Test locally**
   ```bash
   pnpm dev
   ```
   - Test in browser at `http://localhost:3000`
   - Use Stripe test cards for checkout
   - Check Supabase logs for database queries

4. **Validate build**
   ```bash
   pnpm build
   ```
   - Ensure no TypeScript errors
   - Check for build warnings
   - Verify all environment variables are set

5. **Lint code**
   ```bash
   pnpm lint
   ```

6. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   git push origin feature/your-feature-name
   ```

### Code Quality Standards

**TypeScript**:
- Strict mode enabled
- No `any` types (use `unknown` if needed)
- Explicit return types for functions
- Path aliases: `@/` maps to `src/`

**React**:
- Functional components with hooks
- Server Components by default
- Client Components only when needed (`'use client'`)
- Async Server Components for data fetching

**Validation**:
- Zod schemas for all user inputs
- Type inference with `z.infer<typeof schema>`
- Form validation with React Hook Form + Zod

**Error Handling**:
- Try-catch blocks for async operations
- User-friendly error messages via toast
- Console errors for debugging
- Graceful fallbacks for failed operations

### File Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `ProductCard.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `formatPrice.ts`)
- **Types**: `camelCase.ts` (e.g., `database.types.ts`)
- **API Routes**: `route.ts` (Next.js convention)
- **Pages**: `page.tsx` (Next.js convention)

### Adding New Features

**Example: Adding a new product category**

1. **Update constants** (`src/lib/constants.ts`):
   ```typescript
   export const PRODUCT_CATEGORIES = [
     // ... existing
     'your-new-category',
   ];
   ```

2. **Update validation** (`src/lib/validations/product.ts`):
   ```typescript
   category: z.enum([...PRODUCT_CATEGORIES, 'your-new-category']),
   ```

3. **Update UI** (components that use categories):
   - Product filters
   - Product forms
   - Category dropdowns

4. **Test thoroughly**:
   - Create product with new category
   - Filter by new category
   - Verify database constraints

## Deployment

### Recommended Platform: Vercel

This project is optimized for **Vercel** deployment with zero configuration.

#### Quick Deploy

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Vercel auto-detects Next.js

3. **Configure Environment Variables**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add all variables from `.env.example`
   - Add for Production, Preview, and Development

4. **Deploy**
   - Vercel automatically builds and deploys
   - Get production URL: `https://your-project.vercel.app`

#### Post-Deployment Configuration

**Update External Services**:

1. **Supabase Auth Callbacks**:
   ```
   https://your-domain.vercel.app/auth/callback
   ```
   Add to: Supabase Dashboard → Authentication → URL Configuration

2. **Stripe Webhooks**:
   ```
   https://your-domain.vercel.app/api/checkout/webhook
   ```
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint with event: `checkout.session.completed`
   - Copy signing secret to Vercel environment variables

3. **Resend Domain**:
   - Verify your sending domain in Resend
   - Update `from` email in email service

4. **CORS (if needed)**:
   - Configure Supabase CORS settings for production domain

### Environment Variables for Production

All environment variables must be set in Vercel:

```env
# Use production values
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod_anon_key
SUPABASE_SERVICE_ROLE_KEY=prod_service_key

# Use production Stripe keys
STRIPE_SECRET_KEY=sk_live_your-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-prod-secret

# Production API keys
RESEND_API_KEY=re_your-prod-key
REPLICATE_API_TOKEN=r8_your-prod-token

# Production URL
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Performance Optimizations

**Built-in**:
- ⚡ Turbopack for fast builds (5x faster than Webpack)
- 🖼️ Automatic image optimization via Next.js Image
- 📦 Code splitting and tree shaking
- 🗜️ Compression enabled
- 🚀 Edge runtime for API routes
- 💾 ISR (Incremental Static Regeneration) for product pages

**Monitoring**:
- Vercel Analytics (built-in)
- Web Vitals tracking
- Real User Monitoring (RUM)

### Scaling Considerations

**Database**:
- Supabase scales automatically
- Consider upgrading plan for high traffic
- Add database indexes for slow queries
- Use connection pooling

**File Storage**:
- Product images stored in Supabase Storage
- CDN distribution automatic
- Configure image optimization settings

**API Rate Limits**:
- Stripe: 100 requests/second
- Replicate: Depends on plan
- Resend: Depends on plan
- Add rate limiting middleware if needed

## Features Deep Dive

### Shopping Cart Architecture

The cart system uses a **dual-key approach** to support both authenticated and guest users:

**Database Schema**:
```typescript
cart_items {
  user_id: UUID | null      // For authenticated users
  session_id: string | null // For guest users
  product_id: UUID
  quantity: number
  price_snapshot: decimal   // Price at time of addition
}
```

**Unique Constraints**:
- `(user_id, product_id)` prevents duplicate items for logged-in users
- `(session_id, product_id)` prevents duplicate items for guests

**Session ID Generation**:
```typescript
import { nanoid } from 'nanoid';

// Generate secure session ID (21 characters)
const sessionId = `guest_${nanoid()}`;

// Store in localStorage
localStorage.setItem('guestSessionId', sessionId);
```

**Benefits**:
- ✅ Cart persists across page reloads
- ✅ No data loss on accidental close
- ✅ Guest users can shop without signup
- ✅ Cart automatically migrates on login
- ✅ Server-side prevents price manipulation

**Cart Provider** (`src/components/providers/CartProvider.tsx`):
```typescript
const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
```

### AI Venue Visualizer

**Technology**: Replicate's Stable Diffusion XL (SDXL)

**Process Flow**:
1. User uploads venue photo (drag-drop or file picker)
2. User selects style preset or enters custom description
3. System fetches products associated with preset
4. Frontend sends image + style to API
5. API calls Replicate with enhanced prompt
6. AI generates styled venue image (5-15 seconds)
7. Result displayed with option to save
8. Authenticated users can save to profile

**Style Presets**:
- Modern
- Rustic
- Elegant
- Bohemian
- Industrial
- Vintage
- Minimalist
- Garden
- Glamorous
- Tropical

**Prompt Engineering**:
```typescript
const prompt = `Transform this wedding venue with a ${style} aesthetic.
Include ${products.join(', ')}.
High quality, professional photography, wedding scene.`;
```

**Performance**:
- Average generation: 8 seconds
- Model: `stability-ai/sdxl:latest`
- Resolution: 1024x1024
- Automatic retry on failure

### Email Notification System

**Service**: Resend (transactional emails)

**Email Types**:

1. **Order Confirmation** (to customer):
   ```typescript
   {
     to: customerEmail,
     subject: `Order Confirmation #${orderNumber}`,
     template: 'order-confirmation',
     data: { orderNumber, items, total, shippingAddress }
   }
   ```

2. **Inquiry Notification** (to vendor):
   ```typescript
   {
     to: vendorEmail,
     subject: 'New Inquiry for Your Products',
     template: 'vendor-inquiry',
     data: { customerName, eventDate, products, customerNotes }
   }
   ```

3. **Quote Response** (to customer):
   ```typescript
   {
     to: customerEmail,
     subject: 'Quote Response from Vendor',
     template: 'quote-response',
     data: { vendorName, products, quote, responseDate }
   }
   ```

**Implementation** (`src/lib/services/resend.ts`):
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(order: Order) {
  await resend.emails.send({
    from: 'orders@yourdomain.com',
    to: order.email,
    subject: `Order Confirmation #${order.order_number}`,
    html: renderOrderEmail(order),
  });
}
```

### Stripe Integration

**Checkout Flow**:

1. **Create Session** (`POST /api/checkout`):
   ```typescript
   const session = await stripe.checkout.sessions.create({
     mode: 'payment',
     line_items: cartItems.map(item => ({
       price_data: {
         currency: 'usd',
         product_data: {
           name: item.product.name,
           images: [item.product.primary_image],
         },
         unit_amount: Math.round(item.price_snapshot * 100),
       },
       quantity: item.quantity,
     })),
     success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
     cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
     shipping_address_collection: {
       allowed_countries: ['US', 'CA'],
     },
   });
   ```

2. **Redirect to Stripe**:
   ```typescript
   window.location.href = session.url;
   ```

3. **Webhook Handler** (`POST /api/checkout/webhook`):
   ```typescript
   const signature = headers.get('stripe-signature');
   const event = stripe.webhooks.constructEvent(
     body,
     signature,
     process.env.STRIPE_WEBHOOK_SECRET
   );

   if (event.type === 'checkout.session.completed') {
     const session = event.data.object;
     await createOrder(session);
     await clearCart(session.metadata.user_id);
     await sendOrderConfirmation(session);
   }
   ```

**Security**:
- Webhook signature verification
- Server-side price validation
- No client-side price manipulation
- PCI compliance via Stripe

### Product Categories & Tags

**Categories** (9 types):
```typescript
export const PRODUCT_CATEGORIES = [
  'decorations',
  'florals',
  'furniture',
  'lighting',
  'tableware',
  'linens',
  'signage',
  'backdrops',
  'accessories',
];
```

**Style Tags** (10 styles):
```typescript
export const STYLE_TAGS = [
  'modern',
  'rustic',
  'elegant',
  'bohemian',
  'industrial',
  'vintage',
  'minimalist',
  'garden',
  'glamorous',
  'tropical',
];
```

**Color Palette** (10 colors):
```typescript
export const COLOR_PALETTE = [
  'white',
  'black',
  'gold',
  'silver',
  'blush',
  'sage',
  'burgundy',
  'navy',
  'terracotta',
  'lavender',
];
```

**Filtering**:
- Multi-select category filter
- Multi-select style tag filter
- Price range slider
- Full-text search
- Sort options (newest, price, popular)

## Troubleshooting

### Common Issues

**Build Fails with Type Errors**:
```bash
# Regenerate database types
export SUPABASE_PROJECT_ID="your-project-id"
pnpm supabase:gen-types

# Clear Next.js cache
rm -rf .next
pnpm build
```

**Authentication Not Working**:
1. Check Supabase callback URL:
   ```
   http://localhost:3000/auth/callback (dev)
   https://your-domain.com/auth/callback (prod)
   ```
2. Verify environment variables are set
3. Check Supabase logs in dashboard

**Stripe Webhook Failing**:
```bash
# Test webhook locally with Stripe CLI
stripe listen --forward-to localhost:3000/api/checkout/webhook

# Verify webhook secret matches environment variable
echo $STRIPE_WEBHOOK_SECRET
```

**AI Generation Not Working**:
1. Check Replicate API token validity
2. Verify account has sufficient credits
3. Check API logs in Replicate dashboard
4. Test with smaller images (< 10MB)

**Images Not Loading**:
1. Check Next.js image domains in `next.config.js`:
   ```javascript
   images: {
     domains: [
       'your-project.supabase.co',
       'replicate.delivery',
     ],
   }
   ```
2. Verify Supabase storage bucket is public
3. Check image URLs are valid

**Cart Not Persisting**:
1. Check localStorage for `guestSessionId`
2. Verify Supabase RLS policies allow cart access
3. Check browser console for errors
4. Test with different user roles

**Email Not Sending**:
1. Verify Resend API key is valid
2. Check sending domain is verified
3. Review Resend logs in dashboard
4. Ensure `from` email matches verified domain

### Debug Mode

Enable debug logging:

```typescript
// src/lib/debug.ts
export const DEBUG = process.env.NODE_ENV === 'development';

// Usage
if (DEBUG) {
  console.log('Cart items:', cartItems);
}
```

### Database Issues

**Check RLS Policies**:
```sql
-- In Supabase SQL Editor
SELECT * FROM pg_policies WHERE tablename = 'products';
```

**Reset Database**:
```bash
# Backup first!
# Then re-run migration
```

**Query Performance**:
```sql
-- Check slow queries
SELECT * FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

### Getting Help

1. **Check existing issues**: Search project issues for similar problems
2. **Review documentation**: Reread relevant sections
3. **Check service status**:
   - [Vercel Status](https://www.vercel-status.com/)
   - [Supabase Status](https://status.supabase.com/)
   - [Stripe Status](https://status.stripe.com/)
4. **Enable verbose logging**: Set `DEBUG=true` in environment
5. **Contact support**: Open issue with:
   - Detailed description
   - Steps to reproduce
   - Error messages
   - Environment details

---

## Additional Resources

### Documentation Links

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Replicate Documentation](https://replicate.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://radix-ui.com/docs)

### Testing

**Stripe Test Cards**:
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184
```

**Test Accounts**:
- Customer: test-customer@example.com
- Vendor: test-vendor@example.com
- Admin: test-admin@example.com

### Contributing

This is a private project. For feature requests or bug reports, please contact the development team.

### License

Proprietary - All rights reserved

---

**Built with ❤️ using Next.js 15, Supabase, Stripe, and modern web technologies**

**Status**: ✅ Production Ready - All phases complete and tested

For questions or support, please open an issue or contact the development team.
