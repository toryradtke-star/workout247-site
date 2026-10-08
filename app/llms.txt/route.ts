import { SITE_URL } from '@/lib/site'
import { sanityFetch } from '@/sanity/lib/fetch'

// A plain-text guide to the site for AI assistants (llmstxt.org). Built from
// Sanity, so prices, towns and new articles stay current on their own.
const QUERY = /* groq */ `{
  "locations": *[_type == "location"] | order(displayOrder asc){
    name,
    "slug": slug.current,
    streetAddress,
    cityStateZip,
    phoneDisplay,
    "plans": *[_type == "membershipPlan" && location._ref == ^._id] | order(math::min(terms[].monthlyPrice) asc){
      label,
      joiningFee,
      "monthly": math::min(terms[].monthlyPrice)
    }
  },
  "settings": *[_id == "siteSettings"][0]{ militaryDiscountPercent, replacementKeyFee },
  "posts": *[_type == "post" && defined(slug.current)] | order(publishedAt desc){ title, "slug": slug.current, excerpt }
}`

type Data = {
  locations: {
    name: string
    slug: string
    streetAddress?: string
    cityStateZip?: string
    phoneDisplay?: string
    plans: { label?: string; joiningFee?: number; monthly?: number }[]
  }[]
  settings?: { militaryDiscountPercent?: number; replacementKeyFee?: number }
  posts: { title: string; slug: string; excerpt?: string }[]
}

const money = (n?: number) => (n == null ? '' : `$${n.toFixed(2).replace(/\.00$/, '')}`)
const link = (title: string, path: string, note?: string) =>
  `- [${title}](${SITE_URL}${path})${note ? `: ${note.replace(/\s+/g, ' ').trim()}` : ''}`

export async function GET() {
  const d = await sanityFetch<Data>({
    query: QUERY,
    tags: ['location', 'membershipPlan', 'siteSettings', 'post'],
  })
  const towns = d.locations.map((l) => l.name).join(' and ')
  const s = d.settings ?? {}

  const text = [
    '# Workout 24/7',
    '',
    `> 24-hour keycard gyms in ${towns}, Minnesota. Members get a key and can work out any time, day or night. There are no staffed hours, classes or personal training.`,
    '',
    ...d.locations.flatMap((l) => [
      `## ${l.name}, MN`,
      '',
      [l.streetAddress, l.cityStateZip].filter(Boolean).join(', '),
      l.phoneDisplay ? `Phone: ${l.phoneDisplay}` : '',
      ...l.plans.map(
        (p) => `- ${p.label}: from ${money(p.monthly)} a month, one-time joining fee ${money(p.joiningFee)}`,
      ),
      link(`${l.name} gym page`, `/${l.slug}`, 'rates, equipment and directions'),
      '',
    ]),
    '## Good to know',
    '',
    s.militaryDiscountPercent ? `- ${s.militaryDiscountPercent}% off the monthly rate for active duty, National Guard and veterans.` : '',
    s.replacementKeyFee ? `- Replacement key: ${money(s.replacementKeyFee)}.` : '',
    '- Joining is done by calling or stopping in at the gym; there is no online signup.',
    '',
    '## Pages',
    '',
    link('How to join', '/join'),
    link('About', '/about'),
    link('Contact', '/contact'),
    ...(d.posts.length ? [link('Blog', '/blog'), '', '## Articles', '', ...d.posts.map((p) => link(p.title, `/blog/${p.slug}`, p.excerpt))] : []),
    '',
  ]
    .filter((line, i, all) => line !== '' || all[i - 1] !== '')
    .join('\n')

  return new Response(text, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
