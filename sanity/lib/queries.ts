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

export const LOCATION_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "location" && defined(slug.current)].slug.current
`)

export const LOCATION_QUERY = defineQuery(/* groq */ `{
  "location": *[_type == "location" && slug.current == $slug][0]{
    name,
    "slug": slug.current,
    streetAddress,
    cityStateZip,
    phoneDisplay,
    phoneTel,
    mapUrl,
    geo,
    priceHeading,
    intro,
    equipment,
    maintenanceNote,
    heroPhoto,
    floorPhotoPrimary,
    floorPhotoSecondary,
    specialOffer,
    metaTitle,
    metaDescription,
    "plans": *[_type == "membershipPlan" && location._ref == ^._id]{
      tier,
      label,
      joiningFee,
      terms[]{ _key, months, monthlyPrice, signupUrl }
    },
    "faqOverrides": faqOverrides[]{ _key, "entryId": entry._ref, answer }
  },
  "other": *[_type == "location" && slug.current != $slug][0]{
    name,
    "slug": slug.current,
    "singlePrice": math::min(
      *[_type == "membershipPlan" && location._ref == ^._id && tier == "single"][0].terms[].monthlyPrice
    )
  },
  "faq": *[_type == "faqEntry"] | order(order asc){ _id, question, answer, order },
  "settings": *[_id == "siteSettings"][0]{
    termsIntro,
    terms[]{ _key, months, blurb, isRecommended, kicker },
    replacementKeyFee,
    militaryDiscountPercent,
    militaryDiscountTerms
  }
}`)

export const ABOUT_QUERY = defineQuery(/* groq */ `{
  "page": *[_type == "page" && slug.current == "about"][0]{
    heroHeading, heroLede, body, metaTitle, metaDescription
  },
  "locations": *[_type == "location"] | order(displayOrder asc){
    name,
    "slug": slug.current,
    aboutBlurb,
    floorPhotoPrimary,
    floorPhotoSecondary
  }
}`)

export const CONTACT_QUERY = defineQuery(/* groq */ `{
  "page": *[_type == "page" && slug.current == "contact"][0]{
    heroHeading, heroLede, body, metaTitle, metaDescription
  },
  "locations": *[_type == "location"] | order(displayOrder asc){
    name,
    "slug": slug.current,
    streetAddress,
    cityStateZip,
    phoneDisplay,
    phoneTel,
    mapUrl
  }
}`)
