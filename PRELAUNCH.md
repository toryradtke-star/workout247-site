# Pre-launch checklist

Deferred items, each with the reason it was deferred. Nothing here is
blocking development; all of it must be done before or at cutover.

## Deploys

- Commits must be authored with an email attached to the `toryradtke-star`
  GitHub account (`toryradtke@gmail.com`). Vercel **blocks** any pushed
  deployment whose commit email it cannot match to a GitHub account, and the
  failure is silent from the git side — the push succeeds, the deploy never
  runs. Repo-local `user.email` is pinned for this reason.

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
- [ ] **Rotate the Resend API key.** It was pasted into an agent chat, so
      treat it as compromised. Regenerate in Resend -> API keys (Sending
      access, scoped to workout247fitness.com) and update Vercel.
- [ ] Set all env vars in Vercel for Production **and** Preview. See
      `.env.example` for the full list.
- [ ] Add the **Upstash Redis** integration from the Vercel Marketplace. Until
      then the contact form is **not rate limited** — the honeypot still
      applies, and the route logs a warning on every submission rather than
      failing silently.
- [ ] Create the **Sanity revalidation webhook** (needs
      `SANITY_REVALIDATE_SECRET`, so it cannot be automated). Until it exists,
      a content edit does not reach the live site until the next deploy.
      URL: `https://workout247-site.vercel.app/api/revalidate` — must be the
      vercel.app alias for now, because workout247fitness.com still serves
      WordPress and has no such route.
      Filter: `_type in ["location","membershipPlan","faqEntry","page","siteSettings"]`
      Projection: `{"tags": [_type, _type + ":" + slug.current]}`
- [ ] *Optional, after cutover:* repoint that webhook at
      `https://workout247fitness.com/api/revalidate`. Not required — the
      vercel.app alias keeps working, since both hostnames reach the same
      deployment and purge the same cache. The only reason to bother is that
      renaming the Vercel project would change the alias and break the webhook
      silently.
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
- [ ] Cutover: the root is an **ALIAS** record (`@` -> `workout247fitness.com.cdn.hstgr.net`),
      not an A record — it sits behind Hostinger's CDN, which is why `dig A`
      returns different IPs on different days. Repoint that ALIAS (or replace
      it with an A record) at Vercel, plus the `www` CNAME. Nameservers
      untouched. The nameserver screen sits beside "delete website" — stay out
      of it.
- [ ] Note: the four Resend records (`resend._domainkey`, `rsend`, `send`,
      `_dmarc`) are already in the zone and the domain is **verified**. Leave
      them alone during cutover.
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

- [ ] Term card copy is partially seeded, pending three answers: whether the
      joining fee recurs at renewal, whether freezes are available on all three
      terms or only 12-month, and whether "MOST MEMBERS PICK THIS" is true.
      What is seeded now claims only rate-reset timing, which is true either
      way. Edit in Studio → Site settings → Terms.
- [ ] The kicker on the 12-month card is deliberately **empty**, so the
      unverified "MOST MEMBERS PICK THIS" claim does not render.
- [ ] **Two FAQ entries are not seeded**, because both depend on pending
      answers. Add in Studio → FAQ when confirmed:
      - order 2, "Which term should I take?" — the existing answer claims the
        12-month is "the best value of the three", which is unsupported at
        identical rates.
      - order 6, "Can I freeze my membership?" — the design's 12-month card
        says a freeze is available on that term only, while this answer says
        freezes are generally available. Both cannot be true.
- [ ] Fill in the PushPress signup URL for each plan and term (6 plans × 3
      terms). Empty fields hide the button rather than rendering a dead one.
- [ ] Set the hotspot on all six photos — they're portrait originals in
      landscape slots, so the crop depends on it.
