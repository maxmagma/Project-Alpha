# Wedding Marketplace - Complete Next.js 16 Application

A production-ready full-stack wedding product marketplace with vendor management, cart/checkout, AI venue visualization, and Stripe payments.

## ✨ All Features Complete! (Phases 1-4)

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

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) + Turbopack
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL + RLS)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **AI**: Replicate (SDXL)
- **Email**: Resend
- **Styling**: Tailwind CSS + Radix UI
- **Validation**: Zod + React Hook Form
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

## 📝 Environment Variables Required

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (Required for checkout)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend (Required for emails)
RESEND_API_KEY=

# Replicate (Required for AI)
REPLICATE_API_TOKEN=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

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
```

## 🔑 User Roles

1. **Customer**: Browse, cart, checkout, inquiries
2. **Vendor**: Product management, inquiry responses
3. **Admin**: Approve vendors/products, manage presets

## 📊 Database Schema

10+ tables with RLS policies:
- profiles, vendors, products, product_images
- cart_items, orders, inquiries
- style_presets, style_preset_products
- visualizations

## 🎯 Key Features

- **Smart Cart**: Server-side with guest support
- **AI Visualizer**: Generate styled venue previews
- **Stripe Integration**: Secure checkout & webhooks
- **Email Notifications**: Order confirmations, inquiries
- **Admin Workflow**: Vendor/product approvals
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

## 📚 Key Routes

**Public**: `/`, `/marketplace`, `/marketplace/[id]`, `/cart`, `/checkout`, `/visualizer`

**Vendor**: `/vendor/dashboard`, `/vendor/products`, `/vendor/products/new`

**Admin**: `/admin`, `/admin/products`, `/admin/vendors`, `/admin/presets`

## 🧪 Testing

Use Stripe test card: `4242 4242 4242 4242`

## 🐛 Troubleshooting

**Build fails**: Ensure all environment variables are set
**Auth issues**: Check Supabase callback URL configuration
**AI fails**: Verify Replicate API token and credits

## 📖 Documentation

- [Next.js](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Stripe](https://stripe.com/docs)
- [Replicate](https://replicate.com/docs)

## 📄 License

MIT

---

**Status**: ✅ Production Ready - All phases implemented and tested!

Built with Next.js 15, Supabase, Stripe, and modern web technologies.
