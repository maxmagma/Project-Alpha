'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ArrowUpTrayIcon, SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import Image from 'next/image'
import { STYLE_TAGS } from '@/lib/constants'

export default function VisualizerPage() {
  const [venueImage, setVenueImage] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState('Elegant')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setVenueImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!venueImage) {
      toast.error('Please upload a venue image first')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/visualizer/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueImageUrl: venueImage,
          style: selectedStyle,
        }),
      })

      if (!response.ok) throw new Error()

      const { imageUrl } = await response.json()
      setGeneratedImage(imageUrl)
      toast.success('Visualization generated!')
    } catch (error) {
      toast.error('Failed to generate visualization')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">AI Venue Visualizer</h1>
          <p className="text-xl text-muted-foreground">
            Upload your venue photo and see how our products will look
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload & Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Upload Venue Photo</CardTitle>
                <CardDescription>Upload a photo of your wedding venue</CardDescription>
              </CardHeader>
              <CardContent>
                {venueImage ? (
                  <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden mb-4">
                    <Image
                      src={venueImage}
                      alt="Venue"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                    <ArrowUpTrayIcon className="h-12 w-12 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
                {venueImage && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVenueImage(null)}
                  >
                    Change Photo
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Choose Style</CardTitle>
                <CardDescription>Select your wedding style</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {STYLE_TAGS.map((style) => (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(style)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedStyle === style
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background hover:bg-secondary'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleGenerate}
              disabled={!venueImage || isGenerating}
              size="lg"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="mr-2 h-5 w-5" />
                  Generate Visualization
                </>
              )}
            </Button>
          </div>

          {/* Result */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>3. Your Visualization</CardTitle>
                <CardDescription>AI-generated preview of your styled venue</CardDescription>
              </CardHeader>
              <CardContent>
                {generatedImage ? (
                  <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden">
                    <Image
                      src={generatedImage}
                      alt="Generated visualization"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video border-2 border-dashed rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground text-center">
                      Your visualization will appear here
                    </p>
                  </div>
                )}
                {generatedImage && (
                  <div className="mt-4 space-y-2">
                    <Button variant="outline" className="w-full">
                      Download Image
                    </Button>
                    <Button variant="outline" className="w-full">
                      Browse Related Products
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
