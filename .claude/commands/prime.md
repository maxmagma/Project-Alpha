---
description: Load WeddingHub project context efficiently
---

**IMPORTANT**: This command ONLY loads context. Do NOT take actions or run tools. Acknowledge context loaded and wait for instructions.

## Project: WeddingHub - Wedding Product Marketplace

**Mission**: Curated wedding product marketplace with vendor management, AI venue visualization, and Stripe checkout.

## Tech Stack
- **Framework**: Next.js 15 (App Router, RSC)
- **Database**: Supabase (PostgreSQL + RLS)
- **Payments**: Stripe
- **AI**: Replicate (SDXL venue visualization)
- **Email**: Resend
- **Styling**: Tailwind CSS + Radix UI
- **Validation**: Zod + React Hook Form
- **Package Manager**: pnpm ONLY

## Architecture

### Route Groups
- `(marketing)` - Homepage, landing pages
- `(shop)` - Marketplace, cart, checkout
- `(vendor)` - Product management dashboard
- `(admin)` - Approval workflows, system management
- `(visualizer)` - AI venue photo generator
- `auth/` - Login, signup
- `api/` - Stripe webhooks, admin/vendor endpoints

### File Structure
```
src/
├── app/                    # Next.js routes
│   ├── (marketing)/       # Public pages
│   ├── (shop)/            # Customer marketplace
│   ├── (vendor)/          # Vendor dashboard
│   ├── (admin)/           # Admin panel
│   ├── (visualizer)/      # AI tool
│   ├── auth/              # Authentication
│   └── api/               # API routes
├── components/
│   ├── ui/                # Radix UI components
│   ├── shared/            # Header, footer
│   ├── marketplace/       # Product cards, filters
│   ├── cart/              # Shopping cart
│   └── admin/             # Admin components
├── lib/
│   ├── supabase/          # server.ts, client.ts, middleware.ts
│   ├── services/          # stripe.ts, resend.ts, replicate.ts
│   ├── validations/       # Zod schemas
│   └── utils/             # Helpers
└── types/
    └── database.types.ts  # Generated from Supabase
```

## Database Schema (Supabase)
**Key Tables**:
- `profiles` - User profiles (role: customer/vendor/admin)
- `vendors` - Business info, approval status
- `products` - Listings with approval workflow (pending/approved/rejected)
- `cart_items` - Server-side cart (guest + authenticated)
- `orders` - Stripe payment records
- `inquiries` - Quote requests
- `style_presets` - AI visualizer styles
- `visualizations` - Generated AI images

**CRITICAL**: NEVER run migrations. User executes SQL manually in Supabase Dashboard.

## Design System (MANDATORY)

