import { defineField, defineType } from 'sanity'
import { PinIcon } from '@sanity/icons/Pin'
import { seoFields } from '../shared/seo-fields'

export const location = defineType({
  name: 'location',
  title: 'Location',
  type: 'document',
  icon: PinIcon,
  groups: [
    { name: 'details', title: 'Details', default: true },
    { name: 'photos', title: 'Photos' },
    { name: 'floor', title: 'On the floor' },
    { name: 'special', title: 'Special offer' },
    { name: 'seo', title: 'Search' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Town',
      type: 'string',
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      description: 'Becomes /wells or /osakis. Changing this breaks existing links.',
      type: 'slug',
      group: 'details',
      options: { source: 'name', maxLength: 40 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'streetAddress',
      title: 'Street address',
      type: 'string',
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cityStateZip',
      title: 'City, state, ZIP',
      type: 'string',
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phoneDisplay',
      title: 'Phone (as shown)',
      description: 'Exactly how it should read on the page, e.g. (507) 553-3211',
      type: 'string',
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phoneTel',
      title: 'Phone (for tap-to-call)',
      description: 'Digits only with country code, e.g. +15075533211',
      type: 'string',
      group: 'details',
      validation: (rule) =>
        rule
          .required()
          .regex(/^\+1\d{10}$/, {
            name: 'E.164 US number',
            invert: false,
          })
          .error('Must look like +15075533211 — a plus, a 1, then ten digits.'),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Where contact-form messages go',
      description: 'Messages from visitors who pick this town are emailed here.',
      type: 'string',
      group: 'details',
      validation: (rule) =>
        rule.required().email().error('Needs to be a working email address.'),
    }),
    defineField({
      name: 'mapUrl',
      title: 'Google Maps link',
      type: 'url',
      group: 'details',
      validation: (rule) => rule.required().uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'geo',
      title: 'Map coordinates',
      description:
        'Used by search engines to place the gym on a map. Drop the pin on the building.',
      type: 'geopoint',
      group: 'details',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'heroPhoto',
      title: 'Hero photo',
      description: 'Top of the town page, beside the address.',
      type: 'image',
      group: 'photos',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Describe the photo',
          type: 'string',
          validation: (rule) =>
            rule.required().error('Needed so screen readers can describe it.'),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'floorPhotoPrimary',
      title: 'Floor photo — main',
      description: 'Upper photo in the "What’s on the floor" section.',
      type: 'image',
      group: 'photos',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Describe the photo',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'floorPhotoSecondary',
      title: 'Floor photo — wide',
      description: 'Lower, wider photo in the same section.',
      type: 'image',
      group: 'photos',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Describe the photo',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'equipment',
      title: 'Equipment list',
      description: 'One line each, as shown on the town page.',
      type: 'array',
      group: 'floor',
      of: [{ type: 'string' }],
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: 'maintenanceNote',
      title: 'Maintenance line',
      description: 'The line under the equipment list.',
      type: 'text',
      rows: 2,
      group: 'floor',
    }),
    defineField({
      name: 'faqOverrides',
      title: 'Answers that differ in this town',
      description:
        'Leave empty and this town uses the shared answers. Add an entry only to change one.',
      type: 'array',
      group: 'floor',
      of: [{ type: 'faqOverride' }],
    }),

    defineField({
      name: 'specialOffer',
      title: 'Special offer',
      type: 'specialOffer',
      group: 'special',
    }),

    ...seoFields.map((f) => ({ ...f, group: 'seo' })),
  ],
  preview: {
    select: { title: 'name', subtitle: 'cityStateZip', media: 'heroPhoto' },
  },
})
