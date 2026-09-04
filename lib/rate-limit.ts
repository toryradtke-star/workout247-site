import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const configured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
)

/**
 * Five submissions per hour per IP. Generous for a gym contact form and
 * still tight enough that a bot can't spray the owner's inbox.
 *
 * Serverless functions don't share memory, so this has to be backed by
 * Redis to mean anything. When Upstash isn't configured the limiter is
 * absent and requests are allowed through — a contact form that silently
 * drops every message would be worse than one without rate limiting, and
 * the honeypot still applies. `configured` is reported so the caller can
 * log the gap rather than hide it.
 */
const limiter = configured
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      prefix: 'contact-form',
      analytics: false,
    })
  : null

export async function checkRateLimit(identifier: string) {
  if (!limiter) return { allowed: true, configured: false }
  const { success } = await limiter.limit(identifier)
  return { allowed: success, configured: true }
}
