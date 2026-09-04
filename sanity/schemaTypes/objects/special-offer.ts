import { defineField, defineType } from 'sanity'

/**
 * Per-location special. Off for both towns at launch. When active, the
 * location page shows special single and couple prices with the standard
 * price struck through; family always shows the standard price.
 */
export const specialOffer = defineType({
  name: 'specialOffer',
  title: 'Special offer',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'isActive',
      title: 'Run this special',
      description: 'Off means the special section does not appear at all.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'note',
      title: 'Headline note',
      description: 'The line in the orange strip, e.g. "January only".',
      type: 'string',
      hidden: ({ parent }) => !parent?.isActive,
    }),
    defineField({
      name: 'singlePrice',
      title: 'Special single price',
      type: 'number',
      hidden: ({ parent }) => !parent?.isActive,
      validation: (rule) => rule.positive().precision(2),
    }),
    defineField({
      name: 'couplePrice',
      title: 'Special couple price',
      type: 'number',
      hidden: ({ parent }) => !parent?.isActive,
      validation: (rule) => rule.positive().precision(2),
    }),
    defineField({
      name: 'endDate',
      title: 'Last day of the offer',
      description:
        'Optional. After this date the special stops showing even if the toggle is still on.',
      type: 'date',
      hidden: ({ parent }) => !parent?.isActive,
    }),
  ],
})
