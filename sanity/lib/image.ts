import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'
import { dataset, projectId } from '../env'

const builder = createImageUrlBuilder({ projectId, dataset })

/**
 * All six owner-supplied photos are portrait originals placed into
 * landscape slots, so every crop goes through the hotspot the owner
 * sets in the Studio rather than a centre crop.
 */
export function urlForImage(source: Image) {
  return builder.image(source).auto('format').fit('crop').crop('focalpoint')
}
