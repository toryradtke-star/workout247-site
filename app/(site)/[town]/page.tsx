import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LocationPage } from '@/components/location-page'
import { SITE_URL } from '@/lib/site'
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: gymJsonLd(data.location) }}
      />
      <LocationPage {...data} />
    </>
  )
}

/**
 * Tells search engines this page is a gym open around the clock, with the
 * address and map pin the owner set in Sanity. `cityStateZip` reads like
 * "Osakis, MN 56360".
 */
function gymJsonLd(location: NonNullable<LocationPageData['location']>) {
  const [, city, region, postalCode] =
    location.cityStateZip.match(/^(.+?),\s*([A-Z]{2})\s+(\d{5})/) ?? []

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ExerciseGym',
    name: `Workout 24/7 ${location.name}`,
    url: `${SITE_URL}/${location.slug}`,
    telephone: location.phoneTel,
    hasMap: location.mapUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.streetAddress,
      addressLocality: city ?? location.name,
      addressRegion: region ?? 'MN',
      postalCode,
      addressCountry: 'US',
    },
    ...(location.geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: location.geo.lat,
        longitude: location.geo.lng,
      },
    }),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
  }).replace(/</g, '\\u003c')
}
