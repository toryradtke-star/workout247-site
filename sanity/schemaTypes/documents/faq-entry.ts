import { defineField, defineType } from 'sanity'
import { HelpCircleIcon } from '@sanity/icons/HelpCircle'

export const faqEntry = defineType({
  name: 'faqEntry',
  title: 'FAQ question',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'question',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Position in the list',
      description: 'Lower numbers show first.',
      type: 'number',
      validation: (rule) => rule.required().integer(),
    }),
  ],
  orderings: [
    {
      title: 'List order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'question', order: 'order' },
    prepare({ title, order }) {
      return { title, subtitle: `#${order ?? '?'}` }
    },
  },
})
