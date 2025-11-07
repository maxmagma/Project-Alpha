/**
 * Import Pipeline
 * Takes scraped products and imports them to the staging database
 * Uses AI for categorization and metadata extraction
 */

import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import type { ScrapedProduct } from '../scrapers/base-scraper'

// Supabase client (service role for admin operations)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Claude AI client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

interface AIMetadata {
  category: string
  subcategory?: string
  fulfillmentType: 'purchasable' | 'rental' | 'service'
  styleTags: string[]
  colorPalette: string[]
  confidence: number
}

interface ImportStats {
  total: number
  imported: number
  failed: number
  duplicates: number
}

export class ImportPipeline {
  private batchId?: string
  private stats: ImportStats = {
    total: 0,
    imported: 0,
    failed: 0,
    duplicates: 0,
  }
  private errors: string[] = []

  /**
   * Import products from scraped JSON file
   */
  async importFromFile(filePath: string, source: string): Promise<void> {
    try {
      console.log(`\n📦 Starting import pipeline`)
      console.log(`   Source: ${source}`)
      console.log(`   File: ${filePath}\n`)

      // Read scraped products
      const products = this.readScrapedProducts(filePath)
      await this.importProducts(products, source)

      // Final report
      this.printReport()
    } catch (error: any) {
      console.error(`\n❌ Import failed: ${error.message}`)
      throw error
    }
  }

  /**
   * Import products from array (for programmatic use)
   */
  async importProducts(products: ScrapedProduct[], source: string): Promise<void> {
    try {
      // Create import batch
      await this.createBatch(source, products.length)

      // Process each product
      for (let i = 0; i < products.length; i++) {
        const product = products[i]
        console.log(`\n[${i + 1}/${products.length}] ${product.name}`)

        try {
          // Check for duplicates
          const isDuplicate = await this.checkDuplicate(product)
          if (isDuplicate) {
            console.log(`  ⚠️  Duplicate detected, skipping`)
            this.stats.duplicates++
            this.stats.total++
            continue
          }

          // Get or create vendor
          const vendorId = await this.getOrCreateVendor(product)
          console.log(`  ✓ Vendor: ${product.vendorName}`)

          // AI categorization
          const metadata = await this.categorizeWithAI(product)
          console.log(`  ✓ Category: ${metadata.category} (${(metadata.confidence * 100).toFixed(0)}% confidence)`)

          // Import to database
          await this.importToDatabase(product, vendorId, metadata)
          console.log(`  ✅ Imported to staging`)

          this.stats.imported++
        } catch (error: any) {
          console.error(`  ❌ Failed: ${error.message}`)
          this.errors.push(`${product.name}: ${error.message}`)
          this.stats.failed++
        }

        this.stats.total++
      }

      // Update batch status
      await this.completeBatch()
    } catch (error) {
      await this.failBatch()
      throw error
    }
  }

  /**
   * Read scraped products from JSON file
   */
  private readScrapedProducts(filePath: string): ScrapedProduct[] {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`)
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(content)

    if (Array.isArray(data)) {
      return data
    } else if (data.products && Array.isArray(data.products)) {
      return data.products
    } else {
      throw new Error('JSON must be an array or contain a "products" array')
    }
  }

  /**
   * Create import batch
   */
  private async createBatch(source: string, totalItems: number): Promise<void> {
    const { data, error } = await supabase
      .from('import_batches')
      .insert({
        source,
        status: 'processing',
        total_items: totalItems,
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to create batch: ${error.message}`)

