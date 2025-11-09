/**
 * Etsy Scraper
 * Uses Etsy Open API v3
 * Docs: https://developers.etsy.com/documentation/
 */

import { BaseScraper, ScrapedProduct, ScraperResult } from './base-scraper'

interface EtsyListing {
  listing_id: number
  title: string
  description: string
  price: {
    amount: number
    divisor: number
    currency_code: string
  }
  url: string
  shop_id: number
  user_id: number
  taxonomy_id?: number
}

interface EtsyImage {
  listing_id: number
  url_570xN: string
  url_fullxfull: string
}

interface EtsyShop {
  shop_id: number
  shop_name: string
  url: string
}

export class EtsyScraper extends BaseScraper {
  private apiUrl = 'https://openapi.etsy.com/v3/application'

  constructor(config: any) {
    super('etsy', config)
    this.validateConfig()
  }

  protected validateConfig(): void {
    super.validateConfig()
    if (!this.config.apiKey) {
      throw new Error('Etsy scraper requires apiKey (Etsy API key)')
    }
  }

  async scrape(searchQuery?: string): Promise<ScraperResult> {
    const result: ScraperResult = {
      success: false,
      products: [],
      errors: [],
      stats: { total: 0, successful: 0, failed: 0 },
    }

    try {
      const keywords = searchQuery || 'wedding centerpiece, wedding decor, wedding table, wedding linens'
      this.log(`Starting Etsy scrape for: ${keywords}`)

      // Search for listings
      const listings = await this.searchListings(keywords)

      if (!listings || listings.length === 0) {
        result.errors.push('No listings found in search')
        return result
      }

      this.log(`Found ${listings.length} listings to process`)

      // Process each listing
      for (let i = 0; i < listings.length; i++) {
        const listing = listings[i]
        this.log(`Processing ${i + 1}/${listings.length}: ${listing.title}`)

        try {
          const product = await this.processListing(listing)
          if (product && this.validateProduct(product)) {
            result.products.push(product)
            result.stats.successful++
          } else {
            result.stats.failed++
          }
        } catch (error: any) {
          this.logError(`Failed to process listing ${listing.listing_id}`, error)
          result.errors.push(`${listing.listing_id}: ${error.message}`)
          result.stats.failed++
        }

        result.stats.total++

        // Rate limiting
        if (i < listings.length - 1) {
          await this.delay(this.getRateLimitDelay())
        }
      }

      result.success = result.stats.successful > 0
      this.log(`Scrape complete: ${result.stats.successful}/${result.stats.total} successful`)

      return result
    } catch (error: any) {
      this.logError('Scrape failed', error)
      result.errors.push(error.message)
      return result
    }
  }

  /**
   * Search Etsy listings
   */
  private async searchListings(keywords: string): Promise<EtsyListing[]> {
    const params = new URLSearchParams({
      keywords,
      limit: String(this.config.maxResults || 50),
      sort_on: 'score', // Relevance
      min_price: '10', // Filter out very cheap items
    })

    const response = await fetch(`${this.apiUrl}/listings/active?${params}`, {
      headers: {
        'x-api-key': this.config.apiKey || '',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Etsy API error: ${data.error || response.statusText}`)
    }

    return data.results || []
  }

  /**
   * Get listing images
   */
  private async getListingImages(listingId: number): Promise<string[]> {
    const response = await fetch(`${this.apiUrl}/listings/${listingId}/images`, {
      headers: {
        'x-api-key': this.config.apiKey || '',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.warn(`Failed to fetch images for ${listingId}`)
      return []
    }

    const images: EtsyImage[] = data.results || []
    return images.map((img) => img.url_fullxfull || img.url_570xN)
  }

  /**
   * Get shop info
   */
  private async getShop(shopId: number): Promise<EtsyShop | null> {
    try {
      const response = await fetch(`${this.apiUrl}/shops/${shopId}`, {
        headers: {
          'x-api-key': this.config.apiKey || '',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return null
      }

      return data
    } catch {
      return null
    }
  }

  /**
   * Process individual listing
   */
  private async processListing(listing: EtsyListing): Promise<ScrapedProduct | null> {
    // Get images
    const images = await this.getListingImages(listing.listing_id)
    await this.delay(200) // Small delay between API calls

    // Get shop info
    const shop = await this.getShop(listing.shop_id)
    await this.delay(200)

    // Calculate actual price (Etsy uses divisor)
    const price = listing.price.amount / listing.price.divisor

    // Build affiliate URL (using Awin or direct)
    const affiliateUrl = this.buildAffiliateUrl(listing.url)

    return {
      source: 'etsy',
      externalId: String(listing.listing_id),
      sourceUrl: listing.url,
      name: listing.title,
      description: this.cleanDescription(listing.description || ''),
      price,
      currency: listing.price.currency_code,
      images,
      vendorName: shop?.shop_name || 'Etsy Shop',
      vendorUrl: shop?.url,
      rawCategory: undefined,
      metadata: {
        listingId: listing.listing_id,
        shopId: listing.shop_id,
        taxonomyId: listing.taxonomy_id,
        affiliateUrl,
      },
      scrapedAt: new Date(),
    }
  }

  /**
   * Build Etsy affiliate URL
   * Uses Awin affiliate network
   */
  private buildAffiliateUrl(etsyUrl: string): string {
    if (!this.config.affiliateId) {
      return etsyUrl
    }

    // Awin affiliate link format
    const awinMerchantId = '6983' // Etsy's Awin merchant ID
    const awinAffiliateId = this.config.affiliateId

    return `https://www.awin1.com/cread.php?awinmid=${awinMerchantId}&awinaffid=${awinAffiliateId}&ued=${encodeURIComponent(etsyUrl)}`
  }
}
