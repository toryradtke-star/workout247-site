import Image from 'next/image'
import Link from 'next/link'
import type { FooterSettings, LocationSummary } from '@/lib/types'

type Props = {
  locations: LocationSummary[]
  settings: FooterSettings
  logoLightUrl?: string
}

/**
 * Server component — no interactivity. Both towns' details come from
 * Sanity so a phone number or address change never needs a deploy.
 */
export function SiteFooter({
  locations,
  settings,
  logoLightUrl = '/assets/logo-light.png',
}: Props) {
  return (
    <footer className="on-dark bg-ink font-sans text-white">
      <div className="mx-auto flex max-w-site flex-col gap-11 px-section-x pt-[clamp(40px,7vw,72px)] pb-7">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-7 gap-y-8">
          {locations.map((loc) => (
            <div key={loc.slug} className="flex flex-col gap-[10px]">
              <Link
                href={`/${loc.slug}`}
                className="font-display text-[22px] tracking-[-0.02em] text-white no-underline hover:text-orange"
              >
                {loc.name}
              </Link>
              <div className="font-mono text-[14px] leading-[1.75] text-ondark-300">
                {loc.streetAddress}
                <br />
                {loc.cityStateZip}
                <br />
                <a
                  href={`tel:${loc.phoneTel}`}
                  className="text-orange no-underline hover:underline"
                >
                  {loc.phoneDisplay}
                </a>
                <br />
                Open 24 hours, 7 days
              </div>
              <a
                href={loc.mapUrl}
                target="_blank"
                rel="noopener"
                className="text-[14px] font-semibold text-white underline underline-offset-[3px]"
              >
                Map
              </a>
            </div>
          ))}

          <div className="flex flex-col gap-[10px]">
            {/* logo-light.png has real alpha and must not be flattened; it
                sits directly on #111. */}
            <Image
              src={logoLightUrl}
              alt="Workout 24/7"
              width={1229}
              height={258}
              className="block h-auto w-full max-w-[220px]"
            />
            <div className="flex flex-col gap-[7px] text-[15px]">
              <Link
                href="/"
                className="text-ondark-300 no-underline hover:text-white"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-ondark-300 no-underline hover:text-white"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-ondark-300 no-underline hover:text-white"
              >
                Contact
              </Link>
              <Link
                href="/join"
                className="font-bold text-orange no-underline hover:underline"
              >
                Join online
              </Link>
              <span className="font-mono text-[13px] text-ondark-300">
                or call{' '}
                {locations.map((loc, i) => (
                  <span key={loc.slug}>
                    {i > 0 && ' / '}
                    <a
                      href={`tel:${loc.phoneTel}`}
                      className="text-white no-underline hover:underline"
                    >
                      {loc.name}
                    </a>
                  </span>
                ))}
              </span>
            </div>
            <div className="mt-1 text-[14px] leading-[1.5] text-ondark-300">
              {settings.militaryDiscountPercent}% off for active military and
              veterans, at both locations.
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-footer-rule pt-5 font-mono text-[12px] text-ondark-muted">
          <span>{settings.footerNote}</span>
          <span>
            © {new Date().getFullYear()} {settings.copyrightName}
          </span>
        </div>
      </div>
    </footer>
  )
}
