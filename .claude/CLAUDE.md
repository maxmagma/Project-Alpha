# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
pnpm dev                    # Start dev server with Turbopack
pnpm build                  # Build for production
pnpm start                  # Start production server
pnpm lint                   # Run ESLint

# Database type generation
pnpm supabase:gen-types     # Generate TypeScript types from Supabase schema

# Product Scraping & Import (optional)
pnpm scrape:amazon "query"  # Scrape Amazon products
pnpm scrape:etsy "query"    # Scrape Etsy products
pnpm import <file>          # Import scraped products
```

## Architecture Overview

### Tech Stack
- **Next.js 15** with App Router and React Server Components
- **Supabase** for authentication, database (PostgreSQL), and RLS
- **Stripe** for payments and checkout
- **Replicate** for AI-powered venue visualization (SDXL model)
- **Resend** for transactional emails
- **Tailwind CSS + Radix UI** for styling and components
- **Zod + React Hook Form** for form validation

### Database Architecture

The application uses Supabase with Row Level Security (RLS) policies. Key tables:
- `profiles` - User profiles extending auth.users (role: customer/vendor/admin)
- `vendors` - Vendor business information and approval status
- `products` - Product listings with approval workflow
- `product_images` - Product image galleries
- `cart_items` - Server-side shopping cart (supports guest users)
- `orders` - Order history linked to Stripe payments
- `inquiries` - Quote requests between customers and vendors
- `vision_board_items` - Customer product collections for quote requests
- `style_presets` - AI visualizer style configurations
- `style_preset_products` - Products suggested per style
- `visualizations` - Generated AI venue images
- `scraped_products` - Staging area for imported products (admin review before publishing)
- `import_batches` - Track scraping/import jobs
- `scraper_configs` - API keys and scraper settings

**Performance Optimizations:**
- Database indexes on products, orders, and images (50-80% faster queries)
- Cart provider optimized with useMemo and useCallback
- Error boundaries on all route groups for better error handling

**CRITICAL:** Never run database migrations directly. User manually executes all SQL in Supabase Dashboard.

### Application Structure

The app uses Next.js route groups for layout organization:

- **(marketing)** - Public homepage and landing pages
- **(shop)** - Customer-facing marketplace, cart, checkout, inquiry forms, vision board
- **(vendor)** - Vendor dashboard for managing products and inquiries
- **(admin)** - Admin dashboard for approvals, system management, and inventory
- **(visualizer)** - AI venue visualization tool
- **auth/** - Authentication flows (login, signup, callback)
- **api/** - API routes for external integrations
- **error.tsx** - Error boundaries for each route group

### Key Patterns

**Supabase Client Usage:**
- `src/lib/supabase/server.ts` - Server components and API routes (uses cookies)
- `src/lib/supabase/client.ts` - Client components (browser)
- `src/lib/supabase/middleware.ts` - Session refresh in middleware

**Authentication Flow:**
1. Middleware (`src/middleware.ts`) refreshes session on every request
2. Protected routes check user role in the route component
3. RLS policies enforce data access at database level

**Cart System:**
- Server-side cart stored in `cart_items` table
- Guest users identified by anonymous Supabase session
- Cart persists across sessions for authenticated users
- Optimized with useMemo/useCallback for performance
- Optimistic updates with rollback on error

**Vision Board System:**
- Customer product collections for quote requests
- Similar to cart but for inquiry/quote workflow
- Stored in `vision_board_items` table
- Supports multi-vendor quote requests
- Provider at `src/components/providers/vision-board-provider.tsx`

**Stripe Integration:**
- Checkout flow: `/api/checkout` creates Stripe session
- Webhook: `/api/checkout/webhook` handles payment completion
- Orders created after successful `checkout.session.completed` event

**AI Visualizer:**
- Users upload venue photo to Supabase Storage
- `/api/visualizer/generate` calls Replicate SDXL API
- Style presets define prompts and suggested products
- Results stored in `visualizations` table

**Approval Workflow:**
- New vendors start with `status: 'pending'`
- Products default to `status: 'pending'`
- Admin approves via `/api/admin/products/approve`
- Only approved items visible to customers

**Product Import System (Optional):**
- Scrape products from external sources (Amazon/Etsy)
- AI categorizes with Claude (category, style tags, etc.)
- Import to `scraped_products` staging table
- Admin reviews at `/admin/inventory`
- Approve to publish → moves to `products` table
- See `INVENTORY_SYSTEM.md` and `docs/setup-instructions.md` for details

### Environment Variables

Required variables (see `.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - **CRITICAL:** Server-side only, never expose client-side
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe keys
- `STRIPE_WEBHOOK_SECRET` - Webhook signature verification
- `RESEND_API_KEY` - Email sending
- `REPLICATE_API_TOKEN` - AI generation
- `NEXT_PUBLIC_APP_URL` - Application base URL

### Path Aliases

Use `@/*` to import from `src/`:
```typescript
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/marketplace/product-card'
import { Database } from '@/types/database.types'
```

### Component Organization

