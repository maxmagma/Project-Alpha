'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface BulkActionsProps {
  selectedIds: string[]
  onComplete: () => void
}

export function BulkActions({ selectedIds, onComplete }: BulkActionsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleBulkAction(action: 'approve' | 'reject' | 'delete') {
    if (!confirm(`Are you sure you want to ${action} ${selectedIds.length} products?`)) {
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/admin/inventory/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, action }),
      })

      if (!response.ok) throw new Error(`Failed to ${action} products`)

      toast.success(`Successfully ${action}ed ${selectedIds.length} products`)
      onComplete()
    } catch (error) {
      toast.error(`Failed to ${action} products`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-black text-white p-4 flex items-center justify-between">
      <div>
        <p className="font-bold">
          {selectedIds.length} {selectedIds.length === 1 ? 'product' : 'products'} selected
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => handleBulkAction('approve')}
          disabled={isSubmitting}
          className="bg-white text-black border-2 border-white hover:bg-secondary"
        >
          Approve All
        </Button>

        <Button
          variant="outline"
          onClick={() => handleBulkAction('reject')}
          disabled={isSubmitting}
          className="bg-white text-black border-2 border-white hover:bg-secondary"
        >
          Reject All
        </Button>

        <Button
          variant="outline"
          onClick={() => handleBulkAction('delete')}
          disabled={isSubmitting}
          className="bg-white text-black border-2 border-white hover:bg-secondary"
        >
          Delete All
        </Button>

        <Button
          variant="ghost"
          onClick={onComplete}
          className="text-white hover:bg-white hover:text-black"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
