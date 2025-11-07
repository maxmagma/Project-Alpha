import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon, SparklesIcon, ShoppingBagIcon, UsersIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover well-designed, carefully curated wedding products
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Subscribe for weekly emails featuring timeless, design-led products for your perfect day
            </p>
            <div className="flex max-w-md mx-auto gap-2">
              <input
                type="email"
                placeholder="name@email.com"
                className="flex-1 h-12 px-4 border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
              <Button size="lg" variant="default" className="border-2">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Link */}
      <section className="py-12 border-t border-b">
        <div className="container mx-auto px-4 text-center">
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm hover:text-muted-foreground transition-colors">
            Browse all products
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Everything You Need in One Place
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-3">Curated Marketplace</h3>
              <p className="text-sm text-muted-foreground">
                Browse thousands of wedding products from verified vendors. Rent or purchase decor, furniture, and more.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-3">AI Visualization</h3>
              <p className="text-sm text-muted-foreground">
                Upload your venue photo and see how products look in your space before you commit.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-3">Trusted Vendors</h3>
              <p className="text-sm text-muted-foreground">
                Connect directly with professional wedding vendors. Get quotes and book services seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
