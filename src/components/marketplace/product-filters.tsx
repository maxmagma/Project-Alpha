'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { PRODUCT_CATEGORIES, STYLE_TAGS, PRICE_RANGES } from '@/lib/constants'

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category')
  const currentStyle = searchParams.get('style')
  const currentPrice = searchParams.get('price')

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page') // Reset to first page
    router.push(`/marketplace?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <button
            onClick={() => updateFilter('category', null)}
            className={`block w-full text-left text-sm py-1 hover:text-foreground ${
              !currentCategory ? 'font-semibold' : 'text-muted-foreground'
            }`}
          >
            All
          </button>
          {PRODUCT_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => updateFilter('category', category)}
              className={`block w-full text-left text-sm py-1 hover:text-foreground ${
                currentCategory === category ? 'font-semibold' : 'text-muted-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Style Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Style</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {STYLE_TAGS.map((style) => (
            <Badge
              key={style}
              variant={currentStyle === style ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() =>
                updateFilter('style', currentStyle === style ? null : style)
              }
            >
              {style}
            </Badge>
          ))}
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {PRICE_RANGES.map((range, index) => (
            <button
              key={index}
              onClick={() =>
                updateFilter('price', currentPrice === range.label ? null : range.label)
              }
              className={`block w-full text-left text-sm py-1 hover:text-foreground ${
                currentPrice === range.label ? 'font-semibold' : 'text-muted-foreground'
              }`}
            >
              {range.label}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Clear Filters */}
      {(currentCategory || currentStyle || currentPrice) && (
        <button
          onClick={() => router.push('/marketplace')}
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}
