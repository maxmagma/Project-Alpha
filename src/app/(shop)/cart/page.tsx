'use client'

import Link from 'next/link'
import { ArrowRightIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CartItem } from '@/components/cart/cart-item'
import { useCart } from '@/components/providers/cart-provider'
import { formatPrice } from '@/lib/utils/format'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, isLoading } = useCart()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner size="lg" className="py-20" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center py-12">
          <ShoppingBagIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Start browsing our marketplace to find products for your wedding
          </p>
          <Link href="/marketplace">
            <Button>
              Browse Products
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {items.length} {items.length === 1 ? 'Item' : 'Items'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-semibold">Calculated at checkout</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Link href="/checkout" className="w-full">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/marketplace" className="w-full">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Request Quote Option */}
          <Card className="mt-4">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Need customization or bulk pricing?
              </p>
              <Button variant="outline" className="w-full">
                Request a Quote
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
