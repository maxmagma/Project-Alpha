import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { productId } = await request.json()

    const { error } = await supabase
      .from('products')
      .update({ status: 'approved', is_active: true })
      .eq('id', productId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error approving product:', error)
    return NextResponse.json(
      { error: 'Failed to approve product' },
      { status: 500 }
    )
  }
}
