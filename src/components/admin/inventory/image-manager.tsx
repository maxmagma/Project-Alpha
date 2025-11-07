'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X, MoveUp, MoveDown, Upload } from 'lucide-react'

interface ImageManagerProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export function ImageManager({
  images,
  onImagesChange,
  maxImages = 10,
}: ImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false)

  function removeImage(index: number) {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  function moveImage(index: number, direction: 'up' | 'down') {
    const newImages = [...images]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= images.length) return

    ;[newImages[index], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[index],
    ]

    onImagesChange(newImages)
  }

  function handleAddUrl() {
    const url = prompt('Enter image URL:')
    if (!url) return

    if (!url.startsWith('http')) {
      alert('Please enter a valid URL starting with http:// or https://')
      return
    }

    if (images.includes(url)) {
      alert('This image is already added')
      return
    }

    onImagesChange([...images, url])
  }

  return (
    <div className="space-y-4">
      {/* Add Image Button */}
      {images.length < maxImages && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddUrl}
            className="border-2 border-black"
          >
            <Upload className="w-4 h-4 mr-2" />
            Add Image URL
          </Button>
          <p className="text-sm text-muted-foreground self-center">
            {images.length}/{maxImages} images
          </p>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {images.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square border-2 border-black bg-secondary group"
            >
              <Image
                src={url}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs font-bold uppercase tracking-wider">
                  Primary
                </div>
              )}

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index > 0 && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => moveImage(index, 'up')}
                    className="bg-white text-black border-2 border-white"
                  >
                    <MoveUp className="w-4 h-4" />
                  </Button>
                )}

                {index < images.length - 1 && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => moveImage(index, 'down')}
                    className="bg-white text-black border-2 border-white"
                  >
                    <MoveDown className="w-4 h-4" />
                  </Button>
                )}

                <Button
                  type="button"
                  size="sm"
                  onClick={() => removeImage(index)}
                  className="bg-white text-black border-2 border-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-black p-12 text-center">
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No images added</p>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddUrl}
            className="border-2 border-black"
          >
            Add Image URL
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Add image URLs from the scraped product. First image will be the primary image.
      </p>
    </div>
  )
}
