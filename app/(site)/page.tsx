import Link from 'next/link'
import { OpenNowBand } from '@/components/open-now-band'
import { SanityImage } from '@/components/sanity-image'
import { money } from '@/lib/format'
import type { HomeData } from '@/lib/types'
import { sanityFetch } from '@/sanity/lib/fetch'
import { HOME_QUERY } from '@/sanity/lib/queries'

export default async function HomePage() {
  const data = await sanityFetch<HomeData>({
    query: HOME_QUERY,
    tags: ['location', 'membershipPlan', 'siteSettings'],
  })
  const { locations, settings, joiningFeeSingle, joiningFeeCouple, photos } = data
  const [wells, osakis] = locations

  return (
    <main className="font-sans text-ink">
      {/* ---------------------------- Hero ---------------------------- */}
      <section className="on-dark bg-ink text-white">
        <div className="mx-auto grid max-w-site grid-cols-[repeat(auto-fit,minmax(330px,1fr))] items-stretch">
          <div className="flex flex-col justify-center gap-6 px-section-x py-[clamp(28px,5vw,60px)]">
            <OpenNowBand town="Wells &amp; Osakis" />
            <h1 className="text-[clamp(38px,8vw,68px)] leading-[0.92] tracking-[-0.035em] text-balance">
              The door is never locked<span className="text-orange">.</span>
            </h1>
            <p className="max-w-[44ch] text-lede leading-[1.5] text-ondark-100">
              You get your own key. Come in at 4 a.m. before a shift or at 11
              p.m. after one — there are no staffed hours to work around. Two
              gyms, two towns, one bill for the whole family if you want it.
            </p>
            <div className="flex flex-wrap gap-[10px]">
              <a
                href="#towns"
                className="bg-orange px-6 py-4 text-[17px] font-extrabold text-ink no-underline hover:bg-orange-hover"
              >
                See prices in your town
              </a>
              <Link
                href="/join"
                className="border-2 border-white px-[22px] py-[14px] text-[17px] font-bold text-white no-underline hover:bg-white hover:text-ink"
              >
                Join online
              </Link>
            </div>
            <div className="font-mono text-[14px] leading-[1.7] text-ondark-400">
              Or call and we&apos;ll sign you up:{' '}
              {locations.map((loc, i) => (
                <span key={loc.slug}>
                  {i > 0 && ' · '}
                  <a
                    href={`tel:${loc.phoneTel}`}
                    className="whitespace-nowrap text-orange no-underline hover:underline"
                  >
                    {loc.name} {loc.phoneDisplay}
                  </a>
                </span>
              ))}
            </div>
          </div>
          <div className="min-h-[320px] bg-ink-900">
            <SanityImage
              value={photos?.heroPhoto}
              width={1200}
              height={900}
              priority
              sizes="(min-width: 761px) 50vw, 100vw"
              className="block h-full min-h-[320px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ------------------------ Pick your town ---------------------- */}
      <section
        id="towns"
        className="mx-auto flex max-w-site flex-col gap-[26px] px-section-x py-[clamp(36px,6vw,76px)]"
      >
        <div className="flex flex-col gap-3">
          <h2 className="text-[clamp(28px,5.5vw,46px)] leading-[0.98] tracking-[-0.035em]">
            Pick your town
          </h2>
          <p className="max-w-[52ch] text-[17px] leading-[1.55] text-body-soft">
            Wells and Osakis are the same price. Every rate, fee, and key charge
            is posted on the page.
          </p>
        </div>

        <div className="grid max-w-[860px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3">
          {locations.map((loc) => (
            <Link
              key={loc.slug}
              href={`/${loc.slug}`}
              className="flex flex-col gap-[14px] border-[3px] border-ink p-[22px] text-ink no-underline hover:bg-offwhite"
            >
              <div className="font-display text-[clamp(26px,4vw,34px)] leading-none tracking-[-0.03em]">
                {loc.name}
              </div>
              <div className="font-mono text-[13px] leading-[1.7] text-body-mid">
                {loc.streetAddress}
                <br />
                Open 24 hours, 7 days
              </div>
              <div className="mt-auto flex items-baseline gap-2">
                <span className="font-display text-[clamp(36px,6vw,48px)] leading-[0.9] tracking-[-0.04em] text-orange-dark">
                  {money(loc.singlePrice)}
                </span>
                <span className="text-[14px] font-semibold text-muted">
                  /mo single
                </span>
              </div>
              <div className="bg-ink px-4 py-[13px] text-center text-[15px] font-bold text-white">
                {loc.name} prices and hours
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* -------------- What 24/7 actually means here ----------------- */}
      <section className="border-t-[3px] border-b border-t-ink border-b-hairline">
        <div className="mx-auto grid max-w-site grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-gap-2col px-section-x py-section-y">
          <div className="flex flex-col gap-[18px]">
            <h2 className="text-h2 leading-[0.98] tracking-[-0.035em]">
              What 24/7 actually means here
            </h2>
            <div className="flex flex-col">
              {[
                {
                  title: 'You hold a key',
                  body: 'Your keycard opens the door any hour of any day. Nobody has to be there to let you in.',
                },
                {
                  title: 'No closing time to beat',
                  body: "If you work nights at the plant or leave for the field at five, the gym still fits. It's the same building at 3 a.m. as at 3 p.m.",
                },
                {
                  title: 'One bill for the household',
                  body: 'Couple and family memberships cover everyone under one roof instead of separate payments each.',
                },
              ].map((row, i, all) => (
                <div
                  key={row.title}
                  className={`flex flex-col gap-[5px] border-t border-hairline py-4 ${
                    i === all.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <div className="text-[19px] font-bold">{row.title}</div>
                  <div className="max-w-[46ch] text-[16px] leading-[1.55] text-body-soft">
                    {row.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <SanityImage
            value={photos?.floorPhotoPrimary}
            width={1000}
            height={750}
            sizes="(min-width: 761px) 50vw, 100vw"
            className="block aspect-[4/3] w-full bg-grey-100 object-cover"
          />
        </div>
      </section>

      {/* -------------------------- How to join ----------------------- */}
      <section
        id="join"
        className="mx-auto flex max-w-site flex-col gap-6 px-section-x py-section-y"
      >
        <h2 className="text-h2 leading-[0.98] tracking-[-0.035em]">
          How to join
        </h2>
        <ol className="grid list-none grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5 p-0">
          <li className="flex flex-col gap-[7px] border-t-4 border-ink pt-[14px]">
            <span className="font-mono text-[14px] font-semibold">Step 1</span>
            <span className="text-[19px] font-bold">
              Sign up online or walk in
            </span>
            <span className="text-[16px] leading-[1.55] text-body-soft">
              Do it from your phone in a few minutes, or call the town
              you&apos;ll actually use and someone will meet you there.
            </span>
          </li>
          <li className="flex flex-col gap-[7px] border-t-4 border-ink pt-[14px]">
            <span className="font-mono text-[14px] font-semibold">Step 2</span>
            <span className="text-[19px] font-bold">Pay the joining fee</span>
            <span className="text-[16px] leading-[1.55] text-body-soft">
              {money(joiningFeeSingle)} for a single membership,{' '}
              {money(joiningFeeCouple)} for a couple or family. One time, and it
              covers your key.
            </span>
          </li>
          <li className="flex flex-col gap-[7px] border-t-4 border-orange pt-[14px]">
            <span className="font-mono text-[14px] font-semibold">Step 3</span>
            <span className="text-[19px] font-bold">Come in whenever</span>
            <span className="text-[16px] leading-[1.55] text-body-soft">
              Pick up your key at the gym and it works from that day on. Choose
              a 3-, 6-, or 12-month term — take the 12-month and your rate is
              locked for the year.
            </span>
          </li>
        </ol>
        <div className="flex flex-wrap items-center gap-[10px]">
          <Link
            href="/join"
            className="bg-orange px-6 py-4 text-[17px] font-extrabold text-ink no-underline hover:bg-orange-hover"
          >
            Sign up online now
          </Link>
          {locations.map((loc) => (
            <a
              key={loc.slug}
              href={`tel:${loc.phoneTel}`}
              className="border-2 border-ink px-5 py-[14px] text-[16px] font-bold text-ink no-underline hover:bg-orange-tint"
            >
              Call {loc.name}
            </a>
          ))}
        </div>
      </section>

      {/* ------------------------ Military band ----------------------- */}
      <section className="on-dark bg-ink text-white">
        <div className="mx-auto grid max-w-site grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-center gap-x-10 gap-y-5 px-section-x py-band-y">
          <div className="font-display text-[clamp(28px,5.5vw,44px)] leading-[0.95] tracking-[-0.035em]">
            {settings.militaryDiscountPercent}% off for military
            <span className="text-orange">.</span>
          </div>
          <p className="max-w-[44ch] text-[17px] leading-[1.55] text-ondark-200">
            {settings.militaryDiscountTerms}
          </p>
        </div>
      </section>

      {/* --------------------- Locally owned -------------------------- */}
      <section className="mx-auto grid max-w-site grid-cols-[repeat(auto-fit,minmax(290px,1fr))] items-center gap-gap-2col px-section-x py-section-y">
        <SanityImage
          value={photos?.floorPhotoSecondary}
          width={1000}
          height={667}
          sizes="(min-width: 761px) 50vw, 100vw"
          className="block aspect-[3/2] w-full bg-grey-100 object-cover"
        />
        <div className="flex flex-col gap-[18px]">
          <h2 className="text-[clamp(26px,5vw,38px)] leading-none tracking-[-0.035em]">
            Locally owned, one town over
          </h2>
          <p className="max-w-[50ch] text-[17px] leading-[1.6] text-body">
            We&apos;re not a franchise. The same people who own these gyms are
            the ones who fix the treadmill and hand you your key.{' '}
            {wells?.name} and {osakis?.name} each got a 24-hour gym because the
            towns were big enough to need one and too small to get one from
            anyone else.
          </p>
          <Link
            href="/about"
            className="self-start border-2 border-ink px-5 py-[13px] text-[16px] font-bold text-ink no-underline hover:border-orange hover:bg-orange"
          >
            Read about us
          </Link>
        </div>
      </section>
    </main>
  )
}
