import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-secondary/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">WeddingHub</h3>
            <p className="text-sm text-muted-foreground">
              Your premier destination for wedding rentals and products.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/marketplace" className="text-muted-foreground hover:text-foreground">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Decor" className="text-muted-foreground hover:text-foreground">
                  Decor
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Furniture" className="text-muted-foreground hover:text-foreground">
                  Furniture
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Lighting" className="text-muted-foreground hover:text-foreground">
                  Lighting
                </Link>
              </li>
            </ul>
          </div>

          {/* For Vendors */}
          <div>
            <h4 className="font-semibold mb-4">For Vendors</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/vendor/dashboard" className="text-muted-foreground hover:text-foreground">
                  Vendor Dashboard
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-muted-foreground hover:text-foreground">
                  Become a Vendor
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} WeddingHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
