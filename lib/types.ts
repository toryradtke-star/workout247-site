/** Shape the header and footer need. Filled from Sanity in the page layer. */
export type LocationSummary = {
  name: string
  slug: string
  streetAddress: string
  cityStateZip: string
  phoneDisplay: string
  phoneTel: string
  mapUrl: string
  /** Lowest monthly price, preformatted, e.g. "$39.95". */
  fromPrice: string
}

export type FooterSettings = {
  militaryDiscountPercent: number
  footerNote: string
  copyrightName: string
}
