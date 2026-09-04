import { defineField, defineType } from 'sanity'

/** Replaces one shared FAQ answer for a single town. */
export const faqOverride = defineType({
  name: 'faqOverride',
  title: 'FAQ override',
  type: 'object',
  fields: [
    defineField({
      name: 'entry',
      title: 'Which question',
      type: 'reference',
      to: [{ type: 'faqEntry' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer for this town',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { question: 'entry.question' },
    prepare({ question }) {
      return { title: question || 'Override' }
    },
  },
})
