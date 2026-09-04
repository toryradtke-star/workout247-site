import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AccentPeriod } from '@/components/accent-period'
import { ContactForm } from '@/components/contact-form'
import { PortableBody } from '@/components/portable-body'
import type { PageDoc } from '@/lib/types'
import { sanityFetch } from '@/sanity/lib/fetch'
import { CONTACT_QUERY } from '@/sanity/lib/queries'

type ContactData = {
  page: PageDoc | null
  locations: {
    name: string
    slug: string
    streetAddress: string
    cityStateZip: string
    phoneDisplay: string
    phoneTel: string
    mapUrl: string
  }[]
}

const TAGS = ['page', 'page:contact', 'location']

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await sanityFetch<ContactData>({
    query: CONTACT_QUERY,
    tags: TAGS,
  })
  return {
    title: page?.metaTitle ?? 'Contact | Workout 24/7',
    description: page?.metaDescription,
    alternates: { canonical: '/contact' },
  }
}

export default async function ContactPage() {
  const { page, locations } = await sanityFetch<ContactData>({
    query: CONTACT_QUERY,
    tags: TAGS,
  })
  if (!page) notFound()

  return (
    <main className="font-sans text-ink">
      <section className="on-dark bg-ink text-white">
        <div className="mx-auto flex max-w-site flex-col gap-[18px] px-section-x py-[clamp(30px,5vw,60px)]">
          <h1 className="text-[clamp(36px,8vw,62px)] leading-[0.92] tracking-[-0.035em]">
            <AccentPeriod text={page.heroHeading} />
          </h1>
          {page.heroLede && (
            <p className="max-w-[50ch] text-lede leading-[1.55] text-ondark-100">
              {page.heroLede}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-site px-section-x pt-[clamp(32px,5vw,64px)]">
        <div className="grid max-w-[860px] grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3">
          {locations.map((loc) => (
            <div
              key={loc.slug}
              className="flex flex-col gap-[14px] border-[3px] border-ink p-[22px]"
            >
              <div className="font-display text-[28px] leading-none tracking-[-0.03em]">
                {loc.name}
              </div>
              <div className="font-mono text-[14px] leading-[1.8] text-body">
                {loc.streetAddress}
                <br />
                {loc.cityStateZip}
                <br />
                Open 24 hours, 7 days
              </div>
              <a
                href={`tel:${loc.phoneTel}`}
                className="mt-auto bg-orange px-[18px] py-[15px] text-center text-[16px] font-extrabold text-ink no-underline hover:bg-orange-hover"
              >
                {loc.phoneDisplay}
              </a>
              <a
                href={loc.mapUrl}
                target="_blank"
                rel="noopener"
                className="border-2 border-ink px-4 py-3 text-center text-[15px] font-bold text-ink no-underline hover:bg-offwhite"
              >
                Directions
              </a>
            </div>
          ))}
        </div>
      </section>

      <section
        id="message"
        className="mx-auto max-w-site px-section-x py-section-y"
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-gap-2col">
          <div className="flex flex-col gap-4">
            <h2 className="text-h2 leading-[0.98] tracking-[-0.035em]">
              Send us a message
            </h2>
            <div className="max-w-[44ch] text-[17px] leading-[1.6] text-body">
              <PortableBody value={page.body as never} />
            </div>
            <div className="flex flex-wrap items-center gap-[10px]">
              <Link
                href="/join"
                className="bg-orange px-[22px] py-[15px] text-[16px] font-extrabold text-ink no-underline hover:bg-orange-hover"
              >
                Sign up online
              </Link>
              {locations.map((loc) => (
                <a
                  key={loc.slug}
                  href={`tel:${loc.phoneTel}`}
                  className="border-2 border-ink px-[18px] py-[13px] text-[15px] font-bold text-ink no-underline hover:bg-orange-tint"
                >
                  Call {loc.name}
                </a>
              ))}
            </div>
            <div className="border-l-[3px] border-ink pl-[14px] font-mono text-[13px] leading-[1.7] text-body-soft">
              Membership questions · joining fees
              <br />
              Freezing or ending a term
              <br />
              Military discount · lost key
            </div>
          </div>

          <ContactForm towns={locations.map((l) => l.name)} />
        </div>
      </section>
    </main>
  )
}
