'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function VendorError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console or error reporting service
    console.error('Vendor dashboard error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-4">Vendor Dashboard Error</h2>
        <p className="text-muted-foreground mb-6">
          We encountered an error in the vendor dashboard. Please try again.
        </p>
        {error.message && (
          <p className="text-sm text-muted-foreground mb-6 font-mono bg-secondary p-4 rounded">
            {error.message}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" onClick={() => window.location.href = '/vendor/dashboard'}>
            Go to dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
