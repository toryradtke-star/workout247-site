import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // No Sanity CDN: Next caches every result by tag, and the CDN can serve a
  // minute-old answer right after a publish, which would then stay cached.
  useCdn: false,
  perspective: 'published',
})
