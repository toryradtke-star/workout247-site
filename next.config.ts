import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Photos are served from Sanity's CDN so the owner's hotspot and crop
    // are applied before next/image resizes them.
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
}

export default nextConfig
