import { defineArrayMember, defineField, defineType } from 'sanity'
import { CreditCardIcon } from '@sanity/icons/CreditCard'

export const membershipPlan = defineType({
  name: 'membershipPlan',
  title: 'Membership plan',
  type: 'document',
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: 'location',
      title: 'Town',
      type: 'reference',
      to: [{ type: 'location' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tier',
      title: 'Who it covers',
      type: 'string',
      options: {
        list: [
          { title: 'Single', value: 'single' },
          { title: 'Couple or 2-person', value: 'couple' },
          { title: 'Family', value: 'family' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Name on the page',
      description: 'Exactly as it should read in the price table, e.g. "Couple or 2-person".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'joiningFee',
      title: 'One-time joining fee',
      description: 'Dollars. Enter 49, not $49.',
      type: 'number',
      validation: (rule) => rule.required().min(0).precision(2),
    }),
    defineField({
      name: 'features',
      title: 'What it includes',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'terms',
      title: 'Terms and prices',
      description: 'One entry per term length: 3, 6, and 12 months.',
      type: 'array',
      of: [defineArrayMember({ type: 'planTerm' })],
      validation: (rule) =>
        rule
          .required()
          .length(3)
          .error('Needs exactly three terms: 3, 6, and 12 months.')
          .custom((terms) => {
            const months = (terms as { months?: number }[] | undefined)?.map(
              (t) => t?.months,
            )
            if (!months) return true
            if (new Set(months).size !== months.length) {
              return 'Each term length can only appear once.'
            }
            return true
          }),
    }),
  ],
  preview: {
    select: { label: 'label', town: 'location.name' },
    prepare({ label, town }) {
      return { title: label || 'Plan', subtitle: town }
    },
  },
})
