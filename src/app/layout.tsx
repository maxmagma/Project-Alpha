import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { CartProvider } from '@/components/providers/cart-provider'

export const metadata: Metadata = {
  title: 'Wedding Marketplace - Find Your Perfect Wedding Products',
  description: 'Browse and visualize wedding rentals and products for your special day',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <CartProvider>
          {children}
          <Toaster position="top-center" />
        </CartProvider>
      </body>
    </html>
  )
}
