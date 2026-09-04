import type { QueryParams } from 'next-sanity'
import { client } from './client'

/**
 * Tagged fetch for ISR. Published edits reach the site via the Sanity
 * webhook hitting /api/revalidate, which purges the matching tags.
 * The hour-long revalidate is only a backstop for a missed webhook.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  revalidate = 3600,
}: {
  query: string
  params?: QueryParams
  tags?: string[]
  revalidate?: number | false
}): Promise<T> {
  // In development, always refetch. Tagged entries are invalidated only
  // on demand, so without this a content edit would never appear locally
  // until the dev server restarted.
  if (process.env.NODE_ENV === 'development') {
    return client.fetch<T>(query, params, { next: { revalidate: 0 } })
  }

  return client.fetch<T>(query, params, {
    next: {
      // Tags and time-based revalidation are mutually exclusive in Next:
      // when tags are present, invalidation is on-demand only.
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  })
}
