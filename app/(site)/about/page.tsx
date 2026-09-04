import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AccentPeriod } from '@/components/accent-period'
import { PortableBody } from '@/components/portable-body'
import { SanityImage } from '@/components/sanity-image'
import type { PageDoc, SanityImageValue } from '@/lib/types'
import { sanityFetch } from '@/sanity/lib/fetch'
import { ABOUT_QUERY } from '@/sanity/lib/queries'

type AboutData = {
  page: PageDoc | null
  locations: {
    name: string
    slug: string
    aboutBlurb?: string
    floorPhotoPrimary: SanityImageValue
    floorPhotoSecondary: SanityImageValue
  }[]
}

const TAGS = ['page', 'page:about', 'location']

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await sanityFetch<AboutData>({ query: ABOUT_QUERY, tags: TAGS })
  return {
    title: page?.metaTitle ?? 'About | Workout 24/7',
    description: page?.metaDescription,
    alternates: { canonical: '/about' },
  }
}

export default async function AboutPage() {
  const { page, locations } = await sanityFetch<AboutData>({
    query: ABOUT_QUERY,
    tags: TAGS,
  })
  if (!page) notFound()

  // One photo from each town, so About shows both gyms.
  const [first, second] = locations

  return (
    <main className="font-sans text-ink">
      <section className="on-dark bg-ink text-white">
        <div className="mx-auto flex max-w-site flex-col gap-5 px-section-x py-[clamp(32px,6vw,68px)]">
          <h1 className="max-w-[22ch] text-[clamp(36px,8vw,64px)] leading-[0.92] tracking-[-0.035em]">
            <AccentPeriod text={page.heroHeading} />
          </h1>
          {page.heroLede && (
            <p className="max-w-[52ch] text-lede leading-[1.55] text-ondark-100">
              {page.heroLede}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-site grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-[clamp(26px,4vw,56px)] px-section-x py-section-y">
        <div className="flex flex-col gap-5 text-[18px] leading-[1.65] text-ink-mid">
          <PortableBody value={page.body as never} />
        </div>
        <div className="grid gap-2">
          <SanityImage
            value={first?.floorPhotoPrimary}
            width={1000}
            height={750}
            sizes="(min-width: 761px) 50vw, 100vw"
            className="block aspect-[4/3] w-full bg-grey-100 object-cover"
          />
          <SanityImage
            value={second?.floorPhotoSecondary}
            width={1000}
            height={563}
            sizes="(min-width: 761px) 50vw, 100vw"
            className="block aspect-[16/9] w-full bg-grey-100 object-cover"
          />
        </div>
      </section>

      <section className="border-t-[3px] border-ink">
        <div className="mx-auto flex max-w-site flex-col gap-[26px] px-section-x py-[clamp(32px,5vw,60px)]">
          <h2 className="text-[clamp(24px,4.5vw,36px)] leading-none tracking-[-0.03em]">
            Both gyms
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
            {locations.map((loc) => (
              <div key={loc.slug} className="flex flex-col gap-2">
                <div className="font-display text-[24px] tracking-[-0.02em]">
                  {loc.name}
                </div>
                {loc.aboutBlurb && (
                  <p className="text-[16px] leading-[1.55] text-body-soft">
                    {loc.aboutBlurb}
                  </p>
                )}
                <Link
                  href={`/${loc.slug}`}
                  className="text-[15px] font-bold text-orange-dark underline underline-offset-[3px]"
                >
                  {loc.name} prices
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-orange text-ink">
        <div className="mx-auto grid max-w-site grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-center gap-x-10 gap-y-5 px-section-x py-[clamp(28px,4vw,48px)]">
          <div className="font-display text-[clamp(26px,5vw,40px)] leading-[0.98] tracking-[-0.03em]">
            Come look at it before you join.
          </div>
          <div className="flex flex-wrap gap-[10px]">
            <Link
              href="/contact"
              className="bg-ink px-[22px] py-[15px] text-[16px] font-bold text-white no-underline hover:bg-white hover:text-ink"
            >
              Phones and addresses
            </Link>
            <Link
              href="/#towns"
              className="border-2 border-ink px-5 py-[13px] text-[16px] font-bold text-ink no-underline hover:bg-ink hover:text-white"
            >
              Prices by town
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