- `components/ui/` - Reusable UI primitives (buttons, dialogs, forms)
- `components/shared/` - Shared layout components (header, footer)
- `components/marketplace/` - Product browsing and filtering
- `components/cart/` - Shopping cart components
- `components/admin/` - Admin-specific components
- `components/providers/` - Context providers

### Validation

All forms use Zod schemas in `src/lib/validations/`:
- `product.ts` - Product creation/editing
- `vendor.ts` - Vendor registration
- `inquiry.ts` - Quote requests
- `checkout.ts` - Checkout form
- `preset.ts` - Style preset management

### External Services

- `src/lib/services/stripe.ts` - Stripe SDK wrapper
- `src/lib/services/resend.ts` - Email templates and sending
- `src/lib/services/replicate.ts` - AI image generation

### Type Generation

Run `pnpm supabase:gen-types` after database schema changes to update `src/types/database.types.ts`. This provides full TypeScript types for Supabase queries.

## Design System Standards

**CRITICAL:** This application follows a strict Brutalist Design Philosophy with mandatory design rules.

**⚠️ IMPORTANT FOR ALL UI WORK:**
- **BEFORE** creating, editing, or modifying ANY UI component, page, or layout, you **MUST** consult the design documentation in `/docs/design/`
- The design system is **NOT OPTIONAL** - all UI work must strictly follow these guidelines
- If you're unsure about any design decision, refer to `/docs/design/EXAMPLES.md` for real-world code examples
- Never deviate from the design system without explicit user approval

### Design Documentation Location

**Complete design guides are in `/docs/design/`:**
- `README.md` - Complete design system overview and philosophy
- `COLORS.md` - Comprehensive color palette and usage rules
- `COMPONENTS.md` - Component library and patterns
- `EXAMPLES.md` - Real-world code examples for common UI patterns

### Core Design Principles

