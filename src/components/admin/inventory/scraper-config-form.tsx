'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface ScraperConfig {
  id: string
  source: string
  api_key: string | null
  api_secret: string | null
  affiliate_id: string | null
  is_enabled: boolean
  rate_limit: number
  notes: string | null
}

export function ScraperConfigForm({ config }: { config: ScraperConfig }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    api_key: config.api_key || '',
    api_secret: config.api_secret || '',
    affiliate_id: config.affiliate_id || '',
    rate_limit: config.rate_limit,
    is_enabled: config.is_enabled,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/inventory/config/${config.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to update configuration')

      toast.success('Configuration updated successfully')
      setIsEditing(false)
      window.location.reload()
    } catch (error) {
      toast.error('Failed to update configuration')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleCancel() {
    setFormData({
      api_key: config.api_key || '',
      api_secret: config.api_secret || '',
      affiliate_id: config.affiliate_id || '',
      rate_limit: config.rate_limit,
      is_enabled: config.is_enabled,
    })
    setIsEditing(false)
  }

  const sourceLabels: Record<string, string> = {
    amazon: 'Amazon',
    etsy: 'Etsy',
    scrapingdog: 'Scrapingdog',
    manual: 'Manual Import',
  }

  const sourceDescriptions: Record<string, string> = {
    amazon: 'Rainforest API or Scrapingdog for Amazon products',
    etsy: 'Official Etsy Open API for handmade wedding items',
    scrapingdog: 'General web scraping service',
    manual: 'CSV/JSON file imports',
  }

  return (
    <div className="bg-white border-2 border-black p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold uppercase tracking-wider">
            {sourceLabels[config.source] || config.source}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {sourceDescriptions[config.source] || config.notes}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_enabled}
              onChange={(e) => {
                setFormData({ ...formData, is_enabled: e.target.checked })
                setIsEditing(true)
              }}
              className="w-4 h-4 border-2 border-black"
            />
            <span className="text-sm font-bold uppercase tracking-wider">
              Enabled
            </span>
          </label>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                API Key {config.source !== 'manual' && '*'}
              </label>
              <Input
                type="password"
                value={formData.api_key}
                onChange={(e) =>
                  setFormData({ ...formData, api_key: e.target.value })
                }
                placeholder={config.source === 'manual' ? 'Not required' : 'Enter API key'}
                className="border-2 border-black"
                disabled={config.source === 'manual'}
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                Affiliate ID
              </label>
              <Input
                type="text"
                value={formData.affiliate_id}
                onChange={(e) =>
                  setFormData({ ...formData, affiliate_id: e.target.value })
                }
                placeholder={
                  config.source === 'amazon'
                    ? 'yoursite-20'
                    : config.source === 'etsy'
                      ? 'Awin Affiliate ID'
                      : 'Optional'
                }
                className="border-2 border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                Rate Limit (requests/minute)
              </label>
              <Input
                type="number"
                value={formData.rate_limit}
                onChange={(e) =>
                  setFormData({ ...formData, rate_limit: parseInt(e.target.value) })
                }
                min={1}
                max={60}
                className="border-2 border-black"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} className="border-2">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-2 border-black"
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-4 text-sm mb-4">
            <div>
              <p className="font-bold uppercase tracking-wider mb-1">API Key</p>
              <p className="text-muted-foreground">
                {formData.api_key ? '••••••••' : 'Not set'}
              </p>
            </div>
            <div>
              <p className="font-bold uppercase tracking-wider mb-1">Affiliate ID</p>
              <p className="text-muted-foreground">
                {formData.affiliate_id || 'Not set'}
              </p>
            </div>
            <div>
              <p className="font-bold uppercase tracking-wider mb-1">Rate Limit</p>
              <p className="text-muted-foreground">
                {formData.rate_limit} req/min
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="border-2 border-black"
          >
            Edit Configuration
          </Button>
        </div>
      )}
    </div>
  )
}
