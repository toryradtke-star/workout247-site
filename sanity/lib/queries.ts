import { defineQuery } from 'next-sanity'

/**
 * Shared shape for anywhere both towns are listed. `singlePrice` is the
 * lowest monthly rate on that town's single membership, so the figure on
 * the header, footer, and town cards can never drift from the plan data.
 */
const LOCATION_SUMMARY = /* groq */ `
  name,
  "slug": slug.current,
  streetAddress,
  cityStateZip,
  phoneDisplay,
  phoneTel,
  mapUrl,
  "singlePrice": math::min(
    *[_type == "membershipPlan" && location._ref == ^._id && tier == "single"][0].terms[].monthlyPrice
  )
`

export const SITE_QUERY = defineQuery(/* groq */ `{
  "locations": *[_type == "location"] | order(displayOrder asc){ ${LOCATION_SUMMARY} },
  "settings": *[_id == "siteSettings"][0]{
    militaryDiscountPercent,
    militaryDiscountTerms,
    footerNote,
    copyrightName,
    replacementKeyFee
  }
}`)

export const HOME_QUERY = defineQuery(/* groq */ `{
  "locations": *[_type == "location"] | order(displayOrder asc){ ${LOCATION_SUMMARY} },
  "settings": *[_id == "siteSettings"][0]{
    militaryDiscountPercent,
    militaryDiscountTerms
  },
  "joiningFeeSingle": *[_type == "membershipPlan" && tier == "single"][0].joiningFee,
  "joiningFeeCouple": *[_type == "membershipPlan" && tier == "couple"][0].joiningFee,
  "photos": *[_type == "location" && slug.current == "osakis"][0]{
    heroPhoto,
    floorPhotoPrimary,
    floorPhotoSecondary
  }
}`)
