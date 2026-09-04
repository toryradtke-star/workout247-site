# Pre-launch checklist

Deferred items, each with the reason it was deferred. Nothing here is
blocking development; all of it must be done before or at cutover.

## Secrets

- [ ] **Rotate the Sanity read and write tokens.** Both were returned in
      plaintext when the project was created and appeared in an agent
      transcript. Rotate in sanity.io/manage → API → Tokens, then update
      `SANITY_API_READ_TOKEN` in `.env.local` and in Vercel.
      *(Deferred by decision — the current read token stays in use until then.)*
- [ ] **Enable 2FA on the Vercel account.** Skipped during the initial
      project import to get past the interstitial; the account holds the
      deploy pipeline and the production env vars.
      *(To be done in the same pass as the token rotation above.)*
- [ ] Set all env vars in Vercel for Production **and** Preview. See
      `.env.example` for the full list.
- [ ] Confirm `SANITY_REVALIDATE_SECRET` matches between Vercel and the
      Sanity webhook config.

## Email delivery (Resend)

- [ ] Create the Resend account and add the domain `workout247fitness.com`.
- [ ] Add the DKIM and SPF **TXT** records Resend generates, in Hostinger's
      DNS zone editor. Additive and safe to do well before cutover.
      *(Deferred: the records don't exist until the domain is added in Resend.)*
- [ ] Verify the domain in Resend, then send a real test message to each
      town's `contactEmail`.

## DNS and cutover (Hostinger)

Confirmed by RDAP and DNS lookup on 2026-09-04:
registrar **HOSTINGER operations, UAB**; nameservers `ns1/ns2.dns-parking.com`;
**no MX records** (no email on the domain); no TXT/SPF; A records
`147.79.120.54`, `148.135.128.129`; expires **2027-01-10**;
status `clientTransferProhibited`.

Because the domain is both registered and DNS-hosted at Hostinger,
**nameservers are never touched.** Cutover is two record edits.

- [ ] Confirm in hPanel → Emails that there are **no mailboxes** on the
      domain. DNS says there can be no working ones, but check before
      touching anything.
- [ ] Confirm hPanel → Domains shows expiry 2027-01-10 with auto-renew on.
- [ ] **Day before cutover:** drop the A record TTL to **300 seconds**, so a
      rollback takes minutes instead of hours.
- [ ] Verify the new site fully on its Vercel preview URL first.
- [ ] Cutover: point the A record and the `www` CNAME at Vercel. Nameservers
      untouched. The nameserver screen sits beside "delete website" — stay out
      of it.
- [ ] Keep WordPress hosting live for a few weeks as rollback. Nothing gets
      cancelled.
- [ ] Rollback, if needed: change the two records back.

## Redirects

Verified against the live site. Four URLs in the original brief never
existed and need no redirect: `/contact`, `/privacy-policy`, `/terms`,
`/cookies` all return 404 today.

| Live URL | New target |
|---|---|
| `/about-us/` | `/about` (301) |
| `/membership/` | `/join` (301) |
| `/osakis-membership/` | `/osakis` (301) |
| `/fergus-falls-membership/` | `/` (301) |
| `/hello-world/` | `/` (301) — indexed default WP post |
| `/category/uncategorized/` | `/` (301) |
| `/author/toryradtkegmail-com/` | `/` (301) — exposes an email in the URL |
| `/feed/` | `/` (301) |
| `/wp-sitemap.xml` | `/sitemap.xml` (301) |

There is **no Wells page** on the live site, so `/wells` launches with no
inbound SEO equity.

## Content

- [ ] Term card copy is unwritten pending three answers: whether the joining
      fee recurs at renewal, whether freezes are available on all three terms
      or only 12-month, and whether "MOST MEMBERS PICK THIS" is true.
- [ ] Fill in the PushPress signup URL for each plan and term (6 plans × 3
      terms). Empty fields hide the button rather than rendering a dead one.
- [ ] Set the hotspot on all six photos — they're portrait originals in
      landscape slots, so the crop depends on it.
