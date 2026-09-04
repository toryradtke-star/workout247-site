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
