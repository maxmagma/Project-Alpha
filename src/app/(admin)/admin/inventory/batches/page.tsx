import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function ImportBatchesPage() {
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

  // Get batches
  const { data: batches } = await supabase
    .from('import_batches')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Import History</h1>
            <p className="text-muted-foreground">
              View and manage product import batches
            </p>
          </div>
          <Button variant="outline" asChild className="border-2 border-black">
            <Link href="/admin/inventory">Back to Inventory</Link>
          </Button>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white border-2 border-black">
        {batches && batches.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b-2 border-black bg-secondary">
                <tr>
                  <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">
                    Date
                  </th>
                  <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">
                    Source
                  </th>
                  <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">
                    Total
                  </th>
                  <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">
                    Imported
                  </th>
                  <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">
                    Failed
                  </th>
                  <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">
                    Duplicates
                  </th>
                  <th className="p-4 text-right text-sm font-bold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr
                    key={batch.id}
                    className="border-b border-black hover:bg-secondary transition-colors"
                  >
                    {/* Date */}
                    <td className="p-4">
                      <p className="font-semibold">
                        {new Date(batch.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(batch.created_at).toLocaleTimeString()}
                      </p>
                    </td>

                    {/* Source */}
                    <td className="p-4">
                      <SourceBadge source={batch.source} />
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <StatusBadge status={batch.status} />
                    </td>

                    {/* Stats */}
                    <td className="p-4">
                      <p className="font-bold">{batch.total_items}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-green-700">
                        {batch.imported_items}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-red-700">
                        {batch.failed_items}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-yellow-700">
                        {batch.duplicate_items}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-2 border-black"
                      >
                        <Link href={`/admin/inventory?batch=${batch.id}`}>
                          View Products
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-lg font-semibold mb-2">No import batches yet</p>
            <p className="text-muted-foreground mb-6">
              Run the scrape and import scripts to get started
            </p>
            <Button asChild className="border-2">
              <Link href="/admin/inventory/config">Configure Scrapers</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Instructions */}
      {batches && batches.length > 0 && (
        <div className="mt-6 bg-secondary border-2 border-black p-6">
          <h3 className="font-bold mb-2 uppercase tracking-wider">
            How to Import Products
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              Configure API keys in{' '}
              <Link
                href="/admin/inventory/config"
                className="font-bold hover:underline"
              >
                Scraper Configuration
              </Link>
            </li>
            <li>
              Run scraping: <code className="bg-white px-2 py-1 border border-black">pnpm scrape amazon</code>
            </li>
            <li>
              Import results: <code className="bg-white px-2 py-1 border border-black">pnpm import data/amazon-*.json</code>
            </li>
            <li>
              Review products in{' '}
              <Link
                href="/admin/inventory"
                className="font-bold hover:underline"
              >
                Inventory
              </Link>
            </li>
          </ol>
        </div>
      )}
    </div>
  )
}

function SourceBadge({ source }: { source: string }) {
  const colors: Record<string, string> = {
    amazon: 'bg-white text-black border-2 border-black',
    etsy: 'bg-secondary text-black border-2 border-black',
    rental: 'bg-white text-black border-2 border-black',
    manual: 'bg-secondary text-black border-2 border-black',
  }

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-bold uppercase tracking-wider ${
        colors[source] || 'bg-white border-2 border-black'
      }`}
    >
      {source}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    processing: 'bg-white text-black border-2 border-black',
    completed: 'bg-black text-white border-2 border-black',
    failed: 'bg-white text-black border-2 border-black',
  }

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider ${
        styles[status] || 'bg-white border-2 border-black'
      }`}
    >
      {status}
    </span>
  )
}
