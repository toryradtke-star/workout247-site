import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { PortableTextBlock } from '@portabletext/types'
import { PortableBody } from '@/components/portable-body'
import { SanityImage } from '@/components/sanity-image'
import { longDate } from '@/lib/format'
import { SITE_URL } from '@/lib/site'
import type { Post } from '@/lib/types'
import { sanityFetch } from '@/sanity/lib/fetch'
import { urlForImage } from '@/sanity/lib/image'
import { POST_QUERY, POST_SLUGS_QUERY } from '@/sanity/lib/queries'

type Props = { params: Promise<{ slug: string }> }

const tagsFor = (slug: string) => ['post', `post:${slug}`, 'location']

export async function generateStaticParams() {
  const posts = await sanityFetch<{ slug: string }[]>({
    query: POST_SLUGS_QUERY,
    tags: ['post'],
  })
  return posts.map(({ slug }) => ({ slug }))
}

// Articles published after the last deploy render on first request and
// are cached under their tags, so the webhook can purge them later.
export const dynamicParams = true

async function getPost(slug: string) {
  return sanityFetch<Post | null>({
    query: POST_QUERY,
    params: { slug },
    tags: tagsFor(slug),
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  const share = post.ogImage ?? post.mainImage
  return {
    title: post.metaTitle ?? `${post.title} | Workout 24/7`,
    description: post.metaDescription ?? post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: share?.asset
      ? { images: [urlForImage(share as never).width(1200).height(630).url()] }
      : undefined,
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <main className="font-sans text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: postJsonLd(post) }}
      />

      <section className="on-dark bg-ink text-white">
        <div className="mx-auto flex max-w-[860px] flex-col gap-5 px-section-x py-[clamp(32px,6vw,68px)]">
          <Link
            href="/blog"
            className="font-mono text-[14px] text-ondark-400 no-underline hover:text-white"
          >
            ← All articles
          </Link>
          <h1 className="text-[clamp(32px,6vw,54px)] leading-[0.98] tracking-[-0.035em] text-balance">
            {post.title}
          </h1>
          <div className="font-mono text-[14px] text-ondark-100">
            {longDate(post.publishedAt)}
            {post.town && ` · ${post.town.name}`}
          </div>
        </div>
      </section>

      <article className="mx-auto flex max-w-[860px] flex-col gap-8 px-section-x py-section-y">
        <SanityImage
          value={post.mainImage}
          width={1400}
          height={788}
          priority
          sizes="(min-width: 900px) 860px, 100vw"
          className="block aspect-[16/9] w-full bg-grey-100 object-cover"
        />
        <div className="flex flex-col gap-5 text-[18px] leading-[1.65] text-ink-mid">
          <PortableBody value={post.body as PortableTextBlock[]} />
        </div>

        {post.faq?.length ? (
          <section className="flex flex-col gap-4 border-t-[3px] border-ink pt-8">
            <h2 className="text-h2 leading-[0.98] tracking-[-0.03em]">
              Questions
            </h2>
            {post.faq.map((qa) => (
              <div key={qa._key} className="flex flex-col gap-2">
                <h3 className="text-[19px] font-bold">{qa.question}</h3>
                <p className="text-[17px] leading-[1.6] text-body">{qa.answer}</p>
              </div>
            ))}
          </section>
        ) : null}
      </article>

      <section className="bg-orange text-ink">
        <div className="mx-auto grid max-w-site grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-center gap-x-10 gap-y-5 px-section-x py-[clamp(28px,4vw,48px)]">
          <div className="font-display text-[clamp(26px,5vw,40px)] leading-[0.98] tracking-[-0.03em]">
            Your own key, any hour.
          </div>
          <div className="flex flex-wrap gap-[10px]">
            <Link
              href={post.town ? `/${post.town.slug}#rates` : '/join'}
              className="bg-ink px-[22px] py-[15px] text-[16px] font-bold text-white no-underline hover:bg-white hover:text-ink"
            >
              {post.town ? `${post.town.name} prices` : 'See prices'}
            </Link>
            <Link
              href="/contact"
              className="border-2 border-ink px-5 py-[13px] text-[16px] font-bold text-ink no-underline hover:bg-ink hover:text-white"
            >
              Phones and addresses
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

/** Article plus FAQ markup, so search engines can show the Q&A directly. */
function postJsonLd(post: Post) {
  const url = `${SITE_URL}/blog/${post.slug}`
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Article',
      headline: post.title,
      description: post.metaDescription ?? post.excerpt,
      datePublished: post.publishedAt,
      dateModified: post._updatedAt,
      mainEntityOfPage: url,
      author: { '@type': 'Organization', name: 'Workout 24/7', url: SITE_URL },
      publisher: { '@type': 'Organization', name: 'Workout 24/7', url: SITE_URL },
      ...(post.mainImage?.asset && {
        image: urlForImage(post.mainImage as never).width(1200).height(675).url(),
      }),
    },
  ]
  if (post.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: post.faq.map((qa) => ({
        '@type': 'Question',
        name: qa.question,
        acceptedAnswer: { '@type': 'Answer', text: qa.answer },
      })),
    })
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(
    /</g,
    '\\u003c',
  )
}
