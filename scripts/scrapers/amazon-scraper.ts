/**
 * Amazon Scraper
 * Uses Rainforest API or similar Amazon product API
 * Docs: https://www.rainforestapi.com/docs/product-data-api/overview
 */

import { BaseScraper, ScrapedProduct, ScraperResult } from './base-scraper'

interface AmazonProduct {
  asin: string
  title: string
  description?: string
  price?: {
    value: number
    currency: string
  }
  main_image?: {
    link: string
  }
  images?: Array<{ link: string }>
  categories?: Array<{ name: string }>
  brand?: string
  link: string
}

export class AmazonScraper extends BaseScraper {
  private apiUrl = 'https://api.rainforestapi.com/request'

  constructor(config: any) {
    super('amazon', config)
    this.validateConfig()
  }

  protected validateConfig(): void {
    super.validateConfig()
    if (!this.config.apiKey) {
      throw new Error('Amazon scraper requires apiKey (Rainforest API key)')
    }
    if (!this.config.affiliateId) {
      console.warn('Amazon scraper: No affiliate ID provided. Affiliate links will not be generated.')
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
      this.log(`Starting Amazon scrape for: ${searchQuery || 'wedding products'}`)

      // Search for wedding products
      const searchResults = await this.searchProducts(
        searchQuery || 'wedding decorations centerpieces linens'
      )

      if (!searchResults || searchResults.length === 0) {
        result.errors.push('No products found in search')
        return result
      }

      this.log(`Found ${searchResults.length} products to scrape`)

      // Scrape each product
      for (let i = 0; i < searchResults.length; i++) {
        const asin = searchResults[i]
        this.log(`Scraping ${i + 1}/${searchResults.length}: ${asin}`)

        try {
          const product = await this.scrapeProduct(asin)
          if (product && this.validateProduct(product)) {
            result.products.push(product)
            result.stats.successful++
          } else {
            result.stats.failed++
          }
        } catch (error: any) {
          this.logError(`Failed to scrape ${asin}`, error)
          result.errors.push(`${asin}: ${error.message}`)
          result.stats.failed++
        }

        result.stats.total++

        // Rate limiting
        if (i < searchResults.length - 1) {
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
   * Search for products and return ASINs
   */
  private async searchProducts(query: string): Promise<string[]> {
    const params = new URLSearchParams({
      api_key: this.config.apiKey || '',
      type: 'search',
      amazon_domain: 'amazon.com',
      search_term: query,
      max_page: '1', // Adjust based on needs
    })

    const response = await fetch(`${this.apiUrl}?${params}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Amazon API error: ${data.message || response.statusText}`)
    }

    // Extract ASINs from search results
    const asins: string[] = []
    if (data.search_results) {
      for (const item of data.search_results) {
        if (item.asin && asins.length < (this.config.maxResults || 50)) {
          asins.push(item.asin)
        }
      }
    }

    return asins
  }

  /**
   * Scrape individual product by ASIN
   */
  private async scrapeProduct(asin: string): Promise<ScrapedProduct | null> {
    const params = new URLSearchParams({
      api_key: this.config.apiKey || '',
      type: 'product',
      amazon_domain: 'amazon.com',
      asin: asin,
    })

    const response = await fetch(`${this.apiUrl}?${params}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Amazon API error: ${data.message || response.statusText}`)
    }

    const product: AmazonProduct = data.product
    if (!product) return null

    // Extract images
    const images: string[] = []
    if (product.main_image?.link) {
      images.push(product.main_image.link)
    }
    if (product.images) {
      for (const img of product.images) {
        if (img.link && !images.includes(img.link)) {
          images.push(img.link)
        }
      }
    }

    // Build affiliate URL
    const affiliateUrl = this.buildAffiliateUrl(asin)

    return {
      source: 'amazon',
      externalId: asin,
      sourceUrl: product.link,
      name: product.title,
      description: this.cleanDescription(product.description || ''),
      price: product.price?.value || 0,
      currency: product.price?.currency || 'USD',
      images,
      vendorName: product.brand || 'Amazon',
      vendorUrl: 'https://amazon.com',
      rawCategory: product.categories?.[0]?.name,
      metadata: {
        asin,
        brand: product.brand,
        affiliateUrl,
      },
      scrapedAt: new Date(),
    }
  }

  /**
   * Build Amazon affiliate URL
   */
  private buildAffiliateUrl(asin: string): string {
    if (!this.config.affiliateId) {
      return `https://amazon.com/dp/${asin}`
    }

    return `https://amazon.com/dp/${asin}?tag=${this.config.affiliateId}`
  }
}
