/**
 * Base Scraper Interface
 * All scrapers extend this class for consistent output
 */

export interface ScraperConfig {
  apiKey?: string
  apiSecret?: string
  affiliateId?: string
  rateLimit?: number
  maxResults?: number
  [key: string]: any
}

export interface ScrapedProduct {
  // Source tracking
  source: string // 'amazon', 'etsy', 'rental', etc.
  externalId: string // ASIN, listing ID, etc.
  sourceUrl: string

  // Basic info
  name: string
  description?: string
  price: number
  currency: string

  // Images
  images: string[]

  // Vendor
  vendorName: string
  vendorUrl?: string

  // Raw category (will be AI-categorized later)
  rawCategory?: string

  // Metadata
  metadata?: Record<string, any>

  // Timestamp
  scrapedAt: Date
}

export interface ScraperResult {
  success: boolean
  products: ScrapedProduct[]
  errors: string[]
  stats: {
    total: number
    successful: number
    failed: number
  }
}

export abstract class BaseScraper {
  protected config: ScraperConfig
  protected source: string

  constructor(source: string, config: ScraperConfig) {
    this.source = source
    this.config = config
  }

  /**
   * Main scraping method - must be implemented by each scraper
   */
  abstract scrape(query?: string): Promise<ScraperResult>

  /**
   * Validate configuration
   */
  protected validateConfig(): void {
    if (!this.config) {
      throw new Error(`${this.source}: Configuration is required`)
    }
  }

  /**
   * Normalize price to decimal
   */
  protected normalizePrice(price: string | number): number {
    if (typeof price === 'number') return price

    // Remove currency symbols and convert to number
    const cleaned = price.replace(/[^0-9.]/g, '')
    return parseFloat(cleaned) || 0
  }

  /**
   * Clean and truncate description
   */
  protected cleanDescription(text: string, maxLength = 500): string {
    if (!text) return ''

    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, maxLength)
  }

  /**
   * Validate required fields
   */
  protected validateProduct(product: Partial<ScrapedProduct>): boolean {
    const required: (keyof ScrapedProduct)[] = [
      'source',
      'externalId',
      'sourceUrl',
      'name',
      'price',
      'vendorName',
    ]

    for (const field of required) {
      if (!product[field]) {
        console.warn(`Missing required field: ${field}`)
        return false
      }
    }

    if (!product.images || product.images.length === 0) {
      console.warn(`No images found for product: ${product.name}`)
      return false
    }

    return true
  }

  /**
   * Rate limiting helper
   */
  protected async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Calculate delay based on rate limit
   */
  protected getRateLimitDelay(): number {
    const rateLimit = this.config.rateLimit || 10 // requests per minute
    return (60 * 1000) / rateLimit // ms between requests
  }

  /**
   * Log progress
   */
  protected log(message: string): void {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] [${this.source}] ${message}`)
  }

  /**
   * Log error
   */
  protected logError(message: string, error?: any): void {
    const timestamp = new Date().toISOString()
    console.error(`[${timestamp}] [${this.source}] ERROR: ${message}`)
    if (error) {
      console.error(error)
    }
  }
}
