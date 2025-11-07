'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useTransition } from 'react'

export function InventoryFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get('search') || '')

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    startTransition(() => {
      router.push(`/admin/inventory?${params.toString()}`)
    })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateFilter('search', search)
  }

  function clearFilters() {
    setSearch('')
    startTransition(() => {
      router.push('/admin/inventory')
    })
  }

  const hasFilters =
    searchParams.get('status') ||
    searchParams.get('source') ||
    searchParams.get('category') ||
    searchParams.get('search')

  return (
    <div className="bg-white border-2 border-black p-6 mb-6">
      <div className="grid grid-cols-4 gap-4 mb-4">
        {/* Status Filter */}
        <FilterSelect
          label="Status"
          value={searchParams.get('status') || ''}
          onChange={(value) => updateFilter('status', value)}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'pending', label: 'Pending' },
            { value: 'reviewed', label: 'Reviewed' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
          ]}
        />

        {/* Source Filter */}
        <FilterSelect
          label="Source"
          value={searchParams.get('source') || ''}
          onChange={(value) => updateFilter('source', value)}
          options={[
            { value: '', label: 'All Sources' },
            { value: 'amazon', label: 'Amazon' },
            { value: 'etsy', label: 'Etsy' },
            { value: 'rental', label: 'Rentals' },
            { value: 'manual', label: 'Manual' },
          ]}
        />

        {/* Category Filter */}
        <FilterSelect
          label="Category"
          value={searchParams.get('category') || ''}
          onChange={(value) => updateFilter('category', value)}
          options={[
            { value: '', label: 'All Categories' },
            { value: 'centerpieces', label: 'Centerpieces' },
            { value: 'linens', label: 'Linens' },
            { value: 'chairs', label: 'Chairs' },
            { value: 'lighting', label: 'Lighting' },
            { value: 'placeSettings', label: 'Place Settings' },
            { value: 'decor', label: 'Decor' },
            { value: 'florals', label: 'Florals' },
            { value: 'furniture', label: 'Furniture' },
          ]}
        />

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-2 border-black"
          />
          <Button type="submit" className="border-2" disabled={isPending}>
            Search
          </Button>
        </form>
      </div>

      {hasFilters && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="border-2 border-black"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider font-bold mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-2 border-black p-2 bg-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
