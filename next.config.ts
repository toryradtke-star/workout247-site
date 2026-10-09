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
    const oldUrls = [
      ['/about-us', '/about'],
      ['/membership', '/join'],
      ['/osakis-membership', '/osakis'],
      ['/fergus-falls-membership', '/'],
      ['/hello-world', '/'],
      ['/category/uncategorized', '/'],
      ['/author/:slug', '/'],
      ['/feed', '/'],
      ['/wp-sitemap.xml', '/sitemap.xml'],
    ]
    return [
      ...oldUrls.map(([source, destination]) => ({ source, destination, permanent: true })),
      {
        // www served a full duplicate of the site, and Google picked it as the canonical home page.
        source: '/:path*',
        has: [{ type: 'host' as const, value: 'www.workout247fitness.com' }],
        destination: 'https://workout247fitness.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
