import Link from 'next/link'
import { OpenNowBand } from '@/components/open-now-band'
import { SanityImage } from '@/components/sanity-image'
import { money } from '@/lib/format'
import type { LocationPageData, MembershipPlan } from '@/lib/types'

const TIER_ORDER: MembershipPlan['tier'][] = ['single', 'couple', 'family']

/** One component for both towns. They differ only in data. */
export function LocationPage({ location, other, faq, settings }: LocationPageData) {
  if (!location) return null

  const plans = [...location.plans].sort(
    (a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier),
  )

  // The design's price table has a single "Monthly" column. While every
  // term carries the same rate this is unambiguous; if the terms ever
  // diverge the table needs a column per term.
  const monthlyFor = (plan: MembershipPlan) =>
    Math.min(...plan.terms.map((t) => t.monthlyPrice))

  const singlePlan = plans.find((p) => p.tier === 'single')
  const couplePlan = plans.find((p) => p.tier === 'couple')
  const recommended = settings.terms?.find((t) => t.isRecommended)
  const recommendedSignup = singlePlan?.terms.find(
    (t) => t.months === recommended?.months,
  )?.signupUrl

  const special = location.specialOffer
  const specialLive =
    special?.isActive &&
    (!special.endDate || new Date(special.endDate) >= new Date())

  // A town may override a shared answer without changing the others.
  const overrides = new Map(
    (location.faqOverrides ?? []).map((o) => [o.entryId, o.answer]),
  )

  return (
    <main className="bg-white font-sans text-ink">
      {/* ---------------------------- Hero ---------------------------- */}
      <section className="on-dark bg-ink text-white">
        <div className="mx-auto grid max-w-site grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-stretch">
          <div className="flex flex-col justify-center gap-[22px] px-section-x py-[clamp(28px,5vw,56px)]">
            <h1 className="text-h1-town leading-[0.9] tracking-[-0.035em]">
              {location.name}
              <span className="text-orange">.</span>
            </h1>
            <div className="max-w-[480px]">
              <OpenNowBand town={`${location.name}, MN`} />
            </div>
            <div className="font-mono text-[15px] leading-[1.8] text-ondark-100">
              <div>{location.streetAddress}</div>
              <div>{location.cityStateZip}</div>
              <div>Open 24 hours, 7 days a week</div>
            </div>
            <div className="flex flex-wrap gap-[10px]">
              <a
                href={`tel:${location.phoneTel}`}
                className="bg-orange px-[22px] py-[15px] text-[16px] font-extrabold text-ink no-underline hover:bg-orange-hover"
              >
                Call {location.phoneDisplay}
              </a>
              <a
                href={location.mapUrl}
                target="_blank"
                rel="noopener"
                className="border-2 border-white px-5 py-[13px] text-[16px] font-bold text-white no-underline hover:bg-white hover:text-ink"
              >
                Directions
              </a>
            </div>
          </div>
          <div className="min-h-[300px] bg-ink-900">
            <SanityImage
              value={location.heroPhoto}
              width={1200}
              height={900}
              priority
              sizes="(min-width: 761px) 50vw, 100vw"
              className="block h-full min-h-[300px] w-full object-cover contrast-[1.03]"
            />
          </div>
        </div>
      </section>

      {/* ------------------------ Special offer ----------------------- */}
      {specialLive && (
        <section className="bg-white">
          <div className="mx-auto max-w-site px-section-x pt-[clamp(28px,5vw,52px)]">
            <div className="border-4 border-orange">
              <div className="flex flex-wrap justify-between gap-x-[18px] gap-y-[6px] bg-orange px-[18px] py-3 font-mono text-[14px] font-semibold text-ink">
                <span>Special running now</span>
                {special?.note && <span className="font-normal">{special.note}</span>}
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-[26px] px-[clamp(16px,3vw,28px)] py-[clamp(20px,3vw,32px)]">
                {[
                  { label: 'Single', now: special?.singlePrice, was: singlePlan },
                  {
                    label: 'Couple / 2-person',
                    now: special?.couplePrice,
                    was: couplePlan,
                  },
                ].map(
                  (row) =>
                    row.now != null &&
                    row.was && (
                      <div key={row.label} className="flex flex-col gap-[6px]">
                        <div className="text-[15px] font-bold">{row.label}</div>
                        <div className="flex flex-wrap items-baseline gap-3">
                          <span className="font-display text-price-special leading-[0.85] tracking-[-0.04em]">
                            {money(row.now)}
                          </span>
                          <span className="font-mono text-[16px] text-muted line-through">
                            {money(monthlyFor(row.was))}
                          </span>
                        </div>
                        <div className="font-mono text-[13px] text-muted">
                          per month
                        </div>
                      </div>
                    ),
                )}
                {plans.find((p) => p.tier === 'family') && (
                  <div className="flex flex-col gap-[6px]">
                    <div className="text-[15px] font-bold">Family</div>
                    <div className="flex flex-wrap items-baseline gap-3">
                      <span className="font-display text-price-special leading-[0.85] tracking-[-0.04em] text-muted">
                        {money(monthlyFor(plans.find((p) => p.tier === 'family')!))}
                      </span>
                    </div>
                    <div className="font-mono text-[13px] text-muted">
                      standard price, no special
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --------------------------- Prices --------------------------- */}
      <section className="mx-auto max-w-site px-section-x py-section-y">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-[clamp(24px,4vw,56px)]">
          <div className="flex flex-col gap-[18px]">
            <h2 className="text-[clamp(28px,5vw,40px)] leading-[0.98] tracking-[-0.03em]">
              {location.priceHeading}
            </h2>
            <p className="max-w-[40ch] text-[17px] leading-[1.55] text-body">
              {location.intro}
            </p>
            <div className="border-l-[3px] border-ink pl-[14px] font-mono text-[13px] leading-[1.7] text-body-soft">
              Three terms to choose from:
              <br />
              3, 6, or 12 months.
              <br />
              12 months is the one to take.
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between gap-4 border-b-[3px] border-ink pb-[10px] font-mono text-[13px] font-semibold">
              <span>Membership</span>
              <span>Monthly</span>
            </div>
            {plans.map((plan, i) => (
              <div
                key={plan.tier}
                className={`flex items-baseline justify-between gap-4 py-4 ${
                  i === plans.length - 1
                    ? 'border-b-[3px] border-ink'
                    : 'border-b border-hairline'
                }`}
              >
                <span className="text-[18px] font-semibold">{plan.label}</span>
                <span className="font-display text-price leading-[0.9] tracking-[-0.035em]">
                  {money(monthlyFor(plan))}
                </span>
              </div>
            ))}

            <div className="flex flex-col gap-[10px] pt-[18px] font-mono text-[14px] text-ink-mid">
              {singlePlan && (
                <div className="flex justify-between gap-4">
                  <span>One-time joining fee, single</span>
                  <span className="font-semibold">
                    {money(singlePlan.joiningFee)}
                  </span>
                </div>
              )}
              {couplePlan && (
                <div className="flex justify-between gap-4">
                  <span>One-time joining fee, couple or family</span>
                  <span className="font-semibold">
                    {money(couplePlan.joiningFee)}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <span>Extra or replacement key</span>
                <span className="font-semibold">
                  {money(settings.replacementKeyFee)}
                </span>
              </div>
              <div className="leading-[1.6] text-muted">
                Sign up online in a few minutes, or call and do it in person.
                Either way you pick up your key at the gym.
              </div>
            </div>

            <div className="mt-[22px] flex flex-wrap gap-[10px]">
              <Link
                href="/join"
                className="focus-ring-ink bg-orange px-[22px] py-[15px] text-[16px] font-extrabold text-ink no-underline hover:bg-orange-hover"
              >
                Sign up online
              </Link>
              <a
                href={`tel:${location.phoneTel}`}
                className="bg-ink px-[22px] py-[15px] text-[16px] font-bold text-white no-underline hover:bg-orange hover:text-ink"
              >
                Call to sign up
              </a>
              <Link
                href="/contact"
                className="border-2 border-ink px-5 py-[13px] text-[16px] font-bold text-ink no-underline hover:bg-orange-tint"
              >
                Send a message
              </Link>
            </div>
          </div>
        </div>

        {/* ------------------------ Pick a term ----------------------- */}
        <div className="mt-[clamp(32px,5vw,56px)] flex flex-col gap-5">
          <div className="flex flex-col gap-[10px]">
            <h3 className="text-h3 leading-none tracking-[-0.03em]">
              Pick a term
            </h3>
            {settings.termsIntro && (
              <p className="max-w-[56ch] text-[17px] leading-[1.55] text-body-soft">
                {settings.termsIntro}
              </p>
            )}
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-3">
            {(settings.terms ?? []).map((term) => {
              const signupUrl = singlePlan?.terms.find(
                (t) => t.months === term.months,
              )?.signupUrl
              return term.isRecommended ? (
                <div
                  key={term._key}
                  className="flex flex-col gap-2 border-[3px] border-orange bg-orange-tint p-[19px]"
                >
                  {term.kicker && (
                    <div className="font-mono text-[12px] font-semibold">
                      {term.kicker}
                    </div>
                  )}
                  <div className="font-display text-[34px] leading-none tracking-[-0.035em]">
                    {term.months} months
                  </div>
                  {term.blurb && (
                    <div className="text-[16px] leading-[1.5] text-body">
                      {term.blurb}
                    </div>
                  )}
                  {signupUrl ? (
                    <a
                      href={signupUrl}
                      target="_blank"
                      rel="noopener"
                      className="mt-1 bg-ink px-4 py-[13px] text-center text-[15px] font-extrabold text-white no-underline hover:bg-orange hover:text-ink"
                    >
                      Start a {term.months}-month membership online
                    </a>
                  ) : (
                    <Link
                      href="/join"
                      className="mt-1 bg-ink px-4 py-[13px] text-center text-[15px] font-extrabold text-white no-underline hover:bg-orange hover:text-ink"
                    >
                      Start a {term.months}-month membership
                    </Link>
                  )}
                  <a
                    href={`tel:${location.phoneTel}`}
                    className="text-center font-mono text-[13px] text-ink no-underline hover:underline"
                  >
                    or call {location.phoneDisplay}
                  </a>
                </div>
              ) : (
                <div
                  key={term._key}
                  className="flex flex-col gap-2 border-2 border-border-grey p-5"
                >
                  <div className="font-display text-[30px] leading-none tracking-[-0.03em] text-muted">
                    {term.months} months
                  </div>
                  {term.blurb && (
                    <div className="text-[16px] leading-[1.5] text-body-mid">
                      {term.blurb}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ------------------------ Military band ----------------------- */}
      <section className="on-dark bg-ink text-white">
        <div className="mx-auto grid max-w-site grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-center gap-x-10 gap-y-5 px-section-x py-band-y">
          <div className="font-display text-[clamp(28px,5.5vw,44px)] leading-[0.95] tracking-[-0.03em]">
            {settings.militaryDiscountPercent}% off for military
            <span className="text-orange">.</span>
          </div>
          <p className="max-w-[44ch] text-[17px] leading-[1.55] text-ondark-200">
            {settings.militaryDiscountTerms}
          </p>
        </div>
      </section>

      {/* --------------------- What's on the floor -------------------- */}
      <section className="mx-auto flex max-w-site flex-col gap-7 px-section-x py-section-y">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-[clamp(26px,4.5vw,36px)] leading-none tracking-[-0.03em]">
              What&apos;s on the floor in {location.name}
            </h2>
            <ul className="m-0 flex list-none flex-col p-0 text-[17px]">
              {location.equipment.map((item, i, all) => (
                <li
                  key={item}
                  className={`border-t border-hairline py-3 ${
                    i === all.length - 1 ? 'border-b' : ''
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
            {location.maintenanceNote && (
              <p className="max-w-[46ch] text-[16px] leading-[1.55] text-body-soft">
                {location.maintenanceNote}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <SanityImage
              value={location.floorPhotoPrimary}
              width={1000}
              height={750}
              sizes="(min-width: 761px) 50vw, 100vw"
              className="block aspect-[4/3] w-full bg-grey-100 object-cover"
            />
            <SanityImage
              value={location.floorPhotoSecondary}
              width={1000}
              height={563}
              sizes="(min-width: 761px) 50vw, 100vw"
              className="block aspect-[16/9] w-full bg-grey-100 object-cover"
            />
          </div>
        </div>
      </section>

      {/* ----------------------------- FAQ ---------------------------- */}
      <section className="border-t border-hairline bg-offwhite">
        <div className="mx-auto grid max-w-site grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-x-12 gap-y-8 px-section-x py-[clamp(36px,6vw,68px)]">
          <h2 className="text-[clamp(26px,4.5vw,36px)] leading-none tracking-[-0.03em]">
            Questions we get at the desk
          </h2>
          <div className="flex flex-col">
            {faq.map((entry) => (
              <details
                key={entry._id}
                className="border-t border-hairline-warm py-[14px]"
              >
                <summary className="cursor-pointer list-none text-[18px] font-bold">
                  {entry.question}
                </summary>
                <p className="mt-[10px] text-[16px] leading-[1.6] text-body">
                  {overrides.get(entry._id) ?? entry.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------ The other gym ----------------------- */}
      {other && (
        <section className="mx-auto flex max-w-site flex-col gap-4 px-section-x py-section-y">
          <h2 className="text-[clamp(22px,4vw,30px)] leading-none tracking-[-0.03em]">
            The other gym
          </h2>
          <div className="max-w-[420px]">
            <Link
              href={`/${other.slug}`}
              className="flex items-baseline justify-between gap-3 border-2 border-ink px-5 py-[18px] text-ink no-underline hover:border-orange hover:bg-orange"
            >
              <span className="font-display text-[20px] tracking-[-0.02em]">
                {other.name}
              </span>
              <span className="font-mono text-[13px]">
                {money(other.singlePrice)}/mo
              </span>
            </Link>
          </div>
        </section>
      )}
    </main>
  )
}
