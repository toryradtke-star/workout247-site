import type { Metadata } from 'next'
import Link from 'next/link'
import { SanityImage } from '@/components/sanity-image'
import { longDate } from '@/lib/format'
import type { PostSummary } from '@/lib/types'
import { sanityFetch } from '@/sanity/lib/fetch'
import { POSTS_QUERY } from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Articles | Workout 24/7',
  description:
    'Training, membership, and gym tips from Workout 24/7, the 24-hour keycard gym in Wells and Osakis, Minnesota.',
  alternates: { canonical: '/blog' },
}

export default async function BlogPage() {
  const posts = await sanityFetch<PostSummary[]>({
    query: POSTS_QUERY,
    tags: ['post', 'location'],
  })

  return (
    <main className="font-sans text-ink">
      <section className="on-dark bg-ink text-white">
        <div className="mx-auto flex max-w-site flex-col gap-5 px-section-x py-[clamp(32px,6vw,68px)]">
          <h1 className="text-[clamp(36px,8vw,64px)] leading-[0.92] tracking-[-0.035em]">
            Articles<span className="text-orange">.</span>
          </h1>
          <p className="max-w-[48ch] text-lede leading-[1.5] text-ondark-100">
            Straight answers about training on your own schedule, from the
            people who run the gyms in Wells and Osakis.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-site px-section-x py-section-y">
        {posts.length === 0 ? (
          <p className="text-[17px] text-body-soft">
            Nothing posted yet. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="flex flex-col border-[3px] border-ink text-ink no-underline hover:bg-offwhite"
              >
                <SanityImage
                  value={post.mainImage}
                  width={800}
                  height={450}
                  sizes="(min-width: 761px) 33vw, 100vw"
                  className="block aspect-[16/9] w-full bg-grey-100 object-cover"
                />
                <div className="flex flex-1 flex-col gap-3 p-[22px]">
                  <div className="font-mono text-[13px] text-body-mid">
                    {longDate(post.publishedAt)}
                    {post.town && ` · ${post.town}`}
                  </div>
                  <h2 className="font-display text-[clamp(22px,3vw,26px)] leading-[1.05] tracking-[-0.02em]">
                    {post.title}
                  </h2>
                  <p className="text-[16px] leading-[1.55] text-body-soft">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
