import type { StructureResolver } from 'sanity/structure'
import { CogIcon } from '@sanity/icons/Cog'

/**
 * Owner-facing Studio layout. Site settings is a singleton, so it opens
 * straight into the document instead of an empty list with a plus button.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Workout 24/7')
    .items([
      S.listItem()
        .title('Towns')
        .schemaType('location')
        .child(S.documentTypeList('location').title('Towns')),
      S.listItem()
        .title('Membership plans')
        .schemaType('membershipPlan')
        .child(S.documentTypeList('membershipPlan').title('Membership plans')),
      S.listItem()
        .title('FAQ')
        .schemaType('faqEntry')
        .child(
          S.documentTypeList('faqEntry')
            .title('FAQ')
            .defaultOrdering([{ field: 'order', direction: 'asc' }]),
        ),
      S.listItem()
        .title('Pages')
        .schemaType('page')
        .child(S.documentTypeList('page').title('Pages')),
      S.divider(),
      S.listItem()
        .title('Site settings')
        .icon(CogIcon)
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings'),
        ),
    ])
