'use client'

import { useEffect, useState } from 'react'

const CHICAGO = 'America/Chicago'

function formatLocalTime(date: Date): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: CHICAGO,
      hour: 'numeric',
      minute: '2-digit',
    })
      .format(date)
      .replace('AM', 'a.m.')
      .replace('PM', 'p.m.')
  } catch {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }
}

/**
 * The signature element. The gym's own local time is the proof that it's
 * open, so it has to be the visitor's-eye truth rather than the server's.
 *
 * The clock is null through SSR and the first client render, then filled
 * after mount — a server in any timezone cannot produce a mismatch. The
 * span reserves its width so filling it in doesn't shift the line.
 */
export function OpenNowBand({ town = 'Minnesota' }: { town?: string }) {
  const [clock, setClock] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => setClock(formatLocalTime(new Date()))
    tick()

    const reduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const id = setInterval(tick, reduced ? 60_000 : 15_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 bg-orange px-[18px] py-[13px] font-mono text-[15px] leading-[1.4] text-ink">
      <div className="flex flex-none items-center gap-[9px] font-semibold whitespace-nowrap">
        <span
          aria-hidden="true"
          className="block size-[9px] flex-none rounded-full bg-ink"
        />
        <span>We&apos;re open right now</span>
      </div>
      <div className="min-w-0 flex-auto">
        <span
          className={`tnum inline-block tracking-[-0.01em] whitespace-nowrap ${
            // Reserve the clock's width only before it exists, so filling
            // it in doesn't reflow the line. Once filled the span takes its
            // natural width and the spacing matches the design exactly.
            clock ? '' : 'min-w-[15ch]'
          }`}
          suppressHydrationWarning
        >
          {clock ? `It's ${clock}` : ''}
        </span>
        <span> in {town}</span>
      </div>
    </div>
  )
}
