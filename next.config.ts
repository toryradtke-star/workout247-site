import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Photos are served from Sanity's CDN so the owner's hotspot and crop
    // are applied before next/image resizes them.
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  // URLs the old WordPress site had indexed. See PRELAUNCH.md → Redirects.
  // Next strips the trailing slash first, so each source is slash-less.
  async redirects() {
    return [
      ['/about-us', '/about'],
      ['/membership', '/join'],
      ['/osakis-membership', '/osakis'],
      ['/fergus-falls-membership', '/'],
      ['/hello-world', '/'],
      ['/category/uncategorized', '/'],
      ['/author/:slug', '/'],
      ['/feed', '/'],
      ['/wp-sitemap.xml', '/sitemap.xml'],
    ].map(([source, destination]) => ({ source, destination, permanent: true }))
  },
}

export default nextConfig
