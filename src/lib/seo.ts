import { Metadata } from 'next'

interface SEOProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  price?: number
  currency?: string
  availability?: 'in stock' | 'out of stock' | 'preorder'
  noindex?: boolean
}

export function generateSEO({
  title,
  description,
  canonical,
  ogImage = '/og-image.jpg',
  ogType = 'website',
  price,
  currency = 'USD',
  availability,
  noindex = false,
}: SEOProps): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://weddinghub.com'
  const fullTitle = `${title} | WeddingHub`
  const url = canonical ? `${siteUrl}${canonical}` : siteUrl
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`

  const metadata: Metadata = {
    title: fullTitle,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'WeddingHub',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: ogType,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: '@weddinghub',
    },
    robots: noindex ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }

  return metadata
}

export function generateProductSchema(product: {
  name: string
  description: string
  image: string
  price: number
  currency?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  sku?: string
  brand?: string
  category?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku || '',
    brand: {
      '@type': 'Brand',
      name: product.brand || 'WeddingHub',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'USD',
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    },
    ...(product.category && {
      category: product.category,
    }),
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'WeddingHub',
    description: 'Premium wedding product marketplace and venue visualization platform',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://weddinghub.com',
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@weddinghub.com',
    },
    sameAs: [
      'https://twitter.com/weddinghub',
      'https://instagram.com/weddinghub',
      'https://facebook.com/weddinghub',
    ],
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateWebPageSchema(page: {
  name: string
  description: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.name,
    description: page.description,
    url: page.url,
    publisher: generateOrganizationSchema(),
  }
}
