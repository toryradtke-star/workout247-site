import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { sanityFetch } from '@/sanity/lib/fetch'
import { SITE_QUERY } from '@/sanity/lib/queries'
import type { SiteData } from '@/lib/types'

/**
 * Wraps the six public routes. The Studio at /studio sits outside this
 * group so it never inherits the site chrome.
 *
 * Both towns are fetched once here because the header and footer need them
 * on every route. Tagged so publishing an edit purges it without a deploy.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { locations, settings } = await sanityFetch<SiteData>({
    query: SITE_QUERY,
    tags: ['location', 'membershipPlan', 'siteSettings'],
  })

  return (
    <>
      <SiteHeader locations={locations} />
      {children}
      <SiteFooter locations={locations} settings={settings} />
    </>
  )
}
