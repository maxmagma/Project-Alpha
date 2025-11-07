'use client'

import { useVisionBoard } from '@/components/providers/vision-board-provider'
import { Header } from '@/components/shared/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils/format'
import {
  TrashIcon,
  ArrowUpRightIcon,
  SparklesIcon,
  ShoppingBagIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline'
import { VisionBoardItem } from '@/types/vision-board'
import { toast } from 'sonner'

export default function VisionBoardPage() {
  const {
    items,
    purchasableItems,
    rentalItems,
    totalPurchaseValue,
    totalRentalValue,
    removeItem,
    updateQuantity,
    updateNotes,
    isLoading,
  } = useVisionBoard()

  function handleOpenAllPurchaseLinks() {
    if (purchasableItems.length === 0) return

    purchasableItems.forEach((item) => {
      const url = item.product.affiliate_url || item.product.external_url
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    })

    toast.success(`Opened ${purchasableItems.length} purchase links`)
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white">
          <div className="container mx-auto px-4 py-20">
            <div className="text-center">
              <p className="text-lg">Loading vision board...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-2xl mx-auto text-center">
              <ShoppingBagIcon className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Vision Board is Empty</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Start adding items to build your perfect wedding
              </p>
              <Link href="/marketplace">
                <Button size="lg" className="border-2">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Vision Board</h1>
            <p className="text-lg text-muted-foreground">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>

          {/* Global Actions */}
          <div className="mb-12 flex flex-col sm:flex-row gap-4">
            <Link href="/visualizer" className="flex-1">
              <Button variant="outline" size="lg" className="w-full border-2">
                <SparklesIcon className="mr-2 h-5 w-5" />
                Visualize at My Venue
              </Button>
            </Link>
          </div>

          {/* Purchasable Items Section */}
          {purchasableItems.length > 0 && (
            <section className="mb-16">
              <div className="mb-6 pb-6 border-b-2 border-black">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Items to Purchase</h2>
                    <p className="text-sm text-muted-foreground">
                      Click through to buy these items directly from vendors
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Estimated Total
                    </p>
                    <p className="text-2xl font-bold">{formatPrice(totalPurchaseValue)}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 mb-6">
                {purchasableItems.map((item) => (
                  <VisionBoardItemCard
                    key={item.id}
                    item={item}
                    onRemove={removeItem}
                    onUpdateQuantity={updateQuantity}
                    onUpdateNotes={updateNotes}
                  />
                ))}
              </div>

              <Button
                onClick={handleOpenAllPurchaseLinks}
                size="lg"
                className="w-full border-2"
              >
                Open All Purchase Links
                <ArrowUpRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </section>
          )}

          {/* Rental Items Section */}
          {rentalItems.length > 0 && (
            <section>
              <div className="mb-6 pb-6 border-b-2 border-black">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Rental Items</h2>
                    <p className="text-sm text-muted-foreground">
                      Submit a quote request to receive pricing from vendors
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Estimated Total
                    </p>
                    <p className="text-2xl font-bold">{formatPrice(totalRentalValue)}</p>
                    <p className="text-xs text-muted-foreground">per event</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 mb-6">
                {rentalItems.map((item) => (
                  <VisionBoardItemCard
                    key={item.id}
                    item={item}
                    onRemove={removeItem}
                    onUpdateQuantity={updateQuantity}
                    onUpdateNotes={updateNotes}
                  />
                ))}
              </div>

              <Link href="/inquiry">
                <Button size="lg" className="w-full border-2">
                  Request Quotes from Vendors
                  <ArrowUpRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </section>
          )}
        </div>
      </div>
    </>
  )
}

function VisionBoardItemCard({
  item,
  onRemove,
  onUpdateQuantity,
  onUpdateNotes,
}: {
  item: VisionBoardItem
  onRemove: (itemId: string) => Promise<void>
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>
  onUpdateNotes: (itemId: string, notes: string) => Promise<void>
}) {
  const { product, quantity, notes } = item
  const vendorName = product.vendor?.company_name || 'Vendor'
  const isRental = product.fulfillment_type === 'rental' || product.fulfillment_type === 'service'

  async function handleRemove() {
    try {
      await onRemove(item.id)
      toast.success('Item removed from vision board')
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  async function handleQuantityChange(newQuantity: number) {
    if (newQuantity < 1) return
    try {
      await onUpdateQuantity(item.id, newQuantity)
    } catch (error) {
      toast.error('Failed to update quantity')
    }
  }

  async function handleNotesBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
    const newNotes = e.target.value
    if (newNotes === notes) return
    try {
      await onUpdateNotes(item.id, newNotes)
      toast.success('Notes saved')
    } catch (error) {
      toast.error('Failed to save notes')
    }
  }

  const subtotal = Number(product.base_price) * quantity

  return (
    <Card className="overflow-hidden border-2 border-black">
      <div className="grid md:grid-cols-[200px_1fr] gap-6 p-6">
        {/* Product Image */}
        <Link href={`/marketplace/${product.id}`}>
          <div className="aspect-square bg-secondary relative border border-black/10 hover:opacity-75 transition-opacity">
            {product.primary_image ? (
              <Image
                src={product.primary_image}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No image
              </div>
            )}
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="flex-1">
            <Link href={`/marketplace/${product.id}`}>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {vendorName} • {product.category}
              </p>
              <h3 className="text-xl font-bold mb-3 hover:underline">{product.name}</h3>
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Unit Price
                </p>
                <p className="text-lg font-bold">{formatPrice(Number(product.base_price))}</p>
                {isRental && (
                  <p className="text-xs text-muted-foreground">per event</p>
                )}
              </div>

              <div className="h-12 w-px bg-black/10" />

              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Quantity
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-2"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <span className="font-bold w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-2"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="h-12 w-px bg-black/10" />

              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Subtotal
                </p>
                <p className="text-lg font-bold">{formatPrice(subtotal)}</p>
              </div>
            </div>

            {/* Notes Field */}
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                Notes (Optional)
              </label>
              <Textarea
                placeholder="Add any special requirements, preferences, or questions..."
                defaultValue={notes || ''}
                onBlur={handleNotesBlur}
                className="border-2 border-black min-h-[80px] resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleRemove}
              variant="outline"
              size="sm"
              className="border-2"
            >
              <TrashIcon className="mr-1 h-4 w-4" />
              Remove
            </Button>

            {product.fulfillment_type === 'purchasable' && (
              <Button
                onClick={() => {
                  const url = product.affiliate_url || product.external_url
                  if (url) window.open(url, '_blank', 'noopener,noreferrer')
                }}
                variant="outline"
                size="sm"
                className="border-2"
              >
                Buy Now
                <ArrowUpRightIcon className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
