import type { SchemaTypeDefinition } from 'sanity'

import { faqEntry } from './documents/faq-entry'
import { location } from './documents/location'
import { membershipPlan } from './documents/membership-plan'
import { page } from './documents/page'
import { siteSettings } from './documents/site-settings'
import { faqOverride } from './objects/faq-override'
import { planTerm } from './objects/plan-term'
import { specialOffer } from './objects/special-offer'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  location,
  membershipPlan,
  faqEntry,
  page,
  siteSettings,
  // Objects
  planTerm,
  specialOffer,
  faqOverride,
]
