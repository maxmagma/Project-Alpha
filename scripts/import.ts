#!/usr/bin/env node
/**
 * Import Pipeline CLI
 * Usage:
 *   pnpm import data/amazon-1234567890.json
 *   pnpm import data/etsy-1234567890.json
 *   pnpm import:manual data/products.csv
 */

import { ImportPipeline } from './import/import-pipeline'
import { ManualImport } from './scrapers/manual-import'
import path from 'path'
import fs from 'fs'

// Load environment variables
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function main() {
  const [filePath] = process.argv.slice(2)

  if (!filePath) {
    printUsage()
    process.exit(1)
  }

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`)
    process.exit(1)
  }

  // Check for required environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase credentials')
    console.error('   Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ Missing Anthropic API key')
    console.error('   Set ANTHROPIC_API_KEY in .env.local for AI categorization')
    process.exit(1)
  }

  try {
    const ext = path.extname(filePath).toLowerCase()

    if (ext === '.csv') {
      await importManual(filePath)
    } else if (ext === '.json') {
      await importJSON(filePath)
    } else {
      console.error(`❌ Unsupported file format: ${ext}`)
      console.error('   Supported formats: .json, .csv')
      process.exit(1)
    }
  } catch (error: any) {
    console.error(`\n❌ Import failed: ${error.message}`)
    console.error(error.stack)
    process.exit(1)
  }
}

async function importJSON(filePath: string) {
  // Detect source from filename
  const filename = path.basename(filePath, '.json')
  let source = 'manual'

  if (filename.includes('amazon')) {
    source = 'amazon'
  } else if (filename.includes('etsy')) {
    source = 'etsy'
  } else if (filename.includes('rental')) {
    source = 'rental'
  }

  const pipeline = new ImportPipeline()
  await pipeline.importFromFile(filePath, source)
}

async function importManual(filePath: string) {
  console.log('\n📥 Starting manual import...\n')

  // First, use ManualImport to parse and validate
  const manualImport = new ManualImport({})
  const result = await manualImport.importFromFile(filePath)

  if (result.products.length === 0) {
    console.error('❌ No valid products found in file')
    process.exit(1)
  }

  console.log(`\n✅ Parsed ${result.products.length} products`)
  console.log(`   ${result.errors.length} errors`)

  if (result.errors.length > 0) {
    console.log('\n⚠️  Errors:')
    result.errors.slice(0, 5).forEach((err) => console.log(`  - ${err}`))
    if (result.errors.length > 5) {
      console.log(`  ... and ${result.errors.length - 5} more`)
    }
  }

  // Now import to database
  const pipeline = new ImportPipeline()
  await pipeline.importProducts(result.products, 'manual')
}

function printUsage() {
  console.log(`
Usage:
  pnpm import <file>

Import scraped products:
  pnpm import data/amazon-1234567890.json
  pnpm import data/etsy-1234567890.json

Import manual CSV:
  pnpm import data/products.csv

The import pipeline will:
  1. Read the file
  2. Use AI to categorize products
  3. Create vendors if needed
  4. Import to scraped_products table (staging)
  5. Products await admin approval in /admin/inventory/review

Environment variables required:
  NEXT_PUBLIC_SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
  ANTHROPIC_API_KEY
  `)
}

main()
