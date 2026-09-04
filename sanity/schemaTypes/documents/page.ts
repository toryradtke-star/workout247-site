import { defineArrayMember, defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons/Document'
import { seoFields } from '../shared/seo-fields'

/** Backs /about and /contact. Section copy the design fixes stays in code. */
export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Internal name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: { source: 'title', maxLength: 40 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroHeading',
      title: 'Heading',
      description:
        'A trailing period renders orange, matching the design. Include it if you want it.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroLede',
      title: 'Opening paragraph',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading', value: 'h2' },
            { title: 'Subheading', value: 'h3' },
          ],
          lists: [{ title: 'Bullets', value: 'bullet' }],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
          },
        }),
      ],
    }),
    ...seoFields,
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
})
