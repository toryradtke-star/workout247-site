/**
 * The design prints whole-dollar fees as "$49" and rates as "$39.95".
 * Prices are stored as numbers in Sanity so they stay editable and sortable.
 */
export function money(amount: number): string {
  return amount % 1 === 0 ? `$${amount}` : `$${amount.toFixed(2)}`
}

/** "October 5, 2026", pinned to Central time so the date never shifts a day. */
export function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Chicago',
  })
}
