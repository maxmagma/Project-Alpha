-- ============================================================================
-- VISION BOARD TRANSFORMATION
-- Converts from transactional marketplace to affiliate + lead generation model
-- Date: 2025-11-05
-- ============================================================================

-- ============================================================================
-- 1. DROP OLD TABLES (E-commerce model)
-- ============================================================================

-- Drop orders and cart (no longer needed - we don't process payments)
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;

-- ============================================================================
-- 2. UPDATE PRODUCTS TABLE (Add affiliate + rental fields)
-- ============================================================================

-- Add new columns for affiliate/rental model
ALTER TABLE products
  -- Fulfillment type determines user flow
  ADD COLUMN IF NOT EXISTS fulfillment_type TEXT NOT NULL DEFAULT 'rental'
    CHECK (fulfillment_type IN ('purchasable', 'rental', 'service')),

  -- For PURCHASABLE items (affiliate links)
  ADD COLUMN IF NOT EXISTS external_url TEXT,
  ADD COLUMN IF NOT EXISTS affiliate_url TEXT,
  ADD COLUMN IF NOT EXISTS affiliate_network TEXT,
  ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,2),

  -- For RENTAL items (lead generation)
  ADD COLUMN IF NOT EXISTS requires_quote BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS lead_fee DECIMAL(10,2) DEFAULT 15.00,

  -- Metrics
  ADD COLUMN IF NOT EXISTS affiliate_clicks INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inquiry_clicks INTEGER DEFAULT 0;

-- Add index for fulfillment type filtering
CREATE INDEX IF NOT EXISTS idx_products_fulfillment_type ON products(fulfillment_type);

-- ============================================================================
-- 3. CREATE VISION BOARD TABLES
-- ============================================================================

-- Vision Board Items (replaces cart_items)
CREATE TABLE IF NOT EXISTS vision_board_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT, -- For guest users
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  notes TEXT, -- User notes for this item
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure uniqueness per user/session
  UNIQUE(user_id, product_id),
  UNIQUE(session_id, product_id)
);

-- Vision Boards (saved collections)
CREATE TABLE IF NOT EXISTS vision_boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT,

  name TEXT DEFAULT 'My Wedding Vision',
  description TEXT,

  -- If they generated AI visualization
  visualization_id UUID REFERENCES visualizations(id) ON DELETE SET NULL,

  -- Sharing
  is_public BOOLEAN DEFAULT FALSE,
  share_token TEXT UNIQUE,

  -- Status
  converted_to_inquiry BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for vision board
CREATE INDEX IF NOT EXISTS idx_vision_board_items_user ON vision_board_items(user_id);
CREATE INDEX IF NOT EXISTS idx_vision_board_items_session ON vision_board_items(session_id);
CREATE INDEX IF NOT EXISTS idx_vision_board_items_product ON vision_board_items(product_id);
CREATE INDEX IF NOT EXISTS idx_vision_boards_user ON vision_boards(user_id);
CREATE INDEX IF NOT EXISTS idx_vision_boards_session ON vision_boards(session_id);

-- ============================================================================
-- 4. AFFILIATE CLICK TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT,

  -- Tracking
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted BOOLEAN DEFAULT FALSE, -- Did they purchase? (needs external integration)
  conversion_value DECIMAL(10,2), -- If we can track it
  commission_earned DECIMAL(10,2),

  -- Attribution
  referrer TEXT,
  user_agent TEXT,
  ip_address INET
);

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_product ON affiliate_clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_user ON affiliate_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_date ON affiliate_clicks(clicked_at);

-- ============================================================================
-- 5. UPDATE INQUIRIES TABLE
-- ============================================================================

-- Drop old columns if they exist
ALTER TABLE inquiries
  DROP COLUMN IF EXISTS message,
  DROP COLUMN IF EXISTS preferred_contact_method;

-- Add new columns for split product types
ALTER TABLE inquiries
  ADD COLUMN IF NOT EXISTS rental_products JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS purchasable_products JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS total_estimated_rental_value DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS vendor_ids UUID[],
  ADD COLUMN IF NOT EXISTS vendor_responses JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS quality_score INTEGER,
  ADD COLUMN IF NOT EXISTS total_lead_fees DECIMAL(10,2);

-- Update status check constraint
ALTER TABLE inquiries DROP CONSTRAINT IF EXISTS inquiries_status_check;
ALTER TABLE inquiries
  ADD CONSTRAINT inquiries_status_check
  CHECK (status IN ('pending', 'quoted', 'booked', 'lost'));

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_vendors ON inquiries USING GIN(vendor_ids);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);

-- ============================================================================
-- 6. VENDOR LEAD CREDITS (Prepay model)
-- ============================================================================