### Brutalist Design Philosophy
1. **Colors**: BLACK (#000) and WHITE (#FFF) ONLY - no other colors
2. **Border Radius**: ZERO on ALL elements (enforced globally)
3. **Typography**: Bold, uppercase with wide tracking for buttons/labels
4. **Borders**: 2px solid black for emphasis
5. **Shadows**: Sharp offset shadows (8px 8px 0 0 black)

### Component Patterns
```tsx
// Button
<Button variant="default" size="lg" className="border-2">
  Primary Action
</Button>

// Card
<Card className="overflow-hidden hover:shadow-lg transition-shadow">
  <div className="aspect-square bg-secondary relative">
    <Image src={img} alt={name} fill />
  </div>
  <div className="p-4">
    <p className="text-xs uppercase tracking-wider text-muted-foreground">CATEGORY</p>
    <h3 className="font-semibold mb-2">{name}</h3>
    <p className="text-lg font-bold">{price}</p>
  </div>
</Card>

// Input
<Input className="border-2 border-black" />
```

**Reference**: `src/docs/design/` for complete design standards

## Key Features

### Product System
- Categories: Decor, Furniture, Tableware, Lighting, Floral, etc.
- Price types: rental, purchase, quote
- Style tags: Modern, Rustic, Elegant, Bohemian, etc.
- Approval workflow: pending → approved/rejected (admin)

### Cart System
- Server-side storage in `cart_items`
- Guest support via session_id (localStorage)
- Automatic user migration on login

### Vendor Dashboard
- Product CRUD operations
- Image upload
- Analytics dashboard
- Inquiry management

### Admin Dashboard
- Product approval workflow
- Vendor approval workflow
- Style preset management
- System-wide analytics

### AI Visualizer
- Upload venue photo → Supabase Storage
- Select style preset (prompts + products)
- Generate with Replicate SDXL
- Save to `visualizations` table

### Stripe Integration
- Checkout session creation
- Webhook: `checkout.session.completed`
- Order creation with email confirmation

## Demo Mode
**Context**: App runs without Supabase for UI testing
- Check: `!supabase` in client/server
- Middleware skips auth if URL = "your_supabase_url"
- Admin/Vendor layouts show "(Demo Mode)"

## Development

### Commands
```bash
pnpm dev                    # Dev server (Turbopack)
pnpm build                  # Production build
pnpm lint                   # ESLint
pnpm supabase:gen-types     # Regen database types
```

### Routes (localhost:3000)
**Public**: `/`, `/marketplace`, `/marketplace/[id]`, `/cart`, `/checkout`, `/visualizer`
**Vendor**: `/vendor/dashboard`, `/vendor/products`, `/vendor/products/new`
**Admin**: `/admin`, `/admin/products`, `/admin/vendors`, `/admin/presets`
**Auth**: `/auth/login`, `/auth/signup`

## Coding Standards

### File Naming
- Directories: kebab-case
- Components: PascalCase
- Utilities: camelCase

### Imports
```typescript
// Order: React/Next → Libraries → Components → Utils → Types
import { useState } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { Database } from '@/types/database.types'
```

### Component Pattern
```typescript
interface MyComponentProps {
  title: string
  onAction: () => void
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div className="bg-white border-2 border-black p-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <Button onClick={onAction}>Action</Button>
    </div>
  )
}
```

### API Route Pattern
```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({
  productId: z.string(),
})

export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Demo mode' }, { status: 503 })
  }

  const body = await request.json()
  const validated = schema.parse(body)

  // Implementation
}
```

## Git Commit Rules (CRITICAL)

1. **NEVER commit**: `/docs`, `src/docs/`
2. **NEVER mention**: "Claude", "AI", or tool names
3. **Keep SHORT**: 5-10 words max
4. **Use imperative**: "Fix bug" not "Fixed bug"

**Good**: "Fix product card mobile layout"
**Bad**: "Updated product card component with Claude assistance"

## Security

1. **Service Role Key**: Server-side ONLY, never expose
2. **RLS**: All tables have Row Level Security
3. **Validation**: Zod schemas for all input
4. **CORS**: API routes check origin
5. **Demo Mode**: Safe for UI testing without credentials

## Common Workflows

### Add Product Field
1. Update SQL in `supabase/migrations/`
2. User runs SQL in Supabase Dashboard
3. Run `pnpm supabase:gen-types`
4. Update Zod schema in `src/lib/validations/product.ts`
5. Update forms/displays

### Create API Endpoint
1. Create in `src/app/api/[route]/route.ts`
2. Import `createClient()` from `@/lib/supabase/server`
3. Check `!supabase` for demo mode
4. Validate with Zod
5. Return NextResponse

### Add UI Component
1. Follow brutalist design (black/white, no radius)
2. Use existing components from `src/components/ui/`
3. Apply mobile-first responsive
4. Include focus states: `focus-visible:ring-2 ring-black ring-offset-2`

## Constants
- Categories: `src/lib/constants.ts`
- Style tags: Modern, Rustic, Elegant, Bohemian, Minimalist, Vintage, etc.
- Price ranges: <$100, $100-$500, $500-$1K, $1K-$2.5K, >$2.5K

## Integration Points
- **Auth**: Supabase middleware in `src/middleware.ts`
- **Stripe**: `src/lib/services/stripe.ts`
- **Email**: `src/lib/services/resend.ts`
- **AI**: `src/lib/services/replicate.ts`

**Context loaded. WeddingHub project ready. Awaiting instructions.**
