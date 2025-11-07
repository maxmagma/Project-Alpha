#!/usr/bin/env node
/**
 * Main Scraper CLI
 * Usage:
 *   pnpm scrape amazon "wedding centerpieces"
 *   pnpm scrape etsy "wedding decor"
 *   pnpm scrape all
 */

import { AmazonScraper } from './scrapers/amazon-scraper'
import { EtsyScraper } from './scrapers/etsy-scraper'
import { ManualImport } from './scrapers/manual-import'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Load environment variables
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  const [source, ...args] = process.argv.slice(2)

  if (!source) {
    printUsage()
    process.exit(1)
  }

  // Create data directory if it doesn't exist
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  try {
    if (source === 'amazon') {
      await scrapeAmazon(args[0])
    } else if (source === 'etsy') {
      await scrapeEtsy(args[0])
    } else if (source === 'all') {
      await scrapeAll()
    } else if (source === 'template') {
      generateTemplate()
    } else {
      console.error(`Unknown source: ${source}`)
      printUsage()
      process.exit(1)
    }
  } catch (error: any) {
    console.error(`\n❌ Scraping failed: ${error.message}`)
    process.exit(1)
  }
}

async function scrapeAmazon(query?: string) {
  console.log('\n🛒 Starting Amazon scraper...\n')

  // Get config from database
  const config = await getScraperConfig('amazon')

  if (!config.apiKey) {
    console.error('❌ Amazon scraper not configured.')
    console.error('   Add your Rainforest API key to scraper_configs table')
    console.error('   Or set AMAZON_API_KEY in .env.local')
    process.exit(1)
  }

  const scraper = new AmazonScraper(config)
  const result = await scraper.scrape(query)

  // Save results
  const outputPath = path.join(process.cwd(), 'data', `amazon-${Date.now()}.json`)
  fs.writeFileSync(outputPath, JSON.stringify(result.products, null, 2))

  console.log(`\n✅ Saved ${result.products.length} products to: ${outputPath}`)
  console.log(`\nNext step: pnpm import ${outputPath}`)
}

async function scrapeEtsy(query?: string) {
  console.log('\n🎨 Starting Etsy scraper...\n')

  // Get config from database
  const config = await getScraperConfig('etsy')

  if (!config.apiKey) {
    console.error('❌ Etsy scraper not configured.')
    console.error('   Add your Etsy API key to scraper_configs table')
    console.error('   Or set ETSY_API_KEY in .env.local')
    process.exit(1)
  }

  const scraper = new EtsyScraper(config)
  const result = await scraper.scrape(query)

  // Save results
  const outputPath = path.join(process.cwd(), 'data', `etsy-${Date.now()}.json`)
  fs.writeFileSync(outputPath, JSON.stringify(result.products, null, 2))

  console.log(`\n✅ Saved ${result.products.length} products to: ${outputPath}`)
  console.log(`\nNext step: pnpm import ${outputPath}`)
}

async function scrapeAll() {
  console.log('\n🚀 Scraping all sources...\n')

  const results = []

  // Amazon
  try {
    console.log('Starting Amazon...')
    await scrapeAmazon('wedding decorations')
    results.push('Amazon: ✅')
  } catch (error: any) {
    results.push(`Amazon: ❌ ${error.message}`)
  }

  // Etsy
  try {
    console.log('\nStarting Etsy...')
    await scrapeEtsy('wedding decor, wedding centerpiece')
    results.push('Etsy: ✅')
  } catch (error: any) {
    results.push(`Etsy: ❌ ${error.message}`)
  }

  console.log('\n' + '='.repeat(50))
  console.log('SCRAPING SUMMARY')
  console.log('='.repeat(50))
  results.forEach((r) => console.log(r))
  console.log('='.repeat(50))
}

async function getScraperConfig(source: string): Promise<any> {
  // Try database first
  const { data } = await supabase
    .from('scraper_configs')
    .select('*')
    .eq('source', source)
    .eq('is_enabled', true)
    .single()

  if (data) {
    return {
      apiKey: data.api_key,
      apiSecret: data.api_secret,
      affiliateId: data.affiliate_id,
      rateLimit: data.rate_limit,
      ...data.config,
    }
  }

  // Fallback to environment variables
  const envPrefix = source.toUpperCase()
  return {
    apiKey: process.env[`${envPrefix}_API_KEY`],
    apiSecret: process.env[`${envPrefix}_API_SECRET`],
    affiliateId: process.env[`${envPrefix}_AFFILIATE_ID`],
    rateLimit: 10,
    maxResults: 50,
  }
}

function generateTemplate() {
  const templatePath = path.join(process.cwd(), 'data', 'import-template.csv')
  ManualImport.generateTemplate(templatePath)
}

function printUsage() {
  console.log(`
Usage:
  pnpm scrape <source> [query]

Sources:
  amazon [query]    Scrape Amazon products
  etsy [query]      Scrape Etsy products
  all               Scrape all configured sources
  template          Generate CSV import template

Examples:
  pnpm scrape amazon "wedding centerpieces"
  pnpm scrape etsy "rustic wedding decor"
  pnpm scrape all
  pnpm scrape template

Configuration:
  Add API keys to scraper_configs table in Supabase
  Or set environment variables in .env.local:
    AMAZON_API_KEY, AMAZON_AFFILIATE_ID
    ETSY_API_KEY, ETSY_AFFILIATE_ID
  `)
}

main()
