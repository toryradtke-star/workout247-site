import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy | Workout 24/7',
  description:
    'What workout247fitness.com collects, why, and who sees it: the contact form, the email list and a first-party cookie.',
  alternates: { canonical: '/privacy' },
}

const UPDATED = 'October 27, 2026'

/**
 * Plain facts about what the site does with data. Keep it in step with the
 * contact form (/api/contact), wm.js (webcraft-mail) and the email list.
 */
export default function PrivacyPage() {
  return (
    <main className="font-sans text-ink">
      <section className="on-dark bg-ink text-white">
        <div className="mx-auto flex max-w-site flex-col gap-[18px] px-section-x py-[clamp(30px,5vw,60px)]">
          <h1 className="text-[clamp(36px,8vw,62px)] leading-[0.92] tracking-[-0.035em]">Privacy.</h1>
          <p className="max-w-[50ch] text-lede leading-[1.55] text-ondark-100">Updated {UPDATED}.</p>
        </div>
      </section>

      <section className="mx-auto flex max-w-[760px] flex-col gap-5 px-section-x py-[clamp(32px,5vw,64px)] text-[17px] leading-[1.65] text-body">
        <h2 className="text-[24px] font-extrabold text-ink">The contact form</h2>
        <p>
          When you send a message, your name, phone or email, town and message are emailed to the
          gym so we can answer you. They are also saved in our customer list (run for us by our web
          developer, Webcraft) so we can keep track of the conversation. We use them only to reply
          to you. Your IP address is checked briefly to stop spam floods and isn&rsquo;t kept with
          your message.
        </p>

        <h2 className="text-[24px] font-extrabold text-ink">The email list</h2>
        <p>
          If you sign up for gym news, we keep your email address and the time and page where you
          signed up. Every email has a one-click unsubscribe, and unsubscribing is honored for good.
        </p>

        <h2 className="text-[24px] font-extrabold text-ink">Cookies and page views</h2>
        <p>
          The site runs no ad pixels or third-party analytics. It sets one first-party cookie
          (<code>wm_id</code>) with a random ID and records which pages that browser views. That ID
          isn&rsquo;t tied to you unless you sign up or send us a message. If your browser sends
          Global Privacy Control, page views aren&rsquo;t recorded at all.
        </p>

        <h2 className="text-[24px] font-extrabold text-ink">Who sees it</h2>
        <p>
          The gym and Webcraft, who runs the site and the customer list. It is stored with Vercel,
          Neon and Resend (our email service), never sold, and never shared with anyone else. Ask
          at either gym and we&rsquo;ll delete what we have about you.
        </p>
      </section>
    </main>
  )
}
