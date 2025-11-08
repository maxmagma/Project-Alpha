import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils/format'
import { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row']

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/marketplace/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square bg-secondary relative">
          {product.primary_image ? (
            <Image
              src={product.primary_image}
              alt={product.name}
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No image
            </div>
          )}
          {product.featured && (
            <Badge className="absolute top-2 right-2">Featured</Badge>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold mb-2 line-clamp-1">{product.name}</h3>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">{formatPrice(Number(product.base_price))}</p>
            <p className="text-xs text-muted-foreground">
              {product.price_type === 'rental' ? 'Rental' : 'Purchase'}
            </p>
          </div>
          {product.style_tags.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {product.style_tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
