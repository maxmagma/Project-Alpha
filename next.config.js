/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
      // Vendor CDN domains for testing with real product images
      {
        protocol: 'https',
        hostname: 'eventlyst.com',
      },
      {
        protocol: 'https',
        hostname: 'settowedla.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: '**.myshopify.com',
      },
      {
        protocol: 'https',
        hostname: 'rentpearl.com',
      },
      {
        protocol: 'https',
        hostname: 'kadeemarentals.com',
      },
      {
        protocol: 'https',
        hostname: 'kadeema.myshopify.com',
      },
      {
        protocol: 'https',
        hostname: 'cortpartyrental.com',
      },
      {
        protocol: 'https',
        hostname: 'questevents.com',
      },
      {
        protocol: 'https',
        hostname: 'vogue.rentals',
      },
      {
        protocol: 'https',
        hostname: 'fairytaleeventrentals.com',
      },
      {
        protocol: 'https',
        hostname: 'www.ultimatepartytents.com',
      },
      {
        protocol: 'https',
        hostname: 'ultimatepartytents.com',
      },
      {
        protocol: 'https',
        hostname: 'eventworksrentals.com',
      },
      {
        protocol: 'https',
        hostname: 'www.etsy.com',
      },
      {
        protocol: 'https',
        hostname: 'i.etsystatic.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Caching optimizations
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
