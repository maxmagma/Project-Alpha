# Inventory Management & Scraping System

Complete documentation for the automated product import and inventory management system.

## Overview

This system allows you to automatically scrape wedding products from external marketplaces (Amazon, Etsy, etc.) and local rental vendors, import them into your database, and manage them through an admin interface before publishing to your marketplace.

## Architecture

```
External Sources → Scrapers → JSON Files → Import Pipeline → Staging DB → Admin Review → Live Products → Marketplace
```

### Components

1. **Scrapers** - Extract product data from external sources
2. **Import Pipeline** - Transform and import to staging database
3. **Admin UI** - Review, edit, and approve products
4. **Live Products** - Published on marketplace

## Quick Start

### 1. Database Setup

Run the SQL migration to create required tables:

```bash
# User manually executes this in Supabase Dashboard
supabase/migrations/20251104000001_add_inventory_system.sql
```

This creates:
- `import_batches` - Track import jobs
- `scraped_products` - Staging area for review
- `scraper_configs` - API keys and settings

### 2. Install Dependencies

```bash
pnpm install
```

New dependencies added:
- `@anthropic-ai/sdk` - AI categorization
- `dotenv` - Environment variables
- `papaparse` - CSV parsing
- `tsx` - TypeScript execution

### 3. Configure Environment Variables

Add to `.env.local`:

```bash
# Required for all imports
ANTHROPIC_API_KEY=sk-ant-xxx

# Amazon scraping (Rainforest API or Scrapingdog)
AMAZON_API_KEY=your_api_key
AMAZON_AFFILIATE_ID=yoursite-20

# Etsy scraping (Official Etsy API)
ETSY_API_KEY=your_etsy_api_key
ETSY_AFFILIATE_ID=your_awin_affiliate_id

# Scrapingdog (optional - for general web scraping)
SCRAPINGDOG_API_KEY=your_scrapingdog_key
```

### 4. Configure Scrapers (Admin UI)

1. Go to `/admin/inventory/config`
2. Enter API keys for each source
3. Set affiliate IDs for commission tracking
4. Enable/disable sources as needed

## Usage

### Scraping Products

```bash
# Scrape Amazon products
pnpm scrape:amazon "wedding centerpieces"
pnpm scrape:amazon "table linens rental"

# Scrape Etsy products
pnpm scrape:etsy "rustic wedding decor"
pnpm scrape:etsy "wedding place settings"

# Scrape all configured sources
pnpm scrape:all

# Generate CSV import template
pnpm scrape:template
```

**Output:** Scraped products saved to `data/` directory as JSON files.

### Importing Products

```bash
# Import scraped products
pnpm import data/amazon-1234567890.json
pnpm import data/etsy-1234567890.json

# Import manual CSV
pnpm import data/products.csv
```

**What happens:**
1. Creates import batch record
2. Validates product data
3. Uses AI (Claude) to categorize products
4. Creates/matches vendors
5. Imports to `scraped_products` table (staging)
6. Products await admin review

### Admin Review Workflow

1. **Go to `/admin/inventory`**
   - View all scraped products
   - Filter by status, source, category
   - Search by name

2. **Bulk Operations**
   - Select multiple products
   - Approve all, Reject all, or Delete all

3. **Individual Review**
   - Click "Edit" on any product
   - Review and modify:
     - Product name, description
     - Pricing
     - Category, subcategory
     - Style tags
     - Images (add, remove, reorder)
     - Vendor information
   - Save changes or Approve to publish

4. **Approval**
   - Approving a product:
     - Creates vendor if needed
     - Moves product to `products` table
     - Makes it live on marketplace
     - Tracks affiliate links

## Admin Interface

### Pages

1. **`/admin/inventory`** - Main inventory dashboard
   - Stats: Pending, Reviewed, Approved, Rejected
   - Filters: Status, Source, Category, Search
   - Bulk actions
   - Product table with quick approve/reject

2. **`/admin/inventory/[id]/edit`** - Product editor
   - Full product details
   - Image management
   - Style tag selector
   - Approve, Reject, or Save buttons

3. **`/admin/inventory/batches`** - Import history
   - View all import batches
   - Stats per batch
   - Filter products by batch

