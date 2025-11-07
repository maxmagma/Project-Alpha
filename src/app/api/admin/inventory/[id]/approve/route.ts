import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

/**
 * Approve scraped product and publish to marketplace
 * Moves product from scraped_products to products table
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()

  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }

  // Check admin
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params

  // Get scraped product
  const { data: scrapedProduct, error: fetchError } = await supabase
    .from('scraped_products')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !scrapedProduct) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  // Get or create vendor
  let vendorId = null

  // Check if vendor exists
  const { data: existingVendor } = await supabase
    .from('vendors')
    .select('id')
    .eq('company_name', scrapedProduct.vendor_name)
    .single()

  if (existingVendor) {
    vendorId = existingVendor.id
  } else {
    // Create vendor
    const { data: newVendor, error: vendorError } = await supabase
      .from('vendors')
      .insert({
        company_name: scrapedProduct.vendor_name,
        slug: slugify(scrapedProduct.vendor_name),
        description: `${scrapedProduct.vendor_name} - Wedding products`,
        website: scrapedProduct.vendor_url || '',
        status: 'approved',
      })
      .select()
      .single()

    if (vendorError) {
      return NextResponse.json(
        { error: 'Failed to create vendor' },
        { status: 400 }
      )
    }

    vendorId = newVendor.id
  }

  // Create product in products table
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      vendor_id: vendorId,
      name: scrapedProduct.name,
      slug: generateSlug(scrapedProduct.name),
      description: scrapedProduct.description,
      category: scrapedProduct.suggested_category,
      subcategory: scrapedProduct.suggested_subcategory,
      base_price: scrapedProduct.base_price,
      currency: scrapedProduct.currency,
      fulfillment_type: scrapedProduct.suggested_fulfillment_type,
      images: scrapedProduct.images,
      primary_image: scrapedProduct.primary_image,
      style_tags: scrapedProduct.suggested_style_tags,
      color_palette: scrapedProduct.suggested_color_palette,
      status: 'approved',
      is_active: true,
      import_source: scrapedProduct.import_source,
      import_batch_id: scrapedProduct.import_batch_id,
      external_id: scrapedProduct.external_id,
      affiliate_network: scrapedProduct.affiliate_network,
      affiliate_url: scrapedProduct.affiliate_url,
      scraped_product_id: scrapedProduct.id,
    })
    .select()
    .single()

  if (productError) {
    return NextResponse.json(
      { error: 'Failed to create product', details: productError.message },
      { status: 400 }
    )
  }

  // Update scraped product status
  await supabase
    .from('scraped_products')
    .update({
      review_status: 'approved',
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq('id', id)

  // Revalidate pages
  revalidatePath('/admin/inventory')
  revalidatePath('/marketplace')
  revalidatePath(`/marketplace/${product.id}`)

  return NextResponse.json({
    success: true,
    productId: product.id,
  })
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function generateSlug(name: string): string {
  const slug = slugify(name)
  const timestamp = Date.now().toString().slice(-6)
  return `${slug}-${timestamp}`
}
