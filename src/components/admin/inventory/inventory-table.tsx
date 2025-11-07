'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BulkActions } from './bulk-actions'
import { toast } from 'sonner'

interface ScrapedProduct {
  id: string
  name: string
  vendor_name: string
  base_price: number
  currency: string
  primary_image: string
  import_source: string
  suggested_category: string
  suggested_fulfillment_type: string
  review_status: string
  ai_confidence: number
  created_at: string
}

interface InventoryTableProps {
  products: ScrapedProduct[]
}

export function InventoryTable({ products }: InventoryTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)

  function toggleSelectAll() {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)))
    }
  }

  function toggleSelect(id: string) {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  async function handleQuickAction(id: string, action: 'approve' | 'reject') {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/inventory/${id}/${action}`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to update product')

      toast.success(`Product ${action}ed successfully`)
      window.location.reload()
    } catch (error) {
      toast.error(`Failed to ${action} product`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {selectedIds.size > 0 && (
        <BulkActions
          selectedIds={Array.from(selectedIds)}
          onComplete={() => {
            setSelectedIds(new Set())
            window.location.reload()
          }}
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b-2 border-black bg-secondary">
            <tr>
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.size === products.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 border-2 border-black"
                />
              </th>
              <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">
                Product
              </th>
              <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">
                Vendor
              </th>
              <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">
                Price
              </th>
              <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">
                Category
              </th>
              <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">
                Source
              </th>
              <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">
                Confidence
              </th>
              <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">
                Status
              </th>
              <th className="p-4 text-right text-sm font-bold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-black hover:bg-secondary transition-colors"
              >
                {/* Checkbox */}
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(product.id)}
                    onChange={() => toggleSelect(product.id)}
                    className="w-4 h-4 border-2 border-black"
                  />
                </td>

                {/* Product */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {product.primary_image && (
                      <div className="relative w-16 h-16 bg-secondary border-2 border-black">
                        <Image
                          src={product.primary_image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0 max-w-xs">
                      <p className="font-semibold truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {product.id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                </td>

                {/* Vendor */}
                <td className="p-4">
                  <p className="text-sm font-medium">{product.vendor_name}</p>
                </td>

                {/* Price */}
                <td className="p-4">
                  <p className="font-bold">
                    ${product.base_price.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase">
                    {product.suggested_fulfillment_type}
                  </p>
                </td>

                {/* Category */}
                <td className="p-4">
                  <Badge variant="outline" className="border-black">
                    {product.suggested_category || 'Uncategorized'}
                  </Badge>
                </td>

                {/* Source */}
                <td className="p-4">
                  <SourceBadge source={product.import_source} />
                </td>

                {/* AI Confidence */}
                <td className="p-4">
                  <ConfidenceMeter
                    confidence={product.ai_confidence || 0.5}
                  />
                </td>

                {/* Status */}
                <td className="p-4">
                  <StatusBadge status={product.review_status} />
                </td>

                {/* Actions */}
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    {product.review_status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleQuickAction(product.id, 'approve')}
                          disabled={isSubmitting}
                          className="border-2"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuickAction(product.id, 'reject')}
                          disabled={isSubmitting}
                          className="border-2 border-black"
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="border-2 border-black"
                    >
                      <Link href={`/admin/inventory/${product.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function SourceBadge({ source }: { source: string }) {
  const colors: Record<string, string> = {
    amazon: 'bg-white text-black border-2 border-black',
    etsy: 'bg-secondary text-black border-2 border-black',
    rental: 'bg-white text-black border-2 border-black',
    manual: 'bg-secondary text-black border-2 border-black',
  }

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-bold uppercase tracking-wider ${
        colors[source] || 'bg-white border-2 border-black'
      }`}
    >
      {source}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-white text-black border-2 border-black',
    reviewed: 'bg-secondary text-black border-2 border-black',
    approved: 'bg-black text-white border-2 border-black',
    rejected: 'bg-white text-black border-2 border-black',
  }

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider ${
        styles[status] || 'bg-white border-2 border-black'
      }`}
    >
      {status}
    </span>
  )
}

function ConfidenceMeter({ confidence }: { confidence: number }) {
  const percentage = Math.round(confidence * 100)
  const isHigh = percentage >= 80
  const isMedium = percentage >= 60 && percentage < 80

  return (
    <div className="w-20">
      <div className="h-2 bg-secondary border-2 border-black">
        <div
          className={`h-full ${isHigh ? 'bg-black' : isMedium ? 'bg-muted-foreground' : 'bg-white border-r-2 border-black'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1">{percentage}%</p>
    </div>
  )
}
