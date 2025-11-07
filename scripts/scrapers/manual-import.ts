/**
 * Manual Import Handler
 * Handles CSV and JSON file imports
 */

import { BaseScraper, ScrapedProduct, ScraperResult } from './base-scraper'
import fs from 'fs'
import path from 'path'
import Papa from 'papaparse'

interface ManualProductRow {
  name: string
  description?: string
  price: string | number
  currency?: string
  images: string // Comma-separated URLs
  vendor_name: string
  vendor_url?: string
  category?: string
  source_url?: string
  external_id?: string
}

export class ManualImport extends BaseScraper {
  constructor(config: any) {
    super('manual', config)
  }

  /**
   * Import from file (JSON or CSV)
   */
  async importFromFile(filePath: string): Promise<ScraperResult> {
    const result: ScraperResult = {
      success: false,
      products: [],
      errors: [],
      stats: { total: 0, successful: 0, failed: 0 },
    }

    try {
      const ext = path.extname(filePath).toLowerCase()

      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`)
      }

      this.log(`Importing from ${filePath}`)

      let rows: ManualProductRow[] = []

      if (ext === '.json') {
        rows = await this.parseJSON(filePath)
      } else if (ext === '.csv') {
        rows = await this.parseCSV(filePath)
      } else {
        throw new Error(`Unsupported file format: ${ext}. Use .json or .csv`)
      }

      this.log(`Found ${rows.length} rows to import`)

      // Process each row
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]

        try {
          const product = this.processRow(row, i + 1)
          if (product && this.validateProduct(product)) {
            result.products.push(product)
            result.stats.successful++
          } else {
            result.stats.failed++
            result.errors.push(`Row ${i + 1}: Invalid product data`)
          }
        } catch (error: any) {
          this.logError(`Row ${i + 1} failed`, error)
          result.errors.push(`Row ${i + 1}: ${error.message}`)
          result.stats.failed++
        }

        result.stats.total++
      }

      result.success = result.stats.successful > 0
      this.log(`Import complete: ${result.stats.successful}/${result.stats.total} successful`)

      return result
    } catch (error: any) {
      this.logError('Import failed', error)
      result.errors.push(error.message)
      return result
    }
  }

  /**
   * Not used for manual imports
   */
  async scrape(): Promise<ScraperResult> {
    throw new Error('Use importFromFile() for manual imports')
  }

  /**
   * Parse JSON file
   */
  private async parseJSON(filePath: string): Promise<ManualProductRow[]> {
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
   * Parse CSV file
   */
  private async parseCSV(filePath: string): Promise<ManualProductRow[]> {
    return new Promise((resolve, reject) => {
      const content = fs.readFileSync(filePath, 'utf-8')

      Papa.parse(content, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data as ManualProductRow[])
        },
        error: (error) => {
          reject(error)
        },
      })
    })
  }

  /**
   * Process individual row
   */
  private processRow(row: ManualProductRow, rowNumber: number): ScrapedProduct {
    // Parse images
    const images = row.images
      ? row.images
          .split(',')
          .map((url) => url.trim())
          .filter((url) => url.startsWith('http'))
      : []

    if (images.length === 0) {
      throw new Error('At least one image URL is required')
    }

    // Parse price
    const price = this.normalizePrice(row.price)
    if (price <= 0) {
      throw new Error('Price must be greater than 0')
    }

    return {
      source: 'manual',
      externalId: row.external_id || `manual-${rowNumber}`,
      sourceUrl: row.source_url || '',
      name: row.name,
      description: this.cleanDescription(row.description || ''),
      price,
      currency: row.currency || 'USD',
      images,
      vendorName: row.vendor_name,
      vendorUrl: row.vendor_url,
      rawCategory: row.category,
      metadata: {
        importedRow: rowNumber,
      },
      scrapedAt: new Date(),
    }
  }

  /**
   * Generate CSV template
   */
  static generateTemplate(outputPath: string): void {
    const template = `name,description,price,currency,images,vendor_name,vendor_url,category,source_url
"Gold Candlestick Centerpiece","Elegant gold candlestick for wedding tables",45.99,USD,"https://example.com/image1.jpg,https://example.com/image2.jpg","Bella Decor","https://belladecor.com","Centerpieces","https://belladecor.com/product/123"
"Ivory Tablecloth Linen","Premium ivory linen tablecloth 90x120",89.99,USD,"https://example.com/linen1.jpg","Premier Linens","https://premierlinens.com","Linens","https://premierlinens.com/product/456"
"Crystal Votive Holder","Clear crystal votive candle holder",12.50,USD,"https://example.com/votive1.jpg","Crystal Co","https://crystalco.com","Decor","https://crystalco.com/product/789"
`

    fs.writeFileSync(outputPath, template, 'utf-8')
    console.log(`✅ Template generated: ${outputPath}`)
    console.log('\nInstructions:')
    console.log('1. Fill in your product data')
    console.log('2. For multiple images, separate URLs with commas')
    console.log('3. Save and import using: pnpm import:manual path/to/file.csv')
  }
}