    this.batchId = data.id
    console.log(`📋 Created import batch: ${this.batchId}`)
  }

  /**
   * Check if product is duplicate
   */
  private async checkDuplicate(product: ScrapedProduct): Promise<boolean> {
    // Check in scraped_products
    const { data: scrapedDupe } = await supabase
      .from('scraped_products')
      .select('id')
      .eq('import_source', product.source)
      .eq('external_id', product.externalId)
      .single()

    if (scrapedDupe) return true

    // Check in live products
    const { data: productDupe } = await supabase
      .from('products')
      .select('id')
      .eq('import_source', product.source)
      .eq('external_id', product.externalId)
      .single()

    return !!productDupe
  }

  /**
   * Get or create vendor
   */
  private async getOrCreateVendor(product: ScrapedProduct): Promise<string> {
    // Check if vendor exists
    const { data: existing } = await supabase
      .from('vendors')
      .select('id')
      .eq('company_name', product.vendorName)
      .single()

    if (existing) return existing.id

    // Create new vendor
    const { data: newVendor, error } = await supabase
      .from('vendors')
      .insert({
        company_name: product.vendorName,
        slug: this.slugify(product.vendorName),
        description: `${product.vendorName} - Wedding products`,
        website: product.vendorUrl || '',
        status: 'approved', // Auto-approve scraped vendors
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to create vendor: ${error.message}`)

    return newVendor.id
  }

  /**
   * Categorize product with AI
   */
  private async categorizeWithAI(product: ScrapedProduct): Promise<AIMetadata> {
    try {
      const prompt = `Categorize this wedding product for a marketplace:

Name: ${product.name}
Description: ${product.description || 'N/A'}
Price: $${product.price}
Vendor: ${product.vendorName}
Original Category: ${product.rawCategory || 'N/A'}

Valid categories: centerpieces, linens, chairs, lighting, placeSettings, decor, florals, furniture, tableware, signage, favors, other

Valid style tags: romantic, modern, rustic, boho, classic, vintage, minimalist, elegant, industrial, eclectic, coastal, garden

Return ONLY valid JSON (no markdown, no explanation):
{
  "category": "category from list above",
  "subcategory": "optional specific subcategory",
  "fulfillmentType": "purchasable|rental|service",
  "styleTags": ["tag1", "tag2", "tag3"],
  "colorPalette": ["#HEX1", "#HEX2", "#HEX3"],
  "confidence": 0.95
}`

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      })

      const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
      const metadata = JSON.parse(text)

      return {
        category: metadata.category || 'decor',
        subcategory: metadata.subcategory,
        fulfillmentType: metadata.fulfillmentType || 'purchasable',
        styleTags: metadata.styleTags || ['classic'],
        colorPalette: metadata.colorPalette || ['#FFFFFF'],
        confidence: metadata.confidence || 0.5,
      }
    } catch (error) {
      console.warn('  ⚠️  AI categorization failed, using defaults')
      return {
        category: 'decor',
        fulfillmentType: 'purchasable',
        styleTags: ['classic'],
        colorPalette: ['#FFFFFF'],
        confidence: 0.3,
      }
    }
  }

  /**
   * Import to scraped_products table
   */
  private async importToDatabase(
    product: ScrapedProduct,
    vendorId: string,
    metadata: AIMetadata
  ): Promise<void> {
    const { error } = await supabase.from('scraped_products').insert({
      import_batch_id: this.batchId,
      import_source: product.source,
      external_id: product.externalId,
      source_url: product.sourceUrl,
      name: product.name,
      description: product.description,
      raw_category: product.rawCategory,
      base_price: product.price,
      currency: product.currency,
      images: product.images,
      primary_image: product.images[0],
      vendor_name: product.vendorName,
      vendor_url: product.vendorUrl,
      suggested_category: metadata.category,
      suggested_subcategory: metadata.subcategory,
      suggested_fulfillment_type: metadata.fulfillmentType,
      suggested_style_tags: metadata.styleTags,
      suggested_color_palette: metadata.colorPalette,
      ai_confidence: metadata.confidence,
      affiliate_network: this.getAffiliateNetwork(product.source),
      affiliate_url: product.metadata?.affiliateUrl || product.sourceUrl,
      review_status: 'pending',
      raw_data: product.metadata || {},
    })

    if (error) throw error
  }

  /**
   * Complete batch
   */
  private async completeBatch(): Promise<void> {
    if (!this.batchId) return

    await supabase
      .from('import_batches')
      .update({
        status: 'completed',
        imported_items: this.stats.imported,
        failed_items: this.stats.failed,
        duplicate_items: this.stats.duplicates,
        errors: this.errors,
      })
      .eq('id', this.batchId)
  }

  /**
   * Mark batch as failed
   */
  private async failBatch(): Promise<void> {
    if (!this.batchId) return

    await supabase
      .from('import_batches')
      .update({
        status: 'failed',
        errors: this.errors,
      })
      .eq('id', this.batchId)
  }

  /**
   * Print final report
   */
  private printReport(): void {
    console.log('\n' + '='.repeat(50))
    console.log('📊 IMPORT COMPLETE')
    console.log('='.repeat(50))
    console.log(`Total processed:  ${this.stats.total}`)
    console.log(`✅ Imported:      ${this.stats.imported}`)
    console.log(`⚠️  Duplicates:    ${this.stats.duplicates}`)
    console.log(`❌ Failed:        ${this.stats.failed}`)
    console.log(`Batch ID:         ${this.batchId}`)

    if (this.errors.length > 0) {
      console.log('\n⚠️  Errors:')
      this.errors.slice(0, 10).forEach((err) => console.log(`  - ${err}`))
      if (this.errors.length > 10) {
        console.log(`  ... and ${this.errors.length - 10} more`)
      }
    }

    console.log('\n✨ Next steps:')
    console.log(`   1. Go to /admin/inventory/review`)
    console.log(`   2. Review imported products`)
    console.log(`   3. Approve to publish on marketplace`)
    console.log('='.repeat(50) + '\n')
  }

  /**
   * Get affiliate network from source
   */
  private getAffiliateNetwork(source: string): string {
    const networks: Record<string, string> = {
      amazon: 'amazon',
      etsy: 'awin',
      rental: 'direct',
      manual: 'direct',
    }
    return networks[source] || 'direct'
  }

  /**
   * Slugify string
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }
}
