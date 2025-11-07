-- =====================================================
-- INVENTORY IMPORT SYSTEM
-- Manual execution required by user
-- =====================================================

-- 1. Import Batches Table
-- Tracks each scraping/import job
CREATE TABLE IF NOT EXISTS import_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Batch metadata
  source TEXT NOT NULL, -- 'amazon', 'etsy', 'rental', 'manual'
  status TEXT NOT NULL DEFAULT 'processing', -- 'processing', 'completed', 'failed'

  -- Stats
  total_items INTEGER NOT NULL DEFAULT 0,
  imported_items INTEGER NOT NULL DEFAULT 0,
  failed_items INTEGER NOT NULL DEFAULT 0,
  duplicate_items INTEGER NOT NULL DEFAULT 0,

  -- Configuration snapshot
  config JSONB, -- Store scraper config used

  -- Error tracking
  errors JSONB, -- Array of error messages

  -- User who initiated
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Notes
  notes TEXT
);

-- 2. Scraped Products Table (Staging Area)
-- Products sit here until admin approves
CREATE TABLE IF NOT EXISTS scraped_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Import tracking
  import_batch_id UUID REFERENCES import_batches(id) ON DELETE CASCADE,
  import_source TEXT NOT NULL, -- 'amazon', 'etsy', 'rental', 'manual'
  external_id TEXT, -- ASIN, Etsy listing ID, etc.
  source_url TEXT NOT NULL,

  -- Product data (from scraper)
  name TEXT NOT NULL,
  description TEXT,
  raw_category TEXT, -- Original category from source
  base_price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',

  -- Images (from scraper)
  images TEXT[] DEFAULT '{}',
  primary_image TEXT,

  -- Vendor info
  vendor_name TEXT NOT NULL,
  vendor_url TEXT,

  -- AI-enriched metadata (populated by import pipeline)
  suggested_category TEXT, -- AI suggestion
  suggested_subcategory TEXT,
  suggested_fulfillment_type TEXT, -- 'purchasable', 'rental', 'service'
  suggested_style_tags TEXT[] DEFAULT '{}',
  suggested_color_palette TEXT[] DEFAULT '{}',
  ai_confidence DECIMAL(3,2), -- 0.0 to 1.0

  -- Affiliate tracking
  affiliate_network TEXT, -- 'amazon', 'awin', 'cj', 'impact', 'direct'
  affiliate_url TEXT,

  -- Admin review status
  review_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'reviewed', 'approved', 'rejected'
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rejection_reason TEXT,

  -- Deduplication
  is_duplicate BOOLEAN DEFAULT FALSE,
  duplicate_of UUID REFERENCES products(id) ON DELETE SET NULL,

  -- Raw data
  raw_data JSONB, -- Store original scraper output

  -- Constraints
  UNIQUE(import_source, external_id)
);

-- 3. Scraper Configurations Table
-- Store API keys, affiliate IDs, scraper settings
CREATE TABLE IF NOT EXISTS scraper_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Scraper type
  source TEXT NOT NULL UNIQUE, -- 'amazon', 'etsy', 'scrapingdog', etc.

  -- Credentials (encrypted in production)
  api_key TEXT,
  api_secret TEXT,
  affiliate_id TEXT,

  -- Settings
  is_enabled BOOLEAN DEFAULT TRUE,
  rate_limit INTEGER DEFAULT 10, -- requests per minute

  -- Configuration
  config JSONB, -- Source-specific settings

  -- Last run
  last_run_at TIMESTAMPTZ,
  last_run_status TEXT,

  -- Notes
  notes TEXT
);

-- 4. Update products table to track import source
ALTER TABLE products
ADD COLUMN IF NOT EXISTS import_source TEXT,
ADD COLUMN IF NOT EXISTS import_batch_id UUID REFERENCES import_batches(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS external_id TEXT,
ADD COLUMN IF NOT EXISTS affiliate_network TEXT,
ADD COLUMN IF NOT EXISTS affiliate_url TEXT,
ADD COLUMN IF NOT EXISTS scraped_product_id UUID REFERENCES scraped_products(id) ON DELETE SET NULL;

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scraped_products_batch ON scraped_products(import_batch_id);
CREATE INDEX IF NOT EXISTS idx_scraped_products_status ON scraped_products(review_status);
CREATE INDEX IF NOT EXISTS idx_scraped_products_source ON scraped_products(import_source);
CREATE INDEX IF NOT EXISTS idx_scraped_products_vendor ON scraped_products(vendor_name);
CREATE INDEX IF NOT EXISTS idx_import_batches_status ON import_batches(status);
CREATE INDEX IF NOT EXISTS idx_import_batches_source ON import_batches(source);
CREATE INDEX IF NOT EXISTS idx_products_import_source ON products(import_source);

-- 6. Add RLS policies for admin access
ALTER TABLE import_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraped_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraper_configs ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admins can manage import batches"
  ON import_batches
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage scraped products"
  ON scraped_products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage scraper configs"
  ON scraper_configs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 7. Add helpful views
CREATE OR REPLACE VIEW import_batch_stats AS
SELECT
  ib.id,
  ib.created_at,
  ib.source,
  ib.status,
  ib.total_items,
  ib.imported_items,
  ib.failed_items,
  ib.duplicate_items,
  COUNT(sp.id) as scraped_products_count,
  COUNT(CASE WHEN sp.review_status = 'pending' THEN 1 END) as pending_count,
  COUNT(CASE WHEN sp.review_status = 'approved' THEN 1 END) as approved_count,
  COUNT(CASE WHEN sp.review_status = 'rejected' THEN 1 END) as rejected_count,
  p.email as created_by_email
FROM import_batches ib
LEFT JOIN scraped_products sp ON sp.import_batch_id = ib.id
LEFT JOIN profiles p ON p.id = ib.created_by
GROUP BY ib.id, p.email;

-- 8. Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_import_batches_updated_at
  BEFORE UPDATE ON import_batches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scraped_products_updated_at
  BEFORE UPDATE ON scraped_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scraper_configs_updated_at
  BEFORE UPDATE ON scraper_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 9. Add sample scraper configs (user should update with real keys)
INSERT INTO scraper_configs (source, config, notes) VALUES
('amazon',
 '{"product_categories": ["Kitchen & Dining", "Home & Kitchen"], "max_results": 100}'::jsonb,
 'Amazon Products API - Add your Associate Tag and API keys'),
('etsy',
 '{"keywords": ["wedding decor", "wedding centerpiece", "wedding table"], "max_results": 100}'::jsonb,
 'Etsy Open API - Add your API key'),
('scrapingdog',
 '{"premium": true, "render_js": false}'::jsonb,
 'Scrapingdog for general web scraping - Add API key'),
('manual',
 '{}'::jsonb,
 'Manual CSV/JSON imports')
ON CONFLICT (source) DO NOTHING;

COMMENT ON TABLE import_batches IS 'Tracks each import job from scrapers';
COMMENT ON TABLE scraped_products IS 'Staging area for scraped products before admin approval';
COMMENT ON TABLE scraper_configs IS 'API keys and configuration for each scraper source';
COMMENT ON COLUMN scraped_products.ai_confidence IS 'AI categorization confidence score (0.0-1.0)';
COMMENT ON COLUMN scraped_products.is_duplicate IS 'Detected as duplicate of existing product';