4. **`/admin/inventory/config`** - Scraper configuration
   - Manage API keys
   - Set affiliate IDs
   - Enable/disable sources
   - Rate limiting

## Data Flow

### Scraping Phase

```typescript
// Example: Amazon scraper
AmazonScraper
  → Search products
  → Extract product details (name, price, images, vendor)
  → Build affiliate links
  → Save to JSON file
```

**Output:**
```json
{
  "source": "amazon",
  "externalId": "B08XYZ123",
  "sourceUrl": "https://amazon.com/dp/B08XYZ123",
  "name": "Gold Candlestick Centerpiece",
  "description": "Elegant wedding centerpiece...",
  "price": 45.99,
  "currency": "USD",
  "images": ["https://..."],
  "vendorName": "Bella Decor",
  "vendorUrl": "https://belladecor.com",
  "metadata": {
    "affiliateUrl": "https://amazon.com/dp/B08XYZ123?tag=yoursite-20"
  }
}
```

### Import Phase

```typescript
ImportPipeline
  → Read JSON file
  → Check for duplicates
  → Get/create vendor
  → AI categorization (Claude)
  → Import to scraped_products table
  → Create import batch record
```

**AI Categorization:**
Claude analyzes each product and suggests:
- Category (centerpieces, linens, chairs, etc.)
- Fulfillment type (purchasable, rental, service)
- Style tags (romantic, modern, rustic, etc.)
- Color palette
- Confidence score (0.0-1.0)

### Admin Review Phase

```typescript
Admin UI
  → View scraped products
  → Edit details
  → Approve product
  → Create vendor (if needed)
  → Move to products table
  → Publish to marketplace
```

## Database Schema

### `import_batches`
Tracks each import job.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| source | TEXT | amazon, etsy, rental, manual |
| status | TEXT | processing, completed, failed |
| total_items | INT | Total products in batch |
| imported_items | INT | Successfully imported |
| failed_items | INT | Failed imports |
| duplicate_items | INT | Detected duplicates |
| created_by | UUID | Admin user who ran import |

### `scraped_products`
Staging area for products before approval.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| import_batch_id | UUID | Link to import batch |
| import_source | TEXT | amazon, etsy, etc. |
| external_id | TEXT | ASIN, listing ID |
| source_url | TEXT | Original product URL |
| name | TEXT | Product name |
| description | TEXT | Product description |
| base_price | DECIMAL | Product price |
| images | TEXT[] | Image URLs |
| vendor_name | TEXT | Vendor name |
| suggested_category | TEXT | AI-suggested category |
| suggested_fulfillment_type | TEXT | purchasable, rental, service |
| suggested_style_tags | TEXT[] | AI-suggested style tags |
| ai_confidence | DECIMAL | 0.0-1.0 |
| review_status | TEXT | pending, reviewed, approved, rejected |
| affiliate_network | TEXT | amazon, awin, direct |
| affiliate_url | TEXT | Affiliate tracking link |

### `scraper_configs`
API keys and scraper settings.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| source | TEXT | amazon, etsy, etc. |
| api_key | TEXT | API key (encrypted in prod) |
| affiliate_id | TEXT | Affiliate tracking ID |
| is_enabled | BOOLEAN | Enable/disable scraper |
| rate_limit | INT | Requests per minute |

### `products` (updated)
Added columns for import tracking:

- `import_source` - Where product was imported from
- `import_batch_id` - Link to import batch
- `external_id` - Original ID from source
- `affiliate_network` - Affiliate network name
- `affiliate_url` - Affiliate tracking URL
- `scraped_product_id` - Link to staging record

## API Endpoints

### Inventory Management

```
GET    /api/admin/inventory/[id]        Get scraped product
PATCH  /api/admin/inventory/[id]        Update scraped product
DELETE /api/admin/inventory/[id]        Delete scraped product

POST   /api/admin/inventory/[id]/approve  Approve and publish product
POST   /api/admin/inventory/[id]/reject   Reject product

POST   /api/admin/inventory/bulk           Bulk operations
```

### Scraper Configuration

```
PATCH  /api/admin/inventory/config/[id]  Update scraper config
```

## Affiliate Tracking

Products maintain affiliate links for commission tracking:

