# Wedding Marketplace - Next.js 16 Application

A full-stack wedding product marketplace built with Next.js 16, featuring vendor management, product catalog, cart/checkout, and AI venue visualization.

## 🎯 Features

### Phase 1 - Core Marketplace (Implemented)
- ✅ Product listing with filters and search
- ✅ Product detail pages with image galleries
- ✅ Server-side cart system with guest support
- ✅ User authentication (signup, login)
- ✅ Black/white minimalist design with Tailwind CSS
- ✅ Responsive layout with mobile support

### Phase 2 - Admin & Vendor (In Progress)
- 🚧 Admin dashboard with product approval workflow
- 🚧 Vendor dashboard with product management
- 🚧 Inquiry/quote request system
- 🚧 Style presets creation

### Phase 3 - AI Visualizer (Planned)
- 📋 Venue photo upload
- 📋 AI-powered product visualization with Replicate
- 📋 Product suggestions based on style

### Phase 4 - Polish (Planned)
- 📋 Stripe payment integration
- 📋 Email notifications with Resend
- 📋 Advanced search and filtering
- 📋 Performance optimizations

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **State Management**: React Server Components + URL state
- **Form Validation**: Zod + React Hook Form
- **Payments**: Stripe (planned)
- **Email**: Resend (planned)
- **AI**: Replicate API (planned)
- **Deployment**: Vercel

## 📁 Project Structure

```
wedding-marketplace/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (marketing)/       # Public pages (homepage, about)
│   │   ├── (shop)/            # Shop pages (marketplace, product detail, cart)
│   │   ├── (vendor)/          # Vendor dashboard
│   │   ├── (admin)/           # Admin dashboard
│   │   ├── auth/              # Authentication pages
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   ├── marketplace/      # Marketplace-specific components
│   │   ├── cart/             # Cart components
│   │   ├── shared/           # Shared components (Header, Footer)
│   │   └── providers/        # Context providers
│   ├── lib/                   # Utility functions
│   │   ├── supabase/         # Supabase clients
│   │   ├── utils/            # Helper functions
│   │   └── constants.ts      # App constants
│   └── types/                 # TypeScript types
├── supabase/                  # Database migrations
└── public/                    # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ installed
- npm or yarn package manager
- A Supabase account
- Git

### 1. Clone the repository

```bash
git clone <repository-url>
cd wedding-marketplace
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your project URL and anon key

### 4. Set up environment variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_PROJECT_ID=your_project_id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run database migrations

Install the Supabase CLI:

```bash
npm install -g supabase
```

Link your project:

```bash
supabase link --project-ref your-project-ref
```

Push the database schema:

```bash
supabase db push
```

Alternatively, you can run the migration file manually in the Supabase SQL Editor:
- Open the Supabase dashboard
- Go to SQL Editor
- Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
- Run the query

### 6. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

The application uses the following main tables:

- **profiles**: User profiles (extends Supabase auth.users)
- **vendors**: Vendor accounts and business information
- **products**: Product catalog with images and attributes
- **product_images**: Product image gallery
- **cart_items**: Shopping cart (server-side)
- **inquiries**: Quote requests and lead generation
- **style_presets**: Curated product collections for AI visualizer
- **orders**: Order history and fulfillment

All tables include Row Level Security (RLS) policies for data protection.

## 🔐 Authentication

The app uses Supabase Auth for authentication:

- **Sign up**: `/auth/signup`
- **Login**: `/auth/login`
- **Callback**: `/auth/callback` (handles OAuth redirects)

User roles:
- **Customer**: Default role, can browse and purchase
- **Vendor**: Can manage products and view inquiries
- **Admin**: Full access to approve vendors/products

## 🛒 Cart System

The cart is stored server-side in Supabase:

- Authenticated users: Cart tied to user ID
- Guest users: Cart tied to session ID (stored in localStorage)
- Cart persists across sessions
- Automatic cart migration when guest users log in

## 🎨 Styling

The app uses a minimalist black/white design:

- Tailwind CSS for utility-first styling
- Custom color palette defined in `tailwind.config.ts`
- Radix UI for accessible component primitives
- Responsive design with mobile-first approach

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | No (Phase 4) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | No (Phase 4) |
| `RESEND_API_KEY` | Resend API key for emails | No (Phase 4) |
| `REPLICATE_API_TOKEN` | Replicate API token for AI | No (Phase 3) |

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel project settings
4. Deploy!

```bash
npm install -g vercel
vercel --prod
```

### Post-Deployment

1. Update Supabase Auth callback URL:
   - Go to Authentication > URL Configuration
   - Add `https://yourdomain.com/auth/callback`

2. Configure Stripe webhooks (when implemented):
   - Add webhook endpoint: `https://yourdomain.com/api/checkout/webhook`

## 🧪 Testing

To test the application with sample data:

1. Create a test user account
2. Manually insert some products in Supabase:
   - Go to Table Editor > products
   - Add products with `status = 'approved'` and `is_active = true`
3. Test the marketplace, product detail, and cart flows

## 📚 Key Pages

- `/` - Homepage
- `/marketplace` - Product listing with filters
- `/marketplace/[productId]` - Product detail page
- `/cart` - Shopping cart
- `/auth/login` - Login page
- `/auth/signup` - Sign up page
- `/vendor/dashboard` - Vendor dashboard (in progress)
- `/admin` - Admin dashboard (in progress)

## 🤝 Contributing

This is a work in progress. Key areas for contribution:

1. Complete vendor dashboard functionality
2. Build admin approval workflow
3. Implement AI visualizer with Replicate
4. Add Stripe payment integration
5. Set up email notifications
6. Add comprehensive testing

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues or questions:
1. Check the Supabase logs for backend errors
2. Check browser console for frontend errors
3. Review the Next.js documentation
4. Check Supabase RLS policies if data access issues occur

## 🗺️ Roadmap

### Immediate Next Steps
1. ✅ Complete vendor dashboard
2. ✅ Build admin product approval system
3. ⬜ Implement inquiry/quote system
4. ⬜ Add API routes for CRUD operations
5. ⬜ Build AI visualizer

### Future Enhancements
- Payment processing with Stripe
- Email notifications
- Advanced search with full-text search
- Product recommendations
- Vendor analytics dashboard
- Customer reviews and ratings
- Multi-language support
- Mobile app (React Native)

---

Built with ❤️ using Next.js 16 and Supabase
