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
