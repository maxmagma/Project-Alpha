'use client'

import Link from 'next/link'
import { ShoppingBagIcon, UserIcon, Bars3Icon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { useVisionBoard } from '@/components/providers/vision-board-provider'

export function Header() {
  const { totalItems } = useVisionBoard()

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 border-2 border-black flex items-center justify-center">
              <span className="text-xs font-bold">W</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm hover:text-muted-foreground transition-colors">
              Discover
            </Link>
            <Link href="/marketplace" className="text-sm hover:text-muted-foreground transition-colors">
              Browse
            </Link>
            <Link href="/visualizer" className="text-sm hover:text-muted-foreground transition-colors">
              Visualizer
            </Link>
            <Link href="/about" className="text-sm hover:text-muted-foreground transition-colors">
              Info
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Bars3Icon className="h-5 w-5" />
            </Button>

            <Link href="/vision-board">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBagIcon className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-black text-white text-xs flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">Vision Board ({totalItems} items)</span>
              </Button>
            </Link>

            <Link href="/auth/login">
              <Button variant="ghost" size="icon">
                <UserIcon className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
