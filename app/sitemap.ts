import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { sanityFetch } from '@/sanity/lib/fetch'
import { LOCATION_SLUGS_QUERY, POST_SLUGS_QUERY } from '@/sanity/lib/queries'

// Rendered per request: a prerendered sitemap ignored the Sanity webhook and never listed new posts.
// The Sanity fetch is still tag-cached, so this stays cheap.
export const dynamic = 'force-dynamic'

/**
 * Static routes plus one entry per town and per article, so new content
 * lists itself. /blog is left out until there is something on it.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [towns, posts] = await Promise.all([
    sanityFetch<string[]>({ query: LOCATION_SLUGS_QUERY, tags: ['location'] }),
    sanityFetch<{ slug: string; publishedAt: string }[]>({
      query: POST_SLUGS_QUERY,
      tags: ['post'],
    }),
  ])

  return [
    ...['', '/join', ...towns.map((t) => `/${t}`), '/about', '/contact'].map(
      (path) => ({ url: `${SITE_URL}${path}` }),
    ),
    ...(posts.length ? [{ url: `${SITE_URL}/blog` }] : []),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.publishedAt,
    })),
  ]
}
