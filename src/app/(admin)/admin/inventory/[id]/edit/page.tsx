import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ProductEditor } from '@/components/admin/inventory/product-editor'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditInventoryProductPage({ params }: PageProps) {
  const supabase = await createClient()

  if (!supabase) {
    redirect('/')
  }

  // Check admin access
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  // Get product
  const { id } = await params
  const { data: product } = await supabase
    .from('scraped_products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Edit Product</h1>
          <p className="text-muted-foreground">
            Review and edit product details before approval
          </p>
        </div>

        <ProductEditor product={product} />
      </div>
    </div>
  )
}