1. **Monochromatic Palette**: ONLY black (#000000), white (#FFFFFF), and grays
2. **Zero Border Radius**: ALL elements must have sharp corners (border-radius: 0) - NO EXCEPTIONS
3. **Bold Typography**: Uppercase text with wide letter spacing for buttons/labels
4. **High Contrast**: Maximum contrast between black and white for clarity
5. **2px Borders**: Use `border-2 border-black` for emphasis

### Mandatory Rules

#### Colors
- **Primary actions**: `bg-black text-white`
- **Secondary actions**: `bg-white text-black border-2 border-black`
- **Backgrounds**: `bg-white` (primary), `bg-secondary` (#F5F5F5 for subtle)
- **Text**: `text-black` or `text-foreground` (primary), `text-muted-foreground` (#737373 for secondary)
- **Borders**: ALWAYS `border-black`
- **NO COLORS ALLOWED** - Never use blue, green, red, purple, etc.

#### Border Radius
```tsx
// CORRECT - Sharp corners
<Button className="border-2 border-black">Action</Button>
<Card className="border-2 border-black">...</Card>

// WRONG - Never use rounded classes
<Button className="rounded-lg">❌ WRONG</Button>
```

The global CSS enforces `border-radius: 0 !important` on all elements.

#### Typography
```tsx
// Button/Label style - Bold, uppercase, wide tracking
<p className="text-xs uppercase tracking-wider font-bold">CATEGORY</p>

// Headings - Bold, tight tracking
<h1 className="text-5xl md:text-7xl font-bold">Hero Title</h1>
<h2 className="text-3xl md:text-4xl font-bold">Section Title</h2>

// Body text
<p className="text-base text-foreground">Primary text</p>
<p className="text-sm text-muted-foreground">Secondary text</p>
```

#### Component Patterns
```tsx
// Standard Button
<Button variant="default" size="lg" className="border-2">
  Primary Action
</Button>

// Product Card
<Card className="overflow-hidden hover:shadow-lg transition-shadow">
  <div className="aspect-square bg-secondary relative">
    <Image src={img} alt={name} fill />
  </div>
  <div className="p-4">
    <p className="text-xs text-muted-foreground uppercase mb-1 tracking-wider">
      {category}
    </p>
    <h3 className="font-semibold mb-2">{name}</h3>
    <p className="text-lg font-bold">{price}</p>
  </div>
</Card>

// Input Fields
<Input className="border-2 border-black" />
```

#### Focus States
ALL interactive elements must have visible focus states:
```tsx
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
```

### UI Development Workflow

**MANDATORY PROCESS FOR ALL UI WORK:**

1. **Before starting any UI work:**
   - Read `/docs/design/README.md` for design philosophy
   - Check `/docs/design/EXAMPLES.md` for similar patterns
   - Verify color usage in `/docs/design/COLORS.md`

2. **During development:**
   - Use only approved colors (black, white, grays)
   - Ensure zero border radius on all elements
   - Apply proper typography scales and weights
   - Include focus states on all interactive elements

3. **Before completing:**
   - Verify responsive behavior across breakpoints
   - Check accessibility (focus states, contrast, semantic HTML)
   - Ensure consistency with existing UI patterns

**If you skip these steps, your UI work WILL NOT meet project standards.**

### Responsive Design

Use mobile-first approach with Tailwind breakpoints:
```tsx
// Mobile-first responsive classes
<div className="
  text-3xl md:text-5xl lg:text-7xl        // Typography
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3   // Grids
  py-12 md:py-20 lg:py-24                 // Spacing
">
```

Breakpoints: `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`

### Accessibility Requirements

- **Focus States**: All interactive elements MUST have visible `ring-2 ring-black ring-offset-2` on focus
- **Color Contrast**: Black on white (21:1 WCAG AAA), gray-600 on white (7:1 WCAG AA)
- **Semantic HTML**: Proper heading hierarchy (h1 → h2 → h3)
- **ARIA Labels**: Add `sr-only` labels for icon-only buttons
```tsx
<Button variant="ghost" size="icon">
  <ShoppingCartIcon className="h-5 w-5" />
  <span className="sr-only">Shopping Cart</span>
</Button>
```

### Common Layout Patterns

```tsx
// Container - All content wrapped in this
<div className="container mx-auto px-4">
  {/* Content */}
</div>

// Section Spacing
<section className="py-20">            // Standard
<section className="py-24 md:py-32">   // Hero
<section className="py-12">            // Compact

// Product Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {products.map(...)}
</div>
```

## Important Constraints

1. **Database Migrations:** NEVER run migration commands. User manually executes SQL.
2. **Service Role Key:** Only use server-side (API routes, Server Components). Never log or expose.
3. **RLS Policies:** Respect database security. Don't bypass with service role unless required for admin operations.
4. **Route Groups:** Maintain existing layout structure with route groups.
5. **Turbopack:** Dev server uses Turbopack for faster builds.
6. **Design System:** ALWAYS follow brutalist design standards - black/white only, zero border radius, bold typography.

## Git Commit Guidelines

**CRITICAL RULES FOR GIT COMMITS:**

1. **NEVER commit the `/docs` folder or `src/docs/` directory**
2. **NEVER mention "Claude" or "AI" in commit messages**
3. **Keep commit messages SHORT and human-like** - concise but informative
4. **Use imperative mood** - "Add feature" not "Added feature" or "Adding feature"

### Commit Message Format

```bash
# GOOD - Short, human, descriptive
git commit -m "Fix product card layout on mobile"
git commit -m "Add vendor dashboard filtering"
git commit -m "Update checkout validation logic"

# BAD - Too verbose or mentions AI
git commit -m "Updated the product card component to fix responsive layout issues on mobile devices and tablets"
git commit -m "Add vendor dashboard with filtering - Generated with Claude Code"
git commit -m "Implement new checkout validation using Zod schemas with comprehensive error handling"
```

### Examples

✅ **Good Commits:**
- "Fix nav menu mobile dropdown"
- "Add image upload to product form"
- "Update pricing display format"
- "Remove unused dependencies"

❌ **Bad Commits:**
- "Fixed navigation menu mobile dropdown functionality" (too verbose)
- "Add feature with Claude assistance" (mentions AI)
- "Updated pricing display to show formatted currency values with proper decimal places" (too long)
- "feat: implement comprehensive product filtering system" (overly formal)

### What to Exclude

Always add to `.gitignore`:
- `/docs` - Design documentation
- `src/docs/` - Any documentation folders
- `.env.local` - Environment variables (already excluded)
- `node_modules/` - Dependencies (already excluded)

## Workflow Documentation

**Complete workflow documentation with technical details and UI mockups:**

See `/docs/workflows/` for comprehensive workflow documentation:
- [Product Discovery & Import](../docs/workflows/01-product-discovery-import.md) - Scraping, AI categorization, staging
- [Admin Review & Approval](../docs/workflows/02-admin-review-approval.md) - Product curation and publishing
- [Customer Shopping](../docs/workflows/03-customer-shopping.md) - Browse, search, filter marketplace
- [Vision Board & Inquiry](../docs/workflows/04-vision-board-inquiry.md) - Multi-vendor quote requests
- [Vendor Management](../docs/workflows/05-vendor-management.md) - Inquiry responses, availability updates
- [Checkout & Order](../docs/workflows/06-checkout-order.md) - Stripe integration, order processing

**Technical Reference:**
- [Database Schema](../docs/workflows/07-database-schema.md) - Complete schema with relationships
- [API Endpoints](../docs/workflows/08-api-endpoints.md) - All routes with examples

## Common Workflows

**Adding a new product field:**
1. Update SQL migration in `supabase/migrations/`
2. Run `pnpm supabase:gen-types` after user executes SQL
3. Update Zod schema in `src/lib/validations/product.ts`
4. Update product form in vendor dashboard
5. Update product display components
6. See [Database Schema Reference](../docs/workflows/07-database-schema.md)

**Creating a new API endpoint:**
1. Create route handler in `src/app/api/`
2. Use `createClient()` from `@/lib/supabase/server`
3. Validate input with Zod schemas
4. Return NextResponse with proper status codes
5. See [API Endpoints Reference](../docs/workflows/08-api-endpoints.md)

**Adding a new user role:**
1. Update `user_role` enum in database
2. Regenerate types
3. Update middleware/auth checks
4. Add RLS policies for new role
5. Create role-specific layouts and routes
