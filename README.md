# Wedding Marketplace - Complete Next.js 16 Application

A production-ready full-stack wedding product marketplace with vendor management, cart/checkout, AI venue visualization, and Stripe payments.

## ✨ All Features Complete! (Phases 1-5)

### Phase 1 - Core Marketplace ✅
- Product listing with advanced filters (category, style, price)
- Product detail pages with image galleries
- Server-side cart with guest support
- User authentication via Supabase
- Responsive design with Tailwind CSS

### Phase 2 - Admin & Vendor ✅
- **Vendor Dashboard** with product management (create, edit, analytics)
- **Admin Dashboard** with approval workflows
- Inquiry/quote system with email notifications
- Complete Zod validation for all forms

### Phase 3 - AI Visualizer ✅
- Venue photo upload
- AI-powered product visualization (Replicate SDXL)
- Style preset selection
- Product suggestions based on style

### Phase 4 - Polish & Payments ✅
- Stripe Checkout integration
- Webhook handling for orders
- Email notifications via Resend
- Performance optimizations with Turbopack
- Production-ready build configuration

### Phase 5 - Automated Inventory Management ✅
- **Product Scraping** from Amazon, Etsy, and local vendors
- **AI-Powered Categorization** with Claude (automatic tagging, pricing analysis)
- **Staging Database** for review before publishing
- **Admin Inventory UI** with bulk approve/reject/edit
- **Affiliate Link Tracking** (optional - Amazon Associates, Awin/Etsy)
- **Import Pipeline** with duplicate detection and vendor matching
- **CLI Tools** for scraping and importing products

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) + Turbopack
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL + RLS)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **AI**: Replicate (SDXL), Anthropic Claude (product categorization)
- **Email**: Resend
- **Styling**: Tailwind CSS + Radix UI
- **Validation**: Zod + React Hook Form
- **Scraping**: Etsy API (official), Scrapingdog/Rainforest (Amazon)
- **Package Manager**: pnpm

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables (copy .env.example to .env.local)
cp .env.example .env.local

# Run database migration in Supabase Dashboard
# Copy contents of supabase/migrations/001_initial_schema.sql

# Start development server
pnpm dev
```

## 📝 Environment Variables

### Core Application (Required)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (for checkout)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend (for emails)
RESEND_API_KEY=

# Replicate (for AI visualizer)
REPLICATE_API_TOKEN=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Product Scraping (Optional - See docs/setup-instructions.md)
```env
# Anthropic Claude (for AI categorization)
ANTHROPIC_API_KEY=

# Etsy (official API - FREE)
ETSY_API_KEY=

# Amazon (choose one)
AMAZON_API_KEY=              # Scrapingdog or Rainforest API

# Affiliate Links (optional - can add later)
AMAZON_AFFILIATE_ID=         # yoursite-20
ETSY_AFFILIATE_ID=           # Awin affiliate ID
```

**Note:** Product scraping is optional. Core marketplace works without it.

## 📂 Project Structure

```
src/
├── app/
│   ├── (marketing)/      # Homepage, about
│   ├── (shop)/          # Products, cart, checkout
│   ├── (visualizer)/    # AI visualizer
│   ├── (vendor)/        # Vendor dashboard
│   ├── (admin)/         # Admin dashboard
│   ├── auth/            # Authentication
│   └── api/             # API routes
├── components/          # React components
├── lib/
│   ├── supabase/        # DB clients
│   ├── services/        # External APIs
│   ├── validations/     # Zod schemas
│   └── utils/           # Helpers
└── types/               # TypeScript types

docs/
└── design/              # 🎨 Design system documentation
    ├── README.md        # Design philosophy and overview
    ├── COLORS.md        # Color palette and usage rules
    ├── COMPONENTS.md    # Component library patterns
    └── EXAMPLES.md      # Real-world code examples
```

## 🔑 User Roles

1. **Customer**: Browse, cart, checkout, inquiries
2. **Vendor**: Product management, inquiry responses
3. **Admin**: Approve vendors/products, manage presets

## 📊 Database Schema

13+ tables with RLS policies:
- **Core:** profiles, vendors, products, product_images
- **Commerce:** cart_items, orders, inquiries
- **AI:** style_presets, style_preset_products, visualizations
- **Inventory:** import_batches, scraped_products, scraper_configs

## 🎯 Key Features

- **Smart Cart**: Server-side with guest support
- **AI Visualizer**: Generate styled venue previews
- **Stripe Integration**: Secure checkout & webhooks
- **Email Notifications**: Order confirmations, inquiries
- **Admin Workflow**: Vendor/product approvals
- **Automated Inventory**: Scrape, categorize, and import products with AI
- **Performance**: Turbopack, caching, optimization

## 🚢 Deployment (Vercel)

```bash
# Deploy to Vercel
vercel --prod

