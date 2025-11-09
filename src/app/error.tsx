'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console or error reporting service
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
            <p className="text-muted-foreground mb-6">
              We encountered an unexpected error. Please try again.
            </p>
            {error.message && (
              <p className="text-sm text-muted-foreground mb-6 font-mono bg-gray-100 p-4 rounded">
                {error.message}
              </p>
            )}
            <div className="flex gap-4 justify-center">
              <Button onClick={() => reset()}>Try again</Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Go home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
