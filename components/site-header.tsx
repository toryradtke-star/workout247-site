'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { money } from '@/lib/format'
import type { LocationSummary } from '@/lib/types'

type Props = {
  locations: LocationSummary[]
  logoUrl?: string
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Fixed top bar. The prototype measured its own height with a
 * ResizeObserver and rendered a matching spacer; this uses `sticky`
 * instead, so the header occupies real layout space and no measurement,
 * spacer, or height state is needed. In-page anchors are handled by
 * `scroll-padding-top` on <html>.
 *
 * The desktop/mobile switch is the design's single media query (760px),
 * done in CSS rather than matchMedia so there's no hydration mismatch
 * and no flash of the wrong bar.
 */
export function SiteHeader({ locations, logoUrl = '/assets/logo.png' }: Props) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLElement | null>(null)
  const burgerRef = useRef<HTMLButtonElement | null>(null)

  const active = locations.find((l) => pathname === `/${l.slug}`)?.slug ?? ''
  const activeLocation = locations.find((l) => l.slug === active)

  const close = useCallback(() => setMenuOpen(false), [])

  // Close on route change — a menu left open over the new page is the
  // classic bug the brief calls out.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // The prototype closed the menu when the breakpoint changed. With a
  // CSS switch the panel would just vanish while still "open", leaving
  // focus trapped on hidden elements.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 761px)')
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Escape closes and returns focus to the button that opened it.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        burgerRef.current?.focus()
        return
      }
      if (e.key !== 'Tab') return

      // Focus trap: cycle within the open panel.
      const items = menuRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (!items?.length) return
      const first = items[0]
      const last = items[items.length - 1]
      const activeEl = document.activeElement

      if (e.shiftKey && (activeEl === first || activeEl === burgerRef.current)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen, close])

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (!menuOpen) return
    menuRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
  }, [menuOpen])

  const callHref = activeLocation ? `tel:${activeLocation.phoneTel}` : '/contact'
  const callLabel = activeLocation
    ? `Call ${activeLocation.name} — ${activeLocation.phoneDisplay}`
    : 'Phones & addresses'
  const callShort = activeLocation ? `Call ${activeLocation.name}` : 'Phone numbers'

  const chipClass = (slug: string) =>
    [
      'border-2 px-[13px] py-[9px] no-underline hover:border-ink',
      active === slug
        ? 'border-orange bg-orange'
        : 'border-border-grey bg-transparent',
    ].join(' ')

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-white">
      {/* ---------------- Desktop (761px and up) ---------------- */}
      <div className="hidden nav:block">
        <div className="mx-auto flex max-w-site items-center gap-6 px-section-x py-3">
          <Link
            href="/"
            aria-label="Workout 24/7 home"
            className="flex flex-none items-center no-underline"
          >
            <Image
              src={logoUrl}
              alt="Workout 24/7"
              width={1229}
              height={258}
              priority
              className="block h-10 w-auto"
            />
          </Link>
          <nav className="ml-auto flex items-center gap-[6px] font-sans text-[15px] font-semibold">
            {locations.map((loc) => (
              <Link
                key={loc.slug}
                href={`/${loc.slug}`}
                aria-current={active === loc.slug ? 'page' : undefined}
                className={`text-ink ${chipClass(loc.slug)}`}
              >
                {loc.name}
              </Link>
            ))}
            <span
              aria-hidden="true"
              className="mx-[6px] h-[22px] w-px bg-hairline-warm"
            />
            <Link
              href="/about"
              className="border-b-2 border-transparent px-[6px] py-[9px] text-ink no-underline hover:border-b-orange"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="border-b-2 border-transparent px-[6px] py-[9px] text-ink no-underline hover:border-b-orange"
            >
              Contact
            </Link>
            <Link
              href="/join"
              className="ml-2 border-2 border-ink px-[14px] py-[11px] font-bold text-ink no-underline hover:bg-orange-tint"
            >
              Join online
            </Link>
            <a
              href={callHref}
              className="bg-orange px-4 py-[11px] font-extrabold text-ink no-underline hover:bg-orange-hover"
            >
              {callShort}
            </a>
          </nav>
        </div>

        {/* Town switcher — only once a town is being viewed. */}
        {active && (
          <div data-town-switcher className="border-t border-hairline">
            <div className="mx-auto flex max-w-site items-center gap-[14px] px-section-x py-[10px]">
              <span className="font-mono text-[12px] whitespace-nowrap text-muted">
                Viewing prices for
              </span>
              <div className="flex gap-[6px]">
                {locations.map((loc) => (
                  <Link
                    key={loc.slug}
                    href={`/${loc.slug}`}
                    className={`font-sans text-[14px] font-bold whitespace-nowrap text-ink ${
                      active === loc.slug
                        ? 'border-orange bg-orange'
                        : 'border-border-grey bg-transparent'
                    } border-2 px-[13px] py-2 no-underline hover:border-ink`}
                  >
                    {loc.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- Mobile (760px and down) ---------------- */}
      <div className="nav:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-[10px]">
          <Link
            href="/"
            aria-label="Workout 24/7 home"
            className="flex min-w-0 flex-auto items-center no-underline"
          >
            <Image
              src={logoUrl}
              alt="Workout 24/7"
              width={1229}
              height={258}
              priority
              className="block h-[30px] w-auto max-w-full"
            />
          </Link>
          <button
            ref={burgerRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Menu"
            className={`flex size-12 flex-none cursor-pointer flex-col items-center justify-center gap-[5px] border-2 border-ink p-0 ${
              menuOpen ? 'bg-orange' : 'bg-white'
            }`}
          >
            <span aria-hidden="true" className="block h-[3px] w-[22px] bg-ink" />
            <span aria-hidden="true" className="block h-[3px] w-[22px] bg-ink" />
            <span aria-hidden="true" className="block h-[3px] w-[22px] bg-ink" />
          </button>
        </div>

        {menuOpen && (
          <nav
            id="mobile-menu"
            ref={menuRef}
            className="absolute top-full right-0 left-0 flex max-h-[78vh] flex-col overflow-y-auto border-t-2 border-b-[3px] border-ink bg-white font-sans shadow-menu"
          >
            {locations.map((loc) => (
              <Link
                key={loc.slug}
                href={`/${loc.slug}`}
                className={`flex min-h-11 items-center justify-between gap-3 border-b border-hairline p-4 text-[19px] font-bold text-ink no-underline ${
                  active === loc.slug ? 'bg-orange' : ''
                }`}
              >
                <span>{loc.name}</span>
                <span className="font-mono text-[13px] font-normal text-body-mid">
                  {money(loc.singlePrice)}/mo
                </span>
              </Link>
            ))}
            <Link
              href="/about"
              className="flex min-h-11 items-center border-b border-hairline p-4 text-[19px] font-semibold text-ink no-underline"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="flex min-h-11 items-center border-b border-hairline p-4 text-[19px] font-semibold text-ink no-underline"
            >
              Contact
            </Link>
            {/* Join online sits above the call row and is deliberately the
                quieter of the two: on mobile, tapping to call is the
                higher-intent action in two small towns. */}
            <Link
              href="/join"
              className="flex min-h-11 items-center justify-center border-t-2 border-ink px-4 py-[17px] text-[17px] font-bold text-ink no-underline"
            >
              Join online
            </Link>
            <a
              href={callHref}
              className="flex min-h-11 items-center justify-center border-t-2 border-ink bg-orange px-4 py-[18px] text-[18px] font-extrabold text-ink no-underline"
            >
              {callLabel}
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}
