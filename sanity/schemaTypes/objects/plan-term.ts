import { defineField, defineType } from 'sanity'

/**
 * One committed term for one plan. Kept per-term even while all three
 * terms carry the same rate, so differentiating later is a content edit
 * rather than a schema migration.
 */
export const planTerm = defineType({
  name: 'planTerm',
  title: 'Term',
  type: 'object',
  fields: [
    defineField({
      name: 'months',
      title: 'Term length',
      type: 'number',
      options: {
        list: [
          { title: '3 months', value: 3 },
          { title: '6 months', value: 6 },
          { title: '12 months', value: 12 },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'monthlyPrice',
      title: 'Monthly price',
      description: 'Dollars per month on this term. Enter 39.95, not $39.95.',
      type: 'number',
      validation: (rule) => rule.required().positive().precision(2),
    }),
    defineField({
      name: 'signupUrl',
      title: 'Signup link (PushPress)',
      description:
        'Where the "Sign up online" button sends someone who picks this plan and term. Leave blank and the button is hidden rather than dead.',
      type: 'url',
      validation: (rule) => [
        rule
          .uri({ scheme: ['https'] })
          .error('Must be a full https:// link.'),
        rule
          .required()
          .warning('No signup link yet — this plan and term will not offer online signup.'),
      ],
    }),
  ],
  preview: {
    select: { months: 'months', price: 'monthlyPrice', url: 'signupUrl' },
    prepare({ months, price, url }) {
      return {
        title: `${months} months — $${price?.toFixed(2) ?? '?'}/mo`,
        subtitle: url ? 'Signup link set' : 'No signup link',
      }
    },
  },
})
