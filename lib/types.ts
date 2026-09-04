export type SanityImageValue = {
  asset?: { _ref: string; _type: 'reference' }
  alt?: string
  hotspot?: { x: number; y: number; height: number; width: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}

export type LocationSummary = {
  name: string
  slug: string
  streetAddress: string
  cityStateZip: string
  phoneDisplay: string
  phoneTel: string
  mapUrl: string
  /** Lowest monthly rate on the single membership, in dollars. */
  singlePrice: number
}

export type FooterSettings = {
  militaryDiscountPercent: number
  footerNote: string
  copyrightName: string
}

export type SiteData = {
  locations: LocationSummary[]
  settings: FooterSettings & {
    militaryDiscountTerms: string
    replacementKeyFee: number
  }
}

export type HomeData = {
  locations: LocationSummary[]
  settings: { militaryDiscountPercent: number; militaryDiscountTerms: string }
  joiningFeeSingle: number
  joiningFeeCouple: number
  photos: {
    heroPhoto: SanityImageValue
    floorPhotoPrimary: SanityImageValue
    floorPhotoSecondary: SanityImageValue
  } | null
}

export type PlanTerm = {
  _key: string
  months: number
  monthlyPrice: number
  signupUrl?: string
}

export type MembershipPlan = {
  tier: 'single' | 'couple' | 'family'
  label: string
  joiningFee: number
  terms: PlanTerm[]
}

export type TermOption = {
  _key: string
  months: number
  blurb?: string
  isRecommended?: boolean
  kicker?: string
}

export type FaqEntry = {
  _id: string
  question: string
  answer: string
  order: number
}

export type SpecialOffer = {
  isActive?: boolean
  note?: string
  singlePrice?: number
  couplePrice?: number
  endDate?: string
}

export type LocationDetail = {
  name: string
  slug: string
  streetAddress: string
  cityStateZip: string
  phoneDisplay: string
  phoneTel: string
  mapUrl: string
  geo?: { lat: number; lng: number }
  priceHeading: string
  intro: string
  equipment: string[]
  maintenanceNote?: string
  heroPhoto: SanityImageValue
  floorPhotoPrimary: SanityImageValue
  floorPhotoSecondary: SanityImageValue
  specialOffer?: SpecialOffer
  metaTitle?: string
  metaDescription?: string
  plans: MembershipPlan[]
  faqOverrides?: { _key: string; entryId: string; answer: string }[]
}

export type LocationPageData = {
  location: LocationDetail | null
  other: { name: string; slug: string; singlePrice: number } | null
  faq: FaqEntry[]
  settings: {
    termsIntro?: string
    terms?: TermOption[]
    replacementKeyFee: number
    militaryDiscountPercent: number
    militaryDiscountTerms: string
  }
}

export type PageDoc = {
  heroHeading: string
  heroLede?: string
  body?: unknown[]
  metaTitle?: string
  metaDescription?: string
}
