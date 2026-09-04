import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

type WebhookPayload = { tags?: string[] }

/**
 * Sanity webhook target. Publishing an edit purges only the tags for the
 * documents that changed, so the owner sees price and copy changes without
 * a redeploy. Configure in sanity.io/manage with the GROQ projection:
 *   { "tags": [_type, _type + ":" + slug.current] }
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      // Wait for the Sanity CDN to catch up before purging.
      true,
    )

    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 })
    }

    const tags = body?.tags?.filter(Boolean)
    if (!tags?.length) {
      return new Response('No tags in payload', { status: 400 })
    }

    // Next 16 requires a cache profile; expire: 0 purges immediately.
    for (const tag of tags) revalidateTag(tag, { expire: 0 })

    return NextResponse.json({ revalidated: tags })
  } catch (err) {
    return new Response((err as Error).message, { status: 500 })
  }
}
