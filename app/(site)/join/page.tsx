import type { Metadata } from 'next'
import Link from 'next/link'
import { money } from '@/lib/format'
import type { SiteData } from '@/lib/types'
import { sanityFetch } from '@/sanity/lib/fetch'
import { SITE_QUERY } from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Join | Workout 24/7',
  description:
    'Get a 24-hour keycard membership at Workout 24/7 in Wells or Osakis, Minnesota. Pick your town to see rates, or call to sign up.',
  alternates: { canonical: '/join' },
}

/**
 * Every "Join online" button lands here. Signup links live on each plan
 * term in the town's data and show on the town's rate table once filled in,
 * so this page routes people there rather than duplicating it.
 */
export default async function JoinPage() {
  const { locations } = await sanityFetch<SiteData>({
    query: SITE_QUERY,
    tags: ['location', 'membershipPlan', 'siteSettings'],
  })

  return (
    <main className="font-sans text-ink">
      <section className="on-dark bg-ink text-white">
        <div className="mx-auto flex max-w-site flex-col gap-5 px-section-x py-[clamp(32px,6vw,68px)]">
          <h1 className="text-[clamp(36px,8vw,64px)] leading-[0.92] tracking-[-0.035em]">
            Become a member<span className="text-orange">.</span>
          </h1>
          <p className="max-w-[48ch] text-lede leading-[1.5] text-ondark-100">
            Pick the gym you&apos;ll use most to see every rate and fee, or
            call and we&apos;ll get you a key.
          </p>
        </div>
      </section>

      <section className="mx-auto flex max-w-site flex-col gap-[26px] px-section-x py-[clamp(36px,6vw,76px)]">
        <div className="grid max-w-[860px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3">
          {locations.map((loc) => (
            <Link
              key={loc.slug}
              href={`/${loc.slug}#rates`}
              className="flex flex-col gap-[14px] border-[3px] border-ink p-[22px] text-ink no-underline hover:bg-offwhite"
            >
              <div className="font-display text-[clamp(26px,4vw,34px)] leading-none tracking-[-0.03em]">
                {loc.name}
              </div>
              <div className="font-mono text-[13px] leading-[1.7] text-body-mid">
                {loc.streetAddress}
                <br />
                {loc.cityStateZip}
              </div>
              <div className="mt-auto flex items-baseline gap-2">
                <span className="font-display text-[clamp(36px,6vw,48px)] leading-[0.9] tracking-[-0.04em] text-orange-dark">
                  {money(loc.singlePrice)}
                </span>
                <span className="text-[14px] font-semibold text-muted">
                  /mo single
                </span>
              </div>
              <div className="bg-orange px-4 py-[13px] text-center text-[15px] font-extrabold text-ink">
                {loc.name} rates
              </div>
            </Link>
          ))}
        </div>

        <div className="font-mono text-[14px] leading-[1.7] text-body-soft">
          Sign up by phone:{' '}
          {locations.map((loc, i) => (
            <span key={loc.slug}>
              {i > 0 && ' · '}
              <a
                href={`tel:${loc.phoneTel}`}
                className="whitespace-nowrap text-orange-dark no-underline hover:underline"
              >
                {loc.name} {loc.phoneDisplay}
              </a>
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}
