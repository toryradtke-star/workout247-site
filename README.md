# Workout 24/7 — multi-location gym site

Production marketing site for a multi-location 24-hour gym in central Minnesota.
Originally built in WordPress, then rebuilt on Next.js and Sanity so the owner
could edit hours, membership pricing, and offers without a developer and without
a redeploy.

**Live:** https://workout247fitness.com

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Sanity CMS 6 ·
Upstash Redis · Resend · Vercel

## What's interesting in here

**Content model, not a page builder.** Locations, membership plans, FAQ entries,
and site settings are modelled as Sanity document types with a shared
`seo-fields` object, rather than free-form pages. Adding a town means adding a
`location` document — the route, the nav, and the metadata follow from it.
See `sanity/schemaTypes/`.

**One route serves every location.** `app/(site)/[town]/page.tsx` renders any
location from its slug, so `/osakis` and `/wells` are the same code path.

**Tag-scoped ISR instead of rebuilds.** A Sanity webhook hits
`app/api/revalidate/route.ts`, which verifies the payload signature and purges
only the cache tags for documents that actually changed. Publishing a price edit
shows up in seconds; nothing else is invalidated. The GROQ projection the webhook
needs is documented in the route file.

**A contact form that survives the internet.** `app/api/contact/route.ts` pairs a
honeypot with a Redis-backed sliding-window limiter (`lib/rate-limit.ts`) at five
submissions per hour per IP. Serverless functions don't share memory, so
in-process rate limiting would be decorative — hence Upstash. The limiter fails
*open* by design: a form that silently drops real messages is a worse outcome
than one without rate limiting, and the honeypot still applies. Delivery goes
through Resend.

**Open-now state.** `components/open-now-band.tsx` with `lib/format.ts` computes
staffed-hours state from the location's hours in Sanity, rather than hardcoding it.

## Running it

```bash
npm install
cp .env.example .env.local   # fill in Sanity project id, read token, webhook secret
npm run dev
```

The Studio is embedded at `/studio`. `.env.example` documents every variable and
where its value comes from.

## Notes

Built with Claude Code as an AI-assisted development workflow; `AGENTS.md` holds
the project conventions that drove it. The commit history is phased
(content model → layout → routes → delivery) and readable in order.
