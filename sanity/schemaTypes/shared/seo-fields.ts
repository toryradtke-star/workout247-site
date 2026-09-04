import { defineField } from 'sanity'

/**
 * Per-route metadata. The brief forbids boilerplate shared between the
 * two location pages, so these are required on Location documents.
 */
export const seoFields = [
  defineField({
    name: 'metaTitle',
    title: 'Page title (search results / browser tab)',
    type: 'string',
    validation: (rule) =>
      rule.max(60).warning('Over 60 characters usually gets truncated in Google.'),
  }),
  defineField({
    name: 'metaDescription',
    title: 'Search description',
    type: 'text',
    rows: 3,
    validation: (rule) =>
      rule.max(155).warning('Over 155 characters usually gets truncated in Google.'),
  }),
  defineField({
    name: 'ogImage',
    title: 'Share image',
    description: 'Shown when the page is linked on Facebook or in a text message.',
    type: 'image',
    options: { hotspot: true },
  }),
]
