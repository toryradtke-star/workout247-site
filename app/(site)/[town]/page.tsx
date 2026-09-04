import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LocationPage } from '@/components/location-page'
import type { LocationPageData } from '@/lib/types'
import { sanityFetch } from '@/sanity/lib/fetch'
import { LOCATION_QUERY, LOCATION_SLUGS_QUERY } from '@/sanity/lib/queries'

type Props = { params: Promise<{ town: string }> }

/**
 * /wells and /osakis. One template, two datasets. Only the slugs Sanity
 * knows about are built; anything else 404s rather than rendering empty.
 */
export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({
    query: LOCATION_SLUGS_QUERY,
    revalidate: 3600,
  })
  return slugs.map((town) => ({ town }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { town } = await params
  const { location } = await sanityFetch<LocationPageData>({
    query: LOCATION_QUERY,
    params: { slug: town },
    tags: ['location', `location:${town}`, 'membershipPlan'],
  })
  if (!location) return {}

  return {
    title: location.metaTitle ?? `${location.name} | Workout 24/7`,
    description: location.metaDescription,
    alternates: { canonical: `/${location.slug}` },
  }
}

export default async function TownPage({ params }: Props) {
  const { town } = await params
  const data = await sanityFetch<LocationPageData>({
    query: LOCATION_QUERY,
    params: { slug: town },
    tags: [
      'location',
      `location:${town}`,
      'membershipPlan',
      'faqEntry',
      'siteSettings',
    ],
  })

  if (!data.location) notFound()

  return <LocationPage {...data} />
}
