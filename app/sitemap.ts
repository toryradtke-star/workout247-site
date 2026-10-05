import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { sanityFetch } from '@/sanity/lib/fetch'
import { LOCATION_SLUGS_QUERY } from '@/sanity/lib/queries'

/** Static routes plus one entry per town, so a new location lists itself. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const towns = await sanityFetch<string[]>({
    query: LOCATION_SLUGS_QUERY,
    tags: ['location'],
  })

  return ['', '/join', ...towns.map((t) => `/${t}`), '/about', '/contact'].map(
    (path) => ({ url: `${SITE_URL}${path}` }),
  )
}