### Amazon
- Network: Amazon Associates
- Format: `https://amazon.com/dp/{ASIN}?tag={YOUR_TAG}`

### Etsy
- Network: Awin
- Format: `https://www.awin1.com/cread.php?awinmid=6983&awinaffid={YOUR_ID}&ued={ETSY_URL}`

## Manual Import (CSV)

### Generate Template

```bash
pnpm scrape:template
```

### CSV Format

```csv
name,description,price,currency,images,vendor_name,vendor_url,category,source_url
"Gold Candlestick","Elegant centerpiece",45.99,USD,"https://img1.jpg,https://img2.jpg","Bella Decor","https://belladecor.com","Centerpieces","https://source.com/product"
```

**Required Fields:**
- name, price, images, vendor_name

**Optional Fields:**
- description, currency, vendor_url, category, source_url

### Import CSV

```bash
pnpm import data/products.csv
```

## Costs & Limits

### API Costs

| Service | Cost | Limits |
|---------|------|--------|
| **Amazon (Rainforest API)** | $0.006/request | 100 req/month free |
| **Amazon (Scrapingdog)** | $20/month | 10,000 credits |
| **Etsy API** | FREE | 10,000 req/day |
| **Anthropic Claude** | $0.003/1K tokens | ~500 products = $1 |

### Recommended Plan

- **Scrapingdog:** $20/month (Amazon)
- **Etsy API:** Free (Etsy)
- **Anthropic:** ~$5/month (AI categorization)

**Total:** $25/month for 250+ products

## Best Practices

### 1. Start Small
```bash
# Test with small batches first
pnpm scrape:amazon "wedding centerpieces" # Gets ~50 products
pnpm import data/amazon-*.json
```

### 2. Review Settings
- Set appropriate rate limits (10 req/min recommended)
- Test affiliate links before bulk importing
- Validate AI categorization accuracy

### 3. Deduplication
The system automatically detects duplicates based on:
- `import_source` + `external_id`
- Prevents re-importing same ASIN or listing ID

### 4. Batch Review
- Use filters to review similar products together
- Bulk approve high-confidence items (>80%)
- Manually review low-confidence items (<60%)

### 5. Vendor Management
- System auto-creates vendors from scraped data
- Review vendor info in product editor
- Consolidate duplicate vendors manually

## Troubleshooting

### Scraper Issues

**Problem:** Scraper returns no results
```bash
# Check API key in scraper_configs table
# Check source is enabled
# Verify API quota not exceeded
```

**Problem:** Scraper fails with auth error
```bash
# Verify API key is correct
# Check if API requires additional setup
# Review Scrapingdog/Rainforest dashboard
```

### Import Issues

**Problem:** AI categorization fails
```bash
# Check ANTHROPIC_API_KEY is set
# Verify API quota
# Products will use fallback category "decor"
```

**Problem:** Duplicate products detected
```bash
# Expected behavior - prevents duplicates
# Check import logs for details
# Delete old products if needed
```

### Admin UI Issues

**Problem:** Products not appearing
```bash
# Check review_status filter
# Verify products imported to scraped_products table
# Check RLS policies for admin role
```

**Problem:** Approve fails
```bash
# Check vendor creation
# Verify all required fields present
# Review browser console for errors
```

## Security

### API Keys
- **Never** commit API keys to git
- Store in `.env.local` (already in `.gitignore`)
- Use Supabase vault or environment variables in production

### Row Level Security
All inventory tables have RLS policies:
- Only admins can access
- Based on `profiles.role = 'admin'`

### Service Role Key
- Used server-side only for admin operations
- Never exposed to client

## Future Enhancements

- [ ] Image upload to Supabase Storage
- [ ] Automated scraping schedules (cron)
- [ ] Price monitoring and updates
- [ ] Multi-vendor deduplication
- [ ] Advanced filtering and sorting
- [ ] CSV export for bulk editing
- [ ] Analytics dashboard
- [ ] Webhook notifications

## Support

For issues or questions:
1. Check this documentation
2. Review error logs in import batches
3. Check Supabase dashboard for data
4. Test with small batches first

---

**System Status:** Production Ready
**Version:** 1.0
**Last Updated:** November 4, 2025
