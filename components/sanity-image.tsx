import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'
import type { SanityImageValue } from '@/lib/types'

type Props = {
  value?: SanityImageValue | null
  width: number
  height: number
  className?: string
  sizes?: string
  priority?: boolean
}

/**
 * Renders a Sanity image through next/image. The crop is resolved on
 * Sanity's CDN using the hotspot the owner set, which matters because every
 * photo is a portrait original going into a landscape slot.
 */
export function SanityImage({
  value,
  width,
  height,
  className,
  sizes,
  priority,
}: Props) {
  if (!value?.asset?._ref) return null

  return (
    <Image
      src={urlForImage(value).width(width).height(height).url()}
      alt={value.alt ?? ''}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
    />
  )
}