CREATE TABLE IF NOT EXISTS vendor_lead_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,

  credits_remaining INTEGER DEFAULT 0,
  credits_purchased INTEGER DEFAULT 0,
  credits_used INTEGER DEFAULT 0,

  -- Pricing tier
  price_per_lead DECIMAL(10,2) DEFAULT 15.00,

  last_purchase_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(vendor_id)
);

-- Index for vendor lookups
CREATE INDEX IF NOT EXISTS idx_vendor_lead_credits_vendor ON vendor_lead_credits(vendor_id);

-- ============================================================================
-- 7. UPDATE VENDORS TABLE
-- ============================================================================

-- Add lead fee to vendors (default fee per lead)
ALTER TABLE vendors
  ADD COLUMN IF NOT EXISTS lead_fee DECIMAL(10,2) DEFAULT 15.00,
  ADD COLUMN IF NOT EXISTS accepts_leads BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS auto_respond BOOLEAN DEFAULT FALSE;

-- ============================================================================
-- 8. RLS POLICIES FOR NEW TABLES
-- ============================================================================

-- Vision Board Items Policies
ALTER TABLE vision_board_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own vision board items"
  ON vision_board_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vision board items"
  ON vision_board_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vision board items"
  ON vision_board_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vision board items"
  ON vision_board_items FOR DELETE
  USING (auth.uid() = user_id);

-- Vision Boards Policies
ALTER TABLE vision_boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own vision boards"
  ON vision_boards FOR SELECT
  USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can insert their own vision boards"
  ON vision_boards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vision boards"
  ON vision_boards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vision boards"
  ON vision_boards FOR DELETE
  USING (auth.uid() = user_id);

-- Affiliate Clicks (Admin only - for analytics)
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all affiliate clicks"
  ON affiliate_clicks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Vendor Lead Credits (Vendors can view their own)
ALTER TABLE vendor_lead_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view their own credits"
  ON vendor_lead_credits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 9. HELPER FUNCTIONS
-- ============================================================================

-- Function to increment affiliate clicks counter
CREATE OR REPLACE FUNCTION increment_affiliate_clicks(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products
  SET affiliate_clicks = affiliate_clicks + 1
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment inquiry clicks counter
CREATE OR REPLACE FUNCTION increment_inquiry_clicks(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products
  SET inquiry_clicks = inquiry_clicks + 1
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deduct vendor lead credit
CREATE OR REPLACE FUNCTION deduct_vendor_credit(vendor_id UUID, amount INTEGER DEFAULT 1)
RETURNS void AS $$
BEGIN
  UPDATE vendor_lead_credits
  SET
    credits_remaining = credits_remaining - amount,
    credits_used = credits_used + amount,
    updated_at = NOW()
  WHERE vendor_lead_credits.vendor_id = deduct_vendor_credit.vendor_id;

  -- Create record if doesn't exist
  INSERT INTO vendor_lead_credits (vendor_id, credits_remaining, credits_used)
  VALUES (deduct_vendor_credit.vendor_id, -amount, amount)
  ON CONFLICT (vendor_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate inquiry quality score
CREATE OR REPLACE FUNCTION calculate_quality_score(inquiry_data JSONB)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 50; -- Base score
BEGIN
  IF inquiry_data->>'event_date' IS NOT NULL THEN score := score + 15; END IF;
  IF inquiry_data->>'venue_name' IS NOT NULL THEN score := score + 10; END IF;
  IF inquiry_data->>'venue_location' IS NOT NULL THEN score := score + 10; END IF;
  IF inquiry_data->>'guest_count' IS NOT NULL THEN score := score + 10; END IF;
  IF inquiry_data->>'phone' IS NOT NULL THEN score := score + 5; END IF;

  RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- 10. UPDATE EXISTING DATA (if any)
-- ============================================================================

-- Set default fulfillment_type for existing products
-- Assume existing products are rentals unless they have external URLs
UPDATE products
SET fulfillment_type = CASE
  WHEN external_url IS NOT NULL THEN 'purchasable'
  ELSE 'rental'
END
WHERE fulfillment_type IS NULL;

-- Initialize vendor lead credits for existing vendors
INSERT INTO vendor_lead_credits (vendor_id, credits_remaining)
SELECT id, 10 FROM vendors
ON CONFLICT (vendor_id) DO NOTHING;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Add comment to track migration
COMMENT ON TABLE vision_board_items IS 'Replaces cart_items - users save products to vision board instead of cart';
COMMENT ON TABLE affiliate_clicks IS 'Tracks affiliate link clicks for purchasable products';
COMMENT ON TABLE vendor_lead_credits IS 'Prepaid lead credits for rental vendors';
