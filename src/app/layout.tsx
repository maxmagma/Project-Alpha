import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { VisionBoardProvider } from '@/components/providers/vision-board-provider'

export const metadata: Metadata = {
  title: 'WeddingHub - Discover Curated Wedding Products & Rentals',
  description: 'Browse curated wedding products, create your vision board, and get quotes from trusted vendors',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <VisionBoardProvider>
          {children}
          <Toaster position="top-center" />
        </VisionBoardProvider>
      </body>
    </html>
  )
}
