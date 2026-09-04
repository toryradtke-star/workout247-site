function assertValue<T>(v: T | undefined, msg: string): T {
  if (v === undefined) throw new Error(msg)
  return v
}

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-09-04'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing NEXT_PUBLIC_SANITY_DATASET',
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing NEXT_PUBLIC_SANITY_PROJECT_ID',
)
