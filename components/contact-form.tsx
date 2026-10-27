'use client'

import { useId, useState } from 'react'

type Status = 'idle' | 'pending' | 'sent' | 'error'

const FIELD =
  'border-2 border-ink bg-white px-[14px] py-[13px] font-sans text-[17px] font-normal text-ink'
const LABEL = 'flex flex-col gap-[6px] text-[15px] font-bold'

/**
 * The design replaces the whole form with a confirmation on success. That
 * swap is preserved here, with the error state the handoff asks for.
 *
 * After the gym is emailed (/api/contact), a copy goes to Webcraft's CRM
 * (webcraft-mail's lead form "contact") so it shows in the inbox and the
 * pipeline. It is sent from the browser, because the CRM limits submissions
 * per visitor IP, and it's best effort: the email is what makes sure nothing
 * is lost.
 */
const CRM_LEAD = 'https://mail.webcraftmn.com/api/lead'

function sendToCrm(p: Record<string, FormDataEntryValue>) {
  const text = (k: string) => (typeof p[k] === 'string' ? (p[k] as string).trim() : '')
  const [first, ...rest] = text('name').split(/\s+/)
  const contact = text('contact')
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact)
  const anon = document.cookie.match(/(?:^|; )wm_id=([^;]*)/)?.[1]
  fetch(CRM_LEAD, {
    method: 'POST',
    // text/plain keeps it a simple CORS request, like wm.js.
    headers: { 'Content-Type': 'text/plain' },
    keepalive: true,
    body: JSON.stringify({
      site: 'workout247', form: 'contact', first_name: first, last_name: rest.join(' '),
      ...(isEmail ? { email: contact } : { phone: contact }),
      'custom:town': text('location'), message: text('message'), company: text('website'),
      url: window.location.href, referrer: document.referrer,
      ...(anon ? { anon_id: decodeURIComponent(anon) } : {}),
    }),
  }).catch(() => {})
}
export function ContactForm({ towns }: { towns: string[] }) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const errorId = useId()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('pending')
    setError(null)

    const form = event.currentTarget
    const payload = Object.fromEntries(new FormData(form))

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'That did not go through.')
      }
      setStatus('sent')
      sendToCrm(payload)
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : 'That did not go through.',
      )
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col gap-3 border-[3px] border-orange bg-orange-tint p-[26px]">
        <div className="font-display text-[26px] leading-[1.05] tracking-[-0.02em]">
          Message sent.
        </div>
        <p className="text-[17px] leading-[1.6] text-ink-mid">
          Thanks — we&apos;ll reply within a day. If it&apos;s urgent, call the
          gym in your town.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate={false}>
      <label className={LABEL}>
        Your name
        <input type="text" name="name" required autoComplete="name" className={FIELD} />
      </label>
      <label className={LABEL}>
        Phone or email
        <input type="text" name="contact" required className={FIELD} />
      </label>
      <label className={LABEL}>
        Which gym
        <select name="location" defaultValue={towns[0]} className={FIELD}>
          {towns.map((town) => (
            <option key={town} value={town}>
              {town}
            </option>
          ))}
          <option value="Not sure yet">Not sure yet</option>
        </select>
      </label>
      <label className={LABEL}>
        Message
        <textarea
          name="message"
          rows={5}
          required
          className={`${FIELD} resize-y`}
        />
      </label>

      {/* Spam trap. Left empty by people, filled by bots. Hidden from
          assistive tech as well as from sight. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === 'error' && error && (
        <p
          id={errorId}
          role="alert"
          className="border-l-[3px] border-orange bg-orange-tint px-[14px] py-3 text-[16px] leading-[1.5] text-ink"
        >
          {error} Please try again, or call the gym in your town.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'pending'}
        aria-describedby={status === 'error' ? errorId : undefined}
        className="cursor-pointer self-start border-none bg-ink px-[22px] py-[17px] font-sans text-[17px] font-extrabold text-white hover:bg-orange hover:text-ink disabled:cursor-wait disabled:opacity-70"
      >
        {status === 'pending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
