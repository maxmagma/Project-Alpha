import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon, SparklesIcon, ShoppingBagIcon, UsersIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-black text-white py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Your Dream Wedding,
              <br />
              Simplified
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Browse curated wedding products and visualize your perfect venue setup with AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace">
                <Button size="lg" variant="outline" className="bg-white text-black hover:bg-gray-100 border-white">
                  Browse Marketplace
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/visualizer">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Try AI Visualizer
                  <SparklesIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Everything You Need in One Place
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-6">
                <ShoppingBagIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Curated Marketplace</h3>
              <p className="text-muted-foreground">
                Browse thousands of wedding products from verified vendors. Rent or purchase decor, furniture, and more.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-6">
                <SparklesIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Visualization</h3>
              <p className="text-muted-foreground">
                Upload your venue photo and see how products look in your space before you commit.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-6">
                <UsersIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Trusted Vendors</h3>
              <p className="text-muted-foreground">
                Connect directly with professional wedding vendors. Get quotes and book services seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Planning?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of couples who have found their perfect wedding products on WeddingHub
          </p>
          <Link href="/marketplace">
            <Button size="lg">
              Get Started
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
