'use client'

import Link from 'next/link'
import { ShoppingCartIcon, UserIcon, Bars3Icon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/providers/cart-provider'

export function Header() {
  const { totalItems } = useCart()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            Wedding<span className="text-gray-400">Hub</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/marketplace" className="text-sm hover:text-gray-600">
              Marketplace
            </Link>
            <Link href="/visualizer" className="text-sm hover:text-gray-600">
              Visualizer
            </Link>
            <Link href="/about" className="text-sm hover:text-gray-600">
              About
            </Link>
            <Link href="/vendor/dashboard" className="text-sm hover:text-gray-600">
              For Vendors
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCartIcon className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/auth/login">
              <Button variant="ghost" size="icon">
                <UserIcon className="h-5 w-5" />
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Bars3Icon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
