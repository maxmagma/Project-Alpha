import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateProductPlacement } from '@/lib/services/replicate'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { venueImageUrl, presetId, style } = await request.json()

    if (!venueImageUrl) {
      return NextResponse.json({ error: 'Venue image required' }, { status: 400 })
    }

    // Get products from preset
    let products: any[] = []
    if (presetId) {
      const { data: presetProducts } = await supabase
        .from('style_preset_products')
        .select('product:products(name, category)')
        .eq('preset_id', presetId)

      products = presetProducts?.map(pp => pp.product) || []
    }

    // Generate visualization
    const { output, error } = await generateProductPlacement({
      venueImageUrl,
      products,
      style: style || 'elegant',
    })

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    // Save visualization if user is logged in
    if (user && output) {
      await supabase.from('visualizations').insert({
        user_id: user.id,
        venue_photo_url: venueImageUrl,
        selected_preset_id: presetId || null,
        generated_image_url: output,
      })
    }

    return NextResponse.json({ imageUrl: output })
  } catch (error) {
    console.error('Error generating visualization:', error)
    return NextResponse.json(
      { error: 'Failed to generate visualization' },
      { status: 500 }
    )
  }
}
