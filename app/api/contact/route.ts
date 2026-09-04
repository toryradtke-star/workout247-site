import { type NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { checkRateLimit } from '@/lib/rate-limit'
import { sanityFetch } from '@/sanity/lib/fetch'
import { CONTACT_RECIPIENT_QUERY } from '@/sanity/lib/queries'

type Payload = {
  name?: unknown
  contact?: unknown
  location?: unknown
  message?: unknown
  website?: unknown
}

const LIMITS = { name: 100, contact: 200, location: 60, message: 5000 }

function asText(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > max) return null
  return trimmed
}

/** Deliberately conservative: only used to decide whether Reply-To is usable. */
function asEmail(value: string): string | null {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? value : null
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

export async function POST(req: NextRequest) {
  let body: Payload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 })
  }

  // Honeypot. A person never sees this field, so anything in it is a bot.
  // Answer 200 so the bot learns nothing about why it failed.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const name = asText(body.name, LIMITS.name)
  const contact = asText(body.contact, LIMITS.contact)
  const town = asText(body.location, LIMITS.location)
  const message = asText(body.message, LIMITS.message)

  if (!name || !contact || !town || !message) {
    return NextResponse.json(
      { error: 'Please fill in every field.' },
      { status: 422 },
    )
  }

  const { allowed, configured } = await checkRateLimit(clientIp(req))
  if (!allowed) {
    return NextResponse.json(
      { error: "That's a few messages in a short time." },
      { status: 429 },
    )
  }
  if (!configured) {
    console.warn(
      '[contact] Upstash is not configured — submissions are not rate limited.',
    )
  }

  const fromAddress = process.env.CONTACT_FROM_EMAIL
  const fallback = process.env.CONTACT_FALLBACK_EMAIL
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey || !fromAddress) {
    console.error('[contact] RESEND_API_KEY or CONTACT_FROM_EMAIL is missing.')
    return NextResponse.json(
      { error: "The message form isn't available right now." },
      { status: 503 },
    )
  }

  // The recipient comes from Sanity, never from the request body.
  const recipientDoc = await sanityFetch<{
    name: string
    contactEmail?: string
  } | null>({
    query: CONTACT_RECIPIENT_QUERY,
    params: { town },
    revalidate: 300,
  })

  // "Not sure yet" matches no town, and a town with no address set falls
  // back rather than dropping the message.
  const to = recipientDoc?.contactEmail ?? fallback
  if (!to) {
    console.error(`[contact] No recipient for "${town}" and no fallback set.`)
    return NextResponse.json(
      { error: "The message form isn't available right now." },
      { status: 503 },
    )
  }

  const townLabel = recipientDoc?.name ?? town
  const replyTo = asEmail(contact)

  const lines = [
    `Town: ${townLabel}`,
    `Name: ${name}`,
    `Phone or email: ${contact}`,
    '',
    message,
  ]

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: `Workout 24/7 website <${fromAddress}>`,
      to: [to],
      // Town first, so it's obvious at a glance which gym a message is about.
      subject: `[${townLabel}] Message from ${name}`,
      text: lines.join('\n'),
      // Lets the owner hit reply and reach the visitor directly, when the
      // visitor gave an email rather than a phone number.
      ...(replyTo ? { replyTo } : {}),
    })

    if (error) {
      console.error('[contact] Resend rejected the message:', error)
      return NextResponse.json(
        { error: 'That did not go through.' },
        { status: 502 },
      )
    }
  } catch (err) {
    console.error('[contact] Sending failed:', err)
    return NextResponse.json(
      { error: 'That did not go through.' },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}