# Configure:
1. Add environment variables in Vercel
2. Set Supabase auth callback: https://yourdomain.com/auth/callback
3. Add Stripe webhook: https://yourdomain.com/api/checkout/webhook
```

## 🎨 Design System

WeddingHub follows a **Brutalist Design Philosophy** with strict design standards:

### Core Principles
- **Monochromatic Palette**: Black, white, and grays only - NO colors
- **Sharp Geometry**: Zero border radius on all elements
- **Bold Typography**: Strong hierarchy with uppercase labels
- **High Contrast**: Maximum readability with black on white
- **Clean Aesthetics**: Inspired by minimal e-commerce design (Curated Supply style)

### Design Documentation
All UI work must follow the comprehensive design system in `/docs/design/`:
- **Philosophy & Overview**: `/docs/design/README.md`
- **Color Guidelines**: `/docs/design/COLORS.md`
- **Component Patterns**: `/docs/design/COMPONENTS.md`
- **Code Examples**: `/docs/design/EXAMPLES.md`

### Key Design Rules
```tsx
// ✅ CORRECT - Sharp corners, black borders
<Button className="border-2 border-black">Action</Button>
<Card className="hover:shadow-lg transition-shadow">...</Card>

// ❌ WRONG - Never use colors or rounded corners
<Button className="bg-blue-500 rounded-lg">❌ WRONG</Button>
```

## 📚 Key Routes

### Public Routes
- **Homepage**: http://localhost:3000
- **Marketplace**: http://localhost:3000/marketplace
- **Product Detail**: http://localhost:3000/marketplace/[id]
- **Cart**: http://localhost:3000/cart
- **Checkout**: http://localhost:3000/checkout
- **AI Visualizer**: http://localhost:3000/visualizer

### Vendor Dashboard (Add Products/Inventory)
- **Dashboard**: http://localhost:3000/vendor/dashboard
- **My Products**: http://localhost:3000/vendor/products
- **Add New Product**: http://localhost:3000/vendor/products/new ⭐
- **Edit Product**: http://localhost:3000/vendor/products/[id]

### Admin Dashboard (Product & Vendor Management)
- **Dashboard**: http://localhost:3000/admin
- **Manage Products**: http://localhost:3000/admin/products
- **Manage Vendors**: http://localhost:3000/admin/vendors
- **Style Presets**: http://localhost:3000/admin/presets

### Admin Inventory (Product Scraping & Import)
- **Inventory Dashboard**: http://localhost:3000/admin/inventory ⭐
- **Edit Scraped Product**: http://localhost:3000/admin/inventory/[id]/edit
- **Import History**: http://localhost:3000/admin/inventory/batches
- **Scraper Configuration**: http://localhost:3000/admin/inventory/config

### Auth Routes
- **Login**: http://localhost:3000/auth/login
- **Signup**: http://localhost:3000/auth/signup

## 🤖 Automated Product Inventory System

Scrape and import products from external marketplaces automatically.

### Quick Start
```bash
# 1. Configure API keys (see docs/setup-instructions.md)
# Add ANTHROPIC_API_KEY and ETSY_API_KEY to .env.local

# 2. Scrape products
pnpm scrape:etsy "wedding centerpieces"
pnpm scrape:amazon "table linens rental"

# 3. Import to staging
pnpm import data/etsy-*.json
pnpm import data/amazon-*.json

# 4. Review in admin UI
# Go to http://localhost:3000/admin/inventory

# 5. Approve products to publish on marketplace
```

### Features
- ✅ **Scrape from Amazon & Etsy** (plus manual CSV/JSON imports)
- ✅ **AI Categorization** - Claude automatically tags products
- ✅ **Staging Database** - Review before publishing
- ✅ **Bulk Operations** - Approve/reject/edit multiple products
- ✅ **Duplicate Detection** - Prevents re-importing
- ✅ **Affiliate Tracking** - Optional commission links
- ✅ **Vendor Auto-Creation** - Matches or creates vendors

### Documentation
- **Setup Guide:** `docs/setup-instructions.md` - Get API keys, configure scrapers
- **System Docs:** `INVENTORY_SYSTEM.md` - Architecture, workflows, API reference

### Cost (Optional Feature)
- **Minimal:** ~$2 to start (Anthropic + Etsy API)
- **Production:** ~$45/month (includes Amazon scraping)
- **Affiliate links:** Optional - can add later for passive income

## 🧪 Testing

Use Stripe test card: `4242 4242 4242 4242`

## 🐛 Troubleshooting

**Build fails**: Ensure all environment variables are set
**Auth issues**: Check Supabase callback URL configuration
**AI fails**: Verify Replicate API token and credits

## 📖 Documentation

### Project Documentation
- **Design System:** `/docs/design/` - Complete UI/UX design standards ⭐
- **Inventory System:** `INVENTORY_SYSTEM.md` - Complete scraping & import guide
- **Setup Guide:** `docs/setup-instructions.md` - Get API keys step-by-step
- **Development Guide:** `.claude/CLAUDE.md` - Architecture and patterns

### External Documentation
- [Next.js](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Stripe](https://stripe.com/docs)
- [Replicate](https://replicate.com/docs)
- [Anthropic](https://docs.anthropic.com)

## 📄 License

MIT

---

**Status**: ✅ Production Ready - All 5 phases complete!

**Latest:** Automated product inventory with AI-powered categorization, scraping from Amazon/Etsy, and affiliate tracking.

Built with Next.js 15, Supabase, Stripe, Anthropic Claude, and modern web technologies.
