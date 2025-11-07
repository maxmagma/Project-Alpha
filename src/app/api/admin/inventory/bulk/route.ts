import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

/**
 * Bulk operations on scraped products
 * Actions: approve, reject, delete
 */
export async function POST(request: Request) {
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

  const { ids, action } = await request.json()

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'No IDs provided' }, { status: 400 })
  }

  if (!['approve', 'reject', 'delete'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[],
  }

  if (action === 'approve') {
    // Bulk approve by calling approve endpoint for each
    for (const id of ids) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/inventory/${id}/approve`,
          {
            method: 'POST',
            headers: {
              cookie: request.headers.get('cookie') || '',
            },
          }
        )

        if (response.ok) {
          results.success++
        } else {
          results.failed++
          results.errors.push(`Failed to approve ${id}`)
        }
      } catch (error: any) {
        results.failed++
        results.errors.push(`Error approving ${id}: ${error.message}`)
      }
    }
  } else if (action === 'reject') {
    const { error } = await supabase
      .from('scraped_products')
      .update({
        review_status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .in('id', ids)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    results.success = ids.length
  } else if (action === 'delete') {
    const { error } = await supabase
      .from('scraped_products')
      .delete()
      .in('id', ids)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    results.success = ids.length
  }

  revalidatePath('/admin/inventory')
  revalidatePath('/marketplace')

  return NextResponse.json({
    success: true,
    results,
  })
}
