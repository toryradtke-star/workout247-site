import { defineArrayMember, defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons/Cog'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'brand', title: 'Logos', default: true },
    { name: 'announcement', title: 'Announcement bar' },
    { name: 'fees', title: 'Fees' },
    { name: 'terms', title: 'Terms' },
    { name: 'military', title: 'Military discount' },
    { name: 'footer', title: 'Footer' },
  ],
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo (for the white header)',
      type: 'image',
      group: 'brand',
    }),
    defineField({
      name: 'logoLight',
      title: 'Logo (for the dark footer)',
      description: 'The light version. Keep the transparent background.',
      type: 'image',
      group: 'brand',
    }),

    defineField({
      name: 'announcement',
      title: 'Announcement bar',
      type: 'object',
      group: 'announcement',
      fields: [
        defineField({
          name: 'isActive',
          title: 'Show the bar',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'text',
          type: 'string',
          hidden: ({ parent }) => !parent?.isActive,
        }),
        defineField({
          name: 'href',
          title: 'Link (optional)',
          type: 'string',
          hidden: ({ parent }) => !parent?.isActive,
        }),
      ],
    }),

    defineField({
      name: 'termsIntro',
      title: 'Term section intro',
      description: 'The paragraph under the "Pick a term" heading.',
      type: 'text',
      rows: 3,
      group: 'terms',
    }),
    defineField({
      name: 'terms',
      title: 'Term options',
      description:
        'The three term cards. Every claim here has to be true for both towns — the same wording shows on both.',
      type: 'array',
      group: 'terms',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'termOption',
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
              name: 'blurb',
              title: 'Description',
              description:
                'Only claims that are actually true of this term. Leave blank and the card shows the term length alone.',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'isRecommended',
              title: 'Highlight this one',
              description: 'Gives the card the orange treatment. Use on one term only.',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'kicker',
              title: 'Kicker above the term length',
              description:
                'e.g. "MOST MEMBERS PICK THIS". Only shows on the highlighted card, and only if it is true. Leave blank to hide it.',
              type: 'string',
              hidden: ({ parent }) => !parent?.isRecommended,
            }),
          ],
          preview: {
            select: { months: 'months', blurb: 'blurb' },
            prepare({ months, blurb }) {
              return {
                title: `${months} months`,
                subtitle: blurb || 'No description yet',
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.length(3).warning('Expected three terms: 3, 6, and 12 months.'),
    }),
    defineField({
      name: 'replacementKeyFee',
      title: 'Extra or replacement key ($)',
      description: 'Shown as a fee line on both town pages. Enter 20, not $20.',
      type: 'number',
      group: 'fees',
      validation: (rule) => rule.required().min(0).precision(2),
    }),
    defineField({
      name: 'militaryDiscountPercent',
      title: 'Military discount (%)',
      type: 'number',
      group: 'military',
      validation: (rule) => rule.required().min(0).max(100),
    }),
    defineField({
      name: 'militaryDiscountTerms',
      title: 'Military discount wording',
      description: 'The explanatory paragraph in the orange-on-black band.',
      type: 'text',
      rows: 3,
      group: 'military',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'footerNote',
      title: 'Footer line',
      description: 'e.g. "Independently owned. Two towns in Minnesota."',
      type: 'string',
      group: 'footer',
    }),
    defineField({
      name: 'copyrightName',
      title: 'Copyright name',
      description: 'The year is added automatically.',
      type: 'string',
      group: 'footer',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      group: 'footer',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'Instagram', value: 'instagram' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              type: 'url',
              validation: (rule) => rule.required().uri({ scheme: ['https'] }),
            }),
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
})
