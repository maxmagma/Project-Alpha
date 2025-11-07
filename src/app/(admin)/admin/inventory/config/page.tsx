import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ScraperConfigForm } from '@/components/admin/inventory/scraper-config-form'

export default async function ScraperConfigPage() {
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

  // Get scraper configs
  const { data: configs } = await supabase
    .from('scraper_configs')
    .select('*')
    .order('source')

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Scraper Configuration</h1>
            <p className="text-muted-foreground">
              Manage API keys and settings for product scrapers
            </p>
          </div>
          <Button variant="outline" asChild className="border-2 border-black">
            <Link href="/admin/inventory">Back to Inventory</Link>
          </Button>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-white border-2 border-black p-6 mb-6">
        <h3 className="font-bold mb-2 uppercase tracking-wider text-red-600">
          ⚠️ Security Warning
        </h3>
        <p className="text-sm text-muted-foreground">
          API keys are stored in the database. In production, use environment
          variables or a secure secrets manager. Never commit API keys to version
          control.
        </p>
      </div>

      {/* Configs */}
      <div className="space-y-6">
        {configs?.map((config) => (
          <ScraperConfigForm key={config.id} config={config} />
        ))}
      </div>

      {/* Setup Instructions */}
      <div className="mt-8 bg-secondary border-2 border-black p-6">
        <h3 className="font-bold mb-4 uppercase tracking-wider text-xl">
          Setup Instructions
        </h3>

        <div className="space-y-6">
          {/* Amazon */}
          <div>
            <h4 className="font-bold mb-2">Amazon (via Rainforest API or Scrapingdog)</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>
                Sign up for{' '}
                <a
                  href="https://www.rainforestapi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold hover:underline"
                >
                  Rainforest API
                </a>{' '}
                or{' '}
                <a
                  href="https://www.scrapingdog.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold hover:underline"
                >
                  Scrapingdog
                </a>
              </li>
              <li>Get your API key from the dashboard</li>
              <li>
                Sign up for{' '}
                <a
                  href="https://affiliate-program.amazon.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold hover:underline"
                >
                  Amazon Associates
                </a>
              </li>
              <li>Get your Associate Tag (e.g., yoursite-20)</li>
              <li>Enter both in the form above</li>
            </ol>
          </div>

          {/* Etsy */}
          <div>
            <h4 className="font-bold mb-2">Etsy (Official API)</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>
                Create an app at{' '}
                <a
                  href="https://www.etsy.com/developers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold hover:underline"
                >
                  Etsy Developers
                </a>
              </li>
              <li>Get your API Key (keystring)</li>
              <li>
                Join{' '}
                <a
                  href="https://www.awin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold hover:underline"
                >
                  Awin
                </a>{' '}
                affiliate network
              </li>
              <li>Apply for Etsy program (Merchant ID: 6983)</li>
              <li>Get your Awin Affiliate ID</li>
              <li>Enter both in the form above</li>
            </ol>
          </div>

          {/* Manual Import */}
          <div>
            <h4 className="font-bold mb-2">Manual Import (CSV/JSON)</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>
                Generate template:{' '}
                <code className="bg-white px-2 py-1 border border-black">
                  pnpm scrape:template
                </code>
              </li>
              <li>Fill in product data in CSV or JSON format</li>
              <li>
                Import:{' '}
                <code className="bg-white px-2 py-1 border border-black">
                  pnpm import data/yourfile.csv
                </code>
              </li>
            </ol>
          </div>
        </div>

        {/* CLI Commands */}
        <div className="mt-6 pt-6 border-t-2 border-black">
          <h4 className="font-bold mb-3 uppercase tracking-wider">
            CLI Commands
          </h4>
          <div className="space-y-2 text-sm font-mono">
            <div className="bg-white border-2 border-black p-3">
              <p className="text-xs text-muted-foreground mb-1">Scrape Amazon</p>
              <code>pnpm scrape:amazon "wedding centerpieces"</code>
            </div>
            <div className="bg-white border-2 border-black p-3">
              <p className="text-xs text-muted-foreground mb-1">Scrape Etsy</p>
              <code>pnpm scrape:etsy "rustic wedding decor"</code>
            </div>
            <div className="bg-white border-2 border-black p-3">
              <p className="text-xs text-muted-foreground mb-1">Scrape All</p>
              <code>pnpm scrape:all</code>
            </div>
            <div className="bg-white border-2 border-black p-3">
              <p className="text-xs text-muted-foreground mb-1">Import Results</p>
              <code>pnpm import data/amazon-1234567890.json</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
